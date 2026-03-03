'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaUser, FaSave, FaSpinner } from 'react-icons/fa'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  licenseNumber: string
  pharmacyName: string
  pharmacyAddress: string
  specializations: string
}

interface SaveStatus { type: 'success' | 'error'; message: string }

const PharmacistProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '', lastName: '', email: '', phone: '', address: '',
    licenseNumber: '', pharmacyName: '', pharmacyAddress: '', specializations: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (!stored) { setLoading(false); return }
      let localUser: { id?: string; firstName?: string; lastName?: string; email?: string }
      try { localUser = JSON.parse(stored) } catch { setLoading(false); return }
      const id = localUser.id
      setUserId(id ?? null)
      setProfile((prev) => ({ ...prev, firstName: localUser.firstName || '', lastName: localUser.lastName || '', email: localUser.email || '' }))

      const res = await fetch(`/api/users/${id}`)
      if (!res.ok) throw new Error('Failed to fetch profile')
      const { data } = await res.json()
      const p = data.profile || data.pharmacistProfile || {}

      setProfile({
        firstName: data.firstName || '', lastName: data.lastName || '',
        email: data.email || '', phone: data.phone || '', address: data.address || '',
        licenseNumber: p.licenseNumber || '', pharmacyName: p.pharmacyName || '',
        pharmacyAddress: p.pharmacyAddress || p.address || '',
        specializations: Array.isArray(p.specializations) ? p.specializations.join(', ') : (p.specializations || ''),
      })
    } catch (err) { console.error('Error loading profile:', err) } finally { setLoading(false) }
  }, [])

  useEffect(() => { loadProfile() }, [loadProfile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (saveStatus) setSaveStatus(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setSaving(true); setSaveStatus(null)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profile.firstName, lastName: profile.lastName,
          email: profile.email, phone: profile.phone, address: profile.address,
          profileData: {
            licenseNumber: profile.licenseNumber, pharmacyName: profile.pharmacyName,
            pharmacyAddress: profile.pharmacyAddress,
            specializations: profile.specializations.split(',').map(s => s.trim()).filter(Boolean),
          },
        }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to save profile') }
      try { const stored = localStorage.getItem('healthwyz_user'); if (stored) { const u = JSON.parse(stored); u.firstName = profile.firstName; u.lastName = profile.lastName; u.email = profile.email; localStorage.setItem('healthwyz_user', JSON.stringify(u)) } } catch { /* skip */ }
      setSaveStatus({ type: 'success', message: 'Profile updated successfully.' })
    } catch (err) {
      setSaveStatus({ type: 'error', message: err instanceof Error ? err.message : 'An unexpected error occurred.' })
    } finally { setSaving(false) }
  }

  if (loading) {
    return (<div className="flex items-center justify-center py-12"><FaSpinner className="animate-spin text-blue-600 text-2xl" /><span className="ml-3 text-gray-600">Loading profile...</span></div>)
  }

  return (
    <form className="space-y-8" onSubmit={handleSave}>
      {saveStatus && (<div className={`px-4 py-3 rounded-lg text-sm font-medium ${saveStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{saveStatus.message}</div>)}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><FaUser className="text-blue-600" /> Profile Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label><input name="firstName" value={profile.firstName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label><input name="lastName" value={profile.lastName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input name="email" type="email" value={profile.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input name="phone" value={profile.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input name="address" value={profile.address} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" /></div>
        </div>
      </div>
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Pharmacy Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">License Number</label><input name="licenseNumber" value={profile.licenseNumber} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name</label><input name="pharmacyName" value={profile.pharmacyName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Address</label><input name="pharmacyAddress" value={profile.pharmacyAddress} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Specializations (comma-separated)</label><input name="specializations" value={profile.specializations} onChange={handleChange} placeholder="e.g. Compounding, Clinical Pharmacy, Oncology" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" /></div>
        </div>
      </div>
      <div className="text-right pt-4">
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto">
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}{saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

export default PharmacistProfileTab
