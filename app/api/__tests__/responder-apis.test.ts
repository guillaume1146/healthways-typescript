import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  default: {
    emergencyWorkerProfile: { findUnique: vi.fn(), findFirst: vi.fn() },
    emergencyBooking: { findMany: vi.fn(), count: vi.fn() },
    userWallet: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn(() => null),
}))

import { GET as getBookingRequests } from '../responders/[id]/booking-requests/route'
import { GET as getCalls } from '../responders/[id]/calls/route'
import { GET as getDashboard } from '../responders/[id]/dashboard/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'GET' })
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/responders/[id]/booking-requests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getBookingRequests(
      createGetRequest('/api/responders/user-1/booking-requests'),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 403 for non-owner', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'ambulance', email: 'o@ex.com' })

    const res = await getBookingRequests(
      createGetRequest('/api/responders/user-1/booking-requests'),
      mockParams('user-1')
    )

    expect(res.status).toBe(403)
  })

  it('returns 200 with bookings for owner', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'resp-1', userType: 'ambulance', email: 'r@ex.com' })
    vi.mocked(prisma.emergencyWorkerProfile.findFirst).mockResolvedValue({ id: 'ewp-1' } as never)
    vi.mocked(prisma.emergencyBooking.findMany).mockResolvedValue([
      {
        id: 'eb-1', emergencyType: 'cardiac', location: 'Port Louis', status: 'pending',
        priority: 'high', notes: null, createdAt: new Date(),
        patient: { id: 'pat-1', userId: 'u-1', user: { firstName: 'Test', lastName: 'Patient', email: 'p@ex.com', phone: '123' } },
      },
    ] as never)

    const res = await getBookingRequests(
      createGetRequest('/api/responders/resp-1/booking-requests'),
      mockParams('resp-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })
})

describe('GET /api/responders/[id]/calls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getCalls(
      createGetRequest('/api/responders/user-1/calls'),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 403 for non-owner', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'ambulance', email: 'o@ex.com' })

    const res = await getCalls(
      createGetRequest('/api/responders/user-1/calls'),
      mockParams('user-1')
    )

    expect(res.status).toBe(403)
  })

  it('returns 200 with mapped call history', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'resp-1', userType: 'ambulance', email: 'r@ex.com' })
    vi.mocked(prisma.emergencyWorkerProfile.findUnique).mockResolvedValue({ id: 'ewp-1' } as never)
    vi.mocked(prisma.emergencyBooking.findMany).mockResolvedValue([
      {
        id: 'eb-1', emergencyType: 'cardiac', location: 'Port Louis',
        status: 'resolved', priority: 'high', notes: 'CPR administered',
        createdAt: new Date(),
        patient: { user: { firstName: 'Test', lastName: 'Patient' } },
      },
    ] as never)

    const res = await getCalls(
      createGetRequest('/api/responders/resp-1/calls'),
      mockParams('resp-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].status).toBe('completed') // 'resolved' maps to 'completed'
    expect(data.data[0].patientName).toBe('Test Patient')
  })
})

describe('GET /api/responders/[id]/dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getDashboard(
      createGetRequest('/api/responders/user-1/dashboard'),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with dashboard stats', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'resp-1', userType: 'ambulance', email: 'r@ex.com' })
    vi.mocked(prisma.emergencyWorkerProfile.findUnique).mockResolvedValue({ id: 'ewp-1' } as never)
    vi.mocked(prisma.emergencyBooking.count).mockResolvedValue(3 as never)
    vi.mocked(prisma.emergencyBooking.findMany).mockResolvedValue([] as never)
    vi.mocked(prisma.userWallet.findUnique).mockResolvedValue({ balance: 4500 } as never)

    const res = await getDashboard(
      createGetRequest('/api/responders/resp-1/dashboard'),
      mockParams('resp-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.stats.completedServices).toBe(3)
    expect(data.data.stats.walletBalance).toBe(4500)
  })
})
