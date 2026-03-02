'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FaChartLine, FaShieldAlt, FaFileAlt,
  FaDollarSign, FaCheckCircle, FaChartBar, FaChartPie
} from 'react-icons/fa'

interface AnalyticsData {
  totalPolicies: number
  activePolicies: number
  activeClaims: number
  monthlyPremium: number
  claimApprovalRate: number
  walletBalance: number
}

export default function InsuranceAnalyticsPage() {
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPolicies: 0,
    activePolicies: 0,
    activeClaims: 0,
    monthlyPremium: 0,
    claimApprovalRate: 0,
    walletBalance: 0,
  })

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

  const fetchAnalytics = useCallback(async () => {
    if (!userId) return
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/insurance/${userId}/dashboard`)
      if (!res.ok) throw new Error('Failed to fetch analytics data')
      const json = await res.json()
      if (json.success) {
        const apiData = json.data
        const plans = apiData.plans || []
        const activePlans = plans.filter((p: { isActive: boolean }) => p.isActive)
        const totalPremium = plans.reduce(
          (sum: number, p: { premium: number }) => sum + (p.premium || 0),
          0
        )

        setAnalytics({
          totalPolicies: apiData.stats?.totalPlans || plans.length,
          activePolicies: apiData.stats?.activePolicies || activePlans.length,
          activeClaims: 0, // Claims model not yet in schema
          monthlyPremium: totalPremium,
          claimApprovalRate: 0,
          walletBalance: apiData.stats?.walletBalance || 0,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FaChartLine className="text-3xl text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Overview of your insurance performance</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Policies</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {analytics.totalPolicies}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {analytics.activePolicies} active
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-500">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Claims</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {analytics.activeClaims}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Pending review</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-500">
                  <FaFileAlt className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Monthly Premium</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    Rs {analytics.monthlyPremium.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total collected</p>
                </div>
                <div className="p-3 rounded-full bg-green-500">
                  <FaDollarSign className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Claim Approval Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {analytics.claimApprovalRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Overall rate</p>
                </div>
                <div className="p-3 rounded-full bg-purple-500">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <FaChartBar className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Policy Distribution</h3>
              </div>
              {analytics.totalPolicies === 0 ? (
                <div className="text-center py-12">
                  <FaChartBar className="mx-auto text-4xl text-gray-300 mb-4" />
                  <p className="text-gray-500">No policy data available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Analytics will populate as policies are created.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Active Policies</span>
                      <span className="font-semibold text-green-600">
                        {analytics.activePolicies}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            analytics.totalPolicies > 0
                              ? (analytics.activePolicies / analytics.totalPolicies) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Inactive / Expired</span>
                      <span className="font-semibold text-red-600">
                        {analytics.totalPolicies - analytics.activePolicies}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            analytics.totalPolicies > 0
                              ? ((analytics.totalPolicies - analytics.activePolicies) /
                                  analytics.totalPolicies) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <FaChartPie className="text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Performance Overview</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Claim Approval Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${analytics.claimApprovalRate}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-green-600 text-sm">
                      {analytics.claimApprovalRate}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Policy Utilization</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${
                            analytics.totalPolicies > 0
                              ? (analytics.activePolicies / analytics.totalPolicies) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">
                      {analytics.totalPolicies > 0
                        ? Math.round(
                            (analytics.activePolicies / analytics.totalPolicies) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Wallet Balance</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    Rs {analytics.walletBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
