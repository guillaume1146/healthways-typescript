'use client'

import { useSearchParams } from 'next/navigation'
import { useDoctorData } from '../context'
import { ChatView } from '@/components/chat'

export default function DoctorMessagesPage() {
  const doctorData = useDoctorData()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get('conversationId')

  return (
    <ChatView
      currentUser={{
        id: doctorData.id,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        userType: 'DOCTOR',
      }}
      initialConversationId={conversationId}
    />
  )
}
