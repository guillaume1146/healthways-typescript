import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { z } from 'zod'
import { rateLimitAuth } from '@/lib/rate-limit'
import { unauthorizedResponse, forbiddenResponse, notFoundResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'

const createDocumentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  type: z.string().min(1, 'Type is required').max(50),
  url: z.string().min(1, 'URL is required'),
  size: z.number().optional(),
})

const updateDocumentSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
  url: z.string().min(1, 'URL is required'),
  name: z.string().min(1).max(255).optional(),
  size: z.number().optional(),
})

const deleteDocumentSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return unauthorizedResponse()

  const { id } = await params

  // Owner or super admin can view documents
  if (auth.sub !== id && auth.userType !== 'admin') {
    return forbiddenResponse()
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
    return serverErrorResponse()
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return unauthorizedResponse()

  const { id } = await params

  if (auth.sub !== id) return forbiddenResponse()

  try {
    const body = await request.json()
    const parsed = createDocumentSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message)
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
    return serverErrorResponse()
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return unauthorizedResponse()

  const { id } = await params

  if (auth.sub !== id) return forbiddenResponse()

  try {
    const body = await request.json()
    const parsed = updateDocumentSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message)
    }

    // Verify the document belongs to this user
    const existing = await prisma.document.findUnique({
      where: { id: parsed.data.documentId },
      select: { id: true, userId: true },
    })

    if (!existing) return notFoundResponse('Document not found')
    if (existing.userId !== id) return forbiddenResponse()

    const updateData: Record<string, unknown> = { url: parsed.data.url }
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name
    if (parsed.data.size !== undefined) updateData.size = parsed.data.size

    const document = await prisma.document.update({
      where: { id: parsed.data.documentId },
      data: updateData,
      select: {
        id: true,
        name: true,
        type: true,
        url: true,
        size: true,
        uploadedAt: true,
      },
    })

    return NextResponse.json({ success: true, data: document })
  } catch (error) {
    console.error('PUT /api/users/[id]/documents error:', error)
    return serverErrorResponse()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return unauthorizedResponse()

  const { id } = await params

  if (auth.sub !== id) return forbiddenResponse()

  try {
    const body = await request.json()
    const parsed = deleteDocumentSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message)
    }

    const document = await prisma.document.findUnique({
      where: { id: parsed.data.documentId },
      select: { id: true, userId: true },
    })

    if (!document) return notFoundResponse('Document not found')
    if (document.userId !== id) return forbiddenResponse()

    await prisma.document.delete({
      where: { id: parsed.data.documentId },
    })

    return NextResponse.json({ success: true, data: { id: parsed.data.documentId } })
  } catch (error) {
    console.error('DELETE /api/users/[id]/documents error:', error)
    return serverErrorResponse()
  }
}
