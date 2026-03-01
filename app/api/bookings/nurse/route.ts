import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { createNotification } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { nurseId, consultationType, scheduledDate, scheduledTime, reason, notes, duration } = body as {
      nurseId: string
      consultationType: 'in_person' | 'home_visit' | 'video'
      scheduledDate: string
      scheduledTime: string
      reason: string
      notes?: string
      duration?: number
    }

    // Validate required fields
    if (!nurseId || typeof nurseId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Nurse ID is required' },
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

    // Look up nurse profile (try profile ID first, then user ID)
    let nurseProfile = await prisma.nurseProfile.findUnique({
      where: { id: nurseId },
      select: { id: true, userId: true },
    })
    if (!nurseProfile) {
      nurseProfile = await prisma.nurseProfile.findFirst({
        where: { userId: nurseId },
        select: { id: true, userId: true },
      })
    }

    if (!nurseProfile) {
      return NextResponse.json(
        { success: false, message: 'Nurse profile not found' },
        { status: 404 }
      )
    }

    // Combine date and time
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`)

    // Create booking with pending status (no wallet debit — happens on provider approval)
    const booking = await prisma.nurseBooking.create({
      data: {
        patientId: patientProfile.id,
        nurseId: nurseProfile.id,
        scheduledAt,
        duration: duration || 60,
        type: consultationType,
        reason: reason.trim(),
        notes: notes?.trim() || null,
        status: 'pending',
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
      userId: nurseProfile.userId,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `${patientUser?.firstName} ${patientUser?.lastName} has requested a ${consultationType.replace('_', ' ')} nurse visit on ${scheduledDate} at ${scheduledTime}`,
      referenceId: booking.id,
      referenceType: 'nurse_booking',
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        type: booking.type,
        scheduledAt: booking.scheduledAt,
        status: booking.status,
        ticketId: 'BK-' + booking.id.slice(0, 8).toUpperCase(),
      },
    })
  } catch (error) {
    console.error('POST /api/bookings/nurse error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
