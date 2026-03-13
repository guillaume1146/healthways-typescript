import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'

/**
 * GET /api/connections/suggestions
 * Returns users that the current user is NOT connected with, excluding self.
 * Prioritizes providers (doctors, nurses, etc.) and users from the same region.
 */
export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const userId = auth.sub
  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 20)

  try {
    // Get current user's regionId for regional filtering
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { regionId: true },
    })

    // Get all user IDs already connected to
    const existingConnections = await prisma.userConnection.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      select: { senderId: true, receiverId: true },
    })

    const connectedIds = new Set<string>()
    connectedIds.add(userId)
    for (const conn of existingConnections) {
      connectedIds.add(conn.senderId)
      connectedIds.add(conn.receiverId)
    }

    const baseWhere = {
      id: { notIn: Array.from(connectedIds) },
      accountStatus: 'active',
    }

    // If user has a region, prioritize same-region users
    let suggestions
    if (currentUser?.regionId) {
      // First get same-region users
      const sameRegion = await prisma.user.findMany({
        where: { ...baseWhere, regionId: currentUser.regionId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          userType: true,
          doctorProfile: { select: { specialty: true } },
          nurseProfile: { select: { specializations: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      // If not enough, fill with other users
      if (sameRegion.length < limit) {
        const sameRegionIds = sameRegion.map(u => u.id)
        const others = await prisma.user.findMany({
          where: {
            ...baseWhere,
            id: { notIn: [...Array.from(connectedIds), ...sameRegionIds] },
            regionId: { not: currentUser.regionId },
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            userType: true,
            doctorProfile: { select: { specialty: true } },
            nurseProfile: { select: { specializations: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit - sameRegion.length,
        })
        suggestions = [...sameRegion, ...others]
      } else {
        suggestions = sameRegion
      }
    } else {
      // No region — show all users (backwards compat)
      suggestions = await prisma.user.findMany({
        where: baseWhere,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          userType: true,
          doctorProfile: { select: { specialty: true } },
          nurseProfile: { select: { specializations: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    }

    const data = suggestions.map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      profileImage: u.profileImage,
      userType: u.userType,
      specialty: u.doctorProfile?.specialty || u.nurseProfile?.specializations || [],
      connectionStatus: 'none' as const,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/connections/suggestions error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}
