import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'

/**
 * GET /api/conversations/[id]
 * Get a single conversation with participant details.
 * Auth required — user must be a participant.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const userId = auth.sub

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        participants: {
          select: {
            userId: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                userType: true,
                profileImage: true,
              },
            },
          },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify the requesting user is a participant
    const isParticipant = conversation.participants.some((p) => p.userId === userId)
    if (!isParticipant) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: conversation.id,
        type: conversation.type,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        participants: conversation.participants.map((p) => ({
          userId: p.userId,
          joinedAt: p.joinedAt,
          firstName: p.user.firstName,
          lastName: p.user.lastName,
          userType: p.user.userType,
          profileImage: p.user.profileImage,
        })),
      },
    })
  } catch (error) {
    console.error('GET /api/conversations/[id] error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
}
