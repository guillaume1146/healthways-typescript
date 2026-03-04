import { FaHome, FaNewspaper, FaUser, FaFlask, FaClipboardList, FaDollarSign, FaCog, FaComments, FaVideo, FaMoneyBillWave } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'
import { createGetActiveSectionFromPath } from '@/lib/dashboard/getActiveSectionFromPath'

const base = '/lab-technician'

export const LAB_TECH_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', labelKey: 'nav.feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', labelKey: 'nav.overview', icon: FaHome, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: base },
  { id: 'profile', label: 'Profile', labelKey: 'nav.profile', icon: FaUser, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/profile` },
  { id: 'tests', label: 'Lab Tests', labelKey: 'nav.tests', icon: FaFlask, color: 'text-blue-600', bgColor: 'bg-blue-50', href: `${base}/tests` },
  { id: 'booking-requests', label: 'Booking Requests', labelKey: 'nav.bookingRequests', icon: FaClipboardList, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/booking-requests` },
  { id: 'results', label: 'Results', labelKey: 'nav.results', icon: FaClipboardList, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/results` },
  { id: 'earnings', label: 'Earnings', labelKey: 'nav.earnings', icon: FaDollarSign, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/earnings` },
  { id: 'billing', label: 'Billing', labelKey: 'nav.billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', labelKey: 'nav.video', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'messages', label: 'Messages', labelKey: 'nav.messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'settings', label: 'Settings', labelKey: 'nav.settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/lab-technician/settings' },
]

export const getActiveSectionFromPath = createGetActiveSectionFromPath(base, LAB_TECH_SIDEBAR_ITEMS)
