'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaShieldAlt, FaCreditCard, FaBell } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
  BillingSettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import InsuranceProfileTab from './InsuranceProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'policyExpiry', label: 'Policy Expiry Alerts', description: 'Get notified when policies are about to expire' },
  { key: 'claimUpdates', label: 'Claim Status Updates', description: 'Receive updates on claim processing status' },
  { key: 'paymentReminders', label: 'Payment Reminders', description: 'Reminders for premium payments and commissions' },
  { key: 'commissionAlerts', label: 'Commission Notifications', description: 'Notifications about commission payments and earnings' },
  { key: 'systemUpdates', label: 'System Updates', description: 'Platform updates and maintenance notices' },
]

export default function InsuranceSettingsPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        const user = JSON.parse(stored)
        setUserId(user.id)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const tabs: SettingsTab[] = [
    { id: 'profile', label: 'Profile', icon: FaUser, component: <InsuranceProfileTab /> },
    { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
    { id: 'billing', label: 'Billing', icon: FaCreditCard, component: <BillingSettingsTab userId={userId} /> },
    { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ policyExpiry: true, claimUpdates: true, paymentReminders: true, commissionAlerts: true, systemUpdates: false }} /> },
  ]

  return <SettingsLayout tabs={tabs} />
}
