import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const userId = auth.sub

  try {
    // Get user profile info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, userType: true, firstName: true, lastName: true }
    })
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    // Collect video rooms from multiple sources based on user type
    interface RoomEntry {
      id: string
      scheduledAt: Date
      status: string
      reason: string | null
      roomId: string | null
      duration: number
      participantName: string
      participantImage: string | null
      participantProfileId?: string | null
      type: string
      endedAt?: Date | null
    }
    let appointments: RoomEntry[] = []

    if (user.userType === 'PATIENT') {
      const patientProfile = await prisma.patientProfile.findUnique({ where: { userId }, select: { id: true } })
      if (patientProfile) {
        // Get appointments with roomId (doctor video consultations)
        const doctorApts = await prisma.appointment.findMany({
          where: { patientId: patientProfile.id, type: 'video', roomId: { not: null } },
          orderBy: { scheduledAt: 'desc' },
          select: {
            id: true, scheduledAt: true, status: true, reason: true, roomId: true, duration: true,
            doctor: { select: { user: { select: { firstName: true, lastName: true, profileImage: true } } } }
          }
        })
        appointments = doctorApts.map(a => ({
          id: a.id,
          roomId: a.roomId,
          scheduledAt: a.scheduledAt,
          status: a.status,
          reason: a.reason,
          duration: a.duration,
          participantName: a.doctor?.user ? `Dr. ${a.doctor.user.firstName} ${a.doctor.user.lastName}` : 'Doctor',
          participantImage: a.doctor?.user?.profileImage || null,
          type: 'doctor_consultation',
        }))

        // Add nurse video bookings
        const nurseBookings = await prisma.nurseBooking.findMany({
          where: { patientId: patientProfile.id, type: 'video' },
          orderBy: { scheduledAt: 'desc' },
          select: {
            id: true, scheduledAt: true, status: true, reason: true, duration: true,
            nurse: { select: { user: { select: { firstName: true, lastName: true, profileImage: true } } } }
          }
        })
        appointments.push(...nurseBookings.map(b => ({
          id: b.id,
          roomId: `nurse-${b.id}`,
          scheduledAt: b.scheduledAt,
          status: b.status,
          reason: b.reason,
          duration: b.duration,
          participantName: b.nurse?.user ? `${b.nurse.user.firstName} ${b.nurse.user.lastName}` : 'Nurse',
          participantImage: b.nurse?.user?.profileImage || null,
          type: 'nurse_consultation',
        })))

        // Add nanny video bookings
        const nannyBookings = await prisma.childcareBooking.findMany({
          where: { patientId: patientProfile.id, type: 'video' },
          orderBy: { scheduledAt: 'desc' },
          select: {
            id: true, scheduledAt: true, status: true, reason: true, duration: true,
            nanny: { select: { user: { select: { firstName: true, lastName: true, profileImage: true } } } }
          }
        })
        appointments.push(...nannyBookings.map(b => ({
          id: b.id,
          roomId: `nanny-${b.id}`,
          scheduledAt: b.scheduledAt,
          status: b.status,
          reason: b.reason,
          duration: b.duration,
          participantName: b.nanny?.user ? `${b.nanny.user.firstName} ${b.nanny.user.lastName}` : 'Nanny',
          participantImage: b.nanny?.user?.profileImage || null,
          type: 'nanny_consultation',
        })))
      }
    } else if (user.userType === 'DOCTOR') {
      const doctorProfile = await prisma.doctorProfile.findUnique({ where: { userId }, select: { id: true } })
      if (doctorProfile) {
        const doctorApts = await prisma.appointment.findMany({
          where: { doctorId: doctorProfile.id, type: 'video', roomId: { not: null } },
          orderBy: { scheduledAt: 'desc' },
          select: {
            id: true, scheduledAt: true, status: true, reason: true, roomId: true, duration: true,
            patientId: true,
            patient: { select: { user: { select: { firstName: true, lastName: true, profileImage: true } } } }
          }
        })
        appointments = doctorApts.map(a => ({
          id: a.id,
          roomId: a.roomId,
          scheduledAt: a.scheduledAt,
          status: a.status,
          reason: a.reason,
          duration: a.duration,
          participantName: a.patient?.user ? `${a.patient.user.firstName} ${a.patient.user.lastName}` : 'Patient',
          participantImage: a.patient?.user?.profileImage || null,
          participantProfileId: a.patientId,
          type: 'doctor_consultation',
        }))
      }
    } else if (user.userType === 'NURSE') {
      const nurseProfile = await prisma.nurseProfile.findUnique({ where: { userId }, select: { id: true } })
      if (nurseProfile) {
        const nurseBookings = await prisma.nurseBooking.findMany({
          where: { nurseId: nurseProfile.id, type: 'video' },
          orderBy: { scheduledAt: 'desc' },
          select: {
            id: true, scheduledAt: true, status: true, reason: true, duration: true,
            patient: { select: { user: { select: { firstName: true, lastName: true, profileImage: true } } } }
          }
        })
        appointments = nurseBookings.map(b => ({
          id: b.id,
          roomId: `nurse-${b.id}`,
          scheduledAt: b.scheduledAt,
          status: b.status,
          reason: b.reason,
          duration: b.duration,
          participantName: b.patient?.user ? `${b.patient.user.firstName} ${b.patient.user.lastName}` : 'Patient',
          participantImage: b.patient?.user?.profileImage || null,
          type: 'nurse_consultation',
        }))
      }
    } else if (user.userType === 'NANNY') {
      const nannyProfile = await prisma.nannyProfile.findUnique({ where: { userId }, select: { id: true } })
      if (nannyProfile) {
        const nannyBookings = await prisma.childcareBooking.findMany({
          where: { nannyId: nannyProfile.id, type: 'video' },
          orderBy: { scheduledAt: 'desc' },
          select: {
            id: true, scheduledAt: true, status: true, reason: true, duration: true,
            patient: { select: { user: { select: { firstName: true, lastName: true, profileImage: true } } } }
          }
        })
        appointments = nannyBookings.map(b => ({
          id: b.id,
          roomId: `nanny-${b.id}`,
          scheduledAt: b.scheduledAt,
          status: b.status,
          reason: b.reason,
          duration: b.duration,
          participantName: b.patient?.user ? `${b.patient.user.firstName} ${b.patient.user.lastName}` : 'Parent',
          participantImage: b.patient?.user?.profileImage || null,
          type: 'nanny_consultation',
        }))
      }
    }

    // Also get VideoRoom sessions the user has participated in
    const videoSessions = await prisma.videoCallSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 20,
      select: {
        id: true, startedAt: true, endedAt: true, status: true, duration: true,
        room: { select: { roomCode: true, creatorId: true, status: true } }
      }
    })

    // Sort all rooms by scheduledAt/startedAt descending
    const allRooms = [
      ...appointments,
      ...videoSessions.map(s => ({
        id: s.id,
        roomId: s.room.roomCode,
        scheduledAt: s.startedAt,
        endedAt: s.endedAt,
        status: s.status === 'active' ? 'upcoming' : s.status,
        reason: 'Video Session',
        duration: s.duration,
        participantName: 'Participant',
        participantImage: null,
        type: 'direct_session',
      }))
    ]

    // Deduplicate by roomId
    const seen = new Set<string>()
    const dedupedRooms = allRooms.filter(r => {
      if (!r.roomId || seen.has(r.roomId)) return false
      seen.add(r.roomId)
      return true
    })

    // Sort by date descending
    dedupedRooms.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())

    return NextResponse.json({
      success: true,
      data: dedupedRooms,
    })
  } catch (error) {
    console.error('Video rooms list error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
