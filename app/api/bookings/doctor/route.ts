import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { createNotification } from '@/lib/notifications'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { doctorId, consultationType, scheduledDate, scheduledTime, reason, notes, duration } = body as {
      doctorId: string
      consultationType: 'in_person' | 'home_visit' | 'video'
      scheduledDate: string
      scheduledTime: string
      reason: string
      notes?: string
      duration?: number
    }

    // Validate required fields
    if (!doctorId || typeof doctorId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Doctor ID is required' },
        { status: 400 }
      )
    }

    if (!consultationType || !['in_person', 'home_visit', 'video'].includes(consultationType)) {
      return NextResponse.json(
        { success: false, message: 'Consultation type must be in_person, home_visit, or video' },
        { status: 400 }
      )
    }

    if (!scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { success: false, message: 'Scheduled date and time are required' },
        { status: 400 }
      )
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Reason is required' },
        { status: 400 }
      )
    }

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

    // Look up doctor profile (try profile ID first, then user ID)
    let doctorProfile = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      select: { id: true, userId: true, specialty: true, location: true },
    })
    if (!doctorProfile) {
      doctorProfile = await prisma.doctorProfile.findFirst({
        where: { userId: doctorId },
        select: { id: true, userId: true, specialty: true, location: true },
      })
    }

    if (!doctorProfile) {
      return NextResponse.json(
        { success: false, message: 'Doctor profile not found' },
        { status: 404 }
      )
    }

    // Determine location
    const location = consultationType === 'in_person'
      ? doctorProfile.location
      : consultationType === 'home_visit'
        ? 'Patient Home'
        : null

    // Generate roomId for video consultations
    const roomId = consultationType === 'video' ? randomUUID() : null

    // Combine date and time
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`)

    // Create booking with pending status (no wallet debit — happens on provider approval)
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patientProfile.id,
        doctorId: doctorProfile.id,
        scheduledAt,
        type: consultationType,
        status: 'pending',
        specialty: doctorProfile.specialty[0] || 'General',
        reason: reason.trim(),
        duration: duration || 30,
        location,
        roomId,
        notes: notes?.trim() || null,
      },
      select: {
        id: true,
        type: true,
        scheduledAt: true,
        status: true,
      },
    })

    // Get patient name for notification
    const patientUser = await prisma.user.findUnique({
      where: { id: auth.sub },
      select: { firstName: true, lastName: true },
    })

    await createNotification({
      userId: doctorProfile.userId,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `${patientUser?.firstName} ${patientUser?.lastName} has requested a ${consultationType.replace('_', ' ')} consultation on ${scheduledDate} at ${scheduledTime}`,
      referenceId: appointment.id,
      referenceType: 'appointment',
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: appointment.id,
        type: appointment.type,
        scheduledAt: appointment.scheduledAt,
        status: appointment.status,
        ticketId: 'BK-' + appointment.id.slice(0, 8).toUpperCase(),
      },
    })
  } catch (error) {
    console.error('POST /api/bookings/doctor error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
