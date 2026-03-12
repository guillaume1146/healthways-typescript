import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mock dependencies before importing the route ────────────────────────────

vi.mock('@/lib/db', () => ({
  default: {
    user: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock('bcrypt', () => ({
  default: { hash: vi.fn(() => '$2b$10$hashedpassword') },
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitAuth: vi.fn(() => null),
  rateLimitPublic: vi.fn(() => null),
}))

import { POST } from '../auth/register/route'
import prisma from '@/lib/db'
import { NextRequest } from 'next/server'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const baseRegistration = {
  fullName: 'Jean Pierre Dupont',
  email: 'jean.dupont@test.com',
  password: 'Secure123!',
  confirmPassword: 'Secure123!',
  phone: '+230 5789 1234',
  dateOfBirth: '1990-01-15',
  gender: 'Male',
  address: 'Rose Hill, Mauritius',
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

function mockSuccessfulTransaction(overrides: Record<string, unknown> = {}) {
  vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
  vi.mocked(prisma.$transaction).mockResolvedValue({
    id: 'new-user-id',
    firstName: 'Jean Pierre',
    lastName: 'Dupont',
    email: 'jean.dupont@test.com',
    userType: 'PATIENT',
    ...overrides,
  } as never)
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // Input Validation
  // ────────────────────────────────────────────────────────────────────────────

  describe('Input validation', () => {
    it('returns 400 for empty body', async () => {
      const res = await POST(createRequest({}))
      expect(res.status).toBe(400)
      expect((await res.json()).success).toBe(false)
    })

    it('returns 400 for missing email', async () => {
      const res = await POST(createRequest({ ...baseRegistration, email: '', userType: 'patient' }))
      expect(res.status).toBe(400)
    })

    it('returns 400 for invalid email', async () => {
      const res = await POST(createRequest({ ...baseRegistration, email: 'not-an-email', userType: 'patient' }))
      expect(res.status).toBe(400)
    })

    it('returns 400 for short password (< 6 chars)', async () => {
      const res = await POST(createRequest({ ...baseRegistration, password: '12345', confirmPassword: '12345', userType: 'patient' }))
      expect(res.status).toBe(400)
    })

    it('returns 400 for password mismatch', async () => {
      const res = await POST(createRequest({ ...baseRegistration, confirmPassword: 'WrongPass!', userType: 'patient' }))
      expect(res.status).toBe(400)
    })

    it('returns 400 for unsupported user type', async () => {
      const res = await POST(createRequest({ ...baseRegistration, userType: 'superhero' }))
      expect(res.status).toBe(400)
    })

    it('returns 400 when terms not agreed', async () => {
      const res = await POST(createRequest({ ...baseRegistration, userType: 'patient', agreeToTerms: false }))
      expect(res.status).toBe(400)
    })

    it('returns 400 when privacy not agreed', async () => {
      const res = await POST(createRequest({ ...baseRegistration, userType: 'patient', agreeToPrivacy: false }))
      expect(res.status).toBe(400)
    })

    it('returns 400 when disclaimer not agreed', async () => {
      const res = await POST(createRequest({ ...baseRegistration, userType: 'patient', agreeToDisclaimer: false }))
      expect(res.status).toBe(400)
    })

    it('returns 400 for missing phone', async () => {
      const res = await POST(createRequest({ ...baseRegistration, phone: '', userType: 'patient' }))
      expect(res.status).toBe(400)
    })
  })

  // ────────────────────────────────────────────────────────────────────────────
  // Duplicate Email
  // ────────────────────────────────────────────────────────────────────────────

  describe('Duplicate email detection', () => {
    it('returns 409 if email already exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'existing-user', email: 'jean.dupont@test.com' } as never)
      const res = await POST(createRequest({ ...baseRegistration, userType: 'patient' }))
      expect(res.status).toBe(409)
      expect((await res.json()).message).toContain('already exists')
    })

    it('email check is case-insensitive', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'existing' } as never)
      const res = await POST(createRequest({ ...baseRegistration, email: 'Jean.Dupont@Test.com', userType: 'patient' }))
      expect(res.status).toBe(409)
    })
  })

  // ────────────────────────────────────────────────────────────────────────────
  // Account Status per Role — THE KEY TEST
  // Only REGIONAL_ADMIN should be 'pending', all others 'active'
  // ────────────────────────────────────────────────────────────────────────────

  describe('Account status by user type', () => {
    const activeRoles = [
      'patient', 'doctor', 'nurse', 'nanny', 'pharmacist',
      'lab', 'emergency', 'insurance', 'corporate', 'referral-partner',
    ]

    for (const role of activeRoles) {
      it(`${role} → accountStatus = "active" (no approval needed)`, async () => {
        mockSuccessfulTransaction()

        const body = {
          ...baseRegistration,
          email: `test-${role}@test.com`,
          userType: role,
          ...(role === 'corporate' ? { companyName: 'Test Corp' } : {}),
        }

        const res = await POST(createRequest(body))
        expect(res.status).toBe(201)

        const data = await res.json()
        expect(data.success).toBe(true)
        expect(data.accountStatus).toBe('active')
      })
    }

    it('regional-admin → accountStatus = "pending" (requires super-admin approval)', async () => {
      mockSuccessfulTransaction()

      const res = await POST(createRequest({
        ...baseRegistration,
        userType: 'regional-admin',
        targetCountry: 'Mauritius',
        targetRegion: 'Port Louis',
        countryCode: 'MU',
      }))

      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.accountStatus).toBe('pending')
    })
  })

  // ────────────────────────────────────────────────────────────────────────────
  // Skipped documents should NOT block activation
  // ────────────────────────────────────────────────────────────────────────────

  describe('Skipped documents behavior', () => {
    it('doctor with skipped docs is still active', async () => {
      mockSuccessfulTransaction()

      const res = await POST(createRequest({
        ...baseRegistration,
        userType: 'doctor',
        skippedDocuments: ['medical-degree', 'professional-license'],
      }))

      const data = await res.json()
      expect(res.status).toBe(201)
      expect(data.accountStatus).toBe('active')
      expect(data.message).toContain('upload your remaining documents')
    })

    it('patient with skipped docs is still active', async () => {
      mockSuccessfulTransaction()

      const res = await POST(createRequest({
        ...baseRegistration,
        userType: 'patient',
        skippedDocuments: ['national-id'],
      }))

      const data = await res.json()
      expect(res.status).toBe(201)
      expect(data.accountStatus).toBe('active')
    })

    it('nurse with no skipped docs gets immediate login message', async () => {
      mockSuccessfulTransaction()

      const res = await POST(createRequest({
        ...baseRegistration,
        userType: 'nurse',
        licenseNumber: 'NRS-12345',
      }))

      const data = await res.json()
      expect(res.status).toBe(201)
      expect(data.accountStatus).toBe('active')
      expect(data.message).toContain('You can now log in')
    })
  })

  // ────────────────────────────────────────────────────────────────────────────
  // Response Messages
  // ────────────────────────────────────────────────────────────────────────────

  describe('Response messages', () => {
    it('regional-admin gets super-admin approval message', async () => {
      mockSuccessfulTransaction()

      const res = await POST(createRequest({
        ...baseRegistration,
        userType: 'regional-admin',
        targetCountry: 'MU',
        targetRegion: 'North',
        countryCode: 'MU',
      }))

      const data = await res.json()
      expect(data.message).toContain('super-admin approval')
    })

    it('active user gets login message', async () => {
      mockSuccessfulTransaction()

      const res = await POST(createRequest({ ...baseRegistration, userType: 'patient' }))
      const data = await res.json()
      expect(data.message).toContain('You can now log in')
    })

    it('user with skipped docs gets upload reminder', async () => {
      mockSuccessfulTransaction()

      const res = await POST(createRequest({
        ...baseRegistration,
        userType: 'pharmacist',
        skippedDocuments: ['pharmacy-license'],
      }))

      const data = await res.json()
      expect(data.message).toContain('upload your remaining documents')
    })
  })

  // ────────────────────────────────────────────────────────────────────────────
  // All 11 roles register successfully
  // ────────────────────────────────────────────────────────────────────────────

  describe('All 11 user types register successfully', () => {
    const allTypes = [
      { type: 'patient',          extra: {} },
      { type: 'doctor',           extra: { licenseNumber: 'DOC-123', specialization: 'Cardiology' } },
      { type: 'nurse',            extra: { licenseNumber: 'NRS-123' } },
      { type: 'nanny',            extra: {} },
      { type: 'pharmacist',       extra: { licenseNumber: 'PHR-123', institution: 'PharmaCo' } },
      { type: 'lab',              extra: { licenseNumber: 'LAB-123', institution: 'MedLab' } },
      { type: 'emergency',        extra: {} },
      { type: 'insurance',        extra: { companyName: 'InsureCo' } },
      { type: 'corporate',        extra: { companyName: 'HealthCorp', companyRegistrationNumber: 'BRN-001' } },
      { type: 'referral-partner', extra: { businessType: 'Individual' } },
      { type: 'regional-admin',   extra: { targetCountry: 'Mauritius', targetRegion: 'Central', countryCode: 'MU' } },
    ]

    for (const { type, extra } of allTypes) {
      it(`${type} returns 201 with correct response shape`, async () => {
        mockSuccessfulTransaction()

        const res = await POST(createRequest({
          ...baseRegistration,
          email: `test-${type}@example.com`,
          userType: type,
          ...extra,
        }))

        expect(res.status).toBe(201)

        const data = await res.json()
        expect(data).toHaveProperty('success', true)
        expect(data).toHaveProperty('userId')
        expect(data).toHaveProperty('accountStatus')
        expect(data).toHaveProperty('message')
        expect(typeof data.message).toBe('string')
      })
    }
  })
})
