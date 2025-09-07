import React, { useState } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaUserNurse, 
  FaCalendarAlt, 
  FaClock, 
  FaHome, 
  FaHospital, 
  FaNotesMedical,
  FaVideo,
  FaComments,
  FaPhone,
  FaMapMarkerAlt,
  FaStethoscope,
  FaSyringe,
  FaPills,
  FaHeartbeat,
  FaPlus,
  FaFilter,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock as FaWaiting,
  FaTimes,
  FaStar,
  FaThumbsUp,
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
  FaCertificate,
  FaAward,
  FaGraduationCap
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

  // Sample nurse data for booking
  const availableNurses = [
    {
      id: 'NUR001',
      name: 'Patricia Williams',
      specialties: ['Diabetes Care', 'Wound Management', 'Elderly Care'],
      experience: '8 years',
      rating: 4.9,
      image: '/images/nurses/1.jpg',
      certifications: ['RN', 'CDE', 'Wound Care Specialist'],
      availability: 'Available today'
    },
    {
      id: 'NUR002',
      name: 'Jennifer Adams',
      specialties: ['Prenatal Care', 'Pediatric Nursing', 'Health Education'],
      experience: '12 years',
      rating: 4.8,
      image: '/images/nurses/2.jpg',
      certifications: ['RN', 'CNM', 'Lactation Consultant'],
      availability: 'Available tomorrow'
    },
    {
      id: 'NUR003',
      name: 'Margaret Smith',
      specialties: ['Medication Management', 'Post-op Care', 'Chronic Disease'],
      experience: '15 years',
      rating: 4.9,
      image: '/images/nurses/3.jpg',
      certifications: ['RN', 'MSN', 'Clinical Specialist'],
      availability: 'Available this week'
    }
  ]

  // Get unique services
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
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Book Nurse Service</h3>
            <button
              onClick={() => setShowBookingForm(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Service Selection */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Select Service</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {nurseServices.map((service, index) => (
                <button
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <p className="font-medium text-gray-900">{service}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Available Nurses */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Choose Your Nurse</h4>
            <div className="space-y-4">
              {availableNurses.map((nurse) => (
                <div key={nurse.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {nurse.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-semibold text-gray-900">{nurse.name}</h5>
                          <p className="text-sm text-gray-600">{nurse.experience} experience</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <FaStar className="text-yellow-500 text-sm" />
                            <span className="font-medium text-gray-900">{nurse.rating}</span>
                          </div>
                          <p className="text-xs text-green-600">{nurse.availability}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {nurse.specialties.map((specialty, index) => (
                            <span key={index} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {nurse.certifications.map((cert, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1">
                              <FaCertificate className="text-xs" />
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                        Select {nurse.name}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500">
                <option value="home_visit">Home Visit</option>
                <option value="clinic">Clinic Visit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500">
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              placeholder="Any specific requirements or notes for the nurse..."
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowBookingForm(false)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (!patientData.nurseBookings || patientData.nurseBookings.length === 0) {
    return (
      <div className="space-y-6">
        {/* Empty State */}
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center border border-gray-100">
          <div className="bg-pink-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FaUserNurse className="text-pink-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Nurse Services</h3>
          <p className="text-gray-500 mb-6">Professional nursing care at your home or clinic</p>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <FaPlus />
            Book Nurse Service
          </button>
        </div>

        {/* Available Services */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaMedkit className="mr-2 text-pink-500" />
            Available Nursing Services
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nurseServices.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition cursor-pointer">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <FaStethoscope className="text-pink-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{service}</p>
                  <p className="text-sm text-gray-600">Professional nursing care</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Nurses */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <FaAward className="mr-2 text-yellow-500" />
            Our Featured Nurses
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableNurses.map((nurse) => (
              <div key={nurse.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                    {nurse.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="font-semibold text-gray-900">{nurse.name}</h4>
                  <p className="text-sm text-gray-600">{nurse.experience} experience</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <FaStar className="text-yellow-500 text-sm" />
                    <span className="font-medium text-gray-900">{nurse.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {nurse.specialties.slice(0, 2).map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowBookingForm(true)}
                    className="w-full px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm"
                  >
                    Book with {nurse.name.split(' ')[0]}
                  </button>
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
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <FaUserNurse className="mr-3" />
              Nurse Services
            </h2>
            <p className="opacity-90">Professional nursing care and health support</p>
          </div>
          <div className="mt-4 md:mt-0 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{patientData.nurseBookings.length}</p>
              <p className="text-xs opacity-80">Total Services</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{patientData.nurseBookings.filter(b => b.status === 'upcoming').length}</p>
              <p className="text-xs opacity-80">Upcoming</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{patientData.nurseBookings.filter(b => b.status === 'completed').length}</p>
              <p className="text-xs opacity-80">Completed</p>
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
              placeholder="Search nurses, services, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
            />
          </div>

          <button
            onClick={() => setShowBookingForm(true)}
            className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition flex items-center gap-2"
          >
            <FaPlus />
            Book Service
          </button>

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
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterOptions['type'] })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
            >
              <option value="all">All Types</option>
              <option value="home_visit">Home Visit</option>
              <option value="clinic">Clinic Visit</option>
            </select>

            <select
              value={filters.service}
              onChange={(e) => setFilters({ ...filters, service: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
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
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div 
            key={booking.id} 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Booking Info */}
                <div className="flex items-start gap-4 mb-4 lg:mb-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {booking.nurseName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{booking.nurseName}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-pink-500" />
                        <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
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

                    <div className="bg-pink-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-pink-800 mb-1">Service:</p>
                      <p className="text-pink-700">{booking.service}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {booking.status === 'upcoming' && (
                    <>
                      <button
                        onClick={onVideoCall}
                        className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition flex items-center gap-2"
                      >
                        <FaVideo />
                        Video Call
                      </button>
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2">
                        <FaComments />
                        Message
                      </button>
                      <button className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition flex items-center gap-2">
                        <FaEdit />
                        Reschedule
                      </button>
                    </>
                  )}
                  
                  <button 
                    onClick={() => setExpandedBooking(
                      expandedBooking === booking.id ? null : booking.id
                    )}
                    className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                  >
                    <FaEye />
                    {expandedBooking === booking.id ? 'Less' : 'Details'}
                  </button>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                  <p className="text-gray-600 text-sm italic">{booking.notes}</p>
                </div>
              )}

              {/* Expanded Details */}
              {expandedBooking === booking.id && (
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Nurse Information */}
                    <div className="bg-pink-50 rounded-xl p-4">
                      <h4 className="font-semibold text-pink-800 mb-3 flex items-center">
                        <FaUserNurse className="mr-2" />
                        Nurse Information
                      </h4>
                      <div className="space-y-2 text-sm">
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
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <FaMedkit className="mr-2" />
                        Service Details
                      </h4>
                      <div className="space-y-2 text-sm">
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
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center gap-2">
                      <FaDownload />
                      Download Report
                    </button>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center gap-2">
                      <FaShare />
                      Share with Doctor
                    </button>
                    <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition flex items-center gap-2">
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
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
            <FaSearch className="text-gray-400 text-3xl mx-auto mb-3" />
            <p className="text-gray-500">No nurse services found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setFilters({ status: 'all', type: 'all', service: 'all' })
              }}
              className="mt-3 text-pink-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Nurse Chat Messages */}
      {patientData.chatHistory?.nurses && patientData.chatHistory.nurses.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaComments className="mr-2 text-pink-500" />
            Recent Nurse Communications
          </h3>
          <div className="space-y-3">
            {patientData.chatHistory.nurses.map((nurseChat) => (
              <div key={nurseChat.nurseId} className="border border-gray-200 rounded-xl p-4 bg-pink-50 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {nurseChat.nurseName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{nurseChat.nurseName}</h4>
                      <p className="text-xs text-gray-500">{nurseChat.lastMessageTime}</p>
                    </div>
                  </div>
                  {nurseChat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {nurseChat.unreadCount} unread
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border">
                  {nurseChat.lastMessage}
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 bg-pink-500 text-white rounded text-xs hover:bg-pink-600 transition">
                    Reply
                  </button>
                  <button className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition">
                    Video Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowBookingForm(true)}
            className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left"
          >
            <FaCalendarPlus className="text-2xl mb-2" />
            <p className="font-medium">Book New Service</p>
            <p className="text-sm opacity-80">Schedule nurse visit</p>
          </button>
          
          <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left">
            <FaUserClock className="text-2xl mb-2" />
            <p className="font-medium">Emergency Nurse</p>
            <p className="text-sm opacity-80">24/7 availability</p>
          </button>
          
          <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left">
            <FaClipboardList className="text-2xl mb-2" />
            <p className="font-medium">Care Plans</p>
            <p className="text-sm opacity-80">View treatment plans</p>
          </button>
          
          <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition text-left">
            <FaHistory className="text-2xl mb-2" />
            <p className="font-medium">Service History</p>
            <p className="text-sm opacity-80">View all past services</p>
          </button>
        </div>
      </div>

      {showBookingForm && renderBookingForm()}
    </div>
  )
}

export default NurseServices