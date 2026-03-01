import { FaHome, FaFileAlt, FaUsers, FaChartLine, FaCog, FaComments, FaVideo, FaGlobe } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

const base = '/insurance/dashboard'

export const INSURANCE_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'claims', label: 'Claims', icon: FaFileAlt, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/claims` },
  { id: 'clients', label: 'Clients', icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/clients` },
  { id: 'analytics', label: 'Analytics', icon: FaChartLine, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/analytics` },
  { id: 'messages', label: 'Messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'video', label: 'Video Call', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'community', label: 'Community', icon: FaGlobe, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: '/community' },
  { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/insurance/settings' },
]

export function getActiveSectionFromPath(pathname: string): string {
  const relative = pathname.replace(base, '').replace(/^\//, '')
  if (!relative) return 'overview'
  const segment = relative.split('/')[0]
  const match = INSURANCE_SIDEBAR_ITEMS.find((item) => item.id === segment)
  return match ? match.id : 'overview'
}
