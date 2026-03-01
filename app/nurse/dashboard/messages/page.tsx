'use client'

import { useState, useEffect } from 'react'
import { ChatView } from '@/components/chat'

export default function NurseMessagesPage() {
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string; userType: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('healthwyz_user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser({ id: parsed.id, firstName: parsed.firstName, lastName: parsed.lastName, userType: parsed.userType })
    }
  }, [])

  if (!user) return <div className="flex items-center justify-center h-full"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>

  return <ChatView currentUser={user} />
}
