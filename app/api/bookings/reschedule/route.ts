import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { createNotification } from '@/lib/notifications'
import { rateLimitPublic } from '@/lib/rate-limit'
import { z } from 'zod'

const rescheduleSchema = z.object({
  bookingId: z.string().min(1),
  bookingType: z.enum(['doctor', 'nurse', 'nanny', 'lab_test']),
  newDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  newTime: z.string().regex(/^\d{2}:\d{2}$/),
})

/**
 * POST /api/bookings/reschedule
 * Reschedule a booking to a new date/time (patient or provider).
 * Only bookings with status 'pending' or 'upcoming' can be rescheduled.
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
    const parsed = rescheduleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { bookingId, bookingType, newDate, newTime } = parsed.data
    const newScheduledAt = new Date(`${newDate}T${newTime}:00`)

    if (isNaN(newScheduledAt.getTime())) {
      return NextResponse.json({ success: false, message: 'Invalid date/time' }, { status: 400 })
    }

    if (newScheduledAt <= new Date()) {
      return NextResponse.json({ success: false, message: 'New time must be in the future' }, { status: 400 })
    }

    let notifyUserId: string | null = null
    let description = ''

    if (bookingType === 'doctor') {
      const booking = await prisma.appointment.findUnique({
        where: { id: bookingId },
        include: {
          doctor: { select: { userId: true } },
          patient: { select: { userId: true } },
        },
      })
      if (!booking || !['pending', 'upcoming'].includes(booking.status)) {
        return NextResponse.json({ success: false, message: 'Booking not found or cannot be rescheduled' }, { status: 404 })
      }
      // Verify the requester is either the patient or the doctor
      const isPatient = booking.patient.userId === auth.sub
      const isDoctor = booking.doctor.userId === auth.sub
      if (!isPatient && !isDoctor) {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
      }
      await prisma.appointment.update({ where: { id: bookingId }, data: { scheduledAt: newScheduledAt } })
      notifyUserId = isPatient ? booking.doctor.userId : booking.patient.userId
      description = 'Doctor consultation'

    } else if (bookingType === 'nurse') {
      const booking = await prisma.nurseBooking.findUnique({
        where: { id: bookingId },
        include: {
          nurse: { select: { userId: true } },
          patient: { select: { userId: true } },
        },
      })
      if (!booking || !['pending', 'upcoming'].includes(booking.status)) {
        return NextResponse.json({ success: false, message: 'Booking not found or cannot be rescheduled' }, { status: 404 })
      }
      const isPatient = booking.patient.userId === auth.sub
      const isNurse = booking.nurse.userId === auth.sub
      if (!isPatient && !isNurse) {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
      }
      await prisma.nurseBooking.update({ where: { id: bookingId }, data: { scheduledAt: newScheduledAt } })
      notifyUserId = isPatient ? booking.nurse.userId : booking.patient.userId
      description = 'Nurse visit'

    } else if (bookingType === 'nanny') {
      const booking = await prisma.childcareBooking.findUnique({
        where: { id: bookingId },
        include: {
          nanny: { select: { userId: true } },
          patient: { select: { userId: true } },
        },
      })
      if (!booking || !['pending', 'upcoming'].includes(booking.status)) {
        return NextResponse.json({ success: false, message: 'Booking not found or cannot be rescheduled' }, { status: 404 })
      }
      const isPatient = booking.patient.userId === auth.sub
      const isNanny = booking.nanny.userId === auth.sub
      if (!isPatient && !isNanny) {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
      }
      await prisma.childcareBooking.update({ where: { id: bookingId }, data: { scheduledAt: newScheduledAt } })
      notifyUserId = isPatient ? booking.nanny.userId : booking.patient.userId
      description = 'Childcare session'

    } else if (bookingType === 'lab_test') {
      const booking = await prisma.labTestBooking.findUnique({
        where: { id: bookingId },
        include: {
          labTech: { select: { userId: true } },
          patient: { select: { userId: true } },
        },
      })
      if (!booking || !['pending', 'upcoming'].includes(booking.status)) {
        return NextResponse.json({ success: false, message: 'Booking not found or cannot be rescheduled' }, { status: 404 })
      }
      const isPatient = booking.patient.userId === auth.sub
      const isLabTech = booking.labTech?.userId === auth.sub
      if (!isPatient && !isLabTech) {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
      }
      await prisma.labTestBooking.update({ where: { id: bookingId }, data: { scheduledAt: newScheduledAt } })
      notifyUserId = isPatient ? (booking.labTech?.userId ?? null) : booking.patient.userId
      description = `Lab test: ${booking.testName}`
    }

    if (notifyUserId) {
      const requester = await prisma.user.findUnique({
        where: { id: auth.sub },
        select: { firstName: true, lastName: true },
      })
      await createNotification({
        userId: notifyUserId,
        type: 'booking_rescheduled',
        title: 'Booking Rescheduled',
        message: `${requester?.firstName} ${requester?.lastName} has rescheduled the ${description} to ${newDate} at ${newTime}.`,
        referenceId: bookingId,
        referenceType: bookingType === 'doctor' ? 'appointment' : `${bookingType}_booking`,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Booking rescheduled successfully',
      data: { newScheduledAt: newScheduledAt.toISOString() },
    })
  } catch (error) {
    console.error('POST /api/bookings/reschedule error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
