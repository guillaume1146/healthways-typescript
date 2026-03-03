'use client'

import { FaUser, FaShieldAlt, FaCreditCard, FaBell } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import PaymentMethodForm from '@/components/shared/PaymentMethodForm'
import InsuranceProfileTab from './InsuranceProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'policyExpiry', label: 'Policy Expiry Alerts', description: 'Get notified when policies are about to expire' },
  { key: 'claimUpdates', label: 'Claim Status Updates', description: 'Receive updates on claim processing status' },
  { key: 'paymentReminders', label: 'Payment Reminders', description: 'Reminders for premium payments and commissions' },
  { key: 'commissionAlerts', label: 'Commission Notifications', description: 'Notifications about commission payments and earnings' },
  { key: 'systemUpdates', label: 'System Updates', description: 'Platform updates and maintenance notices' },
]

const tabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', icon: FaUser, component: <InsuranceProfileTab /> },
  { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
  { id: 'payment', label: 'Payment Methods', icon: FaCreditCard, component: <PaymentMethodForm methods={[]} /> },
  { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ policyExpiry: true, claimUpdates: true, paymentReminders: true, commissionAlerts: true, systemUpdates: false }} /> },
]

export default function InsuranceSettingsPage() {
  return <SettingsLayout tabs={tabs} />
}
