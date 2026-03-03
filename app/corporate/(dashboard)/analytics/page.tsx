'use client'

import { useState, useEffect } from 'react'
import { FaChartLine, FaUsers, FaDollarSign, FaFileAlt, FaSpinner } from 'react-icons/fa'

interface AnalyticsData {
  totalEmployees: number
  activePolicies: number
  totalClaims: number
  monthlySpend: number
  claimApprovalRate: number
  averageClaimAmount: number
}

export default function CorporateAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalEmployees: 0,
    activePolicies: 0,
    totalClaims: 0,
    monthlySpend: 0,
    claimApprovalRate: 0,
    averageClaimAmount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUserId(parsed.id)
      }
    } catch {
      // Corrupted localStorage
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/corporate/${userId}/dashboard`)
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setData(prev => ({
              ...prev,
              totalEmployees: json.data.stats.totalEmployees || 0,
            }))
          }
        }
      } catch {
        // Will show empty state
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [userId])

  const stats = [
    { title: 'Total Employees', value: data.totalEmployees, icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Active Policies', value: data.activePolicies, icon: FaFileAlt, color: 'bg-green-500' },
    { title: 'Monthly Spend', value: `Rs ${data.monthlySpend.toLocaleString()}`, icon: FaDollarSign, color: 'bg-purple-500' },
    { title: 'Total Claims', value: data.totalClaims, icon: FaFileAlt, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <FaChartLine className="text-green-500" /> Usage Analytics
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-2xl text-green-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="text-white text-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Claim Approval Rate</h2>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 relative">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-green-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${data.claimApprovalRate}, 100`} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{data.claimApprovalRate}%</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Claims approved vs total claims submitted</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Average Claim Amount</h2>
              <p className="text-3xl font-bold text-gray-900">Rs {data.averageClaimAmount.toLocaleString()}</p>
              <p className="text-gray-600 text-sm mt-2">Per claim across all employees</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
