// app/api/webrtc/session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Create or retrieve a WebRTC session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roomId, userId, userName, userType } = body

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create or update session
    const session = await prisma.webRTCSession.upsert({
      where: { roomId },
      update: {
        lastActivity: new Date(),
        status: 'active',
        participants: {
          push: {
            userId,
            userName,
            userType,
            joinedAt: new Date()
          }
        }
      },
      create: {
        roomId,
        sessionId,
        status: 'active',
        participants: [{
          userId,
          userName,
          userType,
          joinedAt: new Date()
        }],
        metadata: {
          createdBy: userId,
          createdAt: new Date()
        }
      }
    })

    // Create connection record
    const connection = await prisma.webRTCConnection.upsert({
      where: {
        sessionId_userId: {
          sessionId: session.id,
          userId
        }
      },
      update: {
        connectionState: 'connecting',
        lastSeen: new Date()
      },
      create: {
        sessionId: session.id,
        userId,
        userType,
        userName,
        connectionState: 'connecting'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        session,
        connection
      }
    })
  } catch (error) {
    console.error('Error creating WebRTC session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

// Get session information
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get('roomId')
  const sessionId = searchParams.get('sessionId')

  if (!roomId && !sessionId) {
    return NextResponse.json(
      { success: false, error: 'Room ID or Session ID required' },
      { status: 400 }
    )
  }

  try {
    const session = await prisma.webRTCSession.findUnique({
      where: roomId ? { roomId } : { sessionId: sessionId! },
      include: {
        connections: true
      }
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if session is still active
    const isActive = new Date().getTime() - session.lastActivity.getTime() < 3600000 // 1 hour

    return NextResponse.json({
      success: true,
      data: {
        ...session,
        isActive,
        activeConnections: session.connections.filter(c => 
          c.connectionState === 'connected' || c.connectionState === 'connecting'
        ).length
      }
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

// Update session or connection state
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, userId, connectionState, iceState, signalData } = body

    if (!sessionId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Session ID and User ID required' },
        { status: 400 }
      )
    }

    // Update connection
    const connection = await prisma.webRTCConnection.update({
      where: {
        sessionId_userId: {
          sessionId,
          userId
        }
      },
      data: {
        ...(connectionState && { connectionState }),
        ...(iceState && { iceState }),
        ...(signalData && { signalData }),
        lastSeen: new Date()
      }
    })

    // Update session activity
    await prisma.webRTCSession.update({
      where: { id: sessionId },
      data: { lastActivity: new Date() }
    })

    return NextResponse.json({
      success: true,
      data: connection
    })
  } catch (error) {
    console.error('Error updating connection:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update connection' },
      { status: 500 }
    )
  }
}

// End session
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  const userId = searchParams.get('userId')

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: 'Session ID required' },
      { status: 400 }
    )
  }

  try {
    if (userId) {
      // Just update the connection state for this user
      await prisma.webRTCConnection.update({
        where: {
          sessionId_userId: {
            sessionId,
            userId
          }
        },
        data: {
          connectionState: 'ended',
          lastSeen: new Date()
        }
      })

      // Check if all connections are ended
      const activeConnections = await prisma.webRTCConnection.count({
        where: {
          sessionId,
          connectionState: {
            not: 'ended'
          }
        }
      })

      // If no active connections, end the session
      if (activeConnections === 0) {
        await prisma.webRTCSession.update({
          where: { id: sessionId },
          data: {
            status: 'ended',
            lastActivity: new Date()
          }
        })
      }
    } else {
      // End entire session
      await prisma.webRTCSession.update({
        where: { id: sessionId },
        data: {
          status: 'ended',
          lastActivity: new Date()
        }
      })

      // End all connections
      await prisma.webRTCConnection.updateMany({
        where: { sessionId },
        data: {
          connectionState: 'ended',
          lastSeen: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Session ended successfully'
    })
  } catch (error) {
    console.error('Error ending session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to end session' },
      { status: 500 }
    )
  }
}