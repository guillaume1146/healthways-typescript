import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies before importing the route
vi.mock('@/lib/db', () => ({
  default: {
    doctorProfile: {
      findMany: vi.fn(),
    },
    nurseProfile: {
      findMany: vi.fn(),
    },
    nannyProfile: {
      findMany: vi.fn(),
    },
    pharmacyMedicine: {
      findMany: vi.fn(),
    },
    providerReview: {
      findMany: vi.fn(() => []),
    },
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitSearch: vi.fn(() => null),
}))

import { GET } from '../search/route'
import prisma from '@/lib/db'

function createSearchRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/search')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url)
}

// Helper to create a mock doctor profile
function mockDoctor(overrides: Record<string, unknown> = {}) {
  return {
    id: 'doc-profile-1',
    specialty: ['Cardiology'],
    rating: 4.8,
    reviewCount: 42,
    location: 'Port Louis',
    bio: 'Experienced cardiologist',
    languages: ['English', 'French'],
    subSpecialties: [],
    specialInterests: [],
    category: 'Specialist',
    experience: '10 years',
    consultationTypes: ['In-Person', 'Video'],
    emergencyAvailable: false,
    consultationFee: 2000,
    videoConsultationFee: 1500,
    nextAvailable: null,
    user: {
      id: 'user-doc-1',
      firstName: 'Sarah',
      lastName: 'Smith',
      profileImage: null,
      phone: '+230-555-0001',
      verified: true,
      address: 'Port Louis, Mauritius',
    },
    ...overrides,
  }
}

// Helper to create a mock nurse profile
function mockNurse(overrides: Record<string, unknown> = {}) {
  return {
    id: 'nurse-profile-1',
    specializations: ['ICU', 'Pediatrics'],
    experience: 5,
    user: {
      id: 'user-nurse-1',
      firstName: 'Alice',
      lastName: 'Brown',
      profileImage: null,
      phone: '+230-555-0002',
      verified: true,
      address: 'Curepipe, Mauritius',
    },
    ...overrides,
  }
}

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: return empty arrays for all profiles
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([])
    vi.mocked(prisma.nurseProfile.findMany).mockResolvedValue([])
    vi.mocked(prisma.nannyProfile.findMany).mockResolvedValue([])
    vi.mocked(prisma.pharmacyMedicine.findMany).mockResolvedValue([])
  })

  it('returns empty results when no data matches', async () => {
    const res = await GET(createSearchRequest({ q: 'nonexistent' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual([])
    expect(data.total).toBe(0)
    expect(data.page).toBe(1)
  })

  it('returns correct response structure', async () => {
    const res = await GET(createSearchRequest())
    const data = await res.json()

    expect(data).toHaveProperty('success', true)
    expect(data).toHaveProperty('data')
    expect(data).toHaveProperty('total')
    expect(data).toHaveProperty('page')
    expect(data).toHaveProperty('limit')
    expect(data).toHaveProperty('totalPages')
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('searches doctors by query text', async () => {
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([
      mockDoctor() as never,
    ])

    const res = await GET(createSearchRequest({ q: 'Cardiology' }))
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].name).toBe('Dr. Sarah Smith')
    expect(data.data[0].type).toBe('doctor')
    expect(data.data[0].specialty).toContain('Cardiology')
  })

  it('filters by type=doctors to only search doctors', async () => {
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([
      mockDoctor() as never,
    ])

    const res = await GET(createSearchRequest({ type: 'doctors' }))
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].type).toBe('doctor')

    // Should NOT query nurses, nannies, or medicines
    expect(prisma.nurseProfile.findMany).not.toHaveBeenCalled()
    expect(prisma.nannyProfile.findMany).not.toHaveBeenCalled()
    expect(prisma.pharmacyMedicine.findMany).not.toHaveBeenCalled()
  })

  it('filters by type=nurses to only search nurses', async () => {
    vi.mocked(prisma.nurseProfile.findMany).mockResolvedValue([
      mockNurse() as never,
    ])

    const res = await GET(createSearchRequest({ type: 'nurses' }))
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].type).toBe('nurse')
    expect(prisma.doctorProfile.findMany).not.toHaveBeenCalled()
  })

  it('searches all types when type=all', async () => {
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([
      mockDoctor() as never,
    ])
    vi.mocked(prisma.nurseProfile.findMany).mockResolvedValue([
      mockNurse() as never,
    ])

    const res = await GET(createSearchRequest({ type: 'all' }))
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.data.length).toBeGreaterThanOrEqual(2)

    // All profile types should have been queried
    expect(prisma.doctorProfile.findMany).toHaveBeenCalled()
    expect(prisma.nurseProfile.findMany).toHaveBeenCalled()
    expect(prisma.nannyProfile.findMany).toHaveBeenCalled()
    expect(prisma.pharmacyMedicine.findMany).toHaveBeenCalled()
  })

  it('handles pagination with page and limit params', async () => {
    // Create 5 doctors to test pagination
    const doctors = Array.from({ length: 5 }, (_, i) =>
      mockDoctor({
        id: `doc-profile-${i}`,
        user: {
          id: `user-doc-${i}`,
          firstName: 'Doctor',
          lastName: `Number${i}`,
          profileImage: null,
          phone: '+230-555-0001',
          verified: true,
          address: 'Port Louis',
        },
      })
    )
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue(doctors as never)

    // Request page 2 with limit 2
    const res = await GET(createSearchRequest({ type: 'doctors', page: '2', limit: '2' }))
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.page).toBe(2)
    expect(data.limit).toBe(2)
    expect(data.total).toBe(5)
    expect(data.totalPages).toBe(3)
    expect(data.data).toHaveLength(2)
  })

  it('returns first page when page param is not set', async () => {
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([
      mockDoctor() as never,
    ])

    const res = await GET(createSearchRequest({ type: 'doctors' }))
    const data = await res.json()

    expect(data.page).toBe(1)
  })

  it('clamps limit to maximum of 50', async () => {
    const res = await GET(createSearchRequest({ limit: '100' }))
    const data = await res.json()

    expect(data.limit).toBe(50)
  })

  it('clamps limit to minimum of 1', async () => {
    const res = await GET(createSearchRequest({ limit: '0' }))
    const data = await res.json()

    expect(data.limit).toBe(1)
  })

  it('clamps page to minimum of 1', async () => {
    const res = await GET(createSearchRequest({ page: '-1' }))
    const data = await res.json()

    expect(data.page).toBe(1)
  })

  it('filters doctors by query matching name', async () => {
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([
      mockDoctor() as never,
      mockDoctor({
        id: 'doc-profile-2',
        user: {
          id: 'user-doc-2',
          firstName: 'John',
          lastName: 'Doe',
          profileImage: null,
          phone: '+230-555-0003',
          verified: true,
          address: 'Quatre Bornes',
        },
      }) as never,
    ])

    const res = await GET(createSearchRequest({ q: 'Sarah', type: 'doctors' }))
    const data = await res.json()

    expect(data.data).toHaveLength(1)
    expect(data.data[0].name).toContain('Sarah')
  })

  it('returns empty data on database error', async () => {
    vi.mocked(prisma.doctorProfile.findMany).mockRejectedValue(
      new Error('Database connection failed')
    )

    const res = await GET(createSearchRequest({ type: 'doctors' }))
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.data).toEqual([])
    expect(data.total).toBe(0)
  })

  it('sorts results with available first, then by rating descending', async () => {
    const availableDoctor = mockDoctor({
      id: 'doc-avail',
      rating: 4.5,
      nextAvailable: null, // available now
      user: {
        id: 'user-avail',
        firstName: 'Available',
        lastName: 'Doc',
        profileImage: null,
        phone: '+230-555-0010',
        verified: true,
        address: 'Port Louis',
      },
    })
    const unavailableDoctor = mockDoctor({
      id: 'doc-unavail',
      rating: 5.0,
      nextAvailable: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // far future
      user: {
        id: 'user-unavail',
        firstName: 'Unavailable',
        lastName: 'Doc',
        profileImage: null,
        phone: '+230-555-0011',
        verified: true,
        address: 'Port Louis',
      },
    })

    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([
      unavailableDoctor as never,
      availableDoctor as never,
    ])

    const res = await GET(createSearchRequest({ type: 'doctors' }))
    const data = await res.json()

    expect(data.data).toHaveLength(2)
    // Available doctor should come first despite lower rating
    expect(data.data[0].name).toContain('Available')
    expect(data.data[1].name).toContain('Unavailable')
  })

  it('returns correct detailHref for different types', async () => {
    vi.mocked(prisma.doctorProfile.findMany).mockResolvedValue([
      mockDoctor() as never,
    ])
    vi.mocked(prisma.nurseProfile.findMany).mockResolvedValue([
      mockNurse() as never,
    ])

    const res = await GET(createSearchRequest({ type: 'all' }))
    const data = await res.json()

    const doctor = data.data.find((r: { type: string }) => r.type === 'doctor')
    const nurse = data.data.find((r: { type: string }) => r.type === 'nurse')

    expect(doctor.detailHref).toMatch(/^\/search\/doctors\//)
    expect(nurse.detailHref).toMatch(/^\/search\/nurses\//)
  })
})
