import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { processServicePayment } from '@/lib/commission'
import { rateLimitPublic } from '@/lib/rate-limit'
import { resolveAndConfirmBooking } from '@/lib/bookings/resolve-booking'
import { z } from 'zod'

const confirmBookingSchema = z.object({
  bookingId: z.string().min(1),
  bookingType: z.enum(['doctor', 'nurse', 'nanny', 'lab_test', 'emergency']),
})

export async function POST(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = confirmBookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { bookingId, bookingType } = parsed.data

    // Emergency bookings are free during trial
    if (bookingType === 'emergency') {
      await prisma.emergencyBooking.update({
        where: { id: bookingId },
        data: { status: 'dispatched', responderId: auth.sub },
      })
      return NextResponse.json({
        success: true,
        message: 'Emergency booking confirmed (no charge during trial)',
      })
    }

    const result = await resolveAndConfirmBooking(bookingId, bookingType, auth.sub)
    if (result.error) {
      return NextResponse.json({ success: false, message: result.error.message }, { status: result.error.status })
    }

    const { patientUserId, amount, description, serviceType } = result.data!

    const paymentResult = await processServicePayment({
      patientUserId,
      providerUserId: result.data!.providerUserId,
      amount,
      description,
      serviceType,
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

    // NOTE: Notification is NOT created here — /api/bookings/action is the
    // primary endpoint and already sends the booking_confirmed notification.
    // Creating one here too caused duplicate notifications.

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed and payment processed',
      data: { amount, description },
    })
  } catch (error) {
    console.error('POST /api/bookings/confirm error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
