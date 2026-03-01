import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
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
          },
        },
      },
    })

    const mapped = nurses.map((nurse) => {
      const user = nurse.user
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`,
        type: 'Registered Nurse',
        specialization: nurse.specializations,
        subSpecialties: [],
        clinicAffiliation: 'Healthwyz Medical Center',
        rating: 4.7,
        reviews: 28,
        experience: `${nurse.experience} years`,
        location: user.address || 'Port Louis, Mauritius',
        address: user.address || 'Port Louis, Mauritius',
        languages: ['English', 'French', 'Creole'],
        hourlyRate: 1000,
        videoConsultationRate: 750,
        availability: 'Available',
        nextAvailable: 'Available Today',
        bio: `Experienced registered nurse with ${nurse.experience} years of experience specializing in ${nurse.specializations.join(', ')}. Dedicated to providing compassionate and professional care.`,
        education: [`BSc Nursing - University of Mauritius`],
        workHistory: [`Registered Nurse - ${nurse.experience} years experience`],
        certifications: [`RN License: ${nurse.licenseNumber}`],
        services: nurse.specializations,
        consultationTypes: ['In-Person', 'Video Consultation', 'Home Visit'],
        verified: user.verified,
        emergencyAvailable: true,
        phone: user.phone,
        age: user.dateOfBirth ? Math.floor((Date.now() - user.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 30,
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
