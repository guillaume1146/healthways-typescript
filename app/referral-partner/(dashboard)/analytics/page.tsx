'use client'

import { useState, useEffect } from 'react'
import {
  FaChartLine,
  FaSpinner,
  FaMousePointer,
  FaUserPlus,
  FaDollarSign,
  FaPercentage,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa'

interface AnalyticsData {
  conversionRate: number
  totalClicks: number
  totalSignups: number
  earningsPerReferral: number
  totalReferrals: number
  totalEarnings: number
  thisMonthEarnings: number
  commissionRate: number
}

interface MonthlyPerformance {
  month: string
  referrals: number
  conversions: number
  earnings: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    conversionRate: 0,
    totalClicks: 0,
    totalSignups: 0,
    earningsPerReferral: 0,
    totalReferrals: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
    commissionRate: 0,
  })
  const [monthlyData, setMonthlyData] = useState<MonthlyPerformance[]>([])
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
        const res = await fetch(`/api/referral-partners/${userId}/dashboard`)
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            const stats = json.data.stats
            const totalReferrals = stats.totalReferrals || 0
            const totalEarnings = stats.totalEarnings || 0

            const actualConversions = json.data.recentConversions?.length ?? totalReferrals

            setAnalytics({
              conversionRate: totalReferrals > 0 ? Math.round((actualConversions / totalReferrals) * 100) : 0,
              totalClicks: totalReferrals,
              totalSignups: totalReferrals,
              earningsPerReferral: totalReferrals > 0 ? Math.round(totalEarnings / totalReferrals) : 0,
              totalReferrals,
              totalEarnings,
              thisMonthEarnings: stats.thisMonthEarnings || 0,
              commissionRate: stats.commissionRate || 0,
            })

            if (json.data.monthlyPerformance) {
              setMonthlyData(json.data.monthlyPerformance)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [userId])

  const statCards = [
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      icon: FaPercentage,
      color: 'from-purple-500 to-purple-600',
      subtitle: 'Visitors to signups',
    },
    {
      title: 'Total Clicks',
      value: analytics.totalClicks.toLocaleString(),
      icon: FaMousePointer,
      color: 'from-blue-500 to-blue-600',
      subtitle: 'Link interactions',
    },
    {
      title: 'Total Signups',
      value: analytics.totalSignups.toLocaleString(),
      icon: FaUserPlus,
      color: 'from-green-500 to-green-600',
      subtitle: 'People referred',
    },
    {
      title: 'Earnings per Referral',
      value: `Rs ${analytics.earningsPerReferral.toLocaleString()}`,
      icon: FaDollarSign,
      color: 'from-orange-500 to-orange-600',
      subtitle: 'Average commission',
    },
  ]

  const maxEarnings = monthlyData.length > 0
    ? Math.max(...monthlyData.map(m => m.earnings))
    : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <FaChartLine className="text-orange-500" /> Referral Analytics
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-2xl text-orange-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-xl p-5 text-white shadow-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="text-2xl opacity-80" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium opacity-90 mt-1">{stat.title}</p>
                <p className="text-xs opacity-70 mt-0.5">{stat.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 text-sm">Commission Rate</span>
                  <span className="font-semibold text-gray-900">{analytics.commissionRate}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 text-sm">Total Earnings</span>
                  <span className="font-semibold text-green-600">Rs {analytics.totalEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 text-sm">This Month</span>
                  <span className="font-semibold text-blue-600">Rs {analytics.thisMonthEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 text-sm">Avg. per Referral</span>
                  <span className="font-semibold text-purple-600">Rs {analytics.earningsPerReferral.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Link Clicks</span>
                    <span className="font-medium text-gray-900">{analytics.totalClicks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Signups</span>
                    <span className="font-medium text-gray-900">{analytics.totalSignups}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: analytics.totalClicks > 0 ? `${(analytics.totalSignups / analytics.totalClicks) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Conversions</span>
                    <span className="font-medium text-gray-900">{Math.round(analytics.totalSignups * analytics.conversionRate / 100)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full transition-all"
                      style={{ width: analytics.totalClicks > 0 ? `${(Math.round(analytics.totalSignups * analytics.conversionRate / 100) / analytics.totalClicks) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h2>
            {monthlyData.length === 0 ? (
              <div className="text-center py-8">
                <FaChartLine className="mx-auto text-3xl text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">Performance data will build up over time as you make referrals.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {monthlyData.map((month, idx) => {
                  const prevMonth = idx < monthlyData.length - 1 ? monthlyData[idx + 1] : null
                  const earningsTrend = prevMonth ? month.earnings - prevMonth.earnings : 0

                  return (
                    <div key={month.month} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-24 text-sm font-medium text-gray-700">{month.month}</div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: maxEarnings > 0 ? `${(month.earnings / maxEarnings) * 100}%` : '0%' }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm font-medium text-gray-900">
                        {month.referrals} refs
                      </div>
                      <div className="w-28 text-right text-sm font-semibold text-gray-900">
                        Rs {month.earnings.toLocaleString()}
                      </div>
                      <div className="w-8">
                        {earningsTrend > 0 && <FaArrowUp className="text-green-500 text-xs" />}
                        {earningsTrend < 0 && <FaArrowDown className="text-red-500 text-xs" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {analytics.totalReferrals === 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 text-center">
              <FaChartLine className="mx-auto text-4xl text-orange-400 mb-3" />
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Start Building Your Analytics</h3>
              <p className="text-orange-700 text-sm max-w-md mx-auto">
                Share your referral code and links to start tracking your performance metrics.
                Analytics will populate as your referrals grow.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
