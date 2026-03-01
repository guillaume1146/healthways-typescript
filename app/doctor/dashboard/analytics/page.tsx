'use client'

import { useDoctorData } from '../context'
import DoctorStatistics from '../components/DoctorStatistics'

export default function AnalyticsPage() {
  const doctorData = useDoctorData()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <DoctorStatistics doctorData={doctorData as any} />
}
