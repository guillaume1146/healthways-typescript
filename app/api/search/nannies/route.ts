import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
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
          },
        },
      },
    })

    const mapped = nannies.map((nanny) => {
      const user = nanny.user
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`,
        specialization: nanny.certifications.length > 0 ? nanny.certifications : ['Child Care', 'Early Development'],
        subSpecialties: [],
        ageGroups: ['Infant (0-1)', 'Toddler (1-3)', 'Preschool (3-5)', 'School Age (5-12)'],
        rating: 4.8,
        reviews: 15,
        experience: `${nanny.experience} years`,
        location: user.address || 'Port Louis, Mauritius',
        address: user.address || 'Port Louis, Mauritius',
        languages: ['English', 'French', 'Creole'],
        hourlyRate: 600,
        overnightRate: 2500,
        availability: 'Available',
        nextAvailable: 'Available Today',
        bio: `Caring and experienced childcare professional with ${nanny.experience} years of experience. Certified in ${nanny.certifications.join(', ') || 'early childhood development'}. Dedicated to creating a safe and nurturing environment for children.`,
        education: ['Early Childhood Education Certificate'],
        workHistory: [`Professional Nanny - ${nanny.experience} years experience`],
        certifications: nanny.certifications,
        services: ['Babysitting', 'Homework Help', 'Meal Preparation', 'Activity Planning', 'Light Housekeeping'],
        careTypes: ['Full-time Care', 'Part-time Care', 'Date Night Sitting', 'Educational Support'],
        verified: user.verified,
        backgroundCheck: true,
        emergencyAvailable: true,
        phone: user.phone,
        age: user.dateOfBirth ? Math.floor((Date.now() - user.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 28,
        maxChildren: 3,
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
