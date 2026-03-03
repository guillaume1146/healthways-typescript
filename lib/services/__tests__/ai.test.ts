import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Prisma before importing the module
vi.mock('@/lib/db', () => ({
  default: {
    user: { findUnique: vi.fn() },
    aiChatSession: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), findMany: vi.fn() },
    aiChatMessage: { findMany: vi.fn(), createMany: vi.fn() },
    aiPatientInsight: { findMany: vi.fn(), createMany: vi.fn() },
  },
}))

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

import prisma from '@/lib/db'
import { getRecentInsights, extractAndStoreInsights, getPatientInsights } from '../ai'

describe('AI Service - Dietary Insight Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getRecentInsights', () => {
    it('returns empty string when no insights exist', async () => {
      vi.mocked(prisma.aiPatientInsight.findMany).mockResolvedValue([])

      const result = await getRecentInsights('user-123', 14)

      expect(result).toBe('')
      expect(prisma.aiPatientInsight.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          date: { gte: expect.any(Date) },
        },
        orderBy: { date: 'desc' },
        select: {
          date: true,
          category: true,
          summary: true,
        },
      })
    })

    it('returns formatted summary grouped by date', async () => {
      const today = new Date()
      const yesterday = new Date(Date.now() - 86400000)

      vi.mocked(prisma.aiPatientInsight.findMany).mockResolvedValue([
        { date: today, category: 'food', summary: 'Had sardines and rice for lunch' } as never,
        { date: today, category: 'exercise', summary: '30 min walking' } as never,
        { date: yesterday, category: 'food', summary: 'Ate fruits and yogurt for breakfast' } as never,
      ])

      const result = await getRecentInsights('user-123')

      expect(result).toContain('PATIENT RECENT HISTORY')
      expect(result).toContain('[food] Had sardines and rice for lunch')
      expect(result).toContain('[exercise] 30 min walking')
      expect(result).toContain('[food] Ate fruits and yogurt for breakfast')
    })

    it('queries with correct date range', async () => {
      vi.mocked(prisma.aiPatientInsight.findMany).mockResolvedValue([])

      await getRecentInsights('user-123', 7)

      const call = vi.mocked(prisma.aiPatientInsight.findMany).mock.calls[0][0]
      const sinceDate = (call as { where: { date: { gte: Date } } }).where.date.gte
      const daysAgo = (Date.now() - sinceDate.getTime()) / (24 * 60 * 60 * 1000)

      // Should be approximately 7 days ago (allow 1 second tolerance)
      expect(daysAgo).toBeGreaterThan(6.99)
      expect(daysAgo).toBeLessThan(7.01)
    })
  })

  describe('extractAndStoreInsights', () => {
    const apiKey = 'test-api-key'

    it('extracts insights from user message and stores them', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: JSON.stringify([
                { date: '2026-03-03', category: 'food', summary: 'Ate sardines for lunch' },
                { date: '2026-03-03', category: 'food', summary: 'Had rice and vegetables for dinner' },
              ]),
            },
          }],
        }),
      })

      await extractAndStoreInsights(
        'user-123',
        'I ate sardines for lunch and rice with vegetables for dinner',
        'Great choices! Sardines are rich in omega-3...',
        apiKey
      )

      expect(prisma.aiPatientInsight.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            userId: 'user-123',
            category: 'food',
            summary: 'Ate sardines for lunch',
          }),
          expect.objectContaining({
            userId: 'user-123',
            category: 'food',
            summary: 'Had rice and vegetables for dinner',
          }),
        ]),
      })
    })

    it('silently handles empty extraction (no health info in message)', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: '[]' } }],
        }),
      })

      await extractAndStoreInsights('user-123', 'Hello, how are you?', 'I am fine!', apiKey)

      expect(prisma.aiPatientInsight.createMany).not.toHaveBeenCalled()
    })

    it('silently handles API failure', async () => {
      mockFetch.mockResolvedValue({ ok: false })

      // Should not throw
      await extractAndStoreInsights('user-123', 'test', 'test', apiKey)
      expect(prisma.aiPatientInsight.createMany).not.toHaveBeenCalled()
    })

    it('filters out invalid categories', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: JSON.stringify([
                { date: '2026-03-03', category: 'food', summary: 'Ate an apple' },
                { date: '2026-03-03', category: 'invalid_category', summary: 'Some text' },
              ]),
            },
          }],
        }),
      })

      await extractAndStoreInsights('user-123', 'I ate an apple', 'Good choice!', apiKey)

      const call = vi.mocked(prisma.aiPatientInsight.createMany).mock.calls[0][0]
      expect((call as { data: unknown[] }).data).toHaveLength(1)
    })

    it('handles malformed JSON from LLM gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'This is not valid JSON' } }],
        }),
      })

      // Should not throw
      await extractAndStoreInsights('user-123', 'test', 'test', apiKey)
      expect(prisma.aiPatientInsight.createMany).not.toHaveBeenCalled()
    })
  })

  describe('getPatientInsights', () => {
    it('retrieves insights for the specified number of days', async () => {
      const mockInsights = [
        { id: '1', date: new Date(), category: 'food', summary: 'Ate rice', createdAt: new Date() },
        { id: '2', date: new Date(), category: 'exercise', summary: 'Walked 2km', createdAt: new Date() },
      ]
      vi.mocked(prisma.aiPatientInsight.findMany).mockResolvedValue(mockInsights as never)

      const result = await getPatientInsights('user-123', 7)

      expect(result).toEqual(mockInsights)
      expect(prisma.aiPatientInsight.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          date: { gte: expect.any(Date) },
        },
        orderBy: { date: 'desc' },
        select: {
          id: true,
          date: true,
          category: true,
          summary: true,
          createdAt: true,
        },
      })
    })
  })
})
