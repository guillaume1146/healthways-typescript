'use client'

import { useState } from 'react'
import Link from 'next/link'
import GlobalMetrics from './GlobalMetrics'
import RevenueAnalytics from './RevenueAnalytics'
import PlatformHealth from './PlatformHealth'
import ActivityHeatmap from './ActivityHeatMap'
import {
   FaExclamationTriangle, FaBell,
  FaCog, FaChartPie, FaUsersCog
} from 'react-icons/fa'

const QuickActions = () => {
  const actions = [
    { name: 'Manage Admins', href: '/super-admin/regional-admins', icon: FaUsersCog, color: 'text-blue-500' },
    { name: 'Full Analytics', href: '/super-admin/analytics', icon: FaChartPie, color: 'text-purple-500' },
    { name: 'System Settings', href: '/super-admin/settings', icon: FaCog, color: 'text-slate-500' },
  ];

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
  );
};


export default function SuperAdminDashboard() {
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedRegion, setSelectedRegion] = useState('all')
  
  const regions = [
    { code: 'all', name: 'All Regions', flag: '🌍' },
    { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' }
  ]

  const criticalAlerts = [
    { type: 'error', message: 'High error rate detected in Kenya region', time: '5 min ago' },
    { type: 'warning', message: 'Payment gateway latency in Mauritius', time: '15 min ago' },
    { type: 'info', message: '3 new regional admin applications pending', time: '1 hour ago' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Global Platform Command Center
              </h1>
              <p className="text-gray-600 mt-1">Real-time monitoring and control across all regions</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
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

              {/* Region Selector */}
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

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <FaBell className="text-xl text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {criticalAlerts.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts Bar */}
      {criticalAlerts.length > 0 && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-6 py-3">
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
      <div className="container mx-auto px-6 py-8">
        
        <QuickActions />

        <GlobalMetrics timeRange={timeRange} region={selectedRegion} />
        
        <RevenueAnalytics timeRange={timeRange} region={selectedRegion} />
        
        <PlatformHealth />
        
        {/* FIX: Removed the 'regions' prop as the component no longer accepts it */}
        <ActivityHeatmap />
        
      </div>
    </div>
  )
}