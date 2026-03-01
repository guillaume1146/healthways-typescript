import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { emergencyServiceSchema } from '@/lib/validations/catalog'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  if (auth.userType !== 'ambulance') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  try {
    const profile = await prisma.emergencyWorkerProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Emergency worker profile not found' }, { status: 404 })
    }

    const existing = await prisma.emergencyServiceListing.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    if (existing.workerId !== profile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = emergencyServiceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 })
    }

    const updated = await prisma.emergencyServiceListing.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Emergency service update error:', error)
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

  if (auth.userType !== 'ambulance') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  try {
    const profile = await prisma.emergencyWorkerProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Emergency worker profile not found' }, { status: 404 })
    }

    const existing = await prisma.emergencyServiceListing.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    if (existing.workerId !== profile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    await prisma.emergencyServiceListing.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Service deleted' })
  } catch (error) {
    console.error('Emergency service delete error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
