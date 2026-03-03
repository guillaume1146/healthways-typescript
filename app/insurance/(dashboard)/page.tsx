'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  FaShieldAlt, FaClock, FaDollarSign, FaUsers,
  FaExclamationTriangle, FaChartLine, FaSpinner
} from 'react-icons/fa'
import { InsuranceDashboardData } from './types'
import StatCard from './StatCard'
import ClaimsTable from './ClaimsTable'
import PolicyHoldersTable from './PolicyHoldersTable'
import EarningsSidebar from './EarningsSidebar'
import WalletBalanceCard from '@/components/shared/WalletBalanceCard'

const emptyDashboard: InsuranceDashboardData = {
  name: '',
  location: '',
  avatar: '',
  companyName: '',
  stats: {
    activePolicies: 0,
    pendingClaims: 0,
    monthlyCommission: 0,
    policyHolders: 0,
    expiringPolicies: 0,
    claimApprovalRate: 0,
  },
  recentClaims: [],
  policyHolders: [],
  earnings: {
    totalCommission: 0,
    platformFee: 0,
    netPayout: 0,
  },
}

export default function InsuranceDashboardPage() {
  const [insuranceData, setInsuranceData] = useState<InsuranceDashboardData>(emptyDashboard)
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)

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

  const fetchDashboard = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/insurance/${userId}/dashboard`)
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          const apiData = json.data
          // Map plans to policy holders for display
          const policyHolders = (apiData.plans || []).map((plan: { id: string; planName: string; planType: string; premium: number; coverageAmount: number; isActive: boolean }) => ({
            id: plan.id,
            name: plan.planName,
            email: '',
            phone: '',
            policyNumber: `POL-${plan.id.slice(0, 8).toUpperCase()}`,
            policyType: plan.planType,
            premium: plan.premium,
            status: plan.isActive ? 'active' as const : 'expired' as const,
            expiryDate: '',
            coverageAmount: plan.coverageAmount,
          }))

          const activePlans = policyHolders.filter((p: { status: string }) => p.status === 'active').length

          setInsuranceData(prev => ({
            ...prev,
            stats: {
              ...prev.stats,
              activePolicies: apiData.stats?.activePolicies || activePlans,
              policyHolders: apiData.stats?.totalPlans || policyHolders.length,
            },
            policyHolders,
          }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch insurance dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const handleUpdateClaim = async (claimId: string, status: string) => {
    // No claims model in schema — show feedback
    alert(`Claim ${claimId} marked as ${status}. (Claims API not yet available)`)
  }

  const handleEditPolicyHolder = (policyHolderId: string) => {
    window.location.href = `/insurance/dashboard/plans?edit=${policyHolderId}`
  }

  const handleDeletePolicyHolder = async (policyHolderId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    try {
      const res = await fetch(`/api/insurance/plans/${policyHolderId}`, { method: 'DELETE' })
      if (res.ok) {
        fetchDashboard() // Refresh data
      }
    } catch (error) {
      console.error('Failed to delete plan:', error)
    }
  }

  const handleViewPolicyHolder = (policyHolderId: string) => {
    window.location.href = `/insurance/dashboard/plans?view=${policyHolderId}`
  }

  const handleAddPolicyHolder = () => {
    window.location.href = '/insurance/dashboard/plans?add=true'
  }

  return (
    <>
      {userId && (
        <div className="mb-8">
          <WalletBalanceCard userId={userId} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaShieldAlt}
          title="Active Policies"
          value={loading ? '...' : insuranceData.stats.activePolicies}
          color="bg-blue-500"
          subtitle={`${insuranceData.stats.policyHolders} total plans`}
        />
        <StatCard
          icon={FaClock}
          title="Pending Claims"
          value={loading ? '...' : insuranceData.stats.pendingClaims}
          color="bg-yellow-500"
          subtitle="Awaiting review"
        />
        <StatCard
          icon={FaDollarSign}
          title="Monthly Commission"
          value={loading ? '...' : `Rs ${insuranceData.stats.monthlyCommission.toLocaleString()}`}
          color="bg-green-500"
          subtitle="This month"
        />
        <StatCard
          icon={FaUsers}
          title="Policy Holders"
          value={loading ? '...' : insuranceData.stats.policyHolders}
          color="bg-purple-500"
          subtitle={insuranceData.stats.expiringPolicies > 0 ? `${insuranceData.stats.expiringPolicies} expiring soon` : 'All up to date'}
        />
      </div>

      {insuranceData.stats.expiringPolicies > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-orange-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                <strong>Action Required:</strong> {insuranceData.stats.expiringPolicies} policies are expiring within 30 days.
                <Link href="/insurance/dashboard/clients" className="font-medium underline hover:text-orange-800 ml-1">
                  Review and renew policies
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ClaimsTable
            claims={insuranceData.recentClaims}
            onUpdateClaim={handleUpdateClaim}
          />
          <PolicyHoldersTable
            policyHolders={insuranceData.policyHolders}
            onEdit={handleEditPolicyHolder}
            onDelete={handleDeletePolicyHolder}
            onView={handleViewPolicyHolder}
            onAdd={handleAddPolicyHolder}
          />
        </div>

        <div className="space-y-8">
          <EarningsSidebar
            totalCommission={insuranceData.earnings.totalCommission}
            platformFee={insuranceData.earnings.platformFee}
            netPayout={insuranceData.earnings.netPayout}
          />
        </div>
      </div>

      <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/insurance/dashboard/clients"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition group"
          >
            <FaUsers className="text-2xl text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Add Policy Holder</p>
          </Link>
          <Link
            href="/insurance/dashboard/claims"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition group"
          >
            <FaClock className="text-2xl text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Process Claims</p>
          </Link>
          <Link
            href="/insurance/dashboard/clients"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition group"
          >
            <FaShieldAlt className="text-2xl text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Policy Renewals</p>
          </Link>
          <Link
            href="/insurance/dashboard/analytics"
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
