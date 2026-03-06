import { NextRequest, NextResponse } from 'next/server'
import { verifyDocument } from '@/lib/ocr/verify-document'
import { rateLimitHeavy } from '@/lib/rate-limit'
import { validateRequest } from '@/lib/auth/validate'

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
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
    const documentType = formData.get('documentType') as string | null

    if (!file || !fullName) {
      return NextResponse.json(
        { success: false, message: 'File and fullName are required' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Unsupported file type. Use PDF, JPG, or PNG.' },
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

    const result = await verifyDocument(buffer, file.type, fullName)

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
