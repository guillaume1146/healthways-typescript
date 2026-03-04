import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'

/**
 * PATCH /api/connections/[id]
 * Accept or reject a connection request.
 * Body: { action: 'accept' | 'reject' }
 * Only the RECEIVER may accept or reject.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const userId = auth.sub
  const { id } = await params

  try {
    const body = await request.json()
    const { action } = body as { action?: string }

    if (action !== 'accept' && action !== 'reject') {
      return NextResponse.json(
        { success: false, message: 'action must be "accept" or "reject"' },
        { status: 400 }
      )
    }

    // Fetch the connection
    const connection = await prisma.userConnection.findUnique({
      where: { id },
      select: { id: true, senderId: true, receiverId: true, status: true },
    })

    if (!connection) {
      return NextResponse.json(
        { success: false, message: 'Connection not found' },
        { status: 404 }
      )
    }

    // Only the receiver can accept or reject
    if (connection.receiverId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Only the receiver can accept or reject this request' },
        { status: 403 }
      )
    }

    if (connection.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: 'Connection request is no longer pending' },
        { status: 409 }
      )
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected'

    const updated = await prisma.userConnection.update({
      where: { id },
      data: { status: newStatus },
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

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('PATCH /api/connections/[id] error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update connection' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/connections/[id]
 * Remove a connection. Either sender or receiver may delete.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const userId = auth.sub
  const { id } = await params

  try {
    const connection = await prisma.userConnection.findUnique({
      where: { id },
      select: { id: true, senderId: true, receiverId: true },
    })

    if (!connection) {
      return NextResponse.json(
        { success: false, message: 'Connection not found' },
        { status: 404 }
      )
    }

    // Only sender or receiver can delete
    if (connection.senderId !== userId && connection.receiverId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.userConnection.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Connection removed' })
  } catch (error) {
    console.error('DELETE /api/connections/[id] error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete connection' },
      { status: 500 }
    )
  }
}
