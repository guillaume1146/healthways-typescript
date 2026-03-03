import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitAuth } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  try {
    const auth = await validateRequest(request)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // Generate real alerts from database state
    const alerts: { type: string; message: string; time: string }[] = []

    // Check for pending users
    const pendingUsers = await prisma.user.count({ where: { accountStatus: 'pending' } })
    if (pendingUsers > 0) {
      alerts.push({
        type: 'info',
        message: `${pendingUsers} user account${pendingUsers > 1 ? 's' : ''} pending approval`,
        time: 'Current',
      })
    }

    // Check for unread admin notifications
    const unreadNotifications = await prisma.notification.count({
      where: {
        readAt: null,
        user: { userType: 'REGIONAL_ADMIN' },
      },
    })
    if (unreadNotifications > 0) {
      alerts.push({
        type: 'warning',
        message: `${unreadNotifications} unread admin notification${unreadNotifications > 1 ? 's' : ''}`,
        time: 'Current',
      })
    }

    // Check for suspended users
    const suspendedUsers = await prisma.user.count({ where: { accountStatus: 'suspended' } })
    if (suspendedUsers > 0) {
      alerts.push({
        type: 'warning',
        message: `${suspendedUsers} user account${suspendedUsers > 1 ? 's' : ''} currently suspended`,
        time: 'Current',
      })
    }

    // Check for recent appointments in the last 24 hours
    const recentAppointments = await prisma.appointment.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    })
    if (recentAppointments > 10) {
      alerts.push({
        type: 'info',
        message: `${recentAppointments} appointments booked in the last 24 hours`,
        time: 'Last 24h',
      })
    }

    return NextResponse.json({ success: true, data: alerts })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch alerts' }, { status: 500 })
  }
}
