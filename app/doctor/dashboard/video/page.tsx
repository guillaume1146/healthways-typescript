'use client'

import { useState, useEffect } from 'react'
import { useDoctorData } from '../context'
import VideoConsultation from '@/components/video/VideoConsultation'

export default function VideoPage() {
  const user = useDoctorData()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/doctors/${user.id}/appointments?status=upcoming`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success || json.data) {
          setAppointments(
            (json.data || [])
              .filter((apt: any) => apt.type === 'video' && apt.roomId)
              .map((apt: any) => ({
                id: apt.id,
                type: 'video' as const,
                patientName: apt.patient
                  ? `${apt.patient.user.firstName} ${apt.patient.user.lastName}`
                  : 'Patient',
                participantName: apt.patient
                  ? `${apt.patient.user.firstName} ${apt.patient.user.lastName}`
                  : 'Patient',
                date: apt.scheduledAt,
                time: new Date(apt.scheduledAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                reason: apt.reason,
                roomId: apt.roomId,
              }))
          )
        }
      })
      .catch((err) => console.error('Failed to fetch video appointments:', err))
  }, [user.id])

  return (
    <VideoConsultation
      currentUser={{
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: 'doctor',
        upcomingAppointments: appointments,
      }}
    />
  )
}
