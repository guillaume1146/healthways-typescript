'use client'

import { usePatientData } from '../context'
import VideoConsultation from '@/components/video/VideoConsultation'

export default function VideoPage() {
  const patient = usePatientData()
  return (
    <VideoConsultation
      currentUser={{
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        userType: 'patient',
        upcomingAppointments: patient.upcomingAppointments,
      }}
    />
  )
}
