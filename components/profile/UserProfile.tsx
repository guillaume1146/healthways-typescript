'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt, FaCheckCircle, FaClock, FaEdit, FaVenusMars } from 'react-icons/fa'
import Link from 'next/link'

interface UserProfileProps {
  userId: string
  userType: string
  settingsPath: string
}

// Profile data from various user types
interface UserProfileData {
  // Patient
  bloodType?: string
  allergies?: string[]
  chronicConditions?: string[]
  healthScore?: number
  emergencyContact?: { name: string; relationship: string; phone: string }
  // Doctor
  specialty?: string
  licenseNumber?: string
  clinicAffiliation?: string
  consultationFee?: number
  rating?: number
  bio?: string
  // Nurse
  experience?: number
  specializations?: string[]
  // Nanny
  certifications?: string[]
  // Pharmacist
  pharmacyName?: string
  // Lab Technician
  labName?: string
  // Emergency Worker
  vehicleType?: string
  responseZone?: string
  emtLevel?: string
  // Insurance Rep
  companyName?: string
  coverageTypes?: string[]
  // Corporate Admin
  employeeCount?: number
  // Referral Partner
  businessType?: string
  commissionRate?: number
  referralCode?: string
  // Regional Admin
  region?: string
  country?: string
}

function renderTypeSpecificSection(userType: string, profile: UserProfileData | null | undefined) {
  if (!profile) return null

  const sections: Record<string, { label: string; value: string | number | string[] | null | undefined }[]> = {
    PATIENT: [
      { label: 'Blood Type', value: profile.bloodType },
      { label: 'Allergies', value: profile.allergies },
      { label: 'Chronic Conditions', value: profile.chronicConditions },
      { label: 'Health Score', value: profile.healthScore },
      ...(profile.emergencyContact ? [
        { label: 'Emergency Contact', value: `${profile.emergencyContact.name} (${profile.emergencyContact.relationship}) - ${profile.emergencyContact.phone}` },
      ] : []),
    ],
    DOCTOR: [
      { label: 'Specialty', value: profile.specialty },
      { label: 'License Number', value: profile.licenseNumber },
      { label: 'Clinic Affiliation', value: profile.clinicAffiliation },
      { label: 'Consultation Fee', value: profile.consultationFee ? `Rs ${profile.consultationFee}` : null },
      { label: 'Rating', value: profile.rating ? `${profile.rating}/5` : null },
      { label: 'Bio', value: profile.bio },
    ],
    NURSE: [
      { label: 'License Number', value: profile.licenseNumber },
      { label: 'Experience', value: profile.experience ? `${profile.experience} years` : null },
      { label: 'Specializations', value: profile.specializations },
    ],
    NANNY: [
      { label: 'Experience', value: profile.experience ? `${profile.experience} years` : null },
      { label: 'Certifications', value: profile.certifications },
    ],
    PHARMACIST: [
      { label: 'License Number', value: profile.licenseNumber },
      { label: 'Pharmacy Name', value: profile.pharmacyName },
    ],
    LAB_TECHNICIAN: [
      { label: 'License Number', value: profile.licenseNumber },
      { label: 'Lab Name', value: profile.labName },
      { label: 'Specializations', value: profile.specializations },
    ],
    EMERGENCY_WORKER: [
      { label: 'Certifications', value: profile.certifications },
      { label: 'Vehicle Type', value: profile.vehicleType },
      { label: 'Response Zone', value: profile.responseZone },
      { label: 'EMT Level', value: profile.emtLevel },
    ],
    INSURANCE_REP: [
      { label: 'Company Name', value: profile.companyName },
      { label: 'Coverage Types', value: profile.coverageTypes },
    ],
    CORPORATE_ADMIN: [
      { label: 'Company Name', value: profile.companyName },
      { label: 'Employee Count', value: profile.employeeCount },
    ],
    REFERRAL_PARTNER: [
      { label: 'Business Type', value: profile.businessType },
      { label: 'Commission Rate', value: profile.commissionRate ? `${profile.commissionRate}%` : null },
      { label: 'Referral Code', value: profile.referralCode },
    ],
    REGIONAL_ADMIN: [
      { label: 'Region', value: profile.region },
      { label: 'Country', value: profile.country },
    ],
  }

  const fields = sections[userType]
  if (!fields || fields.length === 0) return null

  const validFields = fields.filter(f => f.value !== null && f.value !== undefined && f.value !== '')

  if (validFields.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validFields.map((field) => (
          <div key={field.label}>
            <p className="text-sm text-gray-500">{field.label}</p>
            <p className="text-gray-900 font-medium">
              {Array.isArray(field.value) ? field.value.join(', ') : String(field.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
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

interface UserData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  profileImage?: string
  verified?: boolean
  accountStatus?: string
  createdAt?: string
  profile?: UserProfileData | null
}

export default function UserProfile({ userId, userType, settingsPath }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${userId}`)
        const json = await res.json()
        if (json.data) setUserData(json.data)
      } catch (err) {
        console.error('Failed to fetch user profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!userData) {
    return <div className="text-center py-20 text-gray-500">Failed to load profile</div>
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {userData.profileImage ? (
              <img src={userData.profileImage} alt="" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {userData.firstName} {userData.lastName}
              </h2>
              {userData.verified && (
                <FaCheckCircle className="text-blue-500" title="Verified" />
              )}
            </div>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {USER_TYPE_LABELS[userType] || userType}
            </span>
            {userData.accountStatus && (
              <span className={`inline-block ml-2 mt-1 px-3 py-0.5 rounded-full text-sm font-medium ${
                userData.accountStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {userData.accountStatus}
              </span>
            )}
          </div>
          <Link
            href={settingsPath}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <FaEdit /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{userData.email}</p>
            </div>
          </div>
          {userData.phone && (
            <div className="flex items-center gap-3">
              <FaPhone className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{userData.phone}</p>
              </div>
            </div>
          )}
          {userData.dateOfBirth && (
            <div className="flex items-center gap-3">
              <FaBirthdayCake className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-gray-900">{new Date(userData.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          {userData.gender && (
            <div className="flex items-center gap-3">
              <FaVenusMars className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-gray-900 capitalize">{userData.gender}</p>
              </div>
            </div>
          )}
          {userData.address && (
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900">{userData.address}</p>
              </div>
            </div>
          )}
          {userData.createdAt && (
            <div className="flex items-center gap-3">
              <FaClock className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-gray-900">{new Date(userData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Type-specific section */}
      {renderTypeSpecificSection(userType, userData.profile)}
    </div>
  )
}
