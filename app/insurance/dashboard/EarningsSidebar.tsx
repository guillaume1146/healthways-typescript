import { FaFileExport, FaChartLine } from 'react-icons/fa'
import Link from 'next/link'

interface EarningsSidebarProps {
  totalCommission: number
  platformFee: number
  netPayout: number
}

export default function EarningsSidebar({ totalCommission, platformFee, netPayout }: EarningsSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Today's Payout */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900"> Payout</h3>
          <button className="text-blue-600 text-sm hover:underline">
            <FaFileExport />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Commission</span>
            <span className="font-medium">Rs {totalCommission.toLocaleString()}</span>
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

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Claim Approval Rate</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div className="w-14 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="font-semibold text-green-600">89.5%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Policy Renewal Rate</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <span className="font-semibold text-blue-600">76%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Customer Satisfaction</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div className="w-15 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <span className="font-semibold text-purple-600">4.6/5</span>
            </div>
          </div>
        </div>
        <Link 
          href="/insurance/analytics" 
          className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 mt-4"
        >
          <FaChartLine />
          View Analytics
        </Link>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-500 text-white rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-2">Policy Alerts</h3>
        <p className="text-white/90 text-sm mb-4">23 policies are expiring within 30 days. Take action to ensure renewals.</p>
        <div className="space-y-2 mb-4">
          <div className="bg-white/20 rounded-lg p-2 text-sm">
            <span className="font-medium">High Priority:</span> 5 policies expire this week
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-sm">
            <span className="font-medium">Medium:</span> 18 policies expire this month
          </div>
        </div>
        <Link 
          href="/insurance/policy-alerts" 
          className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
        >
          Manage Alerts
        </Link>
      </div>
    </div>
  )
}