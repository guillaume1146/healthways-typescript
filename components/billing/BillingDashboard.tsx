'use client'

import WalletBalanceCard from '@/components/shared/WalletBalanceCard'
import PaymentMethodForm from '@/components/shared/PaymentMethodForm'

interface BillingDashboardProps {
  userId: string
}

export default function BillingDashboard({ userId }: BillingDashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Billing & Wallet</h1>
      <WalletBalanceCard userId={userId} />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
        <PaymentMethodForm />
      </div>
    </div>
  )
}
