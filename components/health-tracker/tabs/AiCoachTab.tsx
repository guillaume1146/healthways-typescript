'use client'

import BotHealthAssistant from '@/app/patient/(dashboard)/components/BotHealthAssistant'

interface AiCoachTabProps {
  patientData: any
}

export default function AiCoachTab({ patientData }: AiCoachTabProps) {
  return (
    <div className="h-full">
      <BotHealthAssistant patientData={patientData} />
    </div>
  )
}
