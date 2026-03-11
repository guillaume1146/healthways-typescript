import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitHeavy } from '@/lib/rate-limit'
import prisma from '@/lib/db'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

interface GroqResponse {
  id: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
}

interface MealPlanItem {
  dayOfWeek: number
  mealType: string
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

/**
 * POST /api/ai/health-tracker/meal-plan/generate - AI-generate a weekly meal plan
 */
export async function POST(request: NextRequest) {
  const limited = rateLimitHeavy(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: 'AI service is not configured' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { weekStart } = body

    if (!weekStart) {
      return NextResponse.json(
        { success: false, message: 'weekStart is required' },
        { status: 400 }
      )
    }

    const weekStartDate = new Date(weekStart + 'T00:00:00.000Z')

    // Fetch user's health tracker profile
    const profile = await prisma.healthTrackerProfile.findUnique({
      where: { userId: auth.sub },
    })

    const targetCalories = profile?.targetCalories ?? 2000
    const dietaryPreferences = profile?.dietaryPreferences ?? []
    const allergenSettings = profile?.allergenSettings ?? []
    const weightGoal = profile?.weightGoal ?? 'maintain'

    const prompt = `You are a nutrition expert. Generate a 7-day meal plan as a JSON array.

Requirements:
- Target daily calories: ${targetCalories} kcal
- Weight goal: ${weightGoal}
- Dietary preferences: ${dietaryPreferences.length > 0 ? dietaryPreferences.join(', ') : 'None'}
- Allergens to AVOID: ${allergenSettings.length > 0 ? allergenSettings.join(', ') : 'None'}
- Include meals tailored to Mauritian cuisine when possible
- Each day should have breakfast, lunch, dinner, and 1-2 snacks
- Distribute calories appropriately across meals

Return ONLY a valid JSON array with no markdown or explanation. Each item must have:
- "dayOfWeek": number 0 (Monday) through 6 (Sunday)
- "mealType": one of "breakfast", "lunch", "dinner", "snack"
- "name": meal name (string)
- "description": brief description with ingredients (string)
- "calories": estimated calories (number)
- "protein": grams of protein (number)
- "carbs": grams of carbs (number)
- "fat": grams of fat (number)

JSON ARRAY:`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Groq API error:', response.status, errorBody)
      return NextResponse.json(
        { success: false, message: 'AI service error' },
        { status: 502 }
      )
    }

    const data: GroqResponse = await response.json()
    const raw = data.choices?.[0]?.message?.content?.trim()

    if (!raw) {
      return NextResponse.json(
        { success: false, message: 'No response from AI service' },
        { status: 502 }
      )
    }

    // Parse JSON array from response
    const jsonMatch = raw.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error('Failed to parse meal plan JSON:', raw)
      return NextResponse.json(
        { success: false, message: 'Failed to parse AI response' },
        { status: 502 }
      )
    }

    const parsed: MealPlanItem[] = JSON.parse(jsonMatch[0])
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json(
        { success: false, message: 'AI returned an empty meal plan' },
        { status: 502 }
      )
    }

    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

    const validEntries = parsed.filter(
      item =>
        typeof item.dayOfWeek === 'number' &&
        item.dayOfWeek >= 0 &&
        item.dayOfWeek <= 6 &&
        validMealTypes.includes(item.mealType) &&
        item.name &&
        typeof item.calories === 'number'
    )

    // Delete existing plan for this week
    const weekEndDate = new Date(weekStartDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    await prisma.mealPlanEntry.deleteMany({
      where: {
        userId: auth.sub,
        weekStartDate: { gte: weekStartDate, lt: weekEndDate },
      },
    })

    // Create new entries
    const created = await prisma.mealPlanEntry.createMany({
      data: validEntries.map(item => ({
        userId: auth.sub,
        weekStartDate,
        dayOfWeek: item.dayOfWeek,
        mealType: item.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        name: item.name,
        description: item.description || null,
        calories: Math.round(item.calories),
        protein: item.protein ?? 0,
        carbs: item.carbs ?? 0,
        fat: item.fat ?? 0,
        isGenerated: true,
      })),
    })

    // Fetch the created entries to return
    const entries = await prisma.mealPlanEntry.findMany({
      where: {
        userId: auth.sub,
        weekStartDate: { gte: weekStartDate, lt: weekEndDate },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { mealType: 'asc' }],
    })

    return NextResponse.json({
      success: true,
      data: {
        weekStartDate: weekStart,
        entriesCreated: created.count,
        entries,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/ai/health-tracker/meal-plan/generate error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
