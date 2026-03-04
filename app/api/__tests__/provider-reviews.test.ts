import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
vi.mock('@/lib/db', () => ({
  default: {
    providerReview: {
      findMany: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn(() => null),
}))

import { GET, POST } from '../providers/[id]/reviews/route'
import { PATCH } from '../providers/[id]/reviews/[reviewId]/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createRequest(url: string, options?: RequestInit) {
  return new NextRequest(url, options as any)
}

describe('GET /api/providers/[id]/reviews', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns paginated reviews with average rating', async () => {
    const mockReviews = [
      {
        id: 'r1',
        reviewerUserId: 'u1',
        reviewerUser: { firstName: 'John', lastName: 'Doe', profileImage: null },
        providerType: 'DOCTOR',
        rating: 5,
        comment: 'Excellent doctor',
        verified: true,
        helpfulCount: 3,
        response: null,
        respondedAt: null,
        createdAt: new Date(),
      },
    ]

    vi.mocked(prisma.providerReview.findMany).mockResolvedValue(mockReviews as any)
    vi.mocked(prisma.providerReview.count).mockResolvedValue(1)
    vi.mocked(prisma.providerReview.aggregate).mockResolvedValue({ _avg: { rating: 5 } } as any)
    vi.mocked(prisma.providerReview.groupBy).mockResolvedValue([{ rating: 5, _count: { rating: 1 } }] as any)

    const req = createRequest('http://localhost:3000/api/providers/user1/reviews')
    const res = await GET(req, { params: Promise.resolve({ id: 'user1' }) })
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.averageRating).toBe(5)
    expect(json.total).toBe(1)
    expect(json.ratingDistribution).toBeDefined()
  })

  it('returns empty results for non-existent provider', async () => {
    vi.mocked(prisma.providerReview.findMany).mockResolvedValue([])
    vi.mocked(prisma.providerReview.count).mockResolvedValue(0)
    vi.mocked(prisma.providerReview.aggregate).mockResolvedValue({ _avg: { rating: null } } as any)
    vi.mocked(prisma.providerReview.groupBy).mockResolvedValue([])

    const req = createRequest('http://localhost:3000/api/providers/nonexist/reviews')
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexist' }) })
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(0)
    expect(json.averageRating).toBe(0)
  })
})

describe('POST /api/providers/[id]/reviews', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const req = createRequest('http://localhost:3000/api/providers/user1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5, comment: 'Great' }),
    })
    const res = await POST(req, { params: Promise.resolve({ id: 'user1' }) })
    expect(res.status).toBe(401)
  })

  it('returns 404 when provider not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'reviewer1' } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const req = createRequest('http://localhost:3000/api/providers/nobody/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5, comment: 'Great' }),
    })
    const res = await POST(req, { params: Promise.resolve({ id: 'nobody' }) })
    expect(res.status).toBe(404)
  })

  it('returns 400 for non-reviewable user type', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'reviewer1' } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'u1', userType: 'PATIENT' } as any)

    const req = createRequest('http://localhost:3000/api/providers/u1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5, comment: 'Great' }),
    })
    const res = await POST(req, { params: Promise.resolve({ id: 'u1' }) })
    expect(res.status).toBe(400)
  })

  it('returns 400 for self-review', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc1' } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'doc1', userType: 'DOCTOR' } as any)

    const req = createRequest('http://localhost:3000/api/providers/doc1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5, comment: 'I am the best' }),
    })
    const res = await POST(req, { params: Promise.resolve({ id: 'doc1' }) })
    expect(res.status).toBe(400)
  })

  it('creates review successfully', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'pat1' } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'doc1', userType: 'DOCTOR' } as any)
    vi.mocked(prisma.providerReview.create).mockResolvedValue({
      id: 'rev1',
      rating: 5,
      comment: 'Great doctor',
      providerType: 'DOCTOR',
      createdAt: new Date(),
    } as any)

    const req = createRequest('http://localhost:3000/api/providers/doc1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5, comment: 'Great doctor' }),
    })
    const res = await POST(req, { params: Promise.resolve({ id: 'doc1' }) })
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.data.rating).toBe(5)
  })

  it('returns 400 for invalid rating', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'pat1' } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'doc1', userType: 'DOCTOR' } as any)

    const req = createRequest('http://localhost:3000/api/providers/doc1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 6, comment: 'Invalid' }),
    })
    const res = await POST(req, { params: Promise.resolve({ id: 'doc1' }) })
    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/providers/[id]/reviews/[reviewId]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const req = createRequest('http://localhost:3000/api/providers/u1/reviews/r1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: 'Thanks!' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'u1', reviewId: 'r1' }) })
    expect(res.status).toBe(401)
  })

  it('returns 404 when review not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc1' } as any)
    vi.mocked(prisma.providerReview.findUnique).mockResolvedValue(null)

    const req = createRequest('http://localhost:3000/api/providers/u1/reviews/r1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: 'Thanks!' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'u1', reviewId: 'r1' }) })
    expect(res.status).toBe(404)
  })

  it('returns 403 when non-owner tries to respond', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other_user' } as any)
    vi.mocked(prisma.providerReview.findUnique).mockResolvedValue({
      id: 'r1',
      providerUserId: 'doc1',
    } as any)

    const req = createRequest('http://localhost:3000/api/providers/doc1/reviews/r1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: 'Thanks!' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'doc1', reviewId: 'r1' }) })
    expect(res.status).toBe(403)
  })

  it('allows provider to respond to review', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'doc1' } as any)
    vi.mocked(prisma.providerReview.findUnique).mockResolvedValue({
      id: 'r1',
      providerUserId: 'doc1',
    } as any)
    vi.mocked(prisma.providerReview.update).mockResolvedValue({
      id: 'r1',
      response: 'Thank you!',
      respondedAt: new Date(),
    } as any)

    const req = createRequest('http://localhost:3000/api/providers/doc1/reviews/r1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: 'Thank you!' }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'doc1', reviewId: 'r1' }) })
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.response).toBe('Thank you!')
  })

  it('allows marking review as helpful', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'anyone' } as any)
    vi.mocked(prisma.providerReview.findUnique).mockResolvedValue({
      id: 'r1',
      providerUserId: 'doc1',
    } as any)
    vi.mocked(prisma.providerReview.update).mockResolvedValue({
      id: 'r1',
      helpfulCount: 4,
    } as any)

    const req = createRequest('http://localhost:3000/api/providers/doc1/reviews/r1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ helpful: true }),
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'doc1', reviewId: 'r1' }) })
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.helpfulCount).toBe(4)
  })
})
