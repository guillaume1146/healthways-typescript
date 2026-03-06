import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { rateLimitPublic } from '@/lib/rate-limit'

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

  const { id: userId } = await params

  if (auth.userType === 'patient' && auth.sub !== userId) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const profile = await prisma.patientProfile.findUnique({
      where: { userId },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: true, data: [] })
    }

    const patientId = profile.id

    // Fetch all booking types in parallel
    const [appointments, nurseBookings, childcareBookings, labTestBookings, emergencyBookings] =
      await Promise.all([
        prisma.appointment.findMany({
          where: { patientId },
          select: {
            id: true,
            scheduledAt: true,
            type: true,
            status: true,
            specialty: true,
            reason: true,
            doctor: {
              select: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: { scheduledAt: 'desc' },
        }),
        prisma.nurseBooking.findMany({
          where: { patientId },
          select: {
            id: true,
            scheduledAt: true,
            type: true,
            status: true,
            reason: true,
            nurse: {
              select: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: { scheduledAt: 'desc' },
        }),
        prisma.childcareBooking.findMany({
          where: { patientId },
          select: {
            id: true,
            scheduledAt: true,
            type: true,
            status: true,
            reason: true,
            nanny: {
              select: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: { scheduledAt: 'desc' },
        }),
        prisma.labTestBooking.findMany({
          where: { patientId },
          select: {
            id: true,
            scheduledAt: true,
            testName: true,
            status: true,
            resultFindings: true,
            resultNotes: true,
            resultDate: true,
            labTech: {
              select: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: { scheduledAt: 'desc' },
        }),
        prisma.emergencyBooking.findMany({
          where: { patientId },
          select: {
            id: true,
            createdAt: true,
            emergencyType: true,
            status: true,
            location: true,
            priority: true,
            responder: {
              select: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
      ])

    // Normalize into a unified format
    const data = [
      ...appointments.map((a) => ({
        id: a.id,
        type: 'doctor' as const,
        providerName: `Dr. ${a.doctor.user.firstName} ${a.doctor.user.lastName}`,
        scheduledAt: a.scheduledAt.toISOString(),
        status: a.status,
        consultationType: a.type,
        detail: a.specialty,
      })),
      ...nurseBookings.map((b) => ({
        id: b.id,
        type: 'nurse' as const,
        providerName: `${b.nurse.user.firstName} ${b.nurse.user.lastName}`,
        scheduledAt: b.scheduledAt.toISOString(),
        status: b.status,
        consultationType: b.type,
        detail: b.reason || undefined,
      })),
      ...childcareBookings.map((b) => ({
        id: b.id,
        type: 'nanny' as const,
        providerName: `${b.nanny.user.firstName} ${b.nanny.user.lastName}`,
        scheduledAt: b.scheduledAt.toISOString(),
        status: b.status,
        consultationType: b.type,
        detail: b.reason || undefined,
      })),
      ...labTestBookings.map((b) => ({
        id: b.id,
        type: 'lab-test' as const,
        providerName: b.labTech
          ? `${b.labTech.user.firstName} ${b.labTech.user.lastName}`
          : 'Lab',
        scheduledAt: b.scheduledAt.toISOString(),
        status: b.status,
        testName: b.testName,
        detail: b.testName,
        ...(b.resultFindings ? { resultFindings: b.resultFindings } : {}),
        ...(b.resultNotes ? { resultNotes: b.resultNotes } : {}),
        ...(b.resultDate ? { resultDate: b.resultDate.toISOString() } : {}),
      })),
      ...emergencyBookings.map((b) => ({
        id: b.id,
        type: 'emergency' as const,
        providerName: b.responder
          ? `${b.responder.user.firstName} ${b.responder.user.lastName}`
          : 'Emergency Service',
        scheduledAt: b.createdAt.toISOString(),
        status: b.status,
        detail: b.emergencyType,
      })),
    ]

    // Sort by date descending
    data.sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    )

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/patients/[id]/bookings error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
