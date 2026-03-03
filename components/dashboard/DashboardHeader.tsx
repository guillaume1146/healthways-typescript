'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  FaBars,
  FaTimes,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaCheckDouble,
} from 'react-icons/fa'

interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  createdAt: string
  readAt: string | null
  referenceId?: string | null
  referenceType?: string | null
}

interface DashboardHeaderProps {
  userName: string
  userImage?: string | null
  userSubtitle: string
  notificationCount: number
  settingsHref: string
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onLogout: () => void
  userId?: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  userImage,
  userSubtitle,
  notificationCount,
  settingsHref,
  sidebarOpen,
  onToggleSidebar,
  onLogout,
  userId,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    setLoadingNotifs(true)
    try {
      const res = await fetch(`/api/users/${userId}/notifications?limit=10`)
      const data = await res.json()
      if (data.data) {
        setNotifications(data.data)
      }
    } catch {
      // silent
    } finally {
      setLoadingNotifs(false)
    }
  }, [userId])

  const handleBellClick = () => {
    const opening = !showDropdown
    setShowDropdown(opening)
    if (opening) {
      fetchNotifications()
    }
  }

  const handleMarkAllRead = async () => {
    if (!userId) return
    try {
      await fetch(`/api/users/${userId}/notifications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })))
    } catch {
      // silent
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  // Expose a way for parent to add notifications in real time
  useEffect(() => {
    const handler = (e: CustomEvent<NotificationItem>) => {
      setNotifications(prev => [e.detail, ...prev].slice(0, 10))
    }
    window.addEventListener('notification:new' as string, handler as EventListener)
    return () => window.removeEventListener('notification:new' as string, handler as EventListener)
  }, [])

  const unreadCount = notificationCount > 0 ? notificationCount : notifications.filter(n => !n.readAt).length

  return (
    <div className="bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-3.5 md:py-4 lg:py-5">
        <div className="flex items-center justify-between">
          {/* Left: mobile toggle + user info */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {sidebarOpen ? (
                <FaTimes className="text-base sm:text-lg" />
              ) : (
                <FaBars className="text-base sm:text-lg" />
              )}
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              {userImage && (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-blue-200"
                />
              )}
              <div>
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                  {userName}
                </h1>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base text-gray-600">
                  {userSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right: notification bell, settings, logout */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            {/* Notification bell + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleBellClick}
                className="relative p-2 sm:p-2.5 md:p-3 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-lg hover:bg-blue-100 transition"
                aria-label="Notifications"
                aria-expanded={showDropdown}
              >
                <FaBell className="text-base sm:text-lg md:text-xl lg:text-2xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div role="menu" className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[70vh] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                    {notifications.some(n => !n.readAt) && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <FaCheckDouble className="text-[10px]" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto max-h-[calc(70vh-48px)]">
                    {loadingNotifs ? (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        Loading...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ${!n.readAt ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                            </div>
                            {!n.readAt && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings link */}
            <Link
              href={settingsHref}
              className="p-2 sm:p-2.5 md:p-3 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-lg hover:bg-blue-100 transition"
              aria-label="Settings"
            >
              <FaCog className="text-base sm:text-lg md:text-xl lg:text-2xl" />
            </Link>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg flex items-center gap-1 sm:gap-2 hover:from-red-600 hover:to-red-700 transition"
            >
              <FaSignOutAlt className="text-xs sm:text-sm md:text-base lg:text-lg" />
              <span className="hidden sm:inline text-xs sm:text-sm md:text-base lg:text-lg">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
