'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
 FaCalendarCheck, FaDollarSign, FaStar, 
  FaBell,  FaEdit, FaClock, FaFileExport,
 FaUserFriends
} from 'react-icons/fa'
import { IconType } from 'react-icons'

// Type Definitions
interface StatCardProps {
  icon: IconType
  title: string
  value: string | number
  change?: string
  color: string
}

interface Appointment {
  id: string
  familyName: string
  familyAvatar: string
  date: string
  time: string
  serviceType: string
  status: 'confirmed' | 'pending' | 'completed'
}

interface CaregiverDashboardData {
  name: string
  type: string
  avatar: string
  stats: {
    upcomingBookings: number
    familiesHelped: number
    monthlyEarnings: number
    rating: number
  }
  upcomingAppointments: Appointment[]
  earnings: {
    totalRevenue: number
    commission: number
    netPayout: number
  }
  profileCompletion: number
}

// Mock Data
const mockCaregiverData: CaregiverDashboardData = {
  name: 'Emma Williams',
  type: 'Professional Nanny',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=fef3c7',
  stats: {
    upcomingBookings: 3,
    familiesHelped: 42,
    monthlyEarnings: 2800,
    rating: 4.9,
  },
  upcomingAppointments: [
    { id: 'apt1', familyName: 'The Smith Family', familyAvatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Smith', date: 'Today', time: '09:00 AM - 5:00 PM', serviceType: 'Full-day Care', status: 'confirmed' },
    { id: 'apt2', familyName: 'The Garcia Family', familyAvatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Garcia', date: 'Tomorrow', time: '08:00 AM - 1:00 PM', serviceType: 'Toddler Care', status: 'confirmed' },
    { id: 'apt3', familyName: 'The Chen Family', familyAvatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Chen', date: 'Aug 27, 2025', time: '6:00 PM - 10:00 PM', serviceType: 'Evening Babysitting', status: 'pending' },
  ],
  earnings: {
    totalRevenue: 2800,
    commission: 350, // Assuming 12.5%
    netPayout: 2450,
  },
  profileCompletion: 85,
}

const StatCard = ({ icon: Icon, title, value, color }: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-white text-xl" />
      </div>
    </div>
  </div>
)

export default function CaregiverDashboardPage() {
  const [caregiverData] = useState<CaregiverDashboardData>(mockCaregiverData)

  const getStatusBadge = (status: 'confirmed' | 'pending' | 'completed') => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={caregiverData.avatar} alt={caregiverData.name} className="w-14 h-14 rounded-full border-2 border-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {caregiverData.name.split(' ')[0]}!</h1>
                <p className="text-gray-600">{caregiverData.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-purple-600">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </button>
              <Link href="/nanny/settings" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                <FaEdit />
                Manage Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={FaCalendarCheck} title="Upcoming Bookings" value={caregiverData.stats.upcomingBookings} color="bg-blue-500" />
          <StatCard icon={FaUserFriends} title="Families Helped" value={caregiverData.stats.familiesHelped} color="bg-green-500" />
          <StatCard icon={FaDollarSign} title="This Month's Earnings" value={`$${caregiverData.stats.monthlyEarnings.toLocaleString()}`} color="bg-purple-500" />
          <StatCard icon={FaStar} title="Parent Rating" value={caregiverData.stats.rating} color="bg-yellow-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Appointments Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                <Link href="/childcare-provider/appointments" className="text-purple-600 hover:underline font-medium">View All</Link>
              </div>
              <div className="space-y-4">
                {caregiverData.upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={apt.familyAvatar} alt={apt.familyName} className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{apt.familyName}</h3>
                        <p className="text-gray-600 text-sm">{apt.date} at {apt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(apt.status)}`}>
                         {apt.status}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings Dashboard */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Earnings Summary (This Month)</h2>
                    <button className="bg-purple-100 text-purple-700 font-semibold px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2 text-sm">
                        <FaFileExport />
                        Export Report
                    </button>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-gray-500 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">${caregiverData.earnings.totalRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Platform Fees (12.5%)</p>
                  <p className="text-3xl font-bold text-pink-500 mt-1">-${caregiverData.earnings.commission.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Your Payout</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">${caregiverData.earnings.netPayout.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Availability Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Availability</h3>
              <p className="text-sm text-gray-600 mb-4">Your schedule is visible to parents. Keep it updated to receive booking requests.</p>
              <Link href="/nanny/settings?tab=availability" className="w-full bg-purple-100 text-purple-800 text-center py-2.5 rounded-lg font-semibold hover:bg-purple-200 transition-colors flex items-center justify-center gap-2">
                <FaClock />
                Manage Calendar
              </Link>
            </div>
            
            {/* Profile Completion */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Enhance Your Profile</h3>
              <p className="text-white/90 text-sm mb-4">Caregivers with complete profiles get 3x more bookings.</p>
              <div className="bg-white/20 rounded-full h-2.5 mb-2">
                <div className="bg-white rounded-full h-2.5" style={{ width: `${caregiverData.profileCompletion}%` }}></div>
              </div>
              <p className="text-sm mb-4 font-medium">{caregiverData.profileCompletion}% Complete</p>
              <Link href="/nanny/settings?tab=documents" className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
                Upload Certifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}