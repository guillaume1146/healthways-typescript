import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST - Create or update a video call session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roomId, userId, userName, userType } = body

    if (!roomId || !userId) {
      return NextResponse.json(
        { error: 'roomId and userId are required' },
        { status: 400 }
      )
    }

    // Find the video room
    const videoRoom = await prisma.videoRoom.findFirst({
      where: { roomCode: roomId }
    })

    if (!videoRoom) {
      // Create room on-the-fly if it doesn't exist
      const newRoom = await prisma.videoRoom.create({
        data: {
          roomCode: roomId,
          creatorId: userId,
          status: 'active',
          maxParticipants: 2
        }
      })

      const session = await prisma.videoCallSession.create({
        data: {
          roomId: newRoom.id,
          userId,
          status: 'active',
        }
      })

      return NextResponse.json({
        data: {
          session: {
            id: session.id,
            roomId,
            status: session.status,
            isActive: true
          }
        }
      })
    }

    // Check for existing active session
    const existingSession = await prisma.videoCallSession.findFirst({
      where: {
        roomId: videoRoom.id,
        status: 'active'
      }
    })

    if (existingSession) {
      return NextResponse.json({
        data: {
          session: {
            id: existingSession.id,
            roomId,
            status: existingSession.status,
            isActive: true
          }
        }
      })
    }

    const session = await prisma.videoCallSession.create({
      data: {
        roomId: videoRoom.id,
        userId,
        status: 'active',
      }
    })

    return NextResponse.json({
      data: {
        session: {
          id: session.id,
          roomId,
          status: session.status,
          isActive: true
        }
      }
    })
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

// GET - Check for existing session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    if (!roomId) {
      return NextResponse.json(
        { error: 'roomId is required' },
        { status: 400 }
      )
    }

    const videoRoom = await prisma.videoRoom.findFirst({
      where: { roomCode: roomId }
    })

    if (!videoRoom) {
      return NextResponse.json({ data: null })
    }

    const session = await prisma.videoCallSession.findFirst({
      where: {
        roomId: videoRoom.id,
        status: 'active'
      }
    })

    if (!session) {
      return NextResponse.json({ data: null })
    }

    return NextResponse.json({
      data: {
        id: session.id,
        roomId,
        status: session.status,
        isActive: true,
        startedAt: session.startedAt
      }
    })
  } catch (error) {
    console.error('Failed to check session:', error)
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    )
  }
}

// PATCH - Update session health
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, connectionState } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    await prisma.videoCallSession.update({
      where: { id: sessionId },
      data: {
        status: connectionState === 'failed' ? 'failed' : 'active'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

// DELETE - End session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    await prisma.videoCallSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        endedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to end session:', error)
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    )
  }
}
