'use client'

import { FaUser, FaShieldAlt, FaCreditCard, FaCrown, FaBell, FaFileAlt } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
  DocumentsTab,
  SubscriptionTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import PaymentMethodForm from '@/components/shared/PaymentMethodForm'
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

const tabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', icon: FaUser, component: <PatientProfileTab /> },
  { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
  { id: 'payment', label: 'Billing & Payments', icon: FaCreditCard, component: <PaymentMethodForm methods={[{ id: 'pm1', type: 'credit_card', label: 'Visa ending in 4242', details: 'John Smith - Exp 12/26', isDefault: true }, { id: 'pm2', type: 'mcb_juice', label: 'MCB Juice', details: '+230 5123 4567', isDefault: false }]} /> },
  { id: 'subscription', label: 'Subscription', icon: FaCrown, component: <SubscriptionTab plans={SUBSCRIPTION_PLANS} currentPlanId="premium" /> },
  { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ appointmentReminders: true, prescriptionRefills: true, labResults: true, healthTips: false, promotions: false }} /> },
  { id: 'documents', label: 'Documents', icon: FaFileAlt, component: <DocumentsTab documents={PATIENT_DOCUMENTS} /> },
]

export default function PatientSettingsPage() {
  return <SettingsLayout tabs={tabs} />
}
