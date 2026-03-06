import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitSearch } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitSearch(request)
  if (limited) return limited

  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q') || ''
    const specialization = searchParams.get('specialization') || ''

    const nurses = await prisma.nurseProfile.findMany({
      where: {
        user: {
          accountStatus: 'active',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            phone: true,
            verified: true,
            gender: true,
            dateOfBirth: true,
            address: true,
            reviewsReceived: {
              where: { providerType: 'NURSE' },
              select: { rating: true },
            },
          },
        },
        nurseServiceCatalog: {
          select: { serviceName: true, price: true },
          take: 5,
        },
      },
    })

    const mapped = nurses.map((nurse) => {
      const user = nurse.user
      const reviews = user.reviewsReceived || []
      const avgRating = reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0
      const baseRate = nurse.nurseServiceCatalog.length > 0
        ? Math.min(...nurse.nurseServiceCatalog.map(s => s.price))
        : null

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`,
        type: 'Registered Nurse',
        specialization: nurse.specializations,
        subSpecialties: [],
        rating: avgRating,
        reviews: reviews.length,
        experience: `${nurse.experience} years`,
        location: user.address || '',
        address: user.address || '',
        languages: ['English', 'French', 'Creole'],
        hourlyRate: baseRate,
        videoConsultationRate: baseRate ? Math.round(baseRate * 0.75) : null,
        availability: 'Available',
        nextAvailable: 'Available Today',
        bio: `Experienced registered nurse with ${nurse.experience} years of experience specializing in ${nurse.specializations.join(', ')}.`,
        education: [`BSc Nursing`],
        workHistory: [`Registered Nurse - ${nurse.experience} years experience`],
        certifications: [`RN License: ${nurse.licenseNumber}`],
        services: nurse.nurseServiceCatalog.map(s => s.serviceName),
        consultationTypes: ['In-Person', 'Video Consultation', 'Home Visit'],
        verified: user.verified,
        emergencyAvailable: false,
        phone: user.phone,
        age: user.dateOfBirth ? Math.floor((Date.now() - user.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        patientComments: [],
      }
    })

    let results = mapped

    if (specialization && specialization !== 'all') {
      results = results.filter((n) =>
        n.specialization.some((s) => s.toLowerCase().includes(specialization.toLowerCase()))
      )
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      results = results.filter((n) => {
        return (
          n.firstName.toLowerCase().includes(lowerQuery) ||
          n.lastName.toLowerCase().includes(lowerQuery) ||
          n.specialization.some((s) => s.toLowerCase().includes(lowerQuery)) ||
          n.location.toLowerCase().includes(lowerQuery) ||
          n.bio.toLowerCase().includes(lowerQuery)
        )
      })
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Nurses search error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
