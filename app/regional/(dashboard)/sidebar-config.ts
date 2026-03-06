import { FaHome, FaNewspaper, FaUsers, FaFileAlt, FaShieldAlt, FaComments, FaVideo, FaMoneyBillWave, FaToggleOn, FaClipboardList, FaBell } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'
import { createGetActiveSectionFromPath } from '@/lib/dashboard/getActiveSectionFromPath'

const base = '/regional'

export const REGIONAL_ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', labelKey: 'nav.feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', labelKey: 'nav.overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'users', label: 'Users', labelKey: 'nav.users', icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/users` },
  { id: 'content', label: 'Content', labelKey: 'nav.content', icon: FaFileAlt, color: 'text-teal-600', bgColor: 'bg-teal-50', href: `${base}/content` },
  { id: 'security', label: 'Security', labelKey: 'nav.security', icon: FaShieldAlt, color: 'text-red-600', bgColor: 'bg-red-50', href: `${base}/security` },
  { id: 'billing', label: 'Billing', labelKey: 'nav.billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', labelKey: 'nav.video', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'messages', label: 'Messages', labelKey: 'nav.messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'role-config', label: 'Role Config', labelKey: 'nav.roleConfig', icon: FaToggleOn, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: `${base}/role-config` },
  { id: 'required-documents', label: 'Documents Config', labelKey: 'nav.requiredDocs', icon: FaClipboardList, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/required-documents` },
  { id: 'notifications', label: 'Notifications', labelKey: 'nav.notifications', icon: FaBell, color: 'text-yellow-600', bgColor: 'bg-yellow-50', href: `${base}/notifications` },
]

export const getActiveSectionFromPath = createGetActiveSectionFromPath(base, REGIONAL_ADMIN_SIDEBAR_ITEMS)
