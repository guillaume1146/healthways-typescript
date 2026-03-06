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

    const nannies = await prisma.nannyProfile.findMany({
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
              where: { providerType: 'NANNY' },
              select: { rating: true },
            },
          },
        },
        nannyServiceCatalog: {
          select: { serviceName: true, price: true },
          take: 5,
        },
      },
    })

    const mapped = nannies.map((nanny) => {
      const user = nanny.user
      const reviews = user.reviewsReceived || []
      const avgRating = reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0
      const baseRate = nanny.nannyServiceCatalog.length > 0
        ? Math.min(...nanny.nannyServiceCatalog.map(s => s.price))
        : null

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`,
        specialization: nanny.certifications.length > 0 ? nanny.certifications : ['Child Care'],
        subSpecialties: [],
        ageGroups: ['Infant (0-1)', 'Toddler (1-3)', 'Preschool (3-5)', 'School Age (5-12)'],
        rating: avgRating,
        reviews: reviews.length,
        experience: `${nanny.experience} years`,
        location: user.address || '',
        address: user.address || '',
        languages: ['English', 'French', 'Creole'],
        hourlyRate: baseRate,
        overnightRate: baseRate ? Math.round(baseRate * 4) : null,
        availability: 'Available',
        nextAvailable: 'Available Today',
        bio: `Caring and experienced childcare professional with ${nanny.experience} years of experience. Certified in ${nanny.certifications.join(', ') || 'early childhood development'}.`,
        education: ['Early Childhood Education Certificate'],
        workHistory: [`Professional Nanny - ${nanny.experience} years experience`],
        certifications: nanny.certifications,
        services: nanny.nannyServiceCatalog.map(s => s.serviceName),
        careTypes: ['Full-time Care', 'Part-time Care', 'Date Night Sitting'],
        verified: user.verified,
        backgroundCheck: user.verified,
        emergencyAvailable: false,
        phone: user.phone,
        age: user.dateOfBirth ? Math.floor((Date.now() - user.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        maxChildren: null,
        yearsOfExperience: nanny.experience,
        patientComments: [],
      }
    })

    let results = mapped

    if (specialization && specialization !== 'all') {
      results = results.filter((n) =>
        n.specialization.some((s) => s.toLowerCase().includes(specialization.toLowerCase())) ||
        n.certifications.some((c) => c.toLowerCase().includes(specialization.toLowerCase()))
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
          n.bio.toLowerCase().includes(lowerQuery) ||
          n.ageGroups.some((a) => a.toLowerCase().includes(lowerQuery)) ||
          n.services.some((s) => s.toLowerCase().includes(lowerQuery))
        )
      })
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Nannies search error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
