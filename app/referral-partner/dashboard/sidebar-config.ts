import { FaHome, FaHandshake, FaUsers, FaDollarSign, FaChartLine, FaCog, FaComments, FaVideo, FaGlobe } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

const base = '/referral-partner/dashboard'

export const REFERRAL_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'referrals', label: 'Referrals', icon: FaHandshake, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: `${base}/referrals` },
  { id: 'clients', label: 'Clients', icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/clients` },
  { id: 'earnings', label: 'Earnings', icon: FaDollarSign, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/earnings` },
  { id: 'analytics', label: 'Analytics', icon: FaChartLine, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/analytics` },
  { id: 'messages', label: 'Messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'video', label: 'Video Call', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'community', label: 'Community', icon: FaGlobe, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: '/community' },
  { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/referral-partner/settings' },
]

export function getActiveSectionFromPath(pathname: string): string {
  const relative = pathname.replace(base, '').replace(/^\//, '')
  if (!relative) return 'overview'
  const segment = relative.split('/')[0]
  const match = REFERRAL_SIDEBAR_ITEMS.find((item) => item.id === segment)
  return match ? match.id : 'overview'
}
