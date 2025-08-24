'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaDollarSign, FaCalendarAlt, FaClock, FaChartLine,
  FaCheckCircle, FaBell, FaCamera, FaFileUpload, FaCreditCard,
  FaUniversity, FaDownload, FaFilter, FaSearch, FaUser,
  FaMapMarkerAlt, FaPhone, FaStar, FaPlus, FaTrash, 
  FaPowerOff, FaToggleOn, FaToggleOff, FaArrowUp, FaWallet
} from 'react-icons/fa'

// Types
interface Appointment {
  id: string
  patientName: string
  serviceType: string
  date: string
  time: string
  duration: string
  location: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  amount: number
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'earning' | 'commission' | 'payout'
  status: 'completed' | 'pending'
}

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  type: 'savings' | 'current'
  isDefault: boolean
  verified: boolean
}

interface TimeSlot {
  start: string
  end: string
  enabled: boolean
}

interface WorkingHours {
  day: string
  enabled: boolean
  slots: {
    morning: TimeSlot
    afternoon: TimeSlot
    evening: TimeSlot
    night: TimeSlot
  }
}

// Mock Data
const mockEarnings = {
  monthly: 5400,
  weekly: 1260,
  daily: 180,
  pending: 450,
  commission: 810,
  net: 4590
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Smith',
    serviceType: 'Elderly Care',
    date: '2024-02-01',
    time: '09:00 AM',
    duration: '4 hours',
    location: 'Rose Hill',
    status: 'confirmed',
    amount: 180
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    serviceType: 'Post-Surgery Care',
    date: '2024-02-01',
    time: '02:00 PM',
    duration: '3 hours',
    location: 'Curepipe',
    status: 'pending',
    amount: 135
  }
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-30',
    description: 'Service: Elderly Care',
    amount: 180,
    type: 'earning',
    status: 'completed'
  },
  {
    id: '2',
    date: '2024-01-30',
    description: 'Platform Fee (15%)',
    amount: -27,
    type: 'commission',
    status: 'completed'
  }
]

const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'MCB',
    accountNumber: '****4567',
    type: 'savings',
    isDefault: true,
    verified: true
  }
]

const initialWorkingHours: WorkingHours[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
].map(day => ({
  day,
  enabled: day !== 'Sunday',
  slots: {
    morning: { start: '06:00', end: '12:00', enabled: true },
    afternoon: { start: '12:00', end: '18:00', enabled: true },
    evening: { start: '18:00', end: '22:00', enabled: true },
    night: { start: '22:00', end: '06:00', enabled: false }
  }
}))

export default function NurseDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [appointments] = useState<Appointment[]>(mockAppointments)
  const [searchQuery, setSearchQuery] = useState('')
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(initialWorkingHours)
  const [profileData, setProfileData] = useState({
    name: 'Maria Thompson',
    email: 'maria.t@healthcare.mu',
    phone: '+230 5789 0123',
    registration: 'RN-MU-2012-4567',
    hourlyRate: 45,
    weeklyRate: 1500,
    monthlyRate: 5500
  })

  const toggleDayAvailability = (index: number) => {
    const updated = [...workingHours]
    updated[index].enabled = !updated[index].enabled
    setWorkingHours(updated)
  }

  const toggleSlot = (dayIndex: number, slot: keyof WorkingHours['slots']) => {
    const updated = [...workingHours]
    updated[dayIndex].slots[slot].enabled = !updated[dayIndex].slots[slot].enabled
    setWorkingHours(updated)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt },
    { id: 'earnings', label: 'Earnings', icon: FaDollarSign },
    { id: 'availability', label: 'Availability', icon: FaClock },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'payments', label: 'Payments', icon: FaCreditCard }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Nurse Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {profileData.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4">2</span>
              </button>
              <FaPowerOff className="text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 flex gap-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 ${
                activeTab === tab.id ? 'border-teal-600 text-teal-600' : 'border-transparent'
              }`}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between mb-4">
                  <FaDollarSign className="text-2xl text-green-600" />
                  <span className="text-xs text-green-600"><FaArrowUp /> 12%</span>
                </div>
                <p className="text-2xl font-bold">${mockEarnings.monthly}</p>
                <p className="text-sm text-gray-600">Monthly Earnings</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <FaCalendarAlt className="text-2xl text-blue-600 mb-4" />
                <p className="text-2xl font-bold">42</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <FaStar className="text-2xl text-yellow-500 mb-4" />
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <FaWallet className="text-2xl text-purple-600 mb-4" />
                <p className="text-2xl font-bold">${mockEarnings.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
              {appointments.map(apt => (
                <div key={apt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2">
                  <div>
                    <p className="font-medium">{apt.patientName}</p>
                    <p className="text-sm text-gray-600">{apt.serviceType} • {apt.date} at {apt.time}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {apt.status}
                    </span>
                    <p className="font-semibold mt-1">${apt.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg">
                  <FaFilter className="inline mr-2" />Filter
                </button>
              </div>

              {appointments.map(apt => (
                <div key={apt.id} className="border-b pb-4 mb-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{apt.patientName}</h4>
                      <p className="text-teal-600">{apt.serviceType}</p>
                      <div className="flex gap-4 text-sm text-gray-600 mt-2">
                        <span><FaCalendarAlt className="inline mr-1" />{apt.date}</span>
                        <span><FaClock className="inline mr-1" />{apt.time}</span>
                        <span><FaMapMarkerAlt className="inline mr-1" />{apt.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${apt.amount}</p>
                      <div className="mt-2 space-x-2">
                        {apt.status === 'pending' && (
                          <>
                            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">Confirm</button>
                            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm">Cancel</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Earnings Summary</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-teal-100">Monthly</p>
                  <p className="text-3xl font-bold">${mockEarnings.monthly}</p>
                </div>
                <div>
                  <p className="text-teal-100">After Commission</p>
                  <p className="text-3xl font-bold">${mockEarnings.net}</p>
                </div>
                <div>
                  <p className="text-teal-100">Pending</p>
                  <p className="text-3xl font-bold">${mockEarnings.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map(tx => (
                    <tr key={tx.id} className="border-b">
                      <td className="py-2">{tx.date}</td>
                      <td className="py-2">{tx.description}</td>
                      <td className={`py-2 text-right font-medium ${
                        tx.amount < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ${Math.abs(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
            {workingHours.map((day, dayIndex) => (
              <div key={day.day} className="border rounded-lg p-4 mb-3">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleDayAvailability(dayIndex)}>
                      {day.enabled ? <FaToggleOn className="text-2xl text-teal-600" /> : <FaToggleOff className="text-2xl text-gray-400" />}
                    </button>
                    <span className={day.enabled ? 'font-medium' : 'text-gray-400'}>{day.day}</span>
                  </div>
                </div>
                {day.enabled && (
                  <div className="grid grid-cols-4 gap-2">
                    {(['morning', 'afternoon', 'evening', 'night'] as const).map(slot => (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(dayIndex, slot)}
                        className={`p-2 rounded border text-sm ${
                          day.slots[slot].enabled ? 'bg-teal-50 border-teal-300' : 'bg-gray-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration</label>
                <input
                  type="text"
                  value={profileData.registration}
                  className="w-full px-3 py-2 border rounded-lg"
                  readOnly
                />
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-3">Rates</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Hourly ($)</label>
                  <input
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={(e) => setProfileData({...profileData, hourlyRate: +e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Weekly ($)</label>
                  <input
                    type="number"
                    value={profileData.weeklyRate}
                    onChange={(e) => setProfileData({...profileData, weeklyRate: +e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Monthly ($)</label>
                  <input
                    type="number"
                    value={profileData.monthlyRate}
                    onChange={(e) => setProfileData({...profileData, monthlyRate: +e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
            <button className="mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg">Save Changes</button>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Bank Accounts</h3>
              {mockBankAccounts.map(account => (
                <div key={account.id} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{account.bankName}</p>
                      <p className="text-sm text-gray-600">Account ending {account.accountNumber}</p>
                      <div className="flex gap-2 mt-2">
                        {account.isDefault && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">Default</span>}
                        {account.verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Verified</span>}
                      </div>
                    </div>
                    <button className="text-red-600"><FaTrash /></button>
                  </div>
                </div>
              ))}
              <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg">
                <FaPlus className="inline mr-2" />Add Account
              </button>
            </div>

            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Request Payout</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-teal-100">Available Balance</p>
                  <p className="text-3xl font-bold">${mockEarnings.net}</p>
                </div>
                <button className="bg-white text-teal-700 px-6 py-3 rounded-lg font-medium">
                  Request Payout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}