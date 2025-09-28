// app/api/webrtc/recovery/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Get recovery information for a disconnected user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roomId, userId } = body

    if (!roomId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Room ID and User ID required' },
        { status: 400 }
      )
    }

    // Find the session
    const session = await prisma.webRTCSession.findUnique({
      where: { roomId },
      include: {
        connections: {
          orderBy: {
            lastSeen: 'desc'
          }
        }
      }
    })

    if (!session) {
      return NextResponse.json({
        success: false,
        canRecover: false,
        reason: 'Session not found'
      })
    }

    // Check if session is still active (within last hour)
    const isActive = new Date().getTime() - session.lastActivity.getTime() < 3600000

    if (!isActive) {
      return NextResponse.json({
        success: false,
        canRecover: false,
        reason: 'Session expired'
      })
    }

    // Find user's connection
    const userConnection = session.connections.find(c => c.userId === userId)

    if (!userConnection) {
      return NextResponse.json({
        success: false,
        canRecover: false,
        reason: 'User not found in session'
      })
    }

    // Get other active connections
    const otherConnections = session.connections.filter(c => 
      c.userId !== userId && 
      (c.connectionState === 'connected' || c.connectionState === 'connecting')
    )

    return NextResponse.json({
      success: true,
      canRecover: true,
      data: {
        session: {
          id: session.id,
          roomId: session.roomId,
          status: session.status,
          participants: session.participants,
          iceRestartCount: session.iceRestartCount
        },
        userConnection: {
          ...userConnection,
          signalData: userConnection.signalData
        },
        otherConnections: otherConnections.map(c => ({
          userId: c.userId,
          userName: c.userName,
          userType: c.userType,
          connectionState: c.connectionState,
          lastSeen: c.lastSeen
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching recovery data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recovery data' },
      { status: 500 }
    )
  }
}