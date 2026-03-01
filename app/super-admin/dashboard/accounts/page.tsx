'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaUserCheck, FaUserTimes, FaClock, FaCheck, FaBan, FaSearch } from 'react-icons/fa'

interface PendingUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  userType: string
  accountStatus: string
  profileImage: string | null
  verified: boolean
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
}

export default function AccountsPage() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'active' | 'suspended'>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/accounts?status=${filter}`)
      const data = await res.json()
      if (data.success) setUsers(data.data)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleAction = async (userId: string, action: 'approve' | 'reject' | 'suspend') => {
    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter((u) => {
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Management</h1>
        <p className="text-gray-600 mt-1">Review and manage user account registrations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {(['pending', 'active', 'suspended'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'pending' && <FaClock className="inline mr-2" />}
            {status === 'active' && <FaUserCheck className="inline mr-2" />}
            {status === 'suspended' && <FaBan className="inline mr-2" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading accounts...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {filter} accounts found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {userTypeLabels[user.userType] || user.userType}
                    </span>
                    <span className="text-xs text-gray-400">
                      Registered {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {filter === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(user.id, 'approve')}
                      disabled={actionLoading === user.id}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(user.id, 'reject')}
                      disabled={actionLoading === user.id}
                      className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                      <FaUserTimes /> Reject
                    </button>
                  </>
                )}
                {filter === 'active' && (
                  <button
                    onClick={() => handleAction(user.id, 'suspend')}
                    disabled={actionLoading === user.id}
                    className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    <FaBan /> Suspend
                  </button>
                )}
                {filter === 'suspended' && (
                  <button
                    onClick={() => handleAction(user.id, 'approve')}
                    disabled={actionLoading === user.id}
                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    <FaCheck /> Reactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
