import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { acceptBooking, denyBooking } from '@/lib/booking-actions'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { action } = await request.json() as { action: string }

  if (!['accept', 'deny'].includes(action)) {
    return NextResponse.json({ success: false, message: 'Action must be accept or deny' }, { status: 400 })
  }

  try {
    if (action === 'accept') {
      const result = await acceptBooking(id, 'emergency', auth.sub)
      return NextResponse.json({ success: true, ...result })
    } else {
      await denyBooking(id, 'emergency', auth.sub)
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'NOT_FOUND') return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
      if (error.message === 'NOT_PENDING') return NextResponse.json({ success: false, message: 'Booking is not pending' }, { status: 400 })
      if (error.message === 'INSUFFICIENT_BALANCE') return NextResponse.json({ success: false, message: 'Patient has insufficient wallet balance' }, { status: 400 })
      if (error.message === 'WALLET_NOT_FOUND') return NextResponse.json({ success: false, message: 'Patient wallet not found' }, { status: 404 })
    }
    console.error('PATCH /api/bookings/emergency/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
