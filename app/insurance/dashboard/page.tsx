'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaShieldAlt, FaClock, FaDollarSign, FaUsers, FaBell, FaEdit, 
  FaExclamationTriangle, FaChartLine
} from 'react-icons/fa'
import { InsuranceDashboardData } from './types'
import { mockInsuranceData } from './constants'
import StatCard from './StatCard'
import ClaimsTable from './ClaimsTable'
import PolicyHoldersTable from './PolicyHoldersTable'
import EarningsSidebar from './EarningsSidebar'

export default function InsuranceDashboardPage() {
  const [insuranceData] = useState<InsuranceDashboardData>(mockInsuranceData)

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={insuranceData.avatar} 
                alt={insuranceData.name} 
                className="w-14 h-14 rounded-full border-2 border-blue-500" 
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{insuranceData.name}</h1>
                <p className="text-gray-600">{insuranceData.companyName} • {insuranceData.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {insuranceData.stats.expiringPolicies}
                </span>
              </button>
              <Link 
                href="/insurance/settings" 
                className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <FaEdit />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
      </div>
    </div>
  )
}