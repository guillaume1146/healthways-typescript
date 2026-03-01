'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaDollarSign,
  FaUsers,
  FaChartLine,
  FaTrophy,
  FaRocket,
  FaGift
} from 'react-icons/fa'
import { mockReferralPartnerData } from '../constants'
import { ReferralPartnerData } from '../types'
import StatCard from './StatCard'
import UTMLinkGenerator from './UTMLinkGenerator'
import LeadPerformance from './LeadPerformance'
import RecentConversions from './RecentConversions'
import WalletBalanceCard from '@/components/shared/WalletBalanceCard'

export default function ReferralPartnerDashboard() {
  const [partnerData] = useState<ReferralPartnerData>(mockReferralPartnerData)
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={FaDollarSign} 
            title="Total Earnings" 
            value={`Rs ${partnerData.stats.totalEarnings.toLocaleString()}`}
            subtitle="Lifetime commission"
            color="bg-green-500" 
            trend={18}
          />
          <StatCard 
            icon={FaUsers} 
            title="Total Referrals" 
            value={partnerData.stats.totalReferrals}
            subtitle="People referred"
            color="bg-blue-500" 
            trend={12}
          />
          <StatCard 
            icon={FaChartLine} 
            title="Conversion Rate" 
            value={`${partnerData.stats.conversionRate}%`}
            subtitle="Visitors to customers"
            color="bg-purple-500" 
            trend={3}
          />
          <StatCard 
            icon={FaDollarSign} 
            title="This Month" 
            value={`Rs ${partnerData.stats.thisMonthEarnings.toLocaleString()}`}
            subtitle={`${partnerData.stats.thisMonthReferrals} new referrals`}
            color="bg-orange-500" 
            trend={25}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* UTM Link Generator */}
            <UTMLinkGenerator promoCode={partnerData.promoCode} />

            {/* Lead Performance Dashboard */}
            <LeadPerformance leadsBySource={partnerData.leadsBySource} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Promo Code Card */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Your Promo Code</h3>
              <div className="bg-white/20 rounded-lg p-3 mb-4">
                <p className="text-2xl font-bold font-mono">{partnerData.promoCode}</p>
              </div>
              <p className="text-white/90 text-sm mb-4">
                Share this code with potential customers to earn commissions
              </p>
              <button 
                onClick={() => navigator.clipboard.writeText(partnerData.promoCode)}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition w-full"
              >
                Copy Code
              </button>
            </div>

            {/* Earnings Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Earnings Summary</h3>
                <Link href="/referral-partner/earnings" className="text-purple-600 text-sm hover:underline">
                  View Details
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-medium">Rs {partnerData.earnings.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paid Out</span>
                  <span className="font-medium text-green-600">Rs {partnerData.earnings.paidOut.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium text-orange-600">Rs {partnerData.earnings.pending.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between">
                  <span className="font-bold">Next Payout</span>
                  <span className="font-bold text-purple-600">{partnerData.earnings.nextPayoutDate}</span>
                </div>
              </div>
            </div>

            {/* Recent Conversions */}
            <RecentConversions conversions={partnerData.recentConversions} />

            {/* Partner Level Progress */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-2 flex items-center gap-2">
                <FaTrophy />
                Partner Level Progress
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-yellow-700">Current: {partnerData.partnerLevel}</span>
                  <span className="text-yellow-700">
                    {partnerData.partnerLevel === 'Diamond' ? 'Max Level!' : 'Next: Diamond'}
                  </span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all" 
                    style={{ width: partnerData.partnerLevel === 'Gold' ? '75%' : '100%' }}
                  />
                </div>
              </div>
              <div className="text-yellow-700 text-sm">
                <p className="mb-2">Benefits at {partnerData.partnerLevel} level:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Up to 25% commission rate</li>
                  <li>• Priority support</li>
                  <li>• Marketing materials</li>
                  <li>• Monthly performance calls</li>
                </ul>
              </div>
            </div>

            {/* Marketing Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaRocket />
                Marketing Tips
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">Tip #1</h4>
                  <p className="text-blue-700 text-xs">Share your success story with HealthWyz to build trust with potential customers.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 text-sm mb-1">Tip #2</h4>
                  <p className="text-green-700 text-xs">Use WhatsApp for personal referrals - it has the highest conversion rate!</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">Tip #3</h4>
                  <p className="text-purple-700 text-xs">Create comparison posts showing HealthWyz vs traditional healthcare costs.</p>
                </div>
              </div>
              <Link href="/referral-partner/resources" className="text-purple-600 text-sm hover:underline mt-4 block">
                View More Tips
              </Link>
            </div>

            {/* Special Promotions */}
            <div className="bg-gradient-to-br from-pink-50 to-red-50 border border-pink-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-pink-800 mb-2 flex items-center gap-2">
                <FaGift />
                Special Promotion
              </h3>
              <p className="text-pink-700 text-sm mb-4">
                Earn <strong>50% bonus commission</strong> on all referrals this month! Limited time offer.
              </p>
              <div className="bg-pink-100 rounded-lg p-3">
                <p className="text-pink-800 text-xs">
                  <strong>Ends:</strong> August 31, 2025
                  <br />
                  <strong>Progress:</strong> 12/20 referrals for max bonus
                </p>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}