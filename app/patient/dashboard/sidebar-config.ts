import {
  FaHome,
  FaStethoscope,
  FaPills,
  FaFileAlt,
  FaRobot,
  FaUserNurse,
  FaBaby,
  FaAmbulance,
  FaFlask,
  FaShieldAlt,
  FaCog,
  FaVideo,
  FaComments,
  FaGlobe,
  FaCalendarCheck,
} from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

const base = '/patient/dashboard'

export const PATIENT_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'consultations', label: 'Doctor Consultations', icon: FaStethoscope, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/consultations` },
  { id: 'bookings', label: 'My Bookings', icon: FaCalendarCheck, color: 'text-teal-600', bgColor: 'bg-teal-50', href: `${base}/bookings` },
  { id: 'prescriptions', label: 'Prescriptions', icon: FaPills, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/prescriptions` },
  { id: 'health-records', label: 'Health Records', icon: FaFileAlt, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: `${base}/health-records` },
  { id: 'ai-assistant', label: 'AI Health Assistant', icon: FaRobot, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/ai-assistant` },
  { id: 'nurse-services', label: 'Nurse Services', icon: FaUserNurse, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/nurse-services` },
  { id: 'childcare', label: 'Childcare Services', icon: FaBaby, color: 'text-yellow-600', bgColor: 'bg-yellow-50', href: `${base}/childcare` },
  { id: 'emergency', label: 'Emergency Services', icon: FaAmbulance, color: 'text-red-600', bgColor: 'bg-red-50', href: `${base}/emergency` },
  { id: 'lab-results', label: 'Lab Results', icon: FaFlask, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/lab-results` },
  { id: 'insurance', label: 'Insurance', icon: FaShieldAlt, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/insurance` },
  { id: 'video', label: 'Video Call', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'chat', label: 'Messages', icon: FaComments, color: 'text-blue-600', bgColor: 'bg-blue-50', href: `${base}/chat` },
  { id: 'community', label: 'Community', icon: FaGlobe, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: '/community' },
  { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50', href: '/patient/settings' },
]

/**
 * Maps a pathname to the active sidebar item id.
 * e.g. "/patient/dashboard/consultations" → "consultations"
 */
export function getActiveSectionFromPath(pathname: string): string {
  // Strip the base prefix
  const relative = pathname.replace(base, '').replace(/^\//, '')

  if (!relative) return 'overview'

  // Handle chat sub-routes
  if (relative.startsWith('chat')) return 'chat'

  // Match first segment
  const segment = relative.split('/')[0]
  const match = PATIENT_SIDEBAR_ITEMS.find((item) => item.id === segment)
  return match ? match.id : 'overview'
}
