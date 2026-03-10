import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { createWebRTCSessionSchema } from '@/lib/validations/api'
import { rateLimitPublic } from '@/lib/rate-limit'

// POST - Create or update a video call session
export async function POST(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = createWebRTCSessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { roomId, userId, userName, userType } = parsed.data

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

      // Track the connection with userName for display
      if (userName) {
        await prisma.webRTCConnection.create({
          data: { sessionId: session.id, userId, userName, connectionState: 'new' }
        }).catch(() => {})
      }

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
      // Add this user as a connection if not already tracked
      if (userName) {
        await prisma.webRTCConnection.upsert({
          where: { sessionId_userId: { sessionId: existingSession.id, userId } },
          create: { sessionId: existingSession.id, userId, userName, connectionState: 'new' },
          update: { userName, connectionState: 'new' },
        }).catch(() => {})
      }

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

    // Track the connection with userName for display
    if (userName) {
      await prisma.webRTCConnection.create({
        data: { sessionId: session.id, userId, userName, connectionState: 'new' }
      }).catch(() => {})
    }

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
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
