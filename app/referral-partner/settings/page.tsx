'use client'

import { FaUser, FaShieldAlt, FaCreditCard, FaBell } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import PaymentMethodForm from '@/components/shared/PaymentMethodForm'
import ReferralProfileTab from './ReferralProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'referralActivity', label: 'Referral Activity', description: 'When someone uses your referral code' },
  { key: 'commissionPayments', label: 'Commission Payments', description: 'Notifications about commission payouts' },
  { key: 'performanceReports', label: 'Performance Reports', description: 'Weekly referral performance summaries' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
]

const tabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', icon: FaUser, component: <ReferralProfileTab /> },
  { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
  { id: 'payment', label: 'Payment Methods', icon: FaCreditCard, component: <PaymentMethodForm methods={[]} /> },
  { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ referralActivity: true, commissionPayments: true, performanceReports: true, emailNotifications: true }} /> },
]

export default function ReferralPartnerSettingsPage() {
  return <SettingsLayout tabs={tabs} />
}
