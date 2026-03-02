import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { createNotification } from '@/lib/notifications'
import { createEmergencyBookingSchema } from '@/lib/validations/api'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = createEmergencyBookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }
    const { emergencyType, location, contactNumber, notes, priority } = parsed.data

    // Look up patient profile
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!patientProfile) {
      return NextResponse.json(
        { success: false, message: 'Patient profile not found' },
        { status: 404 }
      )
    }

    // No wallet debit for emergency bookings (free during trial)
    const booking = await prisma.emergencyBooking.create({
      data: {
        patientId: patientProfile.id,
        emergencyType: emergencyType.trim(),
        location: location.trim(),
        contactNumber: contactNumber.trim(),
        notes: notes?.trim() || null,
        priority: priority || 'medium',
        status: 'pending',
      },
      select: {
        id: true,
        emergencyType: true,
        status: true,
        priority: true,
        createdAt: true,
      },
    })

    // Notify all available emergency workers about the new request
    const emergencyWorkers = await prisma.emergencyWorkerProfile.findMany({
      select: { userId: true },
    })

    const patientUser = await prisma.user.findUnique({
      where: { id: auth.sub },
      select: { firstName: true, lastName: true },
    })

    for (const worker of emergencyWorkers) {
      await createNotification({
        userId: worker.userId,
        type: 'booking_request',
        title: 'New Emergency Request',
        message: `${patientUser?.firstName} ${patientUser?.lastName} has reported a ${emergencyType.trim()} emergency (${priority || 'medium'} priority) at ${location.trim()}`,
        referenceId: booking.id,
        referenceType: 'emergency_booking',
      })
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        type: 'emergency',
        status: booking.status,
        priority: booking.priority,
        ticketId: 'BK-' + booking.id.slice(0, 8).toUpperCase(),
        createdAt: booking.createdAt,
      },
    })
  } catch (error) {
    console.error('POST /api/bookings/emergency error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
