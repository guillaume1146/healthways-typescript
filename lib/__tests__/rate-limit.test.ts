import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimit } from '../rate-limit'
import { NextRequest } from 'next/server'

function createMockRequest(ip: string = '127.0.0.1'): NextRequest {
  const req = new NextRequest('http://localhost:3000/api/test', {
    headers: {
      'x-forwarded-for': ip,
    },
  })
  return req
}

describe('rateLimit', () => {
  // Use a unique prefix per test to avoid cross-test pollution in the in-memory store
  let testPrefix: string

  beforeEach(() => {
    testPrefix = `test-${Date.now()}-${Math.random().toString(36).slice(2)}`
  })

  it('returns null (allowed) for the first request', () => {
    const request = createMockRequest('10.0.0.1')
    const result = rateLimit(request, { limit: 5, windowMs: 60000, prefix: testPrefix })
    expect(result).toBeNull()
  })

  it('returns null for requests within the limit', () => {
    const limit = 3
    for (let i = 0; i < limit; i++) {
      const request = createMockRequest('10.0.0.2')
      const result = rateLimit(request, { limit, windowMs: 60000, prefix: testPrefix })
      expect(result).toBeNull()
    }
  })

  it('returns a 429 response after exceeding the limit', () => {
    const limit = 2
    const ip = '10.0.0.3'

    // First two requests should be allowed (count 1 and 2, both <= limit)
    for (let i = 0; i < limit; i++) {
      const request = createMockRequest(ip)
      const result = rateLimit(request, { limit, windowMs: 60000, prefix: testPrefix })
      expect(result).toBeNull()
    }

    // Third request exceeds the limit (count 3 > 2)
    const request = createMockRequest(ip)
    const result = rateLimit(request, { limit, windowMs: 60000, prefix: testPrefix })
    expect(result).not.toBeNull()
    expect(result!.status).toBe(429)
  })

  it('rate limit response includes correct headers', async () => {
    const limit = 1
    const ip = '10.0.0.4'

    // First request allowed
    rateLimit(createMockRequest(ip), { limit, windowMs: 60000, prefix: testPrefix })

    // Second request should be blocked
    const result = rateLimit(createMockRequest(ip), { limit, windowMs: 60000, prefix: testPrefix })
    expect(result).not.toBeNull()
    expect(result!.headers.get('X-RateLimit-Limit')).toBe(String(limit))
    expect(result!.headers.get('X-RateLimit-Remaining')).toBe('0')
    expect(result!.headers.get('Retry-After')).toBeDefined()
    expect(result!.headers.get('X-RateLimit-Reset')).toBeDefined()
  })

  it('rate limit response body contains correct message', async () => {
    const limit = 1
    const ip = '10.0.0.5'

    rateLimit(createMockRequest(ip), { limit, windowMs: 60000, prefix: testPrefix })
    const result = rateLimit(createMockRequest(ip), { limit, windowMs: 60000, prefix: testPrefix })

    expect(result).not.toBeNull()
    const body = await result!.json()
    expect(body.success).toBe(false)
    expect(body.message).toContain('Too many requests')
  })

  it('different IPs have separate rate limits', () => {
    const limit = 1

    // IP A - first request
    const resultA = rateLimit(createMockRequest('10.0.0.10'), { limit, windowMs: 60000, prefix: testPrefix })
    expect(resultA).toBeNull()

    // IP B - first request (should also be allowed)
    const resultB = rateLimit(createMockRequest('10.0.0.11'), { limit, windowMs: 60000, prefix: testPrefix })
    expect(resultB).toBeNull()

    // IP A - second request (should be blocked)
    const resultA2 = rateLimit(createMockRequest('10.0.0.10'), { limit, windowMs: 60000, prefix: testPrefix })
    expect(resultA2).not.toBeNull()
    expect(resultA2!.status).toBe(429)

    // IP B - second request (should also be blocked)
    const resultB2 = rateLimit(createMockRequest('10.0.0.11'), { limit, windowMs: 60000, prefix: testPrefix })
    expect(resultB2).not.toBeNull()
    expect(resultB2!.status).toBe(429)
  })

  it('different prefixes have separate rate limits', () => {
    const limit = 1
    const ip = '10.0.0.20'

    // Prefix A
    const resultA = rateLimit(createMockRequest(ip), { limit, windowMs: 60000, prefix: `${testPrefix}-a` })
    expect(resultA).toBeNull()

    // Prefix B (same IP, different prefix, should be allowed)
    const resultB = rateLimit(createMockRequest(ip), { limit, windowMs: 60000, prefix: `${testPrefix}-b` })
    expect(resultB).toBeNull()
  })
})
