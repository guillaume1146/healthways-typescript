'use client'

import { usePatientData } from '../context'
import BotHealthAssistant from '../components/BotHealthAssistant'

export default function AiAssistantPage() {
  const patientData = usePatientData()
  return <BotHealthAssistant patientData={patientData} />
}
