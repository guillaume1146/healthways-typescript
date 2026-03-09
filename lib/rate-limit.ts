import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes (only at runtime, not during build)
if (typeof globalThis !== 'undefined' && typeof process !== 'undefined' && process.env.NODE_ENV !== undefined) {
  const cleanup = () => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key)
    }
  }
  if (typeof setInterval !== 'undefined') {
    setInterval(cleanup, 5 * 60 * 1000).unref?.()
  }
}

/**
 * In-memory sliding window rate limiter.
 * Returns null if allowed, or a 429 NextResponse if rate limited.
 */
export function rateLimit(
  request: NextRequest,
  opts: { limit: number; windowMs: number; prefix?: string }
): NextResponse | null {
  const { limit, windowMs, prefix = '' } = opts
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  const key = `${prefix}:${ip}`
  const now = Date.now()

  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  entry.count++

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    )
  }

  return null
}

/** Auth routes: 5 requests per minute per IP (strict to prevent brute-force) */
export function rateLimitAuth(request: NextRequest) {
  return rateLimit(request, { limit: 5, windowMs: 60_000, prefix: 'auth' })
}

/** Search routes: 30 requests per minute per IP */
export function rateLimitSearch(request: NextRequest) {
  return rateLimit(request, { limit: 30, windowMs: 60_000, prefix: 'search' })
}

/** Upload/heavy routes: 5 requests per minute per IP */
export function rateLimitHeavy(request: NextRequest) {
  return rateLimit(request, { limit: 5, windowMs: 60_000, prefix: 'heavy' })
}

/** General public routes: 60 requests per minute per IP */
export function rateLimitPublic(request: NextRequest) {
  return rateLimit(request, { limit: 60, windowMs: 60_000, prefix: 'public' })
}
