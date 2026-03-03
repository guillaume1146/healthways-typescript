import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitSearch } from '@/lib/rate-limit'

/**
 * GET /api/nannies/available
 * Lists available nannies with profile info for the booking form.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimitSearch(request)
  if (limited) return limited

  try {
    const nannies = await prisma.nannyProfile.findMany({
      where: {
        user: { accountStatus: 'active', verified: true },
      },
      select: {
        id: true,
        experience: true,
        certifications: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            phone: true,
          },
        },
      },
    })

    const data = nannies.map((n) => ({
      id: n.id,
      userId: n.user.id,
      name: `${n.user.firstName} ${n.user.lastName}`,
      profileImage: n.user.profileImage,
      phone: n.user.phone,
      experience: `${n.experience} years`,
      certifications: n.certifications,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/nannies/available error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
