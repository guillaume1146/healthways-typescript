import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'

/**
 * GET /api/admin/security
 * Returns security-related metrics: suspended accounts, recent account activity.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [suspendedAccounts, pendingAccounts, recentUsers, totalUsers] = await Promise.all([
      prisma.user.count({ where: { accountStatus: 'suspended' } }),
      prisma.user.count({ where: { accountStatus: 'pending' } }),
      prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          userType: true,
          accountStatus: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.user.count(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        suspendedAccounts,
        pendingAccounts,
        totalUsers,
        recentRegistrations: recentUsers,
        securityEvents: [
          { type: 'info', message: `${suspendedAccounts} suspended account(s)`, timestamp: new Date().toISOString() },
          { type: 'info', message: `${pendingAccounts} pending verification(s)`, timestamp: new Date().toISOString() },
          { type: 'info', message: `${recentUsers.length} new registrations in the last 30 days`, timestamp: new Date().toISOString() },
        ],
      },
    })
  } catch (error) {
    console.error('GET /api/admin/security error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
