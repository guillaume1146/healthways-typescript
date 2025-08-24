'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaChartLine, FaUsers, FaEye, FaCalendarAlt, FaArrowUp, FaArrowDown,
  FaUserMd, FaUserNurse, FaChild, FaAmbulance, FaPills, FaFlask,
  FaClock, FaGlobeAmericas, FaMobileAlt, FaDesktop
} from 'react-icons/fa'

interface CategoryStats {
  category: string
  activeUsers: number
  newUsers: number
  totalBookings: number
  avgSessionTime: string
  conversionRate: number
  growth: number
}

interface TimeSeriesData {
  date: string
  users: number
  bookings: number
  visits: number
}

const mockCategoryStats: CategoryStats[] = [
  { category: 'Doctors', activeUsers: 1892, newUsers: 145, totalBookings: 2341, avgSessionTime: '12:34', conversionRate: 23.5, growth: 12 },
  { category: 'Nurses', activeUsers: 3102, newUsers: 234, totalBookings: 4567, avgSessionTime: '15:20', conversionRate: 18.2, growth: 8 },
  { category: 'Child Care', activeUsers: 756, newUsers: 67, totalBookings: 892, avgSessionTime: '10:15', conversionRate: 15.7, growth: -2 },
  { category: 'Emergency', activeUsers: 402, newUsers: 23, totalBookings: 567, avgSessionTime: '08:45', conversionRate: 34.2, growth: 15 },
  { category: 'Pharmacy', activeUsers: 621, newUsers: 89, totalBookings: 1234, avgSessionTime: '06:30', conversionRate: 28.9, growth: 22 },
  { category: 'Lab Tech', activeUsers: 198, newUsers: 12, totalBookings: 345, avgSessionTime: '09:10', conversionRate: 19.4, growth: 5 }
]

const mockTimeSeriesData: TimeSeriesData[] = [
  { date: '2025-08-18', users: 2450, bookings: 234, visits: 5670 },
  { date: '2025-08-19', users: 2680, bookings: 267, visits: 6230 },
  { date: '2025-08-20', users: 2590, bookings: 245, visits: 5890 },
  { date: '2025-08-21', users: 2820, bookings: 289, visits: 6450 },
  { date: '2025-08-22', users: 3100, bookings: 312, visits: 7200 },
  { date: '2025-08-23', users: 2950, bookings: 298, visits: 6800 },
  { date: '2025-08-24', users: 3200, bookings: 325, visits: 7500 }
]

export default function UserStatistics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedMetric, setSelectedMetric] = useState('users')

  const totalActiveUsers = mockCategoryStats.reduce((sum, cat) => sum + cat.activeUsers, 0)
  const totalNewUsers = mockCategoryStats.reduce((sum, cat) => sum + cat.newUsers, 0)
  const totalBookings = mockCategoryStats.reduce((sum, cat) => sum + cat.totalBookings, 0)
  const avgConversionRate = mockCategoryStats.reduce((sum, cat) => sum + cat.conversionRate, 0) / mockCategoryStats.length

  const getCategoryIcon = (category: string): React.JSX.Element => {
    const icons: Record<string, React.JSX.Element> = {
      'Doctors': <FaUserMd className="text-blue-600" />,
      'Nurses': <FaUserNurse className="text-purple-600" />,
      'Child Care': <FaChild className="text-pink-600" />,
      'Emergency': <FaAmbulance className="text-red-600" />,
      'Pharmacy': <FaPills className="text-green-600" />,
      'Lab Tech': <FaFlask className="text-orange-600" />
    }
    return icons[category] || <FaUsers className="text-gray-600" />
  }

  const getMaxValue = () => {
    switch(selectedMetric) {
      case 'users': return Math.max(...mockTimeSeriesData.map(d => d.users))
      case 'bookings': return Math.max(...mockTimeSeriesData.map(d => d.bookings))
      case 'visits': return Math.max(...mockTimeSeriesData.map(d => d.visits))
      default: return 100
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User & Visit Statistics</h1>
              <p className="text-gray-600">Analytics and growth metrics by category</p>
            </div>
            <Link href="/admin/dashboard" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Active Users</span>
              <FaUsers className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalActiveUsers.toLocaleString()}</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
              <FaArrowUp /> 12% this {selectedPeriod}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">New Users</span>
              <FaUsers className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalNewUsers}</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
              <FaArrowUp /> 8% growth
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Bookings</span>
              <FaCalendarAlt className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalBookings.toLocaleString()}</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
              <FaArrowUp /> 15% increase
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Avg Conversion</span>
              <FaChartLine className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgConversionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mt-2">Booking rate</p>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Growth Trends</h2>
            <div className="flex gap-2">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
              </select>
              <div className="flex rounded-lg border">
                <button 
                  onClick={() => setSelectedMetric('users')}
                  className={`px-3 py-1 text-sm ${selectedMetric === 'users' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  Users
                </button>
                <button 
                  onClick={() => setSelectedMetric('bookings')}
                  className={`px-3 py-1 text-sm ${selectedMetric === 'bookings' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  Bookings
                </button>
                <button 
                  onClick={() => setSelectedMetric('visits')}
                  className={`px-3 py-1 text-sm ${selectedMetric === 'visits' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  Visits
                </button>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {mockTimeSeriesData.map((data, idx) => {
              const value = data[selectedMetric as keyof TimeSeriesData] as number
              const height = (value / getMaxValue()) * 100
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-600 rounded-t" style={{ height: `${height}%` }}></div>
                  <p className="text-xs text-gray-600 mt-2">{data.date.slice(5)}</p>
                  <p className="text-xs font-medium">{value}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Statistics */}
        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics by Category</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">Active Users</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">New Users</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">Bookings</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">Avg Session</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">Conversion</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">Growth</th>
                </tr>
              </thead>
              <tbody>
                {mockCategoryStats.map((stat, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(stat.category)}
                        <span className="font-medium">{stat.category}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-medium">{stat.activeUsers.toLocaleString()}</td>
                    <td className="p-3 text-right">+{stat.newUsers}</td>
                    <td className="p-3 text-right">{stat.totalBookings.toLocaleString()}</td>
                    <td className="p-3 text-right text-gray-600">{stat.avgSessionTime}</td>
                    <td className="p-3 text-right">
                      <span className="font-medium">{stat.conversionRate}%</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`flex items-center justify-end gap-1 ${stat.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.growth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {Math.abs(stat.growth)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-bold text-gray-900 mb-4">Peak Usage Times</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Morning (6AM-12PM)</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Afternoon (12PM-6PM)</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Evening (6PM-12AM)</span>
                <span className="font-medium">23%</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-bold text-gray-900 mb-4">Device Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><FaMobileAlt /> Mobile</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><FaDesktop /> Desktop</span>
                <span className="font-medium">28%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><FaGlobeAmericas /> Tablet</span>
                <span className="font-medium">4%</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-bold text-gray-900 mb-4">Top Locations</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Port Louis</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Curepipe</span>
                <span className="font-medium">22%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vacoas</span>
                <span className="font-medium">18%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}