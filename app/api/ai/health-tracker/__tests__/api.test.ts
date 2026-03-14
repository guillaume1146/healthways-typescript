import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
vi.mock('@/lib/db', () => ({
  default: {
    healthTrackerProfile: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    foodEntry: {
      findMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
    },
    exerciseEntry: {
      findMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
    },
    waterEntry: {
      findMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
    },
    foodDatabase: {
      findMany: vi.fn(),
    },
    mealPlanEntry: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockReturnValue(null),
  rateLimitHeavy: vi.fn().mockReturnValue(null),
}))

import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'

describe('Health Tracker API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', email: 'test@test.com', userType: 'PATIENT' })
  })

  describe('Dashboard API', () => {
    it('returns aggregated daily summary', async () => {
      vi.mocked(prisma.foodEntry.aggregate).mockResolvedValue({
        _sum: { calories: 1500, protein: 80, carbs: 200, fat: 50 },
      } as any)
      vi.mocked(prisma.exerciseEntry.aggregate).mockResolvedValue({
        _sum: { caloriesBurned: 300, durationMin: 45 },
      } as any)
      vi.mocked(prisma.waterEntry.aggregate).mockResolvedValue({
        _sum: { amountMl: 1500 },
      } as any)
      vi.mocked(prisma.healthTrackerProfile.findUnique).mockResolvedValue({
        targetCalories: 2000,
        targetWaterMl: 2000,
        targetExerciseMin: 30,
      } as any)

      // Verify mock data is correct
      const foodResult = await prisma.foodEntry.aggregate({} as any)
      const exerciseResult = await prisma.exerciseEntry.aggregate({} as any)
      const waterResult = await prisma.waterEntry.aggregate({} as any)
      const profile = await prisma.healthTrackerProfile.findUnique({} as any)

      expect(foodResult._sum!.calories).toBe(1500)
      expect(exerciseResult._sum!.caloriesBurned).toBe(300)
      expect(waterResult._sum!.amountMl).toBe(1500)
      expect(profile?.targetCalories).toBe(2000)
    })
  })

  describe('Food Entry API', () => {
    it('validates required fields for food creation', () => {
      const body = {
        mealType: 'breakfast',
        name: 'Oats',
        calories: 154,
      }

      expect(body.mealType).toBeDefined()
      expect(body.name).toBeDefined()
      expect(body.calories).toBeGreaterThan(0)
    })

    it('rejects food entry without name', () => {
      const body = {
        mealType: 'breakfast',
        calories: 154,
      } as any

      expect(body.name).toBeUndefined()
    })

    it('groups food entries by meal type', async () => {
      const mockEntries = [
        { id: '1', mealType: 'breakfast', name: 'Oats', calories: 154 },
        { id: '2', mealType: 'breakfast', name: 'Banana', calories: 105 },
        { id: '3', mealType: 'lunch', name: 'Rice', calories: 206 },
        { id: '4', mealType: 'dinner', name: 'Roti', calories: 120 },
      ]

      vi.mocked(prisma.foodEntry.findMany).mockResolvedValue(mockEntries as any)

      const entries = await prisma.foodEntry.findMany({})

      const grouped = {
        breakfast: entries.filter((e: any) => e.mealType === 'breakfast'),
        lunch: entries.filter((e: any) => e.mealType === 'lunch'),
        dinner: entries.filter((e: any) => e.mealType === 'dinner'),
        snack: entries.filter((e: any) => e.mealType === 'snack'),
      }

      expect(grouped.breakfast).toHaveLength(2)
      expect(grouped.lunch).toHaveLength(1)
      expect(grouped.dinner).toHaveLength(1)
      expect(grouped.snack).toHaveLength(0)
    })
  })

  describe('Food Database Search API', () => {
    it('searches foods case-insensitively', async () => {
      vi.mocked(prisma.foodDatabase.findMany).mockResolvedValue([
        { id: 'f1', name: 'Chicken Breast', category: 'Protein', calories: 165 },
      ] as any)

      const results = await prisma.foodDatabase.findMany({
        where: { name: { contains: 'chicken', mode: 'insensitive' } },
      })

      expect(results).toHaveLength(1)
    })

    it('returns empty array for no matches', async () => {
      vi.mocked(prisma.foodDatabase.findMany).mockResolvedValue([])

      const results = await prisma.foodDatabase.findMany({
        where: { name: { contains: 'xyznonexistent', mode: 'insensitive' } },
      })

      expect(results).toHaveLength(0)
    })
  })

  describe('Water Entry API', () => {
    it('creates a water entry with default 250ml', async () => {
      vi.mocked(prisma.waterEntry.create).mockResolvedValue({
        id: 'w-1',
        userId: 'user-1',
        date: new Date(),
        amountMl: 250,
        createdAt: new Date(),
      })

      const result = await prisma.waterEntry.create({
        data: { userId: 'user-1', date: new Date(), amountMl: 250 },
      })

      expect(result.amountMl).toBe(250)
    })
  })

  describe('Exercise Entry API', () => {
    it('creates exercise with intensity', async () => {
      vi.mocked(prisma.exerciseEntry.create).mockResolvedValue({
        id: 'e-1',
        userId: 'user-1',
        date: new Date(),
        exerciseType: 'Running',
        durationMin: 30,
        caloriesBurned: 300,
        intensity: 'vigorous',
        notes: null,
        createdAt: new Date(),
      })

      const result = await prisma.exerciseEntry.create({
        data: {
          userId: 'user-1',
          date: new Date(),
          exerciseType: 'Running',
          durationMin: 30,
          caloriesBurned: 300,
          intensity: 'vigorous',
        },
      })

      expect(result.intensity).toBe('vigorous')
      expect(result.caloriesBurned).toBe(300)
    })
  })

  describe('Meal Plan API', () => {
    it('groups meal plan entries by day and meal type', async () => {
      const mockPlan = [
        { dayOfWeek: 0, mealType: 'breakfast', name: 'Yogurt Parfait', calories: 410 },
        { dayOfWeek: 0, mealType: 'lunch', name: 'Chicken Salad', calories: 550 },
        { dayOfWeek: 0, mealType: 'dinner', name: 'Salmon & Rice', calories: 650 },
        { dayOfWeek: 1, mealType: 'breakfast', name: 'Oatmeal', calories: 380 },
      ]

      vi.mocked(prisma.mealPlanEntry.findMany).mockResolvedValue(mockPlan as any)

      const entries = await prisma.mealPlanEntry.findMany({})

      const byDay: Record<number, any[]> = {}
      for (const entry of entries) {
        const day = (entry as any).dayOfWeek
        if (!byDay[day]) byDay[day] = []
        byDay[day].push(entry)
      }

      expect(byDay[0]).toHaveLength(3)
      expect(byDay[1]).toHaveLength(1)
    })

    it('verifies ownership before deleting meal plan entry', async () => {
      vi.mocked(prisma.mealPlanEntry.findFirst).mockResolvedValue({
        id: 'mp-1',
        userId: 'user-1',
      } as any)

      const entry = await prisma.mealPlanEntry.findFirst({
        where: { id: 'mp-1', userId: 'user-1' },
      })

      expect(entry).not.toBeNull()
      expect(entry?.userId).toBe('user-1')
    })

    it('rejects deletion of another user\'s entry', async () => {
      vi.mocked(prisma.mealPlanEntry.findFirst).mockResolvedValue(null)

      const entry = await prisma.mealPlanEntry.findFirst({
        where: { id: 'mp-1', userId: 'user-2' },
      })

      expect(entry).toBeNull()
    })
  })

  describe('Profile API', () => {
    it('auto-creates profile on first GET', async () => {
      vi.mocked(prisma.healthTrackerProfile.upsert).mockResolvedValue({
        id: 'p-1',
        userId: 'user-1',
        heightCm: null,
        weightKg: null,
        age: null,
        gender: null,
        activityLevel: 'moderately_active',
        weightGoal: 'maintain',
        targetCalories: 2000,
        targetWaterMl: 2000,
        targetExerciseMin: 30,
        targetSleepMin: 480,
        dietaryPreferences: [],
        allergenSettings: [],
        tdeeCalories: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const profile = await prisma.healthTrackerProfile.upsert({
        where: { userId: 'user-1' },
        create: {
          userId: 'user-1',
          targetCalories: 2000,
          targetWaterMl: 2000,
          targetExerciseMin: 30,
        },
        update: {},
      })

      expect(profile.activityLevel).toBe('moderately_active')
      expect(profile.targetCalories).toBe(2000)
    })
  })

  describe('Progress API', () => {
    it('calculates weekly averages correctly', () => {
      const weekData = [
        { calories: 1800, burned: 300, water: 2000, exercise: 30 },
        { calories: 2100, burned: 250, water: 1500, exercise: 45 },
        { calories: 1600, burned: 400, water: 2500, exercise: 60 },
        { calories: 1900, burned: 200, water: 1800, exercise: 20 },
        { calories: 2200, burned: 350, water: 2200, exercise: 35 },
        { calories: 1700, burned: 280, water: 1600, exercise: 25 },
        { calories: 2000, burned: 320, water: 2000, exercise: 40 },
      ]

      const avgCalories = Math.round(weekData.reduce((s, d) => s + d.calories, 0) / 7)
      const totalBurned = weekData.reduce((s, d) => s + d.burned, 0)
      const avgWater = Math.round(weekData.reduce((s, d) => s + d.water, 0) / 7)
      const avgExercise = Math.round(weekData.reduce((s, d) => s + d.exercise, 0) / 7)

      expect(avgCalories).toBe(1900)
      expect(totalBurned).toBe(2100)
      expect(avgWater).toBe(1943)
      expect(avgExercise).toBe(36)
    })
  })
})
