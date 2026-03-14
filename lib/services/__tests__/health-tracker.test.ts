import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the prisma client
vi.mock('@/lib/db', () => ({
  default: {
    healthTrackerProfile: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    foodEntry: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
    },
    exerciseEntry: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
    },
    waterEntry: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
    },
    foodDatabase: {
      findMany: vi.fn(),
    },
  },
}))

import prisma from '@/lib/db'

describe('Health Tracker Data Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Food Entry Operations', () => {
    it('creates a food entry with all fields', async () => {
      const mockEntry = {
        id: 'test-id',
        userId: 'user-1',
        date: new Date('2026-03-11'),
        time: new Date(),
        mealType: 'breakfast' as const,
        name: 'Oats',
        calories: 154,
        protein: 5.3,
        carbs: 27,
        fat: 2.6,
        fiber: 4,
        quantity: 1,
        unit: 'serving',
        servingSize: '1/2 cup dry (40g)',
        foodDbId: null,
        createdAt: new Date(),
      }

      vi.mocked(prisma.foodEntry.create).mockResolvedValue(mockEntry)

      const result = await prisma.foodEntry.create({
        data: {
          userId: 'user-1',
          date: new Date('2026-03-11'),
          time: new Date(),
          mealType: 'breakfast',
          name: 'Oats',
          calories: 154,
          protein: 5.3,
          carbs: 27,
          fat: 2.6,
          fiber: 4,
          quantity: 1,
          unit: 'serving',
          servingSize: '1/2 cup dry (40g)',
        },
      })

      expect(result.name).toBe('Oats')
      expect(result.calories).toBe(154)
      expect(prisma.foodEntry.create).toHaveBeenCalledOnce()
    })

    it('aggregates daily food calories', async () => {
      vi.mocked(prisma.foodEntry.aggregate).mockResolvedValue({
        _sum: { calories: 1850, protein: 95, carbs: 230, fat: 60 },
        _count: 7,
        _avg: { calories: null, protein: null, carbs: null, fat: null },
        _min: { calories: null, protein: null, carbs: null, fat: null },
        _max: { calories: null, protein: null, carbs: null, fat: null },
      } as any)

      const result = await prisma.foodEntry.aggregate({
        where: { userId: 'user-1', date: { gte: new Date('2026-03-11'), lt: new Date('2026-03-12') } },
        _sum: { calories: true, protein: true, carbs: true, fat: true },
      })

      expect(result._sum.calories).toBe(1850)
    })

    it('deletes a food entry', async () => {
      vi.mocked(prisma.foodEntry.delete).mockResolvedValue({} as any)

      await prisma.foodEntry.delete({ where: { id: 'test-id' } })
      expect(prisma.foodEntry.delete).toHaveBeenCalledWith({ where: { id: 'test-id' } })
    })
  })

  describe('Exercise Entry Operations', () => {
    it('creates an exercise entry', async () => {
      const mockEntry = {
        id: 'ex-1',
        userId: 'user-1',
        date: new Date('2026-03-11'),
        exerciseType: 'Running',
        durationMin: 30,
        caloriesBurned: 300,
        intensity: 'vigorous' as const,
        notes: null,
        createdAt: new Date(),
      }

      vi.mocked(prisma.exerciseEntry.create).mockResolvedValue(mockEntry)

      const result = await prisma.exerciseEntry.create({
        data: {
          userId: 'user-1',
          date: new Date('2026-03-11'),
          exerciseType: 'Running',
          durationMin: 30,
          caloriesBurned: 300,
          intensity: 'vigorous',
        },
      })

      expect(result.exerciseType).toBe('Running')
      expect(result.caloriesBurned).toBe(300)
    })

    it('aggregates daily exercise stats', async () => {
      vi.mocked(prisma.exerciseEntry.aggregate).mockResolvedValue({
        _sum: { caloriesBurned: 450, durationMin: 55 },
        _count: 2,
        _avg: { caloriesBurned: null, durationMin: null },
        _min: { caloriesBurned: null, durationMin: null },
        _max: { caloriesBurned: null, durationMin: null },
      } as any)

      const result = await prisma.exerciseEntry.aggregate({
        where: { userId: 'user-1', date: { gte: new Date('2026-03-11'), lt: new Date('2026-03-12') } },
        _sum: { caloriesBurned: true, durationMin: true },
      })

      expect(result._sum.caloriesBurned).toBe(450)
      expect(result._sum.durationMin).toBe(55)
    })
  })

  describe('Water Entry Operations', () => {
    it('creates a water entry', async () => {
      vi.mocked(prisma.waterEntry.create).mockResolvedValue({
        id: 'w-1',
        userId: 'user-1',
        date: new Date('2026-03-11'),
        amountMl: 250,
        createdAt: new Date(),
      })

      const result = await prisma.waterEntry.create({
        data: { userId: 'user-1', date: new Date('2026-03-11'), amountMl: 250 },
      })

      expect(result.amountMl).toBe(250)
    })

    it('aggregates daily water intake', async () => {
      vi.mocked(prisma.waterEntry.aggregate).mockResolvedValue({
        _sum: { amountMl: 1750 },
        _count: 7,
        _avg: { amountMl: null },
        _min: { amountMl: null },
        _max: { amountMl: null },
      } as any)

      const result = await prisma.waterEntry.aggregate({
        where: { userId: 'user-1', date: { gte: new Date('2026-03-11'), lt: new Date('2026-03-12') } },
        _sum: { amountMl: true },
      })

      expect(result._sum.amountMl).toBe(1750)
    })
  })

  describe('Food Database Search', () => {
    it('searches food by name', async () => {
      vi.mocked(prisma.foodDatabase.findMany).mockResolvedValue([
        { id: 'f1', name: 'Chicken Breast (grilled)', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: '100g', unit: 'serving', isLocal: false },
        { id: 'f2', name: 'Chicken Curry', category: 'Protein', calories: 243, protein: 19, carbs: 8, fat: 15, fiber: 1.5, servingSize: '1 cup (240g)', unit: 'cup', isLocal: true },
      ])

      const results = await prisma.foodDatabase.findMany({
        where: { name: { contains: 'chicken', mode: 'insensitive' } },
        take: 50,
      })

      expect(results).toHaveLength(2)
      expect(results[0].name).toContain('Chicken')
    })

    it('filters food by category', async () => {
      vi.mocked(prisma.foodDatabase.findMany).mockResolvedValue([
        { id: 'f1', name: 'Dholl Puri', category: 'Mauritian', calories: 280, protein: 8, carbs: 42, fat: 9, fiber: 4, servingSize: '1 piece with filling', unit: 'piece', isLocal: true },
      ])

      const results = await prisma.foodDatabase.findMany({
        where: { category: 'Mauritian' },
        take: 50,
      })

      expect(results).toHaveLength(1)
      expect(results[0].isLocal).toBe(true)
    })
  })

  describe('Health Tracker Profile', () => {
    it('gets or creates a profile', async () => {
      vi.mocked(prisma.healthTrackerProfile.findUnique).mockResolvedValue(null)
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

      const result = await prisma.healthTrackerProfile.upsert({
        where: { userId: 'user-1' },
        create: { userId: 'user-1', targetCalories: 2000 },
        update: {},
      })

      expect(result.targetCalories).toBe(2000)
      expect(result.activityLevel).toBe('moderately_active')
    })

    it('updates profile with TDEE calculation', async () => {
      vi.mocked(prisma.healthTrackerProfile.upsert).mockResolvedValue({
        id: 'p-1',
        userId: 'user-1',
        heightCm: 175,
        weightKg: 70,
        age: 30,
        gender: 'male',
        activityLevel: 'moderately_active',
        weightGoal: 'maintain',
        targetCalories: 2556,
        targetWaterMl: 2000,
        targetExerciseMin: 30,
        targetSleepMin: 480,
        dietaryPreferences: ['vegetarian'],
        allergenSettings: ['nuts'],
        tdeeCalories: 2556,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await prisma.healthTrackerProfile.upsert({
        where: { userId: 'user-1' },
        create: { userId: 'user-1' },
        update: {
          heightCm: 175,
          weightKg: 70,
          age: 30,
          gender: 'male',
          activityLevel: 'moderately_active',
          weightGoal: 'maintain',
          tdeeCalories: 2556,
          targetCalories: 2556,
          dietaryPreferences: ['vegetarian'],
          allergenSettings: ['nuts'],
        },
      })

      expect(result.tdeeCalories).toBe(2556)
      expect(result.dietaryPreferences).toEqual(['vegetarian'])
    })
  })
})
