import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  try {
    const auth = validateRequest(request)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }
    if (!['admin', 'regional-admin'].includes(auth.userType)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // ── User counts (parallel) ──────────────────────────────────────────────
    const [
      totalUsers,
      activeUsers,
      patients,
      doctors,
      nurses,
      nannies,
      pharmacists,
      labTechs,
      emergencyWorkers,
      insuranceReps,
      corporateAdmins,
      referralPartners,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { accountStatus: 'active' } }),
      prisma.user.count({ where: { userType: 'PATIENT' } }),
      prisma.user.count({ where: { userType: 'DOCTOR' } }),
      prisma.user.count({ where: { userType: 'NURSE' } }),
      prisma.user.count({ where: { userType: 'NANNY' } }),
      prisma.user.count({ where: { userType: 'PHARMACIST' } }),
      prisma.user.count({ where: { userType: 'LAB_TECHNICIAN' } }),
      prisma.user.count({ where: { userType: 'EMERGENCY_WORKER' } }),
      prisma.user.count({ where: { userType: 'INSURANCE_REP' } }),
      prisma.user.count({ where: { userType: 'CORPORATE_ADMIN' } }),
      prisma.user.count({ where: { userType: 'REFERRAL_PARTNER' } }),
    ])

    // ── Booking counts (parallel across all booking models) ─────────────────
    const [
      appointmentCounts,
      nurseBookingCounts,
      childcareBookingCounts,
      labTestBookingCounts,
      emergencyBookingCounts,
    ] = await Promise.all([
      Promise.all([
        prisma.appointment.count(),
        prisma.appointment.count({ where: { status: 'pending' } }),
        prisma.appointment.count({ where: { status: 'upcoming' } }),
        prisma.appointment.count({ where: { status: 'completed' } }),
        prisma.appointment.count({ where: { status: 'cancelled' } }),
      ]),
      Promise.all([
        prisma.nurseBooking.count(),
        prisma.nurseBooking.count({ where: { status: 'pending' } }),
        prisma.nurseBooking.count({ where: { status: 'upcoming' } }),
        prisma.nurseBooking.count({ where: { status: 'completed' } }),
        prisma.nurseBooking.count({ where: { status: 'cancelled' } }),
      ]),
      Promise.all([
        prisma.childcareBooking.count(),
        prisma.childcareBooking.count({ where: { status: 'pending' } }),
        prisma.childcareBooking.count({ where: { status: 'upcoming' } }),
        prisma.childcareBooking.count({ where: { status: 'completed' } }),
        prisma.childcareBooking.count({ where: { status: 'cancelled' } }),
      ]),
      Promise.all([
        prisma.labTestBooking.count(),
        prisma.labTestBooking.count({ where: { status: 'pending' } }),
        prisma.labTestBooking.count({ where: { status: 'upcoming' } }),
        prisma.labTestBooking.count({ where: { status: 'completed' } }),
        prisma.labTestBooking.count({ where: { status: 'cancelled' } }),
      ]),
      Promise.all([
        prisma.emergencyBooking.count(),
        prisma.emergencyBooking.count({ where: { status: 'pending' } }),
        // Emergency bookings use 'dispatched'/'en_route' instead of 'upcoming'
        prisma.emergencyBooking.count({ where: { status: { in: ['dispatched', 'en_route'] } } }),
        prisma.emergencyBooking.count({ where: { status: 'resolved' } }),
        prisma.emergencyBooking.count({ where: { status: 'cancelled' } }),
      ]),
    ])

    const sumCounts = (...arrays: number[][]) =>
      arrays[0].map((_, i) => arrays.reduce((sum, arr) => sum + arr[i], 0))

    const [totalBookings, pendingBookings, upcomingBookings, completedBookings, cancelledBookings] =
      sumCounts(
        appointmentCounts,
        nurseBookingCounts,
        childcareBookingCounts,
        labTestBookingCounts,
        emergencyBookingCounts,
      )

    // ── Revenue (parallel) ──────────────────────────────────────────────────
    const [totalRevenue, thisMonthRevenue, lastMonthRevenue, revenueByServiceType] =
      await Promise.all([
        prisma.walletTransaction.aggregate({
          where: { type: 'debit', status: 'completed' },
          _sum: { amount: true },
        }),
        prisma.walletTransaction.aggregate({
          where: {
            type: 'debit',
            status: 'completed',
            createdAt: { gte: startOfMonth },
          },
          _sum: { amount: true },
        }),
        prisma.walletTransaction.aggregate({
          where: {
            type: 'debit',
            status: 'completed',
            createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          },
          _sum: { amount: true },
        }),
        prisma.walletTransaction.groupBy({
          by: ['serviceType'],
          where: { type: 'debit', status: 'completed' },
          _sum: { amount: true },
        }),
      ])

    // ── Recent activity (parallel) ──────────────────────────────────────────
    const [newUsersThisWeek, bookingsThisWeek, videoSessionsThisWeek] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      // Sum bookings created this week across all booking models
      Promise.all([
        prisma.appointment.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.nurseBooking.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.childcareBooking.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.labTestBooking.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.emergencyBooking.count({ where: { createdAt: { gte: weekAgo } } }),
      ]).then((counts) => counts.reduce((a, b) => a + b, 0)),
      prisma.videoCallSession.count({ where: { startedAt: { gte: weekAgo } } }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          patients,
          doctors,
          nurses,
          nannies,
          pharmacists,
          labTechs,
          emergencyWorkers,
          insuranceReps,
          corporateAdmins,
          referralPartners,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          upcoming: upcomingBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
        },
        revenue: {
          total: totalRevenue._sum.amount ?? 0,
          thisMonth: thisMonthRevenue._sum.amount ?? 0,
          lastMonth: lastMonthRevenue._sum.amount ?? 0,
          byServiceType: revenueByServiceType.map((row) => ({
            serviceType: row.serviceType ?? 'unknown',
            total: row._sum.amount ?? 0,
          })),
        },
        recentActivity: {
          newUsersThisWeek,
          bookingsThisWeek,
          videoSessionsThisWeek,
        },
      },
    })
  } catch (error) {
    console.error('Admin metrics error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
