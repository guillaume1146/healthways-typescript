import { FaHome, FaNewspaper, FaUser, FaCalendarCheck, FaDollarSign, FaStar, FaCog, FaVideo, FaUserFriends, FaComments, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'
import { createGetActiveSectionFromPath } from '@/lib/dashboard/getActiveSectionFromPath'

const base = '/nanny'

export const NANNY_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', labelKey: 'nav.feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', labelKey: 'nav.overview', icon: FaHome, color: 'text-purple-600', bgColor: 'bg-purple-50', href: base },
  { id: 'profile', label: 'Profile', labelKey: 'nav.profile', icon: FaUser, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/profile` },
  { id: 'bookings', label: 'Bookings', labelKey: 'nav.myBookings', icon: FaCalendarCheck, color: 'text-blue-600', bgColor: 'bg-blue-50', href: `${base}/bookings` },
  { id: 'booking-requests', label: 'Booking Requests', labelKey: 'nav.bookingRequests', icon: FaClipboardList, color: 'text-amber-600', bgColor: 'bg-amber-50', href: `${base}/booking-requests` },
  { id: 'families', label: 'Families', labelKey: 'nav.families', icon: FaUserFriends, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/families` },
  { id: 'earnings', label: 'Earnings', labelKey: 'nav.earnings', icon: FaDollarSign, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/earnings` },
  { id: 'reviews', label: 'Reviews', labelKey: 'nav.reviews', icon: FaStar, color: 'text-yellow-600', bgColor: 'bg-yellow-50', href: `${base}/reviews` },
  { id: 'billing', label: 'Billing', labelKey: 'nav.billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', labelKey: 'nav.video', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'messages', label: 'Messages', labelKey: 'nav.messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/messages` },
  { id: 'settings', label: 'Settings', labelKey: 'nav.settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/nanny/settings' },
]

export const getActiveSectionFromPath = createGetActiveSectionFromPath(base, NANNY_SIDEBAR_ITEMS)
