import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing routes
vi.mock('@/lib/db', () => ({
  default: {
    region: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
  rateLimitAuth: vi.fn(() => null),
}))

vi.mock('@/lib/validations/api', () => ({
  createRegionSchema: {
    safeParse: vi.fn((data: unknown) => ({ success: true, data })),
  },
  updateRegionSchema: {
    safeParse: vi.fn((data: unknown) => ({ success: true, data })),
  },
}))

import { GET as getPublicRegions } from '../regions/route'
import { GET as getAdminRegions, POST as createRegion } from '../admin/regions/route'
import { GET as getRegionById, PUT as updateRegion, DELETE as deleteRegion } from '../admin/regions/[id]/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { createRegionSchema, updateRegionSchema } from '@/lib/validations/api'
import { NextRequest } from 'next/server'

const SUPER_ADMIN_EMAIL = 'admin@mediwyz.com'

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

function createPutRequest(url: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost:3000${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function createDeleteRequest(url: string) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'DELETE' })
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/regions (public)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns active regions', async () => {
    const mockRegions = [
      { id: 'reg-1', name: 'Mauritius', countryCode: 'MU', language: 'en', flag: '🇲🇺' },
      { id: 'reg-2', name: 'Madagascar', countryCode: 'MG', language: 'fr', flag: '🇲🇬' },
    ]
    vi.mocked(prisma.region.findMany).mockResolvedValue(mockRegions as never)

    const res = await getPublicRegions(createGetRequest('/api/regions'))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(2)
    expect(json.data[0].name).toBe('Mauritius')
  })

  it('queries only active regions ordered by name', async () => {
    vi.mocked(prisma.region.findMany).mockResolvedValue([])

    await getPublicRegions(createGetRequest('/api/regions'))

    expect(prisma.region.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        countryCode: true,
        language: true,
        flag: true,
      },
      orderBy: { name: 'asc' },
    })
  })

  it('returns 500 on database error', async () => {
    vi.mocked(prisma.region.findMany).mockRejectedValue(new Error('DB error'))

    const res = await getPublicRegions(createGetRequest('/api/regions'))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
    expect(json.message).toBe('Internal server error')
  })
})

describe('GET /api/admin/regions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.SUPER_ADMIN_EMAIL = SUPER_ADMIN_EMAIL
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getAdminRegions(createGetRequest('/api/admin/regions'))
    const json = await res.json()

    expect(res.status).toBe(401)
    expect(json.message).toBe('Unauthorized')
  })

  it('returns 403 for non-super-admin users', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'doctor', email: 'doc@test.com' } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: 'doc@test.com' } as never)

    const res = await getAdminRegions(createGetRequest('/api/admin/regions'))
    const json = await res.json()

    expect(res.status).toBe(403)
    expect(json.message).toBe('Forbidden')
  })

  it('returns all regions for super admin', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)

    const mockRegions = [
      { id: 'reg-1', name: 'Mauritius', countryCode: 'MU', language: 'en', flag: '🇲🇺', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'reg-2', name: 'Inactive Region', countryCode: 'XX', language: 'en', flag: '', isActive: false, createdAt: new Date(), updatedAt: new Date() },
    ]
    vi.mocked(prisma.region.findMany).mockResolvedValue(mockRegions as never)

    const res = await getAdminRegions(createGetRequest('/api/admin/regions'))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(2)
  })
})

describe('POST /api/admin/regions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.SUPER_ADMIN_EMAIL = SUPER_ADMIN_EMAIL
    // Reset safeParse to default success behavior
    vi.mocked(createRegionSchema.safeParse).mockImplementation((data: unknown) => ({ success: true, data }) as never)
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await createRegion(createPostRequest('/api/admin/regions', { name: 'Kenya' }))
    const json = await res.json()

    expect(res.status).toBe(401)
    expect(json.message).toBe('Unauthorized')
  })

  it('returns 403 for non-super-admin users', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'pat@test.com' } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: 'pat@test.com' } as never)

    const res = await createRegion(createPostRequest('/api/admin/regions', { name: 'Kenya' }))
    const json = await res.json()

    expect(res.status).toBe(403)
    expect(json.message).toBe('Forbidden')
  })

  it('returns 400 when validation fails', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(createRegionSchema.safeParse).mockReturnValue({
      success: false,
      error: { issues: [{ message: 'Name is required' }] },
    } as never)

    const res = await createRegion(createPostRequest('/api/admin/regions', {}))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.message).toBe('Name is required')
  })

  it('creates region and returns 201', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)

    const regionData = { name: 'Kenya', countryCode: 'KE', language: 'en', flag: '🇰🇪' }
    const createdRegion = { id: 'reg-3', ...regionData, isActive: true, createdAt: new Date(), updatedAt: new Date() }
    vi.mocked(prisma.region.create).mockResolvedValue(createdRegion as never)

    const res = await createRegion(createPostRequest('/api/admin/regions', regionData))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('Kenya')
    expect(json.data.countryCode).toBe('KE')
  })

  it('returns 409 on duplicate region', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.region.create).mockRejectedValue(new Error('Unique constraint failed'))

    const res = await createRegion(createPostRequest('/api/admin/regions', { name: 'Mauritius', countryCode: 'MU' }))
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.message).toContain('already exists')
  })
})

describe('PUT /api/admin/regions/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.SUPER_ADMIN_EMAIL = SUPER_ADMIN_EMAIL
    // Reset safeParse to default success behavior
    vi.mocked(updateRegionSchema.safeParse).mockImplementation((data: unknown) => ({ success: true, data }) as never)
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const res = await updateRegion(createPutRequest('/api/admin/regions/reg-1', { name: 'Updated' }), mockParams('reg-1'))
    const json = await res.json()

    expect(res.status).toBe(401)
    expect(json.message).toBe('Unauthorized')
  })

  it('returns 404 when region does not exist', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.region.findUnique).mockResolvedValue(null)

    const res = await updateRegion(createPutRequest('/api/admin/regions/nonexistent', { name: 'Updated' }), mockParams('nonexistent'))
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.message).toBe('Region not found')
  })

  it('updates region and returns 200', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.region.findUnique).mockResolvedValue({ id: 'reg-1' } as never)

    const updated = { id: 'reg-1', name: 'Updated Mauritius', countryCode: 'MU', language: 'en', flag: '🇲🇺', isActive: true, createdAt: new Date(), updatedAt: new Date() }
    vi.mocked(prisma.region.update).mockResolvedValue(updated as never)

    const res = await updateRegion(createPutRequest('/api/admin/regions/reg-1', { name: 'Updated Mauritius' }), mockParams('reg-1'))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('Updated Mauritius')
  })

  it('returns 400 when validation fails', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(updateRegionSchema.safeParse).mockReturnValue({
      success: false,
      error: { issues: [{ message: 'Invalid country code' }] },
    } as never)

    const res = await updateRegion(createPutRequest('/api/admin/regions/reg-1', { countryCode: '' }), mockParams('reg-1'))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.message).toBe('Invalid country code')
  })

  it('returns 409 on duplicate constraint violation', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.region.findUnique).mockResolvedValue({ id: 'reg-1' } as never)
    vi.mocked(prisma.region.update).mockRejectedValue(new Error('Unique constraint failed'))
    // Ensure safeParse returns success for this test
    vi.mocked(updateRegionSchema.safeParse).mockReturnValue({ success: true, data: { countryCode: 'MG' } } as never)

    const res = await updateRegion(createPutRequest('/api/admin/regions/reg-1', { countryCode: 'MG' }), mockParams('reg-1'))
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.message).toContain('already exists')
  })
})

describe('DELETE /api/admin/regions/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.SUPER_ADMIN_EMAIL = SUPER_ADMIN_EMAIL
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const res = await deleteRegion(createDeleteRequest('/api/admin/regions/reg-1'), mockParams('reg-1'))
    const json = await res.json()

    expect(res.status).toBe(401)
    expect(json.message).toBe('Unauthorized')
  })

  it('returns 404 when region does not exist', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.region.findUnique).mockResolvedValue(null)

    const res = await deleteRegion(createDeleteRequest('/api/admin/regions/nonexistent'), mockParams('nonexistent'))
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.message).toBe('Region not found')
  })

  it('returns 409 when region has assigned users', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.region.findUnique).mockResolvedValue({
      id: 'reg-1',
      name: 'Mauritius',
      _count: { users: 5 },
    } as never)

    const res = await deleteRegion(createDeleteRequest('/api/admin/regions/reg-1'), mockParams('reg-1'))
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.message).toContain('Cannot delete region')
    expect(json.message).toContain('5 assigned user(s)')
  })

  it('deletes region with no users and returns 200', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin-1', userType: 'admin', email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ email: SUPER_ADMIN_EMAIL } as never)
    vi.mocked(prisma.region.findUnique).mockResolvedValue({
      id: 'reg-1',
      name: 'Empty Region',
      _count: { users: 0 },
    } as never)
    vi.mocked(prisma.region.delete).mockResolvedValue({} as never)

    const res = await deleteRegion(createDeleteRequest('/api/admin/regions/reg-1'), mockParams('reg-1'))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('reg-1')
  })
})
