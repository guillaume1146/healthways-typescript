import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

/**
 * Creates a function that resolves the active sidebar section from the current pathname.
 * Used by all sidebar-config.ts files to avoid duplicating this logic.
 *
 * @param base - The base path for this user type (e.g. '/patient', '/doctor')
 * @param items - The sidebar items array for this user type
 * @returns A function that takes a pathname and returns the matching section id
 *
 * @example
 * const getActiveSectionFromPath = createGetActiveSectionFromPath('/patient', PATIENT_SIDEBAR_ITEMS)
 * getActiveSectionFromPath('/patient/consultations') // => 'consultations'
 * getActiveSectionFromPath('/patient') // => 'overview'
 */
export function createGetActiveSectionFromPath(base: string, items: SidebarItem[]) {
  return (pathname: string): string => {
    const relative = pathname.replace(base, '').replace(/^\//, '')
    if (!relative) return 'overview'
    if (relative.startsWith('chat')) return 'chat'
    const segment = relative.split('/')[0]
    const match = items.find((item) => item.id === segment)
    return match ? match.id : 'overview'
  }
}
