'use client'

import { useDoctorData } from '../context'
import PrescriptionSystem from '../components/PrescriptionSystem'

export default function PrescriptionsPage() {
  const doctorData = useDoctorData()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PrescriptionSystem doctorData={doctorData as any} />
}
