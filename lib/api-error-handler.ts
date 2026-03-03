import { NextResponse } from 'next/server'

/**
 * Maps well-known booking error codes (thrown by lib/booking-actions.ts)
 * to user-facing messages and HTTP status codes.
 *
 * This eliminates the repeated if/else chain that appears in every
 * booking PATCH handler under app/api/bookings/.
 */
const BOOKING_ERROR_MAP: Record<string, { message: string; status: number }> = {
  NOT_FOUND: { message: 'Booking not found', status: 404 },
  NOT_PENDING: { message: 'Booking is not pending', status: 400 },
  NOT_CANCELLABLE: { message: 'Booking cannot be cancelled in its current state', status: 400 },
  INSUFFICIENT_BALANCE: { message: 'Patient has insufficient wallet balance', status: 400 },
  WALLET_NOT_FOUND: { message: 'Patient wallet not found', status: 404 },
}

/**
 * Convert a booking-action error into a NextResponse.
 *
 * If the error is an Error whose .message matches a known code the caller
 * gets a structured JSON error with the correct HTTP status. Otherwise a
 * generic 500 response is returned.
 *
 * In your catch block, call: return handleBookingError(error)
 */
export function handleBookingError(error: unknown) {
  if (error instanceof Error && error.message in BOOKING_ERROR_MAP) {
    const { message, status } = BOOKING_ERROR_MAP[error.message]
    return NextResponse.json({ success: false, message }, { status })
  }
  return NextResponse.json(
    { success: false, message: 'Internal server error' },
    { status: 500 }
  )
}
