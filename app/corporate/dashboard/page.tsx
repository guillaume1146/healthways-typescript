'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaBell, FaCog } from 'react-icons/fa'
import { mockCorporateStats, mockRecentEmployees, mockRecentClaims, mockCorporateProfile } from '../constants'
import DashboardOverview from './DashboardOverview'

export default function CorporateDashboard() {
  const [corporateData] = useState({
    stats: mockCorporateStats,
    employees: mockRecentEmployees,
    claims: mockRecentClaims,
    profile: mockCorporateProfile
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={corporateData.profile.logo} 
                alt={corporateData.profile.companyName} 
                className="w-14 h-14 rounded-full border-2 border-blue-500" 
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{corporateData.profile.companyName}</h1>
                <p className="text-gray-600">Corporate Health Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {corporateData.stats.pendingVerifications}
                </span>
              </button>
              <Link 
                href="/corporate/settings" 
                className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <FaCog />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <DashboardOverview 
          stats={corporateData.stats}
          recentEmployees={corporateData.employees}
          recentClaims={corporateData.claims}
        />
      </div>
    </div>
  )
}