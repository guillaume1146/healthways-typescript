import { FaHome, FaNewspaper, FaUser, FaHandshake, FaUsers, FaDollarSign, FaChartLine, FaCog, FaComments, FaVideo, FaMoneyBillWave } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'
import { createGetActiveSectionFromPath } from '@/lib/dashboard/getActiveSectionFromPath'

const base = '/referral-partner'

export const REFERRAL_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', labelKey: 'nav.feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', labelKey: 'nav.overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'profile', label: 'Profile', labelKey: 'nav.profile', icon: FaUser, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/profile` },
  { id: 'referrals', label: 'Referrals', labelKey: 'nav.referrals', icon: FaHandshake, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: `${base}/referrals` },
  { id: 'clients', label: 'Clients', labelKey: 'nav.clients', icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/clients` },
  { id: 'earnings', label: 'Earnings', labelKey: 'nav.earnings', icon: FaDollarSign, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/earnings` },
  { id: 'analytics', label: 'Analytics', labelKey: 'nav.analytics', icon: FaChartLine, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/analytics` },
  { id: 'billing', label: 'Billing', labelKey: 'nav.billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', labelKey: 'nav.video', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'messages', label: 'Messages', labelKey: 'nav.messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'settings', label: 'Settings', labelKey: 'nav.settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/referral-partner/settings' },
]

export const getActiveSectionFromPath = createGetActiveSectionFromPath(base, REFERRAL_SIDEBAR_ITEMS)
