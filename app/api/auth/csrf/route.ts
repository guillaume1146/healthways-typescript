import { NextResponse } from 'next/server'
import { generateCsrfToken } from '@/lib/auth/csrf'

/**
 * GET /api/auth/csrf
 * Returns a CSRF token and sets it as a cookie.
 * The client should include this token in the x-csrf-token header
 * on all state-changing requests (POST, PUT, PATCH, DELETE).
 */
export async function GET() {
  const token = generateCsrfToken()

  const response = NextResponse.json({
    success: true,
    data: { csrfToken: token },
  })

  response.cookies.set('mediwyz_csrf', token, {
    httpOnly: false, // Client JS must read this to set the header
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 4 * 60 * 60, // 4 hours
  })

  return response
}
