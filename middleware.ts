import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Verify a JWT token using Web Crypto API (Edge-compatible).
 * Returns decoded payload if valid and not expired, null otherwise.
 */
async function verifyJWT(token: string): Promise<{ sub: string; userType: string; email: string } | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const secret = process.env.JWT_SECRET || 'healthwyz-dev-secret-change-in-production'
    const encoder = new TextEncoder()

    // Import HMAC key for verification
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Decode base64url signature
    const signatureB64 = parts[2].replace(/-/g, '+').replace(/_/g, '/')
    const paddedSig = signatureB64 + '='.repeat((4 - signatureB64.length % 4) % 4)
    const signatureBytes = Uint8Array.from(atob(paddedSig), c => c.charCodeAt(0))

    // Verify HMAC signature
    const data = encoder.encode(`${parts[0]}.${parts[1]}`)
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, data)
    if (!valid) return null

    // Decode payload
    const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = payloadB64 + '='.repeat((4 - payloadB64.length % 4) % 4)
    const payload = JSON.parse(atob(paddedPayload))

    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) return null

    if (!payload.sub || !payload.userType) return null

    return { sub: payload.sub, userType: payload.userType, email: payload.email }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const protectedRoutes: Record<string, string[]> = {
    '/patient': ['patient'],
    '/doctor': ['doctor'],
    '/nurse': ['nurse'],
    '/nanny': ['child-care-nurse'],
    '/pharmacist': ['pharmacy'],
    '/lab-technician': ['lab'],
    '/responder': ['ambulance'],
    '/admin': ['admin'],
    '/corporate': ['corporate'],
    '/insurance': ['insurance'],
    '/referral-partner': ['referral-partner'],
    '/super-admin': ['super-admin']
  }

  const protectedRoute = Object.keys(protectedRoutes).find(route =>
    pathname.startsWith(route)
  )

  if (protectedRoute) {
    const token = request.cookies.get('healthwyz_token')
    const userType = request.cookies.get('healthwyz_userType')

    if (!token || !userType) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Validate JWT signature and expiration
    const payload = await verifyJWT(token.value)
    if (!payload) {
      // Token is invalid or expired — clear cookies and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('healthwyz_token')
      response.cookies.delete('healthwyz_userType')
      return response
    }

    const allowedTypes = protectedRoutes[protectedRoute]
    if (!allowedTypes.includes(userType.value)) {
      const correctPath = getUserTypeRedirectPath(userType.value)
      return NextResponse.redirect(new URL(correctPath, request.url))
    }
  }

  return NextResponse.next()
}

function getUserTypeRedirectPath(userType: string): string {
  const redirectPaths: Record<string, string> = {
    'patient': '/patient/dashboard',
    'doctor': '/doctor/dashboard',
    'nurse': '/nurse/dashboard',
    'child-care-nurse': '/nanny/dashboard',
    'pharmacy': '/pharmacist/dashboard',
    'lab': '/lab-technician/dashboard',
    'ambulance': '/responder/dashboard',
    'admin': '/admin/dashboard',
    'corporate': '/corporate/dashboard',
    'insurance': '/insurance/dashboard',
    'referral-partner': '/referral-partner/dashboard',
    'super-admin': '/super-admin/dashboard'
  }
  
  return redirectPaths[userType] || '/dashboard'
}

export const config = {
  matcher: [
    '/patient/:path*',
    '/doctor/:path*',
    '/nurse/:path*',
    '/nanny/:path*',
    '/pharmacist/:path*',
    '/lab-technician/:path*',
    '/responder/:path*',
    '/admin/:path*',
    '/corporate/:path*',
    '/insurance/:path*',
    '/referral-partner/:path*',
    '/super-admin/:path*'
  ]
}
