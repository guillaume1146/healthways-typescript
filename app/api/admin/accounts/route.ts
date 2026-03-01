import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'

export async function GET(request: NextRequest) {
  try {
    const auth = validateRequest(request)
    if (!auth || auth.userType !== 'super-admin') {
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
  try {
    const auth = validateRequest(request)
    if (!auth || auth.userType !== 'super-admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, action } = body

    if (!userId || !['approve', 'reject', 'suspend'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 })
    }

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
