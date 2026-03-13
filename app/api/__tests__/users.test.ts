import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing the route
vi.mock('@/lib/db', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    patientProfile: {
      findUnique: vi.fn(),
    },
    patientEmergencyContact: {
      upsert: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn(() => null),
}))

vi.mock('@/lib/validations/api', () => ({
  updateUserProfileSchema: {
    safeParse: vi.fn((data: unknown) => ({ success: true, data })),
  },
}))

import { GET, PATCH } from '../users/[id]/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(id: string) {
  return new NextRequest(`http://localhost:3000/api/users/${id}`, {
    method: 'GET',
  })
}

function createPatchRequest(id: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost:3000/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await GET(createGetRequest('user-1'), mockParams('user-1'))
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.message).toBe('Unauthorized')
  })

  it('returns 403 when auth.sub does not match id', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'patient', email: 'a@b.com' })

    const res = await GET(createGetRequest('user-1'), mockParams('user-1'))
    const data = await res.json()

    expect(res.status).toBe(403)
    expect(data.message).toBe('Forbidden')
  })

  it('returns 200 with user data when authenticated', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'john@example.com' })

    const mockUser = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+230 5123 4567',
      profileImage: null,
      userType: 'PATIENT',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      address: '123 Main St',
      verified: true,
      accountStatus: 'active',
      createdAt: new Date(),
    }

    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce(mockUser as never) // first call for basic user
      .mockResolvedValueOnce({ ...mockUser, patientProfile: { bloodType: 'A+' } } as never) // second call with profile

    const res = await GET(createGetRequest('user-1'), mockParams('user-1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.data.id).toBe('user-1')
    expect(data.data.firstName).toBe('John')
  })

  it('returns 404 when user not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'john@example.com' })
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const res = await GET(createGetRequest('user-1'), mockParams('user-1'))
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.message).toBe('User not found')
  })
})

describe('PATCH /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await PATCH(
      createPatchRequest('user-1', { firstName: 'Jane' }),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.message).toBe('Unauthorized')
  })

  it('returns 403 when auth.sub does not match id', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'patient', email: 'a@b.com' })

    const res = await PATCH(
      createPatchRequest('user-1', { firstName: 'Jane' }),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(403)
    expect(data.message).toBe('Forbidden')
  })

  it('returns 200 with updated user data', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'john@example.com' })

    const updatedUser = {
      id: 'user-1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+230 5123 4567',
      profileImage: null,
      userType: 'PATIENT',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'female',
      address: '123 Main St',
    }

    vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as never)

    const res = await PATCH(
      createPatchRequest('user-1', { firstName: 'Jane' }),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.data.firstName).toBe('Jane')
  })
})
