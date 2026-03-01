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
    const { nannyId, consultationType, scheduledDate, scheduledTime, reason, notes, duration, children } = body as {
      nannyId: string
      consultationType: 'in_person' | 'home_visit' | 'video'
      scheduledDate: string
      scheduledTime: string
      reason?: string
      notes?: string
      duration?: number
      children?: string[]
    }

    // Validate required fields
    if (!nannyId || typeof nannyId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Nanny ID is required' },
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

    // Look up nanny profile (try profile ID first, then user ID)
    let nannyProfile = await prisma.nannyProfile.findUnique({
      where: { id: nannyId },
      select: { id: true, userId: true },
    })
    if (!nannyProfile) {
      nannyProfile = await prisma.nannyProfile.findFirst({
        where: { userId: nannyId },
        select: { id: true, userId: true },
      })
    }

    if (!nannyProfile) {
      return NextResponse.json(
        { success: false, message: 'Nanny profile not found' },
        { status: 404 }
      )
    }

    // Combine date and time
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`)

    // Create booking with pending status (no wallet debit — happens on provider approval)
    const booking = await prisma.childcareBooking.create({
      data: {
        patientId: patientProfile.id,
        nannyId: nannyProfile.id,
        scheduledAt,
        duration: duration || 120,
        type: consultationType,
        children: children || [],
        specialInstructions: notes?.trim() || null,
        reason: reason?.trim() || null,
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
      userId: nannyProfile.userId,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `${patientUser?.firstName} ${patientUser?.lastName} has requested a ${consultationType.replace('_', ' ')} childcare session on ${scheduledDate} at ${scheduledTime}`,
      referenceId: booking.id,
      referenceType: 'childcare_booking',
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
    console.error('POST /api/bookings/nanny error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
