import { randomBytes, createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.JWT_SECRET || 'omd-csrf-dev-secret'
const CSRF_COOKIE_NAME = 'omd_csrf'
const CSRF_HEADER_NAME = 'x-csrf-token'
const TOKEN_EXPIRY_MS = 4 * 60 * 60 * 1000 // 4 hours

/**
 * Generate a CSRF token: random bytes + timestamp + HMAC signature.
 * Format: {random}.{timestamp}.{signature}
 */
export function generateCsrfToken(): string {
  const random = randomBytes(32).toString('hex')
  const timestamp = Date.now().toString()
  const payload = `${random}.${timestamp}`
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(payload)
    .digest('hex')
  return `${payload}.${signature}`
}

/**
 * Verify a CSRF token by checking its HMAC signature and expiry.
 */
export function verifyCsrfToken(token: string): boolean {
  if (!token) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false

  const [random, timestamp, signature] = parts
  if (!random || !timestamp || !signature) return false

  // Check expiry
  const tokenTime = parseInt(timestamp, 10)
  if (isNaN(tokenTime) || Date.now() - tokenTime > TOKEN_EXPIRY_MS) {
    return false
  }

  // Verify HMAC
  const payload = `${random}.${timestamp}`
  const expectedSignature = createHmac('sha256', CSRF_SECRET)
    .update(payload)
    .digest('hex')

  // Constant-time comparison
  if (signature.length !== expectedSignature.length) return false
  let mismatch = 0
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i)
  }
  return mismatch === 0
}

/**
 * Middleware helper: validate CSRF on state-changing requests.
 * Returns a 403 NextResponse if invalid, or null if valid.
 */
export function validateCsrf(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase()

  // Only validate state-changing methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return null
  }

  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  if (!cookieToken || !headerToken) {
    return NextResponse.json(
      { success: false, message: 'Missing CSRF token' },
      { status: 403 }
    )
  }

  // Double-submit: cookie must match header
  if (cookieToken !== headerToken) {
    return NextResponse.json(
      { success: false, message: 'CSRF token mismatch' },
      { status: 403 }
    )
  }

  // Verify the token itself
  if (!verifyCsrfToken(cookieToken)) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired CSRF token' },
      { status: 403 }
    )
  }

  return null
}

/**
 * Set a CSRF token cookie on the response.
 * Call this from GET routes (e.g., /api/auth/csrf) so the client can
 * read the cookie and send it back as a header.
 */
export function setCsrfCookie(response: NextResponse): NextResponse {
  const token = generateCsrfToken()
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Client JS needs to read the cookie to set the header
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: TOKEN_EXPIRY_MS / 1000,
  })
  return response
}
