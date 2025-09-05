import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (
    pathname.startsWith('/login') ||
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
    '/referral-partner': ['referral-partner']
  }

  const protectedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  )

  if (protectedRoute) {
    const token = request.cookies.get('healthwyz_token')
    const userType = request.cookies.get('healthwyz_userType')

    console.log('Middleware check:', { pathname, token: !!token, userType: userType?.value })

    if (!token || !userType) {
      console.log('No token or userType, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const allowedTypes = protectedRoutes[protectedRoute]
    if (!allowedTypes.includes(userType.value)) {
      console.log('Wrong user type, redirecting to correct dashboard')
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
    'referral-partner': '/referral-partner/dashboard'
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
    '/referral-partner/:path*'
  ]
}
