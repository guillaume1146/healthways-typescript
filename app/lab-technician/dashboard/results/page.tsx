'use client'

import { useState, useEffect } from 'react'
import { FaClipboardCheck, FaSearch, FaClock, FaCheckCircle, FaPaperPlane, FaFlask } from 'react-icons/fa'

interface LabResult {
  id: string
  patientName: string
  testName: string
  status: 'pending' | 'ready' | 'sent'
  date: string
  category?: string
}

export default function LabResultsPage() {
  const [userId, setUserId] = useState<string>('')
  const [results, setResults] = useState<LabResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

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

  useEffect(() => {
    if (!userId) return

    const fetchResults = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/lab-techs/${userId}/results`)
        if (!res.ok) {
          if (res.status === 404) {
            setResults([])
            return
          }
          throw new Error('Failed to fetch lab results')
        }
        const json = await res.json()
        setResults(json.data ?? json.results ?? (Array.isArray(json) ? json : []))
      } catch (err) {
        console.error('Failed to fetch lab results:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [userId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: FaClock }
      case 'ready':
        return { label: 'Ready', color: 'bg-green-100 text-green-800', icon: FaCheckCircle }
      case 'sent':
        return { label: 'Sent', color: 'bg-blue-100 text-blue-800', icon: FaPaperPlane }
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: FaClock }
    }
  }

  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || result.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FaClipboardCheck className="text-3xl text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>
          <p className="text-sm text-gray-500">View and manage patient test results</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient or test name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="ready">Ready</option>
          <option value="sent">Sent</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <FaFlask className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No lab results to display</h3>
          <p className="text-sm text-gray-400">
            {searchTerm || statusFilter
              ? 'Try adjusting your search or filter.'
              : 'Results will appear here once tests are processed.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Test Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredResults.map((result) => {
                  const badge = getStatusBadge(result.status)
                  const BadgeIcon = badge.icon
                  return (
                    <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {result.patientName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {result.testName}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                          <BadgeIcon className="text-[10px]" />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(result.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
