'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { DashboardLayout, DashboardLoadingState, DashboardErrorState } from '@/components/dashboard'
import { SUPER_ADMIN_SIDEBAR_ITEMS, getActiveSectionFromPath } from './sidebar-config'

export default function SuperAdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<{ firstName: string; lastName: string; userType: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        setUserData(JSON.parse(stored))
      } else {
        setError('Not authenticated')
        router.push('/login')
      }
    } catch {
      setError('Failed to load user data')
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

  return (
    <DashboardLayout
      userName={`${userData.firstName} ${userData.lastName}`}
      userSubtitle="Regional Admin"
      sidebarItems={SUPER_ADMIN_SIDEBAR_ITEMS}
      activeSectionId={getActiveSectionFromPath(pathname)}
      notificationCount={0}
      settingsHref="/super-admin/settings"
      onLogout={handleLogout}
    >
      {children}
    </DashboardLayout>
  )
}
