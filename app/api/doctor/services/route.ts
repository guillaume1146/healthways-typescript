import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { doctorServiceSchema } from '@/lib/validations/service-catalog'

export async function GET(request: NextRequest) {
  // Public access: ?userId=xxx returns active services for a doctor (for booking flow)
  const { searchParams } = new URL(request.url)
  const publicUserId = searchParams.get('userId')

  if (publicUserId) {
    try {
      const profile = await prisma.doctorProfile.findUnique({
        where: { userId: publicUserId },
        select: { id: true },
      })
      if (!profile) return NextResponse.json({ success: true, data: [] })

      const services = await prisma.doctorServiceCatalog.findMany({
        where: { doctorId: profile.id, isActive: true },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ success: true, data: services })
    } catch (error) {
      console.error('Error fetching public doctor services:', error)
      return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
    }
  }

  // Authenticated: doctor views their own services
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
    const parsed = doctorServiceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { serviceName, category, description, price, currency, duration, isActive } = parsed.data

    const service = await prisma.doctorServiceCatalog.create({
      data: {
        doctorId: profile.id,
        serviceName,
        category,
        description,
        price,
        currency,
        duration,
        isActive,
      },
    })

    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (error) {
    console.error('Error creating doctor service:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
