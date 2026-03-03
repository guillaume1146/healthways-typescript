'use client'

import { FaUser, FaShieldAlt, FaBell } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import CorporateProfileTab from './CorporateProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'employeeHealth', label: 'Employee Health Updates', description: 'Aggregate health trends for your workforce' },
  { key: 'billingAlerts', label: 'Billing Alerts', description: 'Invoice and payment reminders' },
  { key: 'programUpdates', label: 'Wellness Program Updates', description: 'Updates on corporate wellness initiatives' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
]

const tabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', icon: FaUser, component: <CorporateProfileTab /> },
  { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
  { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ employeeHealth: true, billingAlerts: true, programUpdates: true, emailNotifications: true }} /> },
]

export default function CorporateSettingsPage() {
  return <SettingsLayout tabs={tabs} />
}
