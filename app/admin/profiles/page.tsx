'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaUserMd, FaUserNurse, FaChild, FaAmbulance, FaPills, FaFlask,
  FaSearch, FaFilter, FaEdit, FaTrash, FaEye, FaCheckCircle,
  FaBan, FaStar, FaExclamationCircle, FaDownload
} from 'react-icons/fa'

interface Profile {
  id: string
  name: string
  category: string
  specialization: string
  email: string
  phone: string
  status: 'active' | 'pending' | 'suspended'
  rating: number
  joinDate: string
  lastActive: string
  earnings: number
  avatar: string
}

const mockProfiles: Profile[] = [
  { id: 'P001', name: 'Dr. Sarah Johnson', category: 'Doctor', specialization: 'Cardiology', email: 'sarah.j@health.mu', phone: '+230 5789 0123', status: 'active', rating: 4.8, joinDate: '2024-01-15', lastActive: '2 hours ago', earnings: 15420, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah' },
  { id: 'P002', name: 'Maria Thompson', category: 'Nurse', specialization: 'Elderly Care', email: 'maria.t@care.mu', phone: '+230 5789 0124', status: 'active', rating: 4.9, joinDate: '2024-02-20', lastActive: '1 hour ago', earnings: 8750, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Maria' },
  { id: 'P003', name: 'Emily Carter', category: 'Child Care', specialization: 'Pediatric Nurse', email: 'emily.c@kids.mu', phone: '+230 5789 0125', status: 'pending', rating: 0, joinDate: '2025-08-20', lastActive: 'Never', earnings: 0, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Emily' },
  { id: 'P004', name: 'MediRescue Team', category: 'Emergency', specialization: 'Ambulance Service', email: 'dispatch@medirescue.mu', phone: '911', status: 'active', rating: 4.7, joinDate: '2023-11-10', lastActive: 'Online', earnings: 28900, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Emergency' },
  { id: 'P005', name: 'HealthFirst Pharmacy', category: 'Pharmacy', specialization: 'Community Pharmacy', email: 'contact@healthfirst.mu', phone: '+230 212 3456', status: 'active', rating: 4.6, joinDate: '2023-09-05', lastActive: '3 hours ago', earnings: 34500, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Pharmacy' },
  { id: 'P006', name: 'Dr. James Wilson', category: 'Lab Tech', specialization: 'Pathology', email: 'james.w@lab.mu', phone: '+230 5789 0126', status: 'suspended', rating: 4.2, joinDate: '2024-03-12', lastActive: '5 days ago', earnings: 5200, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=James' },
]

const categories = ['All', 'Doctor', 'Nurse', 'Child Care', 'Emergency', 'Pharmacy', 'Lab Tech']

export default function ProfileManagement() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [profiles, setProfiles] = useState(mockProfiles)

  const filteredProfiles = profiles.filter(profile => {
    const matchCategory = selectedCategory === 'All' || profile.category === selectedCategory
    const matchSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       profile.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || profile.status === statusFilter
    return matchCategory && matchSearch && matchStatus
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-orange-100 text-orange-800',
      suspended: 'bg-red-100 text-red-800'
    }
    return styles[status as keyof typeof styles]
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Doctor': FaUserMd,
      'Nurse': FaUserNurse,
      'Child Care': FaChild,
      'Emergency': FaAmbulance,
      'Pharmacy': FaPills,
      'Lab Tech': FaFlask
    }
    const Icon = icons[category as keyof typeof icons] || FaUserMd
    return <Icon className="text-gray-600" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
              <p className="text-gray-600">Manage all healthcare provider profiles</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <FaDownload /> Export Data
              </button>
              <Link href="/admin/dashboard" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map(profile => (
            <div key={profile.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Image 
                      src={profile.avatar} 
                      alt={profile.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                      <p className="text-sm text-gray-600">{profile.specialization}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(profile.status)}`}>
                    {profile.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium flex items-center gap-2">
                      {getCategoryIcon(profile.category)}
                      {profile.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" />
                      <span className="font-medium">{profile.rating || 'N/A'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Earnings:</span>
                    <span className="font-medium text-green-600">${profile.earnings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Active:</span>
                    <span className="font-medium">{profile.lastActive}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Link 
                    href={`/admin/profiles/${profile.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    <FaEye /> View
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                    <FaEdit /> Edit
                  </button>
                  {profile.status === 'active' ? (
                    <button className="flex items-center justify-center p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200">
                      <FaBan />
                    </button>
                  ) : profile.status === 'pending' ? (
                    <button className="flex items-center justify-center p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                      <FaCheckCircle />
                    </button>
                  ) : (
                    <button className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Summary Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{profiles.length}</p>
              <p className="text-gray-600 text-sm">Total Profiles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {profiles.filter(p => p.status === 'active').length}
              </p>
              <p className="text-gray-600 text-sm">Active</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {profiles.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {profiles.filter(p => p.status === 'suspended').length}
              </p>
              <p className="text-gray-600 text-sm">Suspended</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}