'use client'

import { useDoctorData } from '../context'
import { ChatView } from '@/components/chat'

export default function DoctorMessagesPage() {
  const doctorData = useDoctorData()

  return (
    <ChatView
      currentUser={{
        id: doctorData.id,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        userType: 'DOCTOR',
      }}
    />
  )
}
