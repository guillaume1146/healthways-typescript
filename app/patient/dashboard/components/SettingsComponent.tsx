import React, { useState } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaCog, 
  FaBell, 
  FaShieldAlt, 
  FaCreditCard, 
  FaUser, 
  FaLock, 
  FaMobile, 
  FaEnvelope, 
  FaSms, 
  FaToggleOn, 
  FaToggleOff,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaIdCard,
  FaHeart,
  FaFileAlt,
  FaCalendarAlt,
  FaCrown,
  FaBuilding,
  FaQuestionCircle,
  FaHistory,
  FaGlobe,
  FaLanguage,
  FaPalette,
  FaBirthdayCake,
  FaPhone,
  FaMapMarkerAlt,
  FaTint,
  FaWeight,
  FaRuler,
  FaThermometerHalf,
  FaNutritionix,
  FaUpload,
  FaDownload,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa'

interface Props {
  patientData: Patient
  setPatientData: React.Dispatch<React.SetStateAction<Patient | null>>
}

type ActiveTab = 'profile' | 'notifications' | 'security' | 'billing' | 'subscription' | 'health' | 'documents' | 'preferences'

interface EditableField {
  field: string
  value: string
  editing: boolean
}

const SettingsComponent: React.FC<Props> = ({ patientData, setPatientData }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile')
  const [editingFields, setEditingFields] = useState<{ [key: string]: EditableField }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleNotificationToggle = (key: keyof typeof patientData.notificationPreferences) => {
    setPatientData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          [key]: !prev.notificationPreferences[key]
        }
      }
    })
  }

  const handleSecurityToggle = (key: keyof typeof patientData.securitySettings) => {
    setPatientData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        securitySettings: {
          ...prev.securitySettings,
          [key]: !prev.securitySettings[key]
        }
      }
    })
  }

  const startEditing = (field: string, value: string) => {
    setEditingFields(prev => ({
      ...prev,
      [field]: { field, value, editing: true }
    }))
  }

  const saveField = (field: string) => {
    const editField = editingFields[field]
    if (editField) {
      // In a real app, this would save to the backend
      setEditingFields(prev => ({
        ...prev,
        [field]: { ...editField, editing: false }
      }))
    }
  }

  const cancelEdit = (field: string) => {
    setEditingFields(prev => {
      const newFields = { ...prev }
      delete newFields[field]
      return newFields
    })
  }

  const changePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }
    // In a real app, this would update the password
    setIsChangingPassword(false)
    setNewPassword('')
    setConfirmPassword('')
    alert('Password changed successfully')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'health', label: 'Health Info', icon: FaHeart, color: 'text-red-600', bgColor: 'bg-red-50' },
    { id: 'notifications', label: 'Notifications', icon: FaBell, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'security', label: 'Security', icon: FaShieldAlt, color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'billing', label: 'Billing', icon: FaCreditCard, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'subscription', label: 'Subscription', icon: FaCrown, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { id: 'documents', label: 'Documents', icon: FaFileAlt, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'preferences', label: 'Preferences', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50' }
  ]

  const renderEditableField = (field: string, label: string, value: string, type: string = 'text') => {
    const isEditing = editingFields[field]?.editing
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <input
                type={type}
                value={editingFields[field]?.value || value}
                onChange={(e) => setEditingFields(prev => ({
                  ...prev,
                  [field]: { ...prev[field], value: e.target.value }
                }))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={() => saveField(field)}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
              >
                <FaSave />
              </button>
              <button
                onClick={() => cancelEdit(field)}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              <input
                type={type}
                value={value}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
              <button
                onClick={() => startEditing(field, value)}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                <FaEdit />
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const renderProfileSettings = () => (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaUser className="mr-2 text-blue-500" />
          Basic Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {renderEditableField('firstName', 'First Name', patientData.firstName)}
          {renderEditableField('lastName', 'Last Name', patientData.lastName)}
          {renderEditableField('email', 'Email Address', patientData.email, 'email')}
          {renderEditableField('phone', 'Phone Number', patientData.phone, 'tel')}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={patientData.dateOfBirth}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
              <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <FaBirthdayCake className="inline mr-1" />
                Age: {patientData.age}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <input
              type="text"
              value={patientData.gender}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
        </div>

        <div className="mt-6">
          {renderEditableField('address', 'Address', patientData.address)}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Profile Completeness</p>
              <p className="text-xs text-blue-600">Complete your profile to access all features</p>
            </div>
            <div className="text-2xl font-bold text-blue-600">{patientData.profileCompleteness}%</div>
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${patientData.profileCompleteness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ID Documents */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaIdCard className="mr-2 text-green-500" />
          Identification Documents
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {renderEditableField('nationalId', 'National ID', patientData.nationalId)}
          {patientData.passportNumber && renderEditableField('passportNumber', 'Passport Number', patientData.passportNumber)}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaPhone className="mr-2 text-red-500" />
          Emergency Contact
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
              <input 
              onChange={(e) =>
                setPatientData(prev => {
                  if (!prev) return prev
                  return {
                    ...prev,
                    emergencyContact: {
                      ...prev.emergencyContact,
                      name: e.target.value
                    }
                  }
                })
              }
              type="text"
              value={patientData.emergencyContact.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Relationship</label>
            <input
              onChange={(e) =>
                setPatientData(prev => {
                  if (!prev) return prev
                  return {
                    ...prev,
                    emergencyContact: {
                      ...prev.emergencyContact,
                      relationship: e.target.value
                    }
                  }
                })
              }
              type="text"
              value={patientData.emergencyContact.relationship}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              onChange={(e) =>
                setPatientData(prev => {
                  if (!prev) return prev
                  return {
                    ...prev,
                    emergencyContact: {
                      ...prev.emergencyContact,
                      phone: e.target.value
                    }
                  }
                })
              }
              type="tel"
              value={patientData.emergencyContact.phone}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              onChange={(e) =>
                setPatientData(prev => {
                  if (!prev) return prev
                  return {
                    ...prev,
                    emergencyContact: {
                      ...prev.emergencyContact,
                      address: e.target.value
                    }
                  }
                })
              }
              type="text"
              value={patientData.emergencyContact.address}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderHealthSettings = () => (
    <div className="space-y-8">
      {/* Medical Information */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaHeart className="mr-2 text-red-500" />
          Medical Information
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-bold text-center flex-1">
                <FaTint className="inline mr-2" />
                {patientData.bloodType}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Health Score</label>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-bold text-center flex-1">
                <FaHeart className="inline mr-2" />
                {patientData.healthScore}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Body Age</label>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-center flex-1">
                <FaBirthdayCake className="inline mr-2" />
                {patientData.bodyAge} years
              </div>
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Allergies</label>
          <div className="flex flex-wrap gap-2">
            {patientData.allergies.map((allergy, index) => (
              <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2">
                <FaExclamationTriangle />
                {allergy}
                <button className="text-red-600 hover:text-red-800">
                  <FaTimes className="text-xs" />
                </button>
              </span>
            ))}
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition">
              <FaPlus className="inline mr-1" />
              Add Allergy
            </button>
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Chronic Conditions</label>
          <div className="flex flex-wrap gap-2">
            {patientData.chronicConditions.map((condition, index) => (
              <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center gap-2">
                <FaHeart />
                {condition}
                <button className="text-yellow-600 hover:text-yellow-800">
                  <FaTimes className="text-xs" />
                </button>
              </span>
            ))}
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition">
              <FaPlus className="inline mr-1" />
              Add Condition
            </button>
          </div>
        </div>
      </div>

      {/* Latest Vital Signs */}
      {patientData.vitalSigns && patientData.vitalSigns.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaThermometerHalf className="mr-2 text-orange-500" />
            Latest Vital Signs
          </h3>
          
          {(() => {
            const latestVitals = patientData.vitalSigns[0]
            return (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Recorded on {new Date(latestVitals.date).toLocaleDateString()} at {latestVitals.time}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <FaHeart className="text-red-500 text-xl mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Blood Pressure</p>
                    <p className="text-lg font-bold text-red-600">
                      {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <FaWeight className="text-blue-500 text-xl mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Weight</p>
                    <p className="text-lg font-bold text-blue-600">{latestVitals.weight} kg</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <FaRuler className="text-green-500 text-xl mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Height</p>
                    <p className="text-lg font-bold text-green-600">{latestVitals.height} cm</p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <FaThermometerHalf className="text-orange-500 text-xl mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Temperature</p>
                    <p className="text-lg font-bold text-orange-600">{latestVitals.temperature}°C</p>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Health Metrics */}
      {patientData.healthMetrics && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaNutritionix className="mr-2 text-purple-500" />
            Health Metrics & Analytics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cholesterol */}
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="font-medium text-purple-800 mb-3">Cholesterol Profile</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold">{patientData.healthMetrics.cholesterol.total} mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span>LDL:</span>
                  <span className="font-semibold">{patientData.healthMetrics.cholesterol.ldl} mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span>HDL:</span>
                  <span className="font-semibold">{patientData.healthMetrics.cholesterol.hdl} mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span>Triglycerides:</span>
                  <span className="font-semibold">{patientData.healthMetrics.cholesterol.triglycerides} mg/dL</span>
                </div>
              </div>
            </div>

            {/* BMI */}
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-medium text-green-800 mb-3">Body Composition</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>BMI:</span>
                  <span className="font-semibold">{patientData.healthMetrics.bmi.value}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold">{patientData.healthMetrics.bmi.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Muscle Mass:</span>
                  <span className="font-semibold">{patientData.healthMetrics.muscleMass} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Visceral Fat:</span>
                  <span className="font-semibold">{patientData.healthMetrics.visceralFat}</span>
                </div>
              </div>
            </div>

            {/* Sleep & Wellness */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-800 mb-3">Sleep & Wellness</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Avg Sleep:</span>
                  <span className="font-semibold">{patientData.healthMetrics.sleepQuality.averageHours} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span className="font-semibold capitalize">{patientData.healthMetrics.sleepQuality.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stress Level:</span>
                  <span className="font-semibold capitalize">{patientData.healthMetrics.stressLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span>HRV:</span>
                  <span className="font-semibold">{patientData.healthMetrics.heartRateVariability} ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaBell className="mr-2 text-yellow-500" />
          Notification Preferences
        </h3>
        
        <div className="space-y-6">
          {Object.entries({
            appointments: { label: 'Appointment Reminders', desc: 'Get notified about upcoming appointments', icon: FaCalendarAlt, color: 'text-blue-500' },
            medications: { label: 'Medication Reminders', desc: 'Reminders to take your medications', icon: FaCog, color: 'text-green-500' },
            testResults: { label: 'Lab Test Results', desc: 'Notifications when lab results are ready', icon: FaFileAlt, color: 'text-purple-500' },
            healthTips: { label: 'Health Tips & Articles', desc: 'Personalized health tips and articles', icon: FaHeart, color: 'text-red-500' },
            emergencyAlerts: { label: 'Emergency Alerts', desc: 'Important emergency notifications', icon: FaExclamationTriangle, color: 'text-red-600' },
            chatMessages: { label: 'Chat Messages', desc: 'New messages from healthcare providers', icon: FaEnvelope, color: 'text-indigo-500' },
            videoCallReminders: { label: 'Video Call Reminders', desc: 'Reminders for video consultations', icon: FaMobile, color: 'text-green-600' },
            dietReminders: { label: 'Diet & Nutrition Reminders', desc: 'Meal and hydration reminders', icon: FaNutritionix, color: 'text-orange-500' },
            exerciseReminders: { label: 'Exercise Reminders', desc: 'Exercise and activity reminders', icon: FaHeart, color: 'text-pink-500' }
          }).map(([key, config]) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition">
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-gray-50 rounded-lg ${config.color}`}>
                  <config.icon className="text-xl" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{config.label}</p>
                  <p className="text-sm text-gray-600">{config.desc}</p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle(key as keyof typeof patientData.notificationPreferences)}
                className="text-3xl transition-all"
              >
                {patientData.notificationPreferences[key as keyof typeof patientData.notificationPreferences] ? (
                  <FaToggleOn className="text-green-500" />
                ) : (
                  <FaToggleOff className="text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Notification Timing */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-4">Notification Timing</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
              <input
              onChange={(e) =>
                setPatientData((prev) => {
                  if (!prev) return null
                  return {
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      notificationTime: e.target.value
                    }
                  }
                })
              }
                type="time"
                value={patientData.notificationPreferences.notificationTime}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-4">Notification Channels</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { key: 'emailNotifications', label: 'Email', icon: FaEnvelope, color: 'text-blue-500' },
              { key: 'smsNotifications', label: 'SMS', icon: FaSms, color: 'text-green-500' },
              { key: 'pushNotifications', label: 'Push Notifications', icon: FaMobile, color: 'text-purple-500' }
            ].map(channel => (
              <div key={channel.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <channel.icon className={`${channel.color} text-xl`} />
                  <span className="font-medium">{channel.label}</span>
                </div>
                <button
                  onClick={() => handleNotificationToggle(channel.key as keyof typeof patientData.notificationPreferences)}
                  className="text-2xl"
                >
                  {patientData.notificationPreferences[channel.key as keyof typeof patientData.notificationPreferences] ? (
                    <FaToggleOn className="text-green-500" />
                  ) : (
                    <FaToggleOff className="text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Security Features */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaShieldAlt className="mr-2 text-green-500" />
          Security Features
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center gap-3">
              {patientData.securitySettings.twoFactorEnabled ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                  <FaCheck className="text-xs" />
                  Enabled
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Disabled
                </span>
              )}
              <button
                onClick={() => handleSecurityToggle('twoFactorEnabled')}
                className="text-2xl"
              >
                {patientData.securitySettings.twoFactorEnabled ? (
                  <FaToggleOn className="text-green-500" />
                ) : (
                  <FaToggleOff className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Biometric Authentication</h4>
              <p className="text-sm text-gray-600">Use fingerprint or face recognition to access your account</p>
            </div>
            <div className="flex items-center gap-3">
              {patientData.securitySettings.biometricEnabled ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                  <FaCheck className="text-xs" />
                  Enabled
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Disabled
                </span>
              )}
              <button
                onClick={() => handleSecurityToggle('biometricEnabled')}
                className="text-2xl"
              >
                {patientData.securitySettings.biometricEnabled ? (
                  <FaToggleOn className="text-green-500" />
                ) : (
                  <FaToggleOff className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Management */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaLock className="mr-2 text-red-500" />
          Password Management
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">
              Last changed: <span className="font-medium">{patientData.securitySettings.lastPasswordChange}</span>
            </p>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Change Password
            </button>
          </div>

          {isChangingPassword && (
            <div className="p-4 border border-blue-200 rounded-xl bg-blue-50">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={changePassword}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false)
                      setNewPassword('')
                      setConfirmPassword('')
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login History */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaHistory className="mr-2 text-purple-500" />
          Recent Login Activity
        </h3>
        
        <div className="space-y-3">
          {patientData.securitySettings.loginHistory.slice(0, 5).map((login, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaMobile className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{login.device}</p>
                  <p className="text-sm text-gray-600">{login.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{login.date}</p>
                <p className="text-xs text-gray-500">{login.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Questions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaQuestionCircle className="mr-2 text-orange-500" />
          Security Questions
        </h3>
        
        <div className="space-y-4">
          {patientData.securitySettings.securityQuestions.map((sq, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-xl">
              <p className="font-medium text-gray-900 mb-2">{sq.question}</p>
              <p className="text-sm text-gray-600">Answer: {sq.answer}</p>
            </div>
          ))}
          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-orange-400 hover:text-orange-600 transition">
            <FaPlus className="inline mr-2" />
            Add Security Question
          </button>
        </div>
      </div>
    </div>
  )

  const renderBillingSettings = () => (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaCreditCard className="mr-2 text-purple-500" />
          Payment Methods
        </h3>
        
        <div className="space-y-4">
          {patientData.billingInformation.map((billing) => (
            <div key={billing.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    billing.type === 'credit_card' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    <FaCreditCard className="text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {billing.type === 'credit_card' ? 'Credit Card' : 'MCB Juice'}
                    </p>
                    <p className="text-sm text-gray-600">{billing.cardNumber}</p>
                    <p className="text-xs text-gray-500">
                      Expires: {billing.expiryDate} • Added: {new Date(billing.addedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {billing.isDefault && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      <FaCheck className="inline mr-1" />
                      Default
                    </span>
                  )}
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <FaEdit />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-400 hover:text-purple-600 transition">
            <FaPlus className="inline mr-2" />
            Add Payment Method
          </button>
        </div>
      </div>

      {/* Medicine Orders */}
      {patientData.medicineOrders && patientData.medicineOrders.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaFileAlt className="mr-2 text-green-500" />
            Recent Medicine Orders
          </h3>
          
          <div className="space-y-4">
            {patientData.medicineOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                    <p className="text-sm text-gray-600">
                      Ordered: {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {order.medicines.map((medicine, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2">
                      <span>{medicine.name} x {medicine.quantity}</span>
                      <span className="font-medium">Rs {medicine.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <p className="font-semibold text-gray-900">Total: Rs {order.totalAmount}</p>
                  {order.deliveryDate && (
                    <p className="text-sm text-green-600">
                      Delivered: {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderSubscriptionSettings = () => (
    <div className="space-y-6">
      {/* Current Subscription */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <FaCrown className="mr-2" />
              {patientData.subscriptionPlan.planName}
            </h3>
            <p className="opacity-90 capitalize">{patientData.subscriptionPlan.type} Plan</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">Rs {patientData.subscriptionPlan.price}</p>
            <p className="opacity-80">/{patientData.subscriptionPlan.billingCycle}</p>
          </div>
        </div>
        
        <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-80">Start Date</p>
            <p className="font-semibold">{patientData.subscriptionPlan.startDate}</p>
          </div>
          {patientData.subscriptionPlan.endDate && (
            <div>
              <p className="opacity-80">End Date</p>
              <p className="font-semibold">{patientData.subscriptionPlan.endDate}</p>
            </div>
          )}
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Plan Features</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {patientData.subscriptionPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <FaCheck className="text-green-600 flex-shrink-0" />
              <span className="text-green-800">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Information */}
      {patientData.subscriptionPlan.type === 'corporate' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaBuilding className="mr-2 text-blue-500" />
            Corporate Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={patientData.subscriptionPlan.corporateName || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Corporate Discount</label>
              <input
                type="text"
                value={`${patientData.subscriptionPlan.corporateDiscount || 0}%`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {/* Insurance Integration */}
      {patientData.insuranceCoverage && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaShieldAlt className="mr-2 text-green-500" />
            Insurance Coverage
          </h3>
          
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-800">{patientData.insuranceCoverage.provider}</h4>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">Active</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-green-700">Policy Number</p>
                <p className="font-semibold text-green-900">{patientData.insuranceCoverage.policyNumber}</p>
              </div>
              <div>
                <p className="text-green-700">Coverage Type</p>
                <p className="font-semibold text-green-900 capitalize">{patientData.insuranceCoverage.coverageType}</p>
              </div>
              <div>
                <p className="text-green-700">Copay</p>
                <p className="font-semibold text-green-900">Rs {patientData.insuranceCoverage.copay}</p>
              </div>
              <div>
                <p className="text-green-700">Deductible</p>
                <p className="font-semibold text-green-900">Rs {patientData.insuranceCoverage.deductible}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderDocumentsSettings = () => (
    <div className="space-y-6">
      {/* Document Upload */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaUpload className="mr-2 text-blue-500" />
          Upload Documents
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { type: 'medical_report', label: 'Medical Reports', color: 'bg-red-50 text-red-600', icon: FaHeart },
            { type: 'prescription', label: 'Prescriptions', color: 'bg-green-50 text-green-600', icon: FaCog },
            { type: 'lab_result', label: 'Lab Results', color: 'bg-blue-50 text-blue-600', icon: FaFileAlt },
            { type: 'insurance', label: 'Insurance Documents', color: 'bg-purple-50 text-purple-600', icon: FaShieldAlt },
            { type: 'id_proof', label: 'ID Proof', color: 'bg-yellow-50 text-yellow-600', icon: FaIdCard }
          ].map((docType) => (
            <button
              key={docType.type}
              className={`p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition ${docType.color}`}
            >
              <docType.icon className="text-2xl mx-auto mb-2" />
              <p className="font-medium">{docType.label}</p>
              <p className="text-xs opacity-70 mt-1">Click to upload</p>
            </button>
          ))}
        </div>
      </div>

      {/* Existing Documents */}
      {patientData.documents && patientData.documents.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaFileAlt className="mr-2 text-green-500" />
            Your Documents
          </h3>
          
          <div className="space-y-3">
            {patientData.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    doc.type === 'medical_report' ? 'bg-red-100 text-red-600' :
                    doc.type === 'prescription' ? 'bg-green-100 text-green-600' :
                    doc.type === 'lab_result' ? 'bg-blue-100 text-blue-600' :
                    doc.type === 'insurance' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    <FaFileAlt />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {doc.type.replace('_', ' ')} • {doc.size}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                    <FaDownload />
                  </button>
                  <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderPreferencesSettings = () => (
    <div className="space-y-6">
      {/* General Preferences */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaCog className="mr-2 text-gray-500" />
          General Preferences
        </h3>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Time Zone</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="indian/mauritius">Indian/Mauritius</option>
                <option value="utc">UTC</option>
                <option value="asia/kolkata">Asia/Kolkata</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date Format</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                <option value="yyyy-mm-dd">YYYY-MM-DD</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaUser className="mr-2 text-blue-500" />
          Account Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Registration Date:</span>
              <span className="font-medium">{new Date(patientData.registrationDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Login:</span>
              <span className="font-medium">{new Date(patientData.lastLogin).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Status:</span>
              <span className={`font-medium ${patientData.verified ? 'text-green-600' : 'text-red-600'}`}>
                {patientData.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Patient ID:</span>
              <span className="font-medium">{patientData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User Type:</span>
              <span className="font-medium capitalize">{patientData.userType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profile Score:</span>
              <span className="font-medium">{patientData.profileCompleteness}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaExclamationTriangle className="mr-2 text-red-500" />
          Account Actions
        </h3>
        
        <div className="space-y-4">
          <button className="w-full p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition text-left">
            <h4 className="font-medium mb-1">Export Account Data</h4>
            <p className="text-sm text-blue-600">Download all your data in a secure format</p>
          </button>
          
          <button className="w-full p-4 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition text-left">
            <h4 className="font-medium mb-1">Deactivate Account</h4>
            <p className="text-sm text-yellow-600">Temporarily disable your account</p>
          </button>
          
          <button className="w-full p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition text-left">
            <h4 className="font-medium mb-1">Delete Account</h4>
            <p className="text-sm text-red-600">Permanently delete your account and all data</p>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <FaCog className="mr-3" />
              Account Settings
            </h2>
            <p className="opacity-90">Manage your account preferences and security settings</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm opacity-80">Account Status</p>
            <p className="text-lg font-bold text-green-300">
              {patientData.verified ? 'Verified' : 'Pending Verification'}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex-shrink-0 px-6 py-4 text-center font-medium transition-all ${
                  activeTab === tab.id 
                    ? `${tab.color} border-b-2 border-current ${tab.bgColor}` 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="inline mr-2" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && renderProfileSettings()}
          {activeTab === 'health' && renderHealthSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'billing' && renderBillingSettings()}
          {activeTab === 'subscription' && renderSubscriptionSettings()}
          {activeTab === 'documents' && renderDocumentsSettings()}
          {activeTab === 'preferences' && renderPreferencesSettings()}
        </div>
      </div>
    </div>
  )
}

export default SettingsComponent