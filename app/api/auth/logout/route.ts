import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/auth/cookies'
import { rateLimitAuth } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  const response = NextResponse.json({ success: true, message: 'Logged out' })
  clearAuthCookies(response)
  return response
}
