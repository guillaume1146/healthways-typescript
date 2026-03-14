import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/db', () => ({
  default: {
    sleepEntry: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    healthTrackerProfile: {
      findUnique: vi.fn(),
    },
    foodEntry: {
      findMany: vi.fn(),
    },
    exerciseEntry: {
      findMany: vi.fn(),
    },
    waterEntry: {
      findMany: vi.fn(),
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

describe('Sleep & Food Scan API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', email: 'test@test.com', userType: 'PATIENT' })
  })

  // ──────────────────────────────────────────────
  // Sleep API Tests
  // ──────────────────────────────────────────────

  describe('GET /api/ai/health-tracker/sleep', () => {
    it('returns sleep entry for a date', async () => {
      const { GET } = await import('../sleep/route')

      const mockEntry = {
        id: 'sleep-1',
        userId: 'user-1',
        date: new Date('2026-03-14T00:00:00.000Z'),
        durationMin: 450,
        quality: 'good',
        sleepStart: new Date('2026-03-13T22:30:00.000Z'),
        sleepEnd: new Date('2026-03-14T06:00:00.000Z'),
        notes: null,
        createdAt: new Date(),
      }

      vi.mocked(prisma.sleepEntry.findFirst).mockResolvedValue(mockEntry as any)
      vi.mocked(prisma.healthTrackerProfile.findUnique).mockResolvedValue({
        targetSleepMin: 480,
      } as any)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/sleep?date=2026-03-14')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data.entry).toBeDefined()
      expect(json.data.entry.id).toBe('sleep-1')
      expect(json.data.entry.durationMin).toBe(450)
      expect(json.data.entry.quality).toBe('good')
      expect(json.data.targetSleepMin).toBe(480)
    })

    it('returns null entry when no sleep logged', async () => {
      const { GET } = await import('../sleep/route')

      vi.mocked(prisma.sleepEntry.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.healthTrackerProfile.findUnique).mockResolvedValue({
        targetSleepMin: 480,
      } as any)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/sleep?date=2026-03-14')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data.entry).toBeNull()
      expect(json.data.targetSleepMin).toBe(480)
    })

    it('requires date parameter', async () => {
      const { GET } = await import('../sleep/route')

      const request = new NextRequest('http://localhost/api/ai/health-tracker/sleep')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json.success).toBe(false)
      expect(json.message).toBe('date query parameter is required')
    })
  })

  describe('POST /api/ai/health-tracker/sleep', () => {
    it('creates/upserts sleep entry', async () => {
      const { POST } = await import('../sleep/route')

      const mockEntry = {
        id: 'sleep-2',
        userId: 'user-1',
        date: new Date('2026-03-14T00:00:00.000Z'),
        durationMin: 450,
        quality: 'good',
        sleepStart: null,
        sleepEnd: null,
        notes: null,
        createdAt: new Date(),
      }

      vi.mocked(prisma.sleepEntry.upsert).mockResolvedValue(mockEntry as any)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/sleep', {
        method: 'POST',
        body: JSON.stringify({ date: '2026-03-14', durationMin: 450, quality: 'good' }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(201)
      expect(json.success).toBe(true)
      expect(json.data.id).toBe('sleep-2')
      expect(json.data.durationMin).toBe(450)
      expect(json.data.quality).toBe('good')
      expect(vi.mocked(prisma.sleepEntry.upsert)).toHaveBeenCalledOnce()
    })

    it('requires date and durationMin', async () => {
      const { POST } = await import('../sleep/route')

      const request = new NextRequest('http://localhost/api/ai/health-tracker/sleep', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json.success).toBe(false)
      expect(json.message).toBe('date and durationMin are required')
    })

    it('defaults quality to fair when not provided', async () => {
      const { POST } = await import('../sleep/route')

      vi.mocked(prisma.sleepEntry.upsert).mockResolvedValue({
        id: 'sleep-3',
        userId: 'user-1',
        date: new Date('2026-03-14T00:00:00.000Z'),
        durationMin: 360,
        quality: 'fair',
        sleepStart: null,
        sleepEnd: null,
        notes: null,
        createdAt: new Date(),
      } as any)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/sleep', {
        method: 'POST',
        body: JSON.stringify({ date: '2026-03-14', durationMin: 360 }),
      })

      await POST(request)

      const upsertCall = vi.mocked(prisma.sleepEntry.upsert).mock.calls[0][0]
      expect(upsertCall.create.quality).toBe('fair')
      expect(upsertCall.update.quality).toBe('fair')
    })
  })

  describe('DELETE /api/ai/health-tracker/sleep/[id]', () => {
    it('deletes own entry', async () => {
      const { DELETE } = await import('../sleep/[id]/route')

      vi.mocked(prisma.sleepEntry.findUnique).mockResolvedValue({
        userId: 'user-1',
      } as any)
      vi.mocked(prisma.sleepEntry.delete).mockResolvedValue({} as any)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/sleep/sleep-1', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: Promise.resolve({ id: 'sleep-1' }) })
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data.id).toBe('sleep-1')
      expect(vi.mocked(prisma.sleepEntry.delete)).toHaveBeenCalledWith({ where: { id: 'sleep-1' } })
    })

    it('rejects other user\'s entry with 403', async () => {
      const { DELETE } = await import('../sleep/[id]/route')

      vi.mocked(prisma.sleepEntry.findUnique).mockResolvedValue({
        userId: 'user-999',
      } as any)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/sleep/sleep-1', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: Promise.resolve({ id: 'sleep-1' }) })
      const json = await response.json()

      expect(response.status).toBe(403)
      expect(json.success).toBe(false)
      expect(json.message).toBe('Forbidden')
      expect(vi.mocked(prisma.sleepEntry.delete)).not.toHaveBeenCalled()
    })

    it('returns 404 for missing entry', async () => {
      const { DELETE } = await import('../sleep/[id]/route')

      vi.mocked(prisma.sleepEntry.findUnique).mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/sleep/nonexistent', {
        method: 'DELETE',
      })

      const response = await DELETE(request, { params: Promise.resolve({ id: 'nonexistent' }) })
      const json = await response.json()

      expect(response.status).toBe(404)
      expect(json.success).toBe(false)
      expect(json.message).toBe('Sleep entry not found')
    })
  })

  // ──────────────────────────────────────────────
  // Food Scan API Tests
  // ──────────────────────────────────────────────

  describe('POST /api/ai/health-tracker/food-scan', () => {
    let fetchSpy: ReturnType<typeof vi.spyOn>
    const originalEnv = process.env.GROQ_API_KEY

    beforeEach(() => {
      process.env.GROQ_API_KEY = 'test-key'
      fetchSpy = vi.spyOn(global, 'fetch')
    })

    afterEach(() => {
      fetchSpy.mockRestore()
      if (originalEnv !== undefined) {
        process.env.GROQ_API_KEY = originalEnv
      } else {
        delete process.env.GROQ_API_KEY
      }
    })

    it('identifies food from image', async () => {
      const { POST } = await import('../food-scan/route')

      const groqResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              name: 'Chicken Curry',
              description: 'A plate of chicken curry with rice',
              estimatedCalories: 350,
              estimatedProtein: 25,
              estimatedCarbs: 40,
              estimatedFat: 12,
              confidence: 'high',
            }),
          },
        }],
      }

      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => groqResponse,
      } as Response)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/food-scan', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: 'data:image/jpeg;base64,/9j/4AAQ...' }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data.name).toBe('Chicken Curry')
      expect(json.data.calories).toBe(350)
      expect(json.data.protein).toBe(25)
      expect(json.data.carbs).toBe(40)
      expect(json.data.fat).toBe(12)
      expect(json.data.confidence).toBe('high')
    })

    it('handles VLM parsing failure gracefully', async () => {
      const { POST } = await import('../food-scan/route')

      fetchSpy.mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: 'I see some food on a plate but I cannot identify it clearly.',
            },
          }],
        }),
      } as Response)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/food-scan', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: 'data:image/jpeg;base64,/9j/4AAQ...' }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data.name).toBe('Unknown food')
      expect(json.data.calories).toBe(0)
      expect(json.data.protein).toBe(0)
      expect(json.data.carbs).toBe(0)
      expect(json.data.fat).toBe(0)
    })

    it('requires imageBase64', async () => {
      const { POST } = await import('../food-scan/route')

      const request = new NextRequest('http://localhost/api/ai/health-tracker/food-scan', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json.success).toBe(false)
      expect(json.message).toBe('imageBase64 is required')
    })

    it('handles Groq API error with 502', async () => {
      const { POST } = await import('../food-scan/route')

      fetchSpy.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      } as Response)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/food-scan', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: 'data:image/jpeg;base64,/9j/4AAQ...' }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(502)
      expect(json.success).toBe(false)
      expect(json.message).toBe('AI vision service error')
    })

    it('unauthorized returns 401', async () => {
      const { POST } = await import('../food-scan/route')

      vi.mocked(validateRequest).mockReturnValue(null)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/food-scan', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: 'data:image/jpeg;base64,/9j/4AAQ...' }),
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(401)
      expect(json.success).toBe(false)
      expect(json.message).toBe('Unauthorized')
    })
  })

  // ──────────────────────────────────────────────
  // Dashboard Integration Test (sleep data)
  // ──────────────────────────────────────────────

  describe('GET /api/ai/health-tracker/dashboard - sleep integration', () => {
    it('includes sleep data in dashboard summary', async () => {
      const { GET } = await import('../dashboard/route')

      vi.mocked(prisma.foodEntry.findMany).mockResolvedValue([
        { calories: 500 },
        { calories: 700 },
      ] as any)
      vi.mocked(prisma.exerciseEntry.findMany).mockResolvedValue([
        { caloriesBurned: 200, durationMin: 30 },
      ] as any)
      vi.mocked(prisma.waterEntry.findMany).mockResolvedValue([
        { amountMl: 500 },
        { amountMl: 750 },
      ] as any)
      vi.mocked(prisma.sleepEntry.findFirst).mockResolvedValue({
        durationMin: 420,
        quality: 'good',
      } as any)
      vi.mocked(prisma.healthTrackerProfile.findUnique).mockResolvedValue({
        targetCalories: 2000,
        targetWaterMl: 2500,
        targetExerciseMin: 45,
        targetSleepMin: 480,
      } as any)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/dashboard')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data.sleepDurationMin).toBe(420)
      expect(json.data.sleepQuality).toBe('good')
      expect(json.data.sleepTargetMin).toBe(480)
      // Also verify other dashboard fields are present
      expect(json.data.caloriesConsumed).toBe(1200)
      expect(json.data.caloriesBurned).toBe(200)
      expect(json.data.waterConsumedMl).toBe(1250)
      expect(json.data.exerciseMinutes).toBe(30)
    })
  })

  // ──────────────────────────────────────────────
  // Progress Integration Test (sleep data)
  // ──────────────────────────────────────────────

  describe('GET /api/ai/health-tracker/progress - sleep integration', () => {
    it('includes sleep data in daily progress and totals/averages', async () => {
      const { GET } = await import('../progress/route')

      // Build dates for the past 7 days
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      const startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)

      // Create sleep entries for 3 of the 7 days
      const sleepEntries = [
        { date: new Date(startDate.getTime()), durationMin: 420, quality: 'good' },
        { date: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), durationMin: 380, quality: 'fair' },
        { date: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000), durationMin: 500, quality: 'excellent' },
      ]

      vi.mocked(prisma.foodEntry.findMany).mockResolvedValue([])
      vi.mocked(prisma.exerciseEntry.findMany).mockResolvedValue([])
      vi.mocked(prisma.waterEntry.findMany).mockResolvedValue([])
      vi.mocked(prisma.sleepEntry.findMany).mockResolvedValue(sleepEntries as any)

      const request = new NextRequest('http://localhost/api/ai/health-tracker/progress?period=week')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)

      // Verify days array has sleepMin field
      expect(json.data.days).toHaveLength(7)
      for (const day of json.data.days) {
        expect(day).toHaveProperty('sleepMin')
      }

      // Verify totals include sleep
      const totalSleep = 420 + 380 + 500 // = 1300
      expect(json.data.totals.sleep).toBe(totalSleep)

      // Verify averages include sleep
      expect(json.data.averages.sleep).toBe(Math.round(totalSleep / 7))
    })
  })
})
