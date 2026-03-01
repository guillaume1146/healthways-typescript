'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaShieldAlt, FaClock, FaDollarSign, FaUsers,
  FaExclamationTriangle, FaChartLine
} from 'react-icons/fa'
import { InsuranceDashboardData } from './types'
import { mockInsuranceData } from './constants'
import StatCard from './StatCard'
import ClaimsTable from './ClaimsTable'
import PolicyHoldersTable from './PolicyHoldersTable'
import EarningsSidebar from './EarningsSidebar'
import WalletBalanceCard from '@/components/shared/WalletBalanceCard'

export default function InsuranceDashboardPage() {
  const [insuranceData] = useState<InsuranceDashboardData>(mockInsuranceData)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const id = localStorage.getItem('healthwyz_user_id')
    if (id) setUserId(id)
  }, [])

  const handleUpdateClaim = (claimId: string, status: string) => {
    console.log(`Updating claim ${claimId} to status: ${status}`)
    // In real implementation, this would update the claim status
  }

  const handleEditPolicyHolder = (policyHolderId: string) => {
    console.log(`Editing policy holder: ${policyHolderId}`)
    // Navigate to edit policy holder page
  }

  const handleDeletePolicyHolder = (policyHolderId: string) => {
    console.log(`Deleting policy holder: ${policyHolderId}`)
    // Show confirmation dialog and delete policy holder
  }

  const handleViewPolicyHolder = (policyHolderId: string) => {
    console.log(`Viewing policy holder: ${policyHolderId}`)
    // Navigate to policy holder details page
  }

  const handleAddPolicyHolder = () => {
    console.log('Adding new policy holder')
    // Navigate to add policy holder page
  }

  return (
    <>
      {/* Wallet Balance */}
      {userId && (
        <div className="mb-8">
          <WalletBalanceCard userId={userId} />
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaShieldAlt} 
            title="Active Policies" 
            value={insuranceData.stats.activePolicies} 
            color="bg-blue-500"
            subtitle={`${insuranceData.stats.policyHolders} policy holders`}
          />
          <StatCard 
            icon={FaClock} 
            title="Pending Claims" 
            value={insuranceData.stats.pendingClaims} 
            color="bg-yellow-500"
            subtitle="Awaiting review"
          />
          <StatCard 
            icon={FaDollarSign} 
            title="Monthly Commission" 
            value={`Rs ${insuranceData.stats.monthlyCommission.toLocaleString()}`} 
            color="bg-green-500"
            subtitle="This month"
          />
          <StatCard 
            icon={FaUsers} 
            title="Policy Holders" 
            value={insuranceData.stats.policyHolders} 
            color="bg-purple-500"
            subtitle={`${insuranceData.stats.expiringPolicies} expiring soon`}
          />
        </div>

        {/* Alert Banner for Expiring Policies */}
        {insuranceData.stats.expiringPolicies > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-orange-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-700">
                  <strong>Action Required:</strong> {insuranceData.stats.expiringPolicies} policies are expiring within 30 days. 
                  <Link href="/insurance/expiring-policies" className="font-medium underline hover:text-orange-800 ml-1">
                    Review and renew policies
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Claims Management */}
            <ClaimsTable 
              claims={insuranceData.recentClaims}
              onUpdateClaim={handleUpdateClaim}
            />

            {/* Policy Holders Management */}
            <PolicyHoldersTable 
              policyHolders={insuranceData.policyHolders}
              onEdit={handleEditPolicyHolder}
              onDelete={handleDeletePolicyHolder}
              onView={handleViewPolicyHolder}
              onAdd={handleAddPolicyHolder}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <EarningsSidebar 
              totalCommission={insuranceData.earnings.totalCommission}
              platformFee={insuranceData.earnings.platformFee}
              netPayout={insuranceData.earnings.netPayout}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/insurance/policy-holders/new" 
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition group"
            >
              <FaUsers className="text-2xl text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">Add Policy Holder</p>
            </Link>
            <Link 
              href="/insurance/claims/process" 
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition group"
            >
              <FaClock className="text-2xl text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">Process Claims</p>
            </Link>
            <Link 
              href="/insurance/renewals" 
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition group"
            >
              <FaShieldAlt className="text-2xl text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">Policy Renewals</p>
            </Link>
            <Link 
              href="/insurance/analytics" 
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-orange-500 hover:bg-orange-50 transition group"
            >
              <FaChartLine className="text-2xl text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">View Analytics</p>
            </Link>
          </div>
        </div>
    </>
  )
}