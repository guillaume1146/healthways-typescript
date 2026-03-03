'use client'

import { FaUser, FaShieldAlt, FaBell } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import SuperAdminProfileTab from './SuperAdminProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'systemHealth', label: 'System Health Alerts', description: 'Platform uptime and performance alerts' },
  { key: 'securityIncidents', label: 'Security Incidents', description: 'Suspicious activity and breach notifications' },
  { key: 'newRegions', label: 'New Region Requests', description: 'Requests to expand to new regions' },
  { key: 'adminActions', label: 'Admin Actions', description: 'Notifications for admin-level actions across the platform' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
]

const tabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', icon: FaUser, component: <SuperAdminProfileTab /> },
  { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
  { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ systemHealth: true, securityIncidents: true, newRegions: true, adminActions: true, emailNotifications: true }} /> },
]

export default function SuperAdminSettingsPage() {
  return <SettingsLayout tabs={tabs} />
}
