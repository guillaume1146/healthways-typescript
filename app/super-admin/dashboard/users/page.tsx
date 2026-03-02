'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FaUsers, FaSearch, FaSpinner, FaCheck, FaBan, FaUserTimes,
  FaFilter, FaUserShield
} from 'react-icons/fa'

interface UserRecord {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  userType: string
  accountStatus: string
  verified: boolean
  profileImage: string | null
  createdAt: string
}

const userTypeLabels: Record<string, string> = {
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  NANNY: 'Nanny',
  PHARMACIST: 'Pharmacist',
  LAB_TECHNICIAN: 'Lab Technician',
  EMERGENCY_WORKER: 'Emergency Worker',
  INSURANCE_REP: 'Insurance Rep',
  CORPORATE_ADMIN: 'Corporate Admin',
  REFERRAL_PARTNER: 'Referral Partner',
  PATIENT: 'Patient',
  REGIONAL_ADMIN: 'Regional Admin',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
}

export default function SuperAdminUsersPage() {
  const [userId, setUserId] = useState<string>('')
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

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

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await fetch(`/api/admin/accounts?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setUsers(data.data || [])
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    if (!userId) return
    fetchUsers()
  }, [userId, fetchUsers])

  const handleAction = async (targetUserId: string, action: 'approve' | 'reject' | 'suspend') => {
    setActionLoading(targetUserId)
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId, action }),
      })
      const data = await res.json()
      if (data.success) {
        // Refresh the list after action
        fetchUsers()
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter((u) => {
    if (typeFilter !== 'all' && u.userType !== typeFilter) return false
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (userTypeLabels[u.userType] || u.userType).toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FaUserShield className="text-2xl text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        </div>
        <p className="text-gray-600">Approve, reject, or suspend user accounts across the platform</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {Object.entries(userTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <FaSpinner className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No users found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {userTypeLabels[user.userType] || user.userType}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[user.accountStatus] || 'bg-gray-100 text-gray-800'}`}>
                        {user.accountStatus}
                      </span>
                      {user.verified && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          Verified
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  {user.accountStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(user.id, 'approve')}
                        disabled={actionLoading === user.id}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === user.id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCheck />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(user.id, 'reject')}
                        disabled={actionLoading === user.id}
                        className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        <FaUserTimes /> Reject
                      </button>
                    </>
                  )}
                  {user.accountStatus === 'active' && (
                    <button
                      onClick={() => handleAction(user.id, 'suspend')}
                      disabled={actionLoading === user.id}
                      className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {actionLoading === user.id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaBan />
                      )}
                      Suspend
                    </button>
                  )}
                  {user.accountStatus === 'suspended' && (
                    <button
                      onClick={() => handleAction(user.id, 'approve')}
                      disabled={actionLoading === user.id}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {actionLoading === user.id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaCheck />
                      )}
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && filteredUsers.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-500">
            Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}
