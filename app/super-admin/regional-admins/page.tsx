// app/super-admin/regional-admins/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaUsersCog, FaCheckCircle, FaClock, FaEye, 
   FaSearch,  FaDownload,
  FaChartBar, FaStar, FaExclamationTriangle
} from 'react-icons/fa'

interface RegionalAdmin {
  id: string
  name: string
  email: string
  region: string
  country: string
  status: 'active' | 'pending' | 'suspended' | 'under_review'
  joinDate: string
  lastActive: string
  performance: {
    userGrowth: number
    revenue: number
    satisfactionScore: number
    marketPenetration: number
  }
  kpis: {
    monthlyActiveUsers: number
    monthlyRevenue: number
    providerCount: number
    patientCount: number
  }
  documents: {
    businessPlan: boolean
    financialStatements: boolean
    legalClearance: boolean
    references: boolean
  }
}

export default function RegionalAdminsPage() {
  const [admins, setAdmins] = useState<RegionalAdmin[]>([
    {
      id: 'RA001',
      name: 'Jean-Pierre Rakotomalala',
      email: 'jp.rakoto@healthplatform.mg',
      region: 'Madagascar',
      country: 'MG',
      status: 'active',
      joinDate: '2024-03-15',
      lastActive: '2 hours ago',
      performance: {
        userGrowth: 23.5,
        revenue: 156000,
        satisfactionScore: 4.6,
        marketPenetration: 12.3
      },
      kpis: {
        monthlyActiveUsers: 34560,
        monthlyRevenue: 156000,
        providerCount: 1250,
        patientCount: 28900
      },
      documents: {
        businessPlan: true,
        financialStatements: true,
        legalClearance: true,
        references: true
      }
    },
    {
      id: 'RA002',
      name: 'Grace Mwangi',
      email: 'grace.mwangi@healthplatform.ke',
      region: 'Kenya',
      country: 'KE',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '1 hour ago',
      performance: {
        userGrowth: 32.8,
        revenue: 425000,
        satisfactionScore: 4.7,
        marketPenetration: 18.5
      },
      kpis: {
        monthlyActiveUsers: 78920,
        monthlyRevenue: 425000,
        providerCount: 2890,
        patientCount: 65230
      },
      documents: {
        businessPlan: true,
        financialStatements: true,
        legalClearance: true,
        references: true
      }
    },
    {
      id: 'RA003',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@healthplatform.ng',
      region: 'Nigeria',
      country: 'NG',
      status: 'under_review',
      joinDate: '2025-08-15',
      lastActive: 'Never',
      performance: {
        userGrowth: 0,
        revenue: 0,
        satisfactionScore: 0,
        marketPenetration: 0
      },
      kpis: {
        monthlyActiveUsers: 0,
        monthlyRevenue: 0,
        providerCount: 0,
        patientCount: 0
      },
      documents: {
        businessPlan: true,
        financialStatements: true,
        legalClearance: false,
        references: true
      }
    }
  ])

  console.log(setAdmins)

  const [selectedAdmin, setSelectedAdmin] = useState<RegionalAdmin | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showValidationModal, setShowValidationModal] = useState(false)
  console.log(selectedAdmin)
  console.log(showValidationModal)
  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      under_review: 'bg-blue-100 text-blue-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const filteredAdmins = admins.filter(admin => {
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.region.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Regional Admin Management</h1>
              <p className="text-gray-600 mt-1">Monitor and manage regional administrators across all territories</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/super-admin/regional-admins/validation"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FaUsersCog />
                New Applications (3)
              </Link>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <FaDownload />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {['all', 'active', 'pending', 'under_review', 'suspended'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === status 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
          </div>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAdmins.map(admin => (
            <div key={admin.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${admin.name}`}
                      alt={admin.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{admin.name}</h3>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl">{admin.country === 'MG' ? '🇲🇬' : admin.country === 'KE' ? '🇰🇪' : '🇳🇬'}</span>
                        <span className="text-sm font-medium">{admin.region}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(admin.status)}`}>
                    {admin.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Performance Metrics */}
                {admin.status === 'active' && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">User Growth</p>
                      <p className="text-lg font-bold text-blue-600">+{admin.performance.userGrowth}%</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Monthly Revenue</p>
                      <p className="text-lg font-bold text-green-600">${admin.performance.revenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Satisfaction</p>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-500" />
                        <span className="text-lg font-bold text-purple-600">{admin.performance.satisfactionScore}</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Market Share</p>
                      <p className="text-lg font-bold text-orange-600">{admin.performance.marketPenetration}%</p>
                    </div>
                  </div>
                )}

                {/* Documents Status */}
                {admin.status === 'under_review' && (
                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Document Verification</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        {admin.documents.businessPlan ? 
                          <FaCheckCircle className="text-green-500" /> : 
                          <FaClock className="text-yellow-500" />
                        }
                        <span className="text-sm">Business Plan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {admin.documents.financialStatements ? 
                          <FaCheckCircle className="text-green-500" /> : 
                          <FaClock className="text-yellow-500" />
                        }
                        <span className="text-sm">Financial Statements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {admin.documents.legalClearance ? 
                          <FaCheckCircle className="text-green-500" /> : 
                          <FaExclamationTriangle className="text-red-500" />
                        }
                        <span className="text-sm">Legal Clearance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {admin.documents.references ? 
                          <FaCheckCircle className="text-green-500" /> : 
                          <FaClock className="text-yellow-500" />
                        }
                        <span className="text-sm">References</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button 
                    onClick={() => setSelectedAdmin(admin)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    View Details
                  </button>
                  {admin.status === 'under_review' && (
                    <button 
                      onClick={() => {
                        setSelectedAdmin(admin)
                        setShowValidationModal(true)
                      }}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle />
                      Review
                    </button>
                  )}
                  {admin.status === 'active' && (
                    <Link 
                      href={`/super-admin/regional-admins/performance/${admin.id}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <FaChartBar />
                      Performance
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}