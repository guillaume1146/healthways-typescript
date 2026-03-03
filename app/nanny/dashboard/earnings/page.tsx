'use client'

import { useState, useEffect } from 'react'
import {
  FaSpinner, FaDollarSign, FaWallet, FaChartLine,
  FaArrowUp, FaArrowDown, FaExchangeAlt, FaCalendarAlt,
  FaUserFriends
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
  upcomingBookings: number
  familiesHelped: number
  monthlyCompletedBookings: number
  walletBalance: number
}

export default function NannyEarningsPage() {
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)

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
        const [walletRes, dashRes] = await Promise.all([
          fetch(`/api/users/${userId}/wallet`),
          fetch(`/api/nannies/${userId}/dashboard`),
        ])

        if (walletRes.ok) {
          const walletData = await walletRes.json()
          if (walletData.success && walletData.data) {
            setWallet(walletData.data)
          }
        }

        if (dashRes.ok) {
          const dashData = await dashRes.json()
          if (dashData.success && dashData.data?.stats) {
            setStats(dashData.data.stats)
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

  const totalCredits = wallet?.transactions
    ?.filter(t => t.type === 'credit' || t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0) || 0

  const totalDebits = wallet?.transactions
    ?.filter(t => t.type === 'debit' || t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0) || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-3xl text-purple-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 text-sm mt-1">Track your childcare income and transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Wallet Balance</p>
              <p className="text-3xl font-bold mt-1">Rs {(wallet?.balance || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <FaWallet className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Earned</p>
              <p className="text-2xl font-bold text-green-600 mt-1">Rs {totalCredits.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaArrowUp className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-red-600 mt-1">Rs {totalDebits.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FaArrowDown className="text-red-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Families Helped</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.familiesHelped || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaUserFriends className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaChartLine className="text-purple-600" />
          Earnings Overview
        </h2>
        <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
          <FaChartLine className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Earnings chart will display here as you complete more childcare bookings.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-xs">Families Helped</p>
              <p className="text-xl font-bold text-gray-800">{stats?.familiesHelped || 0}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">This Month</p>
              <p className="text-xl font-bold text-purple-600">{stats?.monthlyCompletedBookings || 0}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Upcoming</p>
              <p className="text-xl font-bold text-blue-600">{stats?.upcomingBookings || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaExchangeAlt className="text-purple-600" />
          Recent Transactions
        </h2>

        {!wallet?.transactions || wallet.transactions.length === 0 ? (
          <div className="text-center py-8">
            <FaDollarSign className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Your transaction history will appear here once you start completing childcare bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {wallet.transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    txn.type === 'credit' || txn.type === 'CREDIT'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}>
                    {txn.type === 'credit' || txn.type === 'CREDIT' ? (
                      <FaArrowUp className="text-green-600 text-sm" />
                    ) : (
                      <FaArrowDown className="text-red-600 text-sm" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{txn.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <FaCalendarAlt className="text-gray-400" />
                      {new Date(txn.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {' at '}
                      {new Date(txn.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {txn.serviceType && (
                        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                          {txn.serviceType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${
                    txn.type === 'credit' || txn.type === 'CREDIT'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {txn.type === 'credit' || txn.type === 'CREDIT' ? '+' : '-'}Rs {txn.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Balance: Rs {txn.balanceAfter.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
