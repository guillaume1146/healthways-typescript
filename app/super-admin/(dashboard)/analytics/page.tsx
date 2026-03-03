'use client'

import { useState, useEffect } from 'react'
import {
  FaUsers, FaUserMd, FaHandshake, FaChartLine,
  FaSpinner, FaChartBar
} from 'react-icons/fa'

interface MetricsData {
  users: {
    total: number
    active: number
    patients: number
    doctors: number
    nurses: number
    nannies: number
    pharmacists: number
    labTechs: number
    emergencyWorkers: number
    insuranceReps: number
    corporateAdmins: number
    referralPartners: number
  }
  bookings: {
    total: number
    pending: number
    upcoming: number
    completed: number
    cancelled: number
  }
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
  }
  recentActivity: {
    newUsersThisWeek: number
    bookingsThisWeek: number
  }
}

export default function SuperAdminAnalyticsPage() {
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<MetricsData | null>(null)

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

    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/admin/metrics')
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setMetrics(json.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <FaChartBar className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">Unable to load analytics data</p>
          <p className="text-gray-400 text-sm mt-1">Please try again later</p>
        </div>
      </div>
    )
  }

  const providers = metrics.users.doctors + metrics.users.nurses + metrics.users.nannies +
    metrics.users.pharmacists + metrics.users.labTechs + metrics.users.emergencyWorkers
  const partners = metrics.users.insuranceReps + metrics.users.corporateAdmins + metrics.users.referralPartners

  const revenueGrowth = metrics.revenue.lastMonth > 0
    ? Math.round(((metrics.revenue.thisMonth - metrics.revenue.lastMonth) / metrics.revenue.lastMonth) * 100 * 10) / 10
    : 0

  const userBreakdown = [
    { label: 'Patients', count: metrics.users.patients, color: 'bg-blue-500' },
    { label: 'Doctors', count: metrics.users.doctors, color: 'bg-green-500' },
    { label: 'Nurses', count: metrics.users.nurses, color: 'bg-teal-500' },
    { label: 'Nannies', count: metrics.users.nannies, color: 'bg-pink-500' },
    { label: 'Pharmacists', count: metrics.users.pharmacists, color: 'bg-purple-500' },
    { label: 'Lab Technicians', count: metrics.users.labTechs, color: 'bg-indigo-500' },
    { label: 'Emergency Workers', count: metrics.users.emergencyWorkers, color: 'bg-red-500' },
    { label: 'Insurance Reps', count: metrics.users.insuranceReps, color: 'bg-amber-500' },
    { label: 'Corporate Admins', count: metrics.users.corporateAdmins, color: 'bg-slate-500' },
    { label: 'Referral Partners', count: metrics.users.referralPartners, color: 'bg-cyan-500' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaChartLine className="text-2xl text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        </div>
        <p className="text-gray-600">Comprehensive platform statistics and performance metrics</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <FaUsers className="text-xl text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{metrics.users.total.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2">
            +{metrics.recentActivity.newUsersThisWeek} this week
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <FaUserMd className="text-xl text-green-600" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Healthcare Providers</h3>
          <p className="text-2xl font-bold text-gray-900">{providers.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">
            {metrics.users.doctors} doctors, {metrics.users.nurses} nurses
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <FaHandshake className="text-xl text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Total Bookings</h3>
          <p className="text-2xl font-bold text-gray-900">{metrics.bookings.total.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2">
            +{metrics.recentActivity.bookingsThisWeek} this week
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50">
              <FaChartLine className="text-xl text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Revenue This Month</h3>
          <p className="text-2xl font-bold text-gray-900">Rs {metrics.revenue.thisMonth.toLocaleString()}</p>
          <p className={`text-xs mt-2 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}% vs last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">User Breakdown</h2>
          <div className="space-y-3">
            {userBreakdown.map((item) => {
              const percentage = metrics.users.total > 0
                ? Math.round((item.count / metrics.users.total) * 100)
                : 0
              return (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm text-gray-600">{item.count.toLocaleString()} ({percentage}%)</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} rounded-full h-2 transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 1)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bookings & Revenue */}
        <div className="space-y-6">
          {/* Bookings Overview */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bookings Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Pending', value: metrics.bookings.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { label: 'Upcoming', value: metrics.bookings.upcoming, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Completed', value: metrics.bookings.completed, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Cancelled', value: metrics.bookings.cancelled, color: 'text-red-600', bg: 'bg-red-50' },
              ].map((item) => (
                <div key={item.label} className={`${item.bg} rounded-lg p-4`}>
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className={`text-xl font-bold ${item.color}`}>{item.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-bold text-gray-900">Rs {metrics.revenue.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">This Month</span>
                <span className="font-bold text-green-600">Rs {metrics.revenue.thisMonth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Last Month</span>
                <span className="font-bold text-gray-700">Rs {metrics.revenue.lastMonth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Partners</span>
                <span className="font-bold text-gray-900">{partners.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
