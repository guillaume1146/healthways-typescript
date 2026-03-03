import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { getPatientInsights } from '@/lib/services/ai'

/**
 * GET /api/ai/insights - Get patient dietary/health insights history
 * Query params: ?days=14
 */
export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const days = Math.min(parseInt(url.searchParams.get('days') || '14', 10), 90)

    const insights = await getPatientInsights(auth.sub, days)

    return NextResponse.json({
      success: true,
      data: insights,
    })
  } catch (error) {
    console.error('Get insights error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to load insights' },
      { status: 500 }
    )
  }
}
