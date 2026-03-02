'use client'

import { useState, useEffect } from 'react'
import {
  FaDollarSign,
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa'

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  serviceType: string | null
  referenceId: string | null
  balanceBefore: number
  balanceAfter: number
  status: string
  createdAt: string
}

interface WalletData {
  balance: number
  currency: string
  initialCredit: number
  transactions: Transaction[]
}

interface DashboardStats {
  totalEarnings: number
  thisMonthEarnings: number
  walletBalance: number
}

export default function EarningsPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    walletBalance: 0,
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

    const fetchEarnings = async () => {
      try {
        const [walletRes, dashboardRes] = await Promise.all([
          fetch(`/api/users/${userId}/wallet`),
          fetch(`/api/referral-partners/${userId}/dashboard`),
        ])

        if (walletRes.ok) {
          const walletJson = await walletRes.json()
          if (walletJson.success && walletJson.data) {
            setWalletData(walletJson.data)
          }
        }

        if (dashboardRes.ok) {
          const dashboardJson = await dashboardRes.json()
          if (dashboardJson.success) {
            setDashboardStats({
              totalEarnings: dashboardJson.data.stats.totalEarnings || 0,
              thisMonthEarnings: dashboardJson.data.stats.thisMonthEarnings || 0,
              walletBalance: dashboardJson.data.stats.walletBalance || 0,
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch earnings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEarnings()
  }, [userId])

  const pendingPayouts = walletData?.transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0) ?? 0

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <FaDollarSign className="text-green-500" /> Earnings
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-2xl text-green-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaWallet className="text-xl opacity-80" />
                <p className="text-green-100 text-sm font-medium">Total Earnings</p>
              </div>
              <p className="text-3xl font-bold">Rs {dashboardStats.totalEarnings.toLocaleString()}</p>
              <p className="text-green-200 text-sm mt-1">Lifetime commission earned</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaCalendarAlt className="text-xl opacity-80" />
                <p className="text-blue-100 text-sm font-medium">This Month</p>
              </div>
              <p className="text-3xl font-bold">Rs {dashboardStats.thisMonthEarnings.toLocaleString()}</p>
              <p className="text-blue-200 text-sm mt-1">Commission earned this month</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <FaClock className="text-xl opacity-80" />
                <p className="text-orange-100 text-sm font-medium">Pending Payouts</p>
              </div>
              <p className="text-3xl font-bold">Rs {pendingPayouts.toLocaleString()}</p>
              <p className="text-orange-200 text-sm mt-1">Awaiting processing</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
              <p className="text-gray-500 text-sm mt-1">Recent wallet transactions</p>
            </div>

            {!walletData || walletData.transactions.length === 0 ? (
              <div className="p-12 text-center">
                <FaDollarSign className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No transactions yet</h3>
                <p className="text-gray-500 text-sm">Your earning transactions will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {walletData.transactions.map((txn) => (
                  <div key={txn.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {txn.type === 'credit' ? (
                          <FaArrowDown className="text-green-600" />
                        ) : (
                          <FaArrowUp className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {txn.description || (txn.type === 'credit' ? 'Commission Received' : 'Payout')}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span>{formatDate(txn.createdAt)}</span>
                          <span>&middot;</span>
                          <span>{formatTime(txn.createdAt)}</span>
                          {txn.serviceType && (
                            <>
                              <span>&middot;</span>
                              <span className="capitalize">{txn.serviceType}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.type === 'credit' ? '+' : '-'}Rs {txn.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Bal: Rs {txn.balanceAfter.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {walletData && (
            <div className="bg-white rounded-xl p-5 shadow-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Wallet Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Current Balance</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">Rs {walletData.balance.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Currency</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{walletData.currency}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Initial Credit</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">Rs {walletData.initialCredit.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
