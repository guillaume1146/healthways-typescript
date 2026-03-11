import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'

/**
 * GET /api/ai/health-tracker/water?date=2026-03-11 - Get water entries for a date
 */
export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { limit: 30, windowMs: 60_000, prefix: 'health-tracker' })
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    if (!dateParam) {
      return NextResponse.json({ success: false, message: 'date query parameter is required' }, { status: 400 })
    }

    const startOfDay = new Date(dateParam + 'T00:00:00.000Z')
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

    const entries = await prisma.waterEntry.findMany({
      where: {
        userId: auth.sub,
        date: { gte: startOfDay, lt: endOfDay },
      },
      orderBy: { createdAt: 'asc' },
    })

    const totalMl = entries.reduce((sum, e) => sum + e.amountMl, 0)

    return NextResponse.json({
      success: true,
      data: {
        entries,
        totalMl,
      },
    })
  } catch (error) {
    console.error('GET /api/ai/health-tracker/water error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

/**
 * POST /api/ai/health-tracker/water - Create a water entry
 */
export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { limit: 30, windowMs: 60_000, prefix: 'health-tracker' })
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { date, amountMl } = body

    if (!amountMl || typeof amountMl !== 'number' || amountMl <= 0) {
      return NextResponse.json(
        { success: false, message: 'amountMl is required and must be a positive number' },
        { status: 400 }
      )
    }

    const today = new Date().toISOString().split('T')[0]
    const entryDate = date || today

    const entry = await prisma.waterEntry.create({
      data: {
        userId: auth.sub,
        date: new Date(entryDate + 'T00:00:00.000Z'),
        amountMl: Math.round(amountMl),
      },
    })

    return NextResponse.json({ success: true, data: entry }, { status: 201 })
  } catch (error) {
    console.error('POST /api/ai/health-tracker/water error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
