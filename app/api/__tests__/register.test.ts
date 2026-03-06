import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing the route
vi.mock('@/lib/db', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(() => '$2b$10$hashedpassword'),
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitAuth: vi.fn(() => null),
  rateLimitPublic: vi.fn(() => null),
}))

import { POST } from '../auth/register/route'
import prisma from '@/lib/db'
import { NextRequest } from 'next/server'

const baseRegistration = {
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  phone: '+230 5123 4567',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  address: '123 Main St, Port Louis',
  userType: 'patient',
  agreeToTerms: true,
  agreeToPrivacy: true,
  agreeToDisclaimer: true,
  documentVerifications: [],
  skippedDocuments: [],
}

function createRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 for missing required fields', async () => {
    const res = await POST(createRequest({ email: 'test@example.com' }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('returns 400 for invalid email', async () => {
    const res = await POST(createRequest({ ...baseRegistration, email: 'not-an-email' }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('returns 400 for short password', async () => {
    const res = await POST(createRequest({
      ...baseRegistration,
      password: '12',
      confirmPassword: '12',
    }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('returns 400 for password mismatch', async () => {
    const res = await POST(createRequest({
      ...baseRegistration,
      confirmPassword: 'differentpassword',
    }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('returns 409 when email already exists', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'existing-user',
      email: 'john@example.com',
    } as never)

    const res = await POST(createRequest(baseRegistration))
    const data = await res.json()

    expect(res.status).toBe(409)
    expect(data.success).toBe(false)
    expect(data.message).toContain('already exists')
  })

  it('returns 201 for successful patient registration', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.$transaction).mockResolvedValue({
      id: 'new-user-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      userType: 'PATIENT',
    } as never)

    const res = await POST(createRequest(baseRegistration))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.userId).toBe('new-user-id')
    expect(data.accountStatus).toBe('active')
  })

  it('returns 201 for successful doctor registration', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.$transaction).mockResolvedValue({
      id: 'new-doc-id',
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah@example.com',
      userType: 'DOCTOR',
    } as never)

    const res = await POST(createRequest({
      ...baseRegistration,
      fullName: 'Sarah Smith',
      email: 'sarah@example.com',
      userType: 'doctor',
      licenseNumber: 'DOC-12345',
      specialization: 'Cardiology',
    }))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.userId).toBe('new-doc-id')
  })

  it('returns 400 for unsupported user type', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const res = await POST(createRequest({
      ...baseRegistration,
      userType: 'invalid-type',
    }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.success).toBe(false)
  })
})
