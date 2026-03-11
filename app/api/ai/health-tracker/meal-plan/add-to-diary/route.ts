import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'

/**
 * POST /api/ai/health-tracker/meal-plan/add-to-diary - Copy a meal plan entry to food diary
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
    const { mealPlanEntryId, date } = body

    if (!mealPlanEntryId || !date) {
      return NextResponse.json(
        { success: false, message: 'mealPlanEntryId and date are required' },
        { status: 400 }
      )
    }

    // Fetch the meal plan entry and verify ownership
    const mealPlanEntry = await prisma.mealPlanEntry.findUnique({
      where: { id: mealPlanEntryId },
    })

    if (!mealPlanEntry) {
      return NextResponse.json(
        { success: false, message: 'Meal plan entry not found' },
        { status: 404 }
      )
    }

    if (mealPlanEntry.userId !== auth.sub) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    // Create a food entry from the meal plan entry
    const foodEntry = await prisma.foodEntry.create({
      data: {
        userId: auth.sub,
        date: new Date(date + 'T00:00:00.000Z'),
        time: new Date(),
        mealType: mealPlanEntry.mealType,
        name: mealPlanEntry.name,
        calories: mealPlanEntry.calories,
        protein: mealPlanEntry.protein,
        carbs: mealPlanEntry.carbs,
        fat: mealPlanEntry.fat,
      },
    })

    return NextResponse.json({ success: true, data: foodEntry }, { status: 201 })
  } catch (error) {
    console.error('POST /api/ai/health-tracker/meal-plan/add-to-diary error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
