'use client'

import { createDashboardLayout } from '@/lib/dashboard/createDashboardLayout'
import { SUPER_ADMIN_SIDEBAR_ITEMS, getActiveSectionFromPath } from './sidebar-config'

export default createDashboardLayout({
  userSubtitle: 'Regional Admin',
  sidebarItems: SUPER_ADMIN_SIDEBAR_ITEMS,
  getActiveSectionFromPath,
  settingsHref: '/super-admin/settings',
})
