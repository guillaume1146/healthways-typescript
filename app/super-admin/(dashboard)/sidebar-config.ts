import { FaHome, FaNewspaper, FaUser, FaUsers, FaChartLine, FaFileAlt, FaShieldAlt, FaServer, FaCog, FaUserCheck, FaComments, FaVideo, FaMoneyBillWave, FaToggleOn, FaClipboardList } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'
import { createGetActiveSectionFromPath } from '@/lib/dashboard/getActiveSectionFromPath'

const base = '/super-admin'

export const SUPER_ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', labelKey: 'nav.feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', labelKey: 'nav.overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'profile', label: 'Profile', labelKey: 'nav.profile', icon: FaUser, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/profile` },
  { id: 'accounts', label: 'Accounts', labelKey: 'nav.accounts', icon: FaUserCheck, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/accounts` },
  { id: 'users', label: 'All Users', labelKey: 'nav.users', icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/users` },
  { id: 'analytics', label: 'Platform Analytics', labelKey: 'nav.analytics', icon: FaChartLine, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/analytics` },
  { id: 'content', label: 'Content', labelKey: 'nav.content', icon: FaFileAlt, color: 'text-teal-600', bgColor: 'bg-teal-50', href: `${base}/content` },
  { id: 'security', label: 'Security', labelKey: 'nav.security', icon: FaShieldAlt, color: 'text-red-600', bgColor: 'bg-red-50', href: `${base}/security` },
  { id: 'system', label: 'System', labelKey: 'nav.system', icon: FaServer, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/system` },
  { id: 'billing', label: 'Billing', labelKey: 'nav.billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', labelKey: 'nav.video', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'messages', label: 'Messages', labelKey: 'nav.messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'role-config', label: 'Role Config', labelKey: 'nav.roleConfig', icon: FaToggleOn, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: `${base}/role-config` },
  { id: 'required-documents', label: 'Documents Config', labelKey: 'nav.requiredDocs', icon: FaClipboardList, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/required-documents` },
  { id: 'settings', label: 'Settings', labelKey: 'nav.settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/super-admin/settings' },
]

export const getActiveSectionFromPath = createGetActiveSectionFromPath(base, SUPER_ADMIN_SIDEBAR_ITEMS)
