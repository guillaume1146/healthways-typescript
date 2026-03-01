import { FaHome, FaUsers, FaChartLine, FaShieldAlt, FaCog, FaComments, FaVideo, FaFileAlt, FaGlobe } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

const base = '/admin/dashboard'

export const ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'users', label: 'Users', icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/users` },
  { id: 'analytics', label: 'Analytics', icon: FaChartLine, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/analytics` },
  { id: 'security', label: 'Security', icon: FaShieldAlt, color: 'text-red-600', bgColor: 'bg-red-50', href: `${base}/security` },
  { id: 'content', label: 'Content', icon: FaFileAlt, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: `${base}/content` },
  { id: 'messages', label: 'Messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'video', label: 'Video Call', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'community', label: 'Community', icon: FaGlobe, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: '/community' },
  { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: `${base}/settings` },
]

export function getActiveSectionFromPath(pathname: string): string {
  const relative = pathname.replace(base, '').replace(/^\//, '')
  if (!relative) return 'overview'
  const segment = relative.split('/')[0]
  const match = ADMIN_SIDEBAR_ITEMS.find((item) => item.id === segment)
  return match ? match.id : 'overview'
}
