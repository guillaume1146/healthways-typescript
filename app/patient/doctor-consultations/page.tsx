// app/patient/doctor-consultations/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  FaCalendarAlt,
  FaVideo,
  FaUser,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaArrowLeft,
  FaEye,
  FaTimes,
  FaRedo,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPrescriptionBottle,
  FaStar
} from "react-icons/fa"

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  hospital: string;
}

interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
  endTime: string;
  type: "video" | "in-person";
  status: "upcoming" | "completed" | "cancelled" | "no-show" | "rescheduled";
  location: string;
  reason: string;
  notes: string;
  prescription: boolean;
  followUpRequired: boolean;
  amount: number;
  isPaid: boolean;
  rating: number | null;
  canCancel: boolean;
  canReschedule: boolean;
  meetingLink?: string;
}

interface FilterOptions {
  status: string;
  type: string;
  dateRange: string;
  doctor: string;
  sortBy: string;
}

interface Stats {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

const mockAppointments: Appointment[] = [
  {
    id: "APT-2024-001",
    doctor: {
      id: "D001",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      avatar: "👩‍⚕️",
      rating: 4.8,
      hospital: "Apollo Bramwell Hospital"
    },
    date: "2024-01-20",
    time: "10:00 AM",
    endTime: "10:30 AM",
    type: "video",
    status: "upcoming",
    location: "Virtual Consultation",
    reason: "Follow-up consultation",
    notes: "Please have your recent blood pressure readings ready",
    prescription: false,
    followUpRequired: false,
    amount: 2500,
    isPaid: true,
    rating: null,
    canCancel: true,
    canReschedule: true,
    meetingLink: "https://meet.healthways.mu/dr-johnson-apt001"
  },
  {
    id: "APT-2024-002",
    doctor: {
      id: "D002",
      name: "Dr. Michael Chen",
      specialty: "General Medicine",
      avatar: "👨‍⚕️",
      rating: 4.7,
      hospital: "Wellkin Hospital"
    },
    date: "2024-01-18",
    time: "2:30 PM",
    endTime: "3:00 PM",
    type: "in-person",
    status: "upcoming",
    location: "Wellkin Hospital, Moka",
    reason: "Annual checkup",
    notes: "Fasting required for blood tests",
    prescription: false,
    followUpRequired: false,
    amount: 1500,
    isPaid: false,
    rating: null,
    canCancel: true,
    canReschedule: true
  },
  {
    id: "APT-2024-003",
    doctor: {
      id: "D001",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      avatar: "👩‍⚕️",
      rating: 4.8,
      hospital: "Apollo Bramwell Hospital"
    },
    date: "2024-01-10",
    time: "11:00 AM",
    endTime: "11:30 AM",
    type: "video",
    status: "completed",
    location: "Virtual Consultation",
    reason: "Chest pain evaluation",
    notes: "ECG normal, prescribed medication for management",
    prescription: true,
    followUpRequired: true,
    amount: 2500,
    isPaid: true,
    rating: 5,
    canCancel: false,
    canReschedule: false
  },
  {
    id: "APT-2024-004",
    doctor: {
      id: "D003",
      name: "Dr. Priya Sharma",
      specialty: "Dermatology",
      avatar: "👩‍⚕️",
      rating: 4.9,
      hospital: "Fortis Clinique Darné"
    },
    date: "2024-01-05",
    time: "4:00 PM",
    endTime: "4:30 PM",
    type: "in-person",
    status: "completed",
    location: "Fortis Clinique Darné, Floreal",
    reason: "Skin allergy treatment",
    notes: "Prescribed topical medications, avoid allergens",
    prescription: true,
    followUpRequired: false,
    amount: 2000,
    isPaid: true,
    rating: 4,
    canCancel: false,
    canReschedule: false
  },
  {
    id: "APT-2024-005",
    doctor: {
      id: "D004",
      name: "Dr. Ahmed Hassan",
      specialty: "Orthopedics",
      avatar: "👨‍⚕️",
      rating: 4.6,
      hospital: "City Hospital"
    },
    date: "2024-01-08",
    time: "9:00 AM",
    endTime: "9:30 AM",
    type: "in-person",
    status: "cancelled",
    location: "City Hospital, Port Louis",
    reason: "Knee pain consultation",
    notes: "Patient cancelled due to scheduling conflict",
    prescription: false,
    followUpRequired: false,
    amount: 2200,
    isPaid: false,
    rating: null,
    canCancel: false,
    canReschedule: false
  },
  {
    id: "APT-2024-006",
    doctor: {
      id: "D002",
      name: "Dr. Michael Chen",
      specialty: "General Medicine",
      avatar: "👨‍⚕️",
      rating: 4.7,
      hospital: "Wellkin Hospital"
    },
    date: "2023-12-20",
    time: "10:30 AM",
    endTime: "11:00 AM",
    type: "video",
    status: "completed",
    location: "Virtual Consultation",
    reason: "Flu symptoms",
    notes: "Viral infection, rest and hydration recommended",
    prescription: true,
    followUpRequired: false,
    amount: 1500,
    isPaid: true,
    rating: null,
    canCancel: false,
    canReschedule: false
  }
]

export default function DoctorConsultationsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    type: "all",
    dateRange: "all",
    doctor: "all",
    sortBy: "date-desc"
  })

  // Calculate stats
  const stats: Stats = {
    total: appointments.length,
    upcoming: appointments.filter(apt => apt.status === "upcoming").length,
    completed: appointments.filter(apt => apt.status === "completed").length,
    cancelled: appointments.filter(apt => apt.status === "cancelled").length
  }

  // Get unique doctors for filter
  const uniqueDoctors = Array.from(new Set(appointments.map(apt => apt.doctor.name)))

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filters.status === "all" || apt.status === filters.status
    const matchesType = filters.type === "all" || apt.type === filters.type
    const matchesDoctor = filters.doctor === "all" || apt.doctor.name === filters.doctor
    
    // Date range filter
    let matchesDate = true
    if (filters.dateRange !== "all") {
      const aptDate = new Date(apt.date)
      const today = new Date()
      
      switch (filters.dateRange) {
        case "today":
          matchesDate = aptDate.toDateString() === today.toDateString()
          break
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = aptDate >= weekAgo && aptDate <= today
          break
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = aptDate >= monthAgo && aptDate <= today
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDoctor && matchesDate
  })

  // Sort appointments
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    switch (filters.sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "doctor":
        return a.doctor.name.localeCompare(b.doctor.name)
      default:
        return 0
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      case "no-show": return "bg-gray-100 text-gray-800"
      case "rescheduled": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming": return <FaClock className="text-blue-500" />
      case "completed": return <FaCheckCircle className="text-green-500" />
      case "cancelled": return <FaTimes className="text-red-500" />
      case "no-show": return <FaExclamationTriangle className="text-gray-500" />
      case "rescheduled": return <FaRedo className="text-yellow-500" />
      default: return null
    }
  }

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailModal(true)
  }

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowCancelModal(true)
  }

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowRescheduleModal(true)
  }

  const confirmCancel = () => {
    if (selectedAppointment) {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: "cancelled" as const, canCancel: false, canReschedule: false }
            : apt
        )
      )
      setShowCancelModal(false)
      setSelectedAppointment(null)
    }
  }

  const handleRateAppointment = (appointment: Appointment, rating: number) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointment.id 
          ? { ...apt, rating }
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
              <Link href="/patient/dashboard" className="text-gray-600 hover:text-primary-blue">
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Consultations</h1>
                <p className="text-gray-600">Manage all your doctor appointments</p>
              </div>
            </div>
            <Link href="/patient/doctor-consultations/book" className="btn-gradient px-6 py-2 flex items-center gap-2">
              <FaPlus />
              Book New Consultation
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FaCalendarAlt className="text-gray-400 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <FaClock className="text-blue-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <FaTimes className="text-red-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by doctor, specialty, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:border-primary-blue"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
            >
              <option value="all">All Types</option>
              <option value="video">Video Call</option>
              <option value="in-person">In-Person</option>
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <select
              value={filters.doctor}
              onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
            >
              <option value="all">All Doctors</option>
              {uniqueDoctors.map(doctor => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="doctor">By Doctor</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {sortedAppointments.length > 0 ? (
            sortedAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Doctor Avatar */}
                      <div className="text-4xl">{appointment.doctor.avatar}</div>
                      
                      {/* Appointment Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{appointment.doctor.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </span>
                          {appointment.type === "video" ? (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              <FaVideo className="inline mr-1" />
                              Video Call
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              <FaUser className="inline mr-1" />
                              In-Person
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-2">{appointment.doctor.specialty} • {appointment.doctor.hospital}</p>
                        
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            <span>{new Date(appointment.date).toLocaleDateString("en-GB", { 
                              weekday: "short", 
                              day: "numeric", 
                              month: "short", 
                              year: "numeric" 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className="text-gray-400" />
                            <span>{appointment.time} - {appointment.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span>{appointment.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Reason:</span>
                            <span>{appointment.reason}</span>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <p className="text-sm text-gray-500 italic mb-3">Note: {appointment.notes}</p>
                        )}
                        
                        {/* Additional Info Badges */}
                        <div className="flex flex-wrap gap-2">
                          {appointment.prescription && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              <FaPrescriptionBottle className="inline mr-1" />
                              Prescription Available
                            </span>
                          )}
                          {appointment.followUpRequired && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                              Follow-up Required
                            </span>
                          )}
                          {appointment.isPaid ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              Paid: Rs {appointment.amount}
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                              Payment Pending: Rs {appointment.amount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        <FaEye className="inline mr-1" />
                        View
                      </button>
                      
                      {appointment.status === "upcoming" && (
                        <>
                          {appointment.type === "video" && appointment.meetingLink && (
                            <a
                              href={appointment.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm text-center"
                            >
                              <FaVideo className="inline mr-1" />
                              Join
                            </a>
                          )}
                          {appointment.canReschedule && (
                            <button
                              onClick={() => handleReschedule(appointment)}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                            >
                              <FaRedo className="inline mr-1" />
                              Reschedule
                            </button>
                          )}
                          {appointment.canCancel && (
                            <button
                              onClick={() => handleCancelAppointment(appointment)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                            >
                              <FaTimes className="inline mr-1" />
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                      
                      {appointment.status === "completed" && (
                        <>
                          {appointment.prescription && (
                            <button className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 text-sm">
                              <FaPrescriptionBottle className="inline mr-1" />
                              Prescription
                            </button>
                          )}
                          {!appointment.rating && (
                            <div className="flex items-center gap-1 p-2 border rounded-lg">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => handleRateAppointment(appointment, star)}
                                  className="text-gray-300 hover:text-yellow-500"
                                >
                                  <FaStar />
                                </button>
                              ))}
                            </div>
                          )}
                          {appointment.rating && (
                            <div className="flex items-center gap-1 p-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={star <= (appointment.rating ?? 0) ? "text-yellow-500" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg p-12 text-center">
              <FaCalendarAlt className="text-gray-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No appointments found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || filters.status !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "You have no appointments scheduled"}
              </p>
              <Link href="/patient/doctor-consultations/book" className="btn-gradient px-6 py-3 inline-block">
                <FaPlus className="inline mr-2" />
                Book Your First Consultation
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Appointment Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl">{selectedAppointment.doctor.avatar}</div>
                <div>
                  <h3 className="font-semibold">{selectedAppointment.doctor.name}</h3>
                  <p className="text-gray-600">{selectedAppointment.doctor.specialty}</p>
                  <p className="text-sm text-gray-500">{selectedAppointment.doctor.hospital}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">{new Date(selectedAppointment.date).toLocaleDateString()} • {selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium capitalize">{selectedAppointment.type.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{selectedAppointment.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reason</p>
                  <p className="font-medium">{selectedAppointment.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">Rs {selectedAppointment.amount}</p>
                </div>
              </div>
              
              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="font-medium">{selectedAppointment.notes}</p>
                </div>
              )}
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedAppointment.status === "upcoming" && selectedAppointment.type === "video" && selectedAppointment.meetingLink && (
                  <a
                    href={selectedAppointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-gradient py-2 text-center"
                  >
                    Join Video Call
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-xl" />
              <h3 className="text-lg font-semibold">Cancel Appointment?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your appointment with {selectedAppointment.doctor.name} on {new Date(selectedAppointment.date).toLocaleDateString()}?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Note: Cancellation fees may apply if cancelled within 24 hours of the appointment.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            <p className="text-gray-600 mb-6">
              Select a new date and time for your appointment with {selectedAppointment.doctor.name}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">New Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">New Time</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue">
                  <option>09:00 AM</option>
                  <option>09:30 AM</option>
                  <option>10:00 AM</option>
                  <option>10:30 AM</option>
                  <option>11:00 AM</option>
                  <option>02:00 PM</option>
                  <option>02:30 PM</option>
                  <option>03:00 PM</option>
                  <option>03:30 PM</option>
                  <option>04:00 PM</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRescheduleModal(false)
                  // Handle reschedule logic
                }}
                className="flex-1 btn-gradient py-2"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}