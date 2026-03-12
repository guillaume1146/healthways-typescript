// ─── Document Verification via Groq VLM (Llama 4 Scout) ─────────────────────
// Uses a Vision-Language Model instead of traditional OCR (Tesseract) for:
// - Spatial awareness (understands document layout)
// - Better accuracy on rotated/shadowed/complex documents
// - Structured JSON extraction from the model
// - Support for all image formats and PDFs

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
  method: 'vlm' | 'pdf-text' | 'vlm-fallback'
  extractedTextPreview: string
}

// ─── Text Normalization (kept for PDF text fallback) ─────────────────────────

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ─── Name Matching (used for PDF text extraction path) ───────────────────────

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

export function matchName(
  fullName: string,
  ocrText: string
): { nameFound: boolean; confidence: number; details: MatchDetails } {
  const normalizedText = normalize(ocrText)
  const nameParts = normalize(fullName)
    .split(' ')
    .filter((p) => p.length >= 2)

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
    if (normalizedText.includes(part)) found = true
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
    if (found) foundParts.push(part)
    else missingParts.push(part)
  }

  const confidence = Math.round((foundParts.length / nameParts.length) * 100)
  return {
    nameFound: missingParts.length === 0,
    confidence,
    details: { searchedParts: nameParts, foundParts, missingParts },
  }
}

// ─── Groq VLM Verification ───────────────────────────────────────────────────

interface GroqVLMResponse {
  name_found: boolean
  confidence: number
  extracted_name: string
  found_parts: string[]
  missing_parts: string[]
  document_type_detected: string
  reasoning: string
}

/**
 * Convert a buffer to a base64 data URL for the Groq VLM API.
 */
function bufferToBase64DataUrl(buffer: Buffer, mimeType: string): string {
  const base64 = buffer.toString('base64')
  return `data:${mimeType};base64,${base64}`
}

/**
 * Verify a document using Groq's Llama 4 Scout VLM.
 * The model analyzes the image/document visually and checks if the given name appears.
 */
async function verifyWithVLM(
  base64DataUrl: string,
  fullName: string,
  documentType: string
): Promise<GroqVLMResponse | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.error('GROQ_API_KEY not set — cannot use VLM verification')
    return null
  }

  const nameParts = fullName.trim().split(/\s+/)

  const prompt = `You are a document verification assistant. Analyze this document image and verify if the person's name appears in it.

Person's full name to verify: "${fullName}"
Name parts to search for: ${JSON.stringify(nameParts)}
Expected document type: "${documentType}"

Instructions:
1. Look at the entire document carefully — examine all text, headers, fields, stamps, and signatures.
2. Check if the name "${fullName}" (or close variations) appears anywhere in the document.
3. For each part of the name (${nameParts.join(', ')}), determine if it is present.
4. Assess your confidence (0-100) that this document belongs to the named person.
5. Identify what type of document this appears to be.

Respond ONLY with a valid JSON object (no markdown, no code blocks):
{
  "name_found": true/false,
  "confidence": 0-100,
  "extracted_name": "the name as it appears in the document, or empty string if not found",
  "found_parts": ["list", "of", "found", "name", "parts"],
  "missing_parts": ["list", "of", "missing", "name", "parts"],
  "document_type_detected": "e.g. National ID, Passport, Medical License, etc.",
  "reasoning": "brief explanation of how you verified"
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: { url: base64DataUrl },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_completion_tokens: 512,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Groq VLM API error:', response.status, errorBody)
      return null
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return null

    const parsed = JSON.parse(content) as GroqVLMResponse
    return parsed
  } catch (err) {
    console.error('Groq VLM verification failed:', err)
    return null
  }
}

// ─── PDF Text Extraction (kept as fast path for text-based PDFs) ─────────────

async function extractPdfText(buffer: Buffer): Promise<string | null> {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const uint8 = new Uint8Array(buffer)
    const doc = await pdfjsLib.getDocument({ data: uint8 }).promise
    let fullText = ''
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items
        .map((item) => ('str' in item ? item.str : '') || '')
        .join(' ')
      fullText += pageText + '\n'
    }
    const text = fullText.trim()
    return text.length > 10 ? text : null
  } catch {
    return null
  }
}

// ─── Convert PDF first page to image for VLM ────────────────────────────────

/**
 * For PDFs, we extract the first page as an image for VLM analysis.
 * If pdfjs can render to canvas, we use that. Otherwise we send the raw PDF
 * and let the VLM handle it (Llama 4 Scout can process some PDF layouts).
 */

// ─── Main Verification Function ──────────────────────────────────────────────

/**
 * Verify a document using Groq VLM (primary) with PDF text extraction fallback.
 *
 * Flow:
 * 1. For PDFs with embedded text → extract text, match name (fast path)
 * 2. For images (PNG, JPG, WEBP, etc.) → send to Groq VLM for visual analysis
 * 3. For scanned PDFs (no text) → send to Groq VLM
 * 4. If VLM fails → return graceful failure
 */
export async function verifyDocument(
  buffer: Buffer,
  mimeType: string,
  fullName: string,
  documentType: string = 'identity document'
): Promise<VerificationResult> {
  const nameParts = normalize(fullName)
    .split(' ')
    .filter((p) => p.length >= 2)

  const emptyResult: VerificationResult = {
    success: false,
    confidence: 0,
    nameFound: false,
    matchDetails: { searchedParts: nameParts, foundParts: [], missingParts: nameParts },
    method: 'vlm',
    extractedTextPreview: '(verification unavailable)',
  }

  // ── Fast path: PDF with embedded text ────────────────────────────────────
  if (mimeType === 'application/pdf') {
    const pdfText = await extractPdfText(buffer)
    if (pdfText) {
      const { nameFound, confidence, details } = matchName(fullName, pdfText)
      return {
        success: nameFound,
        confidence,
        nameFound,
        matchDetails: details,
        method: 'pdf-text',
        extractedTextPreview: pdfText.slice(0, 200),
      }
    }
    // Scanned PDF — no text, will try VLM below
  }

  // ── VLM path: send image to Groq Llama 4 Scout ──────────────────────────
  // Ensure buffer is under 4MB for Groq's base64 limit
  if (buffer.length > 4 * 1024 * 1024) {
    return {
      ...emptyResult,
      extractedTextPreview: '(file too large for VLM analysis — max 4MB)',
    }
  }

  // For scanned PDFs, we can't send PDF directly as image — return graceful failure
  if (mimeType === 'application/pdf') {
    return {
      ...emptyResult,
      method: 'vlm-fallback',
      extractedTextPreview: '(scanned PDF — manual review required)',
    }
  }

  const base64DataUrl = bufferToBase64DataUrl(buffer, mimeType)
  const vlmResult = await verifyWithVLM(base64DataUrl, fullName, documentType)

  if (!vlmResult) {
    return {
      ...emptyResult,
      method: 'vlm-fallback',
      extractedTextPreview: '(VLM service unavailable — manual review required)',
    }
  }

  return {
    success: vlmResult.name_found && vlmResult.confidence >= 70,
    confidence: vlmResult.confidence,
    nameFound: vlmResult.name_found,
    matchDetails: {
      searchedParts: nameParts,
      foundParts: vlmResult.found_parts.map((p) => normalize(p)),
      missingParts: vlmResult.missing_parts.map((p) => normalize(p)),
    },
    method: 'vlm',
    extractedTextPreview: vlmResult.extracted_name
      ? `Name: ${vlmResult.extracted_name} | Doc: ${vlmResult.document_type_detected} | ${vlmResult.reasoning}`
      : `Doc: ${vlmResult.document_type_detected} | ${vlmResult.reasoning}`,
  }
}
