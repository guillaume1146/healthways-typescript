import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing routes
vi.mock('@/lib/db', () => ({
  default: {
    patientProfile: { findUnique: vi.fn() },
    appointment: { findMany: vi.fn(), count: vi.fn() },
    prescription: { findMany: vi.fn(), count: vi.fn() },
    medicalRecord: { findMany: vi.fn(), count: vi.fn() },
    vitalSigns: { findMany: vi.fn(), create: vi.fn() },
    labTest: { findMany: vi.fn(), count: vi.fn() },
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

import { GET as getAppointments } from '../patients/[id]/appointments/route'
import { GET as getPrescriptions } from '../patients/[id]/prescriptions/route'
import { GET as getMedicalRecords } from '../patients/[id]/medical-records/route'
import { GET as getVitalSigns } from '../patients/[id]/vital-signs/route'
import { GET as getLabTests } from '../patients/[id]/lab-tests/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'GET' })
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) })

const patientId = 'patient-user-1'
const profileId = 'patient-profile-1'

describe('GET /api/patients/[id]/appointments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getAppointments(
      createGetRequest(`/api/patients/${patientId}/appointments`),
      mockParams(patientId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with appointments', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: patientId, userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: profileId } as never)
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([
      { id: 'apt-1', scheduledAt: new Date(), type: 'video', status: 'upcoming', specialty: 'General' },
    ] as never)
    vi.mocked(prisma.appointment.count).mockResolvedValue(1 as never)

    const res = await getAppointments(
      createGetRequest(`/api/patients/${patientId}/appointments`),
      mockParams(patientId)
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.total).toBe(1)
  })

  it('returns 404 when patient profile not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: patientId, userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue(null)

    const res = await getAppointments(
      createGetRequest(`/api/patients/${patientId}/appointments`),
      mockParams(patientId)
    )

    expect(res.status).toBe(404)
  })
})

describe('GET /api/patients/[id]/prescriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getPrescriptions(
      createGetRequest(`/api/patients/${patientId}/prescriptions`),
      mockParams(patientId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with prescriptions', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: patientId, userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: profileId } as never)
    vi.mocked(prisma.prescription.findMany).mockResolvedValue([
      { id: 'rx-1', date: new Date(), diagnosis: 'Flu', isActive: true },
    ] as never)
    vi.mocked(prisma.prescription.count).mockResolvedValue(1 as never)

    const res = await getPrescriptions(
      createGetRequest(`/api/patients/${patientId}/prescriptions`),
      mockParams(patientId)
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })
})

describe('GET /api/patients/[id]/medical-records', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getMedicalRecords(
      createGetRequest(`/api/patients/${patientId}/medical-records`),
      mockParams(patientId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with medical records', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: patientId, userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: profileId } as never)
    vi.mocked(prisma.medicalRecord.findMany).mockResolvedValue([
      { id: 'mr-1', title: 'Annual Checkup', date: new Date(), type: 'checkup' },
    ] as never)
    vi.mocked(prisma.medicalRecord.count).mockResolvedValue(1 as never)

    const res = await getMedicalRecords(
      createGetRequest(`/api/patients/${patientId}/medical-records`),
      mockParams(patientId)
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })
})

describe('GET /api/patients/[id]/vital-signs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getVitalSigns(
      createGetRequest(`/api/patients/${patientId}/vital-signs`),
      mockParams(patientId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with vital signs', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: patientId, userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: profileId } as never)
    vi.mocked(prisma.vitalSigns.findMany).mockResolvedValue([
      { id: 'vs-1', heartRate: 72, systolicBP: 120, diastolicBP: 80, recordedAt: new Date() },
    ] as never)

    const res = await getVitalSigns(
      createGetRequest(`/api/patients/${patientId}/vital-signs`),
      mockParams(patientId)
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })
})

describe('GET /api/patients/[id]/lab-tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getLabTests(
      createGetRequest(`/api/patients/${patientId}/lab-tests`),
      mockParams(patientId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 200 with lab tests', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: patientId, userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: profileId } as never)
    vi.mocked(prisma.labTest.findMany).mockResolvedValue([
      { id: 'lt-1', testName: 'CBC', status: 'completed', results: [] },
    ] as never)
    vi.mocked(prisma.labTest.count).mockResolvedValue(1 as never)

    const res = await getLabTests(
      createGetRequest(`/api/patients/${patientId}/lab-tests`),
      mockParams(patientId)
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })
})
