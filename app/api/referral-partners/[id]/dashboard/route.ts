import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (auth.sub !== id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  try {
    const [referralProfile, wallet, creditTransactions] = await Promise.all([
      prisma.referralPartnerProfile.findUnique({
        where: { userId: id },
        select: {
          id: true,
          referralCode: true,
          commissionRate: true,
          totalReferrals: true,
          businessType: true,
        },
      }),
      prisma.userWallet.findUnique({
        where: { userId: id },
        select: { balance: true },
      }),
      prisma.walletTransaction.findMany({
        where: { wallet: { userId: id }, type: 'credit' },
        select: { amount: true, createdAt: true },
      }),
    ])

    if (!referralProfile) {
      return NextResponse.json({ message: 'Referral partner profile not found' }, { status: 404 })
    }

    const totalEarnings = creditTransactions.reduce((sum, t) => sum + t.amount, 0)

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    const thisMonthEarnings = creditTransactions
      .filter(t => t.createdAt >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0)

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          referralCode: referralProfile.referralCode,
          commissionRate: referralProfile.commissionRate,
          totalReferrals: referralProfile.totalReferrals,
          businessType: referralProfile.businessType,
          totalEarnings,
          thisMonthEarnings,
          walletBalance: wallet?.balance ?? 0,
        },
      },
    })
  } catch (error) {
    console.error('Referral partner dashboard error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
