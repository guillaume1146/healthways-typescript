import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'

/**
 * GET /api/ai/health-tracker/dashboard - Today's summary aggregation
 */
export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { limit: 30, windowMs: 60_000, prefix: 'health-tracker' })
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const today = new Date().toISOString().split('T')[0]
    const startOfDay = new Date(today + 'T00:00:00.000Z')
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

    const dateFilter = { gte: startOfDay, lt: endOfDay }

    const [foodEntries, exerciseEntries, waterEntries, sleepEntry, profile] = await Promise.all([
      prisma.foodEntry.findMany({
        where: { userId: auth.sub, date: dateFilter },
        select: { calories: true },
      }),
      prisma.exerciseEntry.findMany({
        where: { userId: auth.sub, date: dateFilter },
        select: { caloriesBurned: true, durationMin: true },
      }),
      prisma.waterEntry.findMany({
        where: { userId: auth.sub, date: dateFilter },
        select: { amountMl: true },
      }),
      prisma.sleepEntry.findFirst({
        where: { userId: auth.sub, date: dateFilter },
        select: { durationMin: true, quality: true },
      }),
      prisma.healthTrackerProfile.findUnique({
        where: { userId: auth.sub },
        select: { targetCalories: true, targetWaterMl: true, targetExerciseMin: true, targetSleepMin: true },
      }),
    ])

    const caloriesConsumed = foodEntries.reduce((sum, e) => sum + e.calories, 0)
    const caloriesBurned = exerciseEntries.reduce((sum, e) => sum + e.caloriesBurned, 0)
    const waterConsumedMl = waterEntries.reduce((sum, e) => sum + e.amountMl, 0)
    const exerciseMinutes = exerciseEntries.reduce((sum, e) => sum + e.durationMin, 0)

    const targetCalories = profile?.targetCalories ?? 2000
    const waterTargetMl = profile?.targetWaterMl ?? 2000
    const exerciseTargetMin = profile?.targetExerciseMin ?? 30

    const caloriesRemaining = targetCalories - caloriesConsumed + caloriesBurned

    const sleepDurationMin = sleepEntry?.durationMin ?? 0
    const sleepQuality = sleepEntry?.quality ?? null
    const sleepTargetMin = profile?.targetSleepMin ?? 480

    return NextResponse.json({
      success: true,
      data: {
        caloriesConsumed,
        caloriesBurned,
        caloriesRemaining,
        waterConsumedMl,
        waterTargetMl,
        exerciseMinutes,
        exerciseTargetMin,
        targetCalories,
        sleepDurationMin,
        sleepQuality,
        sleepTargetMin,
      },
    })
  } catch (error) {
    console.error('GET /api/ai/health-tracker/dashboard error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
