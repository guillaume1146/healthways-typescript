import { FaHome, FaNewspaper, FaUser, FaUsers, FaChartLine, FaFileAlt, FaShieldAlt, FaServer, FaCog, FaUserCheck, FaComments, FaVideo, FaMoneyBillWave } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

const base = '/super-admin'

export const SUPER_ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'profile', label: 'Profile', icon: FaUser, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/profile` },
  { id: 'accounts', label: 'Accounts', icon: FaUserCheck, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/accounts` },
  { id: 'users', label: 'All Users', icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/users` },
  { id: 'analytics', label: 'Platform Analytics', icon: FaChartLine, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/analytics` },
  { id: 'content', label: 'Content', icon: FaFileAlt, color: 'text-teal-600', bgColor: 'bg-teal-50', href: `${base}/content` },
  { id: 'security', label: 'Security', icon: FaShieldAlt, color: 'text-red-600', bgColor: 'bg-red-50', href: `${base}/security` },
  { id: 'system', label: 'System', icon: FaServer, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/system` },
  { id: 'billing', label: 'Billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'messages', label: 'Messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/super-admin/settings' },
]

export function getActiveSectionFromPath(pathname: string): string {
  const relative = pathname.replace(base, '').replace(/^\//, '')
  if (!relative) return 'overview'
  const segment = relative.split('/')[0]
  const match = SUPER_ADMIN_SIDEBAR_ITEMS.find((item) => item.id === segment)
  return match ? match.id : 'overview'
}
