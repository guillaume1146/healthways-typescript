import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { adminAccountActionSchema } from '@/lib/validations/api'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  try {
    const auth = validateRequest(request)
    if (!auth || !['admin', 'regional-admin'].includes(auth.userType)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const status = searchParams.get('status') || 'pending'

    const users = await prisma.user.findMany({
      where: { accountStatus: status },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        userType: true,
        accountStatus: true,
        profileImage: true,
        verified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('Admin accounts error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  try {
    const auth = validateRequest(request)
    if (!auth || !['admin', 'regional-admin'].includes(auth.userType)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = adminAccountActionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }
    const { userId, action } = parsed.data

    const newStatus = action === 'approve' ? 'active' : action === 'suspend' ? 'suspended' : 'suspended'

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        accountStatus: newStatus,
        verified: action === 'approve' ? true : undefined,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        accountStatus: true,
      },
    })

    return NextResponse.json({ success: true, data: user, message: `Account ${action}d successfully` })
  } catch (error) {
    console.error('Admin account update error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
