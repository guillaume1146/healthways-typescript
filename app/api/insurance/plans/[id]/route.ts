import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { insurancePlanSchema } from '@/lib/validations/catalog'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  if (auth.userType !== 'insurance') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  try {
    const profile = await prisma.insuranceRepProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Insurance rep profile not found' }, { status: 404 })
    }

    const existing = await prisma.insurancePlanListing.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Plan not found' }, { status: 404 })
    }

    if (existing.insuranceRepId !== profile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = insurancePlanSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 })
    }

    const updated = await prisma.insurancePlanListing.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Insurance plan update error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  if (auth.userType !== 'insurance') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  try {
    const profile = await prisma.insuranceRepProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Insurance rep profile not found' }, { status: 404 })
    }

    const existing = await prisma.insurancePlanListing.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Plan not found' }, { status: 404 })
    }

    if (existing.insuranceRepId !== profile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    await prisma.insurancePlanListing.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Plan deleted' })
  } catch (error) {
    console.error('Insurance plan delete error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
