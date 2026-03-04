import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'

/**
 * GET /api/corporate/[id]/claims
 * Returns insurance claims related to the corporate account's employees.
 * The `id` param is the corporate admin's user ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (auth.sub !== id) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const corporateProfile = await prisma.corporateAdminProfile.findUnique({
      where: { userId: id },
      select: { id: true, companyName: true },
    })

    if (!corporateProfile) {
      return NextResponse.json({ success: false, message: 'Corporate profile not found' }, { status: 404 })
    }

    // Find insurance claims from employees of this company
    const claims = await prisma.insuranceClaim.findMany({
      where: {
        patient: {
          user: {
            address: { contains: corporateProfile.companyName, mode: 'insensitive' },
          },
        },
      },
      select: {
        id: true,
        claimId: true,
        policyHolderName: true,
        description: true,
        policyType: true,
        claimAmount: true,
        status: true,
        submittedDate: true,
        resolvedDate: true,
        patient: {
          select: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
      orderBy: { submittedDate: 'desc' },
      take: 50,
    })

    return NextResponse.json({ success: true, data: claims })
  } catch (error) {
    console.error('GET /api/corporate/[id]/claims error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
