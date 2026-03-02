import { FaHome, FaNewspaper, FaUser, FaCalendarCheck, FaDollarSign, FaStar, FaCog, FaVideo, FaComments, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

const base = '/nurse/dashboard'

export const NURSE_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', icon: FaHome, color: 'text-teal-600', bgColor: 'bg-teal-50', href: base },
  { id: 'profile', label: 'Profile', icon: FaUser, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/profile` },
  { id: 'appointments', label: 'Appointments', icon: FaCalendarCheck, color: 'text-blue-600', bgColor: 'bg-blue-50', href: `${base}/appointments` },
  { id: 'booking-requests', label: 'Booking Requests', icon: FaClipboardList, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/booking-requests` },
  { id: 'earnings', label: 'Earnings', icon: FaDollarSign, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/earnings` },
  { id: 'reviews', label: 'Reviews', icon: FaStar, color: 'text-yellow-600', bgColor: 'bg-yellow-50', href: `${base}/reviews` },
  { id: 'billing', label: 'Billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'messages', label: 'Messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/nurse/settings' },
]

export function getActiveSectionFromPath(pathname: string): string {
  const relative = pathname.replace(base, '').replace(/^\//, '')
  if (!relative) return 'overview'
  const segment = relative.split('/')[0]
  const match = NURSE_SIDEBAR_ITEMS.find((item) => item.id === segment)
  return match ? match.id : 'overview'
}
