import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'
import { calculateTdee, calculateTargetCalories } from '@/lib/utils/tdee'

/**
 * GET /api/ai/health-tracker/profile - Get or auto-create health tracker profile
 */
export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { limit: 30, windowMs: 60_000, prefix: 'health-tracker' })
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    let profile = await prisma.healthTrackerProfile.findUnique({
      where: { userId: auth.sub },
    })

    if (!profile) {
      profile = await prisma.healthTrackerProfile.create({
        data: { userId: auth.sub },
      })
    }

    return NextResponse.json({ success: true, data: profile })
  } catch (error) {
    console.error('GET /api/ai/health-tracker/profile error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

/**
 * PUT /api/ai/health-tracker/profile - Update profile fields
 */
export async function PUT(request: NextRequest) {
  const limited = rateLimit(request, { limit: 30, windowMs: 60_000, prefix: 'health-tracker' })
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const allowedFields = [
      'heightCm', 'weightKg', 'age', 'gender', 'activityLevel', 'weightGoal',
      'targetCalories', 'targetWaterMl', 'targetExerciseMin',
      'dietaryPreferences', 'allergenSettings',
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Auto-calculate TDEE and targetCalories when height/weight/age are available
    const existing = await prisma.healthTrackerProfile.findUnique({
      where: { userId: auth.sub },
    })

    const heightCm = (updateData.heightCm as number) ?? existing?.heightCm
    const weightKg = (updateData.weightKg as number) ?? existing?.weightKg
    const age = (updateData.age as number) ?? existing?.age
    const gender = (updateData.gender as string) ?? existing?.gender
    const activityLevel = (updateData.activityLevel as string) ?? existing?.activityLevel ?? 'moderately_active'
    const weightGoal = (updateData.weightGoal as string) ?? existing?.weightGoal ?? 'maintain'

    if (heightCm && weightKg && age) {
      const tdeeResult = calculateTdee({
        heightCm,
        weightKg,
        age,
        gender: gender || 'male',
        activityLevel,
      })
      updateData.tdeeCalories = tdeeResult.tdee

      // Only auto-set targetCalories if user didn't explicitly provide it
      if (updateData.targetCalories === undefined) {
        updateData.targetCalories = calculateTargetCalories(tdeeResult.tdee, weightGoal)
      }
    }

    const profile = await prisma.healthTrackerProfile.upsert({
      where: { userId: auth.sub },
      create: { userId: auth.sub, ...updateData },
      update: updateData,
    })

    return NextResponse.json({ success: true, data: profile })
  } catch (error) {
    console.error('PUT /api/ai/health-tracker/profile error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
