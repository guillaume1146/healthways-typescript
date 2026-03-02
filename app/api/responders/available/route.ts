import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitPublic } from '@/lib/rate-limit'

/**
 * GET /api/responders/available
 * Lists available emergency workers/services.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  try {
    const workers = await prisma.emergencyWorkerProfile.findMany({
      where: {
        user: { accountStatus: 'active', verified: true },
      },
      select: {
        id: true,
        certifications: true,
        vehicleType: true,
        responseZone: true,
        emtLevel: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    })

    const data = workers.map((w) => ({
      id: w.id,
      name: `${w.user.firstName} ${w.user.lastName}`,
      service: w.emtLevel || 'Emergency Response',
      phone: w.user.phone,
      available24h: true,
      responseTime: w.responseZone || 'Variable',
      specialization: w.certifications,
      location: w.responseZone || 'Local',
      vehicleType: w.vehicleType,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/responders/available error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
