'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  FaBars,
  FaTimes,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaCheckDouble,
  FaUserFriends,
} from 'react-icons/fa'
import HealthwyzLogo from '@/components/ui/HealthwyzLogo'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import { useTranslation } from '@/lib/i18n'

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
  profileHref: string
  networkHref?: string
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

function getNotificationHref(n: NotificationItem, profileHref: string): string | null {
  const base = profileHref.replace(/\/profile$/, '')
  const key = n.referenceType || n.type || ''

  switch (key) {
    case 'appointment':
    case 'doctor_booking':
    case 'nurse_booking':
    case 'nanny_booking':
      return `${base}/consultations`
    case 'lab_test_booking':
    case 'lab-test':
    case 'lab_result':
      return `${base}/health-records`
    case 'emergency_booking':
    case 'emergency':
      return `${base}/emergency`
    case 'prescription':
      return `${base}/prescriptions`
    case 'message':
      return `${base}/chat`
    case 'connection':
      return `${base}/network`
    case 'booking':
      return `${base}/bookings`
    default:
      break
  }

  // Fallback: match on title keywords
  const title = n.title.toLowerCase()
  if (title.includes('appointment') || title.includes('consultation'))
    return `${base}/consultations`
  if (title.includes('booking'))
    return `${base}/bookings`
  if (title.includes('prescription') || title.includes('refill') || title.includes('medication') || title.includes('pickup'))
    return `${base}/prescriptions`
  if (title.includes('lab') || title.includes('result') || title.includes('test'))
    return `${base}/health-records`
  if (title.includes('message') || title.includes('chat'))
    return `${base}/chat`
  if (title.includes('connection') || title.includes('network'))
    return `${base}/network`
  if (title.includes('emergency'))
    return `${base}/emergency`

  return null
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  userImage,
  userSubtitle,
  notificationCount,
  profileHref,
  networkHref,
  sidebarOpen,
  onToggleSidebar,
  onLogout,
  userId,
}) => {
  const { t } = useTranslation()
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

  // Real-time notification listener
  useEffect(() => {
    const handler = (e: CustomEvent<NotificationItem>) => {
      setNotifications(prev => [e.detail, ...prev].slice(0, 10))
    }
    window.addEventListener('notification:new' as string, handler as EventListener)
    return () => window.removeEventListener('notification:new' as string, handler as EventListener)
  }, [])

  const [autoUnreadCount, setAutoUnreadCount] = useState(0)
  const [pendingConnectionCount, setPendingConnectionCount] = useState(0)

  useEffect(() => {
    if (!userId) return
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`/api/users/${userId}/notifications?unread=true&limit=1`)
        const data = await res.json()
        if (data.meta?.unreadCount != null) {
          setAutoUnreadCount(data.meta.unreadCount)
        } else if (data.meta?.total != null) {
          setAutoUnreadCount(data.meta.total)
        }
      } catch {
        // silent
      }
    }
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [userId])

  // Fetch pending connection request count
  useEffect(() => {
    if (!userId || !networkHref) return
    const fetchPendingConnections = async () => {
      try {
        const res = await fetch(`/api/connections?userId=${userId}&type=received&status=pending`)
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setPendingConnectionCount(data.data.length)
        }
      } catch {
        // silent
      }
    }
    fetchPendingConnections()
    const interval = setInterval(fetchPendingConnections, 30000)
    return () => clearInterval(interval)
  }, [userId, networkHref])

  const unreadCount = notifications.filter(n => !n.readAt).length || autoUnreadCount || notificationCount

  return (
    <header role="banner" className="sticky top-0 z-50 flex-shrink-0">
      <div className="h-0.5 bg-gradient-to-r from-primary-blue via-primary-teal to-secondary-green" />
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2 md:py-2.5">
        <div className="flex items-center justify-between">
          {/* Left: mobile toggle + logo + user info */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? (
                <FaTimes className="text-base sm:text-lg" aria-hidden="true" />
              ) : (
                <FaBars className="text-base sm:text-lg" aria-hidden="true" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
              <HealthwyzLogo width={130} height={32} />
            </Link>

            <div className="hidden sm:flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-gray-200">
              <div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                  {userName}
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {userSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right: profile, notifications, language, logout */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            {/* Profile avatar link */}
            <Link
              href={profileHref}
              className="flex-shrink-0"
              aria-label="My Profile"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-blue-200 hover:border-blue-400 transition-colors"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              )}
            </Link>

            {/* Network / Connections */}
            {networkHref && (
              <Link
                href={networkHref}
                className="relative p-2 sm:p-2.5 md:p-3 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-lg hover:bg-blue-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`My Network${pendingConnectionCount > 0 ? `, ${pendingConnectionCount} pending requests` : ''}`}
              >
                <FaUserFriends className="text-sm sm:text-base md:text-lg" aria-hidden="true" />
                {pendingConnectionCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center font-bold" aria-hidden="true">
                    {pendingConnectionCount > 9 ? '9+' : pendingConnectionCount}
                  </span>
                )}
              </Link>
            )}

            {/* Notification bell + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleBellClick}
                className="relative p-2 sm:p-2.5 md:p-3 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-lg hover:bg-blue-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                <FaBell className="text-sm sm:text-base md:text-lg" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center font-bold" aria-hidden="true">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div role="region" aria-label="Notifications" aria-live="polite" className="fixed left-0 right-0 top-[52px] sm:absolute sm:left-auto sm:right-0 sm:top-full mt-0 sm:mt-2 w-full sm:w-96 bg-white sm:rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[calc(100vh-52px)] sm:max-h-[70vh] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-900 text-sm" id="notifications-heading">Notifications</h3>
                    {notifications.some(n => !n.readAt) && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                        aria-label="Mark all notifications as read"
                      >
                        <FaCheckDouble className="text-[10px]" aria-hidden="true" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto max-h-[calc(70vh-48px)]" role="list" aria-labelledby="notifications-heading">
                    {loadingNotifs ? (
                      <div className="p-6 text-center text-gray-500 text-sm" role="status">
                        Loading...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map(n => {
                        const notifHref = getNotificationHref(n, profileHref)
                        const content = (
                          <>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                              </div>
                              {!n.readAt && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" aria-label="Unread" />
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                          </>
                        )
                        const className = `block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${!n.readAt ? 'bg-blue-50/50' : ''}`
                        return notifHref ? (
                          <Link key={n.id} href={notifHref} role="listitem" className={className} onClick={() => setShowDropdown(false)}>
                            {content}
                          </Link>
                        ) : (
                          <div key={n.id} role="listitem" className={className}>
                            {content}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language switcher */}
            <LanguageSwitcher variant="header" />

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-3 md:px-3.5 py-1.5 sm:py-1.5 md:py-2 rounded-lg flex items-center gap-1 sm:gap-1.5 hover:from-red-600 hover:to-red-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Log out"
            >
              <FaSignOutAlt className="text-xs sm:text-sm md:text-sm" aria-hidden="true" />
              <span className="hidden sm:inline text-xs sm:text-xs md:text-sm">
                {t('common.logout')}
              </span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </header>
  )
}

export default DashboardHeader
