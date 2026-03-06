import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitSearch } from '@/lib/rate-limit'

/**
 * GET /api/lab-techs/available
 * Lists available lab technicians with profile info for the booking form.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimitSearch(request)
  if (limited) return limited

  try {
    const labTechs = await prisma.labTechProfile.findMany({
      where: {
        user: { accountStatus: 'active', verified: true },
      },
      select: {
        id: true,
        labName: true,
        specializations: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        _count: {
          select: { labTestCatalog: { where: { isActive: true } } },
        },
      },
    })

    const data = labTechs.map((lt) => ({
      id: lt.id,
      userId: lt.user.id,
      name: lt.labName || `${lt.user.firstName} ${lt.user.lastName}`,
      profileImage: lt.user.profileImage,
      specializations: lt.specializations,
      testCount: lt._count.labTestCatalog,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/lab-techs/available error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
