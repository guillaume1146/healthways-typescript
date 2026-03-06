import {
  FaHome,
  FaNewspaper,
  FaCalendarAlt,
  FaUsers,
  FaPrescriptionBottle,
  FaComments,
  FaMoneyBillWave,
  FaStar,
  FaVideo,
  FaPenFancy,
  FaClipboardList,
  FaBriefcaseMedical,
} from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'
import { createGetActiveSectionFromPath } from '@/lib/dashboard/getActiveSectionFromPath'

const base = '/doctor'

export const DOCTOR_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', labelKey: 'nav.feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', labelKey: 'nav.overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'services', label: 'My Services', labelKey: 'nav.services', icon: FaBriefcaseMedical, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/services` },
  { id: 'appointments', label: 'Appointments', labelKey: 'nav.appointments', icon: FaCalendarAlt, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/appointments` },
  { id: 'booking-requests', label: 'Booking Requests', labelKey: 'nav.bookingRequests', icon: FaClipboardList, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/booking-requests` },
  { id: 'patients', label: 'Patients', labelKey: 'nav.patients', icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/patients` },
  { id: 'prescriptions', label: 'Prescriptions', labelKey: 'nav.prescriptions', icon: FaPrescriptionBottle, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/prescriptions` },
  { id: 'reviews', label: 'Reviews', labelKey: 'nav.reviews', icon: FaStar, color: 'text-yellow-600', bgColor: 'bg-yellow-50', href: `${base}/reviews` },
  { id: 'posts', label: 'My Posts', labelKey: 'nav.posts', icon: FaPenFancy, color: 'text-teal-600', bgColor: 'bg-teal-50', href: `${base}/posts` },
  { id: 'billing', label: 'Billing & Earnings', labelKey: 'nav.billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', labelKey: 'nav.video', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'messages', label: 'Messages', labelKey: 'nav.messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
]

export const getActiveSectionFromPath = createGetActiveSectionFromPath(base, DOCTOR_SIDEBAR_ITEMS)
