'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaShieldAlt, FaCreditCard, FaCrown, FaBell, FaFileAlt } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
  DocumentsTab,
  SubscriptionTab,
  BillingSettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import PatientProfileTab from './PatientProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'appointmentReminders', label: 'Appointment Reminders', description: 'Get notified before scheduled appointments' },
  { key: 'prescriptionRefills', label: 'Prescription Refill Alerts', description: 'Reminders when prescriptions are due' },
  { key: 'labResults', label: 'Lab Results Ready', description: 'Notification when new results are available' },
  { key: 'healthTips', label: 'Weekly Health Tips', description: 'Receive curated health advice' },
  { key: 'promotions', label: 'Promotions & Offers', description: 'Special offers and discounts' },
]

const PATIENT_DOCUMENTS = [
  { key: 'nationalId', title: 'National ID / Passport', description: 'Valid government-issued identification', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'proofOfAddress', title: 'Proof of Address', description: 'Utility bill or rental contract', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'insuranceCard', title: 'Health Insurance Card', description: 'If insured', required: false, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'medicalHistory', title: 'Medical History Document', description: 'Vaccination card or chronic illness file', required: false, acceptedFormats: '.pdf, .jpg, .png' },
]

const SUBSCRIPTION_PLANS = [
  { id: 'basic', name: 'Basic Health', price: 999, period: 'monthly' as const, features: ['2 Doctor Consultations', 'Basic Health Checkup', 'Email Support'] },
  { id: 'premium', name: 'Premium Care', price: 2499, period: 'monthly' as const, features: ['Unlimited Consultations', 'Full Body Checkup', 'Priority Support', 'Dietitian Session'], isCurrent: true },
  { id: 'corporate', name: 'Corporate Wellness', price: 0, period: 'yearly' as const, features: ['Covered by Employer', 'Annual Health Screening', 'Wellness Workshops'] },
]

export default function PatientSettingsPage() {
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
    { id: 'profile', label: 'Profile', icon: FaUser, component: <PatientProfileTab /> },
    { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
    { id: 'billing', label: 'Billing & Payments', icon: FaCreditCard, component: <BillingSettingsTab userId={userId} /> },
    { id: 'subscription', label: 'Subscription', icon: FaCrown, component: <SubscriptionTab plans={SUBSCRIPTION_PLANS} currentPlanId="premium" /> },
    { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ appointmentReminders: true, prescriptionRefills: true, labResults: true, healthTips: false, promotions: false }} /> },
    { id: 'documents', label: 'Documents', icon: FaFileAlt, component: <DocumentsTab documents={PATIENT_DOCUMENTS} /> },
  ]

  return <SettingsLayout tabs={tabs} />
}
