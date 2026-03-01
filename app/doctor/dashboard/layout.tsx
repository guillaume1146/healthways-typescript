'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { DashboardLayout, DashboardLoadingState, DashboardErrorState } from '@/components/dashboard'
import { DOCTOR_SIDEBAR_ITEMS, getActiveSectionFromPath } from './sidebar-config'
import { DoctorDashboardProvider } from './context'
import type { Doctor } from '@/lib/data/doctors'

export default function DoctorDashboardLayout({ children }: { children: React.ReactNode }) {
  const [doctorData, setDoctorData] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    try {
      const userData = localStorage.getItem('healthwyz_user')
      if (userData) {
        const parsed = JSON.parse(userData)
        if (parsed.userType === 'doctor') {
          setDoctorData(parsed as Doctor)
        } else {
          setError('Invalid user type')
          router.push('/login')
        }
      } else {
        setError('No user data found')
        router.push('/login')
      }
    } catch {
      setError('Failed to load doctor data')
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
  if (error || !doctorData) return <DashboardErrorState message={error} />

  const activeSectionId = getActiveSectionFromPath(pathname)

  return (
    <DoctorDashboardProvider userData={doctorData}>
      <DashboardLayout
        userName={`Dr. ${doctorData.firstName} ${doctorData.lastName}`}
        userSubtitle={`${doctorData.specialty?.join(', ') || 'Doctor'} Dashboard`}
        sidebarItems={DOCTOR_SIDEBAR_ITEMS}
        activeSectionId={activeSectionId}
        notificationCount={0}
        settingsHref="/doctor/settings"
        onLogout={handleLogout}
      >
        {children}
      </DashboardLayout>
    </DoctorDashboardProvider>
  )
}
