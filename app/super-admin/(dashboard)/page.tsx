'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import GlobalMetrics from './GlobalMetrics'
import RevenueAnalytics from './RevenueAnalytics'
import PlatformHealth from './PlatformHealth'
import ActivityHeatmap from './ActivityHeatMap'
import {
  FaExclamationTriangle,
  FaCog, FaChartPie, FaUsersCog
} from 'react-icons/fa'

interface Alert {
  type: string
  message: string
  time: string
}

const QuickActions = () => {
  const actions = [
    { name: 'Manage Admins', href: '/super-admin/regional-admins', icon: FaUsersCog, color: 'text-blue-500' },
    { name: 'Full Analytics', href: '/super-admin/analytics', icon: FaChartPie, color: 'text-purple-500' },
    { name: 'System Settings', href: '/super-admin/settings', icon: FaCog, color: 'text-slate-500' },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
          >
            <action.icon className={`text-3xl ${action.color}`} />
            <div>
              <p className="font-semibold text-lg text-gray-900">{action.name}</p>
              <p className="text-sm text-gray-500">Go to {action.name.toLowerCase()} section</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function SuperAdminDashboard() {
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [criticalAlerts, setCriticalAlerts] = useState<Alert[]>([])

  const regions = [
    { code: 'all', name: 'All Regions', flag: '\u{1F30D}' },
    { code: 'MU', name: 'Mauritius', flag: '\u{1F1F2}\u{1F1FA}' },
    { code: 'KE', name: 'Kenya', flag: '\u{1F1F0}\u{1F1EA}' },
    { code: 'MG', name: 'Madagascar', flag: '\u{1F1F2}\u{1F1EC}' },
    { code: 'ZA', name: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}' },
    { code: 'NG', name: 'Nigeria', flag: '\u{1F1F3}\u{1F1EC}' },
  ]

  // Fetch real alerts from API
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/admin/alerts')
        if (res.ok) {
          const json = await res.json()
          if (json.success && Array.isArray(json.data)) {
            setCriticalAlerts(json.data)
          }
        }
      } catch {
        // Keep empty on error
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Filters */}
      <div className="flex justify-end gap-4 mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          {regions.map(region => (
            <option key={region.code} value={region.code}>
              {region.flag} {region.name}
            </option>
          ))}
        </select>
      </div>

      {/* Critical Alerts Bar */}
      {criticalAlerts.length > 0 && (
        <div className="bg-yellow-50 border-b border-yellow-200 rounded-lg mb-6">
          <div className="px-6 py-3">
            <div className="flex items-center gap-4 overflow-x-auto">
              <FaExclamationTriangle className="text-yellow-600 flex-shrink-0" />
              {criticalAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg flex-shrink-0">
                  <span className={`w-2 h-2 rounded-full ${
                    alert.type === 'error' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-sm">{alert.message}</span>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <QuickActions />

      <GlobalMetrics timeRange={timeRange} region={selectedRegion} />

      <RevenueAnalytics timeRange={timeRange} region={selectedRegion} />

      <PlatformHealth />

      <ActivityHeatmap />
    </>
  )
}
