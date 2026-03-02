import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { walletDebitSchema } from '@/lib/validations/api'
import { rateLimitPublic } from '@/lib/rate-limit'

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

  if (auth.sub !== id) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = walletDebitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }
    const { amount, description, serviceType, referenceId } = parsed.data

    // Atomic debit within a transaction
    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.userWallet.findUnique({
        where: { userId: id },
        select: { id: true, balance: true },
      })

      if (!wallet) {
        throw new Error('WALLET_NOT_FOUND')
      }

      if (wallet.balance < amount) {
        throw new Error('INSUFFICIENT_BALANCE')
      }

      const balanceBefore = wallet.balance
      const balanceAfter = balanceBefore - amount

      const updatedWallet = await tx.userWallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
        select: { balance: true },
      })

      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'debit',
          amount,
          description: description.trim(),
          serviceType: serviceType.trim(),
          referenceId: referenceId || null,
          balanceBefore,
          balanceAfter,
          status: 'completed',
        },
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          serviceType: true,
          referenceId: true,
          balanceBefore: true,
          balanceAfter: true,
          status: true,
          createdAt: true,
        },
      })

      return { newBalance: updatedWallet.balance, transaction }
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'WALLET_NOT_FOUND') {
        return NextResponse.json(
          { success: false, message: 'Wallet not found' },
          { status: 404 }
        )
      }
      if (error.message === 'INSUFFICIENT_BALANCE') {
        return NextResponse.json(
          { success: false, message: 'Insufficient wallet balance' },
          { status: 400 }
        )
      }
    }

    console.error('POST /api/users/[id]/wallet/debit error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
