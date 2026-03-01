'use client'

import { useRouter } from 'next/navigation'
import { useDoctorData } from '../context'
import AppointmentScheduler from '../components/AppointmentScheduler'

export default function AppointmentsPage() {
  const doctorData = useDoctorData()
  const router = useRouter()
  return (
    <AppointmentScheduler
      doctorData={{
        upcomingAppointments: doctorData.upcomingAppointments ?? [],
        pastAppointments: doctorData.pastAppointments ?? [],
        todaySchedule: doctorData.todaySchedule ?? { date: '', slots: [], totalAppointments: 0, availableSlots: 0 },
        weeklySchedule: doctorData.weeklySchedule ?? [],
        nextAvailable: doctorData?.nextAvailable ?? '',
        patients: doctorData.patients ?? { current: [], past: [] },
        homeVisitAvailable: doctorData.homeVisitAvailable,
      }}
      onVideoCall={() => router.push('/doctor/dashboard/video')}
    />
  )
}
