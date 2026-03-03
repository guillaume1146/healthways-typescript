import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  default: {
    aiPatientInsight: {
      findMany: vi.fn(),
    },
  },
}))

// Mock the auth validation
vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

// Mock the AI service
vi.mock('@/lib/services/ai', () => ({
  getPatientInsights: vi.fn(),
}))

import { GET } from '@/app/api/ai/insights/route'
import { validateRequest } from '@/lib/auth/validate'
import { getPatientInsights } from '@/lib/services/ai'

function createInsightsRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/ai/insights')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url)
}

describe('GET /api/ai/insights', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await GET(createInsightsRequest())
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.message).toBe('Unauthorized')
  })

  it('returns insights data for authenticated user', async () => {
    const mockInsights = [
      { id: '1', date: new Date().toISOString(), category: 'food', summary: 'Ate rice and fish', createdAt: new Date().toISOString() },
      { id: '2', date: new Date().toISOString(), category: 'exercise', summary: 'Walked 3km', createdAt: new Date().toISOString() },
    ]

    vi.mocked(validateRequest).mockReturnValue({
      sub: 'user-123',
      userType: 'PATIENT',
      email: 'patient@example.com',
    })
    vi.mocked(getPatientInsights).mockResolvedValue(mockInsights as never)

    const res = await GET(createInsightsRequest())
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual(mockInsights)
  })

  it('uses default 14 days when no days param provided', async () => {
    vi.mocked(validateRequest).mockReturnValue({
      sub: 'user-123',
      userType: 'PATIENT',
      email: 'patient@example.com',
    })
    vi.mocked(getPatientInsights).mockResolvedValue([])

    await GET(createInsightsRequest())

    expect(getPatientInsights).toHaveBeenCalledWith('user-123', 14)
  })

  it('uses custom days param when provided', async () => {
    vi.mocked(validateRequest).mockReturnValue({
      sub: 'user-123',
      userType: 'PATIENT',
      email: 'patient@example.com',
    })
    vi.mocked(getPatientInsights).mockResolvedValue([])

    await GET(createInsightsRequest({ days: '7' }))

    expect(getPatientInsights).toHaveBeenCalledWith('user-123', 7)
  })

  it('caps days param at 90', async () => {
    vi.mocked(validateRequest).mockReturnValue({
      sub: 'user-123',
      userType: 'PATIENT',
      email: 'patient@example.com',
    })
    vi.mocked(getPatientInsights).mockResolvedValue([])

    await GET(createInsightsRequest({ days: '365' }))

    expect(getPatientInsights).toHaveBeenCalledWith('user-123', 90)
  })

  it('returns empty array when no insights exist', async () => {
    vi.mocked(validateRequest).mockReturnValue({
      sub: 'user-123',
      userType: 'PATIENT',
      email: 'patient@example.com',
    })
    vi.mocked(getPatientInsights).mockResolvedValue([])

    const res = await GET(createInsightsRequest())
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual([])
  })

  it('returns 500 when service throws an error', async () => {
    vi.mocked(validateRequest).mockReturnValue({
      sub: 'user-123',
      userType: 'PATIENT',
      email: 'patient@example.com',
    })
    vi.mocked(getPatientInsights).mockRejectedValue(new Error('Database error'))

    const res = await GET(createInsightsRequest())
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.message).toBe('Failed to load insights')
  })

  it('passes the authenticated user ID to getPatientInsights', async () => {
    vi.mocked(validateRequest).mockReturnValue({
      sub: 'specific-user-id-456',
      userType: 'PATIENT',
      email: 'specific@example.com',
    })
    vi.mocked(getPatientInsights).mockResolvedValue([])

    await GET(createInsightsRequest({ days: '30' }))

    expect(getPatientInsights).toHaveBeenCalledWith('specific-user-id-456', 30)
  })
})
