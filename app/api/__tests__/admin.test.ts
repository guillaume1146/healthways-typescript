import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing routes
vi.mock('@/lib/db', () => ({
  default: {
    user: { count: vi.fn(), findMany: vi.fn() },
    appointment: { count: vi.fn() },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitAuth: vi.fn(() => null),
  rateLimitPublic: vi.fn(() => null),
}))

import { GET as getSystemHealth } from '../admin/system-health/route'
import { GET as getSecurity } from '../admin/security/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'GET' })
}

describe('GET /api/admin/system-health', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getSystemHealth(createGetRequest('/api/admin/system-health'))

    expect(res.status).toBe(401)
  })

  it('returns 200 with system health data', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: 'admin@example.com' })
    vi.mocked(prisma.user.count)
      .mockResolvedValueOnce(50 as never) // total users
      .mockResolvedValueOnce(45 as never) // active users
    vi.mocked(prisma.appointment.count).mockResolvedValue(200 as never)

    const res = await getSystemHealth(createGetRequest('/api/admin/system-health'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.services).toBeDefined()
    expect(data.data.performance).toBeDefined()
    expect(data.data.overallHealth).toBeDefined()
    expect(data.data.totalUsers).toBe(50)
    expect(data.data.activeUsers).toBe(45)
    expect(data.data.totalAppointments).toBe(200)
  })
})

describe('GET /api/admin/security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getSecurity(createGetRequest('/api/admin/security'))

    expect(res.status).toBe(401)
  })

  it('returns 200 with security data', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: 'admin@example.com' })
    vi.mocked(prisma.user.count)
      .mockResolvedValueOnce(2 as never) // suspended
      .mockResolvedValueOnce(5 as never) // pending
      .mockResolvedValueOnce(50 as never) // total
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      {
        id: 'u1', firstName: 'New', lastName: 'User', email: 'new@example.com',
        userType: 'PATIENT', accountStatus: 'active', createdAt: new Date(),
      },
    ] as never)

    const res = await getSecurity(createGetRequest('/api/admin/security'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.suspendedAccounts).toBe(2)
    expect(data.data.pendingAccounts).toBe(5)
    expect(data.data.totalUsers).toBe(50)
    expect(data.data.recentRegistrations).toHaveLength(1)
    expect(data.data.securityEvents).toBeDefined()
  })
})
