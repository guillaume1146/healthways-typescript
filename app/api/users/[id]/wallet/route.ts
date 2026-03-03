import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(
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
      select: {
        id: true,
        balance: true,
        currency: true,
        initialCredit: true,
        createdAt: true,
        updatedAt: true,
        transactions: {
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
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!wallet) {
      return NextResponse.json({ success: true, data: null })
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        initialCredit: wallet.initialCredit,
        transactions: wallet.transactions,
      },
    })
  } catch (error) {
    console.error('GET /api/users/[id]/wallet error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
