'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaUser, FaSave, FaSpinner, FaStethoscope } from 'react-icons/fa'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  category: string
  specialty: string
  subSpecialties: string
  licenseNumber: string
  clinicAffiliation: string
  consultationFee: string
  videoConsultationFee: string
  bio: string
  languages: string
  experience: string
  location: string
}

interface SaveStatus {
  type: 'success' | 'error'
  message: string
}

const DoctorProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    specialty: '',
    subSpecialties: '',
    licenseNumber: '',
    clinicAffiliation: '',
    consultationFee: '',
    videoConsultationFee: '',
    bio: '',
    languages: '',
    experience: '',
    location: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (!stored) {
        setLoading(false)
        return
      }

      let localUser: { id?: string; firstName?: string; lastName?: string; email?: string }
      try {
        localUser = JSON.parse(stored)
      } catch {
        setLoading(false)
        return
      }
      const id = localUser.id
      setUserId(id ?? null)

      setProfile((prev) => ({
        ...prev,
        firstName: localUser.firstName || '',
        lastName: localUser.lastName || '',
        email: localUser.email || '',
      }))

      const res = await fetch(`/api/users/${id}`)
      if (!res.ok) throw new Error('Failed to fetch profile')

      const { data } = await res.json()
      const p = data.profile || data.doctorProfile || {}

      setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        category: p.category || '',
        specialty: Array.isArray(p.specialty) ? p.specialty.join(', ') : (p.specialty || ''),
        subSpecialties: Array.isArray(p.subSpecialties) ? p.subSpecialties.join(', ') : (p.subSpecialties || ''),
        licenseNumber: p.licenseNumber || '',
        clinicAffiliation: p.clinicAffiliation || '',
        consultationFee: p.consultationFee?.toString() || '',
        videoConsultationFee: p.videoConsultationFee?.toString() || '',
        bio: p.bio || '',
        languages: Array.isArray(p.languages) ? p.languages.join(', ') : (p.languages || ''),
        experience: p.experience?.toString() || '',
        location: p.location || '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
          address: profile.address,
          profileData: {
            category: profile.category,
            specialty: profile.specialty.split(',').map(s => s.trim()).filter(Boolean),
            subSpecialties: profile.subSpecialties.split(',').map(s => s.trim()).filter(Boolean),
            licenseNumber: profile.licenseNumber,
            clinicAffiliation: profile.clinicAffiliation,
            consultationFee: profile.consultationFee ? parseFloat(profile.consultationFee) : null,
            videoConsultationFee: profile.videoConsultationFee ? parseFloat(profile.videoConsultationFee) : null,
            bio: profile.bio,
            languages: profile.languages.split(',').map(s => s.trim()).filter(Boolean),
            experience: profile.experience,
            location: profile.location,
          },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save profile')
      }

      try {
        const stored = localStorage.getItem('healthwyz_user')
        if (stored) {
          const localUser = JSON.parse(stored)
          localUser.firstName = profile.firstName
          localUser.lastName = profile.lastName
          localUser.email = profile.email
          localStorage.setItem('healthwyz_user', JSON.stringify(localUser))
        }
      } catch {
        // Corrupted localStorage -- skip sync
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
          <FaUser className="text-blue-600" /> Personal Information
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input name="address" value={profile.address} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaStethoscope className="text-blue-600" /> Professional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input name="category" value={profile.category} onChange={handleChange} placeholder="e.g. General Practitioner" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty (comma-separated)</label>
            <input name="specialty" value={profile.specialty} onChange={handleChange} placeholder="e.g. Cardiology, Internal Medicine" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Specialties (comma-separated)</label>
            <input name="subSpecialties" value={profile.subSpecialties} onChange={handleChange} placeholder="e.g. Interventional Cardiology" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
            <input name="licenseNumber" value={profile.licenseNumber} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Affiliation</label>
            <input name="clinicAffiliation" value={profile.clinicAffiliation} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <input name="experience" value={profile.experience} onChange={handleChange} placeholder="e.g. 10 years" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (MUR)</label>
            <input name="consultationFee" type="number" value={profile.consultationFee} onChange={handleChange} placeholder="e.g. 1500" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video Consultation Fee (MUR)</label>
            <input name="videoConsultationFee" type="number" value={profile.videoConsultationFee} onChange={handleChange} placeholder="e.g. 1200" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input name="location" value={profile.location} onChange={handleChange} placeholder="e.g. Port Louis, Mauritius" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma-separated)</label>
            <input name="languages" value={profile.languages} onChange={handleChange} placeholder="e.g. English, French, Creole" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} rows={4} placeholder="Describe your experience and specialties..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
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

export default DoctorProfileTab
