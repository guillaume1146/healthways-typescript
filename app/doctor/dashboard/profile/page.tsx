'use client'

import { useDoctorData } from '../context'
import DoctorProfile from '../components/DoctorProfile'

export default function ProfilePage() {
  const user = useDoctorData()
  return (
    <DoctorProfile
      doctorData={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }}
      setDoctorData={() => {}}
    />
  )
}
