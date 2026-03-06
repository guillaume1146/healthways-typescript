import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  default: {
    patientProfile: { findUnique: vi.fn() },
    doctorProfile: { findUnique: vi.fn() },
    prescription: { findMany: vi.fn(), count: vi.fn(), create: vi.fn() },
    medicalRecord: { findMany: vi.fn(), count: vi.fn(), create: vi.fn() },
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

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}))

import { POST as postPrescription } from '../patients/[id]/prescriptions/route'
import { POST as postMedicalRecord } from '../patients/[id]/medical-records/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { createNotification } from '@/lib/notifications'
import { NextRequest } from 'next/server'

function createPostRequest(url: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost:3000${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) })
const patientId = 'patient-user-1'

// ─── POST /api/patients/[id]/prescriptions ───

describe('POST /api/patients/[id]/prescriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const validPrescription = {
    diagnosis: 'Type 2 Diabetes',
    notes: 'Monitor blood sugar daily',
    medicines: [
      { medicineId: 'med-1', dosage: '500mg', frequency: 'Twice daily', duration: '3 months', instructions: 'After meals' },
    ],
  }

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await postPrescription(
      createPostRequest(`/api/patients/${patientId}/prescriptions`, validPrescription),
      mockParams(patientId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 403 for non-doctor users', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: patientId, userType: 'patient', email: 'p@e.com' })

    const res = await postPrescription(
      createPostRequest(`/api/patients/${patientId}/prescriptions`, validPrescription),
      mockParams(patientId)
    )

    expect(res.status).toBe(403)
  })

  it('returns 400 for invalid body', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-1', userType: 'doctor', email: 'd@e.com' })

    const res = await postPrescription(
      createPostRequest(`/api/patients/${patientId}/prescriptions`, { diagnosis: '', medicines: [] }),
      mockParams(patientId)
    )

    expect(res.status).toBe(400)
  })

  it('creates prescription with medicines and notifies patient', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-user-1', userType: 'doctor', email: 'd@e.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: 'pat-profile-1', userId: patientId } as never)
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue({ id: 'doc-profile-1' } as never)
    vi.mocked(prisma.prescription.create).mockResolvedValue({
      id: 'rx-1', date: new Date(), diagnosis: 'Type 2 Diabetes', isActive: true, notes: 'Monitor blood sugar daily',
      medicines: [{ dosage: '500mg', frequency: 'Twice daily', duration: '3 months', instructions: 'After meals', medicine: { id: 'med-1', name: 'Metformin' } }],
    } as never)

    const res = await postPrescription(
      createPostRequest(`/api/patients/${patientId}/prescriptions`, validPrescription),
      mockParams(patientId)
    )
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data.id).toBe('rx-1')
    expect(prisma.prescription.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        patientId: 'pat-profile-1',
        doctorId: 'doc-profile-1',
        diagnosis: 'Type 2 Diabetes',
      }),
    }))
    expect(createNotification).toHaveBeenCalledWith(expect.objectContaining({
      userId: patientId,
      type: 'prescription_created',
    }))
  })

  it('returns 404 when patient not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-1', userType: 'doctor', email: 'd@e.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue(null)

    const res = await postPrescription(
      createPostRequest(`/api/patients/${patientId}/prescriptions`, validPrescription),
      mockParams(patientId)
    )

    expect(res.status).toBe(404)
  })

  it('returns 404 when doctor profile not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-1', userType: 'doctor', email: 'd@e.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: 'pat-1', userId: patientId } as never)
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue(null)

    const res = await postPrescription(
      createPostRequest(`/api/patients/${patientId}/prescriptions`, validPrescription),
      mockParams(patientId)
    )

    expect(res.status).toBe(404)
  })
})

// ─── POST /api/patients/[id]/medical-records ───

describe('POST /api/patients/[id]/medical-records', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const validRecord = {
    title: 'Annual Physical Exam',
    date: '2026-03-01',
    type: 'consultation',
    summary: 'Patient in good health. All vitals normal.',
    diagnosis: 'Healthy',
  }

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await postMedicalRecord(
      createPostRequest(`/api/patients/${patientId}/medical-records`, validRecord),
      mockParams(patientId)
    )

    expect(res.status).toBe(401)
  })

  it('returns 403 for unauthorized user types', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'nanny-1', userType: 'child-care-nurse', email: 'n@e.com' })

    const res = await postMedicalRecord(
      createPostRequest(`/api/patients/${patientId}/medical-records`, validRecord),
      mockParams(patientId)
    )

    expect(res.status).toBe(403)
  })

  it('returns 403 when patient tries to add to another patient record', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-patient', userType: 'patient', email: 'p@e.com' })

    const res = await postMedicalRecord(
      createPostRequest(`/api/patients/${patientId}/medical-records`, validRecord),
      mockParams(patientId)
    )

    expect(res.status).toBe(403)
  })

  it('creates medical record as doctor with doctor link', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-user-1', userType: 'doctor', email: 'd@e.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: 'pat-profile-1' } as never)
    vi.mocked(prisma.doctorProfile.findUnique).mockResolvedValue({ id: 'doc-profile-1' } as never)
    vi.mocked(prisma.medicalRecord.create).mockResolvedValue({
      id: 'mr-1', title: 'Annual Physical Exam', date: new Date('2026-03-01'), type: 'consultation',
      summary: 'Patient in good health.', diagnosis: 'Healthy', treatment: null, notes: null,
    } as never)

    const res = await postMedicalRecord(
      createPostRequest(`/api/patients/${patientId}/medical-records`, validRecord),
      mockParams(patientId)
    )
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(prisma.medicalRecord.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        patientId: 'pat-profile-1',
        doctorId: 'doc-profile-1',
        title: 'Annual Physical Exam',
        type: 'consultation',
      }),
    }))
  })

  it('creates medical record as patient without doctor link', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: patientId, userType: 'patient', email: 'p@e.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: 'pat-profile-1' } as never)
    vi.mocked(prisma.medicalRecord.create).mockResolvedValue({
      id: 'mr-2', title: 'Self Report', date: new Date(), type: 'other',
      summary: 'Feeling unwell', diagnosis: null, treatment: null, notes: null,
    } as never)

    const res = await postMedicalRecord(
      createPostRequest(`/api/patients/${patientId}/medical-records`, {
        ...validRecord, title: 'Self Report', type: 'other', summary: 'Feeling unwell',
      }),
      mockParams(patientId)
    )
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(prisma.doctorProfile.findUnique).not.toHaveBeenCalled()
  })

  it('returns 400 for invalid body', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-1', userType: 'doctor', email: 'd@e.com' })

    const res = await postMedicalRecord(
      createPostRequest(`/api/patients/${patientId}/medical-records`, { title: '', type: 'invalid' }),
      mockParams(patientId)
    )

    expect(res.status).toBe(400)
  })

  it('returns 404 when patient profile not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-1', userType: 'doctor', email: 'd@e.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue(null)

    const res = await postMedicalRecord(
      createPostRequest(`/api/patients/${patientId}/medical-records`, validRecord),
      mockParams(patientId)
    )

    expect(res.status).toBe(404)
  })
})
