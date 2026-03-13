import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Prisma before importing the route
vi.mock('@/lib/db', () => ({
  default: {
    user: {
      count: vi.fn(),
    },
    appointment: {
      count: vi.fn(),
    },
    doctorProfile: {
      findMany: vi.fn(),
    },
  },
}))

import { GET } from '../stats/route'
import prisma from '@/lib/db'

describe('GET /api/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns correct structure with all four stats', async () => {
    vi.mocked(prisma.user.count)
      .mockResolvedValueOnce(15) // doctorCount
      .mockResolvedValueOnce(200) // patientCount
    vi.mocked(prisma.appointment.count).mockResolvedValue(350)
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([
      { clinicAffiliation: 'Port Louis' },
      { clinicAffiliation: 'Curepipe' },
      { clinicAffiliation: 'Quatre Bornes' },
    ] as never)

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(4)

    // Values are real DB counts — no floor values
    expect(data.data[0]).toEqual({
      number: 15,
      label: 'Qualified Doctors',
      color: 'text-blue-500',
    })
    expect(data.data[1]).toEqual({
      number: 200,
      label: 'Happy Patients',
      color: 'text-green-500',
    })
    expect(data.data[2]).toEqual({
      number: 350,
      label: 'Consultations',
      color: 'text-purple-500',
    })
    expect(data.data[3]).toEqual({
      number: 3,
      label: 'Cities Covered',
      color: 'text-orange-500',
    })
  })

  it('queries doctors with active status filter', async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(0)
    vi.mocked(prisma.appointment.count).mockResolvedValue(0)
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([])

    await GET()

    // First call is for doctors (active only)
    expect(prisma.user.count).toHaveBeenCalledWith({
      where: { userType: 'DOCTOR', accountStatus: 'active' },
    })
    // Second call is for patients (all statuses)
    expect(prisma.user.count).toHaveBeenCalledWith({
      where: { userType: 'PATIENT' },
    })
  })

  it('returns 0 for city count when no cities found', async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(0)
    vi.mocked(prisma.appointment.count).mockResolvedValue(0)
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([])

    const res = await GET()
    const data = await res.json()

    expect(data.data[3].number).toBe(0)
  })

  it('returns zero stats on database error', async () => {
    vi.mocked(prisma.user.count).mockRejectedValue(new Error('DB connection failed'))

    const res = await GET()
    const data = await res.json()

    // The error handler returns success: true with zero values
    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(4)
    expect(data.data[0].number).toBe(0)
    expect(data.data[1].number).toBe(0)
    expect(data.data[2].number).toBe(0)
    expect(data.data[3].number).toBe(0)
  })

  it('returns correct labels and colors in fallback data', async () => {
    vi.mocked(prisma.user.count).mockRejectedValue(new Error('fail'))

    const res = await GET()
    const data = await res.json()

    const labels = data.data.map((d: { label: string }) => d.label)
    expect(labels).toEqual([
      'Qualified Doctors',
      'Happy Patients',
      'Consultations',
      'Cities Covered',
    ])

    const colors = data.data.map((d: { color: string }) => d.color)
    expect(colors).toEqual([
      'text-blue-500',
      'text-green-500',
      'text-purple-500',
      'text-orange-500',
    ])
  })

  it('queries distinct clinic affiliations for city count', async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(0)
    vi.mocked(prisma.appointment.count).mockResolvedValue(0)
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([])

    await GET()

    expect(prisma.doctorProfile.findMany).toHaveBeenCalledWith({
      where: { clinicAffiliation: { not: '' } },
      select: { clinicAffiliation: true },
      distinct: ['clinicAffiliation'],
    })
  })
})
