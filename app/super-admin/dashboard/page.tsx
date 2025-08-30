'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaUsersCog, FaUserCheck, FaChartBar, FaShieldAlt, FaBell, FaCogs
} from 'react-icons/fa'

const SuperAdminDashboard = () => {
  const stats = [
    { title: 'Total Admins', value: '12', icon: FaUsersCog, trend: 5, color: 'bg-blue-500' },
    { title: 'Pending Approvals', value: '3', icon: FaUserCheck, trend: 0, color: 'bg-orange-500' },
    { title: 'Platform Revenue (Month)', value: '$124,500', icon: FaChartBar, trend: 8, color: 'bg-green-500' },
    { title: 'System Status', value: 'Operational', icon: FaShieldAlt, trend: 0, color: 'bg-teal-500' }
  ]

  const quickActions = [
    { title: 'Manage Admins', href: '/super-admin/admins', icon: FaUsersCog, count: 3 },
    { title: 'Platform Analytics', href: '/super-admin/analytics', icon: FaChartBar },
    { title: 'System Settings', href: '/super-admin/settings', icon: FaCogs },
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600">Oversee and manage the entire platform.</p>
          </div>
          <div className="relative">
            <FaBell className="text-xl text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.trend > 0 && <p className="text-sm text-green-600 mt-1">+{stat.trend}% this month</p>}
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, idx) => (
              <Link key={idx} href={action.href} className="p-4 border-2 rounded-lg hover:border-blue-500 transition group">
                 <div className="flex items-center justify-between">
                    <action.icon className="text-3xl text-blue-600 group-hover:scale-110 transition-transform" />
                    {action.count && (
                      <span className="bg-orange-500 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full">{action.count}</span>
                    )}
                 </div>
                 <p className="font-semibold text-gray-900 mt-3 group-hover:text-blue-600">{action.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default SuperAdminDashboard