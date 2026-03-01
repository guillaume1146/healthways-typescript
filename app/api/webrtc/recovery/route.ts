import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST - Attempt session recovery
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roomId, userId } = body

    if (!roomId || !userId) {
      return NextResponse.json(
        { error: 'roomId and userId are required' },
        { status: 400 }
      )
    }

    const videoRoom = await prisma.videoRoom.findFirst({
      where: { roomCode: roomId }
    })

    if (!videoRoom) {
      return NextResponse.json({
        canRecover: false,
        reason: 'Room not found'
      })
    }

    // Find the most recent session for this room
    const session = await prisma.videoCallSession.findFirst({
      where: {
        roomId: videoRoom.id,
        OR: [
          { status: 'active' },
          {
            status: 'completed',
            endedAt: {
              gte: new Date(Date.now() - 5 * 60 * 1000) // Within last 5 minutes
            }
          }
        ]
      },
      orderBy: { startedAt: 'desc' }
    })

    if (!session) {
      return NextResponse.json({
        canRecover: false,
        reason: 'No active or recent session found'
      })
    }

    // Reactivate the session if it was recently completed
    if (session.status === 'completed') {
      await prisma.videoCallSession.update({
        where: { id: session.id },
        data: {
          status: 'active',
          endedAt: null
        }
      })
    }

    return NextResponse.json({
      canRecover: true,
      data: {
        sessionId: session.id,
        roomId,
        status: 'active',
        startedAt: session.startedAt
      }
    })
  } catch (error) {
    console.error('Failed to recover session:', error)
    return NextResponse.json(
      { error: 'Failed to recover session' },
      { status: 500 }
    )
  }
}
