import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { createNotification } from '@/lib/notifications'
import { rateLimitPublic } from '@/lib/rate-limit'
import { ensurePatientProfile } from '@/lib/bookings/ensure-patient-profile'
import { z } from 'zod'

const cancelSchema = z.object({
  bookingId: z.string().min(1),
  bookingType: z.enum(['doctor', 'nurse', 'nanny', 'lab_test', 'emergency']),
})

/**
 * POST /api/bookings/cancel
 * Patient cancels their own booking (only if status is 'pending' or 'upcoming').
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
    const parsed = cancelSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { bookingId, bookingType } = parsed.data

    // Find or auto-create patient profile (any user type can cancel their bookings)
    const patientProfile = await ensurePatientProfile(auth.sub)

    let providerUserId: string | null = null
    let description = ''

    if (bookingType === 'doctor') {
      const booking = await prisma.appointment.findFirst({
        where: { id: bookingId, patientId: patientProfile.id, status: { in: ['pending', 'upcoming'] } },
        include: { doctor: { select: { userId: true } } },
      })
      if (!booking) return NextResponse.json({ success: false, message: 'Booking not found or cannot be cancelled' }, { status: 404 })
      providerUserId = booking.doctor.userId
      description = 'Doctor consultation'
      await prisma.appointment.update({ where: { id: bookingId }, data: { status: 'cancelled' } })

    } else if (bookingType === 'nurse') {
      const booking = await prisma.nurseBooking.findFirst({
        where: { id: bookingId, patientId: patientProfile.id, status: { in: ['pending', 'upcoming'] } },
        include: { nurse: { select: { userId: true } } },
      })
      if (!booking) return NextResponse.json({ success: false, message: 'Booking not found or cannot be cancelled' }, { status: 404 })
      providerUserId = booking.nurse.userId
      description = 'Nurse visit'
      await prisma.nurseBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })

    } else if (bookingType === 'nanny') {
      const booking = await prisma.childcareBooking.findFirst({
        where: { id: bookingId, patientId: patientProfile.id, status: { in: ['pending', 'upcoming'] } },
        include: { nanny: { select: { userId: true } } },
      })
      if (!booking) return NextResponse.json({ success: false, message: 'Booking not found or cannot be cancelled' }, { status: 404 })
      providerUserId = booking.nanny.userId
      description = 'Childcare session'
      await prisma.childcareBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })

    } else if (bookingType === 'lab_test') {
      const booking = await prisma.labTestBooking.findFirst({
        where: { id: bookingId, patientId: patientProfile.id, status: { in: ['pending', 'upcoming'] } },
        include: { labTech: { select: { userId: true } } },
      })
      if (!booking) return NextResponse.json({ success: false, message: 'Booking not found or cannot be cancelled' }, { status: 404 })
      providerUserId = booking.labTech?.userId ?? null
      description = `Lab test: ${booking.testName}`
      await prisma.labTestBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })

    } else if (bookingType === 'emergency') {
      const booking = await prisma.emergencyBooking.findFirst({
        where: { id: bookingId, patientId: patientProfile.id, status: { in: ['pending', 'dispatched'] } },
      })
      if (!booking) return NextResponse.json({ success: false, message: 'Booking not found or cannot be cancelled' }, { status: 404 })
      description = 'Emergency request'
      await prisma.emergencyBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })
    }

    // Notify provider about cancellation
    if (providerUserId) {
      const patient = await prisma.user.findUnique({
        where: { id: auth.sub },
        select: { firstName: true, lastName: true },
      })
      await createNotification({
        userId: providerUserId,
        type: 'booking_cancelled',
        title: 'Booking Cancelled',
        message: `${patient?.firstName} ${patient?.lastName} has cancelled their ${description} booking.`,
        referenceId: bookingId,
        referenceType: bookingType === 'doctor' ? 'appointment' : `${bookingType}_booking`,
      })
    }

    return NextResponse.json({ success: true, message: 'Booking cancelled successfully' })
  } catch (error) {
    console.error('POST /api/bookings/cancel error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
