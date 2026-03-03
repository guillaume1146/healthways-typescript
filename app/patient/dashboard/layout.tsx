'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { DashboardLayout, DashboardLoadingState, DashboardErrorState } from '@/components/dashboard'
import { PATIENT_SIDEBAR_ITEMS, getActiveSectionFromPath } from './sidebar-config'
import { PatientDashboardProvider } from './context'
import type { Patient } from '@/lib/data/patients'

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  const [patientData, setPatientData] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    try {
      const userData = localStorage.getItem('healthwyz_user')
      if (userData) {
        setPatientData(JSON.parse(userData) as Patient)
      } else {
        setError('No patient data found')
        router.push('/login')
      }
    } catch {
      setError('Failed to load patient data')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('healthwyz_user')
    localStorage.removeItem('healthwyz_token')
    localStorage.removeItem('healthwyz_userType')
    router.push('/login')
  }

  if (loading) return <DashboardLoadingState />
  if (error || !patientData) return <DashboardErrorState message={error} />

  const activeSectionId = getActiveSectionFromPath(pathname)

  return (
    <PatientDashboardProvider userData={patientData}>
      <DashboardLayout
        userName={`${patientData.firstName} ${patientData.lastName}`}
        userSubtitle="Patient"
        sidebarItems={PATIENT_SIDEBAR_ITEMS}
        activeSectionId={activeSectionId}
        notificationCount={0}
        settingsHref="/patient/settings"
        onLogout={handleLogout}
      >
        {children}
      </DashboardLayout>
    </PatientDashboardProvider>
  )
}
