'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
    FaPercentage, FaSave, FaEdit, FaTrash, FaPlus, FaInfoCircle,
    FaUserMd, FaUserNurse, FaChild, FaAmbulance, FaPills, FaFlask,
    FaChartBar, FaDollarSign, FaDownload, FaCalendarAlt, FaFilter,
    FaArrowUp, FaArrowDown, FaFilePdf, FaFileExcel, FaFileCsv
} from 'react-icons/fa'
import { IconType } from 'react-icons'

interface CommissionRule {
  id: string
  category: string
  type: 'fixed' | 'percentage' | 'tiered'
  baseRate: number
  tiers?: { min: number; max: number; rate: number }[]
  minAmount?: number
  maxAmount?: number
  effectiveDate: string
  status: 'active' | 'inactive' | 'scheduled'
}

interface CategoryRevenue {
  category: string
  revenue: number
  commission: number
  netPayout: number
  transactions: number
  growth: number
}

interface TransactionData {
  id: string
  date: string
  provider: string
  category: string
  service: string
  amount: number
  commission: number
  payout: number
  status: 'completed' | 'pending' | 'refunded'
}

const mockCommissionRules: CommissionRule[] = [
  { id: 'C001', category: 'Doctors', type: 'percentage', baseRate: 10, effectiveDate: '2025-01-01', status: 'active' },
  { id: 'C002', category: 'Nurses', type: 'tiered', baseRate: 8, tiers: [{ min: 0, max: 100, rate: 8 }, { min: 101, max: 500, rate: 10 }, { min: 501, max: 9999, rate: 12 }], effectiveDate: '2025-01-01', status: 'active' },
  { id: 'C003', category: 'Child Care', type: 'percentage', baseRate: 12, effectiveDate: '2025-01-01', status: 'active' },
  { id: 'C004', category: 'Emergency', type: 'fixed', baseRate: 50, minAmount: 50, maxAmount: 200, effectiveDate: '2025-01-01', status: 'active' },
  { id: 'C005', category: 'Pharmacy', type: 'percentage', baseRate: 8, effectiveDate: '2025-01-01', status: 'active' },
  { id: 'C006', category: 'Lab Tech', type: 'percentage', baseRate: 15, effectiveDate: '2025-01-01', status: 'active' }
]

const mockCategoryRevenue: CategoryRevenue[] = [
  { category: 'Doctors', revenue: 52340, commission: 5234, netPayout: 47106, transactions: 342, growth: 12 },
  { category: 'Nurses', revenue: 28750, commission: 2875, netPayout: 25875, transactions: 486, growth: 8 },
  { category: 'Child Care', revenue: 15200, commission: 1520, netPayout: 13680, transactions: 124, growth: -3 },
  { category: 'Emergency', revenue: 38900, commission: 3890, netPayout: 35010, transactions: 89, growth: 15 },
  { category: 'Pharmacy', revenue: 42100, commission: 4210, netPayout: 37890, transactions: 567, growth: 20 },
  { category: 'Lab Tech', revenue: 12800, commission: 1280, netPayout: 11520, transactions: 156, growth: 5 }
]

const mockTransactions: TransactionData[] = [
  { id: 'T001', date: '2025-08-24', provider: 'Dr. Sarah Johnson', category: 'Doctors', service: 'Consultation', amount: 150, commission: 15, payout: 135, status: 'completed' },
  { id: 'T002', date: '2025-08-24', provider: 'HealthFirst Pharmacy', category: 'Pharmacy', service: 'Medication Delivery', amount: 85, commission: 8.5, payout: 76.5, status: 'completed' },
  { id: 'T003', date: '2025-08-23', provider: 'MediRescue Team', category: 'Emergency', service: 'Emergency Response', amount: 450, commission: 45, payout: 405, status: 'pending' },
  { id: 'T004', date: '2025-08-23', provider: 'Maria Thompson', category: 'Nurses', service: 'Home Care', amount: 120, commission: 12, payout: 108, status: 'completed' }
]

export default function FinancialReporting() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [dateRange, setDateRange] = useState({ start: '2025-08-01', end: '2025-08-31' })

  const totalRevenue = mockCategoryRevenue.reduce((sum, cat) => sum + cat.revenue, 0)
  const totalCommission = mockCategoryRevenue.reduce((sum, cat) => sum + cat.commission, 0)
  const totalPayout = mockCategoryRevenue.reduce((sum, cat) => sum + cat.netPayout, 0)
  const totalTransactions = mockCategoryRevenue.reduce((sum, cat) => sum + cat.transactions, 0)

  const getCategoryIcon = (category: string): React.JSX.Element => {
    const icons: Record<string, React.JSX.Element> = {
      'Doctors': <FaUserMd className="text-blue-600" />,
      'Nurses': <FaUserNurse className="text-purple-600" />,
      'Child Care': <FaChild className="text-pink-600" />,
      'Emergency': <FaAmbulance className="text-red-600" />,
      'Pharmacy': <FaPills className="text-green-600" />,
      'Lab Tech': <FaFlask className="text-orange-600" />
    }
    return icons[category] || <FaDollarSign className="text-gray-600" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Reporting</h1>
              <p className="text-gray-600">Revenue, commissions, and payout analytics</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/dashboard" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Period Selector & Export */}
        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
              {selectedPeriod === 'custom' && (
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  />
                  <span className="text-gray-500">to</span>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <FaFileExcel /> Export Excel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FaFileCsv /> Export CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                <FaFilePdf /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Revenue</span>
              <FaDollarSign className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">Rs {totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
              <FaArrowUp /> 12% from last {selectedPeriod}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Commission</span>
              <FaChartBar className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">Rs {totalCommission.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">10% average rate</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Net Payouts</span>
              <FaDollarSign className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">Rs {totalPayout.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">To providers</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Transactions</span>
              <FaCalendarAlt className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalTransactions.toLocaleString()}</p>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
              <FaArrowUp /> 8% growth
            </p>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue by Category</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">Revenue</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">Commission</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">Net Payout</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">Transactions</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700">Growth</th>
                  <th className="p-3 text-center text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCategoryRevenue.map((cat, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(cat.category)}
                        <span className="font-medium">{cat.category}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-medium">Rs {cat.revenue.toLocaleString()}</td>
                    <td className="p-3 text-right text-gray-600">Rs {cat.commission.toLocaleString()}</td>
                    <td className="p-3 text-right text-gray-600">Rs {cat.netPayout.toLocaleString()}</td>
                    <td className="p-3 text-right">{cat.transactions}</td>
                    <td className="p-3 text-right">
                      <span className={`flex items-center justify-end gap-1 ${cat.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {cat.growth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {Math.abs(cat.growth)}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="text-blue-600 hover:underline text-sm">View Details</button>
                    </td>
                  </tr>
                ))}
                <tr className="border-t bg-gray-50 font-bold">
                  <td className="p-3">Total</td>
                  <td className="p-3 text-right">Rs {totalRevenue.toLocaleString()}</td>
                  <td className="p-3 text-right">Rs {totalCommission.toLocaleString()}</td>
                  <td className="p-3 text-right">Rs {totalPayout.toLocaleString()}</td>
                  <td className="p-3 text-right">{totalTransactions}</td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-700">Date</th>
                  <th className="p-3 text-left font-medium text-gray-700">Provider</th>
                  <th className="p-3 text-left font-medium text-gray-700">Service</th>
                  <th className="p-3 text-right font-medium text-gray-700">Amount</th>
                  <th className="p-3 text-right font-medium text-gray-700">Commission</th>
                  <th className="p-3 text-right font-medium text-gray-700">Payout</th>
                  <th className="p-3 text-center font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-3">{tx.date}</td>
                    <td className="p-3 font-medium">{tx.provider}</td>
                    <td className="p-3 text-gray-600">{tx.service}</td>
                    <td className="p-3 text-right">Rs {tx.amount.toLocaleString()}</td>
                    <td className="p-3 text-right">Rs {tx.commission.toLocaleString()}</td>
                    <td className="p-3 text-right">Rs {tx.payout.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}