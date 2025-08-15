'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaUser, 
  FaEdit, 
  FaSave, 
  FaCamera,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaShieldAlt,
  FaHeart,
  FaAllergies,
  FaPills,
  FaUserMd,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft,
  FaCalendarAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaRuler,
  FaWeight,
  FaDroplet,
  FaEye,
  FaUpload,
  FaTrash,
  FaPlus
} from 'react-icons/fa'

// Mock data for static prototype
const mockPatientProfile = {
  personalInfo: {
    fullName: "John Smith",
    email: "john.smith@email.com",
    phone: "+230 123 4567",
    avatar: "👨",
    dateOfBirth: "1988-05-15",
    gender: "Male",
    nationalId: "M1234567890",
    address: {
      street: "123 Royal Road",
      city: "Port Louis",
      postalCode: "11101",
      country: "Mauritius"
    },
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+230 234 5678"
    }
  },
  medicalInfo: {
    bloodType: "O+",
    height: "175", // cm
    weight: "75", // kg
    allergies: [
      { name: "Penicillin", severity: "Severe", reaction: "Rash, difficulty breathing" },
      { name: "Peanuts", severity: "Moderate", reaction: "Hives, swelling" }
    ],
    chronicConditions: [
      { name: "Hypertension", diagnosed: "2020", status: "Controlled" },
      { name: "Type 2 Diabetes", diagnosed: "2019", status: "Managed" }
    ],
    currentMedications: [
      { name: "Metformin 500mg", dosage: "Twice daily", prescribedBy: "Dr. Sarah Johnson" },
      { name: "Lisinopril 10mg", dosage: "Once daily", prescribedBy: "Dr. Sarah Johnson" }
    ],
    familyHistory: [
      { condition: "Heart Disease", relation: "Father", age: "65" },
      { condition: "Diabetes", relation: "Mother", age: "58" }
    ]
  },
  insuranceInfo: {
    provider: "Mauritius Health Insurance",
    policyNumber: "MHI-123456789",
    groupNumber: "GRP-987654",
    expiryDate: "2024-12-31",
    copay: "500 MUR",
    deductible: "5000 MUR"
  },
  preferences: {
    preferredLanguage: "English",
    communicationMethod: "Email",
    doctorGender: "No preference",
    appointmentReminders: true,
    healthTips: true,
    marketingEmails: false
  },
  stats: {
    profileCompleteness: 85,
    lastUpdated: "2024-01-10",
    memberSince: "2023-01-15"
  }
}

const PatientProfile = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(mockPatientProfile)

  const handleSave = () => {
    setIsEditing(false)
    console.log('Profile saved:', formData)
  }

  const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )

  const SeverityBadge = ({ severity }: { severity: string }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      severity === 'Severe' ? 'bg-red-100 text-red-800' :
      severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
      'bg-green-100 text-green-800'
    }`}>
      {severity}
    </span>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/patient/dashboard" className="text-gray-600 hover:text-primary-blue">
                <FaArrowLeft className="text-xl" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
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
                <p className="text-gray-600 mb-4">
                  {new Date().getFullYear() - new Date(formData.personalInfo.dateOfBirth).getFullYear()} years old
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FaDroplet className="text-red-500" />
                    <span>Blood Type: {formData.medicalInfo.bloodType}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>Member since {new Date(formData.stats.memberSince).getFullYear()}</span>
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
                Complete your profile for better healthcare
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/patient/health-records" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <FaHeart className="text-blue-500" />
                  <span className="text-blue-800 font-medium">View Health Records</span>
                </Link>
                <Link href="/patient/appointments" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition">
                  <FaCalendarAlt className="text-green-500" />
                  <span className="text-green-800 font-medium">Book Appointment</span>
                </Link>
                <Link href="/patient/prescriptions" className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                  <FaPills className="text-purple-500" />
                  <span className="text-purple-800 font-medium">My Prescriptions</span>
                </Link>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <nav className="flex flex-col">
                {[
                  { key: 'personal', label: 'Personal Info', icon: FaUser },
                  { key: 'medical', label: 'Medical Info', icon: FaHeart },
                  { key: 'insurance', label: 'Insurance', icon: FaShieldAlt },
                  { key: 'preferences', label: 'Preferences', icon: FaEdit }
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
                      <label className="block text-gray-700 text-sm font-medium mb-2">Date of Birth</label>
                      <div className="flex items-center gap-2">
                        <FaBirthdayCake className="text-gray-400" />
                        <span className="text-gray-900">{new Date(formData.personalInfo.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Gender</label>
                      <div className="flex items-center gap-2">
                        <FaVenusMars className="text-gray-400" />
                        <span className="text-gray-900">{formData.personalInfo.gender}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">National ID</label>
                      <div className="flex items-center gap-2">
                        <FaIdCard className="text-gray-400" />
                        <span className="text-gray-900">{formData.personalInfo.nationalId}</span>
                      </div>
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection title="Address">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Street Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.personalInfo.address.street}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: { 
                              ...formData.personalInfo, 
                              address: { ...formData.personalInfo.address, street: e.target.value }
                            }
                          })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.personalInfo.address.street}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">City</label>
                      <p className="text-gray-900">{formData.personalInfo.address.city}</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Postal Code</label>
                      <p className="text-gray-900">{formData.personalInfo.address.postalCode}</p>
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection title="Emergency Contact">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.personalInfo.emergencyContact.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: { 
                              ...formData.personalInfo, 
                              emergencyContact: { ...formData.personalInfo.emergencyContact, name: e.target.value }
                            }
                          })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.personalInfo.emergencyContact.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Relationship</label>
                      <p className="text-gray-900">{formData.personalInfo.emergencyContact.relationship}</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.personalInfo.emergencyContact.phone}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: { 
                              ...formData.personalInfo, 
                              emergencyContact: { ...formData.personalInfo.emergencyContact, phone: e.target.value }
                            }
                          })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.personalInfo.emergencyContact.phone}</p>
                      )}
                    </div>
                  </div>
                </ProfileSection>
              </div>
            )}

            {/* Medical Information */}
            {activeTab === 'medical' && (
              <div>
                <ProfileSection title="Basic Medical Information">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Blood Type</label>
                      <div className="flex items-center gap-2">
                        <FaDroplet className="text-red-500" />
                        <span className="text-gray-900 font-semibold">{formData.medicalInfo.bloodType}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Height (cm)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.medicalInfo.height}
                          onChange={(e) => setFormData({
                            ...formData,
                            medicalInfo: { ...formData.medicalInfo, height: e.target.value }
                          })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaRuler className="text-gray-400" />
                          <span className="text-gray-900">{formData.medicalInfo.height} cm</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Weight (kg)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.medicalInfo.weight}
                          onChange={(e) => setFormData({
                            ...formData,
                            medicalInfo: { ...formData.medicalInfo, weight: e.target.value }
                          })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaWeight className="text-gray-400" />
                          <span className="text-gray-900">{formData.medicalInfo.weight} kg</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">BMI</label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-semibold">
                          {(parseInt(formData.medicalInfo.weight) / Math.pow(parseInt(formData.medicalInfo.height)/100, 2)).toFixed(1)}
                        </span>
                        <span className="text-green-600 text-sm">(Normal)</span>
                      </div>
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection title="Allergies">
                  <div className="space-y-4">
                    {formData.medicalInfo.allergies.map((allergy, index) => (
                      <div key={index} className="border border-red-200 bg-red-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <FaAllergies className="text-red-500 text-xl" />
                            <div>
                              <h4 className="font-semibold text-red-800">{allergy.name}</h4>
                              <p className="text-red-600 text-sm">Reaction: {allergy.reaction}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <SeverityBadge severity={allergy.severity} />
                            {isEditing && (
                              <button className="text-red-600 hover:text-red-800">
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <button className="border-2 border-dashed border-red-300 rounded-lg p-4 w-full text-center text-red-600 hover:border-red-400 hover:text-red-700">
                        <FaPlus className="inline mr-2" />
                        Add Allergy
                      </button>
                    )}
                  </div>
                </ProfileSection>

                <ProfileSection title="Chronic Conditions">
                  <div className="space-y-4">
                    {formData.medicalInfo.chronicConditions.map((condition, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{condition.name}</h4>
                            <p className="text-gray-600 text-sm">Diagnosed: {condition.diagnosed}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            condition.status === 'Controlled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {condition.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full text-center text-gray-600 hover:border-primary-blue hover:text-primary-blue">
                        <FaPlus className="inline mr-2" />
                        Add Condition
                      </button>
                    )}
                  </div>
                </ProfileSection>

                <ProfileSection title="Current Medications">
                  <div className="space-y-4">
                    {formData.medicalInfo.currentMedications.map((medication, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaPills className="text-purple-500" />
                            <div>
                              <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                              <p className="text-gray-600 text-sm">Dosage: {medication.dosage}</p>
                              <p className="text-gray-500 text-xs">Prescribed by: {medication.prescribedBy}</p>
                            </div>
                          </div>
                          {isEditing && (
                            <button className="text-gray-400 hover:text-red-600">
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full text-center text-gray-600 hover:border-primary-blue hover:text-primary-blue">
                        <FaPlus className="inline mr-2" />
                        Add Medication
                      </button>
                    )}
                  </div>
                </ProfileSection>

                <ProfileSection title="Family Medical History">
                  <div className="space-y-4">
                    {formData.medicalInfo.familyHistory.map((history, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{history.condition}</h4>
                            <p className="text-gray-600 text-sm">{history.relation} - Age at diagnosis: {history.age}</p>
                          </div>
                          {isEditing && (
                            <button className="text-gray-400 hover:text-red-600">
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full text-center text-gray-600 hover:border-primary-blue hover:text-primary-blue">
                        <FaPlus className="inline mr-2" />
                        Add Family History
                      </button>
                    )}
                  </div>
                </ProfileSection>
              </div>
            )}

            {/* Insurance Information */}
            {activeTab === 'insurance' && (
              <div>
                <ProfileSection title="Insurance Coverage">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Insurance Provider</label>
                      <p className="text-gray-900 font-semibold">{formData.insuranceInfo.provider}</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Policy Number</label>
                      <div className="flex items-center gap-2">
                        <FaShieldAlt className="text-blue-500" />
                        <span className="text-gray-900">{formData.insuranceInfo.policyNumber}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Group Number</label>
                      <p className="text-gray-900">{formData.insuranceInfo.groupNumber}</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Expiry Date</label>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-orange-500" />
                        <span className="text-gray-900">{new Date(formData.insuranceInfo.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Copay</label>
                      <p className="text-gray-900">{formData.insuranceInfo.copay}</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Annual Deductible</label>
                      <p className="text-gray-900">{formData.insuranceInfo.deductible}</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500" />
                      <div>
                        <h4 className="font-semibold text-green-800">Insurance Verified</h4>
                        <p className="text-green-700 text-sm">Your insurance coverage is active and verified</p>
                      </div>
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection title="Coverage Details">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">General Consultations</span>
                      <span className="text-green-800 font-semibold">✓ Covered</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Specialist Consultations</span>
                      <span className="text-green-800 font-semibold">✓ Covered</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Prescription Medications</span>
                      <span className="text-green-800 font-semibold">✓ 80% Covered</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Lab Tests</span>
                      <span className="text-green-800 font-semibold">✓ Covered</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-gray-700">Emergency Services</span>
                      <span className="text-yellow-800 font-semibold">⚠ Partial Coverage</span>
                    </div>
                  </div>
                </ProfileSection>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div>
                <ProfileSection title="Communication Preferences">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Preferred Language</label>
                      {isEditing ? (
                        <select
                          value={formData.preferences.preferredLanguage}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, preferredLanguage: e.target.value }
                          })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                        >
                          <option value="English">English</option>
                          <option value="French">French</option>
                          <option value="Creole">Creole</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{formData.preferences.preferredLanguage}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Communication Method</label>
                      {isEditing ? (
                        <select
                          value={formData.preferences.communicationMethod}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, communicationMethod: e.target.value }
                          })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                        >
                          <option value="Email">Email</option>
                          <option value="SMS">SMS</option>
                          <option value="Phone">Phone</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{formData.preferences.communicationMethod}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Doctor Gender Preference</label>
                      <p className="text-gray-900">{formData.preferences.doctorGender}</p>
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection title="Notification Settings">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Appointment Reminders</h4>
                        <p className="text-gray-600 text-sm">Get reminded about upcoming appointments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.preferences.appointmentReminders}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, appointmentReminders: e.target.checked }
                          })}
                          className="sr-only peer" 
                          disabled={!isEditing}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Health Tips</h4>
                        <p className="text-gray-600 text-sm">Receive personalized health tips and advice</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.preferences.healthTips}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, healthTips: e.target.checked }
                          })}
                          className="sr-only peer" 
                          disabled={!isEditing}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                        <p className="text-gray-600 text-sm">Receive promotional offers and health service updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.preferences.marketingEmails}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, marketingEmails: e.target.checked }
                          })}
                          className="sr-only peer" 
                          disabled={!isEditing}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </ProfileSection>

                <ProfileSection title="Privacy & Security">
                  <div className="space-y-4">
                    <Link href="/privacy-settings" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FaShieldAlt className="text-blue-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                          <p className="text-gray-600 text-sm">Manage who can see your health information</p>
                        </div>
                      </div>
                      <FaArrowLeft className="transform rotate-180 text-gray-400" />
                    </Link>
                    
                    <Link href="/security-settings" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FaShieldAlt className="text-green-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">Security Settings</h4>
                          <p className="text-gray-600 text-sm">Update password and enable two-factor authentication</p>
                        </div>
                      </div>
                      <FaArrowLeft className="transform rotate-180 text-gray-400" />
                    </Link>
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

export default PatientProfile