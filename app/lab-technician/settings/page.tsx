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
import LabTechProfileTab from './LabTechProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'testRequests', label: 'Test Request Notifications', description: 'New lab test orders from doctors' },
  { key: 'resultReady', label: 'Result Ready Alerts', description: 'Notification when results are finalized' },
  { key: 'qualityAlerts', label: 'Quality Control Alerts', description: 'Equipment calibration and QC reminders' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
]

const LAB_DOCUMENTS = [
  { key: 'license', title: 'Laboratory License', description: 'Valid laboratory operating license', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'techCert', title: 'Lab Technician Certificate', description: 'Professional certification', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'accreditation', title: 'Lab Accreditation', description: 'Quality accreditation certificate', required: false, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'nationalId', title: 'National ID / Passport', description: 'Government-issued identification', required: true, acceptedFormats: '.pdf, .jpg, .png' },
]

export default function LabTechSettingsPage() {
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
    { id: 'profile', label: 'Profile', icon: FaUser, component: <LabTechProfileTab /> },
    { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
    { id: 'billing', label: 'Billing', icon: FaCreditCard, component: <BillingSettingsTab userId={userId} /> },
    { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ testRequests: true, resultReady: true, qualityAlerts: true, emailNotifications: true }} /> },
    { id: 'documents', label: 'Documents', icon: FaFileAlt, component: <DocumentsTab documents={LAB_DOCUMENTS} /> },
  ]

  return <SettingsLayout tabs={tabs} />
}
