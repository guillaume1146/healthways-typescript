// app/api/video/room/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Generate a unique room code
function generateRoomCode(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `room-${timestamp}-${randomStr}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { creatorId } = body

    if (!creatorId) {
      return NextResponse.json(
        { success: false, error: 'creatorId is required' },
        { status: 400 }
      )
    }

    // Generate unique room code
    const roomCode = generateRoomCode()

    // Create room in database
    const room = await prisma.videoRoom.create({
      data: {
        roomCode,
        creatorId,
        status: 'active',
        maxParticipants: 2,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        roomId: room.roomCode,
        id: room.id,
        creatorId: room.creatorId,
        createdAt: room.createdAt.toISOString(),
        status: room.status,
      },
    })
  } catch (error) {
    console.error('Error creating video room:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create video room' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get('roomId')

  if (!roomId) {
    return NextResponse.json(
      { success: false, error: 'Room ID is required' },
      { status: 400 }
    )
  }

  try {
    const room = await prisma.videoRoom.findFirst({
      where: { roomCode: roomId },
      include: {
        participants: true,
      },
    })

    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        roomId: room.roomCode,
        id: room.id,
        status: room.status,
        creatorId: room.creatorId,
        participants: room.participants,
        createdAt: room.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching video room:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video room' },
      { status: 500 }
    )
  }
}
