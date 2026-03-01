import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { createNotification } from '@/lib/notifications'

const DEFAULT_LAB_TEST_PRICE = 500

export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { labTechId: rawLabTechId, testName, scheduledDate, scheduledTime, sampleType, notes, price } = body as {
      labTechId?: string
      testName: string
      scheduledDate: string
      scheduledTime: string
      sampleType?: string
      notes?: string
      price?: number
    }

    // Validate required fields
    if (!testName || typeof testName !== 'string' || testName.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Test name is required' },
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

    // If labTechId provided, verify it exists (try profile ID first, then user ID)
    let labTechUserId: string | null = null
    let labTechId: string | null = rawLabTechId || null
    if (rawLabTechId) {
      let labTechProfile = await prisma.labTechProfile.findUnique({
        where: { id: rawLabTechId },
        select: { id: true, userId: true },
      })
      if (!labTechProfile) {
        labTechProfile = await prisma.labTechProfile.findFirst({
          where: { userId: rawLabTechId },
          select: { id: true, userId: true },
        })
      }

      if (!labTechProfile) {
        return NextResponse.json(
          { success: false, message: 'Lab technician profile not found' },
          { status: 404 }
        )
      }
      labTechUserId = labTechProfile.userId
      labTechId = labTechProfile.id
    }

    const fee = price && price > 0 ? price : DEFAULT_LAB_TEST_PRICE

    // Combine date and time
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`)

    // Create booking with pending status (no wallet debit — happens on provider approval)
    const booking = await prisma.labTestBooking.create({
      data: {
        patientId: patientProfile.id,
        labTechId: labTechId || null,
        testName: testName.trim(),
        scheduledAt,
        sampleType: sampleType?.trim() || null,
        notes: notes?.trim() || null,
        price: fee,
        status: 'pending',
      },
      select: {
        id: true,
        testName: true,
        scheduledAt: true,
        status: true,
      },
    })

    // Notify lab technician if assigned
    if (labTechUserId) {
      const patientUser = await prisma.user.findUnique({
        where: { id: auth.sub },
        select: { firstName: true, lastName: true },
      })

      await createNotification({
        userId: labTechUserId,
        type: 'booking_request',
        title: 'New Lab Test Request',
        message: `${patientUser?.firstName} ${patientUser?.lastName} has requested a ${testName.trim()} test on ${scheduledDate} at ${scheduledTime}`,
        referenceId: booking.id,
        referenceType: 'lab_test_booking',
      })
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        type: 'lab_test',
        scheduledAt: booking.scheduledAt,
        status: booking.status,
        ticketId: 'BK-' + booking.id.slice(0, 8).toUpperCase(),
      },
    })
  } catch (error) {
    console.error('POST /api/bookings/lab-test error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
