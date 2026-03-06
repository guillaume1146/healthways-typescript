import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing routes
vi.mock('@/lib/db', () => ({
  default: {
    doctorProfile: { findUnique: vi.fn(), findFirst: vi.fn() },
    appointment: { findMany: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
    prescription: { findMany: vi.fn(), count: vi.fn() },
    patientProfile: { findMany: vi.fn() },
    userWallet: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn(() => null),
}))

vi.mock('@/lib/api-utils', () => ({
  parsePagination: vi.fn(() => ({ limit: 20, offset: 0 })),
}))

vi.mock('@/lib/validations/api', () => ({
  createDoctorPrescriptionSchema: {
    safeParse: vi.fn((data: unknown) => ({ success: true, data })),
  },
}))

import { GET as getAppointments } from '../doctors/[id]/appointments/route'
import { GET as getPatients } from '../doctors/[id]/patients/route'
import { GET as getStatistics } from '../doctors/[id]/statistics/route'
import { GET as getPrescriptions } from '../doctors/[id]/prescriptions/route'
import { GET as getBookingRequests } from '../doctors/[id]/booking-requests/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'GET' })
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) })

const doctorId = 'doc-user-1'
const doctorProfileId = 'doc-profile-1'

describe('GET /api/doctors/[id]/appointments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getAppointments(
      createGetRequest(`/api/doctors/${doctorId}/appointments`),
      mockParams(doctorId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with appointments', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: doctorId, userType: 'doctor', email: 'd@example.com' })
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue({ id: doctorProfileId } as never)
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([
      {
        id: 'apt-1', scheduledAt: new Date(), type: 'video', status: 'upcoming',
        specialty: 'General', reason: 'Checkup', duration: 30, location: null, roomId: null,
        patient: { id: 'pat-1', user: { firstName: 'John', lastName: 'Doe', profileImage: null, phone: null } },
      },
    ] as never)
    vi.mocked(prisma.appointment.count).mockResolvedValue(1 as never)

    const res = await getAppointments(
      createGetRequest(`/api/doctors/${doctorId}/appointments`),
      mockParams(doctorId)
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.total).toBe(1)
  })

  it('returns 404 when doctor profile not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: doctorId, userType: 'doctor', email: 'd@example.com' })
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue(null)

    const res = await getAppointments(
      createGetRequest(`/api/doctors/${doctorId}/appointments`),
      mockParams(doctorId)
    )

    expect(res.status).toBe(404)
  })
})

describe('GET /api/doctors/[id]/patients', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getPatients(
      createGetRequest(`/api/doctors/${doctorId}/patients`),
      mockParams(doctorId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with patients', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: doctorId, userType: 'doctor', email: 'd@example.com' })
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue({ id: doctorProfileId } as never)
    vi.mocked(prisma.appointment.groupBy).mockResolvedValue([
      { patientId: 'pat-1', _count: { id: 3 }, _max: { scheduledAt: new Date() } },
    ] as never)
    vi.mocked(prisma.patientProfile.findMany).mockResolvedValue([
      {
        id: 'pat-1', userId: 'patient-user-1', bloodType: 'A+', allergies: [], chronicConditions: [],
        user: { firstName: 'John', lastName: 'Doe', profileImage: null, phone: null, gender: 'male', dateOfBirth: null, email: 'john@example.com' },
      },
    ] as never)

    const res = await getPatients(
      createGetRequest(`/api/doctors/${doctorId}/patients`),
      mockParams(doctorId)
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].firstName).toBe('John')
  })
})

describe('GET /api/doctors/[id]/statistics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getStatistics(
      createGetRequest(`/api/doctors/${doctorId}/statistics`),
      mockParams(doctorId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with statistics', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: doctorId, userType: 'doctor', email: 'd@example.com' })
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue({
      id: doctorProfileId, consultationFee: 500, rating: 4.5, specialty: ['General'],
    } as never)

    // Mock all the parallel queries
    vi.mocked(prisma.appointment.count)
      .mockResolvedValueOnce(50 as never) // total
      .mockResolvedValueOnce(10 as never) // monthly
    vi.mocked(prisma.appointment.groupBy)
      .mockResolvedValueOnce([{ type: 'video', _count: { id: 20 } }] as never) // byType
      .mockResolvedValueOnce([{ patientId: 'p1' }, { patientId: 'p2' }] as never) // unique
      .mockResolvedValueOnce([{ patientId: 'p3' }] as never) // new this month
      .mockResolvedValueOnce([{ patientId: 'p1' }] as never) // active
    vi.mocked(prisma.prescription.count).mockResolvedValue(15 as never)
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([
      { scheduledAt: new Date('2026-03-01T10:00:00') },
    ] as never)
    vi.mocked(prisma.userWallet.findUnique).mockResolvedValue({ balance: 25000 } as never)

    const res = await getStatistics(
      createGetRequest(`/api/doctors/${doctorId}/statistics`),
      mockParams(doctorId)
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.statistics).toBeDefined()
    expect(data.data.statistics.totalConsultations).toBe(50)
    expect(data.data.statistics.totalPatients).toBe(2)
  })

  it('returns 403 for wrong user', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'doctor', email: 'd@example.com' })

    const res = await getStatistics(
      createGetRequest(`/api/doctors/${doctorId}/statistics`),
      mockParams(doctorId)
    )

    expect(res.status).toBe(403)
  })
})

describe('GET /api/doctors/[id]/prescriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getPrescriptions(
      createGetRequest(`/api/doctors/${doctorId}/prescriptions`),
      mockParams(doctorId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with prescriptions', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: doctorId, userType: 'doctor', email: 'd@example.com' })
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue({ id: doctorProfileId } as never)
    vi.mocked(prisma.prescription.findMany).mockResolvedValue([
      {
        id: 'rx-1', date: new Date(), diagnosis: 'Flu', isActive: true, nextRefill: null, notes: null,
        patient: { id: 'pat-1', user: { firstName: 'John', lastName: 'Doe', email: 'j@ex.com' } },
        medicines: [{ dosage: '500mg', frequency: 'twice daily', duration: '7 days', instructions: null, medicine: { name: 'Amoxicillin', category: 'Antibiotic' } }],
      },
    ] as never)

    const res = await getPrescriptions(
      createGetRequest(`/api/doctors/${doctorId}/prescriptions`),
      mockParams(doctorId)
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })
})

describe('GET /api/doctors/[id]/booking-requests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getBookingRequests(
      createGetRequest(`/api/doctors/${doctorId}/booking-requests`),
      mockParams(doctorId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 403 for non-owner', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'doctor', email: 'd@example.com' })

    const res = await getBookingRequests(
      createGetRequest(`/api/doctors/${doctorId}/booking-requests`),
      mockParams(doctorId)
    )

    expect(res.status).toBe(403)
  })

  it('returns 200 with booking requests', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: doctorId, userType: 'doctor', email: 'd@example.com' })
    vi.mocked(prisma.doctorProfile.findFirst).mockResolvedValue({ id: doctorProfileId } as never)
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([
      {
        id: 'apt-1', status: 'pending', scheduledAt: new Date(), createdAt: new Date(),
        patient: { id: 'pat-1', userId: 'p-user-1', user: { firstName: 'John', lastName: 'Doe', email: 'j@ex.com', phone: null, profileImage: null } },
      },
    ] as never)

    const res = await getBookingRequests(
      createGetRequest(`/api/doctors/${doctorId}/booking-requests`),
      mockParams(doctorId)
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })
})
