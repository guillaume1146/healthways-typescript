import Tesseract from 'tesseract.js'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MatchDetails {
  searchedParts: string[]
  foundParts: string[]
  missingParts: string[]
}

export interface VerificationResult {
  success: boolean
  confidence: number
  nameFound: boolean
  matchDetails: MatchDetails
  method: 'pdf-text' | 'ocr'
  extractedTextPreview: string
}

// ─── Text Normalization ───────────────────────────────────────────────────────

/**
 * Normalize text for comparison: lowercase, remove diacritics, strip non-alphanumeric.
 */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ─── Levenshtein Distance ─────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  return matrix[b.length][a.length]
}

// ─── OCR Error Substitution ───────────────────────────────────────────────────

const OCR_SUBSTITUTIONS: [string, string][] = [
  ['l', '1'], ['o', '0'], ['rn', 'm'], ['cl', 'd'],
  ['vv', 'w'], ['ii', 'u'],
]

/**
 * Generate variants of a string with common OCR misread substitutions.
 */
function generateOcrVariants(word: string): string[] {
  const variants = [word]
  for (const [from, to] of OCR_SUBSTITUTIONS) {
    if (word.includes(from)) variants.push(word.replace(from, to))
    if (word.includes(to)) variants.push(word.replace(to, from))
  }
  return [...new Set(variants)]
}

// ─── Name Matching ────────────────────────────────────────────────────────────

/**
 * Fuzzy match a user's full name against OCR-extracted text.
 */
export function matchName(
  fullName: string,
  ocrText: string
): { nameFound: boolean; confidence: number; details: MatchDetails } {
  const normalizedText = normalize(ocrText)
  const nameParts = normalize(fullName)
    .split(' ')
    .filter((p) => p.length >= 2) // Skip single-letter initials

  if (nameParts.length === 0) {
    return {
      nameFound: false,
      confidence: 0,
      details: { searchedParts: [], foundParts: [], missingParts: [] },
    }
  }

  const ocrWords = normalizedText.split(' ').filter((w) => w.length >= 2)
  const foundParts: string[] = []
  const missingParts: string[] = []

  for (const part of nameParts) {
    let found = false

    // 1. Direct substring search
    if (normalizedText.includes(part)) {
      found = true
    }

    // 2. Try OCR substitution variants
    if (!found) {
      const variants = generateOcrVariants(part)
      for (const variant of variants) {
        if (normalizedText.includes(variant)) {
          found = true
          break
        }
      }
    }

    // 3. Levenshtein distance against each word in OCR text
    if (!found) {
      const maxDistance = part.length <= 4 ? 1 : 2
      for (const word of ocrWords) {
        if (Math.abs(word.length - part.length) > maxDistance) continue
        if (levenshtein(part, word) <= maxDistance) {
          found = true
          break
        }
      }
    }

    if (found) {
      foundParts.push(part)
    } else {
      missingParts.push(part)
    }
  }

  const confidence = Math.round((foundParts.length / nameParts.length) * 100)
  const nameFound = missingParts.length === 0

  return {
    nameFound,
    confidence,
    details: { searchedParts: nameParts, foundParts, missingParts },
  }
}

// ─── Text Extraction ──────────────────────────────────────────────────────────

/**
 * Extract text from a file buffer (PDF or image).
 */
export async function extractText(
  buffer: Buffer,
  mimeType: string
): Promise<{ text: string; method: 'pdf-text' | 'ocr' }> {
  // PDF: try text extraction first using pdfjs-dist
  if (mimeType === 'application/pdf') {
    try {
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
      const uint8 = new Uint8Array(buffer)
      const doc = await pdfjsLib.getDocument({ data: uint8 }).promise
      let fullText = ''
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i)
        const content = await page.getTextContent()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageText = content.items
          .map((item: any) => item.str || '')
          .join(' ')
        fullText += pageText + '\n'
      }
      const text = fullText.trim()
      if (text.length > 10) {
        return { text, method: 'pdf-text' }
      }
      // PDF has no extractable text (scanned document) — fall through to OCR
    } catch (err) {
      console.error('PDF text extraction failed:', err)
      // PDF extraction failed — fall through to OCR
    }
  }

  // OCR with Tesseract.js
  const worker = await Tesseract.createWorker('eng+fra')

  try {
    // For PDFs without text, we need to convert to image first.
    // Tesseract.js can't process PDF directly, so for scanned PDFs
    // we'll just attempt OCR on the raw buffer (works for images).
    if (mimeType === 'application/pdf') {
      // Scanned PDF — Tesseract.js can't handle this directly
      // Return empty and let verification fail gracefully
      await worker.terminate()
      return { text: '', method: 'ocr' }
    }

    const { data } = await worker.recognize(buffer)
    return { text: data.text || '', method: 'ocr' }
  } finally {
    await worker.terminate()
  }
}

// ─── Main Verification Function ───────────────────────────────────────────────

/**
 * Extract text from a document and verify that the user's name appears in it.
 */
export async function verifyDocument(
  buffer: Buffer,
  mimeType: string,
  fullName: string
): Promise<VerificationResult> {
  const { text, method } = await extractText(buffer, mimeType)

  if (!text || text.trim().length < 5) {
    return {
      success: false,
      confidence: 0,
      nameFound: false,
      matchDetails: {
        searchedParts: normalize(fullName).split(' ').filter((p) => p.length >= 2),
        foundParts: [],
        missingParts: normalize(fullName).split(' ').filter((p) => p.length >= 2),
      },
      method,
      extractedTextPreview: text ? text.slice(0, 200) : '(no text extracted)',
    }
  }

  const { nameFound, confidence, details } = matchName(fullName, text)

  return {
    success: nameFound,
    confidence,
    nameFound,
    matchDetails: details,
    method,
    extractedTextPreview: text.slice(0, 200),
  }
}
