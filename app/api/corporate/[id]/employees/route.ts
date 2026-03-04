import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'

/**
 * GET /api/corporate/[id]/employees
 * Returns users associated with this corporate account.
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
    // Get the corporate admin profile to find company name
    const corporateProfile = await prisma.corporateAdminProfile.findUnique({
      where: { userId: id },
      select: { id: true, companyName: true },
    })

    if (!corporateProfile) {
      return NextResponse.json({ success: false, message: 'Corporate profile not found' }, { status: 404 })
    }

    // Find users whose address contains the company name (simple association)
    // In a full implementation, this would use a CorporateEmployee join table
    const employees = await prisma.user.findMany({
      where: {
        userType: 'PATIENT',
        address: { contains: corporateProfile.companyName, mode: 'insensitive' },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        profileImage: true,
        accountStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      data: employees,
      total: employees.length,
    })
  } catch (error) {
    console.error('GET /api/corporate/[id]/employees error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
