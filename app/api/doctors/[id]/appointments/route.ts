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

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    // id is User.id — resolve DoctorProfile.id for the appointment query
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: id },
      select: { id: true },
    })

    if (!doctorProfile) {
      return NextResponse.json({ message: 'Doctor profile not found' }, { status: 404 })
    }

    const where = { doctorId: doctorProfile.id, ...(status ? { status } : {}) }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        select: {
          id: true, scheduledAt: true, type: true, status: true, specialty: true,
          reason: true, duration: true, location: true, roomId: true,
          patient: {
            select: {
              id: true,
              user: { select: { firstName: true, lastName: true, profileImage: true, phone: true } },
            },
          },
        },
        orderBy: { scheduledAt: status === 'upcoming' ? 'asc' : 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.appointment.count({ where }),
    ])

    return NextResponse.json({ success: true, data: appointments, total, limit, offset })
  } catch (error) {
    console.error('Doctor appointments fetch error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
