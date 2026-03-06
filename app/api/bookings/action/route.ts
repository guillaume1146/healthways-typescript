import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { processServicePayment } from '@/lib/commission'
import { createNotification } from '@/lib/notifications'
import { rateLimitPublic } from '@/lib/rate-limit'
import { z } from 'zod'

const actionSchema = z.object({
  bookingId: z.string().min(1),
  bookingType: z.enum(['doctor', 'nurse', 'nanny', 'lab_test', 'emergency']),
  action: z.enum(['accept', 'deny']),
})

/**
 * POST /api/bookings/action
 * Unified accept/deny endpoint for all booking types.
 * On accept: confirms booking + processes payment via commission system.
 * On deny: sets status to 'cancelled' and notifies patient.
 */
export async function POST(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = actionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { bookingId, bookingType, action } = parsed.data

    if (action === 'deny') {
      return handleDeny(bookingId, bookingType, auth.sub)
    }

    // Accept flow — delegates to confirm logic
    return handleAccept(bookingId, bookingType, auth.sub)
  } catch (error) {
    console.error('POST /api/bookings/action error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

async function handleDeny(bookingId: string, bookingType: string, providerUserId: string) {
  let patientUserId: string | null = null
  let description = ''

  if (bookingType === 'doctor') {
    const booking = await prisma.appointment.findUnique({
      where: { id: bookingId },
      include: { doctor: { select: { userId: true } }, patient: { select: { userId: true } } },
    })
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    if (booking.doctor.userId !== providerUserId) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    patientUserId = booking.patient.userId
    description = 'Doctor consultation'
    await prisma.appointment.update({ where: { id: bookingId }, data: { status: 'cancelled' } })

  } else if (bookingType === 'nurse') {
    const booking = await prisma.nurseBooking.findUnique({
      where: { id: bookingId },
      include: { nurse: { select: { userId: true } }, patient: { select: { userId: true } } },
    })
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    if (booking.nurse.userId !== providerUserId) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    patientUserId = booking.patient.userId
    description = 'Nurse visit'
    await prisma.nurseBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })

  } else if (bookingType === 'nanny') {
    const booking = await prisma.childcareBooking.findUnique({
      where: { id: bookingId },
      include: { nanny: { select: { userId: true } }, patient: { select: { userId: true } } },
    })
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    if (booking.nanny.userId !== providerUserId) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    patientUserId = booking.patient.userId
    description = 'Childcare session'
    await prisma.childcareBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })

  } else if (bookingType === 'lab_test') {
    const booking = await prisma.labTestBooking.findUnique({
      where: { id: bookingId },
      include: { labTech: { select: { userId: true } }, patient: { select: { userId: true } } },
    })
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    if (!booking.labTech || booking.labTech.userId !== providerUserId) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    patientUserId = booking.patient.userId
    description = `Lab test: ${booking.testName}`
    await prisma.labTestBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })

  } else if (bookingType === 'emergency') {
    const booking = await prisma.emergencyBooking.findUnique({
      where: { id: bookingId },
      include: { patient: { select: { userId: true } } },
    })
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    patientUserId = booking.patient.userId
    description = 'Emergency request'
    await prisma.emergencyBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })
  }

  if (patientUserId) {
    await createNotification({
      userId: patientUserId,
      type: 'booking_declined',
      title: 'Booking Declined',
      message: `Your ${description} request has been declined by the provider.`,
      referenceId: bookingId,
      referenceType: bookingType === 'doctor' ? 'appointment' : `${bookingType}_booking`,
    })
  }

  return NextResponse.json({ success: true, message: 'Booking declined' })
}

async function handleAccept(bookingId: string, bookingType: string, providerUserId: string) {
  let patientUserId: string | null = null
  let amount = 0
  let description = ''

  if (bookingType === 'doctor') {
    const appointment = await prisma.appointment.findUnique({
      where: { id: bookingId },
      include: {
        doctor: { select: { userId: true, consultationFee: true, videoConsultationFee: true } },
        patient: { select: { userId: true } },
      },
    })
    if (!appointment) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    if (appointment.doctor.userId !== providerUserId) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    patientUserId = appointment.patient.userId
    amount = appointment.servicePrice
      ?? (appointment.type === 'video' ? appointment.doctor.videoConsultationFee : appointment.doctor.consultationFee)
    description = appointment.serviceName
      ? `Doctor: ${appointment.serviceName} (${appointment.type})`
      : `Doctor consultation (${appointment.type})`
    await prisma.appointment.update({ where: { id: bookingId }, data: { status: 'upcoming' } })

  } else if (bookingType === 'nurse') {
    const booking = await prisma.nurseBooking.findUnique({
      where: { id: bookingId },
      include: { nurse: { select: { userId: true } }, patient: { select: { userId: true } } },
    })
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    if (booking.nurse.userId !== providerUserId) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    patientUserId = booking.patient.userId
    amount = booking.servicePrice ?? 500
    description = booking.serviceName ? `Nurse: ${booking.serviceName} (${booking.type})` : `Nurse visit (${booking.type})`
    await prisma.nurseBooking.update({ where: { id: bookingId }, data: { status: 'upcoming' } })

  } else if (bookingType === 'nanny') {
    const booking = await prisma.childcareBooking.findUnique({
      where: { id: bookingId },
      include: { nanny: { select: { userId: true } }, patient: { select: { userId: true } } },
    })
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    if (booking.nanny.userId !== providerUserId) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    patientUserId = booking.patient.userId
    amount = booking.servicePrice ?? 400
    description = booking.serviceName ? `Childcare: ${booking.serviceName} (${booking.type})` : `Childcare session (${booking.type})`
    await prisma.childcareBooking.update({ where: { id: bookingId }, data: { status: 'upcoming' } })

  } else if (bookingType === 'lab_test') {
    const booking = await prisma.labTestBooking.findUnique({
      where: { id: bookingId },
      include: { labTech: { select: { userId: true } }, patient: { select: { userId: true } } },
    })
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    if (!booking.labTech || booking.labTech.userId !== providerUserId) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    patientUserId = booking.patient.userId
    amount = booking.price ?? 500
    description = `Lab test: ${booking.testName}`
    await prisma.labTestBooking.update({ where: { id: bookingId }, data: { status: 'upcoming' } })

  } else if (bookingType === 'emergency') {
    await prisma.emergencyBooking.update({
      where: { id: bookingId },
      data: { status: 'dispatched', responderId: providerUserId },
    })
    return NextResponse.json({ success: true, message: 'Emergency booking accepted (no charge during trial)' })
  }

  if (!patientUserId) {
    return NextResponse.json({ success: false, message: 'Could not determine patient' }, { status: 400 })
  }

  // Process payment with commission split
  const paymentResult = await processServicePayment({
    patientUserId,
    providerUserId,
    amount,
    description,
    serviceType: bookingType === 'lab_test' ? 'lab_test' : bookingType === 'doctor' ? 'consultation' : bookingType,
    referenceId: bookingId,
  })

  if (!paymentResult.success) {
    if (paymentResult.error === 'INSUFFICIENT_BALANCE') {
      return NextResponse.json({ success: false, message: 'Patient has insufficient balance' }, { status: 400 })
    }
    if (paymentResult.error === 'WALLET_NOT_FOUND') {
      return NextResponse.json({ success: false, message: 'Patient wallet not found' }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: 'Payment processing failed' }, { status: 500 })
  }

  await createNotification({
    userId: patientUserId,
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: `Your ${description} has been confirmed. Rs ${amount} has been charged.`,
    referenceId: bookingId,
    referenceType: bookingType === 'doctor' ? 'appointment' : `${bookingType}_booking`,
  })

  return NextResponse.json({
    success: true,
    message: 'Booking confirmed and payment processed',
    data: { amount, description },
  })
}
