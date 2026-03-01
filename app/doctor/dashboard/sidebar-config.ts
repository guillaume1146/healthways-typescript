import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaPrescriptionBottle,
  FaComments,
  FaMoneyBillWave,
  FaChartLine,
  FaStar,
  FaUserMd,
  FaCog,
  FaVideo,
  FaGlobe,
  FaPenFancy,
  FaClipboardList,
} from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

const base = '/doctor/dashboard'

export const DOCTOR_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/appointments` },
  { id: 'booking-requests', label: 'Booking Requests', icon: FaClipboardList, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/booking-requests` },
  { id: 'patients', label: 'Patients', icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/patients` },
  { id: 'prescriptions', label: 'Prescriptions', icon: FaPrescriptionBottle, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/prescriptions` },
  { id: 'messages', label: 'Messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'billing', label: 'Billing & Earnings', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'analytics', label: 'Analytics', icon: FaChartLine, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: `${base}/analytics` },
  { id: 'reviews', label: 'Reviews', icon: FaStar, color: 'text-yellow-600', bgColor: 'bg-yellow-50', href: `${base}/reviews` },
  { id: 'profile', label: 'Profile', icon: FaUserMd, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/profile` },
  { id: 'video', label: 'Video Call', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'posts', label: 'My Posts', icon: FaPenFancy, color: 'text-teal-600', bgColor: 'bg-teal-50', href: `${base}/posts` },
  { id: 'community', label: 'Community', icon: FaGlobe, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: '/community' },
  { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/doctor/settings' },
]

export function getActiveSectionFromPath(pathname: string): string {
  const relative = pathname.replace(base, '').replace(/^\//, '')
  if (!relative) return 'overview'
  const segment = relative.split('/')[0]
  const match = DOCTOR_SIDEBAR_ITEMS.find((item) => item.id === segment)
  return match ? match.id : 'overview'
}
