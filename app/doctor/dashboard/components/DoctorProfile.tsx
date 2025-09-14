'use client'

import React, { useState } from 'react'
import {
  FaUserMd,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaGraduationCap,
  FaBriefcase,
  FaCertificate,
  FaAward,
  FaLanguage,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaStethoscope,
  FaMoneyBillWave,
  FaCheckCircle,
  FaStar,
  FaHospital,
  FaPlus,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaIdCard,
  FaFileAlt,
  FaUserClock,
  FaVideo,
  FaHome,
  FaAmbulance,
  FaBook,
  FaUsers
} from 'react-icons/fa'

/* ---------- Types ---------- */

interface Education {
  degree: string
  institution: string
  year: string
}

interface WorkExperience {
  position: string
  organization: string
  period: string
  current: boolean
}

interface Certification {
  name: string
  issuingBody: string
  dateObtained: string
  expiryDate?: string
  certificateUrl?: string
}

interface VerificationDocument {
  name: string
  uploadDate: string
  size: string
  verified?: boolean
}

interface StatisticsSubset {
  totalPatients?: number
}

interface DoctorData {
  firstName?: string
  lastName?: string
  verified?: boolean
  rating?: number
  reviews?: number
  specialty?: string[]
  subSpecialties?: string[]
  clinicAffiliation?: string
  bio?: string
  experience?: string | number

  consultationFee?: number
  videoConsultationFee?: number
  emergencyConsultationFee?: number
  consultationDuration?: number

  telemedicineAvailable?: boolean
  homeVisitAvailable?: boolean
  emergencyAvailable?: boolean

  languages?: string[]

  phone?: string
  email?: string
  location?: string
  website?: string

  statistics?: StatisticsSubset

  education?: Education[]
  workHistory?: WorkExperience[]
  certifications?: Certification[]

  verificationDate?: string
  licenseNumber?: string
  licenseExpiryDate?: string
  verificationDocuments?: VerificationDocument[]

  publications?: string[]
  awards?: string[]
}

interface Props {
  doctorData: DoctorData
  setDoctorData: (data: DoctorData) => void
}

const DoctorProfile: React.FC<Props> = ({ doctorData, setDoctorData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'professional' | 'education' | 'documents'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string>('overview')
  const [editedData, setEditedData] = useState<DoctorData>(doctorData)
  const [showAddEducation, setShowAddEducation] = useState(false)

  const sections = [
    { id: 'overview', label: 'Overview', icon: FaUserMd, color: 'blue' },
    { id: 'professional', label: 'Professional Info', icon: FaStethoscope, color: 'green' },
    { id: 'education', label: 'Education & Experience', icon: FaGraduationCap, color: 'purple' },
    { id: 'documents', label: 'Documents & Verification', icon: FaFileAlt, color: 'orange' }
  ] as const

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection('')
    } else {
      setExpandedSection(sectionId)
      setActiveTab(sectionId as typeof activeTab)
    }
  }

  const handleSave = () => {
    setDoctorData(editedData)
    localStorage.setItem('healthwyz_user', JSON.stringify(editedData))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(doctorData)
    setIsEditing(false)
  }

  const updateField = <K extends keyof DoctorData>(field: K, value: DoctorData[K]) => {
    setEditedData((prev) => ({ ...prev, [field]: value }))
  }

  const removeEducation = (index: number) => {
    setEditedData((prev) => ({
      ...prev,
      education: (prev.education ?? []).filter((_: Education, i: number) => i !== index)
    }))
  }

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-4xl font-bold">
              {editedData.firstName?.[0]}
              {editedData.lastName?.[0]}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200">
                <FaCamera className="text-blue-600" />
              </button>
            )}
            {editedData.verified && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                <FaCheckCircle />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editedData.firstName ?? ''}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={editedData.lastName ?? ''}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Last Name"
                  />
                </div>
                <textarea
                  value={editedData.bio ?? ''}
                  onChange={(e) => updateField('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                  placeholder="Bio"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Dr. {editedData.firstName} {editedData.lastName}
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <FaStethoscope className="text-blue-500" />
                    {editedData.specialty?.join(', ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHospital className="text-green-500" />
                    {editedData.clinicAffiliation}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {editedData.rating ?? 0} ({editedData.reviews ?? 0} reviews)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700">{editedData.bio}</p>
              </>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition flex items-center gap-2 text-sm"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition flex items-center gap-2 text-sm"
                  >
                    <FaSave />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition flex items-center gap-2 text-sm"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <FaUserClock className="text-green-600" />
            <p className="text-xs text-gray-600">Experience</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-green-700">{editedData.experience ?? '-'}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <FaUsers className="text-blue-600" />
            <p className="text-xs text-gray-600">Patients</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-blue-700">{editedData.statistics?.totalPatients ?? 0}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <FaMoneyBillWave className="text-purple-600" />
            <p className="text-xs text-gray-600">Consultation</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-purple-700">Rs {editedData.consultationFee ?? 0}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <FaCertificate className="text-orange-600" />
            <p className="text-xs text-gray-600">Certifications</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-orange-700">{editedData.certifications?.length ?? 0}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <FaPhone className="text-blue-500" />
            {isEditing ? (
              <input
                type="tel"
                value={editedData.phone ?? ''}
                onChange={(e) => updateField('phone', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            ) : (
              <span className="text-sm text-gray-700">{editedData.phone}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-green-500" />
            {isEditing ? (
              <input
                type="email"
                value={editedData.email ?? ''}
                onChange={(e) => updateField('email', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            ) : (
              <span className="text-sm text-gray-700">{editedData.email}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-red-500" />
            {isEditing ? (
              <input
                type="text"
                value={editedData.location ?? ''}
                onChange={(e) => updateField('location', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            ) : (
              <span className="text-sm text-gray-700">{editedData.location}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <FaGlobe className="text-purple-500" />
            {isEditing ? (
              <input
                type="url"
                value={editedData.website ?? ''}
                onChange={(e) => updateField('website', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            ) : (
              <span className="text-sm text-gray-700">{editedData.website || 'Not specified'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfessional = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Specialties */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Specialties & Services</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Primary Specialties</p>
            <div className="flex flex-wrap gap-2">
              {(editedData.specialty ?? []).map((spec, index) => (
                <span
                  key={`${spec}-${index}`}
                  className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm border border-green-300"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Sub-Specialties</p>
            <div className="flex flex-wrap gap-2">
              {(editedData.subSpecialties ?? []).map((spec, index) => (
                <span
                  key={`${spec}-${index}`}
                  className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm border border-blue-300"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Info */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Consultation Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
            <p className="text-xl font-bold text-purple-700">Rs {editedData.consultationFee ?? 0}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Video Consultation</p>
            <p className="text-xl font-bold text-purple-700">Rs {editedData.videoConsultationFee ?? 0}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Emergency Fee</p>
            <p className="text-xl font-bold text-purple-700">Rs {editedData.emergencyConsultationFee ?? 0}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Duration</p>
            <p className="text-xl font-bold text-purple-700">{editedData.consultationDuration ?? 0} min</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-purple-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Available Services</p>
          <div className="flex flex-wrap gap-2">
            {editedData.telemedicineAvailable && (
              <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg text-xs border border-green-300 flex items-center gap-1">
                <FaVideo /> Video Consultation
              </span>
            )}
            {editedData.homeVisitAvailable && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-lg text-xs border border-blue-300 flex items-center gap-1">
                <FaHome /> Home Visit
              </span>
            )}
            {editedData.emergencyAvailable && (
              <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 rounded-lg text-xs border border-red-300 flex items-center gap-1">
                <FaAmbulance /> Emergency
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Languages Spoken</h3>
        <div className="flex flex-wrap gap-2">
          {(editedData.languages ?? []).map((lang, index) => (
            <span
              key={`${lang}-${index}`}
              className="px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 rounded-lg text-sm border border-orange-300 flex items-center gap-2"
            >
              <FaLanguage />
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Education */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Education</h3>
          {isEditing && (
            <button
              onClick={() => setShowAddEducation(!showAddEducation)}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg text-xs hover:from-purple-600 hover:to-pink-700 transition"
            >
              <FaPlus className="inline mr-1" />
              Add
            </button>
          )}
        </div>

        {showAddEducation && (
          <div className="bg-white/80 rounded-lg p-4 mb-4 border border-purple-300">
            <div className="space-y-3">
              <input type="text" placeholder="Degree" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input type="text" placeholder="Institution" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input type="text" placeholder="Year" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm">Add</button>
                <button onClick={() => setShowAddEducation(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {(editedData.education ?? []).map((edu, index) => (
            <div key={`${edu.degree}-${edu.institution}-${index}`} className="bg-white/80 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FaGraduationCap className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{edu.degree}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.year}</p>
                  </div>
                </div>
                {isEditing && (
                  <button onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Experience */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Work Experience</h3>
          {isEditing && (
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-xs hover:from-blue-600 hover:to-indigo-700 transition">
              <FaPlus className="inline mr-1" />
              Add
            </button>
          )}
        </div>

        <div className="space-y-3">
          {(editedData.workHistory ?? []).map((work, index) => (
            <div key={`${work.organization}-${work.position}-${index}`} className="bg-white/80 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaBriefcase className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{work.position}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{work.organization}</p>
                  <p className="text-xs text-gray-500">{work.period}</p>
                  {work.current && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Current</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Certifications</h3>
          {isEditing && (
            <button className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-xs hover:from-green-600 hover:to-emerald-700 transition">
              <FaPlus className="inline mr-1" />
              Add
            </button>
          )}
        </div>

        <div className="space-y-3">
          {(editedData.certifications ?? []).map((cert, index) => (
            <div key={`${cert.name}-${index}`} className="bg-white/80 rounded-lg p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaCertificate className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{cert.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{cert.issuingBody}</p>
                  <p className="text-xs text-gray-500">
                    Obtained: {cert.dateObtained}
                    {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Verification Status */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Verification Status</h3>

        <div className="flex items-center gap-4">
          <div className="p-4 bg-green-100 rounded-full">
            <FaCheckCircle className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-lg font-semibold text-green-800">Profile Verified</p>
            <p className="text-sm text-gray-600">Verified on {editedData.verificationDate}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <FaIdCard className="text-blue-500" />
            <span className="text-sm">License: {editedData.licenseNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-orange-500" />
            <span className="text-sm">Expires: {editedData.licenseExpiryDate}</span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Verification Documents</h3>

        <div className="space-y-3">
          {(editedData.verificationDocuments ?? []).map((doc: VerificationDocument, index: number) => (
            <div key={`${doc.name}-${index}`} className="bg-white/80 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FaFileAlt className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{doc.name}</h4>
                    <p className="text-xs text-gray-600">
                      Uploaded: {doc.uploadDate} • {doc.size}
                    </p>
                  </div>
                </div>
                {doc.verified && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                    <FaCheckCircle />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publications & Awards */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Publications & Awards</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Publications</p>
            <div className="space-y-2">
              {(editedData.publications ?? []).map((pub, index) => (
                <div key={`${pub}-${index}`} className="flex items-start gap-2">
                  <FaBook className="text-purple-500 mt-1" />
                  <p className="text-sm text-gray-700">{pub}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Awards</p>
            <div className="space-y-2">
              {(editedData.awards ?? []).map((award, index) => (
                <div key={`${award}-${index}`} className="flex items-start gap-2">
                  <FaAward className="text-yellow-500 mt-1" />
                  <p className="text-sm text-gray-700">{award}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
              <FaUserMd className="mr-2 sm:mr-3" />
              Doctor Profile
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Manage your professional information</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{editedData.rating ?? 0}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-xs ${i < Math.floor(editedData.rating ?? 0) ? 'text-yellow-300' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-xs opacity-90">{editedData.reviews ?? 0} reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Accordion / Desktop Tabs */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Desktop Tab Navigation */}
        <div className="hidden sm:block border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {sections.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-shrink-0 px-4 md:px-6 py-3 md:py-4 text-center font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? `text-${tab.color}-600 border-b-2 border-current bg-gradient-to-b from-${tab.color}-50 to-transparent`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="text-sm md:text-base" />
                <span className="whitespace-nowrap text-sm md:text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="sm:hidden">
          {sections.map((section) => (
            <div key={section.id} className="border-b border-gray-200">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full px-4 py-3 flex items-center justify-between transition-all ${
                  expandedSection === section.id ? `bg-gradient-to-r from-${section.color}-50 to-${section.color}-100/50` : 'bg-white/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <section.icon className={`text-${section.color}-500`} />
                  <span
                    className={`font-medium ${
                      expandedSection === section.id ? `text-${section.color}-700` : 'text-gray-700'
                    }`}
                  >
                    {section.label}
                  </span>
                </div>
                {expandedSection === section.id ? (
                  <FaChevronUp className={`text-${section.color}-500`} />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="p-4 bg-white/60">
                  {section.id === 'overview' && renderOverview()}
                  {section.id === 'professional' && renderProfessional()}
                  {section.id === 'education' && renderEducation()}
                  {section.id === 'documents' && renderDocuments()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Content */}
        <div className="hidden sm:block p-4 md:p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'professional' && renderProfessional()}
          {activeTab === 'education' && renderEducation()}
          {activeTab === 'documents' && renderDocuments()}
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
