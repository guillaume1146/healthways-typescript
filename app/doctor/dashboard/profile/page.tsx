'use client'

import { useDoctorData } from '../context'
import DoctorProfile from '../components/DoctorProfile'

export default function ProfilePage() {
  const doctorData = useDoctorData()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <DoctorProfile doctorData={doctorData as any} setDoctorData={() => {}} />
}
