import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'

/**
 * GET /api/users/search?q=...
 * Search users by name or email. Authenticated users only.
 */
export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, data: [] })
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: auth.sub } },
          { accountStatus: 'active' },
          {
            OR: [
              { firstName: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userType: true,
        profileImage: true,
      },
      take: 20,
      orderBy: { firstName: 'asc' },
    })

    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('GET /api/users/search error:', error)
    return NextResponse.json({ success: false, message: 'Search failed' }, { status: 500 })
  }
}
