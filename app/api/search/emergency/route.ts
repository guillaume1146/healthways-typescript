import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q') || ''
    const serviceType = searchParams.get('type') || ''

    const services = await prisma.emergencyServiceListing.findMany({
      where: {
        isActive: true,
        worker: {
          user: { accountStatus: 'active' },
        },
      },
      include: {
        worker: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                phone: true,
                verified: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    let results = services.map((svc) => ({
      id: svc.id,
      serviceName: svc.serviceName,
      serviceType: svc.serviceType,
      description: svc.description,
      responseTime: svc.responseTime,
      available24h: svc.available24h,
      coverageArea: svc.coverageArea,
      contactNumber: svc.contactNumber,
      price: svc.price,
      currency: svc.currency,
      specializations: svc.specializations,
      worker: {
        id: svc.worker.user.id,
        name: `${svc.worker.user.firstName} ${svc.worker.user.lastName}`,
        profileImage: svc.worker.user.profileImage,
        phone: svc.worker.user.phone,
        verified: svc.worker.user.verified,
        certifications: svc.worker.certifications,
        vehicleType: svc.worker.vehicleType,
        emtLevel: svc.worker.emtLevel,
      },
    }))

    if (serviceType && serviceType !== 'all') {
      results = results.filter((s) => s.serviceType.toLowerCase().includes(serviceType.toLowerCase()))
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      results = results.filter((s) =>
        s.serviceName.toLowerCase().includes(lowerQuery) ||
        s.serviceType.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.coverageArea.toLowerCase().includes(lowerQuery) ||
        s.specializations.some((sp) => sp.toLowerCase().includes(lowerQuery))
      )
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Emergency search error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
