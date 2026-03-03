'use client'

import { useSearchParams } from 'next/navigation'
import { usePatientData } from '../context'
import { ChatView } from '@/components/chat'

export default function PatientChatPage() {
  const patientData = usePatientData()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get('conversationId')

  return (
    <ChatView
      currentUser={{
        id: patientData.id,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        userType: patientData.userType || 'PATIENT',
      }}
      initialConversationId={conversationId}
    />
  )
}
