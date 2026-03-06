import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing routes
vi.mock('@/lib/db', () => ({
  default: {
    userWallet: { findUnique: vi.fn(), update: vi.fn() },
    walletTransaction: { create: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/auth/validate', () => ({
  validateRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimitPublic: vi.fn(() => null),
}))

vi.mock('@/lib/validations/api', () => ({
  walletDebitSchema: {
    safeParse: vi.fn((data: unknown) => ({ success: true, data })),
  },
}))

import { GET as getWallet } from '../users/[id]/wallet/route'
import { POST as debitWallet } from '../users/[id]/wallet/debit/route'
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

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/users/[id]/wallet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await getWallet(
      createGetRequest('/api/users/user-1/wallet'),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 403 when auth.sub does not match id', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'patient', email: 'a@b.com' })

    const res = await getWallet(
      createGetRequest('/api/users/user-1/wallet'),
      mockParams('user-1')
    )

    expect(res.status).toBe(403)
  })

  it('returns 200 with wallet data', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.userWallet.findUnique).mockResolvedValue({
      id: 'wallet-1', balance: 4500, currency: 'MUR', initialCredit: 4500,
      createdAt: new Date(), updatedAt: new Date(),
      transactions: [
        { id: 'tx-1', type: 'credit', amount: 4500, description: 'Initial credit', serviceType: 'signup', referenceId: null, balanceBefore: 0, balanceAfter: 4500, status: 'completed', createdAt: new Date() },
      ],
    } as never)

    const res = await getWallet(
      createGetRequest('/api/users/user-1/wallet'),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.balance).toBe(4500)
    expect(data.data.currency).toBe('MUR')
  })

  it('returns 200 with null data when wallet does not exist', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.userWallet.findUnique).mockResolvedValue(null)

    const res = await getWallet(
      createGetRequest('/api/users/user-1/wallet'),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toBeNull()
  })
})

describe('POST /api/users/[id]/wallet/debit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 without auth', async () => {
    vi.mocked(validateRequest).mockReturnValue(null)

    const res = await debitWallet(
      createPostRequest('/api/users/user-1/wallet/debit', { amount: 100, description: 'Test', serviceType: 'doctor' }),
      mockParams('user-1')
    )

    expect(res.status).toBe(401)
  })

  it('returns 403 when auth.sub does not match id', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'other-user', userType: 'patient', email: 'a@b.com' })

    const res = await debitWallet(
      createPostRequest('/api/users/user-1/wallet/debit', { amount: 100, description: 'Test', serviceType: 'doctor' }),
      mockParams('user-1')
    )

    expect(res.status).toBe(403)
  })

  it('returns 200 for successful debit', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.$transaction).mockResolvedValue({
      newBalance: 4400,
      transaction: {
        id: 'tx-1', type: 'debit', amount: 100, description: 'Doctor consultation', serviceType: 'doctor',
        referenceId: null, balanceBefore: 4500, balanceAfter: 4400, status: 'completed', createdAt: new Date(),
      },
    } as never)

    const res = await debitWallet(
      createPostRequest('/api/users/user-1/wallet/debit', { amount: 100, description: 'Doctor consultation', serviceType: 'doctor' }),
      mockParams('user-1')
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.newBalance).toBe(4400)
  })

  it('returns 404 when wallet not found', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.$transaction).mockRejectedValue(new Error('WALLET_NOT_FOUND'))

    const res = await debitWallet(
      createPostRequest('/api/users/user-1/wallet/debit', { amount: 100, description: 'Test', serviceType: 'doctor' }),
      mockParams('user-1')
    )

    expect(res.status).toBe(404)
  })

  it('returns 400 for insufficient balance', async () => {
    vi.mocked(validateRequest).mockReturnValue({ sub: 'user-1', userType: 'patient', email: 'p@example.com' })
    vi.mocked(prisma.$transaction).mockRejectedValue(new Error('INSUFFICIENT_BALANCE'))

    const res = await debitWallet(
      createPostRequest('/api/users/user-1/wallet/debit', { amount: 99999, description: 'Test', serviceType: 'doctor' }),
      mockParams('user-1')
    )

    expect(res.status).toBe(400)
  })
})
