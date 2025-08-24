'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaUserNurse, FaCalendarCheck, FaDollarSign, FaStar, FaChartLine, 
  FaBell, FaClipboardList, FaEdit, FaClock, FaUniversity, FaBan,
  FaFileInvoiceDollar, FaCheckCircle, FaSpinner, FaTimesCircle
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

interface EarningSummary {
  totalRevenue: number
  commission: number
  netPayout: number
  period: 'monthly' | 'weekly'
}

interface Appointment {
  id: string
  patientName: string
  patientAvatar: string
  time: string
  serviceType: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

interface NurseDashboardData {
  name: string
  specialization: string
  avatar: string
  stats: {
    todayAppointments: number
    completedServices: number
    monthlyEarnings: number
    rating: number
  }
  upcomingAppointments: Appointment[]
  earnings: EarningSummary
  profileCompletion: number
}

// Mock Data
const mockNurseDashboardData: NurseDashboardData = {
  name: 'Maria Thompson',
  specialization: 'Elderly Care Specialist',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=e0f2fe',
  stats: {
    todayAppointments: 4,
    completedServices: 1250,
    monthlyEarnings: 5500,
    rating: 4.9,
  },
  upcomingAppointments: [
    { id: 'apt1', patientName: 'George Miller', patientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George', time: '10:00 AM', serviceType: 'Wound Care', status: 'upcoming' },
    { id: 'apt2', patientName: 'Susan Webb', patientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Susan', time: '02:30 PM', serviceType: 'Medication Management', status: 'upcoming' },
    { id: 'apt3', patientName: 'Robert Chen', patientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert', time: '09:00 AM (Yesterday)', serviceType: 'Diabetes Management', status: 'completed' },
  ],
  earnings: {
    totalRevenue: 5500,
    commission: 550, // Assuming 10%
    netPayout: 4950,
    period: 'monthly',
  },
  profileCompletion: 90,
}

const StatCard = ({ icon: Icon, title, value, change, color }: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-white text-xl" />
      </div>
    </div>
  </div>
)

const AppointmentStatusIcon = ({ status }: { status: 'upcoming' | 'completed' | 'cancelled' }) => {
  if (status === 'completed') return <FaCheckCircle className="text-green-500" />
  if (status === 'upcoming') return <FaSpinner className="text-blue-500 animate-spin" />
  if (status === 'cancelled') return <FaTimesCircle className="text-red-500" />
  return null
}

export default function NurseDashboardPage() {
  const [nurseData] = useState<NurseDashboardData>(mockNurseDashboardData)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={nurseData.avatar} alt={nurseData.name} className="w-14 h-14 rounded-full border-2 border-teal-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {nurseData.name.split(' ')[0]}!</h1>
                <p className="text-gray-600">{nurseData.specialization}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-teal-600">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </button>
              <Link href="/nurse/settings" className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center gap-2">
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
          <StatCard
            icon={FaCalendarCheck}
            title="Today's Appointments"
            value={nurseData.stats.todayAppointments}
            color="bg-blue-500"
          />
          <StatCard
            icon={FaClipboardList}
            title="Total Services Completed"
            value={nurseData.stats.completedServices}
            color="bg-green-500"
          />
          <StatCard
            icon={FaDollarSign}
            title="This Month's Earnings"
            value={`$${nurseData.stats.monthlyEarnings.toLocaleString()}`}
            change="+15%"
            color="bg-purple-500"
          />
          <StatCard
            icon={FaStar}
            title="Patient Rating"
            value={nurseData.stats.rating}
            color="bg-yellow-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Appointments Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                <Link href="/nurse/appointments" className="text-teal-600 hover:underline font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {nurseData.upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={apt.patientAvatar} alt={apt.patientName} className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{apt.patientName}</h3>
                        <p className="text-gray-600 text-sm">{apt.time} • {apt.serviceType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                         apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                         apt.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                         'bg-red-100 text-red-800'
                       }`}>
                         {apt.status}
                       </span>
                      <button className="text-gray-400 hover:text-gray-600">...</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings Dashboard */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Earnings Summary (Monthly)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">${nurseData.earnings.totalRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Platform Commission (10%)</p>
                  <p className="text-3xl font-bold text-red-500 mt-1">-${nurseData.earnings.commission.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Your Net Payout</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">${nurseData.earnings.netPayout.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-center text-gray-600">Next payout is scheduled for the 1st of next month.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Availability Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Availability</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your schedule is set for this week. Update your availability to get more bookings.
              </p>
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <FaCheckCircle />
                <span className="text-sm font-medium">Available for emergency bookings</span>
              </div>
              <Link href="/nurse/settings?tab=availability" className="w-full bg-teal-100 text-teal-800 text-center py-2.5 rounded-lg font-semibold hover:bg-teal-200 transition-colors flex items-center justify-center gap-2">
                <FaClock />
                Manage Schedule
              </Link>
            </div>
            
            {/* Payment Configuration */}
             <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Details</h3>
               <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaUniversity className="text-green-600 text-xl" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Bank Account Verified</p>
                  <p className="text-xs text-gray-600">Payouts are sent to **** **** 1234</p>
                </div>
              </div>
              <Link href="/nurse/settings?tab=payments" className="w-full bg-gray-100 text-gray-800 text-center mt-4 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <FaFileInvoiceDollar />
                View Transactions
              </Link>
            </div>

            {/* Profile Completion */}
            <div className="bg-gradient-to-br from-teal-600 to-blue-600 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Complete Your Profile</h3>
              <p className="text-white/90 text-sm mb-4">
                A complete profile helps you get chosen by more patients.
              </p>
              <div className="bg-white/20 rounded-full h-2.5 mb-2">
                <div className="bg-white rounded-full h-2.5" style={{ width: `${nurseData.profileCompletion}%` }}></div>
              </div>
              <p className="text-sm mb-4 font-medium">{nurseData.profileCompletion}% Complete</p>
              <Link href="/nurse/settings?tab=documents" className="bg-white text-teal-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
                Upload Documents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}