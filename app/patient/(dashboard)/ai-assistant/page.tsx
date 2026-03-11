'use client'

import { usePatientData } from '../context'
import HealthTrackerTabs from '@/components/health-tracker/HealthTrackerTabs'

export default function AiAssistantPage() {
  const patientData = usePatientData()
  return <HealthTrackerTabs patientData={patientData} />
}
