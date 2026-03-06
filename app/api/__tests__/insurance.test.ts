import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing routes
vi.mock('@/lib/db', () => ({
  default: {
    insuranceRepProfile: { findUnique: vi.fn() },
    insuranceClaim: { findMany: vi.fn(), count: vi.fn(), create: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
    insurancePlanListing: { findMany: vi.fn(), create: vi.fn() },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn(() => null),
}))

vi.mock('@/lib/validations/catalog', () => ({
  insurancePlanSchema: {
    safeParse: vi.fn((data: unknown) => ({ success: true, data })),
  },
}))

import { GET as getClaims, POST as postClaim } from '../insurance/claims/route'
import { PATCH as patchClaim } from '../insurance/claims/[id]/route'
import { GET as getPlans } from '../insurance/plans/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'GET' })
}

function createPostRequest(url: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost:3000${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function createPatchRequest(url: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost:3000${url}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/insurance/claims', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getClaims(createGetRequest('/api/insurance/claims'))

    expect(res.status).toBe(401)
  })

  it('returns 200 with claims', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'ins-user-1', userType: 'insurance', email: 'i@example.com' })
    vi.mocked(prisma.insuranceRepProfile.findUnique).mockResolvedValue({ id: 'irp-1' } as never)
    vi.mocked(prisma.insuranceClaim.findMany).mockResolvedValue([
      {
        id: 'claim-1', claimId: 'CLM-001', policyHolderName: 'John Doe', description: 'Consultation',
        policyType: 'Health', claimAmount: 5000, status: 'pending', submittedDate: new Date(), resolvedDate: null,
        patient: { user: { firstName: 'John', lastName: 'Doe', email: 'j@ex.com' } },
        plan: { planName: 'Basic', planType: 'individual' },
      },
    ] as never)
    vi.mocked(prisma.insuranceClaim.count).mockResolvedValue(1 as never)

    const res = await getClaims(createGetRequest('/api/insurance/claims'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.pagination).toBeDefined()
  })

  it('returns 404 when insurance profile not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'ins-user-1', userType: 'insurance', email: 'i@example.com' })
    vi.mocked(prisma.insuranceRepProfile.findUnique).mockResolvedValue(null)

    const res = await getClaims(createGetRequest('/api/insurance/claims'))

    expect(res.status).toBe(404)
  })
})

describe('POST /api/insurance/claims', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await postClaim(
      createPostRequest('/api/insurance/claims', {
        patientId: 'pat-uuid', policyHolderName: 'John Doe', description: 'Test', policyType: 'Health', claimAmount: 5000,
      })
    )

    expect(res.status).toBe(401)
  })

  it('returns 201 for new claim', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'ins-user-1', userType: 'insurance', email: 'i@example.com' })
    vi.mocked(prisma.insuranceRepProfile.findUnique).mockResolvedValue({ id: 'irp-1' } as never)
    vi.mocked(prisma.insuranceClaim.create).mockResolvedValue({
      id: 'claim-new', claimId: 'CLM-002', policyHolderName: 'John Doe', status: 'pending',
      claimAmount: 5000, submittedDate: new Date(),
    } as never)

    const res = await postClaim(
      createPostRequest('/api/insurance/claims', {
        patientId: '550e8400-e29b-41d4-a716-446655440000', policyHolderName: 'John Doe', description: 'Test', policyType: 'Health', claimAmount: 5000,
      })
    )
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data.id).toBe('claim-new')
  })
})

describe('PATCH /api/insurance/claims/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await patchClaim(
      createPatchRequest('/api/insurance/claims/claim-1', { action: 'approve' }),
      mockParams('claim-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 for approved claim', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'ins-user-1', userType: 'insurance', email: 'i@example.com' })
    vi.mocked(prisma.insuranceRepProfile.findUnique).mockResolvedValue({ id: 'irp-1' } as never)
    vi.mocked(prisma.insuranceClaim.findUnique).mockResolvedValue({
      id: 'claim-1', insuranceRepId: 'irp-1', status: 'pending',
    } as never)
    vi.mocked(prisma.insuranceClaim.update).mockResolvedValue({
      id: 'claim-1', claimId: 'CLM-001', status: 'approved', resolvedDate: new Date(),
    } as never)

    const res = await patchClaim(
      createPatchRequest('/api/insurance/claims/claim-1', { action: 'approve' }),
      mockParams('claim-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.status).toBe('approved')
  })

  it('returns 400 for already resolved claim', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'ins-user-1', userType: 'insurance', email: 'i@example.com' })
    vi.mocked(prisma.insuranceRepProfile.findUnique).mockResolvedValue({ id: 'irp-1' } as never)
    vi.mocked(prisma.insuranceClaim.findUnique).mockResolvedValue({
      id: 'claim-1', insuranceRepId: 'irp-1', status: 'approved',
    } as never)

    const res = await patchClaim(
      createPatchRequest('/api/insurance/claims/claim-1', { action: 'approve' }),
      mockParams('claim-1')
    )

    expect(res.status).toBe(400)
  })
})

describe('GET /api/insurance/plans', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getPlans(createGetRequest('/api/insurance/plans'))

    expect(res.status).toBe(401)
  })

  it('returns 403 for non-insurance user', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })

    const res = await getPlans(createGetRequest('/api/insurance/plans'))

    expect(res.status).toBe(403)
  })

  it('returns 200 with plans for insurance user', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'ins-user-1', userType: 'insurance', email: 'i@example.com' })
    vi.mocked(prisma.insuranceRepProfile.findUnique).mockResolvedValue({ id: 'irp-1' } as never)
    vi.mocked(prisma.insurancePlanListing.findMany).mockResolvedValue([
      { id: 'plan-1', planName: 'Basic Health', planType: 'individual', monthlyPremium: 2000, coverageAmount: 100000 },
    ] as never)

    const res = await getPlans(createGetRequest('/api/insurance/plans'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })
})
