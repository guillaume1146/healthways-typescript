// app/doctor/patients/[id]/records/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  FaArrowLeft,
  FaFileAlt,
  FaPrescriptionBottle,
  FaVial,
  FaStethoscope,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaSearch,
  FaFilter,
  FaNotesMedical,
  FaAllergies,
  FaHeartbeat,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPrint,
  FaVideo,
  FaEdit,
  FaTimes
} from 'react-icons/fa'
import { useDoctorStore } from '../../../lib/data-store'

interface MedicalRecord {
  id: string
  date: string
  type: 'consultation' | 'prescription' | 'lab_result' | 'imaging' | 'vaccination'
  title: string
  doctor: string
  summary: string
  details: {
    chiefComplaint?: string
    examination?: string
    diagnosis?: string
    plan?: string
    medications?: string[]
    hba1c?: string
    cholesterol?: string
    ldl?: string
    hdl?: string
    triglycerides?: string
  }
  attachments?: string[]
}

interface VitalSign {
  date: string
  bloodPressure: string
  heartRate: string
  temperature: string
  weight: string
  oxygenSaturation: string
}

// Mock data for demonstration
const mockPatientData = {
  id: 'pat-001',
  name: 'John Smith',
  age: 45,
  gender: 'Male',
  bloodType: 'O+',
  phone: '+230 5123 4567',
  email: 'john.smith@email.com',
  address: 'Port Louis, Mauritius',
  emergencyContact: {
    name: 'Jane Smith',
    relation: 'Wife',
    phone: '+230 5234 5678'
  },
  medicalHistory: [
    'Hypertension (2018)',
    'Type 2 Diabetes (2020)',
    'Appendectomy (2015)'
  ],
  allergies: ['Penicillin', 'Peanuts'],
  currentMedications: [
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
  ],
  insurance: {
    provider: 'Swan Insurance',
    policyNumber: 'POL-123456',
    validUntil: '2024-12-31'
  }
}

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'consultation',
    title: 'Routine Checkup',
    doctor: 'Dr. Sarah Johnson',
    summary: 'Regular follow-up for hypertension and diabetes management. Patient stable.',
    details: {
      chiefComplaint: 'Routine checkup',
      examination: 'Blood pressure controlled, glucose levels within target range',
      diagnosis: 'Hypertension and Type 2 Diabetes - stable',
      plan: 'Continue current medications, lifestyle modifications'
    }
  },
  {
    id: '2',
    date: '2024-01-10',
    type: 'lab_result',
    title: 'Blood Test Results',
    doctor: 'Dr. Sarah Johnson',
    summary: 'Complete blood count and metabolic panel',
    details: {
      hba1c: '6.8%',
      cholesterol: '180 mg/dL',
      ldl: '100 mg/dL',
      hdl: '50 mg/dL',
      triglycerides: '150 mg/dL'
    }
  },
  {
    id: '3',
    date: '2023-12-20',
    type: 'prescription',
    title: 'Medication Prescription',
    doctor: 'Dr. Sarah Johnson',
    summary: 'Monthly medication refill',
    details: {
      medications: [
        'Metformin 500mg - 60 tablets',
        'Lisinopril 10mg - 30 tablets'
      ]
    }
  }
]

const mockVitalSigns: VitalSign[] = [
  {
    date: '2024-01-15',
    bloodPressure: '128/82',
    heartRate: '72 bpm',
    temperature: '36.8°C',
    weight: '75 kg',
    oxygenSaturation: '98%'
  },
  {
    date: '2023-12-20',
    bloodPressure: '132/85',
    heartRate: '76 bpm',
    temperature: '36.6°C',
    weight: '76 kg',
    oxygenSaturation: '97%'
  }
]

export default function PatientRecordsPage() {
  const params = useParams()
  const patientId = params?.id as string
  const { getPatientById, setSelectedPatient } = useDoctorStore()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'vitals' | 'history'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  
  // Get patient data
  const patient = mockPatientData // In real app, use: getPatientById(patientId)
  
  useEffect(() => {
    if (patient) {
      setSelectedPatient({
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        email: patient.email,
        phone: patient.phone,
        avatar: 'JS',
        medicalHistory: patient.medicalHistory.map(h => h.split('(')[0].trim()),
        allergies: patient.allergies,
        lastVisit: '2024-01-15',
        upcomingAppointment: undefined,
        totalVisits: 12,
        prescriptions: 3
      })
    }
  }, [patient, setSelectedPatient])

  const filteredRecords = mockMedicalRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || record.type === filterType
    return matchesSearch && matchesType
  })

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'consultation': return FaStethoscope
      case 'prescription': return FaPrescriptionBottle
      case 'lab_result': return FaVial
      case 'imaging': return FaFileAlt
      case 'vaccination': return FaNotesMedical
      default: return FaFileAlt
    }
  }

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'text-blue-600 bg-blue-100'
      case 'prescription': return 'text-green-600 bg-green-100'
      case 'lab_result': return 'text-purple-600 bg-purple-100'
      case 'imaging': return 'text-orange-600 bg-orange-100'
      case 'vaccination': return 'text-pink-600 bg-pink-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/doctor/dashboard" className="text-gray-600 hover:text-blue-600">
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Patient Records</h1>
                <p className="text-sm text-gray-600">{patient.name} • ID: {patient.id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/doctor/consultations/video/${patientId}`}
                className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
              >
                <FaVideo />
                <span className="hidden md:inline">Start Consultation</span>
              </Link>
              <Link
                href={`/doctor/prescriptions/create/${patientId}`}
                className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
              >
                <FaPrescriptionBottle />
                <span className="hidden md:inline">New Prescription</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Patient Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Basic Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Age:</span> <span className="font-medium">{patient.age} years</span></p>
                <p><span className="text-gray-600">Gender:</span> <span className="font-medium">{patient.gender}</span></p>
                <p><span className="text-gray-600">Blood Type:</span> <span className="font-medium">{patient.bloodType}</span></p>
                <div className="flex items-start gap-1">
                  <FaPhone className="text-gray-400 mt-1 text-xs" />
                  <span className="font-medium">{patient.phone}</span>
                </div>
                <div className="flex items-start gap-1">
                  <FaEnvelope className="text-gray-400 mt-1 text-xs" />
                  <span className="font-medium text-xs">{patient.email}</span>
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaHeartbeat className="text-red-600" />
                Medical Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Chronic Conditions:</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.medicalHistory.slice(0, 2).map((condition, idx) => (
                      <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {condition.split('(')[0].trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Allergies:</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.map((allergy, idx) => (
                      <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaPrescriptionBottle className="text-green-600" />
                Current Medications
              </h3>
              <div className="space-y-2">
                {patient.currentMedications.map((med, idx) => (
                  <div key={idx} className="text-sm bg-green-50 p-2 rounded">
                    <p className="font-medium">{med.name}</p>
                    <p className="text-xs text-gray-600">{med.dosage} • {med.frequency}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="flex flex-wrap border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === 'records'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Medical Records
            </button>
            <button
              onClick={() => setActiveTab('vitals')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === 'vitals'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Vital Signs
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              History
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockMedicalRecords.slice(0, 3).map((record) => {
                      const Icon = getRecordIcon(record.type)
                      return (
                        <div key={record.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-lg ${getRecordColor(record.type)}`}>
                            <Icon className="text-sm" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{record.title}</p>
                            <p className="text-xs text-gray-600">{record.date}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Latest Vital Signs</h3>
                  {mockVitalSigns[0] && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-3">Recorded on {mockVitalSigns[0].date}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600">Blood Pressure</p>
                          <p className="font-semibold">{mockVitalSigns[0].bloodPressure}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Heart Rate</p>
                          <p className="font-semibold">{mockVitalSigns[0].heartRate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Temperature</p>
                          <p className="font-semibold">{mockVitalSigns[0].temperature}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Weight</p>
                          <p className="font-semibold">{mockVitalSigns[0].weight}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medical Records Tab */}
            {activeTab === 'records' && (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="consultation">Consultations</option>
                    <option value="prescription">Prescriptions</option>
                    <option value="lab_result">Lab Results</option>
                    <option value="imaging">Imaging</option>
                    <option value="vaccination">Vaccinations</option>
                  </select>
                </div>

                {/* Records List */}
                <div className="space-y-4">
                  {filteredRecords.map((record) => {
                    const Icon = getRecordIcon(record.type)
                    return (
                      <div key={record.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-3 rounded-lg ${getRecordColor(record.type)}`}>
                              <Icon />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{record.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{record.summary}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>{record.date}</span>
                                <span>•</span>
                                <span>{record.doctor}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <FaEye />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700">
                              <FaDownload />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Vital Signs Tab */}
            {activeTab === 'vitals' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Blood Pressure</th>
                        <th className="px-4 py-3 text-left">Heart Rate</th>
                        <th className="px-4 py-3 text-left">Temperature</th>
                        <th className="px-4 py-3 text-left">Weight</th>
                        <th className="px-4 py-3 text-left">SpO2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockVitalSigns.map((vital, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{vital.date}</td>
                          <td className="px-4 py-3">{vital.bloodPressure}</td>
                          <td className="px-4 py-3">{vital.heartRate}</td>
                          <td className="px-4 py-3">{vital.temperature}</td>
                          <td className="px-4 py-3">{vital.weight}</td>
                          <td className="px-4 py-3">{vital.oxygenSaturation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Medical History</h3>
                  <div className="space-y-2">
                    {patient.medicalHistory.map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Surgical History</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">Appendectomy (2015)</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Family History</h3>
                  <p className="text-sm text-gray-600">No significant family history recorded</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{selectedRecord.title}</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Date: {selectedRecord.date}</p>
                <p className="text-sm text-gray-600">Doctor: {selectedRecord.doctor}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Summary</h4>
                <p className="text-sm text-gray-700">{selectedRecord.summary}</p>
              </div>
              
              {selectedRecord.details && (
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {JSON.stringify(selectedRecord.details, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <FaPrint />
                  Print
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                  <FaDownload />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}