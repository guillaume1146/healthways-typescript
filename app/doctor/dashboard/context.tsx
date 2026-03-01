'use client'

import { createContext, useContext } from 'react'
import type { Doctor } from '@/lib/data/doctors'

const DoctorDashboardContext = createContext<Doctor | null>(null)

export function DoctorDashboardProvider({
  userData,
  children,
}: {
  userData: Doctor
  children: React.ReactNode
}) {
  return (
    <DoctorDashboardContext.Provider value={userData}>
      {children}
    </DoctorDashboardContext.Provider>
  )
}

export function useDoctorData(): Doctor {
  const ctx = useContext(DoctorDashboardContext)
  if (!ctx) throw new Error('useDoctorData must be used within DoctorDashboardProvider')
  return ctx
}
