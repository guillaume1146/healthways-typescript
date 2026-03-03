import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { acceptBooking, denyBooking, cancelBooking } from '@/lib/booking-actions'
import { bookingActionSchema } from '@/lib/validations/api'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const parsed = bookingActionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 })
  }
  const { action, reason } = parsed.data

  try {
    if (action === 'accept') {
      const result = await acceptBooking(id, 'nurse', auth.sub)
      return NextResponse.json({ success: true, ...result })
    } else if (action === 'cancel') {
      const result = await cancelBooking(id, 'nurse', auth.sub, reason)
      return NextResponse.json({ success: true, ...result })
    } else {
      await denyBooking(id, 'nurse', auth.sub)
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'NOT_FOUND') return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
      if (error.message === 'NOT_PENDING') return NextResponse.json({ success: false, message: 'Booking is not pending' }, { status: 400 })
      if (error.message === 'NOT_CANCELLABLE') return NextResponse.json({ success: false, message: 'Booking cannot be cancelled in its current state' }, { status: 400 })
      if (error.message === 'INSUFFICIENT_BALANCE') return NextResponse.json({ success: false, message: 'Patient has insufficient wallet balance' }, { status: 400 })
      if (error.message === 'WALLET_NOT_FOUND') return NextResponse.json({ success: false, message: 'Patient wallet not found' }, { status: 404 })
    }
    console.error('PATCH /api/bookings/nurse/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
