'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaHeart, 
  FaFileAlt, 
  FaDownload,
  FaEye,
  FaShare,
  FaSearch,
  FaUserMd,
  FaFlask,
  FaPills,
  FaImage,
  FaChartLine,
  FaArrowLeft,
  FaCheckCircle,
  FaStethoscope,
  FaHeartbeat,
  FaThermometerHalf,
  FaExclamationTriangle,
  FaTint
} from 'react-icons/fa'

// Mock data for static prototype
const mockHealthRecords = {
  summary: {
    totalRecords: 24,
    lastUpdate: "2024-01-14",
    healthScore: 85,
    riskFactors: 2,
    activeConditions: 2
  },
  vitals: {
    bloodPressure: { value: "120/80", date: "2024-01-14", status: "normal", trend: "stable" },
    heartRate: { value: "72", date: "2024-01-14", status: "normal", trend: "stable" },
    temperature: { value: "36.8°C", date: "2024-01-14", status: "normal", trend: "stable" },
    weight: { value: "75 kg", date: "2024-01-14", status: "normal", trend: "down" },
    bloodSugar: { value: "95 mg/dL", date: "2024-01-14", status: "normal", trend: "stable" }
  },
  records: [
    {
      id: 1,
      type: "consultation",
      title: "Cardiology Consultation",
      doctor: "Dr. Sarah Johnson",
      date: "2024-01-14",
      summary: "Routine cardiac checkup. Blood pressure and heart rate normal. Continue current medications.",
      status: "completed",
      files: ["consultation_notes.pdf", "ecg_report.pdf"]
    },
    {
      id: 2,
      type: "lab",
      title: "Blood Test Results",
      doctor: "Dr. Sarah Johnson",
      date: "2024-01-12",
      summary: "Complete blood count and lipid panel. All values within normal range. HbA1c: 6.1%",
      status: "completed",
      files: ["blood_test_report.pdf"],
      results: {
        cholesterol: { value: "180 mg/dL", range: "< 200", status: "normal" },
        hdl: { value: "55 mg/dL", range: "> 40", status: "normal" },
        ldl: { value: "110 mg/dL", range: "< 130", status: "normal" },
        hba1c: { value: "6.1%", range: "< 7%", status: "good" }
      }
    },
    {
      id: 3,
      type: "prescription",
      title: "Prescription Update",
      doctor: "Dr. Sarah Johnson",
      date: "2024-01-10",
      summary: "Metformin dosage adjusted to 500mg twice daily. New prescription for Lisinopril 10mg.",
      status: "active",
      medications: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" }
      ]
    },
    {
      id: 4,
      type: "imaging",
      title: "Chest X-Ray",
      doctor: "Dr. Michael Chen",
      date: "2024-01-08",
      summary: "Chest X-ray shows clear lungs. No signs of infection or abnormalities.",
      status: "completed",
      files: ["chest_xray.jpg", "radiology_report.pdf"]
    },
    {
      id: 5,
      type: "consultation",
      title: "General Medicine Consultation",
      doctor: "Dr. Michael Chen",
      date: "2024-01-05",
      summary: "Annual health checkup. Physical examination normal. Recommended lifestyle modifications.",
      status: "completed",
      files: ["annual_checkup_report.pdf"]
    },
    {
      id: 6,
      type: "vaccination",
      title: "Influenza Vaccine",
      doctor: "Nurse Jennifer Williams",
      date: "2023-12-20",
      summary: "Annual flu vaccination administered. No adverse reactions observed.",
      status: "completed",
      files: ["vaccination_record.pdf"]
    }
  ],
  trends: {
    bloodPressure: [
      { date: "2023-12-01", systolic: 125, diastolic: 82 },
      { date: "2023-12-15", systolic: 122, diastolic: 80 },
      { date: "2024-01-01", systolic: 120, diastolic: 78 },
      { date: "2024-01-14", systolic: 120, diastolic: 80 }
    ],
    weight: [
      { date: "2023-12-01", value: 77 },
      { date: "2023-12-15", value: 76 },
      { date: "2024-01-01", value: 75.5 },
      { date: "2024-01-14", value: 75 }
    ]
  }
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface LabResult {
  value: string;
  range: string;
  status: string;
}

interface Record {
  id: number;
  type: string;
  title: string;
  doctor: string;
  date: string;
  summary: string;
  status: string;
  files?: string[];
  results?: { [key: string]: LabResult };
  medications?: Medication[];
}

interface Vital {
  value: string;
  date: string;
  status: string;
  trend: string;
}


const PatientHealthRecords = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'consultation': return FaUserMd
      case 'lab': return FaFlask
      case 'prescription': return FaPills
      case 'imaging': return FaImage
      case 'vaccination': return FaStethoscope
      default: return FaFileAlt
    }
  }

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800'
      case 'lab': return 'bg-purple-100 text-purple-800'
      case 'prescription': return 'bg-green-100 text-green-800'
      case 'imaging': return 'bg-orange-100 text-orange-800'
      case 'vaccination': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
    //   case 'up': return <FaTrendUp className="text-red-500" />
      default: return <span className="text-gray-500">—</span>
    }
  }

  const filteredRecords = mockHealthRecords.records.filter(record => {
    const matchesType = filterType === 'all' || record.type === filterType
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.summary.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesType && matchesSearch
  })

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Health Records</h1>
                <p className="text-gray-600">Complete medical history and health data</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                <FaShare className="inline mr-2" />
                Share Records
              </button>
              <button className="btn-gradient px-6 py-2">
                <FaDownload className="inline mr-2" />
                Export All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Health Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Health Score</p>
                <p className="text-2xl font-bold text-green-600">{mockHealthRecords.summary.healthScore}%</p>
                <p className="text-sm text-green-600">Excellent</p>
              </div>
              <FaHeart className="text-green-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Records</p>
                <p className="text-2xl font-bold text-blue-600">{mockHealthRecords.summary.totalRecords}</p>
                <p className="text-sm text-gray-500">Last updated {mockHealthRecords.summary.lastUpdate}</p>
              </div>
              <FaFileAlt className="text-blue-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Conditions</p>
                <p className="text-2xl font-bold text-orange-600">{mockHealthRecords.summary.activeConditions}</p>
                <p className="text-sm text-orange-600">Managed</p>
              </div>
              <FaExclamationTriangle className="text-orange-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Risk Factors</p>
                <p className="text-2xl font-bold text-yellow-600">{mockHealthRecords.summary.riskFactors}</p>
                <p className="text-sm text-yellow-600">Monitor</p>
              </div>
              <FaChartLine className="text-yellow-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Last Checkup</p>
                <p className="text-lg font-bold text-gray-900">6 days ago</p>
                <p className="text-sm text-green-600">Up to date</p>
              </div>
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { key: 'overview', label: 'Overview', icon: FaHeart },
                { key: 'records', label: 'Medical Records', icon: FaFileAlt },
                { key: 'vitals', label: 'Vital Signs', icon: FaHeartbeat },
                { key: 'trends', label: 'Health Trends', icon: FaChartLine }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium ${
                    activeTab === tab.key
                      ? 'text-primary-blue border-b-2 border-primary-blue'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Current Health Status */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Current Health Status</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Excellent Health Score</h4>
                      <p className="text-green-700 text-sm">Your overall health metrics are in excellent range. Continue maintaining your current lifestyle.</p>
                      <div className="mt-3">
                        <div className="bg-green-200 rounded-full h-2">
                          <div className="bg-green-600 rounded-full h-2 w-4/5"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Active Conditions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700 text-sm">Hypertension</span>
                          <span className="text-green-600 text-xs font-medium">Controlled</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700 text-sm">Type 2 Diabetes</span>
                          <span className="text-green-600 text-xs font-medium">Managed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Medical Activity</h3>
                  <div className="space-y-3">
                    {mockHealthRecords.records.slice(0, 3).map((record) => {
                      const Icon = getRecordIcon(record.type)
                      return (
                        <div key={record.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-full ${getRecordColor(record.type)}`}>
                            <Icon className="text-sm" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{record.title}</h4>
                            <p className="text-gray-600 text-sm">{record.doctor} • {record.date}</p>
                          </div>
                          <button 
                            onClick={() => setSelectedRecord(record)}
                            className="text-primary-blue hover:text-blue-700"
                          >
                            <FaEye />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Health Recommendations</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Upcoming Checkups</h4>
                      <p className="text-yellow-700 text-sm">Annual eye exam due in 2 months</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Preventive Care</h4>
                      <p className="text-blue-700 text-sm">Flu vaccination recommended for flu season</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical Records Tab */}
            {activeTab === 'records' && (
              <div>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:border-primary-blue"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  >
                    <option value="all">All Records</option>
                    <option value="consultation">Consultations</option>
                    <option value="lab">Lab Results</option>
                    <option value="prescription">Prescriptions</option>
                    <option value="imaging">Imaging</option>
                    <option value="vaccination">Vaccinations</option>
                  </select>
                </div>

                {/* Records List */}
                <div className="space-y-4">
                  {filteredRecords.map((record) => {
                    const Icon = getRecordIcon(record.type)
                    return (
                      <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-full ${getRecordColor(record.type)}`}>
                              <Icon className="text-lg" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                  {record.status}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-2">{record.doctor} • {record.date}</p>
                              <p className="text-gray-700">{record.summary}</p>
                              
                              {/* Additional Details for Lab Results */}
                              {record.type === 'lab' && record.results && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(record.results).map(([key, result]: [string, LabResult]) => (
                                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-600 uppercase tracking-wide">{key.replace('_', ' ')}</p>
                                        <p className="font-semibold text-gray-900">{result.value}</p>
                                        <p className="text-xs text-gray-500">Range: {result.range}</p>
                                    </div>
                                    ))}
                                </div>
                                )}

                              {/* Medications for Prescriptions */}
                              {record.type === 'prescription' && record.medications && (
  <div className="mt-4 space-y-2">
    {record.medications.map((med: Medication, index: number) => (
      <div key={index} className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
        <FaPills className="text-green-500" />
        <div>
          <p className="font-medium text-gray-900">{med.name} {med.dosage}</p>
          <p className="text-sm text-gray-600">{med.frequency}</p>
        </div>
      </div>
    ))}
  </div>
)}

                              {/* Files */}
                              {record.files && record.files.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {record.files.map((file, index) => (
                                    <button
                                      key={index}
                                      className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition"
                                    >
                                      <FaDownload />
                                      {file}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedRecord(record)}
                              className="p-2 text-gray-600 hover:text-primary-blue"
                            >
                              <FaEye />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-green-600">
                              <FaShare />
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
                <h3 className="text-xl font-bold text-gray-900 mb-6">Latest Vital Signs</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(mockHealthRecords.vitals).map(([key, vital]: [string, Vital]) => (
  <div key={key} className="bg-white border border-gray-200 rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {key === 'bloodPressure' && <FaHeartbeat className="text-red-500 text-xl" />}
        {key === 'heartRate' && <FaHeart className="text-pink-500 text-xl" />}
        {key === 'temperature' && <FaThermometerHalf className="text-orange-500 text-xl" />}
        {/* {key === 'weight' && <FaWeight className="text-blue-500 text-xl" />} */}
        {key === 'bloodSugar' && <FaTint className="text-purple-500 text-xl" />}
        <h4 className="font-semibold text-gray-900 capitalize">
          {key.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
      </div>
      {getTrendIcon(vital.trend)}
    </div>
    <div className="mb-2">
      <p className="text-2xl font-bold text-gray-900">{vital.value}</p>
      <p className="text-sm text-gray-600">Recorded on {vital.date}</p>
    </div>
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
      vital.status === 'normal' ? 'bg-green-100 text-green-800' : 
      vital.status === 'elevated' ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
    }`}>
      {vital.status}
    </span>
  </div>
))}
                </div>
              </div>
            )}

            {/* Health Trends Tab */}
            {activeTab === 'trends' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Health Trends</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Blood Pressure Trend</h4>
                    <div className="space-y-3">
                      {mockHealthRecords.trends.bloodPressure.map((reading, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600">{reading.date}</span>
                          <span className="font-medium">{reading.systolic}/{reading.diastolic}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-green-800 text-sm">✓ Blood pressure trending stable within normal range</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Weight Trend</h4>
                    <div className="space-y-3">
                      {mockHealthRecords.trends.weight.map((reading, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600">{reading.date}</span>
                          <span className="font-medium">{reading.value} kg</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-green-800 text-sm">✓ Healthy weight loss of 2kg over 6 weeks</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{selectedRecord.title}</h2>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <p><strong>Doctor:</strong> {selectedRecord.doctor}</p>
                <p><strong>Date:</strong> {selectedRecord.date}</p>
                <p><strong>Status:</strong> {selectedRecord.status}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-gray-700">{selectedRecord.summary}</p>
              </div>

              {selectedRecord.files && (
                <div>
                  <h3 className="font-semibold mb-2">Attachments</h3>
                  <div className="space-y-2">
                    {selectedRecord.files.map((file: string, index: number) => (
                      <button
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition w-full text-left"
                      >
                        <FaDownload />
                        {file}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setSelectedRecord(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="flex-1 btn-gradient py-2">
                <FaShare className="inline mr-2" />
                Share Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientHealthRecords