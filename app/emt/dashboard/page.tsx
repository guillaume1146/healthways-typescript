'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaExclamationTriangle, FaCalendarCheck, FaDollarSign, FaRoute, FaChartLine, 
  FaBell, FaClipboardList, FaEdit, FaClock, FaFileExport,
  FaCheckCircle, FaSpinner, FaTimesCircle, FaBroadcastTower, FaLocationArrow, FaUserInjured, FaPhoneAlt
} from 'react-icons/fa'
import { IconType } from 'react-icons'

// Type Definitions
interface StatCardProps {
  icon: IconType
  title: string
  value: string | number
  color: string
}

interface EmergencyRequest {
  id: string
  urgency: 'critical' | 'urgent'
  incident: string
  location: string
  distance: string
  timestamp: string
}

interface ResponderDashboardData {
  name: string
  unitNumber: string
  status: 'available' | 'en-route' | 'on-scene' | 'unavailable'
  stats: {
    todaysRevenue: number
    completedServices: number
    avgResponseTime: string
  }
  incomingRequests: EmergencyRequest[]
}

// Mock Data
const mockResponderData: ResponderDashboardData = {
  name: 'Jean-Michel Patel',
  unitNumber: 'AMB-114-07',
  status: 'available',
  stats: {
    todaysRevenue: 12500,
    completedServices: 4,
    avgResponseTime: "7.2min",
  },
  incomingRequests: [
    { id: 'req1', urgency: 'critical', incident: 'Cardiac Arrest', location: '123 Royal St, Port Louis', distance: '2.1 km', timestamp: '2 min ago' },
    { id: 'req2', urgency: 'urgent', incident: 'Trauma - Fall', location: 'Caudan Waterfront', distance: '3.5 km', timestamp: '5 min ago' },
  ],
}

const StatCard = ({ icon: Icon, title, value, color }: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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

export default function ResponderDashboardPage() {
  const [responderData, setResponderData] = useState<ResponderDashboardData>(mockResponderData)

  const handleStatusChange = (newStatus: 'available' | 'en-route' | 'on-scene' | 'unavailable') => {
    setResponderData(prev => ({ ...prev, status: newStatus }));
  }
  
  const getStatusInfo = (status: 'available' | 'en-route' | 'on-scene' | 'unavailable') => {
    switch (status) {
      case 'available': return { text: 'Available for Dispatch', color: 'bg-green-500', pulse: true };
      case 'en-route': return { text: 'En Route to Scene', color: 'bg-blue-500', pulse: true };
      case 'on-scene': return { text: 'On Scene', color: 'bg-orange-500', pulse: false };
      case 'unavailable': return { text: 'Unavailable / Off-Duty', color: 'bg-gray-500', pulse: false };
    }
  }

  const currentStatusInfo = getStatusInfo(responderData.status);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{responderData.name}</h1>
              <p className="text-gray-600">Unit: {responderData.unitNumber}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${currentStatusInfo.color} ${currentStatusInfo.pulse ? 'animate-pulse' : ''}`}></div>
                <span className="font-semibold">{currentStatusInfo.text}</span>
              </div>
              <Link href="/emt/settings" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm">
                <FaEdit />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats & Status Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6">
            <div className="md:col-span-4 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={FaDollarSign} title="Today's Revenue" value={`Rs ${responderData.stats.todaysRevenue.toLocaleString()}`} color="bg-green-500" />
                <StatCard icon={FaClipboardList} title="Completed Services (24h)" value={responderData.stats.completedServices} color="bg-blue-500" />
                <StatCard icon={FaClock} title="Avg. Response Time" value={responderData.stats.avgResponseTime} color="bg-purple-500" />
            </div>
            <div className="lg:col-span-2 bg-white p-4 rounded-2xl shadow-lg flex flex-col justify-center">
                 <label className="text-sm font-medium text-gray-600 mb-2 text-center">Update Live Status</label>
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleStatusChange('available')} className={`py-3 rounded-lg font-semibold transition-colors ${responderData.status === 'available' ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100'}`}>Available</button>
                    <button onClick={() => handleStatusChange('en-route')} className={`py-3 rounded-lg font-semibold transition-colors ${responderData.status === 'en-route' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-blue-100'}`}>En Route</button>
                    <button onClick={() => handleStatusChange('on-scene')} className={`py-3 rounded-lg font-semibold transition-colors ${responderData.status === 'on-scene' ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-orange-100'}`}>On Scene</button>
                    <button onClick={() => handleStatusChange('unavailable')} className={`py-3 rounded-lg font-semibold transition-colors ${responderData.status === 'unavailable' ? 'bg-gray-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Unavailable</button>
                 </div>
            </div>
        </div>

        {/* Appointments & Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FaBroadcastTower className="text-red-500 animate-pulse" /> Incoming Emergency Requests</h2>
                <Link href="/emergency-responder/requests" className="text-red-600 hover:underline font-medium">View All</Link>
            </div>
            <div className="space-y-4">
                {responderData.incomingRequests.map((req) => (
                    <div key={req.id} className={`p-4 rounded-lg border-2 ${req.urgency === 'critical' ? 'border-red-500 bg-red-50' : 'border-orange-400 bg-orange-50'}`}>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${req.urgency === 'critical' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'}`}>
                                        {req.urgency.toUpperCase()}
                                    </span>
                                    <div className="font-semibold text-lg text-gray-800 flex items-center gap-2"><FaUserInjured /> {req.incident}</div>
                                </div>
                                <div className="text-gray-600 text-sm flex items-center gap-6">
                                    <span className="flex items-center gap-2"><FaLocationArrow /> {req.location} ({req.distance})</span>
                                    <span className="flex items-center gap-2"><FaClock /> {req.timestamp}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-gray-300 transition-colors">Decline</button>
                                <button className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-600 transition-colors">Accept</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}