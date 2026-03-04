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
import ReferralProfileTab from './ReferralProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'referralActivity', label: 'Referral Activity', description: 'When someone uses your referral code' },
  { key: 'commissionPayments', label: 'Commission Payments', description: 'Notifications about commission payouts' },
  { key: 'performanceReports', label: 'Performance Reports', description: 'Weekly referral performance summaries' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
]

export default function ReferralPartnerSettingsPage() {
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
    { id: 'profile', label: 'Profile', icon: FaUser, component: <ReferralProfileTab /> },
    { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
    { id: 'billing', label: 'Billing', icon: FaCreditCard, component: <BillingSettingsTab userId={userId} /> },
    { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ referralActivity: true, commissionPayments: true, performanceReports: true, emailNotifications: true }} /> },
  ]

  return <SettingsLayout tabs={tabs} />
}
