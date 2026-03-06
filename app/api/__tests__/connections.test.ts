import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing routes
vi.mock('@/lib/db', () => ({
  default: {
    userConnection: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
    user: { findUnique: vi.fn(), findMany: vi.fn() },
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

import { GET as getConnections, POST as postConnection } from '../connections/route'
import { GET as getSuggestions } from '../connections/suggestions/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createGetRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'GET' })
}

function createPostRequest(url: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost:3000${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('GET /api/connections', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getConnections(createGetRequest('/api/connections'))

    expect(res.status).toBe(401)
  })

  it('returns 200 with connections', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.userConnection.findMany).mockResolvedValue([
      {
        id: 'conn-1', status: 'accepted', createdAt: new Date(), updatedAt: new Date(),
        sender: { id: 'user-1', firstName: 'John', lastName: 'Doe', profileImage: null, userType: 'PATIENT' },
        receiver: { id: 'user-2', firstName: 'Dr', lastName: 'Smith', profileImage: null, userType: 'DOCTOR' },
      },
    ] as never)

    const res = await getConnections(createGetRequest('/api/connections'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
  })
})

describe('POST /api/connections', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await postConnection(
      createPostRequest('/api/connections', { receiverId: 'user-2' })
    )

    expect(res.status).toBe(401)
  })

  it('returns 400 when connecting with self', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })

    const res = await postConnection(
      createPostRequest('/api/connections', { receiverId: 'user-1' })
    )
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.message).toContain('yourself')
  })

  it('returns 400 when receiverId is missing', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })

    const res = await postConnection(
      createPostRequest('/api/connections', {})
    )
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.message).toContain('receiverId')
  })

  it('returns 404 when receiver not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const res = await postConnection(
      createPostRequest('/api/connections', { receiverId: 'nonexistent' })
    )

    expect(res.status).toBe(404)
  })

  it('returns 409 when connection already exists', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-2' } as never)
    vi.mocked(prisma.userConnection.findFirst).mockResolvedValue({
      id: 'conn-existing', status: 'pending',
    } as never)

    const res = await postConnection(
      createPostRequest('/api/connections', { receiverId: 'user-2' })
    )
    const data = await res.json()

    expect(res.status).toBe(409)
    expect(data.message).toContain('already exists')
  })

  it('returns 201 for new connection request', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-2' } as never)
    vi.mocked(prisma.userConnection.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.userConnection.create).mockResolvedValue({
      id: 'conn-new', status: 'pending', createdAt: new Date(), updatedAt: new Date(),
      sender: { id: 'user-1', firstName: 'John', lastName: 'Doe', profileImage: null, userType: 'PATIENT' },
      receiver: { id: 'user-2', firstName: 'Dr', lastName: 'Smith', profileImage: null, userType: 'DOCTOR' },
    } as never)

    const res = await postConnection(
      createPostRequest('/api/connections', { receiverId: 'user-2' })
    )
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data.status).toBe('pending')
  })
})

describe('GET /api/connections/suggestions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getSuggestions(createGetRequest('/api/connections/suggestions'))

    expect(res.status).toBe(401)
  })

  it('returns 200 with suggestions', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.userConnection.findMany).mockResolvedValue([] as never)
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      {
        id: 'user-3', firstName: 'Alice', lastName: 'Brown', profileImage: null, userType: 'DOCTOR',
        doctorProfile: { specialty: ['Cardiology'] }, nurseProfile: null,
      },
    ] as never)

    const res = await getSuggestions(createGetRequest('/api/connections/suggestions'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].connectionStatus).toBe('none')
  })
})
