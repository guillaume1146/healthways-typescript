import React, { useState } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaUserNurse, 
  FaCalendarAlt, 
  FaClock, 
  FaHome, 
  FaHospital, 
  FaVideo,
  FaComments,
  FaStethoscope,
  FaPlus,
  FaFilter,
  FaSearch,
  FaEdit,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock as FaWaiting,
  FaTimes,
  FaFileAlt,
  FaDownload,
  FaShare,
  FaHistory,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaCalendarPlus,
  FaUserClock,
  FaMedkit,
  FaClipboardList,
} from 'react-icons/fa'

interface Props {
  patientData: Patient
  onVideoCall: () => void
}

interface FilterOptions {
  status: 'all' | 'upcoming' | 'completed' | 'cancelled'
  type: 'all' | 'home_visit' | 'clinic'
  service: 'all' | string
}

const NurseServices: React.FC<Props> = ({ patientData, onVideoCall }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    type: 'all',
    service: 'all'
  })
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const nurseServices = [
    'Blood pressure monitoring',
    'Medication administration',
    'Wound care and dressing',
    'Injection services',
    'Health assessment',
    'Post-surgery care',
    'Diabetes management',
    'Elderly care assistance',
    'Health education',
    'Vital signs monitoring'
  ]

  // Get unique services from actual bookings
  const services = Array.from(new Set(
    (patientData.nurseBookings || []).map(booking => booking.service)
  ))

  // Filter bookings
  const filteredBookings = (patientData.nurseBookings || []).filter(booking => {
    const matchesSearch = 
      booking.nurseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filters.status === 'all' || booking.status === filters.status
    const matchesType = filters.type === 'all' || booking.type === filters.type
    const matchesService = filters.service === 'all' || booking.service.includes(filters.service)

    return matchesSearch && matchesStatus && matchesType && matchesService
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <FaWaiting />
      case 'completed': return <FaCheckCircle />
      case 'cancelled': return <FaTimes />
      default: return <FaExclamationCircle />
    }
  }

  const renderBookingForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-pink-50 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-5 md:p-6 border-b border-pink-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Book Nurse Service</h3>
            <button
              onClick={() => setShowBookingForm(false)}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Service Selection */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Select Service</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {nurseServices.map((service, index) => (
                <button
                  key={index}
                  className="p-2.5 sm:p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg text-left hover:border-pink-300 hover:from-pink-100 hover:to-purple-100 transition"
                >
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">{service}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Select Nurse - Using PatientData */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Your Nurse</h4>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg">
                  PW
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 text-sm sm:text-base">Patricia Williams</h5>
                  <p className="text-xs sm:text-sm text-gray-600">Registered Nurse - Diabetes & Elderly Care Specialist</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs">
                      Diabetes Care
                    </span>
                    <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs">
                      Wound Management
                    </span>
                    <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs">
                      Elderly Care
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <input
                type="date"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <input
                type="time"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-sm">
                <option value="home_visit">Home Visit</option>
                <option value="clinic">Clinic Visit</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-sm">
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
            <textarea
              rows={3}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              placeholder="Any specific requirements or notes for the nurse..."
            ></textarea>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => setShowBookingForm(false)}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-lg hover:from-gray-200 hover:to-slate-200 transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition text-sm sm:text-base">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (!patientData.nurseBookings || patientData.nurseBookings.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Empty State */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center border border-pink-200">
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
            <FaUserNurse className="text-pink-500 text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Nurse Services</h3>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">Professional nursing care at your home or clinic</p>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base"
          >
            <FaPlus />
            Book Nurse Service
          </button>
        </div>

        {/* Available Services */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-pink-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center">
            <FaMedkit className="mr-2 text-pink-500" />
            Available Nursing Services
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {nurseServices.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-white/70 to-pink-50/70 border border-pink-200 rounded-lg sm:rounded-xl hover:border-pink-300 hover:from-pink-100 hover:to-purple-100 transition cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <FaStethoscope className="text-pink-600 text-sm sm:text-base" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">{service}</p>
                  <p className="text-xs text-gray-600">Professional nursing care</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showBookingForm && renderBookingForm()}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
              <FaUserNurse className="mr-2 sm:mr-3" />
              Nurse Services
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Professional nursing care and health support</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-center">
            <div className="bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{patientData.nurseBookings.length}</p>
              <p className="text-xs opacity-90">Total Services</p>
            </div>
            <div className="bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{patientData.nurseBookings.filter(b => b.status === 'upcoming').length}</p>
              <p className="text-xs opacity-90">Upcoming</p>
            </div>
            <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{patientData.nurseBookings.filter(b => b.status === 'completed').length}</p>
              <p className="text-xs opacity-90">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-gray-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-pink-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
            <input
              type="text"
              placeholder="Search nurses, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition text-sm sm:text-base"
            />
          </div>

          <button
            onClick={() => setShowBookingForm(true)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-pink-600 hover:to-pink-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaPlus />
            <span className="hidden sm:inline">Book Service</span>
          </button>

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
          <div className="mt-4 pt-4 border-t border-pink-200 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterOptions['type'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-sm sm:text-base"
            >
              <option value="all">All Types</option>
              <option value="home_visit">Home Visit</option>
              <option value="clinic">Clinic Visit</option>
            </select>

            <select
              value={filters.service}
              onChange={(e) => setFilters({ ...filters, service: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-sm sm:text-base"
            >
              <option value="all">All Services</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Bookings List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredBookings.map((booking) => (
          <div 
            key={booking.id} 
            className="bg-gradient-to-br from-white to-pink-50/30 rounded-xl sm:rounded-2xl shadow-lg border border-pink-200 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                {/* Booking Info */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                    {booking.nurseName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{booking.nurseName}</h3>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-pink-500" />
                        <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-blue-500" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {booking.type === 'home_visit' ? (
                          <>
                            <FaHome className="text-green-500" />
                            <span>Home Visit</span>
                          </>
                        ) : (
                          <>
                            <FaHospital className="text-orange-500" />
                            <span>Clinic Visit</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUserNurse className="text-purple-500" />
                        <span>ID: {booking.nurseId}</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <p className="text-xs sm:text-sm font-medium text-pink-800 mb-1">Service:</p>
                      <p className="text-pink-700 text-xs sm:text-sm">{booking.service}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:flex-shrink-0">
                  {booking.status === 'upcoming' && (
                    <>
                      <button
                        onClick={onVideoCall}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-lg hover:from-green-100 hover:to-emerald-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <FaVideo />
                        <span className="hidden sm:inline">Video Call</span>
                      </button>
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <FaComments />
                        <span className="hidden sm:inline">Message</span>
                      </button>
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-600 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <FaEdit />
                        <span className="hidden sm:inline">Reschedule</span>
                      </button>
                    </>
                  )}
                  
                  <button 
                    onClick={() => setExpandedBooking(
                      expandedBooking === booking.id ? null : booking.id
                    )}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 rounded-lg hover:from-gray-100 hover:to-slate-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                  >
                    <FaEye />
                    <span className="hidden sm:inline">{expandedBooking === booking.id ? 'Less' : 'Details'}</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-pink-50 rounded-lg sm:rounded-xl">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes:</p>
                  <p className="text-gray-600 text-xs sm:text-sm italic">{booking.notes}</p>
                </div>
              )}

              {/* Expanded Details */}
              {expandedBooking === booking.id && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-pink-200 space-y-3 sm:space-y-4">
                  <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 md:gap-6">
                    {/* Nurse Information */}
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h4 className="font-semibold text-pink-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <FaUserNurse className="mr-2" />
                        Nurse Information
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-pink-700">Name:</span>
                          <span className="font-medium">{booking.nurseName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-pink-700">Nurse ID:</span>
                          <span className="font-medium">{booking.nurseId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-pink-700">Service Type:</span>
                          <span className="font-medium capitalize">{booking.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h4 className="font-semibold text-blue-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <FaMedkit className="mr-2" />
                        Service Details
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Date & Time:</span>
                          <span className="font-medium">{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Status:</span>
                          <span className="font-medium capitalize">{booking.status}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Service:</span>
                          <p className="font-medium mt-1">{booking.service}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg hover:from-green-200 hover:to-emerald-200 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <FaDownload />
                      Download Report
                    </button>
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <FaShare />
                      Share with Doctor
                    </button>
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-pink-200 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <FaFileAlt />
                      View Care Plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-pink-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-lg border border-pink-200">
            <FaSearch className="text-gray-400 text-2xl sm:text-3xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">No nurse services found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setFilters({ status: 'all', type: 'all', service: 'all' })
              }}
              className="mt-3 text-pink-600 hover:underline text-sm sm:text-base"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Nurse Chat Messages */}
      {patientData.chatHistory?.nurses && patientData.chatHistory.nurses.length > 0 && (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-pink-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FaComments className="mr-2 text-pink-500" />
            Recent Nurse Communications
          </h3>
          <div className="space-y-2.5 sm:space-y-3">
            {patientData.chatHistory.nurses.map((nurseChat) => (
              <div key={nurseChat.nurseId} className="bg-gradient-to-r from-white/70 to-pink-50/70 border border-pink-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {nurseChat.nurseName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{nurseChat.nurseName}</h4>
                      <p className="text-xs text-gray-500">{nurseChat.lastMessageTime}</p>
                    </div>
                  </div>
                  {nurseChat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full">
                      {nurseChat.unreadCount} unread
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 bg-gradient-to-r from-white to-pink-50 rounded-lg p-2.5 sm:p-3 border border-pink-100">
                  {nurseChat.lastMessage}
                </p>
                <div className="mt-2 sm:mt-3 flex gap-2">
                  <button className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded text-xs hover:from-pink-600 hover:to-rose-700 transition">
                    Reply
                  </button>
                  <button className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded text-xs hover:from-green-600 hover:to-emerald-700 transition">
                    Video Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button 
            onClick={() => setShowBookingForm(true)}
            className="bg-gradient-to-br from-pink-400/20 to-purple-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-pink-400/30 hover:to-purple-400/30 transition text-left"
          >
            <FaCalendarPlus className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm md:text-base">Book Service</p>
            <p className="text-xs opacity-80">Schedule visit</p>
          </button>
          
          <button className="bg-gradient-to-br from-red-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-red-400/30 hover:to-pink-400/30 transition text-left">
            <FaUserClock className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm md:text-base">Emergency</p>
            <p className="text-xs opacity-80">24/7 available</p>
          </button>
          
          <button className="bg-gradient-to-br from-blue-400/20 to-indigo-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-blue-400/30 hover:to-indigo-400/30 transition text-left">
            <FaClipboardList className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm md:text-base">Care Plans</p>
            <p className="text-xs opacity-80">View plans</p>
          </button>
          
          <button className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-green-400/30 hover:to-emerald-400/30 transition text-left">
            <FaHistory className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm md:text-base">History</p>
            <p className="text-xs opacity-80">Past services</p>
          </button>
        </div>
      </div>

      {showBookingForm && renderBookingForm()}
    </div>
  )
}

export default NurseServices