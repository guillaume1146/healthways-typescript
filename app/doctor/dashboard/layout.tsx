'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { DashboardLayout, DashboardLoadingState, DashboardErrorState } from '@/components/dashboard'
import { DOCTOR_SIDEBAR_ITEMS, getActiveSectionFromPath } from './sidebar-config'
import { DoctorDashboardProvider, DoctorUser } from './context'

export default function DoctorDashboardLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<DoctorUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.userType === 'doctor') {
          setUserData({
            id: parsed.id,
            firstName: parsed.firstName,
            lastName: parsed.lastName,
            email: parsed.email,
            profileImage: parsed.profileImage || null,
            userType: parsed.userType,
          })
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
  if (error || !userData) return <DashboardErrorState message={error} />

  const activeSectionId = getActiveSectionFromPath(pathname)

  return (
    <DoctorDashboardProvider userData={userData}>
      <DashboardLayout
        userName={`Dr. ${userData.firstName} ${userData.lastName}`}
        userSubtitle="Doctor"
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
