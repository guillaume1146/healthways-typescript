import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db', () => ({
  default: {
    doctorProfile: { findUnique: vi.fn(), findFirst: vi.fn() },
    nurseProfile: { findUnique: vi.fn(), findFirst: vi.fn() },
    nannyProfile: { findUnique: vi.fn(), findFirst: vi.fn() },
    labTechProfile: { findUnique: vi.fn(), findFirst: vi.fn() },
    providerAvailability: { findMany: vi.fn() },
    scheduleSlot: { findMany: vi.fn() },
    appointment: { findMany: vi.fn() },
    nurseBooking: { findMany: vi.fn() },
    childcareBooking: { findMany: vi.fn() },
    labTestBooking: { findMany: vi.fn() },
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitSearch: vi.fn(() => null),
}))

import { GET } from '../bookings/available-slots/route'
import prisma from '@/lib/db'

function createRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost:3000/api/bookings/available-slots')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url)
}

describe('GET /api/bookings/available-slots', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when missing required params', async () => {
    const res = await GET(createRequest({}))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid providerType', async () => {
    const res = await GET(createRequest({
      providerId: 'abc',
      date: '2026-04-01',
      providerType: 'invalid',
    }))
    expect(res.status).toBe(400)
  })

  it('returns 404 when provider not found', async () => {
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.doctorProfile.findFirst).mockResolvedValue(null)

    const res = await GET(createRequest({
      providerId: 'nonexistent',
      date: '2026-04-01',
      providerType: 'doctor',
    }))
    expect(res.status).toBe(404)
  })

  it('returns empty slots when no availability configured', async () => {
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue({
      id: 'profile-1',
      userId: 'user-1',
    } as never)
    vi.mocked(prisma.providerAvailability.findMany).mockResolvedValue([])
    vi.mocked(prisma.scheduleSlot.findMany).mockResolvedValue([])

    const res = await GET(createRequest({
      providerId: 'profile-1',
      date: '2026-04-01',
      providerType: 'doctor',
    }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.slots).toEqual([])
  })

  it('returns available slots excluding booked ones', async () => {
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue({
      id: 'profile-1',
      userId: 'user-1',
    } as never)
    vi.mocked(prisma.providerAvailability.findMany).mockResolvedValue([
      {
        id: 'avail-1',
        userId: 'user-1',
        dayOfWeek: 2, // Tuesday
        startTime: '09:00',
        endTime: '12:00',
        slotDuration: 60,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    // 10:00 is booked
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([
      { scheduledAt: new Date('2026-04-01T10:00:00Z') },
    ] as never)

    const res = await GET(createRequest({
      providerId: 'profile-1',
      date: '2026-04-01',
      providerType: 'doctor',
    }))
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.slots).toContain('09:00')
    expect(data.slots).not.toContain('10:00')
    expect(data.slots).toContain('11:00')
  })

  it('resolves provider from userId fallback', async () => {
    vi.mocked(prisma.nurseProfile.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.nurseProfile.findFirst).mockResolvedValue({
      id: 'nurse-profile-1',
      userId: 'user-nurse-1',
    } as never)
    vi.mocked(prisma.providerAvailability.findMany).mockResolvedValue([])

    const res = await GET(createRequest({
      providerId: 'user-nurse-1',
      date: '2026-04-01',
      providerType: 'nurse',
    }))
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(prisma.nurseProfile.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-nurse-1' } })
    )
  })

  it('handles server errors gracefully', async () => {
    vi.mocked(prisma.doctorProfile.findUnique).mockRejectedValue(new Error('DB error'))

    const res = await GET(createRequest({
      providerId: 'profile-1',
      date: '2026-04-01',
      providerType: 'doctor',
    }))
    expect(res.status).toBe(500)
  })
})
