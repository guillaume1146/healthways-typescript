'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaShieldAlt, FaCalendarAlt, FaCreditCard, FaBell, FaFileAlt } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
  DocumentsTab,
  AvailabilitySettingsTab,
  BillingSettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import NurseProfileTab from './NurseProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'appointments', label: 'Appointment Notifications', description: 'New bookings, cancellations, and schedule changes' },
  { key: 'patientUpdates', label: 'Patient Updates', description: 'Updates on assigned patients' },
  { key: 'emergencyAlerts', label: 'Emergency Alerts', description: 'Urgent care notifications' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive updates via SMS' },
]

const NURSE_DOCUMENTS = [
  { key: 'license', title: 'Nursing License', description: 'Valid nursing practice license', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'degree', title: 'Nursing Degree Certificate', description: 'Your primary nursing qualification', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'certifications', title: 'Additional Certifications', description: 'CPR, BLS, or specialty certifications', required: false, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'nationalId', title: 'National ID / Passport', description: 'Government-issued identification', required: true, acceptedFormats: '.pdf, .jpg, .png' },
]

export default function NurseSettingsPage() {
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
    { id: 'profile', label: 'Profile', icon: FaUser, component: <NurseProfileTab /> },
    { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
    { id: 'availability', label: 'Availability', icon: FaCalendarAlt, component: userId ? <AvailabilitySettingsTab userId={userId} /> : <div className="text-gray-500 py-8 text-center">Loading...</div> },
    { id: 'billing', label: 'Billing', icon: FaCreditCard, component: <BillingSettingsTab userId={userId} /> },
    { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ appointments: true, patientUpdates: true, emergencyAlerts: true, emailNotifications: true, smsNotifications: false }} /> },
    { id: 'documents', label: 'Documents', icon: FaFileAlt, component: <DocumentsTab documents={NURSE_DOCUMENTS} /> },
  ]

  return <SettingsLayout tabs={tabs} />
}
