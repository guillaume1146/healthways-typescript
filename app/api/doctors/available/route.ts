import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitSearch } from '@/lib/rate-limit'

/**
 * GET /api/doctors/available
 * Lists available doctors with profile info for the booking form.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimitSearch(request)
  if (limited) return limited

  try {
    const doctors = await prisma.doctorProfile.findMany({
      where: {
        user: { accountStatus: 'active', verified: true },
      },
      select: {
        id: true,
        specialty: true,
        consultationFee: true,
        rating: true,
        location: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            phone: true,
          },
        },
      },
    })

    const data = doctors.map((d) => ({
      id: d.id,
      userId: d.user.id,
      name: `Dr. ${d.user.firstName} ${d.user.lastName}`,
      profileImage: d.user.profileImage,
      specialty: d.specialty,
      consultationFee: d.consultationFee,
      rating: d.rating,
      location: d.location,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/doctors/available error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
