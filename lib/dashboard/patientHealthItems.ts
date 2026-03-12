import { FaHeartbeat } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

/**
 * Returns a single "My Health" sidebar item for any non-patient role.
 * Links to a unified tabbed page with all patient health features
 * (AI assistant, consultations, prescriptions, health records, etc.).
 */
export function getPatientHealthItems(base: string): SidebarItem[] {
  return [
    { id: 'my-health', label: 'My Health', labelKey: 'nav.health', icon: FaHeartbeat, color: 'text-red-600', bgColor: 'bg-red-50', href: `${base}/my-health` },
  ]
}
