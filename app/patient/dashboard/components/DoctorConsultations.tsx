import React, { useState } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaCalendarAlt, 
  FaVideo, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPlus, 
  FaStethoscope,
  FaPhoneAlt,
  FaComments,
  FaFileAlt,
  FaHeart,
  FaEye,
  FaStar,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaUserMd,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaNotesMedical,
  FaPrescriptionBottle,
  FaDownload
} from 'react-icons/fa'
import Link from 'next/link'

interface Props {
  patientData: Patient
  onVideoCall: () => void
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

  const allAppointments = [
    ...(patientData.upcomingAppointments || []),
    ...(patientData.pastAppointments || [])
  ]

  console.log('All Appointments:', allAppointments)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <FaClock className="mr-1" />
      case 'completed': return <FaCheckCircle className="mr-1" />
      case 'cancelled': return <FaTimesCircle className="mr-1" />
      default: return <FaExclamationCircle className="mr-1" />
    }
  }

  if (allAppointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center border border-gray-100">
        <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <FaUserMd className="text-blue-500 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Consultations Found</h3>
        <p className="text-gray-500 mb-6">You have not booked any consultations yet. Start your health journey today!</p>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
          <FaPlus />
          Book Your First Consultation
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <FaStethoscope className="mr-3" />
              Doctor Consultations
            </h2>
            <p className="opacity-90">Manage your appointments and medical consultations</p>
          </div>
          <div className="mt-4 md:mt-0 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{patientData.upcomingAppointments?.length || 0}</p>
              <p className="text-xs opacity-80">Upcoming</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{patientData.pastAppointments?.length || 0}</p>
              <p className="text-xs opacity-80">Completed</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{allAppointments.filter(apt => apt.type === 'video').length}</p>
              <p className="text-xs opacity-80">Video Calls</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors, specialties, or reasons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
          >
            <FaFilter />
            Filters
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterOptions['type'] })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="video">Video Call</option>
              <option value="in-person">In-Person</option>
            </select>

            <select
              value={filters.specialty}
              onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div 
            key={appointment.id} 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4 mb-4 lg:mb-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {appointment.doctorName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{appointment.doctorName}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {appointment.specialty}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-500" />
                        <span>{new Date(appointment.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-green-500" />
                        <span>{appointment.time} ({appointment.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {appointment.type === 'video' ? (
                          <>
                            <FaVideo className="text-purple-500" />
                            <span>Video Call</span>
                          </>
                        ) : (
                          <>
                            <FaMapMarkerAlt className="text-orange-500" />
                            <span>{appointment.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {appointment.status === 'upcoming' && appointment.type === 'video' && appointment.meetingLink && (
                    <Link href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                      <button onClick={onVideoCall} className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition flex items-center gap-2" >
                          <FaVideo className="cursor-pointer hover:text-blue-500" />
                        Join Call
                      </button>
                    </Link>
                  )}
                  
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2">
                    <FaComments />
                    Message
                  </button>
                  
                  <button 
                    onClick={() => setExpandedAppointment(
                      expandedAppointment === appointment.id ? null : appointment.id
                    )}
                    className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                  >
                    <FaEye />
                    {expandedAppointment === appointment.id ? 'Less' : 'Details'}
                  </button>
                </div>
              </div>

              {/* Appointment Reason */}
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-1">Reason for Visit:</p>
                <p className="text-gray-600">{appointment.reason}</p>
                {appointment.notes && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                    <p className="text-gray-600 text-sm italic">{appointment.notes}</p>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {expandedAppointment === appointment.id && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <FaUserMd className="mr-2" />
                        Doctor Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {appointment.doctorName}</p>
                        <p><strong>Specialty:</strong> {appointment.specialty}</p>
                        <p><strong>Doctor ID:</strong> {appointment.doctorId}</p>
                        {appointment.type === 'in-person' && appointment.location && (
                          <p><strong>Location:</strong> {appointment.location}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        Appointment Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {appointment.time}</p>
                        <p><strong>Duration:</strong> {appointment.duration} minutes</p>
                        <p><strong>Type:</strong> {appointment.type === 'video' ? 'Video Consultation' : 'In-Person Visit'}</p>
                        {appointment.type === 'video' && appointment.meetingLink && (
                          <p><strong>Meeting Link:</strong> 
                            <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                              Join Here
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prescription History for this Doctor */}
                  {patientData.activePrescriptions?.filter(rx => rx.doctorId === appointment.doctorId).length > 0 && (
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <FaPrescriptionBottle className="mr-2" />
                        Current Prescriptions from {appointment.doctorName}
                      </h4>
                      <div className="space-y-2">
                        {patientData.activePrescriptions
                          ?.filter(rx => rx.doctorId === appointment.doctorId)
                          .map(prescription => (
                            <div key={prescription.id} className="bg-white rounded-lg p-3 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{prescription.medicines[0]?.name}</span>
                                <span className="text-purple-600">{prescription.medicines[0]?.dosage}</span>
                              </div>
                              <p className="text-gray-600 text-xs mt-1">{prescription.diagnosis}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
            <FaSearch className="text-gray-400 text-3xl mx-auto mb-3" />
            <p className="text-gray-500">No appointments found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setFilters({ status: 'all', type: 'all', specialty: 'all' })
              }}
              className="mt-3 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Video Call History */}
      {patientData.videoCallHistory && patientData.videoCallHistory.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaVideo className="mr-2 text-green-500" />
            Video Call History
          </h3>
          <div className="space-y-3">
            {patientData.videoCallHistory.map((call) => (
              <div key={call.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaVideo className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{call.withName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(call.date).toLocaleDateString()} • {call.startTime} - {call.endTime}
                      </p>
                      <p className="text-sm text-gray-500">Duration: {call.duration} minutes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      call.callQuality === 'excellent' ? 'bg-green-100 text-green-800' :
                      call.callQuality === 'good' ? 'bg-blue-100 text-blue-800' :
                      call.callQuality === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
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
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {call.notes}
                    </p>
                  </div>
                )}
                {call.prescription && (
                  <div className="mt-2 p-2 bg-purple-50 rounded-lg">
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
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left">
            <FaPlus className="text-2xl mb-2" />
            <p className="font-medium">Book New Appointment</p>
            <p className="text-sm opacity-80">Schedule with your preferred doctor</p>
          </button>
          
          <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left">
            <FaVideo className="text-2xl mb-2" />
            <p className="font-medium">Join Video Call</p>
            <p className="text-sm opacity-80">Connect to ongoing consultation</p>
          </button>
          
          <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left">
            <FaFileAlt className="text-2xl mb-2" />
            <p className="font-medium">View Records</p>
            <p className="text-sm opacity-80">Access your medical history</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorConsultations