import {
  FaHome,
  FaNewspaper,
  FaUser,
  FaStethoscope,
  FaPills,
  FaFileAlt,
  FaRobot,
  FaUserNurse,
  FaBaby,
  FaAmbulance,
  FaFlask,
  FaShieldAlt,
  FaCog,
  FaVideo,
  FaComments,
  FaMoneyBillWave,
  FaCalendarCheck,
} from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'
import { createGetActiveSectionFromPath } from '@/lib/dashboard/getActiveSectionFromPath'

const base = '/patient'

export const PATIENT_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', labelKey: 'nav.feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', labelKey: 'nav.overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'profile', label: 'Profile', labelKey: 'nav.profile', icon: FaUser, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/profile` },
  { id: 'consultations', label: 'Doctor Consultations', labelKey: 'nav.consultations', icon: FaStethoscope, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/consultations` },
  { id: 'bookings', label: 'My Bookings', labelKey: 'nav.myBookings', icon: FaCalendarCheck, color: 'text-teal-600', bgColor: 'bg-teal-50', href: `${base}/bookings` },
  { id: 'prescriptions', label: 'Prescriptions', labelKey: 'nav.prescriptions', icon: FaPills, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/prescriptions` },
  { id: 'health-records', label: 'Health Records', labelKey: 'nav.healthRecords', icon: FaFileAlt, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: `${base}/health-records` },
  { id: 'ai-assistant', label: 'AI Health Assistant', labelKey: 'nav.aiAssistant', icon: FaRobot, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/ai-assistant` },
  { id: 'nurse-services', label: 'Nurse Services', labelKey: 'nav.nurseServices', icon: FaUserNurse, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/nurse-services` },
  { id: 'childcare', label: 'Childcare Services', labelKey: 'nav.childcare', icon: FaBaby, color: 'text-yellow-600', bgColor: 'bg-yellow-50', href: `${base}/childcare` },
  { id: 'emergency', label: 'Emergency Services', labelKey: 'nav.emergency', icon: FaAmbulance, color: 'text-red-600', bgColor: 'bg-red-50', href: `${base}/emergency` },
  { id: 'lab-results', label: 'Lab Results', labelKey: 'nav.labResults', icon: FaFlask, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/lab-results` },
  { id: 'insurance', label: 'Insurance', labelKey: 'nav.insurance', icon: FaShieldAlt, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/insurance` },
  { id: 'billing', label: 'Billing', labelKey: 'nav.billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', labelKey: 'nav.video', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'chat', label: 'Messages', labelKey: 'nav.messages', icon: FaComments, color: 'text-blue-600', bgColor: 'bg-blue-50', href: `${base}/chat` },
  { id: 'settings', label: 'Settings', labelKey: 'nav.settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/patient/settings' },
]

export const getActiveSectionFromPath = createGetActiveSectionFromPath(base, PATIENT_SIDEBAR_ITEMS)
