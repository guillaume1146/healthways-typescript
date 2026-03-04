import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'
import { z } from 'zod'

const creditSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1).max(500),
  serviceType: z.string().min(1).max(50),
  referenceId: z.string().optional(),
})

/**
 * POST /api/users/[id]/wallet/credit
 * System-initiated wallet credit (referral commissions, pharmacist sales, etc.).
 * Only the user themselves or an admin can credit a wallet.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Only the wallet owner or a super admin can credit
  const isAdmin = auth.userType === 'REGIONAL_ADMIN'
  if (auth.sub !== id && !isAdmin) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = creditSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { amount, description, serviceType, referenceId } = parsed.data

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.userWallet.findUnique({
        where: { userId: id },
        select: { id: true, balance: true },
      })

      if (!wallet) {
        throw new Error('WALLET_NOT_FOUND')
      }

      const newBalance = wallet.balance + amount

      await tx.userWallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      })

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'credit',
          amount,
          description,
          serviceType,
          referenceId: referenceId ?? null,
          balanceBefore: wallet.balance,
          balanceAfter: newBalance,
          status: 'completed',
        },
      })

      return { newBalance }
    })

    return NextResponse.json({ success: true, newBalance: result.newBalance })
  } catch (error) {
    if (error instanceof Error && error.message === 'WALLET_NOT_FOUND') {
      return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 })
    }
    console.error('POST /api/users/[id]/wallet/credit error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
