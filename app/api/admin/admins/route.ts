import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'

/**
 * GET /api/admin/admins
 * Returns all users with REGIONAL_ADMIN type.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const admins = await prisma.user.findMany({
      where: { userType: 'REGIONAL_ADMIN' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        profileImage: true,
        accountStatus: true,
        verified: true,
        createdAt: true,
        regionalAdminProfile: {
          select: { region: true, country: true, countryCode: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: admins })
  } catch (error) {
    console.error('GET /api/admin/admins error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
