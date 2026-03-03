'use client'

import Link from 'next/link'
import { FaTimes } from 'react-icons/fa'

export interface SidebarItem {
  id: string
  label: string
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
  return (
    <>
      {/* Sidebar panel */}
      <aside
        role="navigation"
        aria-label="Dashboard sidebar navigation"
        className={`
          fixed inset-y-0 left-0 z-40
          ${isOpen ? 'w-full sm:w-72 md:w-80 lg:w-80 xl:w-96' : 'w-0 md:w-64 lg:w-72 xl:w-80'}
          bg-white shadow-2xl md:shadow-lg
          transform transition-all duration-300 ease-in-out
          overflow-hidden
        `}
      >
        <div className="h-full overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 pt-16 md:pt-16 lg:pt-16">
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close sidebar"
          >
            <FaTimes className="text-lg" />
          </button>

          {/* Navigation items */}
          <nav className="space-y-1.5 sm:space-y-2 mt-8 md:mt-0" aria-label="Dashboard menu">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeItemId === item.id

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    if (isMobile) onClose()
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block w-full text-left px-3 sm:px-3.5 md:px-4 lg:px-5 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? `${item.bgColor} ${item.color} shadow-md`
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 md:gap-3.5">
                    <Icon className="text-base sm:text-lg md:text-xl lg:text-2xl" aria-hidden="true" />
                    <span className="font-medium text-sm sm:text-sm md:text-base lg:text-lg">
                      {item.label}
                    </span>
                    {item.count != null && item.count > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full" aria-label={`${item.count} notifications`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Optional footer (e.g. communication links, quick stats) */}
          {footer && (
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
