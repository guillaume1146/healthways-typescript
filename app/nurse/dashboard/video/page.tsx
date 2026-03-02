'use client'

import { useState, useEffect } from 'react'
import VideoCallRoomsList from '@/components/video/VideoCallRoomsList'

export default function VideoPage() {
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string; userType: string } | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser({ id: parsed.id, firstName: parsed.firstName, lastName: parsed.lastName, userType: parsed.userType })
      }
    } catch {
      // Corrupted localStorage
    }
  }, [])

  if (!user) return <div className="flex items-center justify-center h-full"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>

  return <VideoCallRoomsList currentUser={user} />
}
