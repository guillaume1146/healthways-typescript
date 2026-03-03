'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaVenusMars,
  FaSave,
  FaTimes,
  FaSpinner,
  FaBriefcase,
  FaFileAlt,
  FaStar,
  FaHeartbeat,
} from 'react-icons/fa'

// ---------------------------------------------------------------------------
// Type-to-slug mapping
// ---------------------------------------------------------------------------
const USER_TYPE_SLUGS: Record<string, string> = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  NANNY: 'nanny',
  PHARMACIST: 'pharmacist',
  LAB_TECHNICIAN: 'lab-technician',
  EMERGENCY_WORKER: 'responder',
  INSURANCE_REP: 'insurance',
  CORPORATE_ADMIN: 'corporate',
  REFERRAL_PARTNER: 'referral-partner',
  REGIONAL_ADMIN: 'super-admin',
}

const USER_TYPE_LABELS: Record<string, string> = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  NANNY: 'Nanny',
  PHARMACIST: 'Pharmacist',
  LAB_TECHNICIAN: 'Lab Technician',
  EMERGENCY_WORKER: 'Emergency Worker',
  INSURANCE_REP: 'Insurance Representative',
  CORPORATE_ADMIN: 'Corporate Admin',
  REFERRAL_PARTNER: 'Referral Partner',
  REGIONAL_ADMIN: 'Regional Admin',
}

// ---------------------------------------------------------------------------
// Professional / Medical fields configuration
// ---------------------------------------------------------------------------
interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'array' | 'textarea'
}

const PROFESSIONAL_FIELDS: Record<string, FieldConfig[]> = {
  PATIENT: [
    { key: 'bloodType', label: 'Blood Type', type: 'text' },
    { key: 'allergies', label: 'Allergies', type: 'array' },
    { key: 'chronicConditions', label: 'Chronic Conditions', type: 'array' },
    { key: 'healthScore', label: 'Health Score', type: 'number' },
  ],
  DOCTOR: [
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'specialty', label: 'Specialties', type: 'array' },
    { key: 'subSpecialties', label: 'Sub-Specialties', type: 'array' },
    { key: 'licenseNumber', label: 'License Number', type: 'text' },
    { key: 'clinicAffiliation', label: 'Clinic Affiliation', type: 'text' },
    { key: 'consultationFee', label: 'Consultation Fee (MUR)', type: 'number' },
    { key: 'videoConsultationFee', label: 'Video Consultation Fee (MUR)', type: 'number' },
    { key: 'experience', label: 'Experience', type: 'text' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
    { key: 'languages', label: 'Languages', type: 'array' },
    { key: 'location', label: 'Location', type: 'text' },
  ],
  NURSE: [
    { key: 'licenseNumber', label: 'License Number', type: 'text' },
    { key: 'experience', label: 'Experience (years)', type: 'number' },
    { key: 'specializations', label: 'Specializations', type: 'array' },
  ],
  NANNY: [
    { key: 'experience', label: 'Experience (years)', type: 'number' },
    { key: 'certifications', label: 'Certifications', type: 'array' },
  ],
  PHARMACIST: [
    { key: 'licenseNumber', label: 'License Number', type: 'text' },
    { key: 'pharmacyName', label: 'Pharmacy Name', type: 'text' },
    { key: 'pharmacyAddress', label: 'Pharmacy Address', type: 'text' },
    { key: 'specializations', label: 'Specializations', type: 'array' },
  ],
  LAB_TECHNICIAN: [
    { key: 'licenseNumber', label: 'License Number', type: 'text' },
    { key: 'labName', label: 'Lab Name', type: 'text' },
    { key: 'specializations', label: 'Specializations', type: 'array' },
  ],
  EMERGENCY_WORKER: [
    { key: 'certifications', label: 'Certifications', type: 'array' },
    { key: 'vehicleType', label: 'Vehicle Type', type: 'text' },
    { key: 'responseZone', label: 'Response Zone', type: 'text' },
    { key: 'emtLevel', label: 'EMT Level', type: 'text' },
  ],
  INSURANCE_REP: [
    { key: 'companyName', label: 'Company Name', type: 'text' },
    { key: 'licenseNumber', label: 'License Number', type: 'text' },
    { key: 'coverageTypes', label: 'Coverage Types', type: 'array' },
  ],
  CORPORATE_ADMIN: [
    { key: 'companyName', label: 'Company Name', type: 'text' },
    { key: 'registrationNumber', label: 'Registration Number', type: 'text' },
    { key: 'employeeCount', label: 'Employee Count', type: 'number' },
    { key: 'industry', label: 'Industry', type: 'text' },
  ],
  REFERRAL_PARTNER: [
    { key: 'businessType', label: 'Business Type', type: 'text' },
    { key: 'commissionRate', label: 'Commission Rate (%)', type: 'number' },
    { key: 'referralCode', label: 'Referral Code', type: 'text' },
    { key: 'totalReferrals', label: 'Total Referrals', type: 'number' },
  ],
  REGIONAL_ADMIN: [
    { key: 'region', label: 'Region', type: 'text' },
    { key: 'country', label: 'Country', type: 'text' },
    { key: 'countryCode', label: 'Country Code', type: 'text' },
  ],
}

// Provider types that get a Reviews tab
const PROVIDER_TYPES = ['DOCTOR', 'NURSE', 'NANNY']

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  profileImage: string | null
  userType: string
  dateOfBirth: string | null
  gender: string | null
  address: string | null
  verified: boolean
  accountStatus: string
  createdAt: string
  profile: Record<string, unknown> | null
}

interface PersonalFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
}

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------
type TabId = 'personal' | 'professional' | 'documents' | 'reviews'

interface TabDef {
  id: TabId
  label: string
  icon: React.ComponentType<{ className?: string; title?: string; 'aria-label'?: string }>
}

function getTabsForType(userType: string): TabDef[] {
  const tabs: TabDef[] = [
    { id: 'personal', label: 'Personal Info', icon: FaUser },
  ]

  if (userType === 'PATIENT') {
    tabs.push({ id: 'professional', label: 'Medical Info', icon: FaHeartbeat })
  } else {
    tabs.push({ id: 'professional', label: 'Professional Info', icon: FaBriefcase })
  }

  if (PROVIDER_TYPES.includes(userType)) {
    tabs.push({ id: 'reviews', label: 'Reviews', icon: FaStar })
  }

  tabs.push({ id: 'documents', label: 'Documents', icon: FaFileAlt })

  return tabs
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface ProfilePageProps {
  userType: string
}

export default function ProfilePage({ userType }: ProfilePageProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('personal')

  // Edit states
  const [editingPersonal, setEditingPersonal] = useState(false)
  const [editingProfessional, setEditingProfessional] = useState(false)

  // Form data
  const [personalForm, setPersonalForm] = useState<PersonalFormData>({
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: '', address: '',
  })
  const [profileForm, setProfileForm] = useState<Record<string, unknown>>({})

  const tabs = getTabsForType(userType)
  const slug = USER_TYPE_SLUGS[userType] || 'patient'

  // ---------------------------------------------------------------------------
  // Fetch
  // ---------------------------------------------------------------------------
  const fetchUser = useCallback(async () => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (!stored) { setError('Not logged in'); setLoading(false); return }
      let userId: string
      try { userId = JSON.parse(stored).id } catch { setError('Invalid session'); setLoading(false); return }

      const res = await fetch(`/api/users/${userId}`)
      if (!res.ok) { setError('Failed to load profile'); setLoading(false); return }
      const json = await res.json()
      if (json.data) {
        const d = json.data as UserData
        setUserData(d)
        setPersonalForm({
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          email: d.email || '',
          phone: d.phone || '',
          dateOfBirth: d.dateOfBirth ? d.dateOfBirth.slice(0, 10) : '',
          gender: d.gender || '',
          address: d.address || '',
        })
        setProfileForm(d.profile ? { ...d.profile } : {})
      } else {
        setError('Profile not found')
      }
    } catch {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUser() }, [fetchUser])

  // ---------------------------------------------------------------------------
  // Save personal info
  // ---------------------------------------------------------------------------
  const savePersonal = async () => {
    if (!userData) return
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${userData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: personalForm.firstName,
          lastName: personalForm.lastName,
          email: personalForm.email,
          phone: personalForm.phone || null,
          dateOfBirth: personalForm.dateOfBirth || null,
          gender: personalForm.gender || null,
          address: personalForm.address || null,
        }),
      })
      if (res.ok) {
        setEditingPersonal(false)
        // Refresh
        setLoading(true)
        await fetchUser()
      }
    } catch {
      // save failed silently
    } finally {
      setSaving(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Save professional / medical info
  // ---------------------------------------------------------------------------
  const saveProfessional = async () => {
    if (!userData) return
    setSaving(true)
    try {
      const fields = PROFESSIONAL_FIELDS[userType] || []
      const profileData: Record<string, unknown> = {}
      for (const field of fields) {
        const val = profileForm[field.key]
        if (field.type === 'array') {
          // Ensure it's an array
          if (typeof val === 'string') {
            profileData[field.key] = val.split(',').map((s: string) => s.trim()).filter(Boolean)
          } else {
            profileData[field.key] = val
          }
        } else if (field.type === 'number') {
          profileData[field.key] = val !== undefined && val !== '' ? Number(val) : null
        } else {
          profileData[field.key] = val
        }
      }
      const res = await fetch(`/api/users/${userData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileData }),
      })
      if (res.ok) {
        setEditingProfessional(false)
        setLoading(true)
        await fetchUser()
      }
    } catch {
      // save failed silently
    } finally {
      setSaving(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------
  const getInitials = () => {
    if (!userData) return ''
    return `${(userData.firstName || '')[0] || ''}${(userData.lastName || '')[0] || ''}`.toUpperCase()
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not set'
    try { return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return dateStr }
  }

  // ---------------------------------------------------------------------------
  // Loading / Error states
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">{error || 'Failed to load profile'}</p>
          <button onClick={() => { setError(null); setLoading(true); fetchUser() }} className="mt-4 text-blue-600 hover:underline">
            Try again
          </button>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================================================================= */}
      {/* COVER + AVATAR HEADER (Facebook-style)                            */}
      {/* ================================================================= */}
      <div className="relative">
        {/* Cover */}
        <div className="h-[200px] sm:h-[280px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full" />

        {/* Avatar + name card overlapping cover */}
        <div className="max-w-4xl mx-auto px-4 relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0">
            <div className="w-32 h-32 rounded-full ring-4 ring-white bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-lg">
              {userData.profileImage ? (
                <img src={userData.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
              ) : (
                getInitials()
              )}
            </div>
          </div>

          {/* Name block */}
          <div className="pt-20 sm:pt-4 sm:pl-40 pb-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                {userData.firstName} {userData.lastName}
                {userData.verified && (
                  <FaCheckCircle className="text-blue-500 text-xl" title="Verified account" />
                )}
              </h1>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="inline-block px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {USER_TYPE_LABELS[userData.userType] || userData.userType}
              </span>
              <span className={`inline-block px-3 py-0.5 rounded-full text-sm font-medium ${
                userData.accountStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {userData.accountStatus}
              </span>
            </div>

            {/* Edit Profile link */}
            <div className="mt-3">
              <Link
                href={`/${slug}/settings`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <FaEdit /> Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* TAB NAVIGATION                                                    */}
      {/* ================================================================= */}
      <div className="max-w-4xl mx-auto px-4 mt-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <nav className="flex overflow-x-auto" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={tab.label}
                  title={tab.label}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="text-lg" title={tab.label} aria-label={tab.label} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* ================================================================= */}
      {/* TAB CONTENT                                                       */}
      {/* ================================================================= */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* -------------------------------------------------------------- */}
        {/* PERSONAL INFO TAB                                               */}
        {/* -------------------------------------------------------------- */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              {editingPersonal ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingPersonal(false)
                      // Reset form
                      setPersonalForm({
                        firstName: userData.firstName || '',
                        lastName: userData.lastName || '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.slice(0, 10) : '',
                        gender: userData.gender || '',
                        address: userData.address || '',
                      })
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    onClick={savePersonal}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingPersonal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>

            {editingPersonal ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={personalForm.firstName}
                    onChange={(e) => setPersonalForm({ ...personalForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={personalForm.lastName}
                    onChange={(e) => setPersonalForm({ ...personalForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={personalForm.email}
                    onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={personalForm.phone}
                    onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={personalForm.dateOfBirth}
                    onChange={(e) => setPersonalForm({ ...personalForm, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={personalForm.gender}
                    onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={personalForm.address}
                    onChange={(e) => setPersonalForm({ ...personalForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoRow icon={<FaUser className="text-gray-400" />} label="First Name" value={userData.firstName} />
                <InfoRow icon={<FaUser className="text-gray-400" />} label="Last Name" value={userData.lastName} />
                <InfoRow icon={<FaEnvelope className="text-gray-400" />} label="Email" value={userData.email} />
                <InfoRow icon={<FaPhone className="text-gray-400" />} label="Phone" value={userData.phone || 'Not set'} />
                <InfoRow icon={<FaBirthdayCake className="text-gray-400" />} label="Date of Birth" value={formatDate(userData.dateOfBirth)} />
                <InfoRow icon={<FaVenusMars className="text-gray-400" />} label="Gender" value={userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not set'} />
                <div className="md:col-span-2">
                  <InfoRow icon={<FaMapMarkerAlt className="text-gray-400" />} label="Address" value={userData.address || 'Not set'} />
                </div>
                <InfoRow icon={<FaClock className="text-gray-400" />} label="Member Since" value={formatDate(userData.createdAt)} />
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* PROFESSIONAL / MEDICAL INFO TAB                                 */}
        {/* -------------------------------------------------------------- */}
        {activeTab === 'professional' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {userType === 'PATIENT' ? 'Medical Information' : 'Professional Information'}
              </h2>
              {editingProfessional ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProfessional(false)
                      setProfileForm(userData.profile ? { ...userData.profile } : {})
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    onClick={saveProfessional}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingProfessional(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>

            {editingProfessional ? (
              <ProfessionalEditForm
                fields={PROFESSIONAL_FIELDS[userType] || []}
                formData={profileForm}
                onChange={setProfileForm}
              />
            ) : (
              <ProfessionalDisplayGrid
                fields={PROFESSIONAL_FIELDS[userType] || []}
                profile={userData.profile}
              />
            )}
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* REVIEWS TAB                                                     */}
        {/* -------------------------------------------------------------- */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <FaStar className="text-4xl mb-3" />
              <p className="text-lg font-medium">No reviews yet</p>
              <p className="text-sm mt-1">Reviews from patients will appear here.</p>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* DOCUMENTS TAB                                                   */}
        {/* -------------------------------------------------------------- */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <FaFileAlt className="text-4xl mb-3" />
              <p className="text-lg font-medium">No documents uploaded</p>
              <p className="text-sm mt-1">Uploaded documents and their verification status will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  )
}

function ProfessionalDisplayGrid({ fields, profile }: { fields: FieldConfig[]; profile: Record<string, unknown> | null }) {
  if (!profile) {
    return <p className="text-gray-400">No profile data available.</p>
  }

  const hasAnyValue = fields.some((f) => {
    const val = profile[f.key]
    if (val === null || val === undefined || val === '') return false
    if (Array.isArray(val) && val.length === 0) return false
    return true
  })

  if (!hasAnyValue) {
    return <p className="text-gray-400">No profile data available. Click Edit to add your information.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {fields.map((field) => {
        const val = profile[field.key]
        if (val === null || val === undefined || val === '') return null
        if (Array.isArray(val) && val.length === 0) return null

        const isBioField = field.type === 'textarea'

        return (
          <div key={field.key} className={isBioField ? 'md:col-span-2' : ''}>
            <p className="text-sm text-gray-500 mb-1">{field.label}</p>
            {field.type === 'array' && Array.isArray(val) ? (
              <div className="flex flex-wrap gap-1.5">
                {(val as string[]).map((item, idx) => (
                  <span key={idx} className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {item}
                  </span>
                ))}
              </div>
            ) : field.type === 'textarea' ? (
              <p className="text-gray-900 whitespace-pre-wrap">{String(val)}</p>
            ) : (
              <p className="text-gray-900 font-medium">{String(val)}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ProfessionalEditForm({
  fields,
  formData,
  onChange,
}: {
  fields: FieldConfig[]
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}) {
  const handleChange = (key: string, value: unknown) => {
    onChange({ ...formData, [key]: value })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {fields.map((field) => {
        const val = formData[field.key]
        const isWide = field.type === 'textarea'

        return (
          <div key={field.key} className={isWide ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={String(val ?? '')}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : field.type === 'array' ? (
              <>
                <input
                  type="text"
                  value={Array.isArray(val) ? (val as string[]).join(', ') : String(val ?? '')}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Comma-separated values"
                />
                <p className="text-xs text-gray-400 mt-1">Separate multiple values with commas</p>
              </>
            ) : field.type === 'number' ? (
              <input
                type="number"
                value={val !== null && val !== undefined ? String(val) : ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <input
                type="text"
                value={String(val ?? '')}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
