import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { emergencyServiceSchema } from '@/lib/validations/catalog'

export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  if (auth.userType !== 'ambulance') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const profile = await prisma.emergencyWorkerProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Emergency worker profile not found' }, { status: 404 })
    }

    const services = await prisma.emergencyServiceListing.findMany({
      where: { workerId: profile.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error('Emergency services fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  if (auth.userType !== 'ambulance') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const profile = await prisma.emergencyWorkerProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Emergency worker profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = emergencyServiceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 })
    }

    const service = await prisma.emergencyServiceListing.create({
      data: {
        workerId: profile.id,
        ...parsed.data,
      },
    })

    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (error) {
    console.error('Emergency service create error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
