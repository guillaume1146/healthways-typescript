'use client'

import { useState, useEffect } from 'react'
import {
  FaUsers, FaUserCheck, FaUserPlus, FaDollarSign,
  FaChartLine, FaSpinner
} from 'react-icons/fa'

interface DashboardStats {
  totalUsers: number
  pendingValidations: number
  monthlyRevenue: number
  activeSessions: number
}

interface CategoryStat {
  category: string
  count: number
  active: number
  pending: number
}

export default function AdminAnalyticsPage() {
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingValidations: 0,
    monthlyRevenue: 0,
    activeSessions: 0,
  })
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])

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

    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/dashboard')
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setStats(json.data.stats)
            setCategoryStats(json.data.categoryStats || [])
          }
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [userId])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: FaUsers,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions.toLocaleString(),
      icon: FaUserCheck,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Pending Validations',
      value: stats.pendingValidations.toLocaleString(),
      icon: FaUserPlus,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Monthly Revenue',
      value: `Rs ${stats.monthlyRevenue.toLocaleString()}`,
      icon: FaDollarSign,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaChartLine className="text-2xl text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        </div>
        <p className="text-gray-600">Overview of platform performance and key metrics</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgLight}`}>
                    <stat.icon className={`text-xl ${stat.textColor}`} />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* User Distribution by Category */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Distribution by Category</h2>
            {categoryStats.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No category data available</p>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((cat, idx) => {
                  const total = stats.totalUsers || 1
                  const percentage = Math.round((cat.count / total) * 100)
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{cat.category}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">{cat.count} users</span>
                          <span className="text-green-600">{cat.active} active</span>
                          <span className="text-orange-600">{cat.pending} pending</span>
                          <span className="font-medium text-gray-900">{percentage}%</span>
                        </div>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Registered Users</span>
                  <span className="font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Awaiting Validation</span>
                  <span className="font-semibold text-orange-600">{stats.pendingValidations}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Active Sessions Now</span>
                  <span className="font-semibold text-green-600">{stats.activeSessions}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">User Categories</span>
                  <span className="font-semibold text-gray-900">{categoryStats.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold text-gray-900">Rs {stats.monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Average Per User</span>
                  <span className="font-semibold text-gray-900">
                    Rs {stats.totalUsers > 0 ? Math.round(stats.monthlyRevenue / stats.totalUsers).toLocaleString() : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
