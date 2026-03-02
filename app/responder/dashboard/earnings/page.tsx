'use client'

import { useState, useEffect } from 'react'
import {
  FaDollarSign,
  FaChartLine,
  FaClock,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa'
import { IconType } from 'react-icons'

interface WalletTransaction {
  id: string
  type: string
  amount: number
  description: string | null
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
  transactions: WalletTransaction[]
}

interface StatCardProps {
  icon: IconType
  title: string
  value: string
  color: string
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

export default function ResponderEarningsPage() {
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [error, setError] = useState<string | null>(null)

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

    const fetchWallet = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/users/${userId}/wallet`)
        if (!res.ok) {
          if (res.status === 404) {
            setWallet(null)
            return
          }
          throw new Error('Failed to fetch earnings data')
        }
        const json = await res.json()
        if (json.success && json.data) {
          setWallet(json.data)
        }
      } catch (err) {
        console.error('Failed to fetch wallet:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [userId])

  const totalEarnings = wallet
    ? wallet.transactions
        .filter((t) => t.type === 'CREDIT' && t.status === 'COMPLETED')
        .reduce((sum, t) => sum + t.amount, 0)
    : 0

  const now = new Date()
  const thisMonthEarnings = wallet
    ? wallet.transactions
        .filter((t) => {
          const d = new Date(t.createdAt)
          return (
            t.type === 'CREDIT' &&
            t.status === 'COMPLETED' &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          )
        })
        .reduce((sum, t) => sum + t.amount, 0)
    : 0

  const pendingPayouts = wallet
    ? wallet.transactions
        .filter((t) => t.status === 'PENDING')
        .reduce((sum, t) => sum + t.amount, 0)
    : 0

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FaWallet className="text-3xl text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-sm text-gray-500">Track your revenue and transaction history</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={FaDollarSign}
              title="Total Earnings"
              value={`Rs ${totalEarnings.toLocaleString()}`}
              color="bg-green-500"
            />
            <StatCard
              icon={FaChartLine}
              title="This Month"
              value={`Rs ${thisMonthEarnings.toLocaleString()}`}
              color="bg-blue-500"
            />
            <StatCard
              icon={FaClock}
              title="Pending Payouts"
              value={`Rs ${pendingPayouts.toLocaleString()}`}
              color="bg-yellow-500"
            />
          </div>

          {/* Current Balance */}
          {wallet && (
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-6 mb-8 shadow-lg">
              <p className="text-sm font-medium text-white/80">Current Balance</p>
              <p className="text-3xl font-bold mt-1">
                Rs {wallet.balance.toLocaleString()}
              </p>
              <p className="text-sm text-white/70 mt-1">
                Currency: {wallet.currency}
              </p>
            </div>
          )}

          {/* Transaction History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
            </div>
            {!wallet || wallet.transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaWallet className="mx-auto text-4xl text-gray-300 mb-4" />
                <p>No transactions to display</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {wallet.transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                            txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {txn.type === 'CREDIT' ? <FaArrowDown /> : <FaArrowUp />}
                            {txn.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-sm">
                          {txn.description || txn.serviceType || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${
                            txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {txn.type === 'CREDIT' ? '+' : '-'}Rs {txn.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            txn.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : txn.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-sm">
                          {new Date(txn.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
