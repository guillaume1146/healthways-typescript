import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  default: {
    roleFeatureConfig: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    requiredDocumentConfig: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

import { GET as getRoleConfig, PUT as putRoleConfig } from '../admin/role-config/route'
import { GET as getRequiredDocs, PUT as putRequiredDocs } from '../admin/required-documents/route'
import { GET as getPublicRoleConfig } from '../role-config/[userType]/route'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { NextRequest } from 'next/server'

function createRequest(url: string, options?: RequestInit) {
  return new NextRequest(url, options as any)
}

describe('GET /api/admin/role-config', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns configs grouped by userType', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin1', userType: 'admin' } as any)
    vi.mocked(prisma.roleFeatureConfig.findMany).mockResolvedValue([
      { id: '1', userType: 'DOCTOR', featureKey: 'video', enabled: true, createdAt: new Date(), updatedAt: new Date() },
      { id: '2', userType: 'DOCTOR', featureKey: 'billing', enabled: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '3', userType: 'NURSE', featureKey: 'video', enabled: true, createdAt: new Date(), updatedAt: new Date() },
    ] as any)

    const req = createRequest('http://localhost:3000/api/admin/role-config')
    const res = await getRoleConfig(req)
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.DOCTOR.video).toBe(true)
    expect(json.data.DOCTOR.billing).toBe(false)
    expect(json.data.NURSE.video).toBe(true)
  })
})

describe('PUT /api/admin/role-config', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const req = createRequest('http://localhost:3000/api/admin/role-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configs: [] }),
    })
    const res = await putRoleConfig(req)
    expect(res.status).toBe(401)
  })

  it('upserts configs via transaction', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin1' } as any)
    vi.mocked(prisma.$transaction).mockResolvedValue([
      { id: '1', userType: 'DOCTOR', featureKey: 'video', enabled: false },
    ] as any)

    const req = createRequest('http://localhost:3000/api/admin/role-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        configs: [{ userType: 'DOCTOR', featureKey: 'video', enabled: false }],
      }),
    })
    const res = await putRoleConfig(req)
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(prisma.$transaction).toHaveBeenCalled()
  })

  it('returns 400 for non-array configs', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin1' } as any)

    const req = createRequest('http://localhost:3000/api/admin/role-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configs: 'not-an-array' }),
    })
    const res = await putRoleConfig(req)
    expect(res.status).toBe(400)
  })
})

describe('GET /api/admin/required-documents', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns docs grouped by userType', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'admin1', userType: 'admin' } as any)
    vi.mocked(prisma.requiredDocumentConfig.findMany).mockResolvedValue([
      { id: '1', userType: 'DOCTOR', documentName: 'Medical License', required: true, createdAt: new Date(), updatedAt: new Date() },
      { id: '2', userType: 'DOCTOR', documentName: 'ID Card', required: false, createdAt: new Date(), updatedAt: new Date() },
    ] as any)

    const req = createRequest('http://localhost:3000/api/admin/required-documents')
    const res = await getRequiredDocs(req)
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.DOCTOR).toHaveLength(2)
    expect(json.data.DOCTOR[0].documentName).toBe('Medical License')
  })
})

describe('PUT /api/admin/required-documents', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const req = createRequest('http://localhost:3000/api/admin/required-documents', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configs: [] }),
    })
    const res = await putRequiredDocs(req)
    expect(res.status).toBe(401)
  })
})

describe('GET /api/role-config/[userType]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns features for a user type', async () => {
    vi.mocked(prisma.roleFeatureConfig.findMany).mockResolvedValue([
      { featureKey: 'video', enabled: true },
      { featureKey: 'billing', enabled: false },
    ] as any)

    const req = createRequest('http://localhost:3000/api/role-config/doctor')
    const res = await getPublicRoleConfig(req, { params: Promise.resolve({ userType: 'doctor' }) })
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.features.video).toBe(true)
    expect(json.data.features.billing).toBe(false)
    expect(json.data.allEnabled).toBe(false)
  })

  it('returns allEnabled=true when no config exists', async () => {
    vi.mocked(prisma.roleFeatureConfig.findMany).mockResolvedValue([])

    const req = createRequest('http://localhost:3000/api/role-config/patient')
    const res = await getPublicRoleConfig(req, { params: Promise.resolve({ userType: 'patient' }) })
    const json = await res.json()

    expect(json.success).toBe(true)
    expect(json.data.allEnabled).toBe(true)
  })
})
