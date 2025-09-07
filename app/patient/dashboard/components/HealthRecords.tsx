import React, { useState } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaFileAlt, 
  FaDownload, 
  FaHeart, 
  FaThermometerHalf, 
  FaWeight,
  FaRuler,
  FaTint,
  FaLungs,
  FaEye,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaUserNurse,
  FaChartLine,
  FaPills,
  FaFlask,
  FaStethoscope,
  FaNutritionix,
  FaBrain,
  FaBone,
  FaPlus,
  FaEdit,
  FaShare,
  FaPrint,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaMinus
} from 'react-icons/fa'
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md'

interface Props {
  patientData: Patient
}

interface FilterOptions {
  type: 'all' | 'consultation' | 'prescription' | 'lab_result' | 'imaging' | 'vaccination' | 'surgery'
  dateRange: 'all' | 'last_week' | 'last_month' | 'last_3_months' | 'last_year'
  doctor: 'all' | string
}

const HealthRecords: React.FC<Props> = ({ patientData }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    dateRange: 'all',
    doctor: 'all'
  })
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'records' | 'vitals' | 'metrics' | 'timeline'>('records')

  // Get unique doctors from medical records
  const doctors = Array.from(new Set(
    (patientData.medicalRecords || []).map(record => record.doctorResponsible)
  ))

  // Filter records based on search and filters
  const filteredRecords = (patientData.medicalRecords || []).filter(record => {
    const matchesSearch = 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctorResponsible.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.diagnosis && record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.treatment && record.treatment.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = filters.type === 'all' || record.type === filters.type
    const matchesDoctor = filters.doctor === 'all' || record.doctorResponsible === filters.doctor

    // Date range filter
    let matchesDate = true
    if (filters.dateRange !== 'all') {
      const recordDate = new Date(record.date)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 3600 * 24))
      
      switch (filters.dateRange) {
        case 'last_week':
          matchesDate = daysDiff <= 7
          break
        case 'last_month':
          matchesDate = daysDiff <= 30
          break
        case 'last_3_months':
          matchesDate = daysDiff <= 90
          break
        case 'last_year':
          matchesDate = daysDiff <= 365
          break
      }
    }

    return matchesSearch && matchesType && matchesDoctor && matchesDate
  })

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'prescription': return 'bg-green-100 text-green-800 border-green-200'
      case 'lab_result': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'imaging': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'vaccination': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'surgery': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <FaStethoscope />
      case 'prescription': return <FaPills />
      case 'lab_result': return <FaFlask />
      case 'imaging': return <FaEye />
      case 'vaccination': return <FaHeart />
      case 'surgery': return <FaUserMd />
      default: return <FaFileAlt />
    }
  }

  const getVitalTrend = (current: number, previous: number) => {
    if (current > previous) return { icon: MdTrendingUp, color: 'text-red-500' }
    if (current < previous) return { icon: MdTrendingDown, color: 'text-green-500' }
    return { icon: FaMinus, color: 'text-gray-500' }
  }

  const renderRecords = () => (
    <div className="space-y-4">
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
          <FaFileAlt className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Health Records Found</h3>
          <p className="text-gray-500">
            {searchQuery || filters.type !== 'all' || filters.doctor !== 'all' || filters.dateRange !== 'all'
              ? 'No records match your current filters.'
              : 'Your health records will appear here once they are added.'}
          </p>
          {(searchQuery || filters.type !== 'all' || filters.doctor !== 'all' || filters.dateRange !== 'all') && (
            <button 
              onClick={() => {
                setSearchQuery('')
                setFilters({ type: 'all', dateRange: 'all', doctor: 'all' })
              }}
              className="mt-3 text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        filteredRecords.map((record) => (
          <div 
            key={record.id} 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                {/* Record Header */}
                <div className="flex items-start gap-4 mb-4 lg:mb-0 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRecordTypeColor(record.type)}`}>
                    {getRecordTypeIcon(record.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRecordTypeColor(record.type)}`}>
                        {record.type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <FaUserMd className="text-blue-500" />
                        <span>{record.doctorResponsible}</span>
                      </div>
                      {record.nurseResponsible && (
                        <div className="flex items-center gap-1">
                          <FaUserNurse className="text-pink-500" />
                          <span>{record.nurseResponsible}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-purple-500" />
                        <span>{new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-orange-500" />
                        <span>{record.time}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Summary:</p>
                      <p className="text-gray-600 text-sm">{record.summary}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 lg:ml-4">
                  <button 
                    onClick={() => setExpandedRecord(
                      expandedRecord === record.id ? null : record.id
                    )}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2"
                  >
                    <FaEye />
                    {expandedRecord === record.id ? 'Less' : 'Details'}
                  </button>
                  
                  <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition flex items-center gap-2">
                    <FaDownload />
                    Download
                  </button>
                  
                  <button className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition flex items-center gap-2">
                    <FaShare />
                    Share
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRecord === record.id && (
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Medical Details */}
                    <div className="space-y-4">
                      {record.diagnosis && (
                        <div className="bg-blue-50 rounded-xl p-4">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                            <FaStethoscope className="mr-2" />
                            Diagnosis
                          </h4>
                          <p className="text-blue-700 text-sm">{record.diagnosis}</p>
                        </div>
                      )}

                      {record.treatment && (
                        <div className="bg-green-50 rounded-xl p-4">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                            <FaPills className="mr-2" />
                            Treatment
                          </h4>
                          <p className="text-green-700 text-sm">{record.treatment}</p>
                        </div>
                      )}
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4">
                      {record.notes && (
                        <div className="bg-yellow-50 rounded-xl p-4">
                          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                            <FaFileAlt className="mr-2" />
                            Notes
                          </h4>
                          <p className="text-yellow-700 text-sm">{record.notes}</p>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <FaInfoCircle className="mr-2" />
                          Record Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Record ID:</span>
                            <span className="font-medium">{record.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium capitalize">{record.type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date & Time:</span>
                            <span className="font-medium">{new Date(record.date).toLocaleDateString()} at {record.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  {record.attachments && record.attachments.length > 0 && (
                    <div className="bg-indigo-50 rounded-xl p-4">
                      <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                        <FaFileAlt className="mr-2" />
                        Attachments ({record.attachments.length})
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {record.attachments.map((attachment, index) => (
                          <button
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-indigo-100 transition text-left"
                          >
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <FaDownload className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-indigo-900">{attachment}</p>
                              <p className="text-xs text-indigo-600">Click to download</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderVitals = () => {
    if (!patientData.vitalSigns || patientData.vitalSigns.length === 0) {
      return (
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
          <FaThermometerHalf className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Vital Signs Data</h3>
          <p className="text-gray-500">Your vital signs will be recorded during medical visits</p>
        </div>
      )
    }

    const latestVitals = patientData.vitalSigns[0]
    const previousVitals = patientData.vitalSigns[1]

    return (
      <div className="space-y-6">
        {/* Latest Vitals Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaThermometerHalf className="mr-2 text-orange-500" />
              Latest Vital Signs
            </h3>
            <div className="text-right">
              <p className="text-sm text-gray-600">Recorded by {latestVitals.labTechnician}</p>
              <p className="text-xs text-gray-500">{latestVitals.facility}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaHeart className="text-red-500 text-xl mr-2" />
                {previousVitals && (() => {
                  const trend = getVitalTrend(
                    latestVitals.bloodPressure.systolic, 
                    previousVitals.bloodPressure.systolic
                  )
                  return <trend.icon className={`text-sm ${trend.color}`} />
                })()}
              </div>
              <p className="text-xs text-gray-600 mb-1">Blood Pressure</p>
              <p className="text-lg font-bold text-red-600">
                {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}
              </p>
              <p className="text-xs text-gray-500">mmHg</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaWeight className="text-blue-500 text-xl mr-2" />
                {previousVitals && (() => {
                  const trend = getVitalTrend(latestVitals.weight, previousVitals.weight)
                  return <trend.icon className={`text-sm ${trend.color}`} />
                })()}
              </div>
              <p className="text-xs text-gray-600 mb-1">Weight</p>
              <p className="text-lg font-bold text-blue-600">{latestVitals.weight}</p>
              <p className="text-xs text-gray-500">kg</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaRuler className="text-green-500 text-xl mr-2" />
              </div>
              <p className="text-xs text-gray-600 mb-1">Height</p>
              <p className="text-lg font-bold text-green-600">{latestVitals.height}</p>
              <p className="text-xs text-gray-500">cm</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaThermometerHalf className="text-orange-500 text-xl mr-2" />
                {previousVitals && (() => {
                  const trend = getVitalTrend(latestVitals.temperature, previousVitals.temperature)
                  return <trend.icon className={`text-sm ${trend.color}`} />
                })()}
              </div>
              <p className="text-xs text-gray-600 mb-1">Temperature</p>
              <p className="text-lg font-bold text-orange-600">{latestVitals.temperature}</p>
              <p className="text-xs text-gray-500">°C</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaLungs className="text-purple-500 text-xl mr-2" />
                {previousVitals && (() => {
                  const trend = getVitalTrend(latestVitals.oxygenSaturation, previousVitals.oxygenSaturation)
                  return <trend.icon className={`text-sm ${trend.color}`} />
                })()}
              </div>
              <p className="text-xs text-gray-600 mb-1">O2 Saturation</p>
              <p className="text-lg font-bold text-purple-600">{latestVitals.oxygenSaturation}</p>
              <p className="text-xs text-gray-500">%</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaHeart className="text-pink-500 text-xl mr-2" />
                {previousVitals && (() => {
                  const trend = getVitalTrend(latestVitals.heartRate, previousVitals.heartRate)
                  return <trend.icon className={`text-sm ${trend.color}`} />
                })()}
              </div>
              <p className="text-xs text-gray-600 mb-1">Heart Rate</p>
              <p className="text-lg font-bold text-pink-600">{latestVitals.heartRate}</p>
              <p className="text-xs text-gray-500">bpm</p>
            </div>

            {latestVitals.glucose && (
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <FaTint className="text-yellow-500 text-xl mr-2" />
                  {previousVitals?.glucose && (() => {
                    const trend = getVitalTrend(latestVitals.glucose, previousVitals.glucose)
                    return <trend.icon className={`text-sm ${trend.color}`} />
                  })()}
                </div>
                <p className="text-xs text-gray-600 mb-1">Glucose</p>
                <p className="text-lg font-bold text-yellow-600">{latestVitals.glucose}</p>
                <p className="text-xs text-gray-500">mg/dL</p>
              </div>
            )}

            {latestVitals.cholesterol && (
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <FaNutritionix className="text-indigo-500 text-xl mr-2" />
                  {previousVitals?.cholesterol && (() => {
                    const trend = getVitalTrend(latestVitals.cholesterol, previousVitals.cholesterol)
                    return <trend.icon className={`text-sm ${trend.color}`} />
                  })()}
                </div>
                <p className="text-xs text-gray-600 mb-1">Cholesterol</p>
                <p className="text-lg font-bold text-indigo-600">{latestVitals.cholesterol}</p>
                <p className="text-xs text-gray-500">mg/dL</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Recorded on {new Date(latestVitals.date).toLocaleDateString()} at {latestVitals.time}
            </p>
          </div>
        </div>

        {/* Vitals History */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaHistory className="mr-2 text-blue-500" />
            Vitals History
          </h3>
          
          <div className="space-y-4">
            {patientData.vitalSigns.map((vital, index) => (
              <div key={vital.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(vital.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {vital.time} • {vital.labTechnician} • {vital.facility}
                    </p>
                  </div>
                  {index === 0 && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Latest
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">BP</p>
                    <p className="font-medium">{vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">HR</p>
                    <p className="font-medium">{vital.heartRate} bpm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Temp</p>
                    <p className="font-medium">{vital.temperature}°C</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Weight</p>
                    <p className="font-medium">{vital.weight} kg</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">O2 Sat</p>
                    <p className="font-medium">{vital.oxygenSaturation}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Height</p>
                    <p className="font-medium">{vital.height} cm</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderMetrics = () => {
    if (!patientData.healthMetrics) {
      return (
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
          <FaChartLine className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Health Metrics Available</h3>
          <p className="text-gray-500">Health metrics will be available after your first comprehensive checkup</p>
        </div>
      )
    }

    const metrics = patientData.healthMetrics

    return (
      <div className="space-y-6">
        {/* Health Score Overview */}
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Health Score Overview</h3>
              <p className="opacity-90">Based on your latest health assessments</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{patientData.healthScore}%</p>
              <p className="opacity-80">Overall Health</p>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cardiovascular Health */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h4 className="font-semibold text-red-800 mb-4 flex items-center">
              <FaHeart className="mr-2 text-red-500" />
              Cardiovascular Health
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Blood Pressure</span>
                <span className="font-medium text-red-600">
                  {metrics.bloodPressure.systolic}/{metrics.bloodPressure.diastolic} mmHg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Heart Rate Variability</span>
                <span className="font-medium">{metrics.heartRateVariability} ms</span>
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {metrics.bloodPressure.date}
              </div>
            </div>
          </div>

          {/* Cholesterol Profile */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
              <FaNutritionix className="mr-2 text-purple-500" />
              Cholesterol Profile
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-medium">{metrics.cholesterol.total} mg/dL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">LDL</span>
                <span className="font-medium text-red-600">{metrics.cholesterol.ldl} mg/dL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">HDL</span>
                <span className="font-medium text-green-600">{metrics.cholesterol.hdl} mg/dL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Triglycerides</span>
                <span className="font-medium">{metrics.cholesterol.triglycerides} mg/dL</span>
              </div>
            </div>
          </div>

          {/* Body Composition */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
              <FaWeight className="mr-2 text-blue-500" />
              Body Composition
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">BMI</span>
                <span className="font-medium">{metrics.bmi.value}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Category</span>
                <span className="font-medium text-blue-600">{metrics.bmi.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Muscle Mass</span>
                <span className="font-medium">{metrics.muscleMass} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Visceral Fat</span>
                <span className="font-medium">{metrics.visceralFat}</span>
              </div>
            </div>
          </div>

          {/* Wellness Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h4 className="font-semibold text-green-800 mb-4 flex items-center">
              <FaBrain className="mr-2 text-green-500" />
              Wellness & Lifestyle
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sleep Quality</span>
                <span className="font-medium capitalize">{metrics.sleepQuality.quality}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Sleep</span>
                <span className="font-medium">{metrics.sleepQuality.averageHours} hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stress Level</span>
                <span className={`font-medium capitalize ${
                  metrics.stressLevel === 'low' ? 'text-green-600' :
                  metrics.stressLevel === 'moderate' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {metrics.stressLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Age Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h4 className="font-semibold text-orange-800 mb-4 flex items-center">
              <FaClock className="mr-2 text-orange-500" />
              Age Analysis
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Chronological Age</span>
                <span className="font-medium">{patientData.age} years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Body Age</span>
                <span className={`font-medium ${
                  metrics.bodyAge < patientData.age ? 'text-green-600' :
                  metrics.bodyAge > patientData.age ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {metrics.bodyAge} years
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Metabolic Age</span>
                <span className={`font-medium ${
                  metrics.metabolicAge < patientData.age ? 'text-green-600' :
                  metrics.metabolicAge > patientData.age ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {metrics.metabolicAge} years
                </span>
              </div>
            </div>
          </div>

          {/* Bone Health */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <FaBone className="mr-2 text-gray-500" />
              Bone Health
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bone Density</span>
                <span className="font-medium">{metrics.boneDensity} g/cm²</span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(metrics.boneDensity / 4) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Normal range: 2.5 - 4.0 g/cm²</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTimeline = () => {
    // Combine all health events for timeline
    const timelineEvents = [
      ...(patientData.medicalRecords || []).map(record => ({
        id: record.id,
        date: record.date,
        time: record.time,
        type: 'medical_record',
        title: record.title,
        description: record.summary,
        provider: record.doctorResponsible,
        category: record.type
      })),
      ...(patientData.activePrescriptions || []).map(rx => ({
        id: rx.id,
        date: rx.date,
        time: rx.time,
        type: 'prescription',
        title: `Prescription from ${rx.doctorName}`,
        description: rx.diagnosis,
        provider: rx.doctorName,
        category: 'prescription'
      })),
      ...(patientData.vitalSigns || []).map(vital => ({
        id: vital.id,
        date: vital.date,
        time: vital.time,
        type: 'vitals',
        title: 'Vital Signs Check',
        description: `BP: ${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}, Weight: ${vital.weight}kg`,
        provider: vital.labTechnician,
        category: 'vitals'
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaHistory className="mr-2 text-blue-500" />
            Health Timeline
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                    event.type === 'medical_record' ? 'bg-blue-100' :
                    event.type === 'prescription' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {event.type === 'medical_record' && <FaStethoscope className="text-blue-600 text-sm" />}
                    {event.type === 'prescription' && <FaPills className="text-green-600 text-sm" />}
                    {event.type === 'vitals' && <FaThermometerHalf className="text-purple-600 text-sm" />}
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">{event.time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        <FaUserMd className="inline mr-1" />
                        {event.provider}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(event.category)}`}>
                        {event.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!patientData.medicalRecords && !patientData.vitalSigns && !patientData.healthMetrics) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center border border-gray-100">
        <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <FaFileAlt className="text-blue-500 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Health Records</h3>
        <p className="text-gray-500 mb-6">Your health records will appear here once they are added</p>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
          <FaPlus />
          Request Medical Records
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <FaFileAlt className="mr-3" />
              Health Records & Analytics
            </h2>
            <p className="opacity-90">Comprehensive view of your health journey</p>
          </div>
          <div className="mt-4 md:mt-0 grid grid-cols-2 gap-4 text-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{patientData.medicalRecords?.length || 0}</p>
              <p className="text-xs opacity-80">Medical Records</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{patientData.vitalSigns?.length || 0}</p>
              <p className="text-xs opacity-80">Vital Signs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search records, diagnoses, treatments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
          >
            <FaFilter />
            Filters
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterOptions['type'] })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="consultation">Consultations</option>
              <option value="prescription">Prescriptions</option>
              <option value="lab_result">Lab Results</option>
              <option value="imaging">Imaging</option>
              <option value="vaccination">Vaccinations</option>
              <option value="surgery">Surgery</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as FilterOptions['dateRange'] })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="last_year">Last Year</option>
            </select>

            <select
              value={filters.doctor}
              onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {[
              { id: 'records', label: 'Medical Records', icon: FaFileAlt },
              { id: 'vitals', label: 'Vital Signs', icon: FaThermometerHalf },
              { id: 'metrics', label: 'Health Metrics', icon: FaChartLine },
              { id: 'timeline', label: 'Timeline', icon: FaHistory }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'records' | 'vitals' | 'metrics' | 'timeline')}
                className={`flex-shrink-0 px-6 py-4 text-center font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
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
          {activeTab === 'records' && renderRecords()}
          {activeTab === 'vitals' && renderVitals()}
          {activeTab === 'metrics' && renderMetrics()}
          {activeTab === 'timeline' && renderTimeline()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left">
            <FaDownload className="text-2xl mb-2" />
            <p className="font-medium">Download Records</p>
            <p className="text-sm opacity-80">Export all health data</p>
          </button>
          
          <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left">
            <FaShare className="text-2xl mb-2" />
            <p className="font-medium">Share with Doctor</p>
            <p className="text-sm opacity-80">Send records securely</p>
          </button>
          
          <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left">
            <FaPrint className="text-2xl mb-2" />
            <p className="font-medium">Print Summary</p>
            <p className="text-sm opacity-80">Physical copy for visits</p>
          </button>
          
          <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left">
            <FaPlus className="text-2xl mb-2" />
            <p className="font-medium">Add Record</p>
            <p className="text-sm opacity-80">Upload new documents</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HealthRecords