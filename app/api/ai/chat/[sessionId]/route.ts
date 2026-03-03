import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { getSessionMessages, deleteChatSession } from '@/lib/services/ai'

/**
 * GET /api/ai/chat/[sessionId] - Get messages for a specific chat session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { sessionId } = await params
    const session = await getSessionMessages(auth.sub, sessionId)

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Chat session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error('Get session messages error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to load chat messages' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/ai/chat/[sessionId] - Delete a chat session
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { sessionId } = await params
    const deleted = await deleteChatSession(auth.sub, sessionId)

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Chat session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Chat session deleted',
    })
  } catch (error) {
    console.error('Delete session error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete chat session' },
      { status: 500 }
    )
  }
}
