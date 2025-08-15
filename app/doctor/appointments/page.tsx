// File: app/doctor/appointments/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaCalendarAlt, 
  FaVideo, 
  FaUser, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPhone,
  FaComments,
  FaCheck,
  FaTimes,
  FaRedo,
  FaEye,
  FaPrescriptionBottle,
  FaFilter,
  FaSearch,
  FaPlus,
  FaArrowLeft,
  FaBell,
  FaExclamationTriangle
} from 'react-icons/fa'

// Mock data for static prototype
const mockAppointments = [
  {
    id: 'APT001',
    patient: {
      name: 'John Smith',
      age: 45,
      avatar: 'JS',
      phone: '+230 123 4567',
      email: 'john.smith@email.com'
    },
    datetime: '2024-01-15T09:00:00',
    duration: 30,
    type: 'video',
    status: 'upcoming',
    complaint: 'Chest pain and shortness of breath',
    location: 'Apollo Bramwell Hospital',
    isNewPatient: false,
    lastVisit: '2023-12-10',
    notes: 'Follow-up consultation for cardiac evaluation'
  },
  {
    id: 'APT002',
    patient: {
      name: 'Maria Garcia',
      age: 38,
      avatar: 'MG',
      phone: '+230 234 5678',
      email: 'maria.garcia@email.com'
    },
    datetime: '2024-01-15T10:30:00',
    duration: 45,
    type: 'in-person',
    status: 'upcoming',
    complaint: 'Routine cardiac checkup',
    location: 'Apollo Bramwell Hospital',
    isNewPatient: true,
    notes: 'First-time consultation, family history of heart disease'
  },
  {
    id: 'APT003',
    patient: {
      name: 'David Chen',
      age: 52,
      avatar: 'DC',
      phone: '+230 345 6789',
      email: 'david.chen@email.com'
    },
    datetime: '2024-01-15T14:00:00',
    duration: 30,
    type: 'video',
    status: 'upcoming',
    complaint: 'Hypertension management',
    location: 'Virtual Consultation',
    isNewPatient: false,
    lastVisit: '2023-11-20',
    notes: 'Medication review and blood pressure monitoring'
  },
  {
    id: 'APT004',
    patient: {
      name: 'Emma Wilson',
      age: 29,
      avatar: 'EW',
      phone: '+230 456 7890',
      email: 'emma.wilson@email.com'
    },
    datetime: '2024-01-15T15:30:00',
    duration: 30,
    type: 'in-person',
    status: 'upcoming',
    complaint: 'Pre-pregnancy cardiac screening',
    location: 'Private Clinic, Rose Hill',
    isNewPatient: true,
    notes: 'Comprehensive cardiac assessment before pregnancy'
  },
  {
    id: 'APT005',
    patient: {
      name: 'Robert Brown',
      age: 60,
      avatar: 'RB',
      phone: '+230 567 8901',
      email: 'robert.brown@email.com'
    },
    datetime: '2024-01-14T16:00:00',
    duration: 45,
    type: 'in-person',
    status: 'completed',
    complaint: 'Post-surgery follow-up',
    location: 'Apollo Bramwell Hospital',
    isNewPatient: false,
    lastVisit: '2024-01-14',
    notes: 'Post-operative cardiac catheterization follow-up'
  }
]

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [selectedDate, setSelectedDate] = useState('2024-01-15')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'video' ? FaVideo : FaUser
  }

  const filteredAppointments = appointments.filter(apt => {
    const matchesDate = apt.datetime.startsWith(selectedDate)
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus
    const matchesType = filterType === 'all' || apt.type === filterType
    const matchesSearch = apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.complaint.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesDate && matchesStatus && matchesType && matchesSearch
  })

  const handleStartConsultation = (appointmentId: string) => {
    console.log('Starting consultation for:', appointmentId)
    // In real app, this would redirect to consultation interface
  }

  const handleReschedule = (appointmentId: string) => {
    console.log('Rescheduling appointment:', appointmentId)
    // In real app, this would open rescheduling modal
  }

  const handleCancel = (appointmentId: string) => {
    console.log('Cancelling appointment:', appointmentId)
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' }
          : apt
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/doctor/dashboard" className="text-gray-600 hover:text-primary-blue">
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-600">Manage your patient consultations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-primary-blue">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </button>
              <Link href="/doctor/availability" className="btn-gradient px-6 py-2">
                <FaPlus className="inline mr-2" />
                Set Availability
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
              >
                <option value="all">All Types</option>
                <option value="video">Video Call</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:border-primary-blue"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredAppointments.filter(apt => apt.status === 'upcoming').length}
                </p>
              </div>
              <FaCalendarAlt className="text-blue-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAppointments.filter(apt => apt.status === 'completed').length}
                </p>
              </div>
              <FaCheck className="text-green-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Video Calls</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredAppointments.filter(apt => apt.type === 'video').length}
                </p>
              </div>
              <FaVideo className="text-purple-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">New Patients</p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredAppointments.filter(apt => apt.isNewPatient).length}
                </p>
              </div>
              <FaUser className="text-orange-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => {
              const TypeIcon = getTypeIcon(appointment.type)
              const appointmentTime = new Date(appointment.datetime)
              
              return (
                <div key={appointment.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Patient Avatar */}
                      <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-semibold">
                        {appointment.patient.avatar}
                      </div>
                      
                      {/* Appointment Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {appointment.patient.name}
                              </h3>
                              {appointment.isNewPatient && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                  New Patient
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">Age: {appointment.patient.age} • ID: {appointment.id}</p>
                          </div>
                        </div>
                        
                        {/* Time and Type */}
                        <div className="flex items-center gap-6 mb-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaClock />
                            <span>{appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>({appointment.duration} min)</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <TypeIcon />
                            <span className="capitalize">{appointment.type.replace('-', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaMapMarkerAlt />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                        
                        {/* Complaint */}
                        <div className="mb-3">
                          <p className="text-gray-700">
                            <span className="font-medium">Chief Complaint:</span> {appointment.complaint}
                          </p>
                          {appointment.notes && (
                            <p className="text-gray-600 text-sm mt-1">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </p>
                          )}
                        </div>
                        
                        {/* Contact Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FaPhone />
                            <span>{appointment.patient.phone}</span>
                          </div>
                          {appointment.lastVisit && (
                            <div>
                              <span>Last visit: {new Date(appointment.lastVisit).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      {appointment.status === 'upcoming' && (
                        <>
                          {appointment.type === 'video' ? (
                            <button 
                              onClick={() => handleStartConsultation(appointment.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition"
                            >
                              <FaVideo />
                              Join Call
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStartConsultation(appointment.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition"
                            >
                              <FaUser />
                              Start Visit
                            </button>
                          )}
                          
                          <button 
                            onClick={() => setSelectedAppointment(appointment)}
                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                          >
                            <FaEye className="inline mr-1" />
                            View
                          </button>
                          
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleReschedule(appointment.id)}
                              className="border border-yellow-300 text-yellow-700 px-3 py-2 rounded-lg text-sm hover:bg-yellow-50 transition"
                              title="Reschedule"
                            >
                              <FaRedo />
                            </button>
                            <button 
                              onClick={() => handleCancel(appointment.id)}
                              className="border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm hover:bg-red-50 transition"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </>
                      )}
                      
                      {appointment.status === 'completed' && (
                        <div className="space-y-2">
                          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition">
                            <FaPrescriptionBottle />
                            Prescriptions
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                            <FaComments className="inline mr-1" />
                            Notes
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <FaCalendarAlt className="text-gray-400 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No appointments found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? 'Try adjusting your search criteria' : 'No appointments scheduled for the selected date'}
              </p>
              <Link href="/doctor/availability" className="btn-gradient px-6 py-3">
                <FaPlus className="inline mr-2" />
                Set Your Availability
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Detail Modal (Simple overlay for demo) */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Appointment Details</h2>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Modal content would go here */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Patient Information</h3>
                <p><strong>Name:</strong> {selectedAppointment.patient.name}</p>
                <p><strong>Age:</strong> {selectedAppointment.patient.age}</p>
                <p><strong>Phone:</strong> {selectedAppointment.patient.phone}</p>
                <p><strong>Email:</strong> {selectedAppointment.patient.email}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Appointment Details</h3>
                <p><strong>Date & Time:</strong> {new Date(selectedAppointment.datetime).toLocaleString()}</p>
                <p><strong>Type:</strong> {selectedAppointment.type}</p>
                <p><strong>Duration:</strong> {selectedAppointment.duration} minutes</p>
                <p><strong>Location:</strong> {selectedAppointment.location}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Medical Information</h3>
                <p><strong>Chief Complaint:</strong> {selectedAppointment.complaint}</p>
                {selectedAppointment.notes && (
                  <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="flex-1 btn-gradient py-2">
                Start Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments