import { NextRequest, NextResponse } from 'next/server'
import { verifyDocument } from '@/lib/ocr/verify-document'
import { rateLimitHeavy } from '@/lib/rate-limit'
import { validateRequest } from '@/lib/auth/validate'

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/gif',
]
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  const limited = rateLimitHeavy(request)
  if (limited) return limited

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const fullName = formData.get('fullName') as string | null
    const documentType = (formData.get('documentType') as string) || 'identity document'

    if (!file || !fullName) {
      return NextResponse.json(
        { success: false, message: 'File and fullName are required' },
        { status: 400 }
      )
    }

    // Accept any image type — normalize unknown types to the file's declared type
    const fileType = file.type || 'application/octet-stream'
    const isImage = fileType.startsWith('image/')
    const isPdf = fileType === 'application/pdf'

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { success: false, message: 'Unsupported file type. Use an image (PNG, JPG, WEBP, etc.) or PDF.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await verifyDocument(buffer, fileType, fullName, documentType)

    return NextResponse.json({
      success: true,
      verified: result.success,
      confidence: result.confidence,
      nameFound: result.nameFound,
      method: result.method,
      matchDetails: result.matchDetails,
    })
  } catch (error) {
    void error
    return NextResponse.json(
      { success: false, message: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
