'use client'

import { useDoctorData } from '../context'
import VideoConsultation from '@/components/video/VideoConsultation'

export default function VideoPage() {
  const doctor = useDoctorData()
  return (
    <VideoConsultation
      currentUser={{
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        userType: 'doctor',
        upcomingAppointments: doctor.upcomingAppointments,
      }}
    />
  )
}
