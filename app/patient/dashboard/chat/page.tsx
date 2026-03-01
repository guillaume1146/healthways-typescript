'use client'

import { usePatientData } from '../context'
import { ChatView } from '@/components/chat'

export default function PatientChatPage() {
  const patientData = usePatientData()

  return (
    <ChatView
      currentUser={{
        id: patientData.id,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        userType: patientData.userType || 'PATIENT',
      }}
    />
  )
}
