'use client'

import { FaUser, FaShieldAlt, FaCalendarAlt, FaCreditCard, FaBell, FaFileAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
  DocumentsTab,
  AvailabilitySettingsTab,
  BillingSettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import NannyProfileTab from './NannyProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'bookings', label: 'Booking Notifications', description: 'New booking requests and confirmations' },
  { key: 'familyMessages', label: 'Family Messages', description: 'Messages from families you work with' },
  { key: 'scheduleChanges', label: 'Schedule Changes', description: 'Notifications about schedule updates' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
  { key: 'promotions', label: 'Promotions & Tips', description: 'Childcare tips and platform offers' },
]

const NANNY_DOCUMENTS = [
  { key: 'nationalId', title: 'National ID / Passport', description: 'Government-issued identification', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'backgroundCheck', title: 'Background Check', description: 'Police clearance or background check certificate', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'firstAid', title: 'First Aid Certificate', description: 'CPR and first aid certification', required: false, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'education', title: 'Education Certificate', description: 'Early childhood education or related qualification', required: false, acceptedFormats: '.pdf, .jpg, .png' },
]

export default function NannySettingsPage() {
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
    { id: 'profile', label: 'Profile', icon: FaUser, component: <NannyProfileTab /> },
    { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
    { id: 'availability', label: 'Availability', icon: FaCalendarAlt, component: userId ? <AvailabilitySettingsTab userId={userId} /> : <div className="text-gray-500 py-8 text-center">Loading...</div> },
    { id: 'billing', label: 'Billing', icon: FaCreditCard, component: <BillingSettingsTab userId={userId} /> },
    { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ bookings: true, familyMessages: true, scheduleChanges: true, emailNotifications: true, promotions: false }} /> },
    { id: 'documents', label: 'Documents', icon: FaFileAlt, component: <DocumentsTab documents={NANNY_DOCUMENTS} /> },
  ]

  return <SettingsLayout tabs={tabs} />
}
