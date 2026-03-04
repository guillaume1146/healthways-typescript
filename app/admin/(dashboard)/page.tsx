'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaUsers, FaUserMd,
  FaCheckCircle, FaChartBar, FaDollarSign, FaChartLine,
  FaNewspaper, FaCog, FaFileAlt, FaUsersCog, FaSpinner, FaShieldAlt
} from 'react-icons/fa'
import { IconType } from 'react-icons'
import WalletBalanceCard from '@/components/shared/WalletBalanceCard'

function SystemHealthCard() {
  const [health, setHealth] = useState<{
    cpuUsage: number; memoryUsage: number; responseTime: number
  } | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/admin/system-health')
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setHealth({
              cpuUsage: json.data.performance.cpuUsage,
              memoryUsage: json.data.performance.memoryUsage,
              responseTime: json.data.services?.[0]?.responseTime ?? 0,
            })
          }
        }
      } catch {
        // fail silently
      }
    }
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getBarColor = (v: number) => v > 80 ? 'bg-red-500' : v > 60 ? 'bg-yellow-500' : 'bg-green-500'

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
      {health ? (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Server Load</span>
              <span className="font-medium">{health.cpuUsage}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div className={`${getBarColor(health.cpuUsage)} rounded-full h-2`} style={{ width: `${health.cpuUsage}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Database Usage</span>
              <span className="font-medium">{health.memoryUsage}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div className={`${getBarColor(health.memoryUsage)} rounded-full h-2`} style={{ width: `${health.memoryUsage}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">API Response Time</span>
              <span className={`font-medium ${health.responseTime < 200 ? 'text-green-600' : 'text-yellow-600'}`}>{health.responseTime}ms</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-400 text-sm">Loading health data...</div>
      )}
    </div>
  )
}

interface CategoryStat {
  category: string
  count: number
  active: number
  pending: number
}

interface ActivityItem {
  type: string
  message: string
  time: string
}

interface QuickAction {
  title: string
  icon: IconType
  href: string
  color: string
}

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingValidations: 0,
    monthlyRevenue: 0,
    activeSessions: 0,
  })
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUserId(parsed.id)
      }
    } catch {
      // Corrupted localStorage
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/admin/dashboard')
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setStats(json.data.stats)
            setCategoryStats(json.data.categoryStats || [])
            setRecentActivity(json.data.recentActivity || [])
          }
        }
      } catch (error) {
        console.error('Failed to fetch admin dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [userId])

  const quickActions: QuickAction[] = [
    { title: 'User Management', icon: FaUsersCog, href: '/admin/users', color: 'bg-blue-500' },
    { title: 'Account Validation', icon: FaCheckCircle, href: '/admin/users', color: 'bg-orange-500' },
    { title: 'Financial Reports', icon: FaChartBar, href: '/admin/billing', color: 'bg-green-500' },
    { title: 'Analytics', icon: FaChartLine, href: '/admin/analytics', color: 'bg-purple-500' },
    { title: 'Content Management', icon: FaNewspaper, href: '/admin/content', color: 'bg-pink-500' },
    { title: 'Security', icon: FaShieldAlt, href: '/admin/security', color: 'bg-indigo-500' }
  ]

  return (
    <>
      {/* Wallet Balance */}
      {userId && (
        <div className="mb-6">
          <WalletBalanceCard userId={userId} />
        </div>
      )}

      {/* Period Filter */}
      <div className="flex justify-end mb-6">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {([
            { title: 'Total Users', value: loading ? '...' : stats.totalUsers.toLocaleString(), icon: FaUsers, color: 'bg-blue-500' },
            { title: 'Pending Validations', value: loading ? '...' : stats.pendingValidations, icon: FaCheckCircle, color: 'bg-orange-500' },
            { title: 'Monthly Revenue', value: loading ? '...' : `Rs ${stats.monthlyRevenue.toLocaleString()}`, icon: FaDollarSign, color: 'bg-green-500' },
            { title: 'Active Sessions', value: loading ? '...' : stats.activeSessions, icon: FaChartLine, color: 'bg-purple-500' },
          ] as const).map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.href}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                  >
                    <div className={`p-3 rounded-full ${action.color} w-fit mb-3`}>
                      <action.icon className="text-white text-xl" />
                    </div>
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Statistics */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Provider Categories</h2>
              {loading ? (
                <div className="flex justify-center py-8">
                  <FaSpinner className="animate-spin text-2xl text-blue-500" />
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-medium text-gray-700">Category</th>
                      <th className="p-3 text-center font-medium text-gray-700">Total</th>
                      <th className="p-3 text-center font-medium text-gray-700">Active</th>
                      <th className="p-3 text-center font-medium text-gray-700">Pending</th>
                      <th className="p-3 text-center font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryStats.map((cat, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{cat.category}</td>
                        <td className="p-3 text-center">{cat.count.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span className="text-green-600">{cat.active.toLocaleString()}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            {cat.pending}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Link
                            href={`/admin/users?type=${cat.category.toLowerCase()}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h3>
              {loading ? (
                <div className="flex justify-center py-4">
                  <FaSpinner className="animate-spin text-xl text-blue-500" />
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FaUserMd className="text-blue-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{new Date(activity.time).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>

            <SystemHealthCard />

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Admin Tools</h3>
              <div className="space-y-2">
                <Link href="/admin/settings" className="flex items-center gap-2 text-white/90 hover:text-white">
                  <FaCog /> System Settings
                </Link>
                <Link href="/admin/analytics" className="flex items-center gap-2 text-white/90 hover:text-white">
                  <FaChartBar /> Analytics
                </Link>
                <Link href="/admin/security" className="flex items-center gap-2 text-white/90 hover:text-white">
                  <FaFileAlt /> Security Logs
                </Link>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default AdminDashboard