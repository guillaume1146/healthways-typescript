import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing routes
vi.mock('@/lib/db', () => ({
  default: {
    nurseProfile: { findUnique: vi.fn() },
    nannyProfile: { findUnique: vi.fn() },
    pharmacistProfile: { findUnique: vi.fn() },
    labTechProfile: { findUnique: vi.fn() },
    emergencyWorkerProfile: { findUnique: vi.fn() },
    nurseBooking: { count: vi.fn(), findMany: vi.fn() },
    childcareBooking: { count: vi.fn(), findMany: vi.fn(), groupBy: vi.fn() },
    pharmacyMedicine: { findMany: vi.fn() },
    medicineOrder: { count: vi.fn(), findMany: vi.fn() },
    labTestBooking: { count: vi.fn(), findMany: vi.fn() },
    emergencyBooking: { count: vi.fn(), findMany: vi.fn() },
    userWallet: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn(() => null),
}))

import { GET as getNurseDashboard } from '../nurses/[id]/dashboard/route'
import { GET as getNannyDashboard } from '../nannies/[id]/dashboard/route'
import { GET as getPharmacistDashboard } from '../pharmacists/[id]/dashboard/route'
import { GET as getLabTechDashboard } from '../lab-techs/[id]/dashboard/route'
import { GET as getResponderDashboard } from '../responders/[id]/dashboard/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'GET' })
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/nurses/[id]/dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getNurseDashboard(
      createGetRequest('/api/nurses/user-1/dashboard'),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 403 for non-owner', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'nurse', email: 'n@example.com' })

    const res = await getNurseDashboard(
      createGetRequest('/api/nurses/user-1/dashboard'),
      mockParams('user-1')
    )

    expect(res.status).toBe(403)
  })

  it('returns 200 with nurse dashboard data', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'nurse', email: 'n@example.com' })
    vi.mocked(prisma.nurseProfile.findUnique).mockResolvedValue({ id: 'np-1', specializations: [], experience: 5 } as never)
    vi.mocked(prisma.nurseBooking.count)
      .mockResolvedValueOnce(2 as never) // today
      .mockResolvedValueOnce(30 as never) // completed total
    vi.mocked(prisma.nurseBooking.findMany)
      .mockResolvedValueOnce([{ id: 'b1' }] as never) // month bookings
      .mockResolvedValueOnce([] as never) // recent bookings
    vi.mocked(prisma.userWallet.findUnique).mockResolvedValue({ balance: 3000 } as never)

    const res = await getNurseDashboard(
      createGetRequest('/api/nurses/user-1/dashboard'),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.stats).toBeDefined()
    expect(data.data.stats.todayAppointments).toBe(2)
    expect(data.data.stats.completedServices).toBe(30)
  })
})

describe('GET /api/nannies/[id]/dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getNannyDashboard(
      createGetRequest('/api/nannies/user-1/dashboard'),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with nanny dashboard data', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'child-care-nurse', email: 'n@example.com' })
    vi.mocked(prisma.nannyProfile.findUnique).mockResolvedValue({ id: 'nn-1', experience: 3, certifications: [] } as never)
    vi.mocked(prisma.childcareBooking.count).mockResolvedValue(1 as never)
    vi.mocked(prisma.childcareBooking.groupBy).mockResolvedValue([{ patientId: 'p1' }, { patientId: 'p2' }] as never)
    vi.mocked(prisma.childcareBooking.findMany)
      .mockResolvedValueOnce([{ id: 'b1' }] as never) // month bookings
      .mockResolvedValueOnce([] as never) // recent bookings
    vi.mocked(prisma.userWallet.findUnique).mockResolvedValue({ balance: 2000 } as never)

    const res = await getNannyDashboard(
      createGetRequest('/api/nannies/user-1/dashboard'),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.stats).toBeDefined()
    expect(data.data.stats.familiesHelped).toBe(2)
  })
})

describe('GET /api/pharmacists/[id]/dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getPharmacistDashboard(
      createGetRequest('/api/pharmacists/user-1/dashboard'),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with pharmacist dashboard data', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'pharmacy', email: 'ph@example.com' })
    vi.mocked(prisma.pharmacistProfile.findUnique).mockResolvedValue({ id: 'pp-1', pharmacyName: 'Test Pharmacy' } as never)
    vi.mocked(prisma.pharmacyMedicine.findMany).mockResolvedValue([{ id: 'pm-1' }] as never)
    vi.mocked(prisma.medicineOrder.count).mockResolvedValue(3 as never)
    vi.mocked(prisma.medicineOrder.findMany)
      .mockResolvedValueOnce([
        {
          id: 'o1', status: 'pending', totalAmount: 500, orderedAt: new Date(),
          patient: { user: { firstName: 'John', lastName: 'Doe' } },
          items: [{ quantity: 1, price: 500, medicine: { name: 'Paracetamol' } }],
        },
      ] as never) // recent orders
      .mockResolvedValueOnce([{ totalAmount: 500 }] as never) // today orders
      .mockResolvedValueOnce([{ totalAmount: 1500 }] as never) // month orders
    vi.mocked(prisma.userWallet.findUnique).mockResolvedValue({ balance: 5000 } as never)

    const res = await getPharmacistDashboard(
      createGetRequest('/api/pharmacists/user-1/dashboard'),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.stats).toBeDefined()
    expect(data.data.stats.pendingOrders).toBe(3)
  })
})

describe('GET /api/lab-techs/[id]/dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getLabTechDashboard(
      createGetRequest('/api/lab-techs/user-1/dashboard'),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with lab tech dashboard data', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'lab', email: 'l@example.com' })
    vi.mocked(prisma.labTechProfile.findUnique).mockResolvedValue({ id: 'lt-1', labName: 'Test Lab' } as never)
    vi.mocked(prisma.labTestBooking.count).mockResolvedValue(5 as never)
    vi.mocked(prisma.labTestBooking.findMany)
      .mockResolvedValueOnce([] as never) // recent
      .mockResolvedValueOnce([{ price: 300 }] as never) // today
      .mockResolvedValueOnce([{ price: 1200 }] as never) // month
    vi.mocked(prisma.userWallet.findUnique).mockResolvedValue({ balance: 8000 } as never)

    const res = await getLabTechDashboard(
      createGetRequest('/api/lab-techs/user-1/dashboard'),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.stats).toBeDefined()
    expect(data.data.stats.pendingResults).toBe(5)
  })
})

describe('GET /api/responders/[id]/dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getResponderDashboard(
      createGetRequest('/api/responders/user-1/dashboard'),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with responder dashboard data', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'ambulance', email: 'r@example.com' })
    vi.mocked(prisma.emergencyWorkerProfile.findUnique).mockResolvedValue({ id: 'ew-1' } as never)
    vi.mocked(prisma.emergencyBooking.count).mockResolvedValue(3 as never)
    vi.mocked(prisma.emergencyBooking.findMany).mockResolvedValue([
      {
        id: 'eb-1', emergencyType: 'Cardiac', location: 'Port Louis', priority: 'high',
        status: 'dispatched', createdAt: new Date(),
        patient: { user: { firstName: 'John', lastName: 'Doe', phone: '+230 5123 4567' } },
      },
    ] as never)
    vi.mocked(prisma.userWallet.findUnique).mockResolvedValue({ balance: 1000 } as never)

    const res = await getResponderDashboard(
      createGetRequest('/api/responders/user-1/dashboard'),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.stats).toBeDefined()
    expect(data.data.stats.completedServices).toBe(3)
    expect(data.data.incomingRequests).toHaveLength(1)
  })
})
