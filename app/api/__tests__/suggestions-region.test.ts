import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing the route
vi.mock('@/lib/db', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    userConnection: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

import { GET } from '../connections/suggestions/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'GET' })
}

const makeMockUser = (id: string, userType: string, regionId?: string) => ({
  id,
  firstName: `User${id}`,
  lastName: 'Test',
  profileImage: null,
  userType,
  doctorProfile: null,
  nurseProfile: null,
})

describe('GET /api/connections/suggestions - Region filtering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: no existing connections
    vi.mocked(prisma.userConnection.findMany).mockResolvedValue([])
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await GET(createGetRequest('/api/connections/suggestions'))
    const json = await res.json()

    expect(res.status).toBe(401)
    expect(json.success).toBe(false)
    expect(json.message).toBe('Unauthorized')
  })

  it('returns same-region suggestions first for users with regionId', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'a@b.com' } as never)

    // Current user has regionId
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ regionId: 'reg-mu' } as never)

    // Same-region users fill the limit
    const sameRegionUsers = [
      makeMockUser('user-2', 'DOCTOR'),
      makeMockUser('user-3', 'NURSE'),
      makeMockUser('user-4', 'DOCTOR'),
      makeMockUser('user-5', 'PATIENT'),
      makeMockUser('user-6', 'PHARMACIST'),
      makeMockUser('user-7', 'DOCTOR'),
      makeMockUser('user-8', 'NURSE'),
      makeMockUser('user-9', 'PATIENT'),
      makeMockUser('user-10', 'DOCTOR'),
      makeMockUser('user-11', 'NANNY'),
    ]

    vi.mocked(prisma.user.findMany).mockResolvedValueOnce(sameRegionUsers as never)

    const res = await GET(createGetRequest('/api/connections/suggestions'))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(10)

    // Should have queried with regionId filter
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          regionId: 'reg-mu',
        }),
      })
    )
  })

  it('returns all suggestions for users without regionId (backwards compat)', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'a@b.com' } as never)

    // Current user has no regionId
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ regionId: null } as never)

    const allUsers = [
      makeMockUser('user-2', 'DOCTOR'),
      makeMockUser('user-3', 'NURSE'),
    ]
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce(allUsers as never)

    const res = await GET(createGetRequest('/api/connections/suggestions'))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(2)

    // Should NOT have queried with regionId filter
    const findManyCall = vi.mocked(prisma.user.findMany).mock.calls[0][0]
    expect(findManyCall?.where).not.toHaveProperty('regionId')
  })

  it('fills with other-region users when not enough same-region users', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'a@b.com' } as never)

    // Current user has regionId
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ regionId: 'reg-mu' } as never)

    // Only 3 same-region users (fewer than limit of 10)
    const sameRegionUsers = [
      makeMockUser('user-2', 'DOCTOR'),
      makeMockUser('user-3', 'NURSE'),
      makeMockUser('user-4', 'PATIENT'),
    ]

    // Other-region users fill the gap
    const otherRegionUsers = [
      makeMockUser('user-5', 'DOCTOR'),
      makeMockUser('user-6', 'PHARMACIST'),
    ]

    vi.mocked(prisma.user.findMany)
      .mockResolvedValueOnce(sameRegionUsers as never) // first call: same region
      .mockResolvedValueOnce(otherRegionUsers as never) // second call: other regions

    const res = await GET(createGetRequest('/api/connections/suggestions'))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    // 3 same-region + 2 other-region = 5 total
    expect(json.data).toHaveLength(5)

    // Second call should exclude same-region users and use different regionId filter
    expect(prisma.user.findMany).toHaveBeenCalledTimes(2)
    const secondCall = vi.mocked(prisma.user.findMany).mock.calls[1][0]
    expect(secondCall?.where).toHaveProperty('regionId', { not: 'reg-mu' })
  })

  it('excludes already-connected users from suggestions', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'a@b.com' } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ regionId: null } as never)

    // User is connected to user-2 and user-3
    vi.mocked(prisma.userConnection.findMany).mockResolvedValue([
      { senderId: 'user-1', receiverId: 'user-2' },
      { senderId: 'user-3', receiverId: 'user-1' },
    ] as never)

    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      makeMockUser('user-4', 'DOCTOR'),
    ] as never)

    const res = await GET(createGetRequest('/api/connections/suggestions'))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].id).toBe('user-4')

    // Verify the exclusion list includes self + connected users
    const findManyCall = vi.mocked(prisma.user.findMany).mock.calls[0][0]
    const idFilter = findManyCall?.where?.id as { notIn?: string[] } | undefined
    const notInIds = idFilter?.notIn
    expect(notInIds).toContain('user-1')
    expect(notInIds).toContain('user-2')
    expect(notInIds).toContain('user-3')
  })

  it('respects limit parameter', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'a@b.com' } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ regionId: null } as never)
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([makeMockUser('user-2', 'DOCTOR')] as never)

    await GET(createGetRequest('/api/connections/suggestions?limit=5'))

    const findManyCall = vi.mocked(prisma.user.findMany).mock.calls[0][0]
    expect(findManyCall?.take).toBe(5)
  })

  it('caps limit at 20', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'a@b.com' } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ regionId: null } as never)
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([] as never)

    await GET(createGetRequest('/api/connections/suggestions?limit=100'))

    const findManyCall = vi.mocked(prisma.user.findMany).mock.calls[0][0]
    expect(findManyCall?.take).toBe(20)
  })

  it('returns mapped suggestion data with connectionStatus', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'a@b.com' } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ regionId: null } as never)

    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      {
        id: 'doc-1',
        firstName: 'Dr',
        lastName: 'Smith',
        profileImage: '/avatar.jpg',
        userType: 'DOCTOR',
        doctorProfile: { specialty: ['Cardiology'] },
        nurseProfile: null,
      },
    ] as never)

    const res = await GET(createGetRequest('/api/connections/suggestions'))
    const json = await res.json()

    expect(json.data[0]).toEqual({
      id: 'doc-1',
      firstName: 'Dr',
      lastName: 'Smith',
      profileImage: '/avatar.jpg',
      userType: 'DOCTOR',
      specialty: ['Cardiology'],
      connectionStatus: 'none',
    })
  })

  it('returns 500 on database error', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'a@b.com' } as never)
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('DB error'))

    const res = await GET(createGetRequest('/api/connections/suggestions'))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
    expect(json.message).toBe('Failed to fetch suggestions')
  })
})
