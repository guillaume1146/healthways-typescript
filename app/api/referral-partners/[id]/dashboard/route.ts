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
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (auth.sub !== id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  try {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

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
        select: { amount: true, description: true, createdAt: true, status: true },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    if (!referralProfile) {
      return NextResponse.json({ message: 'Referral partner profile not found' }, { status: 404 })
    }

    // Fetch users referred by this partner's code
    const [referrals, thisMonthReferralCount] = await Promise.all([
      prisma.user.findMany({
        where: { referredByCode: referralProfile.referralCode },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          userType: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({
        where: {
          referredByCode: referralProfile.referralCode,
          createdAt: { gte: startOfMonth },
        },
      }),
    ])

    const recentConversions = referrals.slice(0, 10)

    const totalEarnings = creditTransactions.reduce((sum, t) => sum + t.amount, 0)
    const thisMonthEarnings = creditTransactions
      .filter(t => t.createdAt >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0)
    const pendingPayouts = creditTransactions
      .filter(t => t.status === 'pending')
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
          thisMonthReferrals: thisMonthReferralCount,
          pendingPayouts,
          walletBalance: wallet?.balance ?? 0,
        },
        referrals,
        clients: referrals.map(r => ({
          id: r.id,
          name: `${r.firstName} ${r.lastName}`,
          email: r.email,
          userType: r.userType,
          joinedAt: r.createdAt,
        })),
        leadsBySource: {
          direct: referralProfile.totalReferrals,
          social: 0,
          email: 0,
          other: 0,
        },
        recentConversions,
        recentTransactions: creditTransactions.slice(0, 10),
      },
    })
  } catch (error) {
    console.error('Referral partner dashboard error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
