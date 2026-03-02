import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { z } from 'zod'
import { rateLimitPublic } from '@/lib/rate-limit'

const documentTypes = [
  'lab_report',
  'prescription',
  'imaging',
  'insurance',
  'id_proof',
  'other',
] as const

const createDocumentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  type: z.enum(documentTypes, { message: 'Invalid document type' }),
  url: z.string().min(1, 'URL is required'),
  size: z.number().optional(),
})

const deleteDocumentSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  if (auth.sub !== id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const where: Record<string, unknown> = { userId: id }
    if (type) {
      where.type = type
    }

    const documents = await prisma.document.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        url: true,
        size: true,
        uploadedAt: true,
      },
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: documents })
  } catch (error) {
    console.error('GET /api/users/[id]/documents error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  if (auth.sub !== id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = createDocumentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const document = await prisma.document.create({
      data: {
        userId: id,
        name: parsed.data.name,
        type: parsed.data.type,
        url: parsed.data.url,
        size: parsed.data.size,
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

    return NextResponse.json({ success: true, data: document }, { status: 201 })
  } catch (error) {
    console.error('POST /api/users/[id]/documents error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  if (auth.sub !== id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = deleteDocumentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const document = await prisma.document.findUnique({
      where: { id: parsed.data.documentId },
      select: { id: true, userId: true },
    })

    if (!document) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 })
    }

    if (document.userId !== id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await prisma.document.delete({
      where: { id: parsed.data.documentId },
    })

    return NextResponse.json({ success: true, data: { id: parsed.data.documentId } })
  } catch (error) {
    console.error('DELETE /api/users/[id]/documents error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
