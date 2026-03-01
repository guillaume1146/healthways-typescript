'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaUser, FaSave, FaSpinner } from 'react-icons/fa'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  gender: string
  address: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelationship: string
}

interface SaveStatus {
  type: 'success' | 'error'
  message: string
}

const PatientProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    try {
      // Step 1: Read basic user data from localStorage
      const stored = localStorage.getItem('healthwyz_user')
      if (!stored) {
        setLoading(false)
        return
      }

      const localUser = JSON.parse(stored)
      const id = localUser.id
      setUserId(id)

      // Pre-populate with what we have from localStorage immediately
      setProfile((prev) => ({
        ...prev,
        firstName: localUser.firstName || '',
        lastName: localUser.lastName || '',
        email: localUser.email || '',
      }))

      // Step 2: Fetch full profile from API
      const res = await fetch(`/api/users/${id}`)
      if (!res.ok) throw new Error('Failed to fetch profile')

      const { data } = await res.json()

      // Format dateOfBirth to YYYY-MM-DD for the date input
      let dob = ''
      if (data.dateOfBirth) {
        dob = new Date(data.dateOfBirth).toISOString().split('T')[0]
      }

      // Extract emergency contact from the patient profile
      const ec = data.profile?.emergencyContact

      setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        dob,
        gender: data.gender || 'Male',
        address: data.address || '',
        emergencyName: ec?.name || '',
        emergencyPhone: ec?.phone || '',
        emergencyRelationship: ec?.relationship || '',
      })
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    // Clear save status when the user makes changes
    if (saveStatus) setSaveStatus(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setSaving(true)
    setSaveStatus(null)

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          dateOfBirth: profile.dob || null,
          gender: profile.gender,
          address: profile.address,
          emergencyContact: {
            name: profile.emergencyName,
            phone: profile.emergencyPhone,
            relationship: profile.emergencyRelationship,
          },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save profile')
      }

      // Update localStorage with the new name/email so other components stay in sync
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        const localUser = JSON.parse(stored)
        localUser.firstName = profile.firstName
        localUser.lastName = profile.lastName
        localUser.email = profile.email
        localStorage.setItem('healthwyz_user', JSON.stringify(localUser))
      }

      setSaveStatus({ type: 'success', message: 'Profile updated successfully.' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setSaveStatus({ type: 'error', message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-blue-600 text-2xl" />
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    )
  }

  return (
    <form className="space-y-8" onSubmit={handleSave}>
      {saveStatus && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium ${
            saveStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {saveStatus.message}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaUser className="text-blue-600" /> Profile Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input name="firstName" value={profile.firstName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input name="lastName" value={profile.lastName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input name="email" type="email" value={profile.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input name="phone" value={profile.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input name="dob" type="date" value={profile.dob} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" value={profile.gender} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input name="address" value={profile.address} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <input name="emergencyName" value={profile.emergencyName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input name="emergencyPhone" value={profile.emergencyPhone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
            <input name="emergencyRelationship" value={profile.emergencyRelationship} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="text-right pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

export default PatientProfileTab
