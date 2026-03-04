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
import PharmacistProfileTab from './PharmacistProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'orders', label: 'Order Notifications', description: 'New prescription orders and refill requests' },
  { key: 'stockAlerts', label: 'Stock Alerts', description: 'Low stock and expiry date reminders' },
  { key: 'deliveryUpdates', label: 'Delivery Updates', description: 'Delivery status notifications' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive updates via SMS' },
]

const PHARMACY_DOCUMENTS = [
  { key: 'operatingLicense', title: 'Pharmacy Operating License', description: 'Valid pharmacy operating license', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'pharmacistCert', title: 'Pharmacist Certificate', description: 'Professional pharmacist certification', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'businessRegistration', title: 'Business Registration', description: 'Company or business registration document', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'insurance', title: 'Business Insurance', description: 'Professional liability insurance', required: false, acceptedFormats: '.pdf, .jpg, .png' },
]

export default function PharmacistSettingsPage() {
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
    { id: 'profile', label: 'Profile', icon: FaUser, component: <PharmacistProfileTab /> },
    { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
    { id: 'billing', label: 'Billing', icon: FaCreditCard, component: <BillingSettingsTab userId={userId} /> },
    { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ orders: true, stockAlerts: true, deliveryUpdates: true, emailNotifications: true, smsNotifications: false }} /> },
    { id: 'documents', label: 'Documents', icon: FaFileAlt, component: <DocumentsTab documents={PHARMACY_DOCUMENTS} /> },
  ]

  return <SettingsLayout tabs={tabs} />
}
