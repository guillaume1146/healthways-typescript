import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'

/**
 * GET /api/ai/health-tracker/progress?period=week - Weekly or monthly analytics
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
    const period = searchParams.get('period') || 'week'
    const numDays = period === 'month' ? 30 : 7

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const startDate = new Date(today.getTime() - (numDays - 1) * 24 * 60 * 60 * 1000)
    const endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    const [foodEntries, exerciseEntries, waterEntries, sleepEntries] = await Promise.all([
      prisma.foodEntry.findMany({
        where: { userId: auth.sub, date: { gte: startDate, lt: endDate } },
        select: { date: true, calories: true },
      }),
      prisma.exerciseEntry.findMany({
        where: { userId: auth.sub, date: { gte: startDate, lt: endDate } },
        select: { date: true, caloriesBurned: true, durationMin: true },
      }),
      prisma.waterEntry.findMany({
        where: { userId: auth.sub, date: { gte: startDate, lt: endDate } },
        select: { date: true, amountMl: true },
      }),
      prisma.sleepEntry.findMany({
        where: { userId: auth.sub, date: { gte: startDate, lt: endDate } },
        select: { date: true, durationMin: true, quality: true },
      }),
    ])

    // Build day-by-day data
    const days: { date: string; caloriesConsumed: number; caloriesBurned: number; waterMl: number; exerciseMinutes: number; sleepMin: number }[] = []

    for (let i = 0; i < numDays; i++) {
      const dayStart = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      const dateStr = dayStart.toISOString().split('T')[0]

      const dayFood = foodEntries.filter(e => e.date >= dayStart && e.date < dayEnd)
      const dayExercise = exerciseEntries.filter(e => e.date >= dayStart && e.date < dayEnd)
      const dayWater = waterEntries.filter(e => e.date >= dayStart && e.date < dayEnd)
      const daySleep = sleepEntries.find(e => e.date >= dayStart && e.date < dayEnd)

      days.push({
        date: dateStr,
        caloriesConsumed: dayFood.reduce((sum, e) => sum + e.calories, 0),
        caloriesBurned: dayExercise.reduce((sum, e) => sum + e.caloriesBurned, 0),
        waterMl: dayWater.reduce((sum, e) => sum + e.amountMl, 0),
        exerciseMinutes: dayExercise.reduce((sum, e) => sum + e.durationMin, 0),
        sleepMin: daySleep?.durationMin ?? 0,
      })
    }

    const totals = {
      calories: days.reduce((sum, d) => sum + d.caloriesConsumed, 0),
      burned: days.reduce((sum, d) => sum + d.caloriesBurned, 0),
      water: days.reduce((sum, d) => sum + d.waterMl, 0),
      exercise: days.reduce((sum, d) => sum + d.exerciseMinutes, 0),
      sleep: days.reduce((sum, d) => sum + d.sleepMin, 0),
    }

    const averages = {
      calories: Math.round(totals.calories / numDays),
      burned: Math.round(totals.burned / numDays),
      water: Math.round(totals.water / numDays),
      exercise: Math.round(totals.exercise / numDays),
      sleep: Math.round(totals.sleep / numDays),
    }

    return NextResponse.json({
      success: true,
      data: { days, averages, totals },
    })
  } catch (error) {
    console.error('GET /api/ai/health-tracker/progress error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
