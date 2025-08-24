'use client'

import { JSX, useState } from 'react'
import Link from 'next/link'
import { 
    FaPercentage, FaSave, FaEdit, FaTrash, FaPlus, FaInfoCircle,
    FaUserMd, FaUserNurse, FaChild, FaAmbulance, FaPills, FaFlask,
    FaChartBar, FaDollarSign, FaDownload, FaCalendarAlt, FaFilter,
    FaArrowUp, FaArrowDown, FaFilePdf, FaFileExcel, FaFileCsv
} from 'react-icons/fa'
import { IconType } from 'react-icons'

// --- TYPE DEFINITIONS ---

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

// --- MOCK DATA ---

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


export default function CommissionManagement() {
  const [rules, setRules] = useState(mockCommissionRules)
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      'Doctors': <FaUserMd className="text-blue-600" />,
      'Nurses': <FaUserNurse className="text-purple-600" />,
      'Child Care': <FaChild className="text-pink-600" />,
      'Emergency': <FaAmbulance className="text-red-600" />,
      'Pharmacy': <FaPills className="text-green-600" />,
      'Lab Tech': <FaFlask className="text-orange-600" />
    }
    return icons[category] || <FaPercentage className="text-gray-600" />
  }

  const getTypeBadge = (type: string) => {
    const styles: { [key: string]: string } = {
      fixed: 'bg-blue-100 text-blue-800',
      percentage: 'bg-green-100 text-green-800',
      tiered: 'bg-purple-100 text-purple-800'
    }
    return styles[type]
  }

  const calculateCommission = (amount: number, rule: CommissionRule) => {
    if (rule.type === 'fixed') {
      const commission = rule.baseRate
      if (rule.minAmount && commission < rule.minAmount) return rule.minAmount
      if (rule.maxAmount && commission > rule.maxAmount) return rule.maxAmount
      return commission
    } else if (rule.type === 'percentage') {
      return (amount * rule.baseRate) / 100
    } else if (rule.type === 'tiered' && rule.tiers) {
      const tier = [...rule.tiers].reverse().find(t => amount >= t.min)
      return tier ? (amount * tier.rate) / 100 : 0
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Commission Management</h1>
              <p className="text-gray-600">Configure commission rules by service category</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <FaPlus /> Add Rule
              </button>
              <Link href="/admin/dashboard" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <FaInfoCircle className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Commission Rules Overview</h3>
              <p className="text-sm text-blue-800 mt-1">
                Configure how commissions are calculated for each service category. You can set fixed amounts, 
                percentage-based rates, or tiered structures based on transaction amounts.
              </p>
            </div>
          </div>
        </div>

        {/* Commission Rules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {rules.map(rule => (
            <div key={rule.id} className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(rule.category)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{rule.category}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 capitalize ${getTypeBadge(rule.type)}`}>
                      {rule.type}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingRule(rule)}
                    className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                  >
                    <FaEdit />
                  </button>
                  <button className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {rule.type === 'fixed' ? (
                  <div>
                    <span className="text-gray-600">Fixed Amount:</span>
                    <span className="font-medium ml-2">Rs {rule.baseRate}</span>
                    {rule.minAmount && (
                      <div className="text-xs text-gray-500 mt-1">
                        Min: Rs {rule.minAmount} | Max: Rs {rule.maxAmount}
                      </div>
                    )}
                  </div>
                ) : rule.type === 'percentage' ? (
                  <div>
                    <span className="text-gray-600">Commission Rate:</span>
                    <span className="font-medium ml-2">{rule.baseRate}%</span>
                  </div>
                ) : rule.type === 'tiered' && rule.tiers ? (
                  <div>
                    <span className="text-gray-600">Tiered Rates:</span>
                    <div className="mt-2 space-y-1">
                      {rule.tiers.map((tier, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-500">
                            Rs {tier.min} - {tier.max === 9999 ? '∞' : `Rs ${tier.max}`}
                          </span>
                          <span className="font-medium">{tier.rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                
                <div className="pt-2 border-t">
                  <span className="text-gray-600">Effective Date:</span>
                  <span className="ml-2">{rule.effectiveDate}</span>
                </div>
              </div>

              {/* Commission Calculator */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">Quick Calculator</p>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Amount"
                    className="flex-1 px-2 py-1 border rounded text-sm"
                    onChange={(e) => {
                      const amount = parseFloat(e.target.value) || 0
                      const commission = calculateCommission(amount, rule)
                      const el = document.getElementById(`commission-${rule.id}`)
                      if (el) el.textContent = `Rs ${commission.toFixed(2)}`
                    }}
                  />
                  <span id={`commission-${rule.id}`} className="px-3 py-1 bg-white border rounded text-sm font-medium">
                    Rs 0.00
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}