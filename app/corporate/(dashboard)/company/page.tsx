'use client'

import { useState, useEffect } from 'react'
import { FaBuilding, FaSpinner, FaSave, FaCheck } from 'react-icons/fa'

interface CompanyProfile {
  companyName: string
  industry: string
  registrationNumber: string
  employeeCount: number
}

export default function CorporateCompanyPage() {
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: '',
    industry: '',
    registrationNumber: '',
    employeeCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState('')

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

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/corporate/${userId}/dashboard`)
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            const stats = json.data.stats
            setProfile({
              companyName: stats.companyName || '',
              industry: stats.industry || '',
              registrationNumber: stats.registrationNumber || '',
              employeeCount: stats.totalEmployees || 0,
            })
          }
        }
      } catch {
        // Show empty state
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaBuilding className="text-indigo-500" /> Company Profile
        </h1>
        <button
          onClick={async () => {
            if (!userId || saving) return
            setSaving(true)
            setSaved(false)
            try {
              const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  profileData: {
                    companyName: profile.companyName,
                    registrationNumber: profile.registrationNumber,
                    employeeCount: profile.employeeCount,
                  },
                }),
              })
              if (res.ok) setSaved(true)
            } catch {
              // Save failed silently
            } finally {
              setSaving(false)
            }
          }}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? <FaSpinner className="animate-spin" /> : saved ? <FaCheck /> : <FaSave />}
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) => setProfile(prev => ({ ...prev, companyName: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input
              type="text"
              value={profile.industry}
              onChange={(e) => setProfile(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
            <input
              type="text"
              value={profile.registrationNumber}
              onChange={(e) => setProfile(prev => ({ ...prev, registrationNumber: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
            <input
              type="number"
              value={profile.employeeCount}
              onChange={(e) => setProfile(prev => ({ ...prev, employeeCount: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
