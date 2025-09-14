import React, { useState } from 'react' 
import { Patient } from '@/lib/data/patients'
import { 
  FaCalendarAlt, 
  FaVideo, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPlus, 
  FaStethoscope,
  FaComments,
  FaFileAlt,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaUserMd,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaPrescriptionBottle,
  FaDownload,
  FaEye,
  FaFilter
} from 'react-icons/fa'

/** Shared appointment fields */
type AppointmentBase = {
  id: string
  doctorId: string
  doctorName: string
  specialty: string
  date: string          // ISO string or date-like
  time: string
  duration: number
  status: 'upcoming' | 'completed' | 'cancelled'
  reason: string
  notes?: string
}

/** Variants */
type VideoAppointment = AppointmentBase & {
  type: 'video'
  roomId: string
}

type InPersonAppointment = AppointmentBase & {
  type: 'in-person'
  location: string
}

type Appointment = VideoAppointment | InPersonAppointment

interface Props {
  patientData: Patient
  onVideoCall: (appointment?: VideoAppointment) => void
}

interface FilterOptions {
  status: 'all' | 'upcoming' | 'completed' | 'cancelled'
  type: 'all' | 'video' | 'in-person'
  specialty: 'all' | string
}

const DoctorConsultations: React.FC<Props> = ({ patientData, onVideoCall }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    type: 'all',
    specialty: 'all'
  })
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // If your Patient type already has these correctly typed, remove the `as` assertions below.
  const upcoming = (patientData.upcomingAppointments ?? []) as Appointment[]
  const past = (patientData.pastAppointments ?? []) as Appointment[]
  const allAppointments: Appointment[] = [...upcoming, ...past]

  // Get unique specialties
  const specialties = Array.from(new Set(allAppointments.map(apt => apt.specialty)))

  // Filter appointments
  const filteredAppointments = allAppointments.filter(appointment => {
    const matchesSearch = 
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filters.status === 'all' || appointment.status === filters.status
    const matchesType = filters.type === 'all' || appointment.type === filters.type
    const matchesSpecialty = filters.specialty === 'all' || appointment.specialty === filters.specialty

    return matchesSearch && matchesStatus && matchesType && matchesSpecialty
  })

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming': return <FaClock className="mr-1" />
      case 'completed': return <FaCheckCircle className="mr-1" />
      case 'cancelled': return <FaTimesCircle className="mr-1" />
      default: return <FaExclamationCircle className="mr-1" />
    }
  }

  const handleVideoCall = (appointment: VideoAppointment) => {
    // Store the appointment data in localStorage for the video consultation
    if (appointment.roomId) {
      localStorage.setItem(`current_video_appointment`, JSON.stringify(appointment))
      onVideoCall(appointment)
    } else {
      alert('This appointment does not have a room ID for video consultation')
    }
  }

  if (allAppointments.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center border border-blue-200">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
          <FaUserMd className="text-blue-500 text-2xl sm:text-3xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Consultations Found</h3>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">You have not booked any consultations yet. Start your health journey today!</p>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base">
          <FaPlus />
          Book Your First Consultation
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
              <FaStethoscope className="mr-2 sm:mr-3" />
              Doctor Consultations
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Manage your appointments and medical consultations</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-center">
            <div className="bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{patientData.upcomingAppointments?.length || 0}</p>
              <p className="text-xs opacity-90">Upcoming</p>
            </div>
            <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{patientData.pastAppointments?.length || 0}</p>
              <p className="text-xs opacity-90">Completed</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{allAppointments.filter(apt => apt.type === 'video').length}</p>
              <p className="text-xs opacity-90">Video Calls</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
            <input
              type="text"
              placeholder="Search doctors, specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm sm:text-base"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-lg sm:rounded-xl hover:from-gray-200 hover:to-slate-200 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaFilter />
            <span className="hidden sm:inline">Filters</span>
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {/* Filter Options - Mobile Vertical, Desktop Horizontal */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterOptions['type'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Types</option>
              <option value="video">Video Call</option>
              <option value="in-person">In-Person</option>
            </select>

            <select
              value={filters.specialty}
              onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Appointments List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAppointments.map((appointment) => (
          <div 
            key={appointment.id} 
            className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl flex-shrink-0">
                    {appointment.doctorName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">{appointment.doctorName}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                        {appointment.specialty}
                      </span>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border flex items-center ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </span>
                    </div>
                    <div className="space-y-1 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-500" />
                        <span className="truncate">{new Date(appointment.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-green-500" />
                        <span>{appointment.time} ({appointment.duration}m)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {appointment.type === 'video' ? (
                          <>
                            <FaVideo className="text-purple-500" />
                            <span>Video Call</span>
                            {appointment.roomId && (
                              <span className="text-xs text-gray-500 ml-1">(Room: {appointment.roomId})</span>
                            )}
                          </>
                        ) : (
                          <>
                            <FaMapMarkerAlt className="text-orange-500" />
                            <span className="truncate">{appointment.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-shrink-0">
                  {appointment.status === 'upcoming' && appointment.type === 'video' && appointment.roomId && (
                    <button 
                      onClick={() => handleVideoCall(appointment)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                    >
                      <FaVideo />
                      <span className="hidden sm:inline">Join Call</span>
                    </button>
                  )}
                  
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <FaComments />
                    <span className="hidden sm:inline">Message</span>
                  </button>
                  
                  <button 
                    onClick={() => setExpandedAppointment(
                      expandedAppointment === appointment.id ? null : appointment.id
                    )}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 rounded-lg hover:from-gray-100 hover:to-slate-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                  >
                    <FaEye />
                    <span className="hidden sm:inline">{expandedAppointment === appointment.id ? 'Less' : 'Details'}</span>
                  </button>
                </div>
              </div>

              {/* Appointment Reason */}
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Reason for Visit:</p>
                <p className="text-gray-600 text-xs sm:text-sm">{appointment.reason}</p>
                {appointment.notes && (
                  <div className="mt-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes:</p>
                    <p className="text-gray-600 text-xs sm:text-sm italic">{appointment.notes}</p>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {expandedAppointment === appointment.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 sm:space-y-4">
                  <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 md:gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center text-sm sm:text-base">
                        <FaUserMd className="mr-2" />
                        Doctor Information
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <p><strong>Name:</strong> {appointment.doctorName}</p>
                        <p><strong>Specialty:</strong> {appointment.specialty}</p>
                        <p><strong>Doctor ID:</strong> {appointment.doctorId}</p>
                        {appointment.type === 'in-person' && (
                          <p><strong>Location:</strong> {appointment.location}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center text-sm sm:text-base">
                        <FaCalendarAlt className="mr-2" />
                        Appointment Details
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {appointment.time}</p>
                        <p><strong>Duration:</strong> {appointment.duration} minutes</p>
                        <p><strong>Type:</strong> {appointment.type === 'video' ? 'Video Consultation' : 'In-Person Visit'}</p>
                        {appointment.type === 'video' && (
                          <p className="truncate">
                            <strong>Room ID:</strong> {appointment.roomId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prescription History for this Doctor */}
                  {patientData.activePrescriptions?.filter(rx => rx.doctorId === appointment.doctorId).length ? (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h4 className="font-semibold text-purple-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <FaPrescriptionBottle className="mr-2" />
                        Current Prescriptions from {appointment.doctorName}
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2">
                        {patientData.activePrescriptions
                          ?.filter(rx => rx.doctorId === appointment.doctorId)
                          .map(prescription => (
                            <div key={prescription.id} className="bg-gradient-to-r from-white/70 to-purple-50/70 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{prescription.medicines[0]?.name}</span>
                                <span className="text-purple-600">{prescription.medicines[0]?.dosage}</span>
                              </div>
                              <p className="text-gray-600 text-xs mt-1">{prescription.diagnosis}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-lg border border-gray-200">
            <FaSearch className="text-gray-400 text-2xl sm:text-3xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">No appointments found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setFilters({ status: 'all', type: 'all', specialty: 'all' })
              }}
              className="mt-3 text-blue-600 hover:underline text-sm sm:text-base"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Video Call History */}
      {patientData.videoCallHistory && patientData.videoCallHistory.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-green-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FaVideo className="mr-2 text-green-500" />
            Video Call History
          </h3>
          <div className="space-y-2.5 sm:space-y-3">
            {patientData.videoCallHistory.map((call) => (
              <div key={call.id} className="bg-gradient-to-r from-white/70 to-green-50/70 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaVideo className="text-green-600 text-sm sm:text-base" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{call.withName}</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(call.date).toLocaleDateString()} • {call.startTime} - {call.endTime}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">Duration: {call.duration} minutes</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                      call.callQuality === 'excellent' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' :
                      call.callQuality === 'good' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800' :
                      call.callQuality === 'fair' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800' :
                      'bg-gradient-to-r from-red-100 to-pink-100 text-red-800'
                    }`}>
                      {call.callQuality} quality
                    </span>
                    {call.recording && (
                      <div className="mt-1">
                        <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <FaDownload />
                          Recording
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {call.notes && (
                  <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600">
                      <strong>Notes:</strong> {call.notes}
                    </p>
                  </div>
                )}
                {call.prescription && (
                  <div className="mt-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <p className="text-xs text-purple-700">
                      <FaPrescriptionBottle className="inline mr-1" />
                      Prescription issued during this call
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
          <button className="w-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-indigo-400/30 hover:to-purple-400/30 transition text-left">
            <FaPlus className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">Book New Appointment</p>
            <p className="text-xs sm:text-sm opacity-90">Schedule with your preferred doctor</p>
          </button>
          
          <button 
            onClick={() => {
              const nextVideoAppointment = (patientData.upcomingAppointments as Appointment[] | undefined)
                ?.find((apt): apt is VideoAppointment => apt.type === 'video' && 'roomId' in apt && Boolean(apt.roomId))
              if (nextVideoAppointment) {
                handleVideoCall(nextVideoAppointment)
              } else {
                alert('No upcoming video consultations found')
              }
            }}
            className="w-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-green-400/30 hover:to-emerald-400/30 transition text-left"
          >
            <FaVideo className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">Join Video Call</p>
            <p className="text-xs sm:text-sm opacity-90">Connect to ongoing consultation</p>
          </button>
          
          <button className="w-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-blue-400/30 hover:to-cyan-400/30 transition text-left">
            <FaFileAlt className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">View Records</p>
            <p className="text-xs sm:text-sm opacity-90">Access your medical history</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorConsultations
