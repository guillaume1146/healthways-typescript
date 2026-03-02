'use client'

import { usePatientData } from '../context'
import VideoCallRoomsList from '@/components/video/VideoCallRoomsList'

export default function VideoPage() {
  const patient = usePatientData()
  return (
    <VideoCallRoomsList
      currentUser={{
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        userType: 'patient',
      }}
    />
  )
}
