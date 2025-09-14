'use client'

import React, { useState } from 'react'
import type { IconType } from 'react-icons'
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaCalendarPlus,
  FaClock,
  FaVideo,
  FaUser,
  FaMapMarkerAlt,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaStethoscope,
  FaHistory,
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaFileAlt,
  FaPrescriptionBottle,
  FaCalendarDay
} from 'react-icons/fa'

/* ---------- Types ---------- */

type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show'
type AppointmentType = 'in-person' | 'video' | 'home-visit'

interface PaymentInfo {
  amount: number
  status: string
  method?: string  // Changed to optional to match incoming data
}

interface Appointment {
  id: string
  patientName: string
  status: AppointmentStatus
  type: AppointmentType
  date: string
  time: string
  duration: number
  reason: string
  notes?: string
  location?: string
  payment?: PaymentInfo
  followUpRequired?: boolean
  roomId?: string
}

interface Slot {
  time: string
  available: boolean
}

interface TodaySchedule {
  slots: Slot[]
  totalAppointments: number
  availableSlots: number
}

interface WeeklyDay {
  date: string
  totalAppointments: number
  availableSlots: number
}

interface DoctorPatient {
  id: string
  firstName: string
  lastName: string
}

interface DoctorData {
  upcomingAppointments: Appointment[]
  pastAppointments: Appointment[]
  todaySchedule: TodaySchedule
  weeklySchedule: WeeklyDay[]
  nextAvailable: string
  patients?: { current?: DoctorPatient[] }
  homeVisitAvailable?: boolean
}

interface Props {
  doctorData: DoctorData
  onVideoCall?: (appointment?: Appointment) => void
}

interface FilterOptions {
  type: 'all' | 'in-person' | 'video' | 'home-visit'
  status: 'all' | 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  dateRange: 'all' | 'today' | 'week' | 'month'
}

/* ---------- Component ---------- */

const AppointmentScheduler: React.FC<Props> = ({ doctorData, onVideoCall }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past' | 'schedule' | 'calendar'>('today')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({ type: 'all', status: 'all', dateRange: 'all' })
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string>('today')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState('')

  const upcomingAppointments: Appointment[] = doctorData?.upcomingAppointments ?? []
  const pastAppointments: Appointment[] = doctorData?.pastAppointments ?? []
  const todaySchedule: TodaySchedule = doctorData?.todaySchedule ?? { slots: [], totalAppointments: 0, availableSlots: 0 }
  const weeklySchedule: WeeklyDay[] = doctorData?.weeklySchedule ?? []

  const filterAppointments = (appointments: Appointment[]): Appointment[] =>
    appointments.filter((appointment: Appointment) => {
      const matchesSearch =
        appointment.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = filters.type === 'all' || appointment.type === filters.type
      const matchesStatus = filters.status === 'all' || appointment.status === filters.status

      return matchesSearch && matchesType && matchesStatus
    })

  type SectionId = 'today' | 'upcoming' | 'past' | 'schedule' | 'calendar'
  type SectionColor = 'blue' | 'green' | 'orange' | 'purple' | 'indigo'

  interface Section {
    id: SectionId
    label: string
    icon: IconType
    color: SectionColor
    count?: number
  }

  const sections: Section[] = [
    { id: 'today', label: 'Today Schedule', icon: FaCalendarDay, color: 'blue', count: todaySchedule.totalAppointments },
    { id: 'upcoming', label: 'Upcoming Appointments', icon: FaCalendarCheck, color: 'green', count: upcomingAppointments.length },
    { id: 'past', label: 'Past Appointments', icon: FaHistory, color: 'orange', count: pastAppointments.length },
    { id: 'schedule', label: 'Schedule New', icon: FaCalendarPlus, color: 'purple' },
    { id: 'calendar', label: 'Calendar View', icon: FaCalendarAlt, color: 'indigo' }
  ]

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection('')
    } else {
      setExpandedSection(sectionId)
      setActiveTab(sectionId as typeof activeTab)
    }
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
      case 'no-show':
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case 'video':
        return <FaVideo className="text-green-500" />
      case 'in-person':
        return <FaUser className="text-blue-500" />
      case 'home-visit':
        return <FaMapMarkerAlt className="text-purple-500" />
      default:
        return <FaStethoscope className="text-gray-500" />
    }
  }

  const renderAppointmentCard = (appointment: Appointment) => (
    <div
      key={appointment.id}
      className="bg-gradient-to-br from-white/90 to-blue-50/30 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl flex-shrink-0">
              {appointment.patientName?.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {appointment.patientName}
                </h3>
                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                  {appointment.status === 'scheduled' && <FaClock className="inline mr-1" />}
                  {appointment.status === 'completed' && <FaCheckCircle className="inline mr-1" />}
                  {appointment.status === 'cancelled' && <FaTimesCircle className="inline mr-1" />}
                  {appointment.status}
                </span>
                <span className="flex items-center gap-1">
                  {getTypeIcon(appointment.type)}
                  <span className="text-xs sm:text-sm text-gray-600">{appointment.type}</span>
                </span>
              </div>

              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <div className="flex flex-wrap gap-3 md:gap-4">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="text-green-500" />
                    <span>{appointment.time} ({appointment.duration} min)</span>
                  </div>
                  {appointment.location && (
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-purple-500" />
                      <span className="truncate">{appointment.location}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 mt-1">
                  <strong>Reason:</strong> {appointment.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:flex-shrink-0">
            <button
              onClick={() => setExpandedAppointment(expandedAppointment === appointment.id ? null : appointment.id)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
            >
              <FaFileAlt />
              <span className="hidden sm:inline">{expandedAppointment === appointment.id ? 'Less' : 'Details'}</span>
            </button>

            {appointment.type === 'video' && appointment.status === 'scheduled' && (
              <button
                onClick={() => onVideoCall?.(appointment)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-lg hover:from-green-100 hover:to-emerald-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <FaVideo />
                <span className="hidden sm:inline">Join Call</span>
              </button>
            )}

            {appointment.status === 'scheduled' && (
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 rounded-lg hover:from-purple-100 hover:to-pink-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <FaEdit />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {expandedAppointment === appointment.id && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Patient Info</h4>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="flex items-center gap-1"><FaPhone className="text-blue-500" /> +230 5XXX XXXX</p>
                  <p className="flex items-center gap-1"><FaEnvelope className="text-blue-500" /> patient@email.com</p>
                  <button className="text-blue-600 hover:underline">View Profile →</button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Payment Info</h4>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p><strong>Amount:</strong> Rs {appointment.payment?.amount ?? 0}</p>
                  <p><strong>Status:</strong> {appointment.payment?.status ?? 'pending'}</p>
                  <p><strong>Method:</strong> {appointment.payment?.method ?? 'cash'}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h4 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">Actions</h4>
                <div className="space-y-2">
                  <button className="text-purple-600 hover:underline text-xs sm:text-sm">Add Notes</button>
                  <button className="text-purple-600 hover:underline text-xs sm:text-sm">Write Prescription</button>
                  {appointment.followUpRequired && (
                    <p className="text-orange-600 text-xs sm:text-sm font-medium">
                      <FaExclamationTriangle className="inline mr-1" />
                      Follow-up Required
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {appointment.notes && (
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Notes</h4>
                <p className="text-xs sm:text-sm text-gray-600">{appointment.notes}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <FaFileAlt />
                Patient Records
              </button>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <FaPrescriptionBottle />
                Prescribe
              </button>
              {appointment.status === 'scheduled' && (
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <FaTimesCircle />
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderTodaySchedule = () => (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{todaySchedule.totalAppointments}</p>
          <p className="text-xs sm:text-sm text-gray-600">Total Appointments</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{todaySchedule.availableSlots}</p>
          <p className="text-xs sm:text-sm text-gray-600">Available Slots</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200 col-span-2 sm:col-span-1">
          <p className="text-lg sm:text-xl font-bold text-purple-600">{doctorData.nextAvailable}</p>
          <p className="text-xs sm:text-sm text-gray-600">Next Available</p>
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Time Slots</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
          {todaySchedule.slots?.map((slot: Slot, index: number) => (
            <button
              key={index}
              disabled={!slot.available}
              className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition ${
                slot.available
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200'
                  : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 cursor-not-allowed border border-red-200'
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Appointments */}
      {upcomingAppointments.filter((apt: Appointment) =>
        new Date(apt.date).toDateString() === new Date().toDateString()
      ).length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Today&rsquo;s Appointments</h3>
          {upcomingAppointments
            .filter((apt: Appointment) => new Date(apt.date).toDateString() === new Date().toDateString())
            .map(renderAppointmentCard)}
        </div>
      )}
    </div>
  )

  const renderScheduleNew = () => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-purple-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Schedule New Appointment</h3>
      <form className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Patient</label>
            <select className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm">
              <option>Select Patient</option>
              {doctorData.patients?.current?.map((patient: DoctorPatient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
            <select className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm">
              <option value="in-person">In-Person</option>
              <option value="video">Video Consultation</option>
              {doctorData.homeVisitAvailable && <option value="home-visit">Home Visit</option>}
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
            >
              <option value="">Select Time</option>
              {todaySchedule.slots?.filter((s: Slot) => s.available).map((slot: Slot, index: number) => (
                <option key={index} value={slot.time}>{slot.time}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
            <textarea
              rows={3}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
              placeholder="Enter reason for appointment..."
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition text-sm sm:text-base">
          Schedule Appointment
        </button>
      </form>
    </div>
  )

  const renderCalendarView = () => (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-indigo-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Weekly Schedule</h3>
      <div className="space-y-3">
        {weeklySchedule.map((day: WeeklyDay) => (
          <div key={day.date} className="bg-gradient-to-r from-white/80 to-blue-50/30 rounded-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                <div className="flex gap-4 mt-1 text-xs sm:text-sm text-gray-600">
                  <span>{day.totalAppointments} appointments</span>
                  <span className="text-green-600">{day.availableSlots} available</span>
                </div>
              </div>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition text-xs sm:text-sm">
                View Day
              </button>
            </div>
          </div>
        ))}
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
              <FaCalendarAlt className="mr-2 sm:mr-3" />
              Appointment Scheduler
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Manage your appointments and schedule</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{todaySchedule.totalAppointments}</p>
              <p className="text-xs opacity-90">Today</p>
            </div>
            <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{upcomingAppointments.length}</p>
              <p className="text-xs opacity-90">Upcoming</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{todaySchedule.availableSlots}</p>
              <p className="text-xs opacity-90">Available</p>
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
              placeholder="Search appointments..."
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
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterOptions['type'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Types</option>
              <option value="in-person">In-Person</option>
              <option value="video">Video Call</option>
              <option value="home-visit">Home Visit</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as FilterOptions['dateRange'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
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
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
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
                  {section.count !== undefined && section.count > 0 && (
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
                <div className="p-4 bg-white/60">
                  {section.id === 'today' && renderTodaySchedule()}
                  {section.id === 'upcoming' && (
                    <div className="space-y-3 sm:space-y-4">
                      {filterAppointments(upcomingAppointments).map(renderAppointmentCard)}
                      {filterAppointments(upcomingAppointments).length === 0 && (
                        <div className="text-center py-8">
                          <FaCalendarAlt className="text-gray-400 text-4xl mx-auto mb-3" />
                          <p className="text-gray-500">No upcoming appointments</p>
                        </div>
                      )}
                    </div>
                  )}
                  {section.id === 'past' && (
                    <div className="space-y-3 sm:space-y-4">
                      {filterAppointments(pastAppointments).map(renderAppointmentCard)}
                      {filterAppointments(pastAppointments).length === 0 && (
                        <div className="text-center py-8">
                          <FaHistory className="text-gray-400 text-4xl mx-auto mb-3" />
                          <p className="text-gray-500">No past appointments</p>
                        </div>
                      )}
                    </div>
                  )}
                  {section.id === 'schedule' && renderScheduleNew()}
                  {section.id === 'calendar' && renderCalendarView()}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden sm:block p-4 md:p-6">
          {activeTab === 'today' && renderTodaySchedule()}
          {activeTab === 'upcoming' && (
            <div className="space-y-3 sm:space-y-4">
              {filterAppointments(upcomingAppointments).map(renderAppointmentCard)}
              {filterAppointments(upcomingAppointments).length === 0 && (
                <div className="text-center py-8">
                  <FaCalendarAlt className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming appointments</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'past' && (
            <div className="space-y-3 sm:space-y-4">
              {filterAppointments(pastAppointments).map(renderAppointmentCard)}
              {filterAppointments(pastAppointments).length === 0 && (
                <div className="text-center py-8">
                  <FaHistory className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">No past appointments</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'schedule' && renderScheduleNew()}
          {activeTab === 'calendar' && renderCalendarView()}
        </div>
      </div>
    </div>
  )
}

export default AppointmentScheduler