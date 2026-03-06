import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'

/**
 * GET /api/connections
 * List connections for the authenticated user.
 * Query params:
 *   ?status=pending|accepted|rejected  — filter by status
 *   ?direction=sent|received           — filter by direction
 * Default: returns all connections where the user is sender OR receiver.
 */
export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const userId = auth.sub
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? undefined
  // Support both 'direction' (original) and 'type' (used by ConnectionRequestsList) params
  const direction = searchParams.get('direction') ?? searchParams.get('type') ?? undefined

  try {
    // Build the where clause based on direction
    type WhereClause = {
      status?: string
      senderId?: string
      receiverId?: string
      OR?: Array<{ senderId: string } | { receiverId: string }>
    }

    const where: WhereClause = {}

    if (status) {
      where.status = status
    }

    if (direction === 'sent') {
      where.senderId = userId
    } else if (direction === 'received') {
      where.receiverId = userId
    } else {
      where.OR = [{ senderId: userId }, { receiverId: userId }]
    }

    const connections = await prisma.userConnection.findMany({
      where,
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            userType: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            userType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: connections })
  } catch (error) {
    console.error('GET /api/connections error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch connections' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/connections
 * Send a connection request.
 * Body: { receiverId: string }
 */
export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const userId = auth.sub

  try {
    const body = await request.json()
    const { receiverId } = body as { receiverId?: string }

    if (!receiverId || typeof receiverId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'receiverId is required' },
        { status: 400 }
      )
    }

    if (receiverId === userId) {
      return NextResponse.json(
        { success: false, message: 'Cannot connect with yourself' },
        { status: 400 }
      )
    }

    // Validate receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    })

    if (!receiver) {
      return NextResponse.json(
        { success: false, message: 'Receiver not found' },
        { status: 404 }
      )
    }

    // Check for any existing connection in either direction
    const existing = await prisma.userConnection.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
      select: { id: true, status: true },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Connection already exists', data: existing },
        { status: 409 }
      )
    }

    // Create connection request
    const connection = await prisma.userConnection.create({
      data: {
        senderId: userId,
        receiverId,
        status: 'pending',
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            userType: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            userType: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: connection }, { status: 201 })
  } catch (error) {
    console.error('POST /api/connections error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send connection request' },
      { status: 500 }
    )
  }
}
