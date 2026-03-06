import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'

export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  try {
    const profile = await prisma.doctorProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })
    if (!profile) return NextResponse.json({ success: false, message: 'Doctor profile not found' }, { status: 404 })

    const services = await prisma.doctorServiceCatalog.findMany({
      where: { doctorId: profile.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error('Error fetching doctor services:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  try {
    const profile = await prisma.doctorProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })
    if (!profile) return NextResponse.json({ success: false, message: 'Doctor profile not found' }, { status: 404 })

    const body = await request.json()
    const { serviceName, category, description, price, currency, duration, isActive } = body

    if (!serviceName || !category || !description || price == null) {
      return NextResponse.json({ success: false, message: 'Missing required fields: serviceName, category, description, price' }, { status: 400 })
    }

    const service = await prisma.doctorServiceCatalog.create({
      data: {
        doctorId: profile.id,
        serviceName,
        category,
        description,
        price: Number(price),
        currency: currency || 'MUR',
        duration: duration ? Number(duration) : 30,
        isActive: isActive !== false,
      },
    })

    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (error) {
    console.error('Error creating doctor service:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
