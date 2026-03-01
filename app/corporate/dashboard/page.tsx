'use client'

import { useState, useEffect } from 'react'
import { mockCorporateStats, mockRecentEmployees, mockRecentClaims } from '../constants'
import DashboardOverview from './DashboardOverview'
import WalletBalanceCard from '@/components/shared/WalletBalanceCard'

export default function CorporateDashboard() {
  const [corporateData] = useState({
    stats: mockCorporateStats,
    employees: mockRecentEmployees,
    claims: mockRecentClaims,
  })
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const id = localStorage.getItem('healthwyz_user_id')
    if (id) setUserId(id)
  }, [])

  return (
    <>
      {/* Wallet Balance */}
      {userId && (
        <div className="mb-8">
          <WalletBalanceCard userId={userId} />
        </div>
      )}

      <DashboardOverview
        stats={corporateData.stats}
        recentEmployees={corporateData.employees}
        recentClaims={corporateData.claims}
      />
    </>
  )
}