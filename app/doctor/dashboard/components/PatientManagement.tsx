'use client'

import React, { useState } from 'react'
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaFileAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaVideo,
  FaComments,
  FaPrescriptionBottle,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTint
} from 'react-icons/fa'

/* ------------ Types ------------ */

type PatientStatus = 'active' | 'inactive'

interface Patient {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: PatientStatus
  bloodType?: string
  chronicConditions?: string[]
  allergies?: string[]
  totalVisits?: number
  lastVisit?: string
  nextAppointment?: string
  gender?: string
  dateOfBirth?: string
  insuranceProvider?: string
  totalPrescriptions?: number
}

interface DoctorStatistics {
  totalPatients?: number
  activePatients?: number
  newPatientsThisMonth?: number
}

interface DoctorPatients {
  current?: Patient[]
  past?: Patient[]
}

interface DoctorData {
  statistics?: DoctorStatistics
  patients?: DoctorPatients
}

interface Props {
  doctorData: DoctorData
}

interface FilterOptions {
  status: 'all' | PatientStatus
  condition: 'all' | string
  lastVisit: 'all' | 'week' | 'month' | 'year'
}

const PatientManagement: React.FC<Props> = ({ doctorData }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'past' | 'add'>('current')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    condition: 'all',
    lastVisit: 'all'
  })
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string>('current')

  const allPatients: Patient[] = [
    ...(doctorData.patients?.current ?? []),
    ...(doctorData.patients?.past ?? [])
  ]

  const conditions: string[] = Array.from(
    new Set(allPatients.flatMap((p) => p.chronicConditions ?? []))
  )

  const filteredPatients: Patient[] = (
    (activeTab === 'current' ? doctorData.patients?.current : doctorData.patients?.past) ?? []
  ).filter((patient: Patient) => {
    const term = searchQuery.toLowerCase()
    const matchesSearch =
      patient.firstName.toLowerCase().includes(term) ||
      patient.lastName.toLowerCase().includes(term) ||
      patient.email.toLowerCase().includes(term)

    const matchesStatus = filters.status === 'all' || patient.status === filters.status

    const matchesCondition =
      filters.condition === 'all' ||
      (patient.chronicConditions?.includes(filters.condition) ?? false)

    // Note: lastVisit time-window filter can be added here when date data is available.

    return matchesSearch && matchesStatus && matchesCondition
  })

  const sections = [
    { id: 'current', label: 'Current Patients', icon: FaUsers, color: 'green', count: doctorData.patients?.current?.length ?? 0 },
    { id: 'past', label: 'Past Patients', icon: FaHistory, color: 'orange', count: doctorData.patients?.past?.length ?? 0 },
    { id: 'add', label: 'Add New Patient', icon: FaUserPlus, color: 'blue' }
  ] as const

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection('')
    } else {
      setExpandedSection(sectionId)
      setActiveTab(sectionId as typeof activeTab)
    }
  }

  const renderPatientCard = (patient: Patient) => (
    <div
      key={patient.id}
      className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl flex-shrink-0">
              {patient.firstName[0]}
              {patient.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {patient.firstName} {patient.lastName}
                </h3>
                <span
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                    patient.status === 'active'
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                      : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  {patient.status === 'active' ? (
                    <FaCheckCircle className="inline mr-1" />
                  ) : (
                    <FaClock className="inline mr-1" />
                  )}
                  {patient.status}
                </span>
              </div>

              <div className="space-y-1 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <FaPhone className="text-blue-500" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaEnvelope className="text-green-500" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaTint className="text-red-500" />
                  <span>Blood: {patient.bloodType ?? '-'}</span>
                </div>
              </div>

              {/* Medical Info */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {(patient.chronicConditions ?? []).slice(0, 2).map((condition, index) => (
                  <span
                    key={`${condition}-${index}`}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 rounded-full text-xs border border-yellow-200"
                  >
                    {condition}
                  </span>
                ))}
                {(patient.allergies ?? []).slice(0, 1).map((allergy, index) => (
                  <span
                    key={`${allergy}-${index}`}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-800 rounded-full text-xs border border-red-200"
                  >
                    <FaExclamationTriangle className="inline mr-1" />
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:flex-shrink-0">
            <button
              onClick={() => setExpandedPatient(expandedPatient === patient.id ? null : patient.id)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
            >
              <FaEye />
              <span className="hidden sm:inline">{expandedPatient === patient.id ? 'Less' : 'Details'}</span>
            </button>

            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-lg hover:from-green-100 hover:to-emerald-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <FaVideo />
              <span className="hidden sm:inline">Call</span>
            </button>

            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 rounded-lg hover:from-purple-100 hover:to-pink-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <FaPrescriptionBottle />
              <span className="hidden sm:inline">Prescribe</span>
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {expandedPatient === patient.id && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Visit History</h4>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p>
                    <strong>Total Visits:</strong> {patient.totalVisits ?? 0}
                  </p>
                  <p>
                    <strong>Last Visit:</strong> {patient.lastVisit ?? '—'}
                  </p>
                  <p>
                    <strong>Next Appointment:</strong> {patient.nextAppointment ?? '—'}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Medical Info</h4>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p>
                    <strong>Gender:</strong> {patient.gender ?? '—'}
                  </p>
                  <p>
                    <strong>DOB:</strong> {patient.dateOfBirth ?? '—'}
                  </p>
                  <p>
                    <strong>Insurance:</strong> {patient.insuranceProvider ?? '—'}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h4 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">Prescriptions</h4>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p>
                    <strong>Total:</strong> {patient.totalPrescriptions ?? 0}
                  </p>
                  <p>
                    <strong>Active:</strong> 2
                  </p>
                  <button className="text-purple-600 hover:underline">View All →</button>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <FaFileAlt />
                View Records
              </button>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <FaCalendarAlt />
                Schedule
              </button>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <FaComments />
                Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderAddPatient = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-blue-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Add New Patient</h3>
      <form className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition text-sm sm:text-base"
        >
          Add Patient
        </button>
      </form>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
              <FaUsers className="mr-2 sm:mr-3" />
              Patient Management
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Manage and track your patients</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {doctorData.statistics?.totalPatients ?? 0}
              </p>
              <p className="text-xs opacity-90">Total</p>
            </div>
            <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {doctorData.statistics?.activePatients ?? 0}
              </p>
              <p className="text-xs opacity-90">Active</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {doctorData.statistics?.newPatientsThisMonth ?? 0}
              </p>
              <p className="text-xs opacity-90">New</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm sm:text-base"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-lg sm:rounded-xl hover:from-gray-200 hover:to-slate-200 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaFilter />
            <span className="hidden sm:inline">Filters</span>
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Conditions</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>

            <select
              value={filters.lastVisit}
              onChange={(e) =>
                setFilters({ ...filters, lastVisit: e.target.value as FilterOptions['lastVisit'] })
              }
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        )}
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
                {'count' in tab && tab.count! > 0 && (
                  <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">{tab.count}</span>
                )}
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
                  expandedSection === section.id ? `bg-gradient-to-r from-${section.color}-50 to-${section.color}-100/50` : 'bg-white'
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
                  {'count' in section && section.count! > 0 && (
                    <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {section.count}
                    </span>
                  )}
                </div>
                {expandedSection === section.id ? (
                  <FaChevronUp className={`text-${section.color}-500`} />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="p-4 bg-white">
                  {section.id === 'current' && (
                    <div className="space-y-3 sm:space-y-4">{filteredPatients.map(renderPatientCard)}</div>
                  )}
                  {section.id === 'past' && (
                    <div className="space-y-3 sm:space-y-4">{filteredPatients.map(renderPatientCard)}</div>
                  )}
                  {section.id === 'add' && renderAddPatient()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Content */}
        <div className="hidden sm:block p-4 md:p-6">
          {activeTab === 'current' && (
            <div className="space-y-3 sm:space-y-4">
              {filteredPatients.map(renderPatientCard)}
              {filteredPatients.length === 0 && (
                <div className="text-center py-8">
                  <FaUsers className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">No patients found</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'past' && (
            <div className="space-y-3 sm:space-y-4">
              {filteredPatients.map(renderPatientCard)}
              {filteredPatients.length === 0 && (
                <div className="text-center py-8">
                  <FaHistory className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">No past patients</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'add' && renderAddPatient()}
        </div>
      </div>
    </div>
  )
}

export default PatientManagement
