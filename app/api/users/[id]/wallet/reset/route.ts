import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
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
    const wallet = await prisma.userWallet.findUnique({
      where: { userId: id },
      select: { id: true, balance: true, initialCredit: true },
    })

    if (!wallet) {
      return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 })
    }

    const resetAmount = wallet.initialCredit

    // Reset balance and create a transaction record
    const [updatedWallet] = await prisma.$transaction([
      prisma.userWallet.update({
        where: { userId: id },
        data: { balance: resetAmount },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'CREDIT',
          amount: resetAmount - wallet.balance,
          description: 'Trial balance reset',
          serviceType: 'TRIAL_RESET',
          balanceBefore: wallet.balance,
          balanceAfter: resetAmount,
          status: 'COMPLETED',
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        balance: updatedWallet.balance,
        initialCredit: updatedWallet.initialCredit,
      },
    })
  } catch (error) {
    console.error('POST /api/users/[id]/wallet/reset error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
