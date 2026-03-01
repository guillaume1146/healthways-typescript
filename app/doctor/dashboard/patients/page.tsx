'use client'

import { useDoctorData } from '../context'
import PatientManagement from '../components/PatientManagement'

export default function PatientsPage() {
  const doctorData = useDoctorData()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PatientManagement doctorData={doctorData as any} />
}
