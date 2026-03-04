'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaShieldAlt, FaCreditCard, FaBell, FaFileAlt } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
  DocumentsTab,
  BillingSettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import ResponderProfileTab from './ResponderProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'emergencyDispatch', label: 'Emergency Dispatch', description: 'New emergency dispatch notifications' },
  { key: 'statusUpdates', label: 'Status Updates', description: 'Updates on assigned incidents' },
  { key: 'shiftReminders', label: 'Shift Reminders', description: 'Upcoming shift and on-call reminders' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive critical alerts via SMS' },
]

const RESPONDER_DOCUMENTS = [
  { key: 'emsCert', title: 'EMS Certification', description: 'Emergency Medical Services certification', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'license', title: 'Operating License', description: 'Emergency service operating license', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'nationalId', title: 'National ID / Passport', description: 'Government-issued identification', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'additionalCerts', title: 'Additional Certifications', description: 'ALS, PALS, Hazmat, or other certifications', required: false, acceptedFormats: '.pdf, .jpg, .png' },
]

export default function ResponderSettingsPage() {
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
    { id: 'profile', label: 'Profile', icon: FaUser, component: <ResponderProfileTab /> },
    { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
    { id: 'billing', label: 'Billing', icon: FaCreditCard, component: <BillingSettingsTab userId={userId} /> },
    { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ emergencyDispatch: true, statusUpdates: true, shiftReminders: true, emailNotifications: true, smsNotifications: true }} /> },
    { id: 'documents', label: 'Documents', icon: FaFileAlt, component: <DocumentsTab documents={RESPONDER_DOCUMENTS} /> },
  ]

  return <SettingsLayout tabs={tabs} />
}
