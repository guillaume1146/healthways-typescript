'use client'

import { useSearchParams } from 'next/navigation'
import { useDashboardUser } from '@/hooks/useDashboardUser'
import { ChatView } from '@/components/chat'

export default function PharmacistMessagesPage() {
  const user = useDashboardUser()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get('conversationId')

  if (!user) return <div className="flex items-center justify-center h-full"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>

  return <ChatView currentUser={user} initialConversationId={conversationId} />
}
