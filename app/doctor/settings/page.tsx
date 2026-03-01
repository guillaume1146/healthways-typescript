'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaShieldAlt, FaCreditCard, FaCrown, FaBell, FaFileAlt, FaCalendarAlt } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
  DocumentsTab,
  SubscriptionTab,
  AvailabilitySettingsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import PaymentMethodForm from '@/components/shared/PaymentMethodForm'
import DoctorProfileTab from './DoctorProfileTab'

const NOTIFICATION_OPTIONS = [
  { key: 'appointments', label: 'Appointment Notifications', description: 'New bookings and cancellations' },
  { key: 'newPatients', label: 'New Patient Alerts', description: 'When a new patient registers with you' },
  { key: 'emergencyAlerts', label: 'Emergency Alerts', description: 'Urgent patient notifications' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive updates via SMS' },
]

const DOCTOR_DOCUMENTS = [
  { key: 'license', title: 'Medical License', description: 'Valid medical practice license', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'degree', title: 'Medical Degree Certificate', description: 'Your primary medical qualification', required: true, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'specialization', title: 'Specialization Certificate', description: 'Board certification in your specialty', required: false, acceptedFormats: '.pdf, .jpg, .png' },
  { key: 'insurance', title: 'Malpractice Insurance', description: 'Professional liability coverage', required: false, acceptedFormats: '.pdf, .jpg, .png' },
]

const SUBSCRIPTION_PLANS = [
  { id: 'free', name: 'Free', price: 0, period: 'monthly' as const, features: ['5 Patients/Month', 'Basic Profile', 'Email Support'] },
  { id: 'professional', name: 'Professional', price: 1999, period: 'monthly' as const, features: ['Unlimited Patients', 'Priority Listing', 'Analytics Dashboard', 'Video Consultations'], isCurrent: true },
  { id: 'enterprise', name: 'Enterprise', price: 4999, period: 'monthly' as const, features: ['Multi-Clinic Support', 'Team Management', 'API Access', 'Dedicated Support'] },
]

export default function DoctorSettingsPage() {
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
    { id: 'profile', label: 'Profile', icon: FaUser, component: <DoctorProfileTab /> },
    { id: 'availability', label: 'Availability', icon: FaCalendarAlt, component: userId ? <AvailabilitySettingsTab userId={userId} /> : <div className="text-gray-500 py-8 text-center">Loading...</div> },
    { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
    { id: 'payment', label: 'Payment Methods', icon: FaCreditCard, component: <PaymentMethodForm methods={[{ id: 'pm1', type: 'credit_card', label: 'Visa ending in 4567', details: 'Dr. Johnson - Exp 12/26', isDefault: true }]} /> },
    { id: 'subscription', label: 'Subscription', icon: FaCrown, component: <SubscriptionTab plans={SUBSCRIPTION_PLANS} currentPlanId="professional" /> },
    { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ appointments: true, newPatients: true, emergencyAlerts: true, emailNotifications: true, smsNotifications: false }} /> },
    { id: 'documents', label: 'Documents', icon: FaFileAlt, component: <DocumentsTab documents={DOCTOR_DOCUMENTS} /> },
  ]

  return <SettingsLayout tabs={tabs} />
}
