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
    const [corporateProfile, wallet, billingRecords, walletTx, notifications] = await Promise.all([
      prisma.corporateAdminProfile.findUnique({
        where: { userId: id },
        select: { id: true, companyName: true, employeeCount: true, industry: true, registrationNumber: true },
      }),
      prisma.userWallet.findUnique({ where: { userId: id }, select: { balance: true } }),
      prisma.billingInfo.findMany({
        where: { userId: id },
        select: { id: true, type: true, lastFour: true, cardHolder: true, isDefault: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.walletTransaction.findMany({
        where: { wallet: { userId: id } },
        select: { id: true, type: true, amount: true, description: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.notification.findMany({
        where: { userId: id, readAt: null },
        select: { id: true, type: true, title: true, message: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    if (!corporateProfile) return NextResponse.json({ message: 'Corporate profile not found' }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalEmployees: corporateProfile.employeeCount || 0,
          companyName: corporateProfile.companyName || '',
          industry: corporateProfile.industry || '',
          registrationNumber: corporateProfile.registrationNumber || '',
          walletBalance: wallet?.balance || 0,
        },
        billingMethods: billingRecords,
        recentTransactions: walletTx.map(tx => ({
          id: tx.id,
          date: tx.createdAt.toISOString().slice(0, 10),
          description: tx.description,
          amount: tx.amount,
          status: tx.status,
          type: tx.type,
        })),
        notifications,
      },
    })
  } catch (error) {
    console.error('Corporate dashboard error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
