import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitSearch } from '@/lib/rate-limit'

/**
 * GET /api/nurses/available
 * Lists available nurses with profile info for the booking form.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimitSearch(request)
  if (limited) return limited

  try {
    const nurses = await prisma.nurseProfile.findMany({
      where: {
        user: { accountStatus: 'active', verified: true },
      },
      select: {
        id: true,
        specializations: true,
        experience: true,
        licenseNumber: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            phone: true,
          },
        },
        _count: {
          select: { nurseServiceCatalog: { where: { isActive: true } } },
        },
      },
    })

    const data = nurses.map((n) => ({
      id: n.id,
      userId: n.user.id,
      name: `${n.user.firstName} ${n.user.lastName}`,
      profileImage: n.user.profileImage,
      phone: n.user.phone,
      experience: `${n.experience} years`,
      specializations: n.specializations,
      serviceCount: n._count.nurseServiceCatalog,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/nurses/available error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
