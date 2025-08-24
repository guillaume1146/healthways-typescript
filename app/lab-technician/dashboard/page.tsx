'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaFlask, FaClipboardCheck, FaDollarSign, FaChartLine, 
  FaBell, FaEdit, FaClock, FaFileExport,FaStar,FaFileUpload,
  FaCheckCircle, FaSpinner, FaMicroscope, FaUserFriends
} from 'react-icons/fa'
import { IconType } from 'react-icons'

// Type Definitions
interface StatCardProps {
  icon: IconType
  title: string
  value: string | number
  color: string
}

interface LabAppointment {
  id: string
  appointmentId: string
  patientName: string
  testName: string
  total: number
  status: 'sample-collected' | 'in-progress' | 'result-ready' | 'completed'
}

interface LabDashboardData {
  name: string
  location: string
  avatar: string
  stats: {
    dailyRevenue: number
    pendingResults: number
    monthlyRevenue: number
    rating: number
  }
  recentAppointments: LabAppointment[]
  earnings: {
    totalRevenue: number
    platformFee: number
    netPayout: number
  }
}

// Mock Data
const mockLabData: LabDashboardData = {
  name: 'Precision Diagnostics Lab',
  location: 'Rose Hill',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PDL&backgroundColor=8b5cf6',
  stats: {
    dailyRevenue: 22500,
    pendingResults: 12,
    monthlyRevenue: 480000,
    rating: 4.9,
  },
  recentAppointments: [
    { id: 'apt1', appointmentId: '#LAB-1121', patientName: 'John Smith', testName: 'Complete Blood Count', total: 800, status: 'result-ready' },
    { id: 'apt2', appointmentId: '#LAB-1120', patientName: 'Maria Garcia', testName: 'Lipid Profile', total: 1200, status: 'in-progress' },
    { id: 'apt3', appointmentId: '#LAB-1119', patientName: 'David Chen', testName: 'Thyroid Function Test', total: 1500, status: 'sample-collected' },
    { id: 'apt4', appointmentId: '#LAB-1118', patientName: 'Emma Wilson', testName: 'HbA1c', total: 1000, status: 'completed' },
  ],
  earnings: {
    totalRevenue: 22500,
    platformFee: 1125, // Assuming 5%
    netPayout: 21375,
  },
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

export default function LabDashboardPage() {
  const [labData] = useState<LabDashboardData>(mockLabData)

  const getStatusInfo = (status: 'sample-collected' | 'in-progress' | 'result-ready' | 'completed') => {
    switch (status) {
      case 'sample-collected': return { text: 'Sample Collected', color: 'bg-yellow-100 text-yellow-800', icon: FaClock };
      case 'in-progress': return { text: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: FaSpinner };
      case 'result-ready': return { text: 'Result Ready', color: 'bg-purple-100 text-purple-800', icon: FaClipboardCheck };
      case 'completed': return { text: 'Completed', color: 'bg-green-100 text-green-800', icon: FaCheckCircle };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={labData.avatar} alt={labData.name} className="w-14 h-14 rounded-full border-2 border-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{labData.name}</h1>
                <p className="text-gray-600">{labData.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-purple-600">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {labData.stats.pendingResults}
                </span>
              </button>
              <Link href="/lab-technician/settings" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                <FaEdit />
                Manage Lab
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={FaDollarSign} title="Today's Revenue" value={`Rs ${labData.stats.dailyRevenue.toLocaleString()}`} color="bg-green-500" />
          <StatCard icon={FaSpinner} title="Pending Results" value={labData.stats.pendingResults} color="bg-yellow-500" />
          <StatCard icon={FaChartLine} title="Monthly Revenue" value={`Rs ${labData.stats.monthlyRevenue.toLocaleString()}`} color="bg-blue-500" />
          <StatCard icon={FaStar} title="Patient Rating" value={labData.stats.rating} color="bg-purple-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Appointment Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
                <Link href="/laboratory/appointments" className="text-purple-600 hover:underline font-medium">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 font-medium text-gray-600">Appointment ID</th>
                      <th className="p-3 font-medium text-gray-600">Patient</th>
                      <th className="p-3 font-medium text-gray-600">Test</th>
                      <th className="p-3 font-medium text-gray-600">Status</th>
                      <th className="p-3 font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labData.recentAppointments.map((apt) => {
                      const statusInfo = getStatusInfo(apt.status);
                      return (
                        <tr key={apt.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-mono text-xs">{apt.appointmentId}</td>
                          <td className="p-3 font-medium">{apt.patientName}</td>
                          <td className="p-3 text-gray-600">{apt.testName}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${statusInfo.color}`}>
                              <statusInfo.icon className={statusInfo.icon === FaSpinner ? 'animate-spin' : ''} /> {statusInfo.text}
                            </span>
                          </td>
                          <td className="p-3">
                            {apt.status === 'result-ready' && (
                              <button className="bg-purple-500 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1">
                                <FaFileUpload /> Send Result
                              </button>
                            )}
                            {apt.status === 'in-progress' && (
                               <button className="bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors">
                                 View Details
                               </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Earnings Dashboard */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Today&apos;s Payout</h3>
                    <button className="text-purple-600 text-sm hover:underline"><FaFileExport /></button>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Total Revenue</span><span className="font-medium">Rs {labData.earnings.totalRevenue.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Platform Fee (5%)</span><span className="font-medium text-red-500">-Rs {labData.earnings.platformFee.toLocaleString()}</span></div>
                    <div className="border-t pt-3 mt-3 flex justify-between">
                        <span className="font-bold">Net Payout</span>
                        <span className="font-bold text-xl text-green-600">Rs {labData.earnings.netPayout.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Manage Your Lab Profile</h3>
              <p className="text-white/90 text-sm mb-4">Keep your lab certifications and equipment list updated to attract more patients.</p>
              <Link href="/lab-technician/settings?tab=documents" className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
                Update Certifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}