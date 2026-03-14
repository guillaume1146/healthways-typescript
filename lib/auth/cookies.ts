import { NextResponse } from 'next/server'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_URL?.startsWith('https'),
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
}

export function setAuthCookies(
  response: NextResponse,
  token: string,
  userType: string,
  userId: string
) {
  response.cookies.set('mediwyz_token', token, COOKIE_OPTIONS)
  response.cookies.set('mediwyz_userType', userType, { ...COOKIE_OPTIONS, httpOnly: false })
  response.cookies.set('mediwyz_user_id', userId, { ...COOKIE_OPTIONS, httpOnly: false })
}

export function clearAuthCookies(response: NextResponse) {
  const clearOptions = { ...COOKIE_OPTIONS, maxAge: 0 }
  response.cookies.set('mediwyz_token', '', clearOptions)
  response.cookies.set('mediwyz_userType', '', { ...clearOptions, httpOnly: false })
  response.cookies.set('mediwyz_user_id', '', { ...clearOptions, httpOnly: false })
}
