import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  default: {
    user: { count: vi.fn(), findUnique: vi.fn(), findMany: vi.fn() },
    appointment: { count: vi.fn() },
    nurseBooking: { count: vi.fn() },
    childcareBooking: { count: vi.fn() },
    labTestBooking: { count: vi.fn() },
    emergencyBooking: { count: vi.fn() },
    walletTransaction: { aggregate: vi.fn(), groupBy: vi.fn(), findMany: vi.fn() },
    videoCallSession: { count: vi.fn() },
    notification: { count: vi.fn() },
    regionalAdminProfile: { findMany: vi.fn() },
    platformConfig: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
    requiredDocumentConfig: { findMany: vi.fn(), upsert: vi.fn() },
    insuranceClaim: { groupBy: vi.fn() },
    insurancePlanListing: { findMany: vi.fn() },
    userWallet: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn(() => null),
  rateLimitAuth: vi.fn(() => null),
}))

import { GET as getMetrics } from '../admin/metrics/route'
import { GET as getAlerts } from '../admin/alerts/route'
import { GET as getCommissionConfig, PUT as putCommissionConfig } from '../admin/commission-config/route'
import { GET as getAdmins } from '../admin/admins/route'
import { GET as getRequiredDocuments } from '../admin/required-documents/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'GET' })
}

function createPutRequest(url: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost:3000${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('GET /api/admin/metrics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getMetrics(createGetRequest('/api/admin/metrics'))

    expect(res.status).toBe(401)
  })

  it('returns 403 for non-admin user', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'u-1', userType: 'patient', email: 'p@ex.com' })

    const res = await getMetrics(createGetRequest('/api/admin/metrics'))

    expect(res.status).toBe(403)
  })

  it('returns 200 with metrics for admin', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: 'admin@test.com' })

    // Mock all the count calls
    vi.mocked(prisma.user.count).mockResolvedValue(100 as never)
    vi.mocked(prisma.appointment.count).mockResolvedValue(50 as never)
    vi.mocked(prisma.nurseBooking.count).mockResolvedValue(10 as never)
    vi.mocked(prisma.childcareBooking.count).mockResolvedValue(5 as never)
    vi.mocked(prisma.labTestBooking.count).mockResolvedValue(8 as never)
    vi.mocked(prisma.emergencyBooking.count).mockResolvedValue(3 as never)
    vi.mocked(prisma.videoCallSession.count).mockResolvedValue(20 as never)
    vi.mocked(prisma.walletTransaction.aggregate).mockResolvedValue({ _sum: { amount: 50000 } } as never)
    vi.mocked(prisma.walletTransaction.groupBy).mockResolvedValue([] as never)

    const res = await getMetrics(createGetRequest('/api/admin/metrics'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.users).toBeDefined()
    expect(data.data.bookings).toBeDefined()
    expect(data.data.revenue).toBeDefined()
  })
})

describe('GET /api/admin/alerts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockResolvedValue(null as never)

    const res = await getAlerts(createGetRequest('/api/admin/alerts'))

    expect(res.status).toBe(401)
  })

  it('returns alerts array', async () => {
    vi.mocked(validateRequest).mockResolvedValue({ sub: 'admin-1', userType: 'admin', email: 'admin@test.com' } as never)
    vi.mocked(prisma.user.count).mockResolvedValue(5 as never)
    vi.mocked(prisma.notification.count).mockResolvedValue(3 as never)
    vi.mocked(prisma.appointment.count).mockResolvedValue(2 as never)

    const res = await getAlerts(createGetRequest('/api/admin/alerts'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })
})

describe('GET /api/admin/commission-config', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getCommissionConfig(createGetRequest('/api/admin/commission-config'))

    expect(res.status).toBe(401)
  })

  it('returns config or creates default', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: 'admin@test.com' })
    vi.mocked(prisma.platformConfig.findFirst).mockResolvedValue({
      id: 'pc-1', platformCommissionRate: 5, regionalCommissionRate: 10, providerCommissionRate: 85,
    } as never)

    const res = await getCommissionConfig(createGetRequest('/api/admin/commission-config'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.platformCommissionRate).toBe(5)
    expect(data.data.regionalCommissionRate).toBe(10)
    expect(data.data.providerCommissionRate).toBe(85)
  })
})

describe('GET /api/admin/admins', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getAdmins(createGetRequest('/api/admin/admins'))

    expect(res.status).toBe(401)
  })

  it('returns regional admin list', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: 'admin@test.com' })
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      {
        id: 'ra-1', firstName: 'Test', lastName: 'Admin', email: 'ra@test.com',
        phone: '123', profileImage: null, accountStatus: 'active', verified: true,
        createdAt: new Date(),
        regionalAdminProfile: { region: 'Mauritius', country: 'MU', countryCode: 'MU' },
      },
    ] as never)

    const res = await getAdmins(createGetRequest('/api/admin/admins'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].regionalAdminProfile.region).toBe('Mauritius')
  })
})

describe('GET /api/admin/required-documents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns grouped document configs', async () => {
    vi.mocked(prisma.requiredDocumentConfig.findMany).mockResolvedValue([
      { userType: 'PATIENT', documentName: 'national-id', required: true },
      { userType: 'PATIENT', documentName: 'proof-address', required: true },
      { userType: 'DOCTOR', documentName: 'national-id', required: true },
    ] as never)

    const res = await getRequiredDocuments()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.PATIENT).toHaveLength(2)
    expect(data.data.DOCTOR).toHaveLength(1)
  })
})
