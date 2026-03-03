import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the Prisma client before importing the route
vi.mock('@/lib/db', () => ({
  default: {
    user: {
      findMany: vi.fn().mockResolvedValue([
        { id: '550e8400-e29b-41d4-a716-446655440099' },
      ]),
    },
    notification: {
      createMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
  },
}))

// Mock rate limiter to always allow requests in tests
vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn().mockReturnValue(null),
}))

import { POST } from '@/app/api/contact/route'

function createContactRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success for a valid contact form submission', async () => {
    const request = createContactRequest({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'I would like to learn more about your services.',
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.message).toContain('sent successfully')
  })

  it('returns 400 for missing required fields', async () => {
    const request = createContactRequest({
      name: 'Alice',
      // missing email and message
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.success).toBe(false)
    expect(body.message).toBeDefined()
  })

  it('returns 400 for invalid email', async () => {
    const request = createContactRequest({
      name: 'Alice',
      email: 'not-a-valid-email',
      message: 'Hello there',
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.success).toBe(false)
    expect(body.message).toBeDefined()
  })

  it('returns 400 for empty name', async () => {
    const request = createContactRequest({
      name: '',
      email: 'alice@example.com',
      message: 'Hello there',
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.success).toBe(false)
    expect(body.message).toBe('Name is required')
  })

  it('returns 400 for empty message', async () => {
    const request = createContactRequest({
      name: 'Alice',
      email: 'alice@example.com',
      message: '',
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.success).toBe(false)
    expect(body.message).toBe('Message is required')
  })

  it('handles the case when no admins exist', async () => {
    const { default: prisma } = await import('@/lib/db')
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([])

    const request = createContactRequest({
      name: 'Bob',
      email: 'bob@example.com',
      message: 'Testing with no admins',
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    // createMany should not be called since there are no admins
    expect(prisma.notification.createMany).not.toHaveBeenCalled()
  })
})
