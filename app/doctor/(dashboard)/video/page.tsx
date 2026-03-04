'use client'

import { useSearchParams } from 'next/navigation'
import { useDoctorData } from '../context'
import dynamic from 'next/dynamic'

const VideoCallRoomsList = dynamic(() => import('@/components/video/VideoCallRoomsList'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  ),
})

export default function VideoPage() {
  const user = useDoctorData()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')

  return (
    <VideoCallRoomsList
      currentUser={{
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: 'doctor',
      }}
      initialRoomId={roomId}
    />
  )
}
