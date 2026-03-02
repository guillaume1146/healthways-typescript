'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FaDollarSign, FaCalendarAlt, FaWallet,
  FaArrowUp, FaArrowDown, FaReceipt
} from 'react-icons/fa'

interface EarningsData {
  totalEarnings: number
  monthlyEarnings: number
  pendingPayout: number
  walletBalance: number
}

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  date: string
}

export default function PharmacistEarningsPage() {
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [earnings, setEarnings] = useState<EarningsData>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    pendingPayout: 0,
    walletBalance: 0,
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])

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

  const fetchEarnings = useCallback(async () => {
    if (!userId) return
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/pharmacists/${userId}/dashboard`)
      if (!res.ok) throw new Error('Failed to fetch earnings data')
      const json = await res.json()
      if (json.success) {
        const stats = json.data.stats
        const platformFeeRate = 0.05
        const platformFee = Math.round(stats.monthlyRevenue * platformFeeRate)
        setEarnings({
          totalEarnings: stats.monthlyRevenue || 0,
          monthlyEarnings: stats.monthlyRevenue || 0,
          pendingPayout: stats.monthlyRevenue - platformFee,
          walletBalance: stats.walletBalance || 0,
        })

        // Build transaction list from recent orders
        const orders = json.data.recentOrders || []
        const txns: Transaction[] = orders.map((order: { id: string; orderNumber: string; customerName: string; total: number; orderedAt: string }) => ({
          id: order.id,
          type: 'credit' as const,
          amount: order.total,
          description: `Order ${order.orderNumber} - ${order.customerName}`,
          date: order.orderedAt,
        }))
        setTransactions(txns)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchEarnings()
  }, [fetchEarnings])

  const platformFeeRate = 0.05
  const platformFee = Math.round(earnings.monthlyEarnings * platformFeeRate)
  const netPayout = earnings.monthlyEarnings - platformFee

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FaDollarSign className="text-3xl text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-sm text-gray-500">Track your revenue and payouts</p>
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    Rs {earnings.totalEarnings.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-500">
                  <FaDollarSign className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    Rs {earnings.monthlyEarnings.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-500">
                  <FaCalendarAlt className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending Payout</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    Rs {earnings.pendingPayout.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-yellow-500">
                  <FaReceipt className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Wallet Balance</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    Rs {earnings.walletBalance.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-500">
                  <FaWallet className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Payout Summary */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payout Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Revenue</span>
                  <span className="font-medium">Rs {earnings.monthlyEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee (5%)</span>
                  <span className="font-medium text-red-500">-Rs {platformFee.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between">
                  <span className="font-bold">Net Payout</span>
                  <span className="font-bold text-xl text-green-600">Rs {netPayout.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h3>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <FaReceipt className="mx-auto text-4xl text-gray-300 mb-4" />
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Transactions from orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            txn.type === 'credit'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {txn.type === 'credit' ? <FaArrowDown /> : <FaArrowUp />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{txn.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(txn.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${
                          txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {txn.type === 'credit' ? '+' : '-'}Rs {txn.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
