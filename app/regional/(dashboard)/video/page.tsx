'use client'

import dynamic from 'next/dynamic'
import { useUser } from '@/hooks/useUser'

const VideoConsultation = dynamic(() => import('@/components/video/VideoConsultation'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  ),
})

export default function VideoPage() {
  const { user, loading } = useUser()

  if (loading || !user) return <div className="flex items-center justify-center h-full"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>

  return <VideoConsultation currentUser={user} />
}
