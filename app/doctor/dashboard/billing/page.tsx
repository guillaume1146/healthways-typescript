'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { useDoctorData } from '../context'
import BillingEarnings from '../components/BillingEarnings'

export default function BillingPage() {
  const user = useDoctorData()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [billingData, setBillingData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchBilling = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/${user.id}/wallet`)
      const json = await res.json()

      if (json.success && json.data) {
        const txs = json.data.transactions || []

        // Transform wallet transactions to billing format
        const transactions = txs.map((tx: any) => ({
          id: tx.id,
          patientName: tx.description || 'Transaction',
          date: tx.createdAt,
          time: new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          amount: tx.amount,
          type: tx.serviceType || 'consultation',
          paymentMethod: 'wallet',
          status: tx.status || 'completed',
        }))

        // Calculate earnings from credit transactions
        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekStart = new Date(todayStart)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const yearStart = new Date(now.getFullYear(), 0, 1)

        const credits = txs.filter((tx: any) => tx.type === 'credit')
        const sumAfter = (date: Date) =>
          credits
            .filter((tx: any) => new Date(tx.createdAt) >= date)
            .reduce((s: number, tx: any) => s + tx.amount, 0)

        setBillingData({
          billing: {
            earnings: {
              today: sumAfter(todayStart),
              thisWeek: sumAfter(weekStart),
              thisMonth: sumAfter(monthStart),
              thisYear: sumAfter(yearStart),
              totalEarnings: credits.reduce((s: number, tx: any) => s + tx.amount, 0),
              pendingPayouts: 0,
              averageConsultationFee: credits.length > 0
                ? Math.round(credits.reduce((s: number, tx: any) => s + tx.amount, 0) / credits.length)
                : 0,
            },
            transactions,
            receiveMethods: [],
            bankAccounts: [],
          },
        })
      } else {
        setBillingData({ billing: { earnings: {}, transactions: [] } })
      }
    } catch (error) {
      console.error('Failed to fetch billing:', error)
      setBillingData({ billing: { earnings: {}, transactions: [] } })
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    fetchBilling()
  }, [fetchBilling])

  if (loading || !billingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    )
  }

  return <BillingEarnings doctorData={billingData as any} />
}
