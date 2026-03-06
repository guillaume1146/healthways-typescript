import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db', () => ({
  default: {
    userPreference: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

import { GET, PUT } from '../users/[id]/preferences/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'

const userId = '550e8400-e29b-41d4-a716-446655440000'

function createRequest(method: string, body?: unknown): NextRequest {
  const url = new URL(`http://localhost:3000/api/users/${userId}/preferences`)
  const init: { method: string; body?: string; headers?: Record<string, string> } = { method }
  if (body) {
    init.body = JSON.stringify(body)
    init.headers = { 'Content-Type': 'application/json' }
  }
  return new NextRequest(url, init)
}

describe('GET /api/users/[id]/preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)
    const res = await GET(createRequest('GET'), { params: Promise.resolve({ id: userId }) })
    expect(res.status).toBe(401)
  })

  it('returns 403 when accessing another users preferences', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'PATIENT' } as never)
    const res = await GET(createRequest('GET'), { params: Promise.resolve({ id: userId }) })
    expect(res.status).toBe(403)
  })

  it('returns defaults when no preferences exist', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: userId, userType: 'PATIENT' } as never)
    vi.mocked(prisma.userPreference.findUnique).mockResolvedValue(null)

    const res = await GET(createRequest('GET'), { params: Promise.resolve({ id: userId }) })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.language).toBe('en')
    expect(data.data.profileVisibility).toBe('public')
  })

  it('returns existing preferences', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: userId, userType: 'PATIENT' } as never)
    vi.mocked(prisma.userPreference.findUnique).mockResolvedValue({
      id: 'pref-1',
      userId,
      language: 'fr',
      timezone: 'Indian/Mauritius',
      emailNotifications: false,
      pushNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      marketingEmails: false,
      profileVisibility: 'connections',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const res = await GET(createRequest('GET'), { params: Promise.resolve({ id: userId }) })
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.data.language).toBe('fr')
    expect(data.data.profileVisibility).toBe('connections')
  })
})

describe('PUT /api/users/[id]/preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)
    const res = await PUT(createRequest('PUT', { language: 'fr' }), { params: Promise.resolve({ id: userId }) })
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid language', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: userId, userType: 'PATIENT' } as never)
    const res = await PUT(createRequest('PUT', { language: 'invalid' }), { params: Promise.resolve({ id: userId }) })
    expect(res.status).toBe(400)
  })

  it('upserts preferences successfully', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: userId, userType: 'PATIENT' } as never)
    vi.mocked(prisma.userPreference.upsert).mockResolvedValue({
      id: 'pref-1',
      userId,
      language: 'fr',
      timezone: 'Indian/Mauritius',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      marketingEmails: false,
      profileVisibility: 'public',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const res = await PUT(createRequest('PUT', { language: 'fr' }), { params: Promise.resolve({ id: userId }) })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.language).toBe('fr')
    expect(prisma.userPreference.upsert).toHaveBeenCalled()
  })
})
