'use client'

import { createDashboardLayout } from '@/lib/dashboard/createDashboardLayout'
import { DOCTOR_SIDEBAR_ITEMS, getActiveSectionFromPath } from './sidebar-config'
import { DoctorDashboardProvider } from './context'

export default createDashboardLayout({
  userSubtitle: 'Doctor',
  namePrefix: 'Dr.',
  sidebarItems: DOCTOR_SIDEBAR_ITEMS,
  getActiveSectionFromPath,
  settingsHref: '/doctor/settings',
  ContextProvider: DoctorDashboardProvider,
})
