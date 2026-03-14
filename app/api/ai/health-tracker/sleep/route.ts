import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'

/**
 * GET /api/ai/health-tracker/sleep?date=2026-03-11 - Get sleep entry for a date
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

    const entry = await prisma.sleepEntry.findFirst({
      where: {
        userId: auth.sub,
        date: { gte: startOfDay, lt: endOfDay },
      },
    })

    const profile = await prisma.healthTrackerProfile.findUnique({
      where: { userId: auth.sub },
      select: { targetSleepMin: true },
    })

    return NextResponse.json({
      success: true,
      data: {
        entry,
        targetSleepMin: profile?.targetSleepMin ?? 480,
      },
    })
  } catch (error) {
    console.error('GET /api/ai/health-tracker/sleep error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

/**
 * POST /api/ai/health-tracker/sleep - Create or update sleep entry (one per day)
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
    const { date, durationMin, quality, sleepStart, sleepEnd, notes } = body

    if (!date || durationMin === undefined) {
      return NextResponse.json(
        { success: false, message: 'date and durationMin are required' },
        { status: 400 }
      )
    }

    const validQualities = ['terrible', 'poor', 'fair', 'good', 'excellent']
    const entryQuality = quality && validQualities.includes(quality) ? quality : 'fair'

    const entryDate = new Date(date + 'T00:00:00.000Z')

    const entry = await prisma.sleepEntry.upsert({
      where: {
        userId_date: {
          userId: auth.sub,
          date: entryDate,
        },
      },
      create: {
        userId: auth.sub,
        date: entryDate,
        durationMin: Math.round(durationMin),
        quality: entryQuality,
        sleepStart: sleepStart ? new Date(sleepStart) : null,
        sleepEnd: sleepEnd ? new Date(sleepEnd) : null,
        notes: notes ?? null,
      },
      update: {
        durationMin: Math.round(durationMin),
        quality: entryQuality,
        sleepStart: sleepStart ? new Date(sleepStart) : null,
        sleepEnd: sleepEnd ? new Date(sleepEnd) : null,
        notes: notes ?? null,
      },
    })

    return NextResponse.json({ success: true, data: entry }, { status: 201 })
  } catch (error) {
    console.error('POST /api/ai/health-tracker/sleep error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
