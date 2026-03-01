import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { cookieToPrismaUserType, prismaUserTypeToCookie, userTypeToProfileRelation } from '@/lib/auth/user-type-map'

export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Convert the cookie user-type string (from JWT) to the Prisma enum
    const prismaUserType = cookieToPrismaUserType[auth.userType]
    if (!prismaUserType) {
      return NextResponse.json({ success: false, message: 'Invalid user type' }, { status: 400 })
    }

    // Determine which profile relation to include
    const profileRelation = userTypeToProfileRelation[prismaUserType]

    const user = await prisma.user.findUnique({
      where: { id: auth.sub },
      include: {
        [profileRelation]: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Extract the profile data (strip the relation key and flatten if desired)
    const { password: _password, ...safeUser } = user
    const cookieUserType = prismaUserTypeToCookie[user.userType]

    return NextResponse.json({
      success: true,
      user: {
        ...safeUser,
        userType: cookieUserType,
      },
    })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
