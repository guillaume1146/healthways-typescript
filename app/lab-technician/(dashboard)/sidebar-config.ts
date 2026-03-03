import { FaHome, FaNewspaper, FaUser, FaFlask, FaClipboardList, FaDollarSign, FaCog, FaComments, FaVideo, FaMoneyBillWave } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

const base = '/lab-technician'

export const LAB_TECH_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', icon: FaHome, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: base },
  { id: 'profile', label: 'Profile', icon: FaUser, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/profile` },
  { id: 'tests', label: 'Lab Tests', icon: FaFlask, color: 'text-blue-600', bgColor: 'bg-blue-50', href: `${base}/tests` },
  { id: 'booking-requests', label: 'Booking Requests', icon: FaClipboardList, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/booking-requests` },
  { id: 'results', label: 'Results', icon: FaClipboardList, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/results` },
  { id: 'earnings', label: 'Earnings', icon: FaDollarSign, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/earnings` },
  { id: 'billing', label: 'Billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'messages', label: 'Messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/lab-technician/settings' },
]

export function getActiveSectionFromPath(pathname: string): string {
  const relative = pathname.replace(base, '').replace(/^\//, '')
  if (!relative) return 'overview'
  const segment = relative.split('/')[0]
  const match = LAB_TECH_SIDEBAR_ITEMS.find((item) => item.id === segment)
  return match ? match.id : 'overview'
}
