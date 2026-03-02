import { NextResponse } from 'next/server'

/**
 * Parse and validate pagination parameters from URL search params.
 * Caps limit at MAX_LIMIT (50) and ensures offset is non-negative.
 */
const MAX_LIMIT = 50
const DEFAULT_LIMIT = 20

export function parsePagination(searchParams: URLSearchParams): { limit: number; offset: number } {
  const rawLimit = parseInt(searchParams.get('limit') || '', 10)
  const rawOffset = parseInt(searchParams.get('offset') || '', 10)

  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT
  const offset = Number.isFinite(rawOffset) && rawOffset >= 0 ? rawOffset : 0

  return { limit, offset }
}

/**
 * Standard success response.
 */
export function successResponse<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  return NextResponse.json({ success: true, data, ...meta }, { status })
}

/**
 * Standard error response.
 */
export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ success: false, message }, { status })
}
