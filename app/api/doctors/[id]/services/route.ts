import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    // Try as userId first (most common from search), then as profileId
    let profile = await prisma.doctorProfile.findUnique({
      where: { userId: id },
      select: { id: true },
    })
    if (!profile) {
      profile = await prisma.doctorProfile.findUnique({
        where: { id },
        select: { id: true },
      })
    }
    if (!profile) {
      return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 })
    }

    const services = await prisma.doctorServiceCatalog.findMany({
      where: { doctorId: profile.id, isActive: true },
      orderBy: { category: 'asc' },
      select: {
        id: true,
        serviceName: true,
        category: true,
        description: true,
        price: true,
        currency: true,
        duration: true,
      },
    })

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error('Error fetching doctor services:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
