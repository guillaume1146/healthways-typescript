import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { nurseServiceCatalogSchema } from '@/lib/validations/catalog'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'nurse') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params

    const nurseProfile = await prisma.nurseProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!nurseProfile) {
      return NextResponse.json({ success: false, message: 'Nurse profile not found' }, { status: 404 })
    }

    const existing = await prisma.nurseServiceCatalog.findUnique({
      where: { id },
      select: { nurseId: true },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    if (existing.nurseId !== nurseProfile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = nurseServiceCatalogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const service = await prisma.nurseServiceCatalog.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Nurse service catalog update error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'nurse') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params

    const nurseProfile = await prisma.nurseProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!nurseProfile) {
      return NextResponse.json({ success: false, message: 'Nurse profile not found' }, { status: 404 })
    }

    const existing = await prisma.nurseServiceCatalog.findUnique({
      where: { id },
      select: { nurseId: true },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    if (existing.nurseId !== nurseProfile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    await prisma.nurseServiceCatalog.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('Nurse service catalog delete error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
