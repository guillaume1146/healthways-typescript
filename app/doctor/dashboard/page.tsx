// app/doctor/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaDollarSign, 
  FaStar, 
  FaVideo, 
  FaPrescriptionBottle,
  FaChartLine,
  FaClock,
  FaBell,
  FaSearch,
  FaUserPlus,
  FaHistory,
  FaNotesMedical,
  FaPhoneAlt,
  FaEnvelope,
  FaEllipsisV
} from 'react-icons/fa'
import { useDoctorStore } from '../lib/data-store'

// Mock data for demonstration
const mockPatients = [
  {
    id: 'pat-001',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    email: 'john.smith@email.com',
    phone: '+230 5123 4567',
    avatar: 'JS',
    lastVisit: '2024-01-10',
    upcomingAppointment: '2024-01-20 10:00',
    totalVisits: 12,
    prescriptions: 8,
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin']
  },
  {
    id: 'pat-002',
    name: 'Maria Garcia',
    age: 38,
    gender: 'Female',
    email: 'maria.garcia@email.com',
    phone: '+230 5234 5678',
    avatar: 'MG',
    lastVisit: '2024-01-08',
    upcomingAppointment: '2024-01-22 14:00',
    totalVisits: 5,
    prescriptions: 3,
    medicalHistory: ['Asthma'],
    allergies: []
  },
  {
    id: 'pat-003',
    name: 'David Chen',
    age: 52,
    gender: 'Male',
    email: 'david.chen@email.com',
    phone: '+230 5345 6789',
    avatar: 'DC',
    lastVisit: '2024-01-05',
    upcomingAppointment: null,
    totalVisits: 20,
    prescriptions: 15,
    medicalHistory: ['Cardiac Arrhythmia', 'Hypertension'],
    allergies: ['Sulfa drugs']
  },
  {
    id: 'pat-004',
    name: 'Emma Wilson',
    age: 29,
    gender: 'Female',
    email: 'emma.wilson@email.com',
    phone: '+230 5456 7890',
    avatar: 'EW',
    lastVisit: '2024-01-12',
    upcomingAppointment: '2024-01-25 09:00',
    totalVisits: 3,
    prescriptions: 2,
    medicalHistory: [],
    allergies: ['Latex']
  }
]

export default function EnhancedDoctorDashboard() {
  const { profile, patients, appointments, setSelectedPatient, addPatient } = useDoctorStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Initialize with mock data if empty
  useEffect(() => {
    if (patients.length === 0) {
      mockPatients.forEach(patient => addPatient({
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        email: patient.email,
        phone: patient.phone,
        avatar: patient.avatar,
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies,
        lastVisit: patient.lastVisit,
        upcomingAppointment: patient.upcomingAppointment || undefined,
        totalVisits: patient.totalVisits,
        prescriptions: patient.prescriptions
      }))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter patients based on search
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.phone.includes(searchQuery)
    
    if (filterStatus === 'all') return matchesSearch
    if (filterStatus === 'upcoming') return matchesSearch && patient.upcomingAppointment
    if (filterStatus === 'recent') {
      const lastVisitDate = new Date(patient.lastVisit)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return matchesSearch && lastVisitDate > thirtyDaysAgo
    }
    return matchesSearch
  })

  // Statistics
  const stats = {
    todayAppointments: appointments.filter(a => {
      const today = new Date().toDateString()
      return new Date(a.datetime).toDateString() === today
    }).length || 8,
    totalPatients: patients.length || mockPatients.length,
    monthlyEarnings: 45000,
    rating: 4.8
  }

  const handleStartConsultation = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId)
    if (patient) {
      setSelectedPatient({
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        email: patient.email,
        phone: patient.phone,
        avatar: patient.avatar,
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies,
        lastVisit: patient.lastVisit,
        upcomingAppointment: patient.upcomingAppointment || undefined,
        totalVisits: patient.totalVisits,
        prescriptions: patient.prescriptions
      })
      window.location.href = `/doctor/consultations/video/${patientId}`
    }
  }

  const handleCreatePrescription = (patientId: string) => {
    window.location.href = `/doctor/prescriptions/create/${patientId}`
  }

  const handleViewRecords = (patientId: string) => {
    window.location.href = `/doctor/patients/${patientId}/records`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Responsive */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden text-gray-600"
              >
                <FaEllipsisV />
              </button>
              <div className="text-3xl md:text-4xl">{profile.avatar}</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-sm md:text-base text-gray-600">{profile.specialty} Specialist</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button className="relative p-2 text-gray-600 hover:text-primary-blue">
                <FaBell className="text-lg md:text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <Link 
                href="/doctor/patients/new" 
                className="hidden md:flex btn-gradient px-4 md:px-6 py-2 items-center gap-2"
              >
                <FaUserPlus />
                <span className="hidden md:inline">Add Patient</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMobileMenu(false)}>
          <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <Link href="/doctor/appointments" className="block py-3 text-gray-700 hover:text-primary-blue">
                <FaCalendarAlt className="inline mr-3" /> Appointments
              </Link>
              <Link href="/doctor/patients" className="block py-3 text-gray-700 hover:text-primary-blue">
                <FaUsers className="inline mr-3" /> All Patients
              </Link>
              <Link href="/doctor/prescriptions" className="block py-3 text-gray-700 hover:text-primary-blue">
                <FaPrescriptionBottle className="inline mr-3" /> Prescriptions
              </Link>
              <Link href="/doctor/availability" className="block py-3 text-gray-700 hover:text-primary-blue">
                <FaClock className="inline mr-3" /> Availability
              </Link>
              <Link href="/doctor/settings" className="block py-3 text-gray-700 hover:text-primary-blue">
                <FaChartLine className="inline mr-3" /> Settings
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Quick Stats - Mobile Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Today&apos;s Appointments</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stats.todayAppointments}</p>
              </div>
              <div className="p-2 md:p-3 rounded-full bg-blue-500">
                <FaCalendarAlt className="text-white text-sm md:text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Total Patients</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stats.totalPatients}</p>
              </div>
              <div className="p-2 md:p-3 rounded-full bg-green-500">
                <FaUsers className="text-white text-sm md:text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Monthly Earnings</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Rs {stats.monthlyEarnings.toLocaleString()}</p>
              </div>
              <div className="p-2 md:p-3 rounded-full bg-purple-500">
                <FaDollarSign className="text-white text-sm md:text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Patient Rating</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stats.rating}</p>
              </div>
              <div className="p-2 md:p-3 rounded-full bg-yellow-500">
                <FaStar className="text-white text-sm md:text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Patient List Section */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg">
          {/* Header with Search */}
          <div className="p-4 md:p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Patient Management</h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                {/* Filter Dropdown */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option value="all">All Patients</option>
                  <option value="upcoming">With Appointments</option>
                  <option value="recent">Recent Visits</option>
                </select>
              </div>
            </div>
          </div>

          {/* Patient List - Mobile Responsive */}
          <div className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
                      {patient.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base">{patient.name}</h3>
                      <div className="text-xs md:text-sm text-gray-600 mt-1 space-y-1">
                        <p>{patient.age} years • {patient.gender}</p>
                        <p className="flex items-center gap-2">
                          <FaPhoneAlt className="text-xs" />
                          <span>{patient.phone}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FaEnvelope className="text-xs" />
                          <span className="truncate">{patient.email}</span>
                        </p>
                      </div>
                      
                      {/* Medical Info - Hidden on small mobile */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {patient.medicalHistory.length > 0 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            {patient.medicalHistory[0]}
                          </span>
                        )}
                        {patient.allergies.length > 0 && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            ⚠️ Allergies
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex flex-col gap-3">
                    {/* Patient Stats */}
                    <div className="flex gap-4 text-xs md:text-sm text-gray-600">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{patient.totalVisits}</p>
                        <p>Visits</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{patient.prescriptions}</p>
                        <p>Prescriptions</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Mobile Responsive */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartConsultation(patient.id)}
                        className="flex-1 md:flex-none bg-blue-500 text-white px-3 py-2 rounded-lg text-xs md:text-sm hover:bg-blue-600 transition flex items-center justify-center gap-1"
                        title="Start Video Consultation"
                      >
                        <FaVideo />
                        <span className="hidden sm:inline">Consult</span>
                      </button>
                      
                      <button
                        onClick={() => handleCreatePrescription(patient.id)}
                        className="flex-1 md:flex-none bg-green-500 text-white px-3 py-2 rounded-lg text-xs md:text-sm hover:bg-green-600 transition flex items-center justify-center gap-1"
                        title="Create Prescription"
                      >
                        <FaPrescriptionBottle />
                        <span className="hidden sm:inline">Prescribe</span>
                      </button>
                      
                      <button
                        onClick={() => handleViewRecords(patient.id)}
                        className="flex-1 md:flex-none bg-purple-500 text-white px-3 py-2 rounded-lg text-xs md:text-sm hover:bg-purple-600 transition flex items-center justify-center gap-1"
                        title="View Medical Records"
                      >
                        <FaHistory />
                        <span className="hidden sm:inline">Records</span>
                      </button>
                    </div>
                    
                    {/* Upcoming Appointment */}
                    {patient.upcomingAppointment && (
                      <div className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                        <FaCalendarAlt className="inline mr-1" />
                        Next: {new Date(patient.upcomingAppointment).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredPatients.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <FaUsers className="text-4xl mx-auto mb-3 text-gray-300" />
                <p>No patients found</p>
                <Link href="/doctor/patients/new" className="mt-4 inline-block text-blue-500 hover:underline">
                  Add your first patient
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Grid - Mobile Responsive */}
        <div className="mt-6 md:mt-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Link 
              href="/doctor/appointments" 
              className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group"
            >
              <FaCalendarAlt className="text-3xl md:text-4xl text-blue-500 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-sm md:text-base font-medium text-gray-900">View Schedule</p>
            </Link>
            
            <Link 
              href="/doctor/prescriptions" 
              className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group"
            >
              <FaNotesMedical className="text-3xl md:text-4xl text-green-500 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-sm md:text-base font-medium text-gray-900">Prescriptions</p>
            </Link>
            
            <Link 
              href="/doctor/availability" 
              className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group"
            >
              <FaClock className="text-3xl md:text-4xl text-purple-500 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-sm md:text-base font-medium text-gray-900">Availability</p>
            </Link>
            
            <Link 
              href="/doctor/settings" 
              className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center group"
            >
              <FaChartLine className="text-3xl md:text-4xl text-orange-500 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-sm md:text-base font-medium text-gray-900">Analytics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}