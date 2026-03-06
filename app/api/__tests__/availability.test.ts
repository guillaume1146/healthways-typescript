import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing routes
vi.mock('@/lib/db', () => ({
  default: {
    providerAvailability: { findMany: vi.fn(), deleteMany: vi.fn(), createMany: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn(() => null),
}))

vi.mock('@/lib/validations/api', () => ({
  updateAvailabilitySchema: {
    safeParse: vi.fn((data: unknown) => ({ success: true, data })),
  },
}))

import { GET, PUT } from '../users/[id]/availability/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'GET' })
}

function createPutRequest(url: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost:3000${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/users/[id]/availability', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await GET(
      createGetRequest('/api/users/user-1/availability'),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 403 when auth.sub does not match id', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'doctor', email: 'd@example.com' })

    const res = await GET(
      createGetRequest('/api/users/user-1/availability'),
      mockParams('user-1')
    )

    expect(res.status).toBe(403)
  })

  it('returns 200 with availability slots', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'doctor', email: 'd@example.com' })
    vi.mocked(prisma.providerAvailability.findMany).mockResolvedValue([
      {
        id: 'slot-1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00',
        isActive: true, createdAt: new Date(), updatedAt: new Date(),
      },
      {
        id: 'slot-2', dayOfWeek: 3, startTime: '09:00', endTime: '13:00',
        isActive: true, createdAt: new Date(), updatedAt: new Date(),
      },
    ] as never)

    const res = await GET(
      createGetRequest('/api/users/user-1/availability'),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(2)
  })

  it('returns 200 filtered by dayOfWeek', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'doctor', email: 'd@example.com' })
    vi.mocked(prisma.providerAvailability.findMany).mockResolvedValue([
      {
        id: 'slot-1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00',
        isActive: true, createdAt: new Date(), updatedAt: new Date(),
      },
    ] as never)

    const res = await GET(
      createGetRequest('/api/users/user-1/availability?dayOfWeek=1'),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
  })
})

describe('PUT /api/users/[id]/availability', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await PUT(
      createPutRequest('/api/users/user-1/availability', { slots: [] }),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 403 when auth.sub does not match id', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'doctor', email: 'd@example.com' })

    const res = await PUT(
      createPutRequest('/api/users/user-1/availability', { slots: [] }),
      mockParams('user-1')
    )

    expect(res.status).toBe(403)
  })

  it('returns 200 with updated availability', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'doctor', email: 'd@example.com' })

    const newSlots = [
      { id: 'slot-new', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ]
    vi.mocked(prisma.$transaction).mockResolvedValue(newSlots as never)

    const res = await PUT(
      createPutRequest('/api/users/user-1/availability', {
        slots: [{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true }],
      }),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })
})
