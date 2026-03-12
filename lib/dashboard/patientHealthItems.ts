import { FaHeartbeat, FaRobot } from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

/**
 * Returns AI Health Assistant + My Health sidebar items for any non-patient role.
 * AI Assistant is a standalone top-level item visible to all users.
 * My Health links to a unified tabbed page with all other patient health features.
 */
export function getPatientHealthItems(base: string): SidebarItem[] {
  return [
    { id: 'ai-assistant', label: 'AI Health Assistant', labelKey: 'nav.aiAssistant', icon: FaRobot, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: `${base}/ai-assistant` },
    { id: 'my-health', label: 'My Health', labelKey: 'nav.health', icon: FaHeartbeat, color: 'text-red-600', bgColor: 'bg-red-50', href: `${base}/my-health` },
  ]
}
