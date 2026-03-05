'use client'

import Link from 'next/link'
import { FaTimes } from 'react-icons/fa'
import { useTranslation } from '@/lib/i18n'

export interface SidebarItem {
  id: string
  label: string
  labelKey?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  count?: number
  href: string
}

interface DashboardSidebarProps {
  items: SidebarItem[]
  activeItemId: string
  isOpen: boolean
  isMobile: boolean
  onClose: () => void
  footer?: React.ReactNode
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  items,
  activeItemId,
  isOpen,
  isMobile,
  onClose,
  footer,
}) => {
  const { t } = useTranslation()

  const getLabel = (item: SidebarItem): string => {
    if (item.labelKey) {
      const translated = t(item.labelKey)
      if (translated !== item.labelKey) return translated
    }
    return item.label
  }

  // On desktop: open = full width, collapsed = w-16 (icon-only)
  // On mobile: open = full width slide-out, closed = w-0 (hidden)
  const sidebarWidth = isMobile
    ? isOpen ? 'w-full sm:w-72' : 'w-0'
    : isOpen ? 'md:w-64 lg:w-72 xl:w-80' : 'md:w-16'

  const isCollapsedDesktop = !isOpen && !isMobile

  return (
    <>
      {/* Sidebar panel */}
      <aside
        role="navigation"
        aria-label="Dashboard sidebar navigation"
        className={`
          fixed inset-y-0 left-0
          ${isMobile && isOpen ? 'z-[60]' : 'z-40'}
          ${sidebarWidth}
          bg-white shadow-2xl md:shadow-lg
          transform transition-all duration-300 ease-in-out
          overflow-hidden
        `}
      >
        {/* Mobile close button — fixed above scroll area */}
        <div className="md:hidden flex items-center justify-end px-3 sm:px-4 pt-20 pb-2" style={{ paddingTop: 'max(5rem, env(safe-area-inset-top, 5rem))' }}>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close sidebar"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className={`h-full overflow-y-auto pt-4 md:pt-20 lg:pt-20 ${isCollapsedDesktop ? 'p-2' : 'p-3 sm:p-4 md:p-5 lg:p-6'}`}>
          {/* Navigation items */}
          <nav className="space-y-1.5 sm:space-y-2" aria-label="Dashboard menu" aria-hidden={isMobile && !isOpen ? true : undefined}>
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeItemId === item.id
              const label = getLabel(item)

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={isCollapsedDesktop ? label : undefined}
                  onClick={() => {
                    if (isMobile) onClose()
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block w-full text-left rounded-lg sm:rounded-xl transition-all transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isCollapsedDesktop
                      ? 'px-0 py-2.5 flex items-center justify-center'
                      : 'px-3 sm:px-3.5 md:px-4 lg:px-5 py-2.5 sm:py-3 md:py-3.5'
                  } ${
                    isActive
                      ? `${item.bgColor} ${item.color} shadow-md`
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsedDesktop ? 'justify-center' : 'gap-2.5 sm:gap-3 md:gap-3.5'}`}>
                    <Icon className="text-base sm:text-lg md:text-xl lg:text-2xl flex-shrink-0" aria-hidden="true" />
                    {!isCollapsedDesktop && (
                      <>
                        <span className="font-medium text-sm sm:text-sm md:text-base lg:text-lg">
                          {label}
                        </span>
                        {item.count != null && item.count > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full" aria-label={`${item.count} notifications`}>
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                    {isCollapsedDesktop && item.count != null && item.count > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-label={`${item.count} notifications`} />
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Optional footer — hidden when collapsed on desktop */}
          {footer && !isCollapsedDesktop && (
            <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t">
              {footer}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default DashboardSidebar
