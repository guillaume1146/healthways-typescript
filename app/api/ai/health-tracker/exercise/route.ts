import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'

/**
 * GET /api/ai/health-tracker/exercise?date=2026-03-11 - Get exercises for a date
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

    const entries = await prisma.exerciseEntry.findMany({
      where: {
        userId: auth.sub,
        date: { gte: startOfDay, lt: endOfDay },
      },
      orderBy: { createdAt: 'asc' },
    })

    const totalCaloriesBurned = entries.reduce((sum, e) => sum + e.caloriesBurned, 0)
    const totalMinutes = entries.reduce((sum, e) => sum + e.durationMin, 0)

    return NextResponse.json({
      success: true,
      data: {
        entries,
        totalCaloriesBurned,
        totalMinutes,
      },
    })
  } catch (error) {
    console.error('GET /api/ai/health-tracker/exercise error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

/**
 * POST /api/ai/health-tracker/exercise - Create an exercise entry
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
    const { date, exerciseType, durationMin, caloriesBurned, intensity, notes } = body

    if (!date || !exerciseType || !durationMin || caloriesBurned === undefined) {
      return NextResponse.json(
        { success: false, message: 'date, exerciseType, durationMin, and caloriesBurned are required' },
        { status: 400 }
      )
    }

    const validIntensities = ['light', 'moderate', 'vigorous']
    const entryIntensity = intensity && validIntensities.includes(intensity) ? intensity : 'moderate'

    const entry = await prisma.exerciseEntry.create({
      data: {
        userId: auth.sub,
        date: new Date(date + 'T00:00:00.000Z'),
        exerciseType,
        durationMin: Math.round(durationMin),
        caloriesBurned: Math.round(caloriesBurned),
        intensity: entryIntensity,
        notes: notes ?? null,
      },
    })

    return NextResponse.json({ success: true, data: entry }, { status: 201 })
  } catch (error) {
    console.error('POST /api/ai/health-tracker/exercise error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
