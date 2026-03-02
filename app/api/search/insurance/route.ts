import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitSearch } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitSearch(request)
  if (limited) return limited

  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q') || ''
    const planType = searchParams.get('type') || ''
    const maxBudget = searchParams.get('budget') ? parseFloat(searchParams.get('budget')!) : null

    const plans = await prisma.insurancePlanListing.findMany({
      where: {
        isActive: true,
        insuranceRep: {
          user: { accountStatus: 'active' },
        },
      },
      include: {
        insuranceRep: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                verified: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    let results = plans.map((plan) => ({
      id: plan.id,
      planName: plan.planName,
      planType: plan.planType,
      description: plan.description,
      monthlyPremium: plan.monthlyPremium,
      annualPremium: plan.annualPremium,
      currency: plan.currency,
      coverageAmount: plan.coverageAmount,
      deductible: plan.deductible,
      coverageDetails: plan.coverageDetails,
      eligibility: plan.eligibility,
      company: plan.insuranceRep.companyName,
      representative: {
        id: plan.insuranceRep.user.id,
        name: `${plan.insuranceRep.user.firstName} ${plan.insuranceRep.user.lastName}`,
        profileImage: plan.insuranceRep.user.profileImage,
        verified: plan.insuranceRep.user.verified,
      },
    }))

    if (planType && planType !== 'all') {
      results = results.filter((p) => p.planType.toLowerCase().includes(planType.toLowerCase()))
    }

    if (maxBudget) {
      results = results.filter((p) => p.monthlyPremium <= maxBudget)
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      results = results.filter((p) =>
        p.planName.toLowerCase().includes(lowerQuery) ||
        p.planType.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.company.toLowerCase().includes(lowerQuery) ||
        p.coverageDetails.some((d) => d.toLowerCase().includes(lowerQuery))
      )
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Insurance search error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
