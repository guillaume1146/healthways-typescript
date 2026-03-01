import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { insurancePlanSchema } from '@/lib/validations/catalog'

export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  if (auth.userType !== 'insurance') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const profile = await prisma.insuranceRepProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Insurance rep profile not found' }, { status: 404 })
    }

    const plans = await prisma.insurancePlanListing.findMany({
      where: { insuranceRepId: profile.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: plans })
  } catch (error) {
    console.error('Insurance plans fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  if (auth.userType !== 'insurance') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const profile = await prisma.insuranceRepProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Insurance rep profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = insurancePlanSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 })
    }

    const plan = await prisma.insurancePlanListing.create({
      data: {
        insuranceRepId: profile.id,
        ...parsed.data,
      },
    })

    return NextResponse.json({ success: true, data: plan }, { status: 201 })
  } catch (error) {
    console.error('Insurance plan create error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
