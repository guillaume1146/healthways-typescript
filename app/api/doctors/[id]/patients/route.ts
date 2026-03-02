import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (auth.userType === 'doctor' && auth.sub !== id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  try {
    // id is User.id — resolve DoctorProfile.id for the appointment query
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: id },
      select: { id: true },
    })

    if (!doctorProfile) {
      return NextResponse.json({ message: 'Doctor profile not found' }, { status: 404 })
    }

    // Get unique patients who have appointments with this doctor
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctorProfile.id },
      select: {
        patient: {
          select: {
            id: true,
            userId: true,
            chronicConditions: true,
            bloodType: true,
            allergies: true,
            user: {
              select: {
                firstName: true, lastName: true, profileImage: true,
                phone: true, gender: true, dateOfBirth: true, email: true,
              },
            },
          },
        },
        status: true,
        scheduledAt: true,
      },
      orderBy: { scheduledAt: 'desc' },
    })

    // Deduplicate patients — flatten user fields for convenience
    const patientMap = new Map<string, {
      id: string
      userId: string
      firstName: string
      lastName: string
      email: string
      profileImage: string | null
      phone: string
      gender: string | null
      dateOfBirth: Date | null
      bloodType: string | null
      allergies: string[]
      chronicConditions: string[]
      lastVisit: Date
      appointmentCount: number
    }>()

    for (const apt of appointments) {
      const existing = patientMap.get(apt.patient.id)
      if (!existing) {
        patientMap.set(apt.patient.id, {
          id: apt.patient.id,
          userId: apt.patient.userId,
          firstName: apt.patient.user.firstName,
          lastName: apt.patient.user.lastName,
          email: apt.patient.user.email,
          profileImage: apt.patient.user.profileImage,
          phone: apt.patient.user.phone,
          gender: apt.patient.user.gender,
          dateOfBirth: apt.patient.user.dateOfBirth,
          bloodType: apt.patient.bloodType,
          allergies: apt.patient.allergies,
          chronicConditions: apt.patient.chronicConditions,
          lastVisit: apt.scheduledAt,
          appointmentCount: 1,
        })
      } else {
        existing.appointmentCount++
      }
    }

    return NextResponse.json({ success: true, data: Array.from(patientMap.values()) })
  } catch (error) {
    console.error('Doctor patients fetch error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
