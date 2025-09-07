import React, { useState } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaAmbulance, 
  FaPhone, 
  FaClock, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaHospital, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaUserMd,
  FaFirstAid,
  FaTimes,
  FaLocationArrow,
  FaHistory,
  FaComments,
  FaVideo,
  FaUserNurse,
  FaBell,
  FaShieldAlt,
  FaPlus,
  FaEdit,
  FaEye,
  FaDownload,
  FaShare,
  FaPrint,
  FaMobile,
  FaGlobe,
  FaUsers,
  FaRoute,
  FaStopwatch,
  FaClipboardList,
  FaMedkit,
  FaHardHat,
  FaLifeRing
} from 'react-icons/fa'

interface Props {
  patientData: Patient
}

interface EmergencyContact {
  id: string
  name: string
  service: string
  phone: string
  available24h: boolean
  responseTime: string
  specialization: string[]
  location: string
  distance: string
}

const EmergencyServices: React.FC<Props> = ({ patientData }) => {
  const [activeTab, setActiveTab] = useState<'emergency' | 'contacts' | 'history' | 'chat'>('emergency')
  const [showMedicalInfo, setShowMedicalInfo] = useState(false)
  const [isEmergencyCall, setIsEmergencyCall] = useState(false)

  const hasEmergencyContacts = patientData.emergencyServiceContacts && patientData.emergencyServiceContacts.length > 0
  const hasEmergencyChat = patientData.chatHistory?.emergencyServices && patientData.chatHistory.emergencyServices.length > 0

  // Mock emergency services data
  const emergencyServices: EmergencyContact[] = [
    {
      id: 'EMRG001',
      name: 'National Emergency Response',
      service: 'General Emergency',
      phone: '999',
      available24h: true,
      responseTime: '8-12 min',
      specialization: ['Medical Emergency', 'Accident', 'Fire', 'Crime'],
      location: 'Central Station',
      distance: '2.5 km'
    },
    {
      id: 'EMRG002',
      name: 'MediCare Ambulance Service',
      service: 'Medical Emergency',
      phone: '+230 212-3456',
      available24h: true,
      responseTime: '10-15 min',
      specialization: ['Medical Emergency', 'Cardiac Care', 'Trauma'],
      location: 'Apollo Bramwell Hospital',
      distance: '3.2 km'
    },
    {
      id: 'EMRG003',
      name: 'Private Medical Response',
      service: 'Premium Emergency',
      phone: '+230 567-8900',
      available24h: true,
      responseTime: '5-8 min',
      specialization: ['Medical Emergency', 'Critical Care', 'Air Ambulance'],
      location: 'Fortis Clinic',
      distance: '1.8 km'
    },
    {
      id: 'EMRG004',
      name: 'Mental Health Crisis Line',
      service: 'Mental Health Support',
      phone: '+230 800-HELP',
      available24h: true,
      responseTime: 'Immediate',
      specialization: ['Mental Health', 'Crisis Intervention', 'Counseling'],
      location: 'Multiple Locations',
      distance: 'Remote'
    }
  ]

  const initiateEmergencyCall = (service: EmergencyContact) => {
    setIsEmergencyCall(true)
    // In a real app, this would initiate the call
    setTimeout(() => {
      setIsEmergencyCall(false)
      alert(`Emergency call initiated to ${service.name}`)
    }, 3000)
  }

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          alert(`Location shared: ${latitude}, ${longitude}`)
        },
        (error) => {
          alert('Unable to get location. Please check your permissions.')
        }
      )
    }
  }

  const renderEmergencyPanel = () => (
    <div className="space-y-6">
      {/* Emergency Alert Banner */}
      <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
              <FaBell className="text-3xl" />
            </div>
              <h3 className="text-2xl font-bold mb-1">Emergency Services</h3>
              <p className="text-red-100">For immediate medical attention</p>
            </div>
          </div>
          <button 
            onClick={() => initiateEmergencyCall(emergencyServices[0])}
            disabled={isEmergencyCall}
            className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 transition-all transform hover:scale-105 disabled:opacity-50 flex items-center gap-2"
          >
            <FaPhone className={isEmergencyCall ? 'animate-bounce' : ''} />
            {isEmergencyCall ? 'Calling...' : 'Emergency: 999'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={shareLocation}
          className="bg-white border-2 border-blue-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all group"
        >
          <FaLocationArrow className="text-2xl text-blue-500 mx-auto mb-2 group-hover:animate-bounce" />
          <p className="font-medium text-blue-700">Share Location</p>
          <p className="text-xs text-blue-600">GPS coordinates</p>
        </button>

        <button 
          onClick={() => setShowMedicalInfo(!showMedicalInfo)}
          className="bg-white border-2 border-green-200 rounded-xl p-4 text-center hover:border-green-400 hover:bg-green-50 transition-all group"
        >
          <FaMedkit className="text-2xl text-green-500 mx-auto mb-2 group-hover:animate-bounce" />
          <p className="font-medium text-green-700">Medical Info</p>
          <p className="text-xs text-green-600">Emergency details</p>
        </button>

        <button className="bg-white border-2 border-purple-200 rounded-xl p-4 text-center hover:border-purple-400 hover:bg-purple-50 transition-all group">
          <FaVideo className="text-2xl text-purple-500 mx-auto mb-2 group-hover:animate-bounce" />
          <p className="font-medium text-purple-700">Video Call</p>
          <p className="text-xs text-purple-600">Emergency video</p>
        </button>

        <button className="bg-white border-2 border-orange-200 rounded-xl p-4 text-center hover:border-orange-400 hover:bg-orange-50 transition-all group">
          <FaComments className="text-2xl text-orange-500 mx-auto mb-2 group-hover:animate-bounce" />
          <p className="font-medium text-orange-700">Text Support</p>
          <p className="text-xs text-orange-600">Emergency chat</p>
        </button>
      </div>

      {/* Medical Information Panel */}
      {showMedicalInfo && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-800 flex items-center">
              <FaFirstAid className="mr-2" />
              Emergency Medical Information
            </h3>
            <button 
              onClick={() => setShowMedicalInfo(false)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-sm font-medium text-red-700">Blood Type</p>
                <p className="text-lg font-bold text-red-900 flex items-center">
                  <FaHeartbeat className="mr-2" />
                  {patientData.bloodType}
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-sm font-medium text-yellow-700">Allergies</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patientData.allergies.map((allergy, index) => (
                    <span key={index} className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                      ⚠️ {allergy}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-700">Chronic Conditions</p>
                <div className="space-y-1 mt-1">
                  {patientData.chronicConditions.map((condition, index) => (
                    <p key={index} className="text-sm text-blue-800 flex items-center">
                      <FaHeartbeat className="mr-2 text-xs" />
                      {condition}
                    </p>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm font-medium text-green-700">Current Medications</p>
                <div className="space-y-1 mt-1">
                  {patientData.activePrescriptions?.slice(0, 3).map((prescription, index) => (
                    <p key={index} className="text-xs text-green-800">
                      • {prescription.medicines[0]?.name} - {prescription.medicines[0]?.dosage}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <p className="text-sm text-gray-600">Emergency Contact: {patientData.emergencyContact.name}</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition">
                <FaShare className="inline mr-1" />
                Share
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition">
                <FaPrint className="inline mr-1" />
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Services List */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaLifeRing className="mr-2 text-blue-500" />
          Available Emergency Services
        </h3>
        
        <div className="space-y-4">
          {emergencyServices.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    service.service.includes('Mental') ? 'bg-purple-100 text-purple-600' :
                    service.service.includes('Premium') ? 'bg-yellow-100 text-yellow-600' :
                    service.service.includes('Medical') ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {service.service.includes('Mental') ? <FaHardHat /> : <FaAmbulance />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      {service.available24h && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          24/7
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{service.service}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaStopwatch className="text-orange-500" />
                        <span>{service.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaMapMarkerAlt className="text-blue-500" />
                        <span>{service.distance}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaHospital className="text-green-500" />
                        <span>{service.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaPhone className="text-purple-500" />
                        <span>{service.phone}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {service.specialization.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <button 
                    onClick={() => initiateEmergencyCall(service)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 font-medium"
                  >
                    <FaPhone />
                    Call
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
                    <FaComments />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderEmergencyHistory = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <FaAmbulance className="text-red-500 text-2xl mb-2" />
          <p className="text-gray-600 text-sm">Total Incidents</p>
          <p className="text-2xl font-bold text-red-600">
            {hasEmergencyContacts ? patientData.emergencyServiceContacts!.length : 0}
          </p>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <FaCheckCircle className="text-green-500 text-2xl mb-2" />
          <p className="text-gray-600 text-sm">Resolved</p>
          <p className="text-2xl font-bold text-green-600">
            {hasEmergencyContacts ? patientData.emergencyServiceContacts!.filter(e => e.status === 'resolved').length : 0}
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <FaClock className="text-yellow-500 text-2xl mb-2" />
          <p className="text-gray-600 text-sm">Avg Response</p>
          <p className="text-2xl font-bold text-yellow-600">
            {hasEmergencyContacts ? 
              Math.round(patientData.emergencyServiceContacts!.reduce((sum, e) => sum + e.responseTime, 0) / 
              patientData.emergencyServiceContacts!.length) : 0} min
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <FaUsers className="text-blue-500 text-2xl mb-2" />
          <p className="text-gray-600 text-sm">Services Used</p>
          <p className="text-2xl font-bold text-blue-600">
            {hasEmergencyContacts ? 
              new Set(patientData.emergencyServiceContacts!.map(e => e.serviceName)).size : 0}
          </p>
        </div>
      </div>

      {/* Emergency History */}
      {hasEmergencyContacts ? (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaHistory className="mr-2 text-purple-500" />
            Emergency Service History
          </h3>
          
          <div className="space-y-4">
            {patientData.emergencyServiceContacts!.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FaAmbulance className="text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Incident #{contact.id}</h4>
                        <p className="text-sm text-gray-600">{contact.serviceName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaCalendarAlt className="text-blue-500" />
                          <span>{new Date(contact.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="text-green-500" />
                          <span>{contact.time}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaStopwatch className="text-orange-500" />
                          <span>Response: {contact.responseTime} minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaHospital className="text-purple-500" />
                          <span>{contact.serviceName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <h5 className="font-medium text-red-800 mb-2 flex items-center">
                        <FaExclamationTriangle className="mr-2" />
                        Reason for Emergency
                      </h5>
                      <p className="text-red-700 mb-3">{contact.reason}</p>
                      
                      {contact.notes && (
                        <div className="pt-3 border-t border-red-200">
                          <h6 className="font-medium text-red-800 mb-1">Response Notes:</h6>
                          <p className="text-red-700 text-sm">{contact.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
          <FaHistory className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Emergency History</h3>
          <p className="text-gray-500">You have not used emergency services yet. We hope it stays that way!</p>
        </div>
      )}
    </div>
  )

  const renderEmergencyContacts = () => (
    <div className="space-y-6">
      {/* Personal Emergency Contact */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaUserNurse className="mr-2 text-pink-500" />
          Personal Emergency Contact
        </h3>
        
        <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <FaUsers className="text-pink-600 text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-pink-900">{patientData.emergencyContact.name}</h4>
                <p className="text-pink-700 capitalize">{patientData.emergencyContact.relationship}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-pink-600">
                    <FaPhone />
                    <span>{patientData.emergencyContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-pink-600">
                    <FaMapMarkerAlt />
                    <span>{patientData.emergencyContact.address}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition">
                <FaPhone />
              </button>
              <button className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition">
                <FaComments />
              </button>
              <button className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition">
                <FaEdit />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Information for Emergencies */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaMedkit className="mr-2 text-red-500" />
          Critical Medical Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <h4 className="font-medium text-red-800 mb-3 flex items-center">
                <FaHeartbeat className="mr-2" />
                Vital Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-700">Blood Type:</span>
                  <span className="font-semibold text-red-900">{patientData.bloodType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Age:</span>
                  <span className="font-semibold text-red-900">{patientData.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Weight:</span>
                  <span className="font-semibold text-red-900">
                    {patientData.vitalSigns?.[0]?.weight || 'N/A'} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Height:</span>
                  <span className="font-semibold text-red-900">
                    {patientData.vitalSigns?.[0]?.height || 'N/A'} cm
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                Allergies & Warnings
              </h4>
              <div className="space-y-2">
                {patientData.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center gap-2 text-yellow-800 bg-yellow-100 rounded-lg px-3 py-2">
                    <FaExclamationTriangle className="text-yellow-600" />
                    <span className="font-medium">{allergy}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                <FaClipboardList className="mr-2" />
                Chronic Conditions
              </h4>
              <div className="space-y-2">
                {patientData.chronicConditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2 text-blue-800 bg-blue-100 rounded-lg px-3 py-2">
                    <FaHeartbeat className="text-blue-600" />
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h4 className="font-medium text-green-800 mb-3 flex items-center">
                <FaMedkit className="mr-2" />
                Current Medications
              </h4>
              <div className="space-y-2">
                {patientData.activePrescriptions?.slice(0, 3).map((prescription, index) => (
                  <div key={index} className="text-green-800 bg-green-100 rounded-lg px-3 py-2">
                    <p className="font-medium text-sm">{prescription.medicines[0]?.name}</p>
                    <p className="text-xs text-green-600">{prescription.medicines[0]?.dosage} - {prescription.medicines[0]?.frequency}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-center">
          <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition flex items-center gap-2">
            <FaDownload />
            Download Emergency Card
          </button>
        </div>
      </div>

      {/* Additional Emergency Services */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaShieldAlt className="mr-2 text-blue-500" />
          Emergency Service Contacts
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Police Emergency', number: '999', icon: FaShieldAlt, color: 'blue' },
            { name: 'Fire Department', number: '995', icon: FaExclamationTriangle, color: 'orange' },
            { name: 'Medical Emergency', number: '999', icon: FaHeartbeat, color: 'red' },
            { name: 'Poison Control', number: '+230 800-POISON', icon: FaMedkit, color: 'purple' },
            { name: 'Crisis Hotline', number: '+230 800-HELP', icon: FaHardHat, color: 'pink' },
            { name: 'Road Emergency', number: '999', icon: FaRoute, color: 'green' }
          ].map((contact, index) => (
            <div key={index} className={`bg-${contact.color}-50 border border-${contact.color}-200 rounded-xl p-4 hover:shadow-md transition`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${contact.color}-100 rounded-lg flex items-center justify-center`}>
                    <contact.icon className={`text-${contact.color}-600`} />
                  </div>
                  <div>
                    <h4 className={`font-medium text-${contact.color}-900`}>{contact.name}</h4>
                    <p className={`text-sm text-${contact.color}-700`}>{contact.number}</p>
                  </div>
                </div>
                <button className={`p-2 bg-${contact.color}-100 text-${contact.color}-600 rounded-lg hover:bg-${contact.color}-200 transition`}>
                  <FaPhone />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderEmergencyChat = () => (
    <div className="space-y-6">
      {hasEmergencyChat ? (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaComments className="mr-2 text-green-500" />
            Emergency Service Communications
          </h3>
          
          <div className="space-y-4">
            {patientData.chatHistory!.emergencyServices!.map((emergencyChat) => (
              <div key={emergencyChat.serviceId} className="border border-red-200 rounded-xl p-4 bg-red-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FaAmbulance className="text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-red-900">{emergencyChat.serviceName}</h4>
                      <p className="text-sm text-red-700">Emergency Communication</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                      <FaPhone />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                      <FaVideo />
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-gray-900">Last Message:</p>
                  <p className="text-gray-700">{emergencyChat.lastMessage}</p>
                  <p className="text-xs text-gray-500 mt-1">{emergencyChat.lastMessageTime}</p>
                </div>
                
                {emergencyChat.messages && emergencyChat.messages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-800">Recent Messages:</p>
                    {emergencyChat.messages.slice(0, 3).map((msg) => (
                      <div key={msg.id} className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{msg.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-600">{msg.senderName}</span>
                              <span className="text-xs text-gray-500">{msg.timestamp}</span>
                            </div>
                          </div>
                          {msg.senderType === 'emergency' && (
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center ml-2">
                              <FaAmbulance className="text-red-600 text-xs" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
          <FaComments className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Emergency Communications</h3>
          <p className="text-gray-500">No emergency service communications found</p>
        </div>
      )}
    </div>
  )

  if (!hasEmergencyContacts && !hasEmergencyChat && activeTab === 'history') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center border border-gray-100">
        <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <FaAmbulance className="text-green-500 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Emergency Services</h3>
        <p className="text-gray-500 mb-6">No emergency service history - That is good news!</p>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
          <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-3" />
          <h4 className="font-semibold text-red-800 mb-2">In Case of Emergency</h4>
          <p className="text-red-700 mb-4">Call emergency services immediately</p>
          <button 
            onClick={() => initiateEmergencyCall(emergencyServices[0])}
            className="bg-red-500 text-white px-8 py-3 rounded-xl hover:bg-red-600 font-semibold flex items-center gap-2 mx-auto"
          >
            <FaPhone />
            Emergency: 999
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Emergency Services Header */}
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <FaAmbulance className="mr-3" />
              Emergency Services
            </h2>
            <p className="opacity-90">Quick access to emergency help and medical support</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm opacity-80">Emergency Number</p>
            <p className="text-3xl font-bold">999</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {[
              { id: 'emergency', label: 'Emergency', icon: FaAmbulance, color: 'text-red-600' },
              { id: 'contacts', label: 'Contacts', icon: FaUsers, color: 'text-blue-600' },
              { id: 'history', label: 'History', icon: FaHistory, color: 'text-purple-600' },
              { id: 'chat', label: 'Communications', icon: FaComments, color: 'text-green-600' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-shrink-0 px-6 py-4 text-center font-medium transition-all ${
                  activeTab === tab.id 
                    ? `${tab.color} border-b-2 border-current bg-gray-50` 
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
          {activeTab === 'emergency' && renderEmergencyPanel()}
          {activeTab === 'contacts' && renderEmergencyContacts()}
          {activeTab === 'history' && renderEmergencyHistory()}
          {activeTab === 'chat' && renderEmergencyChat()}
        </div>
      </div>
    </div>
  )
}

export default EmergencyServices