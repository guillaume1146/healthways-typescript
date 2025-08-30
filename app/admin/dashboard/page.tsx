'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaUsers, FaUserMd, FaUserNurse, FaChild, FaAmbulance, FaPills, FaFlask,
  FaCheckCircle, FaChartBar, FaDollarSign, FaChartLine, FaPercentage,
  FaNewspaper, FaCog, FaBell, FaHome, FaFileAlt, FaUsersCog
} from 'react-icons/fa'
import { IconType } from 'react-icons'

interface StatCard {
  title: string
  value: string | number
  icon: IconType
  trend?: number
  color: string
}

interface QuickAction {
  title: string
  icon: IconType
  href: string
  color: string
  count?: number
}

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const stats: StatCard[] = [
    { title: 'Total Users', value: '12,847', icon: FaUsers, trend: 12, color: 'bg-blue-500' },
    { title: 'Pending Validations', value: 28, icon: FaCheckCircle, color: 'bg-orange-500' },
    { title: 'Monthly Revenue', value: '$124,500', icon: FaDollarSign, trend: 8, color: 'bg-green-500' },
    { title: 'Active Sessions', value: 1847, icon: FaChartLine, trend: 23, color: 'bg-purple-500' }
  ]

  const categoryStats = [
    { category: 'Doctors', count: 2341, active: 1892, pending: 12 },
    { category: 'Nurses', count: 3456, active: 3102, pending: 8 },
    { category: 'Child Care', count: 892, active: 756, pending: 5 },
    { category: 'Emergency', count: 456, active: 402, pending: 3 },
    { category: 'Pharmacy', count: 678, active: 621, pending: 4 },
    { category: 'Lab Tech', count: 234, active: 198, pending: 6 }
  ]

  const quickActions: QuickAction[] = [
    { title: 'Profile Management', icon: FaUsersCog, href: '/admin/profiles', color: 'bg-blue-500', count: 7057 },
    { title: 'Account Validation', icon: FaCheckCircle, href: '/admin/validation', color: 'bg-orange-500', count: 28 },
    { title: 'Financial Reports', icon: FaChartBar, href: '/admin/financial', color: 'bg-green-500' },
    { title: 'User Statistics', icon: FaChartLine, href: '/admin/statistics', color: 'bg-purple-500' },
    { title: 'Commission Setup', icon: FaPercentage, href: '/admin/commissions', color: 'bg-indigo-500' },
    { title: 'CMS Management', icon: FaNewspaper, href: '/admin/cms', color: 'bg-pink-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FaCog className="text-3xl text-gray-700" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">System Administration & Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  5
                </span>
              </button>
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.trend && (
                    <p className="text-sm text-green-600 mt-1">
                      +{stat.trend}% from last {selectedPeriod}
                    </p>
                  )}
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
                    {action.count && (
                      <p className="text-gray-600 text-sm mt-1">
                        {action.count.toLocaleString()} items
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Statistics */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Provider Categories</h2>
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
                            href={`/admin/profiles?category=${cat.category.toLowerCase()}`}
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FaUserMd className="text-blue-600 text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New doctor registration</p>
                    <p className="text-xs text-gray-500">Dr. Smith - 5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <FaCheckCircle className="text-green-600 text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Profile approved</p>
                    <p className="text-xs text-gray-500">Nurse Johnson - 1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <FaChartBar className="text-purple-600 text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Monthly report generated</p>
                    <p className="text-xs text-gray-500">System - 2 hours ago</p>
                  </div>
                </div>
              </div>
              <button className="text-blue-600 text-sm hover:underline mt-4">
                View All Activities
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Server Load</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2 w-5/12"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Database Usage</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 rounded-full h-2 w-8/12"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">API Response Time</span>
                    <span className="font-medium text-green-600">124ms</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Admin Tools</h3>
              <div className="space-y-2">
                <Link href="/admin/settings" className="flex items-center gap-2 text-white/90 hover:text-white">
                  <FaCog /> System Settings
                </Link>
                <Link href="/admin/logs" className="flex items-center gap-2 text-white/90 hover:text-white">
                  <FaFileAlt /> Activity Logs
                </Link>
                <Link href="/admin/backup" className="flex items-center gap-2 text-white/90 hover:text-white">
                  <FaHome /> Backup & Restore
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard