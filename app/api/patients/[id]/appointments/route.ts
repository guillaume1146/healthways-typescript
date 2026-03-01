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
  if (auth.userType === 'patient' && auth.sub !== id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // upcoming, completed, cancelled
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: id } })
    if (!profile) {
      return NextResponse.json({ message: 'Patient profile not found' }, { status: 404 })
    }

    const where = { patientId: profile.id, ...(status ? { status } : {}) }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        select: {
          id: true, scheduledAt: true, type: true, status: true, specialty: true,
          reason: true, duration: true, location: true, roomId: true, notes: true,
          doctor: {
            select: {
              id: true, specialty: true,
              user: { select: { firstName: true, lastName: true, profileImage: true } },
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
    console.error('Appointments fetch error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
