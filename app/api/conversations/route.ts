import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'

/**
 * GET /api/conversations
 * List current user's conversations with participants, last message, and unread count.
 */
export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const userId = auth.sub

  try {
    // Find all conversation IDs where the current user is a participant
    const participantEntries = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
    })

    const conversationIds = participantEntries.map((p) => p.conversationId)

    if (conversationIds.length === 0) {
      return NextResponse.json({ success: true, data: [] })
    }

    // Fetch conversations with participants and last message
    const conversations = await prisma.conversation.findMany({
      where: { id: { in: conversationIds } },
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
        messages: {
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Count unread messages per conversation
    const unreadCounts = await Promise.all(
      conversationIds.map(async (conversationId) => {
        const count = await prisma.message.count({
          where: {
            conversationId,
            senderId: { not: userId },
            readAt: null,
          },
        })
        return { conversationId, count }
      })
    )

    const unreadMap = new Map(unreadCounts.map((u) => [u.conversationId, u.count]))

    const data = conversations.map((conv) => ({
      id: conv.id,
      type: conv.type,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      participants: conv.participants.map((p) => ({
        userId: p.userId,
        joinedAt: p.joinedAt,
        firstName: p.user.firstName,
        lastName: p.user.lastName,
        userType: p.user.userType,
        profileImage: p.user.profileImage,
      })),
      lastMessage: conv.messages[0] || null,
      unreadCount: unreadMap.get(conv.id) || 0,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/conversations error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/conversations
 * Create a new conversation. For direct (2-person) conversations, returns existing one if found.
 * Body: { participantIds: string[] }
 */
export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const userId = auth.sub

  try {
    const body = await request.json()
    const { participantIds } = body as { participantIds?: string[] }

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'participantIds is required and must be a non-empty array' },
        { status: 400 }
      )
    }

    // Ensure the current user is included in the participant list
    const allParticipantIds = Array.from(new Set([userId, ...participantIds]))

    // Validate that all participant users exist
    const existingUsers = await prisma.user.findMany({
      where: { id: { in: allParticipantIds } },
      select: { id: true },
    })

    if (existingUsers.length !== allParticipantIds.length) {
      return NextResponse.json(
        { success: false, message: 'One or more participant IDs are invalid' },
        { status: 400 }
      )
    }

    // For direct conversations (exactly 2 participants), check if one already exists
    const isDirect = allParticipantIds.length === 2

    if (isDirect) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: 'direct',
          AND: allParticipantIds.map((pid) => ({
            participants: { some: { userId: pid } },
          })),
        },
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

      if (existingConversation) {
        return NextResponse.json({
          success: true,
          data: {
            ...existingConversation,
            participants: existingConversation.participants.map((p) => ({
              userId: p.userId,
              joinedAt: p.joinedAt,
              firstName: p.user.firstName,
              lastName: p.user.lastName,
              userType: p.user.userType,
              profileImage: p.user.profileImage,
            })),
          },
        })
      }
    }

    // Create new conversation with participants
    const conversation = await prisma.conversation.create({
      data: {
        type: isDirect ? 'direct' : 'group',
        participants: {
          create: allParticipantIds.map((pid) => ({
            userId: pid,
          })),
        },
      },
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

    return NextResponse.json(
      {
        success: true,
        data: {
          ...conversation,
          participants: conversation.participants.map((p) => ({
            userId: p.userId,
            joinedAt: p.joinedAt,
            firstName: p.user.firstName,
            lastName: p.user.lastName,
            userType: p.user.userType,
            profileImage: p.user.profileImage,
          })),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/conversations error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
