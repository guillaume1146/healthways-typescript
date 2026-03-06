import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'

/**
 * POST /api/conversations/ensure-all
 * For regional admins / super admins: ensures a direct conversation exists
 * with every active user on the platform. Returns the count of newly created conversations.
 */
export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const userId = auth.sub

  // Verify the user is a regional admin or admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { userType: true },
  })

  if (!user || !['REGIONAL_ADMIN', 'ADMIN'].includes(user.userType)) {
    return NextResponse.json(
      { success: false, message: 'Only regional admins can use this endpoint' },
      { status: 403 }
    )
  }

  try {
    // Get all active users except the current user
    const allUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        accountStatus: 'active',
      },
      select: { id: true },
    })

    // Get all existing direct conversations for the current user
    const existingConversations = await prisma.conversation.findMany({
      where: {
        type: 'direct',
        participants: { some: { userId } },
      },
      select: {
        participants: {
          select: { userId: true },
        },
      },
    })

    // Build set of user IDs that already have a conversation with the admin
    const existingPartnerIds = new Set<string>()
    for (const conv of existingConversations) {
      for (const p of conv.participants) {
        if (p.userId !== userId) {
          existingPartnerIds.add(p.userId)
        }
      }
    }

    // Filter to users who don't have a conversation yet
    const missingUserIds = allUsers
      .map((u) => u.id)
      .filter((id) => !existingPartnerIds.has(id))

    if (missingUserIds.length === 0) {
      return NextResponse.json({ success: true, created: 0 })
    }

    // Create conversations in batch
    await prisma.$transaction(
      missingUserIds.map((otherUserId) =>
        prisma.conversation.create({
          data: {
            type: 'direct',
            participants: {
              create: [
                { userId },
                { userId: otherUserId },
              ],
            },
          },
        })
      )
    )

    return NextResponse.json({ success: true, created: missingUserIds.length })
  } catch (error) {
    console.error('POST /api/conversations/ensure-all error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create conversations' },
      { status: 500 }
    )
  }
}
