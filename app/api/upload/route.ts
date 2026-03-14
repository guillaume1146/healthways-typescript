import { NextRequest, NextResponse } from 'next/server'
import { getStorageClient } from '@/lib/google-auth'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitHeavy } from '@/lib/rate-limit'
import prisma from '@/lib/db'
import { randomUUID } from 'crypto'

const BUCKET_NAME = 'omd-uploads'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const DOCUMENT_TYPES = new Set([
  'lab_report', 'prescription', 'imaging', 'insurance', 'id_proof', 'profile_image', 'other',
])

export async function POST(request: NextRequest) {
  const limited = rateLimitHeavy(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const documentType = (formData.get('type') as string) || 'other'
    const documentName = (formData.get('name') as string) || ''

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: 'File too large. Maximum size is 10MB' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, message: 'File type not allowed. Accepted: JPEG, PNG, WebP, PDF, DOC, DOCX' }, { status: 400 })
    }

    if (!DOCUMENT_TYPES.has(documentType)) {
      return NextResponse.json({ success: false, message: 'Invalid document type' }, { status: 400 })
    }

    // Generate unique file path
    const ext = file.name.split('.').pop() || 'bin'
    const fileId = randomUUID()
    const filePath = `users/${auth.sub}/${documentType}/${fileId}.${ext}`

    // Upload to GCS
    const storage = getStorageClient()
    const bucket = storage.bucket(BUCKET_NAME)
    const gcsFile = bucket.file(filePath)

    const buffer = Buffer.from(await file.arrayBuffer())

    await gcsFile.save(buffer, {
      contentType: file.type,
      metadata: {
        userId: auth.sub,
        originalName: file.name,
        documentType,
      },
    })

    // Make file publicly readable (or use signed URLs in production)
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filePath}`

    // Save document record in DB
    const document = await prisma.document.create({
      data: {
        userId: auth.sub,
        name: documentName || file.name,
        type: documentType,
        url: publicUrl,
        size: file.size,
      },
      select: {
        id: true,
        name: true,
        type: true,
        url: true,
        size: true,
        uploadedAt: true,
      },
    })

    // If uploading a profile image, update user's profileImage field
    if (documentType === 'profile_image') {
      await prisma.user.update({
        where: { id: auth.sub },
        data: { profileImage: publicUrl },
      })
    }

    return NextResponse.json({
      success: true,
      data: document,
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/upload error:', error)
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 })
  }
}
