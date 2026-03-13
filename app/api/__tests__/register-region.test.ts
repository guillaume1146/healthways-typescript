import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing the route
const mockTx = {
  user: { create: vi.fn(), update: vi.fn() },
  patientProfile: { create: vi.fn() },
  patientEmergencyContact: { create: vi.fn() },
  doctorProfile: { create: vi.fn() },
  nurseProfile: { create: vi.fn() },
  nannyProfile: { create: vi.fn() },
  pharmacistProfile: { create: vi.fn() },
  labTechProfile: { create: vi.fn() },
  emergencyWorkerProfile: { create: vi.fn() },
  insuranceRepProfile: { create: vi.fn() },
  corporateAdminProfile: { create: vi.fn() },
  referralPartnerProfile: { create: vi.fn(), findUnique: vi.fn() },
  regionalAdminProfile: { create: vi.fn() },
  userWallet: { create: vi.fn(), findUnique: vi.fn() },
  walletTransaction: { create: vi.fn() },
  document: { createMany: vi.fn() },
  region: { findUnique: vi.fn() },
  userPreference: { create: vi.fn() },
}

vi.mock('@/lib/db', () => ({
  default: {
    user: { findUnique: vi.fn() },
    $transaction: vi.fn((fn: (tx: typeof mockTx) => Promise<unknown>) => fn(mockTx)),
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitAuth: vi.fn(() => null),
}))

vi.mock('bcrypt', () => ({
  default: { hash: vi.fn(() => Promise.resolve('hashed_password')) },
}))

import { POST } from '../auth/register/route'
import prisma from '@/lib/db'
import { NextRequest } from 'next/server'

function createRegisterRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const baseRegistrationData = {
  fullName: 'John Doe',
  email: 'john@test.com',
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
  documentUrls: [],
  skippedDocuments: [],
}

describe('POST /api/auth/register - Region features', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // No existing user
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    // Default user creation
    mockTx.user.create.mockResolvedValue({
      id: 'new-user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      userType: 'PATIENT',
    })
    // Default profile creation
    mockTx.patientProfile.create.mockResolvedValue({ id: 'pat-1', userId: 'new-user-1' })
    mockTx.userWallet.create.mockResolvedValue({ id: 'wallet-1' })
  })

  it('registers with regionId and sets it on user', async () => {
    const body = { ...baseRegistrationData, regionId: 'reg-mu' }

    const res = await POST(createRegisterRequest(body))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(mockTx.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          regionId: 'reg-mu',
        }),
      })
    )
  })

  it('registers without regionId (backwards compat)', async () => {
    const body = { ...baseRegistrationData }

    const res = await POST(createRegisterRequest(body))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    // regionId should NOT be in the data
    const createCall = mockTx.user.create.mock.calls[0][0]
    expect(createCall.data.regionId).toBeUndefined()
  })

  it('creates Document records when documentUrls provided', async () => {
    const docs = [
      { name: 'Medical License', type: 'license', url: '/uploads/license.pdf', size: 1024 },
      { name: 'ID Card', type: 'id', url: '/uploads/id.pdf' },
    ]
    const body = { ...baseRegistrationData, documentUrls: docs }

    const res = await POST(createRegisterRequest(body))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(mockTx.document.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ userId: 'new-user-1', name: 'Medical License', type: 'license', url: '/uploads/license.pdf' }),
        expect.objectContaining({ userId: 'new-user-1', name: 'ID Card', type: 'id', url: '/uploads/id.pdf' }),
      ]),
    })
  })

  it('does not create Document records when documentUrls is empty', async () => {
    const body = { ...baseRegistrationData, documentUrls: [] }

    await POST(createRegisterRequest(body))

    expect(mockTx.document.createMany).not.toHaveBeenCalled()
  })

  it('sets profileImage on user when provided', async () => {
    const body = { ...baseRegistrationData, profileImage: '/uploads/avatar.jpg' }

    const res = await POST(createRegisterRequest(body))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(mockTx.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          profileImage: '/uploads/avatar.jpg',
        }),
      })
    )
  })

  it('creates UserPreference with language from region', async () => {
    const body = { ...baseRegistrationData, regionId: 'reg-fr' }
    mockTx.region.findUnique.mockResolvedValue({ language: 'fr' })

    const res = await POST(createRegisterRequest(body))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(mockTx.region.findUnique).toHaveBeenCalledWith({
      where: { id: 'reg-fr' },
      select: { language: true },
    })
    expect(mockTx.userPreference.create).toHaveBeenCalledWith({
      data: {
        userId: 'new-user-1',
        language: 'fr',
      },
    })
  })

  it('does not create UserPreference when no regionId', async () => {
    const body = { ...baseRegistrationData }

    await POST(createRegisterRequest(body))

    expect(mockTx.region.findUnique).not.toHaveBeenCalled()
    expect(mockTx.userPreference.create).not.toHaveBeenCalled()
  })

  it('does not create UserPreference when region not found', async () => {
    const body = { ...baseRegistrationData, regionId: 'nonexistent' }
    mockTx.region.findUnique.mockResolvedValue(null)

    await POST(createRegisterRequest(body))

    expect(mockTx.region.findUnique).toHaveBeenCalled()
    expect(mockTx.userPreference.create).not.toHaveBeenCalled()
  })

  it('returns 409 when email already exists', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'existing-user' } as never)

    const body = { ...baseRegistrationData }
    const res = await POST(createRegisterRequest(body))
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.message).toContain('already exists')
  })
})
