// File: app/doctor/profile/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaUser, 
  FaUsers,
  FaGraduationCap, 
  FaCertificate, 
  FaHospital, 
  FaEdit, 
  FaSave, 
  FaCamera,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaLanguage,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft
} from 'react-icons/fa'

// Mock data for static prototype
const mockDoctorProfile = {
  personalInfo: {
    fullName: "Dr. Sarah Johnson",
    email: "sarah.johnson@healthways.mu",
    phone: "+230 123 4567",
    avatar: "👩‍⚕️",
    bio: "Experienced cardiologist with over 10 years of practice. Specialized in interventional cardiology and heart disease prevention. Committed to providing compassionate, evidence-based care to all patients.",
    languages: ["English", "French", "Creole"],
    dateOfBirth: "1985-03-15",
    gender: "Female"
  },
  professionalInfo: {
    specialty: "Cardiology",
    subSpecialties: ["Interventional Cardiology", "Preventive Cardiology"],
    licenseNumber: "MD-12345-MU",
    experience: "10+ years",
    education: [
      {
        degree: "MD - Doctor of Medicine",
        institution: "University of Mauritius",
        year: "2012",
        verified: true
      },
      {
        degree: "Fellowship in Cardiology",
        institution: "Royal College of Physicians",
        year: "2015",
        verified: true
      }
    ],
    certifications: [
      {
        name: "Board Certification in Cardiology",
        issuer: "Mauritius Medical Council",
        expiryDate: "2026-03-15",
        verified: true
      },
      {
        name: "Advanced Cardiac Life Support (ACLS)",
        issuer: "American Heart Association",
        expiryDate: "2025-06-20",
        verified: true
      }
    ],
    affiliations: [
      "Apollo Bramwell Hospital",
      "Wellkin Hospital",
      "Fortis Clinique Darné"
    ]
  },
  practiceInfo: {
    consultationFee: 2500,
    currency: "MUR",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "09:00 AM - 05:00 PM",
    locations: [
      {
        name: "Apollo Bramwell Hospital",
        address: "Corner Brown Sequard & Antelme Streets, Port Louis",
        isMain: true
      },
      {
        name: "Private Clinic",
        address: "Royal Road, Rose Hill",
        isMain: false
      }
    ],
    services: [
      "General Cardiology Consultation",
      "Cardiac Risk Assessment",
      "Echocardiography",
      "Stress Testing",
      "Preventive Cardiology",
      "Teleconsultation"
    ]
  },
  stats: {
    rating: 4.8,
    reviews: 142,
    patients: 247,
    completionRate: 95,
    profileCompleteness: 85
  }
}

const DoctorProfile = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(mockDoctorProfile)

  const handleSave = () => {
    // In real app, this would save to backend
    setIsEditing(false)
    console.log('Profile saved:', formData)
  }

  const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )

  const VerificationBadge = ({ verified }: { verified: boolean }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    }`}>
      {verified ? <FaCheckCircle /> : <FaExclamationCircle />}
      {verified ? 'Verified' : 'Pending'}
    </span>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/doctor/dashboard" className="text-gray-600 hover:text-primary-blue">
                <FaArrowLeft className="text-xl" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Professional Profile</h1>
            </div>
            <div className="flex items-center gap-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="btn-gradient px-6 py-2"
                  >
                    <FaSave className="inline mr-2" />
                    Save Changes
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-gradient px-6 py-2"
                >
                  <FaEdit className="inline mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="text-6xl mb-4">{formData.personalInfo.avatar}</div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-primary-blue text-white p-2 rounded-full">
                      <FaCamera />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{formData.personalInfo.fullName}</h2>
                <p className="text-gray-600 mb-4">{formData.professionalInfo.specialty}</p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <FaStar className="text-yellow-500" />
                  <span className="font-semibold">{formData.stats.rating}</span>
                  <span className="text-gray-600">({formData.stats.reviews} reviews)</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUsers className="text-primary-blue" />
                    <span>{formData.stats.patients} Patients</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCheckCircle className="text-green-500" />
                    <span>{formData.stats.completionRate}% Completion Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completeness */}
            <div className="bg-gradient-main text-white rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-2">Profile Completeness</h3>
              <div className="bg-white/20 rounded-full h-3 mb-2">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-300"
                  style={{ width: `${formData.stats.profileCompleteness}%` }}
                ></div>
              </div>
              <p className="text-sm text-white/90">{formData.stats.profileCompleteness}% Complete</p>
              <p className="text-xs text-white/80 mt-2">
                Complete your profile to increase patient bookings
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <nav className="flex flex-col">
                {[
                  { key: 'personal', label: 'Personal Info', icon: FaUser },
                  { key: 'professional', label: 'Professional', icon: FaGraduationCap },
                  { key: 'practice', label: 'Practice Info', icon: FaHospital },
                  { key: 'verification', label: 'Verification', icon: FaCertificate }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 ${
                      activeTab === tab.key ? 'bg-blue-50 text-primary-blue border-r-4 border-primary-blue' : 'text-gray-700'
                    }`}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div>
                <ProfileSection title="Personal Information">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.personalInfo.fullName}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, fullName: e.target.value }
                          })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.personalInfo.fullName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        <span className="text-gray-900">{formData.personalInfo.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.personalInfo.phone}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, phone: e.target.value }
                          })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400" />
                          <span className="text-gray-900">{formData.personalInfo.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Languages</label>
                      <div className="flex items-center gap-2">
                        <FaLanguage className="text-gray-400" />
                        <span className="text-gray-900">{formData.personalInfo.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Professional Bio</label>
                    {isEditing ? (
                      <textarea
                        value={formData.personalInfo.bio}
                        onChange={(e) => setFormData({
                          ...formData,
                          personalInfo: { ...formData.personalInfo, bio: e.target.value }
                        })}
                        rows={4}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                        placeholder="Write a brief bio about your medical practice and expertise..."
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{formData.personalInfo.bio}</p>
                    )}
                  </div>
                </ProfileSection>
              </div>
            )}

            {/* Professional Information */}
            {activeTab === 'professional' && (
              <div>
                <ProfileSection title="Medical Education">
                  <div className="space-y-4">
                    {formData.professionalInfo.education.map((edu, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.institution}</p>
                            <p className="text-gray-500 text-sm">Graduated: {edu.year}</p>
                          </div>
                          <VerificationBadge verified={edu.verified} />
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full text-center text-gray-600 hover:border-primary-blue hover:text-primary-blue">
                        + Add Education
                      </button>
                    )}
                  </div>
                </ProfileSection>

                <ProfileSection title="Certifications & Licenses">
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Medical License</h4>
                          <p className="text-gray-600">License #: {formData.professionalInfo.licenseNumber}</p>
                          <p className="text-gray-500 text-sm">Mauritius Medical Council</p>
                        </div>
                        <VerificationBadge verified={true} />
                      </div>
                    </div>

                    {formData.professionalInfo.certifications.map((cert, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                            <p className="text-gray-600">{cert.issuer}</p>
                            <p className="text-gray-500 text-sm">Expires: {cert.expiryDate}</p>
                          </div>
                          <VerificationBadge verified={cert.verified} />
                        </div>
                      </div>
                    ))}

                    {isEditing && (
                      <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full text-center text-gray-600 hover:border-primary-blue hover:text-primary-blue">
                        + Add Certification
                      </button>
                    )}
                  </div>
                </ProfileSection>
              </div>
            )}

            {/* Practice Information */}
            {activeTab === 'practice' && (
              <div>
                <ProfileSection title="Practice Locations">
                  <div className="space-y-4">
                    {formData.practiceInfo.locations.map((location, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              {location.name}
                              {location.isMain && (
                                <span className="bg-primary-blue text-white px-2 py-1 rounded-full text-xs">Main</span>
                              )}
                            </h4>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                              <FaMapMarkerAlt className="text-gray-400" />
                              <span>{location.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ProfileSection>

                <ProfileSection title="Consultation Details">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Consultation Fee</label>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.practiceInfo.consultationFee}
                            onChange={(e) => setFormData({
                              ...formData,
                              practiceInfo: { ...formData.practiceInfo, consultationFee: parseInt(e.target.value) }
                            })}
                            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                          />
                          <span className="text-gray-600">{formData.practiceInfo.currency}</span>
                        </div>
                      ) : (
                        <p className="text-gray-900">
                          {formData.practiceInfo.currency} {formData.practiceInfo.consultationFee.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Working Hours</label>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        <span className="text-gray-900">{formData.practiceInfo.workingHours}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Available Days</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.practiceInfo.availableDays.map((day) => (
                        <span key={day} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Services Offered</label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {formData.practiceInfo.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" />
                          <span className="text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ProfileSection>
              </div>
            )}

            {/* Verification Status */}
            {activeTab === 'verification' && (
              <div>
                <ProfileSection title="Verification Status">
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-500 text-xl" />
                        <div>
                          <h4 className="font-semibold text-green-800">Profile Verified</h4>
                          <p className="text-green-700 text-sm">Your professional profile has been verified and approved</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Medical License</h4>
                        <VerificationBadge verified={true} />
                        <p className="text-gray-600 text-sm mt-2">Verified with Mauritius Medical Council</p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                        <VerificationBadge verified={true} />
                        <p className="text-gray-600 text-sm mt-2">All degrees verified</p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Background Check</h4>
                        <VerificationBadge verified={true} />
                        <p className="text-gray-600 text-sm mt-2">Clean background verification</p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Insurance</h4>
                        <VerificationBadge verified={true} />
                        <p className="text-gray-600 text-sm mt-2">Professional liability insurance verified</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Verification Benefits</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Higher visibility in patient searches</li>
                        <li>• Trust badge on your profile</li>
                        <li>• Access to premium features</li>
                        <li>• Priority customer support</li>
                      </ul>
                    </div>
                  </div>
                </ProfileSection>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile