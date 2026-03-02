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
    const insuranceProfile = await prisma.insuranceRepProfile.findUnique({
      where: { userId: id },
      select: { id: true, companyName: true }
    })
    if (!insuranceProfile) return NextResponse.json({ message: 'Insurance profile not found' }, { status: 404 })

    const [plans, wallet] = await Promise.all([
      prisma.insurancePlanListing.findMany({
        where: { insuranceRepId: insuranceProfile.id },
        select: { id: true, planName: true, planType: true, monthlyPremium: true, coverageAmount: true, isActive: true }
      }),
      prisma.userWallet.findUnique({ where: { userId: id }, select: { balance: true } })
    ])

    const activePlans = plans.filter(p => p.isActive)

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          activePolicies: activePlans.length,
          totalPlans: plans.length,
          walletBalance: wallet?.balance || 0,
        },
        plans: plans.map(p => ({
          id: p.id,
          planName: p.planName,
          planType: p.planType,
          premium: p.monthlyPremium,
          coverageAmount: p.coverageAmount,
          isActive: p.isActive,
        })),
      }
    })
  } catch (error) {
    console.error('Insurance dashboard error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
