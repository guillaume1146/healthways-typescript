// ─── Document Verification via Groq LLM / VLM ───────────────────────────────
// ALL verification is done by the AI model — no regex, no manual name matching.
//
// - Images (PNG, JPG, WEBP, etc.) → VLM (Llama 4 Scout) analyzes visually
// - PDFs → extract text via pdfjs-dist → send text to LLM for analysis
// - Word docs (.docx) → extract text via mammoth → send text to LLM for analysis
// - Scanned PDFs (no text) → fallback to manual review

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
  method: 'vlm' | 'llm-text' | 'fallback'
  extractedTextPreview: string
}

// ─── Groq API Response ───────────────────────────────────────────────────────

interface GroqVerificationResponse {
  name_found: boolean
  confidence: number
  extracted_name: string
  found_parts: string[]
  missing_parts: string[]
  document_type_detected: string
  reasoning: string
}

// ─── Verification Prompt (shared between VLM and LLM) ───────────────────────

function buildVerificationPrompt(fullName: string, documentType: string): string {
  const nameParts = fullName.trim().split(/\s+/)
  return `You are a document verification assistant. Your task is to verify if a person's name appears in a document.

Person's full name to verify: "${fullName}"
Name parts to search for: ${JSON.stringify(nameParts)}
Expected document type: "${documentType}"

Instructions:
1. Examine all text, headers, fields, stamps, signatures, and any visible content.
2. Check if the name "${fullName}" (or close variations, misspellings, different orderings) appears.
3. For each part of the name (${nameParts.join(', ')}), determine if it is present.
4. Assess your confidence (0-100) that this document belongs to or references the named person.
5. Identify what type of document this appears to be.
6. Be lenient with minor spelling differences, accent marks, or character variations.

Respond ONLY with a valid JSON object (no markdown, no code blocks, no extra text):
{
  "name_found": true or false,
  "confidence": number between 0 and 100,
  "extracted_name": "the name as it appears in the document, or empty string if not found",
  "found_parts": ["list", "of", "found", "name", "parts"],
  "missing_parts": ["list", "of", "missing", "name", "parts"],
  "document_type_detected": "e.g. National ID, Passport, Medical License, Business Plan, etc.",
  "reasoning": "brief explanation of how you verified"
}`
}

// ─── VLM: Verify image documents visually ────────────────────────────────────

async function verifyImageWithVLM(
  buffer: Buffer,
  mimeType: string,
  fullName: string,
  documentType: string
): Promise<GroqVerificationResponse | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.error('GROQ_API_KEY not set — VLM verification unavailable')
    return null
  }

  // Base64 encode (Groq limit ~4MB for encoded images)
  if (buffer.length > 4 * 1024 * 1024) {
    console.error('Image too large for VLM (>4MB)')
    return null
  }

  const base64 = buffer.toString('base64')
  const dataUrl = `data:${mimeType};base64,${base64}`
  const prompt = buildVerificationPrompt(fullName, documentType)

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        }],
        temperature: 0.1,
        max_completion_tokens: 512,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq VLM error:', response.status, err)
      return null
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return null

    return JSON.parse(content) as GroqVerificationResponse
  } catch (err) {
    console.error('VLM verification failed:', err)
    return null
  }
}

// ─── LLM: Verify text-based documents ────────────────────────────────────────

async function verifyTextWithLLM(
  extractedText: string,
  fullName: string,
  documentType: string
): Promise<GroqVerificationResponse | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.error('GROQ_API_KEY not set — LLM verification unavailable')
    return null
  }

  const prompt = buildVerificationPrompt(fullName, documentType)
  const textSnippet = extractedText.slice(0, 3000) // Limit text to avoid token overflow

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{
          role: 'user',
          content: `${prompt}\n\nHere is the extracted text from the document:\n---\n${textSnippet}\n---`,
        }],
        temperature: 0.1,
        max_completion_tokens: 512,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq LLM error:', response.status, err)
      return null
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return null

    return JSON.parse(content) as GroqVerificationResponse
  } catch (err) {
    console.error('LLM text verification failed:', err)
    return null
  }
}

// ─── Text Extraction: PDF ────────────────────────────────────────────────────

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

// ─── Text Extraction: Word (.docx) ──────────────────────────────────────────

async function extractWordText(buffer: Buffer): Promise<string | null> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    const text = result.value?.trim()
    return text && text.length > 10 ? text : null
  } catch {
    return null
  }
}

// ─── Build result from Groq response ─────────────────────────────────────────

function buildResult(
  groqResult: GroqVerificationResponse,
  method: 'vlm' | 'llm-text',
  nameParts: string[]
): VerificationResult {
  return {
    success: groqResult.name_found && groqResult.confidence >= 70,
    confidence: groqResult.confidence,
    nameFound: groqResult.name_found,
    matchDetails: {
      searchedParts: nameParts,
      foundParts: groqResult.found_parts || [],
      missingParts: groqResult.missing_parts || [],
    },
    method,
    extractedTextPreview: groqResult.extracted_name
      ? `Name: ${groqResult.extracted_name} | Doc: ${groqResult.document_type_detected} | ${groqResult.reasoning}`
      : `Doc: ${groqResult.document_type_detected} | ${groqResult.reasoning}`,
  }
}

// ─── Main Verification Function ──────────────────────────────────────────────

/**
 * Verify a document using Groq AI:
 *
 * - Images → VLM (visual analysis by Llama 4 Scout)
 * - PDF with text → extract text → LLM text analysis
 * - PDF scanned → fallback (manual review)
 * - Word (.docx) → extract text → LLM text analysis
 *
 * All name matching is done by the AI model — no regex or manual matching.
 */
export async function verifyDocument(
  buffer: Buffer,
  mimeType: string,
  fullName: string,
  documentType: string = 'identity document'
): Promise<VerificationResult> {
  const nameParts = fullName.trim().split(/\s+/)

  const fallbackResult: VerificationResult = {
    success: false,
    confidence: 0,
    nameFound: false,
    matchDetails: { searchedParts: nameParts, foundParts: [], missingParts: nameParts },
    method: 'fallback',
    extractedTextPreview: '(verification unavailable — manual review required)',
  }

  // ── PDF ──────────────────────────────────────────────────────────────────
  if (mimeType === 'application/pdf') {
    const pdfText = await extractPdfText(buffer)
    if (pdfText) {
      const result = await verifyTextWithLLM(pdfText, fullName, documentType)
      if (result) return buildResult(result, 'llm-text', nameParts)
    }
    // Scanned PDF with no extractable text
    return { ...fallbackResult, extractedTextPreview: '(scanned PDF — no text extracted, manual review required)' }
  }

  // ── Word (.docx) ─────────────────────────────────────────────────────────
  const isWord = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || mimeType === 'application/msword'
  if (isWord) {
    const wordText = await extractWordText(buffer)
    if (wordText) {
      const result = await verifyTextWithLLM(wordText, fullName, documentType)
      if (result) return buildResult(result, 'llm-text', nameParts)
    }
    return { ...fallbackResult, extractedTextPreview: '(Word document — could not extract text)' }
  }

  // ── Images (PNG, JPG, WEBP, BMP, TIFF, GIF, etc.) ───────────────────────
  if (mimeType.startsWith('image/')) {
    if (buffer.length > 4 * 1024 * 1024) {
      return { ...fallbackResult, extractedTextPreview: '(image too large for VLM — max 4MB)' }
    }
    const result = await verifyImageWithVLM(buffer, mimeType, fullName, documentType)
    if (result) return buildResult(result, 'vlm', nameParts)
    return { ...fallbackResult, extractedTextPreview: '(VLM service unavailable — manual review required)' }
  }

  // ── Unsupported type ─────────────────────────────────────────────────────
  return { ...fallbackResult, extractedTextPreview: `(unsupported file type: ${mimeType})` }
}
