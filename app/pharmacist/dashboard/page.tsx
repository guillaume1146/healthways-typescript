'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaStore, FaClipboardList, FaDollarSign, FaReceipt, FaChartLine, 
  FaBell, FaTruck, FaEdit, FaClock, FaFileExport,
  FaCheckCircle, FaSpinner, FaBoxOpen , FaStar
} from 'react-icons/fa'
import { IconType } from 'react-icons'

// Type Definitions
interface StatCardProps {
  icon: IconType
  title: string
  value: string | number
  color: string
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  itemCount: number
  total: number
  status: 'pending' | 'prepared' | 'in-delivery' | 'completed'
  type: 'Prescription' | 'OTC Product'
}

interface PharmacyDashboardData {
  name: string
  location: string
  avatar: string
  stats: {
    dailyRevenue: number
    pendingOrders: number
    monthlyRevenue: number
    rating: number
  }
  recentOrders: Order[]
  earnings: {
    totalRevenue: number
    platformFee: number
    netPayout: number
  }
  profileCompletion: number
}

// Mock Data
const mockPharmacyData: PharmacyDashboardData = {
  name: 'HealthFirst Pharmacy',
  location: 'Port Louis',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HF&backgroundColor=059669',
  stats: {
    dailyRevenue: 15200,
    pendingOrders: 8,
    monthlyRevenue: 315000,
    rating: 4.8,
  },
  recentOrders: [
    { id: 'ord1', orderNumber: '#HF-8345', customerName: 'John Smith', itemCount: 3, total: 1250, status: 'pending', type: 'Prescription' },
    { id: 'ord2', orderNumber: '#HF-8344', customerName: 'Maria Garcia', itemCount: 1, total: 350, status: 'prepared', type: 'OTC Product' },
    { id: 'ord3', orderNumber: '#HF-8342', customerName: 'David Chen', itemCount: 5, total: 2800, status: 'in-delivery', type: 'Prescription' },
    { id: 'ord4', orderNumber: '#HF-8341', customerName: 'Emma Wilson', itemCount: 2, total: 600, status: 'completed', type: 'OTC Product' },
  ],
  earnings: {
    totalRevenue: 15200,
    platformFee: 760, // Assuming 5%
    netPayout: 14440,
  },
  profileCompletion: 95,
}

const StatCard = ({ icon: Icon, title, value, color }: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-white text-xl" />
      </div>
    </div>
  </div>
)

export default function PharmacyDashboardPage() {
  const [pharmacyData] = useState<PharmacyDashboardData>(mockPharmacyData)

  const getStatusInfo = (status: 'pending' | 'prepared' | 'in-delivery' | 'completed') => {
    switch (status) {
      case 'pending': return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: FaClock };
      case 'prepared': return { text: 'Prepared', color: 'bg-blue-100 text-blue-800', icon: FaBoxOpen };
      case 'in-delivery': return { text: 'In Delivery', color: 'bg-purple-100 text-purple-800', icon: FaTruck };
      case 'completed': return { text: 'Completed', color: 'bg-green-100 text-green-800', icon: FaCheckCircle };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={pharmacyData.avatar} alt={pharmacyData.name} className="w-14 h-14 rounded-full border-2 border-green-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{pharmacyData.name}</h1>
                <p className="text-gray-600">{pharmacyData.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-green-600">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pharmacyData.stats.pendingOrders}
                </span>
              </button>
              <Link href="/pharmacy/settings" className="bg-gradient-to-r from-green-600 to-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                <FaEdit />
                Manage Pharmacy
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={FaDollarSign} title="Today's Revenue" value={`Rs ${pharmacyData.stats.dailyRevenue.toLocaleString()}`} color="bg-green-500" />
          <StatCard icon={FaClipboardList} title="Pending Orders" value={pharmacyData.stats.pendingOrders} color="bg-yellow-500" />
          <StatCard icon={FaReceipt} title="Monthly Revenue" value={`Rs ${pharmacyData.stats.monthlyRevenue.toLocaleString()}`} color="bg-blue-500" />
          <StatCard icon={FaStar} title="Customer Rating" value={pharmacyData.stats.rating} color="bg-purple-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Management */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link href="/pharmacy/orders" className="text-green-600 hover:underline font-medium">View All Orders</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 font-medium text-gray-600">Order ID</th>
                      <th className="p-3 font-medium text-gray-600">Customer</th>
                      <th className="p-3 font-medium text-gray-600">Total</th>
                      <th className="p-3 font-medium text-gray-600">Status</th>
                      <th className="p-3 font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pharmacyData.recentOrders.map((order) => {
                      const statusInfo = getStatusInfo(order.status);
                      return (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-mono text-xs">{order.orderNumber}</td>
                          <td className="p-3 font-medium">{order.customerName}</td>
                          <td className="p-3">Rs {order.total.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${statusInfo.color}`}>
                              <statusInfo.icon /> {statusInfo.text}
                            </span>
                          </td>
                          <td className="p-3">
                            {order.status === 'prepared' && (
                              <button className="bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1">
                                <FaTruck /> Start Delivery
                              </button>
                            )}
                            {order.status === 'pending' && (
                               <button className="bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors">
                                 View Order
                               </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Earnings Dashboard */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Today&apos;s Payout</h3>
                    <button className="text-green-600 text-sm hover:underline"><FaFileExport /></button>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Total Revenue</span><span className="font-medium">Rs {pharmacyData.earnings.totalRevenue.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Platform Fee (5%)</span><span className="font-medium text-red-500">-Rs {pharmacyData.earnings.platformFee.toLocaleString()}</span></div>
                    <div className="border-t pt-3 mt-3 flex justify-between">
                        <span className="font-bold">Net Payout</span>
                        <span className="font-bold text-xl text-green-600">Rs {pharmacyData.earnings.netPayout.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            {/* Profile Completion */}
            <div className="bg-gradient-to-br from-green-600 to-blue-500 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Complete Your Pharmacy Profile</h3>
              <p className="text-white/90 text-sm mb-4">Add pharmacist details and certifications to build trust.</p>
              <div className="bg-white/20 rounded-full h-2.5 mb-2">
                <div className="bg-white rounded-full h-2.5" style={{ width: `${pharmacyData.profileCompletion}%` }}></div>
              </div>
              <p className="text-sm mb-4 font-medium">{pharmacyData.profileCompletion}% Complete</p>
              <Link href="/pharmacy/settings?tab=documents" className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
                Upload License
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}