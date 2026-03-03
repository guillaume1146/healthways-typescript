import { NextResponse } from 'next/server'

/**
 * Return a standardised success JSON response.
 *
 * @param data - The payload to include under `data`.
 * @param message - Optional human-readable message.
 */
export function apiSuccess<T>(data: T, message?: string) {
  return NextResponse.json({ success: true, data, ...(message && { message }) })
}

/**
 * Return a standardised error JSON response.
 *
 * @param message - Human-readable error description.
 * @param status - HTTP status code (defaults to 400).
 */
export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ success: false, message }, { status })
}

/**
 * Return a generic 500 Internal Server Error response.
 */
export function apiServerError() {
  return NextResponse.json(
    { success: false, message: 'Internal server error' },
    { status: 500 }
  )
}
