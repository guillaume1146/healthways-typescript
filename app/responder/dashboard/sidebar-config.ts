import { FaHome, FaAmbulance, FaMapMarkerAlt, FaDollarSign, FaCog, FaComments, FaVideo, FaGlobe, FaClipboardList } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

const base = '/responder/dashboard'

export const RESPONDER_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: FaHome, color: 'text-red-600', bgColor: 'bg-red-50', href: base },
  { id: 'booking-requests', label: 'Booking Requests', icon: FaClipboardList, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/booking-requests` },
  { id: 'calls', label: 'Emergency Calls', icon: FaAmbulance, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/calls` },
  { id: 'coverage', label: 'Coverage Zone', icon: FaMapMarkerAlt, color: 'text-blue-600', bgColor: 'bg-blue-50', href: `${base}/coverage` },
  { id: 'earnings', label: 'Earnings', icon: FaDollarSign, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/earnings` },
  { id: 'messages', label: 'Messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'video', label: 'Video Call', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'community', label: 'Community', icon: FaGlobe, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: '/community' },
  { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/responder/settings' },
]

export function getActiveSectionFromPath(pathname: string): string {
  const relative = pathname.replace(base, '').replace(/^\//, '')
  if (!relative) return 'overview'
  const segment = relative.split('/')[0]
  const match = RESPONDER_SIDEBAR_ITEMS.find((item) => item.id === segment)
  return match ? match.id : 'overview'
}
