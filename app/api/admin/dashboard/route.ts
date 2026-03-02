import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'

export async function GET(request: NextRequest) {
  try {
    const auth = validateRequest(request)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }
    if (auth.userType !== 'super-admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // ── Top-level stats (parallel) ────────────────────────────────────────────
    const [totalUsers, pendingValidations, monthlyRevenueAgg, activeSessions] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { accountStatus: 'pending' } }),
        prisma.walletTransaction.aggregate({
          where: {
            type: 'debit',
            status: 'completed',
            createdAt: { gte: firstOfMonth },
          },
          _sum: { amount: true },
        }),
        prisma.videoCallSession.count({ where: { status: 'active' } }),
      ])

    const monthlyRevenue = monthlyRevenueAgg._sum.amount ?? 0

    // ── Category stats (parallel) ─────────────────────────────────────────────
    const categories = [
      { category: 'Doctors', userType: 'DOCTOR' as const },
      { category: 'Nurses', userType: 'NURSE' as const },
      { category: 'Nannies', userType: 'NANNY' as const },
      { category: 'Emergency Workers', userType: 'EMERGENCY_WORKER' as const },
      { category: 'Pharmacists', userType: 'PHARMACIST' as const },
      { category: 'Lab Technicians', userType: 'LAB_TECHNICIAN' as const },
    ]

    const categoryStats = await Promise.all(
      categories.map(async ({ category, userType }) => {
        const [count, active, pending] = await Promise.all([
          prisma.user.count({ where: { userType } }),
          prisma.user.count({ where: { userType, accountStatus: 'active' } }),
          prisma.user.count({ where: { userType, accountStatus: 'pending' } }),
        ])
        return { category, count, active, pending }
      })
    )

    // ── Recent activity ───────────────────────────────────────────────────────
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        firstName: true,
        lastName: true,
        userType: true,
        createdAt: true,
      },
    })

    const recentActivity = recentUsers.map((user) => ({
      type: 'registration',
      message: `${user.firstName} ${user.lastName} registered as ${user.userType.toLowerCase().replace('_', ' ')}`,
      time: user.createdAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          pendingValidations,
          monthlyRevenue,
          activeSessions,
        },
        categoryStats,
        recentActivity,
      },
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
