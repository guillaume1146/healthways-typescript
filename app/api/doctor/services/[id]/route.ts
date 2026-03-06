import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  try {
    const service = await prisma.doctorServiceCatalog.findUnique({ where: { id } })
    if (!service) return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Error fetching doctor service:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  try {
    const profile = await prisma.doctorProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })
    if (!profile) return NextResponse.json({ success: false, message: 'Doctor profile not found' }, { status: 404 })

    const existing = await prisma.doctorServiceCatalog.findUnique({ where: { id } })
    if (!existing || existing.doctorId !== profile.id) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    const body = await request.json()
    const service = await prisma.doctorServiceCatalog.update({
      where: { id },
      data: {
        ...(body.serviceName !== undefined && { serviceName: body.serviceName }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.currency !== undefined && { currency: body.currency }),
        ...(body.duration !== undefined && { duration: Number(body.duration) }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Error updating doctor service:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  try {
    const profile = await prisma.doctorProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })
    if (!profile) return NextResponse.json({ success: false, message: 'Doctor profile not found' }, { status: 404 })

    const existing = await prisma.doctorServiceCatalog.findUnique({ where: { id } })
    if (!existing || existing.doctorId !== profile.id) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
    }

    await prisma.doctorServiceCatalog.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Service deleted' })
  } catch (error) {
    console.error('Error deleting doctor service:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
