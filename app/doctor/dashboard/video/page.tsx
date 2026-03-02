'use client'

import { useDoctorData } from '../context'
import VideoCallRoomsList from '@/components/video/VideoCallRoomsList'

export default function VideoPage() {
  const user = useDoctorData()
  return (
    <VideoCallRoomsList
      currentUser={{
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: 'doctor',
      }}
    />
  )
}
