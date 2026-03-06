import { NextResponse } from 'next/server'

/**
 * Standardized API response helpers.
 * Ensures consistent response shape across all endpoints.
 */

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({ success: false, message }, { status: 401 })
}

export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json({ success: false, message }, { status: 403 })
}

export function notFoundResponse(message = 'Not found') {
  return NextResponse.json({ success: false, message }, { status: 404 })
}

export function serverErrorResponse(message = 'Server error') {
  return NextResponse.json({ success: false, message }, { status: 500 })
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
) {
  return NextResponse.json({
    success: true,
    data,
    total,
    page,
    limit,
    totalPages,
  })
}
