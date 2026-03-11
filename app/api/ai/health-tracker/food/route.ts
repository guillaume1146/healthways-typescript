import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'

/**
 * GET /api/ai/health-tracker/food?date=2026-03-11 - Get food entries for a date
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

    const entries = await prisma.foodEntry.findMany({
      where: {
        userId: auth.sub,
        date: { gte: startOfDay, lt: endOfDay },
      },
      orderBy: { time: 'asc' },
    })

    const grouped = {
      breakfast: entries.filter(e => e.mealType === 'breakfast'),
      lunch: entries.filter(e => e.mealType === 'lunch'),
      dinner: entries.filter(e => e.mealType === 'dinner'),
      snack: entries.filter(e => e.mealType === 'snack'),
    }

    const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)
    const totalProtein = entries.reduce((sum, e) => sum + e.protein, 0)
    const totalCarbs = entries.reduce((sum, e) => sum + e.carbs, 0)
    const totalFat = entries.reduce((sum, e) => sum + e.fat, 0)

    return NextResponse.json({
      success: true,
      data: {
        ...grouped,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      },
    })
  } catch (error) {
    console.error('GET /api/ai/health-tracker/food error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

/**
 * POST /api/ai/health-tracker/food - Create a food entry
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
    const { date, mealType, name, calories, protein, carbs, fat, fiber, quantity, unit, servingSize, foodDbId } = body

    if (!date || !mealType || !name || calories === undefined) {
      return NextResponse.json(
        { success: false, message: 'date, mealType, name, and calories are required' },
        { status: 400 }
      )
    }

    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack']
    if (!validMealTypes.includes(mealType)) {
      return NextResponse.json(
        { success: false, message: 'mealType must be one of: breakfast, lunch, dinner, snack' },
        { status: 400 }
      )
    }

    const entry = await prisma.foodEntry.create({
      data: {
        userId: auth.sub,
        date: new Date(date + 'T00:00:00.000Z'),
        time: new Date(),
        mealType,
        name,
        calories: Math.round(calories),
        protein: protein ?? 0,
        carbs: carbs ?? 0,
        fat: fat ?? 0,
        fiber: fiber ?? 0,
        quantity: quantity ?? 1,
        unit: unit ?? 'serving',
        servingSize: servingSize ?? null,
        foodDbId: foodDbId ?? null,
      },
    })

    return NextResponse.json({ success: true, data: entry }, { status: 201 })
  } catch (error) {
    console.error('POST /api/ai/health-tracker/food error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
