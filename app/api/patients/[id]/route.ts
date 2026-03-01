import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  if (auth.userType === 'patient' && auth.sub !== id) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, firstName: true, lastName: true, email: true, profileImage: true,
        dateOfBirth: true, gender: true, phone: true, address: true,
        verified: true, createdAt: true,
        patientProfile: {
          select: {
            id: true, nationalId: true, bloodType: true, allergies: true,
            chronicConditions: true, healthScore: true,
            emergencyContact: true,
          },
        },
      },
    })

    if (!user || !user.patientProfile) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 })
    }

    const { patientProfile, ...userData } = user
    const patient = { ...userData, ...patientProfile, id: user.id }

    return NextResponse.json({ success: true, data: patient })
  } catch (error) {
    console.error('Patient fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
