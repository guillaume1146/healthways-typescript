import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'

// Maps DB status values to the frontend-expected status enum
function mapStatus(
  dbStatus: string
): 'pending' | 'dispatched' | 'on-scene' | 'completed' | 'cancelled' {
  switch (dbStatus) {
    case 'en_route':
      return 'on-scene'
    case 'resolved':
      return 'completed'
    case 'pending':
    case 'dispatched':
    case 'cancelled':
      return dbStatus as 'pending' | 'dispatched' | 'cancelled'
    default:
      return 'pending'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Enforce ownership: a responder may only view their own call history
  if (auth.sub !== id) {
    return NextResponse.json(
      { success: false, message: 'Forbidden: You can only view your own call records' },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const statusFilter = searchParams.get('status') // optional frontend status filter

  try {
    // Resolve the EmergencyWorkerProfile for this user
    const workerProfile = await prisma.emergencyWorkerProfile.findUnique({
      where: { userId: id },
      select: { id: true },
    })

    if (!workerProfile) {
      return NextResponse.json(
        { success: false, message: 'Emergency worker profile not found' },
        { status: 404 }
      )
    }

    // Build where clause — always scoped to this responder
    // Map the frontend status filter back to DB values when provided
    const dbStatusValues: Record<string, string[]> = {
      'on-scene': ['en_route'],
      completed: ['resolved'],
      pending: ['pending'],
      dispatched: ['dispatched'],
      cancelled: ['cancelled'],
    }

    const statusWhere =
      statusFilter && dbStatusValues[statusFilter]
        ? { status: { in: dbStatusValues[statusFilter] } }
        : {}

    const bookings = await prisma.emergencyBooking.findMany({
      where: {
        responderId: workerProfile.id,
        ...statusWhere,
      },
      select: {
        id: true,
        emergencyType: true,
        location: true,
        status: true,
        priority: true,
        notes: true,
        createdAt: true,
        patient: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const data = bookings.map((booking) => ({
      id: booking.id,
      incidentType: booking.emergencyType,
      location: booking.location,
      status: mapStatus(booking.status),
      timestamp: booking.createdAt.toISOString(),
      urgency: booking.priority ?? undefined,
      notes: booking.notes ?? undefined,
      patientName: booking.patient?.user
        ? `${booking.patient.user.firstName} ${booking.patient.user.lastName}`
        : undefined,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/responders/[id]/calls error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
