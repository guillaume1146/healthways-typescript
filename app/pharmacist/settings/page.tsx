'use client'

import { FaUser, FaShieldAlt, FaCreditCard, FaBell, FaFileAlt } from 'react-icons/fa'
import {
  SettingsLayout,
  SecuritySettingsTab,
  NotificationSettingsTab,
  DocumentsTab,
} from '@/components/settings'
import type { SettingsTab } from '@/components/settings'
import PaymentMethodForm from '@/components/shared/PaymentMethodForm'
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

const tabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', icon: FaUser, component: <PharmacistProfileTab /> },
  { id: 'security', label: 'Security', icon: FaShieldAlt, component: <SecuritySettingsTab /> },
  { id: 'payment', label: 'Payment Methods', icon: FaCreditCard, component: <PaymentMethodForm methods={[]} /> },
  { id: 'notifications', label: 'Notifications', icon: FaBell, component: <NotificationSettingsTab options={NOTIFICATION_OPTIONS} defaults={{ orders: true, stockAlerts: true, deliveryUpdates: true, emailNotifications: true, smsNotifications: false }} /> },
  { id: 'documents', label: 'Documents', icon: FaFileAlt, component: <DocumentsTab documents={PHARMACY_DOCUMENTS} /> },
]

export default function PharmacistSettingsPage() {
  return <SettingsLayout tabs={tabs} />
}
