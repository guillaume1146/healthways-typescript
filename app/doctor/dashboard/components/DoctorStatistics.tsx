'use client'

import React, { useState } from 'react'
import {
  FaChartLine,
  FaChartPie,
  FaUsers,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaStethoscope,
  FaStar,
  FaClock,
  FaHeartbeat,
  FaUserClock,
  FaPercentage,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaChevronDown,
  FaChevronUp,
  FaMedal,
  FaAward,
  FaCheckCircle,
  FaCalendarDay,
  FaCalendarWeek,
  FaMale,
  FaFemale,
  FaPrescriptionBottle,
  FaVideo,
  FaClinicMedical,
  FaAmbulance,
  FaFileAlt
} from 'react-icons/fa'

/* ---------- Types ---------- */

type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'all'
type Metric = 'patients' | 'revenue' | 'appointments' | 'satisfaction'

interface FilterOptions {
  dateRange: DateRange
  metric: Metric
}

interface AgeGroup {
  range: string
  count: number
}

interface GenderCounts {
  male: number
  female: number
  other: number
}

interface Demographics {
  ageGroups: AgeGroup[]
  gender: Partial<GenderCounts>
}

interface ConditionCount {
  condition: string
  count: number
}

interface Statistics {
  totalPatients: number
  activePatients: number
  newPatientsThisMonth: number
  totalConsultations: number
  consultationsThisMonth: number
  videoConsultations: number
  emergencyConsultations: number
  averageConsultationDuration: number
  totalRevenue: number
  totalPrescriptions: number
  patientDemographics: Partial<Demographics>
  topConditionsTreated: ConditionCount[]
}

interface PerformanceMetrics {
  patientSatisfaction: number
  appointmentCompletionRate: number
  returnPatientRate: number
  responseTime: number
  totalReviews: number
  averageRating: number
  prescriptionAccuracy: number
}

interface Earnings {
  today: number
  thisWeek: number
  thisMonth: number
  thisYear: number
  totalEarnings: number
  averageConsultationFee: number
  pendingPayouts: number
}

interface DoctorData {
  statistics?: Partial<Statistics>
  performanceMetrics?: Partial<PerformanceMetrics>
  billing?: { earnings?: Partial<Earnings> }
  videoConsultationFee?: number
  emergencyConsultationFee?: number
}

interface Props {
  doctorData: DoctorData
}

/* ---------- Component ---------- */

const DoctorStatistics: React.FC<Props> = ({ doctorData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'financial' | 'appointments' | 'treatments'>(
    'overview'
  )
  const [expandedSection, setExpandedSection] = useState<string>('overview')
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'month',
    metric: 'patients'
  })

  // Get statistics safely with defaults
  const stats: Statistics = {
    totalPatients: doctorData?.statistics?.totalPatients ?? 0,
    activePatients: doctorData?.statistics?.activePatients ?? 0,
    newPatientsThisMonth: doctorData?.statistics?.newPatientsThisMonth ?? 0,
    totalConsultations: doctorData?.statistics?.totalConsultations ?? 0,
    consultationsThisMonth: doctorData?.statistics?.consultationsThisMonth ?? 0,
    videoConsultations: doctorData?.statistics?.videoConsultations ?? 0,
    emergencyConsultations: doctorData?.statistics?.emergencyConsultations ?? 0,
    averageConsultationDuration: doctorData?.statistics?.averageConsultationDuration ?? 0,
    totalRevenue: doctorData?.statistics?.totalRevenue ?? 0,
    totalPrescriptions: doctorData?.statistics?.totalPrescriptions ?? 0,
    patientDemographics: doctorData?.statistics?.patientDemographics ?? {},
    topConditionsTreated: doctorData?.statistics?.topConditionsTreated ?? []
  }

  const performanceMetrics: PerformanceMetrics = {
    patientSatisfaction: doctorData?.performanceMetrics?.patientSatisfaction ?? 0,
    appointmentCompletionRate: doctorData?.performanceMetrics?.appointmentCompletionRate ?? 0,
    returnPatientRate: doctorData?.performanceMetrics?.returnPatientRate ?? 0,
    responseTime: doctorData?.performanceMetrics?.responseTime ?? 0,
    totalReviews: doctorData?.performanceMetrics?.totalReviews ?? 0,
    averageRating: doctorData?.performanceMetrics?.averageRating ?? 0,
    prescriptionAccuracy: doctorData?.performanceMetrics?.prescriptionAccuracy ?? 0
  }

  const earnings: Earnings = {
    today: doctorData?.billing?.earnings?.today ?? 0,
    thisWeek: doctorData?.billing?.earnings?.thisWeek ?? 0,
    thisMonth: doctorData?.billing?.earnings?.thisMonth ?? 0,
    thisYear: doctorData?.billing?.earnings?.thisYear ?? 0,
    totalEarnings: doctorData?.billing?.earnings?.totalEarnings ?? 0,
    averageConsultationFee: doctorData?.billing?.earnings?.averageConsultationFee ?? 0,
    pendingPayouts: doctorData?.billing?.earnings?.pendingPayouts ?? 0
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: FaChartLine, color: 'blue' },
    { id: 'patients', label: 'Patient Analytics', icon: FaUsers, color: 'green' },
    { id: 'financial', label: 'Financial Analytics', icon: FaMoneyBillWave, color: 'purple' },
    { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt, color: 'orange' },
    { id: 'treatments', label: 'Treatments', icon: FaStethoscope, color: 'red' }
  ] as const

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection('')
    } else {
      setExpandedSection(sectionId)
      setActiveTab(sectionId as typeof activeTab)
    }
  }

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <FaUsers className="text-blue-500 text-lg" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              +{stats.newPatientsThisMonth}
              <FaArrowUp />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-700">{stats.totalPatients}</p>
          <p className="text-xs sm:text-sm text-gray-600">Total Patients</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <FaMoneyBillWave className="text-green-500 text-lg" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              +10%
              <FaArrowUp />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-700">Rs {earnings.thisMonth.toLocaleString()}</p>
          <p className="text-xs sm:text-sm text-gray-600">Monthly Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <FaStar className="text-purple-500 text-lg" />
            <span className="text-xs text-gray-600">{performanceMetrics.totalReviews} reviews</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-purple-700">{performanceMetrics.averageRating}</p>
          <p className="text-xs sm:text-sm text-gray-600">Average Rating</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <FaCalendarAlt className="text-orange-500 text-lg" />
            <span className="text-xs text-orange-600">{stats.consultationsThisMonth}/month</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-orange-700">{stats.totalConsultations}</p>
          <p className="text-xs sm:text-sm text-gray-600">Total Consultations</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Patient Satisfaction</span>
              <span className="text-sm font-bold text-indigo-700">{performanceMetrics.patientSatisfaction}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                style={{ width: `${performanceMetrics.patientSatisfaction}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm font-bold text-green-700">{performanceMetrics.appointmentCompletionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                style={{ width: `${performanceMetrics.appointmentCompletionRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Return Rate</span>
              <span className="text-sm font-bold text-purple-700">{performanceMetrics.returnPatientRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                style={{ width: `${performanceMetrics.returnPatientRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FaClock className="text-blue-500" />
              <span className="text-xs text-gray-600">Response Time</span>
            </div>
            <p className="text-lg font-bold text-blue-700">{performanceMetrics.responseTime} min</p>
          </div>

          <div className="bg-white/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FaCheckCircle className="text-green-500" />
              <span className="text-xs text-gray-600">Prescription Accuracy</span>
            </div>
            <p className="text-lg font-bold text-green-700">{performanceMetrics.prescriptionAccuracy}%</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-green-200">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Consultation Types</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                <FaClinicMedical className="text-blue-500" />
                In-Person
              </span>
              <span className="text-sm font-bold">
                {Math.max(
                  0,
                  stats.totalConsultations - stats.videoConsultations - stats.emergencyConsultations
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                <FaVideo className="text-green-500" />
                Video Consultations
              </span>
              <span className="text-sm font-bold">{stats.videoConsultations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                <FaAmbulance className="text-red-500" />
                Emergency
              </span>
              <span className="text-sm font-bold">{stats.emergencyConsultations}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-orange-200">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600">New Patients This Month</span>
              <span className="text-sm font-bold text-green-700">+{stats.newPatientsThisMonth}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600">Consultations This Month</span>
              <span className="text-sm font-bold">{stats.consultationsThisMonth}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600">Avg Duration</span>
              <span className="text-sm font-bold">{stats.averageConsultationDuration} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPatients = () => {
    const totalPatients = stats.totalPatients
    const ageGroups: AgeGroup[] = stats.patientDemographics?.ageGroups ?? []
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Patient Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FaUsers className="text-blue-500" />
              <span className="text-xs text-gray-600">Total</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-700">{stats.totalPatients}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <FaCheckCircle className="text-green-500" />
              <span className="text-xs text-gray-600">Active</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-700">{stats.activePatients}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <FaUserClock className="text-purple-500" />
              <span className="text-xs text-gray-600">New (Month)</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-purple-700">{stats.newPatientsThisMonth}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <FaPercentage className="text-orange-500" />
              <span className="text-xs text-gray-600">Return Rate</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-orange-700">{performanceMetrics.returnPatientRate}%</p>
          </div>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Age Distribution</h3>
            <div className="space-y-3">
              {ageGroups.map((group, index) => {
                const pct = totalPatients > 0 ? (group.count / totalPatients) * 100 : 0
                return (
                  <div key={`${group.range}-${index}`}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{group.range}</span>
                      <span className="font-semibold">{group.count} patients</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${pct.toFixed(1)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-pink-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-2">
                    <FaMale className="text-blue-600 text-2xl" />
                  </div>
                  <p className="text-lg font-bold text-blue-700">{stats.patientDemographics?.gender?.male ?? 0}</p>
                  <p className="text-xs text-gray-600">Male</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-2">
                    <FaFemale className="text-pink-600 text-2xl" />
                  </div>
                  <p className="text-lg font-bold text-pink-700">{stats.patientDemographics?.gender?.female ?? 0}</p>
                  <p className="text-xs text-gray-600">Female</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-2">
                    <FaUsers className="text-purple-600 text-2xl" />
                  </div>
                  <p className="text-lg font-bold text-purple-700">{stats.patientDemographics?.gender?.other ?? 0}</p>
                  <p className="text-xs text-gray-600">Other</p>
                </div>
              </div>

              <div className="pt-3 border-t border-purple-200">
                <p className="text-sm text-gray-600 text-center">Total Gender Distribution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Conditions */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Top Conditions Treated</h3>
          <div className="space-y-3">
            {(stats.topConditionsTreated as ConditionCount[]).map((condition, index) => (
              <div key={`${condition.condition}-${index}`} className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : 'bg-orange-100'
                    }`}
                  >
                    {index === 0 && <FaMedal className="text-yellow-600" />}
                    {index === 1 && <FaMedal className="text-gray-600" />}
                    {index === 2 && <FaMedal className="text-orange-600" />}
                    {index > 2 && <span className="text-sm font-bold">{index + 1}</span>}
                  </div>
                  <span className="text-sm font-medium">{condition.condition}</span>
                </div>
                <span className="text-sm font-bold text-green-700">{condition.count} cases</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderFinancial = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <FaMoneyBillWave className="text-green-500" />
            <span className="text-xs text-gray-600">Today</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-green-700">Rs {earnings.today.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FaCalendarWeek className="text-blue-500" />
            <span className="text-xs text-gray-600">This Week</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-blue-700">Rs {earnings.thisWeek.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <FaCalendarAlt className="text-purple-500" />
            <span className="text-xs text-gray-600">This Month</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-purple-700">Rs {earnings.thisMonth.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <FaChartLine className="text-orange-500" />
            <span className="text-xs text-gray-600">This Year</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-orange-700">Rs {earnings.thisYear.toLocaleString()}</p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Revenue Analysis</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Average Fees</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Per Consultation</span>
                <span className="text-sm font-bold">Rs {earnings.averageConsultationFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Video Consultation</span>
                <span className="text-sm font-bold">Rs {doctorData.videoConsultationFee ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Emergency</span>
                <span className="text-sm font-bold">Rs {doctorData.emergencyConsultationFee ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Pending & Total</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Pending Payouts</span>
                <span className="text-sm font-bold text-orange-600">Rs {earnings.pendingPayouts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Total Earnings</span>
                <span className="text-sm font-bold text-green-600">Rs {earnings.totalEarnings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Total Revenue</span>
                <span className="text-sm font-bold">Rs {stats.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Trend</h3>

        <div className="space-y-3">
          {[
            { month: 'Current Month', amount: earnings.thisMonth, growth: 10 },
            { month: 'Last Month', amount: earnings.thisMonth * 0.9, growth: 5 },
            { month: '2 Months Ago', amount: earnings.thisMonth * 0.85, growth: 8 }
          ].map((item, index) => {
            const base = earnings.thisMonth || 1
            const pct = ((item.amount || 0) / base) * 100
            return (
              <div key={index} className="bg-white/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">Rs {Math.round(item.amount).toLocaleString()}</span>
                    <span className={`text-xs flex items-center gap-1 ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.growth > 0 ? <FaArrowUp /> : <FaArrowDown />}
                      {Math.abs(item.growth)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                    style={{ width: `${pct.toFixed(1)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderAppointments = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Appointment Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <FaCalendarAlt className="text-orange-500" />
            <span className="text-xs text-gray-600">Total</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-orange-700">{stats.totalConsultations}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FaCalendarDay className="text-blue-500" />
            <span className="text-xs text-gray-600">This Month</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-700">{stats.consultationsThisMonth}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <FaVideo className="text-green-500" />
            <span className="text-xs text-gray-600">Video</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-700">{stats.videoConsultations}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <FaAmbulance className="text-red-500" />
            <span className="text-xs text-gray-600">Emergency</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-700">{stats.emergencyConsultations}</p>
        </div>
      </div>

      {/* Appointment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Appointment Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Duration</span>
              <span className="text-sm font-bold text-purple-700">{stats.averageConsultationDuration} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm font-bold text-green-700">{performanceMetrics.appointmentCompletionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-bold text-blue-700">{performanceMetrics.responseTime} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Prescriptions</span>
              <span className="text-sm font-bold text-orange-700">{stats.totalPrescriptions}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-cyan-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Daily Average</h3>
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mb-3">
              <p className="text-2xl font-bold text-cyan-700">
                {Math.max(0, Math.round((stats.consultationsThisMonth || 0) / 30))}
              </p>
            </div>
            <p className="text-sm text-gray-600">Appointments per day</p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/50 rounded-lg p-2">
                <p className="text-xs text-gray-600">Peak Hour</p>
                <p className="text-sm font-bold">10:00 AM</p>
              </div>
              <div className="bg-white/50 rounded-lg p-2">
                <p className="text-xs text-gray-600">Busiest Day</p>
                <p className="text-sm font-bold">Monday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTreatments = () => {
    const topConditions: ConditionCount[] = stats.topConditionsTreated ?? []
    const maxCount = topConditions[0]?.count ?? 1
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Treatment Statistics */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Treatment Statistics</h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FaPrescriptionBottle className="text-red-500" />
                <span className="text-xs text-gray-600">Prescriptions</span>
              </div>
              <p className="text-lg font-bold text-red-700">{stats.totalPrescriptions}</p>
            </div>

            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FaCheckCircle className="text-green-500" />
                <span className="text-xs text-gray-600">Success Rate</span>
              </div>
              <p className="text-lg font-bold text-green-700">95%</p>
            </div>

            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FaHeartbeat className="text-purple-500" />
                <span className="text-xs text-gray-600">Conditions</span>
              </div>
              <p className="text-lg font-bold text-purple-700">{topConditions.length}</p>
            </div>

            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FaAward className="text-orange-500" />
                <span className="text-xs text-gray-600">Accuracy</span>
              </div>
              <p className="text-lg font-bold text-orange-700">{performanceMetrics.prescriptionAccuracy}%</p>
            </div>
          </div>
        </div>

        {/* Top Treatments */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Most Common Treatments</h3>

          <div className="space-y-3">
            {topConditions.slice(0, 5).map((condition, index) => {
              const pct = maxCount > 0 ? (condition.count / maxCount) * 100 : 0
              return (
                <div key={`${condition.condition}-${index}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{condition.condition}</span>
                    <span className="text-sm font-bold text-purple-700">{condition.count} cases</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                      style={{ width: `${pct.toFixed(1)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Export Reports</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition text-xs sm:text-sm flex flex-col items-center gap-1">
              <FaDownload />
              Patient Report
            </button>
            <button className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg hover:from-green-200 hover:to-emerald-200 transition text-xs sm:text-sm flex flex-col items-center gap-1">
              <FaChartLine />
              Revenue Report
            </button>
            <button className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-pink-200 transition text-xs sm:text-sm flex flex-col items-center gap-1">
              <FaChartPie />
              Analytics PDF
            </button>
            <button className="p-3 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-lg hover:from-orange-200 hover:to-yellow-100 transition text-xs sm:text-sm flex flex-col items-center gap-1">
              <FaFileAlt />
              Full Report
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
              <FaChartLine className="mr-2 sm:mr-3" />
              Analytics & Statistics
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Track your performance and growth</p>
          </div>
          <div className="flex gap-2">
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as FilterOptions['dateRange'] })}
              className="px-3 py-1.5 bg-white/20 text-white rounded-lg text-sm border border-white/30 backdrop-blur"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <button className="px-4 py-1.5 bg-white/20 text-white rounded-lg text-sm border border-white/30 backdrop-blur hover:bg-white/30 transition">
              <FaDownload className="inline mr-1" />
              Export
            </button>
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
                  {section.id === 'patients' && renderPatients()}
                  {section.id === 'financial' && renderFinancial()}
                  {section.id === 'appointments' && renderAppointments()}
                  {section.id === 'treatments' && renderTreatments()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Content */}
        <div className="hidden sm:block p-4 md:p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'patients' && renderPatients()}
          {activeTab === 'financial' && renderFinancial()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'treatments' && renderTreatments()}
        </div>
      </div>
    </div>
  )
}

export default DoctorStatistics
