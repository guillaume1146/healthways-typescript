import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitAuth } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  // Verify user is super admin or regional admin
  const user = await prisma.user.findUnique({
    where: { id: auth.sub },
    select: { userType: true, email: true },
  })

  const isSuperAdmin = user?.email === process.env.SUPER_ADMIN_EMAIL
  const isRegionalAdmin = user?.userType === 'REGIONAL_ADMIN'

  if (!isSuperAdmin && !isRegionalAdmin) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    // Get all transactions with commission data
    const whereClause = isRegionalAdmin
      ? { regionalAdminId: auth.sub, platformCommission: { not: null } }
      : { platformCommission: { not: null } }

    const transactions = await prisma.walletTransaction.findMany({
      where: {
        ...whereClause,
        type: 'debit', // Only count from patient debits to avoid double-counting
      },
      select: {
        id: true,
        amount: true,
        description: true,
        serviceType: true,
        platformCommission: true,
        regionalCommission: true,
        providerAmount: true,
        regionalAdminId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    const totalPlatformCommission = transactions.reduce(
      (sum, t) => sum + (t.platformCommission ?? 0), 0
    )
    const totalRegionalCommission = transactions.reduce(
      (sum, t) => sum + (t.regionalCommission ?? 0), 0
    )
    const totalTransactionVolume = transactions.reduce(
      (sum, t) => sum + t.amount, 0
    )

    // Get regional admin commission totals
    const regionalAdmins = isSuperAdmin
      ? await prisma.regionalAdminProfile.findMany({
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        })
      : []

    return NextResponse.json({
      success: true,
      data: {
        totalPlatformCommission: Math.round(totalPlatformCommission * 100) / 100,
        totalRegionalCommission: Math.round(totalRegionalCommission * 100) / 100,
        totalTransactionVolume: Math.round(totalTransactionVolume * 100) / 100,
        transactionCount: transactions.length,
        recentTransactions: transactions.slice(0, 20),
        regionalAdmins: regionalAdmins.map((ra) => ({
          id: ra.id,
          name: `${ra.user.firstName} ${ra.user.lastName}`,
          email: ra.user.email,
          region: ra.region,
          country: ra.country,
          commissionRate: ra.commissionRate,
          totalCommission: ra.totalCommission,
        })),
      },
    })
  } catch (error) {
    console.error('GET /api/admin/platform-commission error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
