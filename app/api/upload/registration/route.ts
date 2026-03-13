import { NextRequest, NextResponse } from 'next/server'
import { rateLimitPublic } from '@/lib/rate-limit'
import { randomUUID } from 'crypto'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/gif', '.gif'],
  ['image/webp', '.webp'],
  ['application/pdf', '.pdf'],
])

export async function POST(request: NextRequest) {
  const rateLimitResult = rateLimitPublic(request)
  if (rateLimitResult) return rateLimitResult

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'File type not allowed. Accepted: JPG, PNG, GIF, WebP, PDF.',
        },
        { status: 400 }
      )
    }

    // Build the upload path: public/uploads/{year}/{month}/{randomId}-{filename}
    const now = new Date()
    const year = now.getFullYear().toString()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const fileId = randomUUID()

    // Sanitize the original filename (remove path separators, null bytes)
    const sanitizedName = file.name
      .replace(/[/\\:\0]/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 100)

    const fileName = `${fileId}-${sanitizedName}`
    const relativeDir = `uploads/${year}/${month}`
    const relativePath = `${relativeDir}/${fileName}`

    // Ensure the directory exists
    const absoluteDir = path.join(process.cwd(), 'public', relativeDir)
    await mkdir(absoluteDir, { recursive: true })

    // Write the file to disk
    const buffer = Buffer.from(await file.arrayBuffer())
    const absolutePath = path.join(absoluteDir, fileName)
    await writeFile(absolutePath, buffer)

    // Return the public URL path (served by Next.js static files)
    const publicUrl = `/${relativePath}`

    return NextResponse.json(
      {
        success: true,
        data: {
          url: publicUrl,
          fileName: sanitizedName,
          size: file.size,
          type: file.type,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/upload/registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    )
  }
}
