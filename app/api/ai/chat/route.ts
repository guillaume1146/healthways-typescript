import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { chatWithAssistant, listChatSessions } from '@/lib/services/ai'
import { rateLimit } from '@/lib/rate-limit'

/**
 * POST /api/ai/chat - Send a message to the AI assistant
 * Body: { message: string, sessionId?: string }
 */
export async function POST(request: NextRequest) {
  // Rate limit: 20 requests per minute per IP
  const limited = rateLimit(request, { limit: 20, windowMs: 60_000, prefix: 'ai-chat' })
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { message, sessionId } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { success: false, message: 'Message is too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    const result = await chatWithAssistant(
      auth.sub,
      message.trim(),
      sessionId || undefined
    )

    return NextResponse.json({
      success: true,
      data: {
        response: result.response,
        sessionId: result.sessionId,
        title: result.title,
      },
    })
  } catch (error) {
    console.error('AI chat error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Server error'

    if (errorMessage.includes('GROQ_API_KEY')) {
      return NextResponse.json(
        { success: false, message: 'AI service is not configured' },
        { status: 503 }
      )
    }

    if (errorMessage.includes('Patient profile not found')) {
      return NextResponse.json(
        { success: false, message: 'Patient profile not found. This feature is only available for patients.' },
        { status: 404 }
      )
    }

    if (errorMessage.includes('Chat session not found')) {
      return NextResponse.json(
        { success: false, message: 'Chat session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to process your message. Please try again.' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai/chat - List all chat sessions for the current user
 */
export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sessions = await listChatSessions(auth.sub)

    return NextResponse.json({
      success: true,
      data: sessions,
    })
  } catch (error) {
    console.error('List chat sessions error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to load chat sessions' },
      { status: 500 }
    )
  }
}
