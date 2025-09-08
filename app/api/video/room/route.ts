// app/api/video/room/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Generate a unique room ID
function generateRoomId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `room-${timestamp}-${randomStr}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { doctorId, patientId, doctorName, patientName } = body

    // Generate unique room ID
    const roomId = generateRoomId()

    // Create room data
    const roomData = {
      roomId,
      doctorId,
      patientId,
      doctorName,
      patientName,
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    // In a real application, you would save this to a database
    // For now, we'll store it in memory or return it directly
    
    return NextResponse.json({
      success: true,
      data: roomData
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

  // In a real application, you would fetch room data from database
  // For now, we'll return mock data
  const roomData = {
    roomId,
    status: 'active',
    participants: [],
    createdAt: new Date().toISOString()
  }

  return NextResponse.json({
    success: true,
    data: roomData
  })
}