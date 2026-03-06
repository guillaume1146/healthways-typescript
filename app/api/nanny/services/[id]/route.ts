import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { nannyServiceCatalogSchema } from '@/lib/validations/catalog'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'child-care-nurse') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params

    const nannyProfile = await prisma.nannyProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!nannyProfile) {
      return NextResponse.json({ success: false, message: 'Nanny profile not found' }, { status: 404 })
    }

    const existing = await prisma.nannyServiceCatalog.findUnique({
      where: { id },
      select: { nannyId: true },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    if (existing.nannyId !== nannyProfile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = nannyServiceCatalogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const service = await prisma.nannyServiceCatalog.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Nanny service catalog update error:', error)
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
  if (!auth || auth.userType !== 'child-care-nurse') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params

    const nannyProfile = await prisma.nannyProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!nannyProfile) {
      return NextResponse.json({ success: false, message: 'Nanny profile not found' }, { status: 404 })
    }

    const existing = await prisma.nannyServiceCatalog.findUnique({
      where: { id },
      select: { nannyId: true },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    if (existing.nannyId !== nannyProfile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    await prisma.nannyServiceCatalog.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('Nanny service catalog delete error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
