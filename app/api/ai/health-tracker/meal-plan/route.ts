import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'

/**
 * GET /api/ai/health-tracker/meal-plan?weekStart=2026-03-09 - Get meal plan for a week
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
    const weekStartParam = searchParams.get('weekStart')

    if (!weekStartParam) {
      return NextResponse.json(
        { success: false, message: 'weekStart query parameter is required' },
        { status: 400 }
      )
    }

    const weekStartDate = new Date(weekStartParam + 'T00:00:00.000Z')
    const weekEndDate = new Date(weekStartDate.getTime() + 7 * 24 * 60 * 60 * 1000)

    const entries = await prisma.mealPlanEntry.findMany({
      where: {
        userId: auth.sub,
        weekStartDate: { gte: weekStartDate, lt: weekEndDate },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { mealType: 'asc' }],
    })

    // Group by dayOfWeek, then by mealType
    const grouped: Record<number, Record<string, typeof entries>> = {}
    const dailyTotals: Record<number, { calories: number; protein: number; carbs: number; fat: number }> = {}

    for (let day = 0; day < 7; day++) {
      grouped[day] = { breakfast: [], lunch: [], dinner: [], snack: [] }
      dailyTotals[day] = { calories: 0, protein: 0, carbs: 0, fat: 0 }
    }

    for (const entry of entries) {
      const day = entry.dayOfWeek
      if (grouped[day] && grouped[day][entry.mealType]) {
        grouped[day][entry.mealType].push(entry)
        dailyTotals[day].calories += entry.calories
        dailyTotals[day].protein += entry.protein
        dailyTotals[day].carbs += entry.carbs
        dailyTotals[day].fat += entry.fat
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        weekStartDate: weekStartParam,
        days: grouped,
        dailyTotals,
      },
    })
  } catch (error) {
    console.error('GET /api/ai/health-tracker/meal-plan error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
