'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar, { type SidebarItem } from './DashboardSidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  userName: string
  userImage?: string | null
  userSubtitle: string
  sidebarItems: SidebarItem[]
  activeSectionId: string
  notificationCount?: number
  settingsHref: string
  onLogout: () => void
  sidebarFooter?: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userName,
  userImage,
  userSubtitle,
  sidebarItems,
  activeSectionId,
  notificationCount = 0,
  settingsHref,
  onLogout,
  sidebarFooter,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [userId, setUserId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Read userId from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('healthwyz_user') || '{}')
      if (user.id) setUserId(user.id)
    } catch {
      // silent
    }
  }, [])

  // Socket.IO: connect and listen for real-time notifications
  const setupSocket = useCallback(async () => {
    if (!userId) return
    const { io } = await import('socket.io-client')
    const socket = io({ transports: ['websocket', 'polling'] })
    socket.on('connect', () => {
      socket.emit('chat:join', { userId })
    })
    socket.on('notification:new', (data: { title: string; message: string; id: string; type: string; createdAt: string }) => {
      toast.info(
        <div>
          <p className="font-semibold text-sm">{data.title}</p>
          <p className="text-xs text-gray-600 mt-0.5">{data.message}</p>
        </div>,
        { autoClose: 5000 }
      )
      // Dispatch custom event so DashboardHeader can add it to the dropdown
      window.dispatchEvent(new CustomEvent('notification:new', { detail: data }))
    })
    return () => {
      socket.disconnect()
    }
  }, [userId])

  useEffect(() => {
    let cleanup: (() => void) | undefined
    setupSocket().then(fn => { cleanup = fn })
    return () => { cleanup?.() }
  }, [setupSocket])

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Fixed header */}
      <DashboardHeader
        userName={userName}
        userImage={userImage}
        userSubtitle={userSubtitle}
        notificationCount={notificationCount}
        settingsHref={settingsHref}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onLogout={onLogout}
        userId={userId}
      />

      {/* Sidebar (fixed) */}
      <DashboardSidebar
        items={sidebarItems}
        activeItemId={activeSectionId}
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={handleCloseSidebar}
        footer={sidebarFooter}
      />

      {/* Main content area — offset for fixed header + fixed sidebar */}
      <main className="pt-14 sm:pt-16 md:pt-20 lg:pt-24 md:ml-64 lg:ml-72 xl:ml-80 flex-1 min-w-0 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
