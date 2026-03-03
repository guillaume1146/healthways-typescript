'use client'

import { FaUser, FaShieldAlt, FaBell } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import AdminProfileTab from './AdminProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'newRegistrations', label: 'New User Registrations', description: 'Get notified when new users sign up' },
  { key: 'failedLogins', label: 'Failed Login Attempts', description: 'Alerts for suspicious login activity' },
  { key: 'systemErrors', label: 'System Errors', description: 'Critical system error notifications' },
  { key: 'paymentFailures', label: 'Payment Failures', description: 'Notifications about failed payments' },
  { key: 'verificationRequests', label: 'Verification Requests', description: 'New account verification requests' },
]

const tabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', icon: FaUser, component: <AdminProfileTab /> },
  { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
  { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ newRegistrations: true, failedLogins: true, systemErrors: true, paymentFailures: true, verificationRequests: true }} /> },
]

export default function AdminSettingsPage() {
  return <SettingsLayout tabs={tabs} />
}
