import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  default: {
    appointment: { findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
    nurseBooking: { findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
    childcareBooking: { findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
    labTestBooking: { findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
    emergencyBooking: { findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
    emergencyWorkerProfile: { findUnique: vi.fn() },
    conversation: { findFirst: vi.fn(), create: vi.fn() },
    patientProfile: { findUnique: vi.fn() },
    user: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn(() => null),
}))

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}))

vi.mock('@/lib/commission', () => ({
  processServicePayment: vi.fn(() => ({ success: true, transactionId: 'tx-1' })),
}))

import { POST as postAction } from '../bookings/action/route'
import { POST as postCancel } from '../bookings/cancel/route'
import { POST as postReschedule } from '../bookings/reschedule/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { processServicePayment } from '@/lib/commission'
import { createNotification } from '@/lib/notifications'
import { NextRequest } from 'next/server'

function createPostRequest(url: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost:3000${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ─── /api/bookings/action ───

describe('POST /api/bookings/action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await postAction(createPostRequest('/api/bookings/action', {
      bookingId: 'b-1', bookingType: 'doctor', action: 'accept',
    }))

    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid body', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-1', userType: 'doctor', email: 'd@e.com' })

    const res = await postAction(createPostRequest('/api/bookings/action', {
      bookingId: '', bookingType: 'invalid', action: 'accept',
    }))

    expect(res.status).toBe(400)
  })

  it('accepts doctor booking with payment processing', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-user-1', userType: 'doctor', email: 'd@e.com' })
    vi.mocked(prisma.appointment.findUnique).mockResolvedValue({
      id: 'apt-1', type: 'video', servicePrice: 800, serviceName: 'Consultation',
      doctor: { userId: 'doc-user-1', consultationFee: 500, videoConsultationFee: 400 },
      patient: { userId: 'patient-user-1' },
    } as never)
    vi.mocked(prisma.appointment.update).mockResolvedValue({ id: 'apt-1', status: 'upcoming' } as never)

    const res = await postAction(createPostRequest('/api/bookings/action', {
      bookingId: 'apt-1', bookingType: 'doctor', action: 'accept',
    }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(processServicePayment).toHaveBeenCalledWith(expect.objectContaining({
      patientUserId: 'patient-user-1',
      providerUserId: 'doc-user-1',
      amount: 800,
    }))
    expect(createNotification).toHaveBeenCalled()
  })

  it('denies doctor booking and notifies patient', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-user-1', userType: 'doctor', email: 'd@e.com' })
    vi.mocked(prisma.appointment.findUnique).mockResolvedValue({
      id: 'apt-1',
      doctor: { userId: 'doc-user-1' },
      patient: { userId: 'patient-user-1' },
    } as never)
    vi.mocked(prisma.appointment.update).mockResolvedValue({ id: 'apt-1', status: 'cancelled' } as never)

    const res = await postAction(createPostRequest('/api/bookings/action', {
      bookingId: 'apt-1', bookingType: 'doctor', action: 'deny',
    }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Booking declined')
    expect(prisma.appointment.update).toHaveBeenCalledWith({
      where: { id: 'apt-1' }, data: { status: 'cancelled' },
    })
    expect(createNotification).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'patient-user-1',
      type: 'booking_declined',
    }))
  })

  it('returns 403 when provider does not own booking', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'wrong-doc', userType: 'doctor', email: 'd@e.com' })
    vi.mocked(prisma.appointment.findUnique).mockResolvedValue({
      id: 'apt-1',
      doctor: { userId: 'other-doc' },
      patient: { userId: 'patient-user-1' },
    } as never)

    const res = await postAction(createPostRequest('/api/bookings/action', {
      bookingId: 'apt-1', bookingType: 'doctor', action: 'accept',
    }))

    expect(res.status).toBe(403)
  })

  it('returns 404 when booking not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-1', userType: 'doctor', email: 'd@e.com' })
    vi.mocked(prisma.appointment.findUnique).mockResolvedValue(null)

    const res = await postAction(createPostRequest('/api/bookings/action', {
      bookingId: 'nonexistent', bookingType: 'doctor', action: 'accept',
    }))

    expect(res.status).toBe(404)
  })

  it('accepts nurse booking', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'nurse-user-1', userType: 'nurse', email: 'n@e.com' })
    vi.mocked(prisma.nurseBooking.findUnique).mockResolvedValue({
      id: 'nb-1', type: 'home_visit', servicePrice: 600, serviceName: 'Wound Care',
      nurse: { userId: 'nurse-user-1' },
      patient: { userId: 'patient-user-1' },
    } as never)
    vi.mocked(prisma.nurseBooking.update).mockResolvedValue({ id: 'nb-1', status: 'upcoming' } as never)

    const res = await postAction(createPostRequest('/api/bookings/action', {
      bookingId: 'nb-1', bookingType: 'nurse', action: 'accept',
    }))
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(processServicePayment).toHaveBeenCalled()
  })

  it('accepts emergency booking without payment', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'ew-user-1', userType: 'ambulance', email: 'e@e.com' })
    vi.mocked(prisma.emergencyWorkerProfile.findUnique).mockResolvedValue({ id: 'ewp-1' } as never)
    vi.mocked(prisma.emergencyBooking.findUnique).mockResolvedValue({ id: 'eb-1', patient: { userId: 'patient-1' } } as never)
    vi.mocked(prisma.emergencyBooking.update).mockResolvedValue({ id: 'eb-1', status: 'dispatched' } as never)
    vi.mocked(prisma.conversation.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.conversation.create).mockResolvedValue({ id: 'conv-1' } as never)

    const res = await postAction(createPostRequest('/api/bookings/action', {
      bookingId: 'eb-1', bookingType: 'emergency', action: 'accept',
    }))
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(processServicePayment).not.toHaveBeenCalled()
  })

  it('returns 400 when patient has insufficient balance', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc-user-1', userType: 'doctor', email: 'd@e.com' })
    vi.mocked(prisma.appointment.findUnique).mockResolvedValue({
      id: 'apt-1', type: 'video', servicePrice: 800, serviceName: null,
      doctor: { userId: 'doc-user-1', consultationFee: 500, videoConsultationFee: 400 },
      patient: { userId: 'patient-user-1' },
    } as never)
    vi.mocked(prisma.appointment.update).mockResolvedValue({ id: 'apt-1', status: 'upcoming' } as never)
    vi.mocked(processServicePayment).mockResolvedValue({ success: false, error: 'INSUFFICIENT_BALANCE' } as never)

    const res = await postAction(createPostRequest('/api/bookings/action', {
      bookingId: 'apt-1', bookingType: 'doctor', action: 'accept',
    }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.message).toContain('insufficient balance')
  })
})

// ─── /api/bookings/cancel ───

describe('POST /api/bookings/cancel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await postCancel(createPostRequest('/api/bookings/cancel', {
      bookingId: 'b-1', bookingType: 'doctor',
    }))

    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid body', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'p-1', userType: 'patient', email: 'p@e.com' })

    const res = await postCancel(createPostRequest('/api/bookings/cancel', {
      bookingId: '', bookingType: 'invalid',
    }))

    expect(res.status).toBe(400)
  })

  it('cancels a doctor appointment', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'patient-user-1', userType: 'patient', email: 'p@e.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: 'pat-1' } as never)
    vi.mocked(prisma.appointment.findFirst).mockResolvedValue({
      id: 'apt-1', doctor: { userId: 'doc-user-1' },
    } as never)
    vi.mocked(prisma.appointment.update).mockResolvedValue({ id: 'apt-1', status: 'cancelled' } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ firstName: 'John', lastName: 'Doe' } as never)

    const res = await postCancel(createPostRequest('/api/bookings/cancel', {
      bookingId: 'apt-1', bookingType: 'doctor',
    }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(prisma.appointment.update).toHaveBeenCalledWith({
      where: { id: 'apt-1' }, data: { status: 'cancelled' },
    })
    expect(createNotification).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'doc-user-1',
      type: 'booking_cancelled',
    }))
  })

  it('returns 404 when patient profile not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'p-1', userType: 'patient', email: 'p@e.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue(null)

    const res = await postCancel(createPostRequest('/api/bookings/cancel', {
      bookingId: 'apt-1', bookingType: 'doctor',
    }))

    expect(res.status).toBe(404)
  })

  it('returns 404 when booking not found or not cancellable', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'p-1', userType: 'patient', email: 'p@e.com' })
    vi.mocked(prisma.patientProfile.findUnique).mockResolvedValue({ id: 'pat-1' } as never)
    vi.mocked(prisma.appointment.findFirst).mockResolvedValue(null)

    const res = await postCancel(createPostRequest('/api/bookings/cancel', {
      bookingId: 'nonexistent', bookingType: 'doctor',
    }))

    expect(res.status).toBe(404)
  })
})

// ─── /api/bookings/reschedule ───

describe('POST /api/bookings/reschedule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await postReschedule(createPostRequest('/api/bookings/reschedule', {
      bookingId: 'b-1', bookingType: 'doctor', newDate: '2026-04-15', newTime: '14:00',
    }))

    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid body', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'p-1', userType: 'patient', email: 'p@e.com' })

    const res = await postReschedule(createPostRequest('/api/bookings/reschedule', {
      bookingId: 'b-1', bookingType: 'emergency', newDate: 'bad', newTime: '14:00',
    }))

    expect(res.status).toBe(400)
  })

  it('reschedules doctor appointment as patient', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'patient-user-1', userType: 'patient', email: 'p@e.com' })
    vi.mocked(prisma.appointment.findUnique).mockResolvedValue({
      id: 'apt-1', status: 'upcoming',
      doctor: { userId: 'doc-user-1' },
      patient: { userId: 'patient-user-1' },
    } as never)
    vi.mocked(prisma.appointment.update).mockResolvedValue({ id: 'apt-1' } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ firstName: 'John', lastName: 'Doe' } as never)

    const res = await postReschedule(createPostRequest('/api/bookings/reschedule', {
      bookingId: 'apt-1', bookingType: 'doctor', newDate: '2026-04-15', newTime: '14:00',
    }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(prisma.appointment.update).toHaveBeenCalledWith({
      where: { id: 'apt-1' },
      data: { scheduledAt: expect.any(Date) },
    })
    expect(createNotification).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'doc-user-1',
      type: 'booking_rescheduled',
    }))
  })

  it('returns 403 for unrelated user', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'random-user', userType: 'patient', email: 'r@e.com' })
    vi.mocked(prisma.appointment.findUnique).mockResolvedValue({
      id: 'apt-1', status: 'upcoming',
      doctor: { userId: 'doc-user-1' },
      patient: { userId: 'patient-user-1' },
    } as never)

    const res = await postReschedule(createPostRequest('/api/bookings/reschedule', {
      bookingId: 'apt-1', bookingType: 'doctor', newDate: '2026-04-15', newTime: '14:00',
    }))

    expect(res.status).toBe(403)
  })

  it('returns 404 for completed booking', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'patient-user-1', userType: 'patient', email: 'p@e.com' })
    vi.mocked(prisma.appointment.findUnique).mockResolvedValue({
      id: 'apt-1', status: 'completed',
      doctor: { userId: 'doc-user-1' },
      patient: { userId: 'patient-user-1' },
    } as never)

    const res = await postReschedule(createPostRequest('/api/bookings/reschedule', {
      bookingId: 'apt-1', bookingType: 'doctor', newDate: '2026-04-15', newTime: '14:00',
    }))

    expect(res.status).toBe(404)
  })
})
