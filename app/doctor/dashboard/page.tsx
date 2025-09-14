'use client'

import { useState, useEffect, type ComponentType } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FaCalendarAlt,
  FaUsers,
  FaFileAlt,
  FaMoneyBillWave,
  FaVideo,
  FaComments,
  FaBell,
  FaSearch,
  FaClock,
  FaSignOutAlt,
  FaCog,
  FaBars,
  FaTimes,
  FaHome,
  FaStethoscope,
  FaChartLine,
  FaPrescriptionBottle,
  FaStar,
  FaUserMd,
  FaHeartbeat,
  FaNotesMedical,
  FaHistory,
  FaCalendarCheck,
  FaUserPlus,
  FaAward,
  FaDollarSign,
  FaClinicMedical
} from 'react-icons/fa'

import PatientManagement from './components/PatientManagement'
import AppointmentScheduler from './components/AppointmentScheduler'
import PrescriptionSystem from './components/PrescriptionSystem'
import BillingEarnings from './components/BillingEarnings'
import DoctorChat from './components/DoctorChat'
import DoctorStatistics from './components/DoctorStatistics'
import DoctorProfile from './components/DoctorProfile'
import ReviewsRatings from './components/ReviewsRatings'
import DoctorSettings from './components/DoctorSettings'
import VideoConsultation from './components/VideoConsultation'

import type { Doctor as DoctorData } from '@/lib/data/doctors'


type ActiveSection =
  | 'overview'
  | 'patients'
  | 'appointments'
  | 'prescriptions'
  | 'billing'
  | 'chat'
  | 'statistics'
  | 'profile'
  | 'reviews'
  | 'settings'
  | 'video-consultation'

interface SidebarItem {
  id: ActiveSection
  label: string
  icon: ComponentType<{ className?: string }>
  color: string
  bgColor: string
  count?: number
}

/* ---------------- Component ---------------- */

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const loadDoctorData = () => {
      try {
        const userData = localStorage.getItem('healthwyz_user')
        if (userData) {
          type WithUserType = DoctorData & { userType?: string }
          const parsed = JSON.parse(userData) as WithUserType
          if (parsed.userType === 'doctor') {
            setDoctorData(parsed)
          } else {
            setError('Invalid user type')
            router.push('/login')
          }
        } else {
          setError('No doctor data found')
          router.push('/login')
        }
      } catch (err) {
        setError('Failed to load doctor data')
        console.error('Error loading doctor data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDoctorData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('healthwyz_user')
    localStorage.removeItem('healthwyz_token')
    localStorage.removeItem('healthwyz_userType')
    router.push('/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching:', searchQuery)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !doctorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <p className="text-red-600 mb-6 font-medium">{error || 'Failed to load doctor data'}</p>
          <Link
            href="/login"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            Return to Login
          </Link>
        </div>
      </div>
    )
  }

  const getTotalUnreadMessages = (): number =>
    doctorData.patientChats?.reduce((sum, chat) => sum + (chat.unreadCount ?? 0), 0) || 0

  const getTodayAppointments = (): number => doctorData.todaySchedule?.totalAppointments || 0

  const getActivePatients = (): number => doctorData.patients?.current?.length || 0

  const getPendingPrescriptions = (): number =>
    doctorData.prescriptions?.filter((rx) => rx.isActive).length || 0

  const sidebarItems: SidebarItem[] = [
    { id: 'overview', label: 'Overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt, color: 'text-green-600', bgColor: 'bg-green-50', count: getTodayAppointments() },
    { id: 'patients', label: 'Patients', icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-50', count: getActivePatients() },
    { id: 'prescriptions', label: 'Prescriptions', icon: FaPrescriptionBottle, color: 'text-orange-600', bgColor: 'bg-orange-50', count: getPendingPrescriptions() },
    { id: 'chat', label: 'Messages', icon: FaComments, color: 'text-pink-600', bgColor: 'bg-pink-50', count: getTotalUnreadMessages() },
    { id: 'billing', label: 'Billing & Earnings', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { id: 'statistics', label: 'Analytics', icon: FaChartLine, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'reviews', label: 'Reviews', icon: FaStar, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'profile', label: 'Profile', icon: FaUserMd, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50' }
  ]

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'patients':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <PatientManagement doctorData={doctorData as any} />
      case 'appointments':
        return (
          <AppointmentScheduler
            doctorData={{
              upcomingAppointments: doctorData.upcomingAppointments,
              pastAppointments: doctorData.pastAppointments,
              todaySchedule: doctorData.todaySchedule,
              weeklySchedule: doctorData.weeklySchedule ?? [],
              nextAvailable: doctorData?.nextAvailable ?? '',
              patients: doctorData.patients,
              homeVisitAvailable: doctorData.homeVisitAvailable
            }}
            onVideoCall={() => setActiveSection('video-consultation')}
          />
        )
      case 'prescriptions':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <PrescriptionSystem doctorData={doctorData as any} />
      case 'billing':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <BillingEarnings doctorData={doctorData as any} />
      case 'chat':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <DoctorChat doctorData={doctorData as any} />
      case 'statistics':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <DoctorStatistics doctorData={doctorData as any} />
      // case 'reviews':
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   return <ReviewsRatings doctorData={doctorData as any} />
      case 'profile':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <DoctorProfile doctorData={doctorData as any} setDoctorData={setDoctorData as any} />
      case 'settings':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <DoctorSettings doctorData={doctorData as any} setDoctorData={setDoctorData as any} />
      case 'video-consultation':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <VideoConsultation doctorData={doctorData as any} />
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
              Welcome back, Dr. {doctorData.firstName}!
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base lg:text-lg">
              {doctorData.specialty.join(', ')} • {doctorData.clinicAffiliation}
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs opacity-80">Performance Rating</p>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-300" />
                <span className="text-xl font-bold">{doctorData.rating}</span>
                <span className="text-sm opacity-80">({doctorData.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule Overview */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg border border-green-100">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-800">Today&rsquo;s Schedule</h3>
          <FaCalendarCheck className="text-green-500 text-base sm:text-lg md:text-xl lg:text-2xl" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
              {doctorData.todaySchedule?.totalAppointments || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">Total Appointments</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
              {doctorData.todaySchedule?.availableSlots || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">Available Slots</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">
              {doctorData.nextAvailable || 'N/A'}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">Next Available</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 md:gap-4 lg:gap-5">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-4 md:p-5 lg:p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-700 text-xs sm:text-xs md:text-sm lg:text-base font-medium">Active Patients</p>
              <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 mt-1">
                {doctorData.statistics?.activePatients || 0}
              </p>
              <p className="text-xs sm:text-xs md:text-sm text-gray-600 mt-1">
                +{doctorData.statistics?.newPatientsThisMonth || 0} this month
              </p>
            </div>
            <div className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 bg-blue-100 rounded-lg">
              <FaUsers className="text-blue-600 text-base sm:text-lg md:text-xl lg:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-4 md:p-5 lg:p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-700 text-xs sm:text-xs md:text-sm lg:text-base font-medium">Today&rsquo;s Earnings</p>
              <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-600 mt-1">
                Rs {doctorData.billing?.earnings?.today?.toLocaleString() || 0}
              </p>
              <p className="text-xs sm:text-xs md:text-sm text-green-600 mt-1">
                This month: Rs {doctorData.billing?.earnings?.thisMonth?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 bg-green-100 rounded-lg">
              <FaDollarSign className="text-green-600 text-base sm:text-lg md:text-xl lg:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 sm:p-4 md:p-5 lg:p-6 shadow-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-700 text-xs sm:text-xs md:text-sm lg:text-base font-medium">Consultations</p>
              <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-600 mt-1">
                {doctorData.statistics?.consultationsThisMonth || 0}
              </p>
              <p className="text-xs sm:text-xs md:text-sm text-purple-600 mt-1">
                This month
              </p>
            </div>
            <div className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 bg-purple-100 rounded-lg">
              <FaStethoscope className="text-purple-600 text-base sm:text-lg md:text-xl lg:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 sm:p-4 md:p-5 lg:p-6 shadow-lg border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-700 text-xs sm:text-xs md:text-sm lg:text-base font-medium">Prescriptions</p>
              <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-orange-600 mt-1">
                {doctorData.prescriptions?.length || 0}
              </p>
              <p className="text-xs sm:text-xs md:text-sm text-orange-600 mt-1">
                Active prescriptions
              </p>
            </div>
            <div className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 bg-orange-100 rounded-lg">
              <FaPrescriptionBottle className="text-orange-600 text-base sm:text-lg md:text-xl lg:text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      {doctorData.upcomingAppointments && doctorData.upcomingAppointments.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg border border-indigo-100">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Upcoming Appointments
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {doctorData.upcomingAppointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-3 sm:gap-3 md:gap-4 p-3 sm:p-3 md:p-4 lg:p-5 bg-white bg-opacity-70 rounded-lg sm:rounded-xl hover:bg-opacity-90 transition"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                  <FaUserMd className="text-blue-600 text-sm sm:text-base" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base lg:text-lg truncate">
                    {appointment.patientName}
                  </p>
                  <p className="text-xs sm:text-xs md:text-sm lg:text-base text-gray-600 truncate">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time} • {appointment.type}
                  </p>
                </div>
                {appointment.type === 'video' && (
                  <button
                    onClick={() => setActiveSection('video-consultation')}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition text-xs sm:text-sm flex-shrink-0"
                  >
                    <FaVideo className="inline mr-1" />
                    <span className="hidden sm:inline">Join</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg border border-gray-200">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
          Quick Actions
        </h3>
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 sm:gap-3 md:gap-4 lg:gap-5">
          <button
            onClick={() => setActiveSection('appointments')}
            className="w-full p-3 sm:p-3 md:p-4 lg:p-5 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all transform hover:scale-105 bg-gradient-to-br from-blue-50 to-indigo-50 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2"
          >
            <FaCalendarAlt className="text-blue-600 text-xl sm:text-xl md:text-2xl lg:text-3xl" />
            <p className="text-xs sm:text-xs md:text-sm lg:text-base font-medium text-gray-700">View Schedule</p>
          </button>

          <button
            onClick={() => setActiveSection('patients')}
            className="w-full p-3 sm:p-3 md:p-4 lg:p-5 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all transform hover:scale-105 bg-gradient-to-br from-purple-50 to-pink-50 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2"
          >
            <FaUserPlus className="text-purple-600 text-xl sm:text-xl md:text-2xl lg:text-3xl" />
            <p className="text-xs sm:text-xs md:text-sm lg:text-base font-medium text-gray-700">Add Patient</p>
          </button>

          <button
            onClick={() => setActiveSection('prescriptions')}
            className="w-full p-3 sm:p-3 md:p-4 lg:p-5 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all transform hover:scale-105 bg-gradient-to-br from-orange-50 to-yellow-50 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2"
          >
            <FaNotesMedical className="text-orange-600 text-xl sm:text-xl md:text-2xl lg:text-3xl" />
            <p className="text-xs sm:text-xs md:text-sm lg:text-base font-medium text-gray-700">Write Prescription</p>
          </button>

          <button
            onClick={() => setActiveSection('chat')}
            className="w-full p-3 sm:p-3 md:p-4 lg:p-5 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all transform hover:scale-105 bg-gradient-to-br from-pink-50 to-purple-50 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 relative"
          >
            <FaComments className="text-pink-600 text-xl sm:text-xl md:text-2xl lg:text-3xl" />
            <p className="text-xs sm:text-xs md:text-sm lg:text-base font-medium text-gray-700">Messages</p>
            {getTotalUnreadMessages() > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {getTotalUnreadMessages()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg border border-cyan-100">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Recent Activity</h3>
        <div className="space-y-2 sm:space-y-3">
          {doctorData.pastAppointments &&
            doctorData.pastAppointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-3 sm:gap-3 md:gap-4 p-3 sm:p-3 md:p-4 lg:p-5 bg-white bg-opacity-70 rounded-lg sm:rounded-xl hover:bg-opacity-90 transition"
              >
                <div className="p-1.5 sm:p-2 bg-cyan-100 rounded-lg">
                  <FaHistory className="text-cyan-600 text-sm sm:text-base md:text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base lg:text-lg truncate">
                    Consultation with {appointment.patientName}
                  </p>
                  <p className="text-xs sm:text-xs md:text-sm lg:text-base text-gray-600 truncate">
                    {new Date(appointment.date).toLocaleDateString()} • {appointment.reason}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    appointment.status === 'completed'
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                      : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Fixed Header */}
      <div className="bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-3.5 md:py-4 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                {sidebarOpen ? <FaTimes className="text-base sm:text-lg" /> : <FaBars className="text-base sm:text-lg" />}
              </button>
              <div>
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                  Dr. {doctorData.firstName} {doctorData.lastName}
                </h1>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base text-gray-600">
                  {doctorData.specialty.join(', ')} • Doctor Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
              <button className="relative p-2 sm:p-2.5 md:p-3 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-lg hover:bg-blue-100 transition">
                <FaBell className="text-base sm:text-lg md:text-xl lg:text-2xl" />
                {getTotalUnreadMessages() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center font-bold">
                    {getTotalUnreadMessages()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className="p-2 sm:p-2.5 md:p-3 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-lg hover:bg-blue-100 transition"
              >
                <FaCog className="text-base sm:text-lg md:text-xl lg:text-2xl" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg flex items-center gap-1 sm:gap-2 hover:from-red-600 hover:to-red-700 transition"
              >
                <FaSignOutAlt className="text-xs sm:text-sm md:text-base lg:text-lg" />
                <span className="hidden sm:inline text-xs sm:text-sm md:text-base lg:text-lg">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container with top padding for fixed header */}
      <div className="pt-14 sm:pt-16 md:pt-20 lg:pt-24 flex">
        {/* Sidebar */}
        <div
          className={`
          fixed inset-y-0 left-0 z-40
          ${sidebarOpen ? 'w-full sm:w-72 md:w-80 lg:w-80 xl:w-96' : 'w-0 md:w-64 lg:w-72 xl:w-80'}
          md:static md:h-screen
          bg-white shadow-2xl md:shadow-lg 
          transform transition-all duration-300 ease-in-out
          overflow-hidden
        `}
        >
          <div className="h-full overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 pt-16 md:pt-4">
            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden absolute top-4 right-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="space-y-1.5 sm:space-y-2 mt-8 md:mt-0">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    if (isMobile) setSidebarOpen(false)
                  }}
                  className={`w-full text-left px-3 sm:px-3.5 md:px-4 lg:px-5 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 ${
                    activeSection === item.id ? `${item.bgColor} ${item.color} shadow-md` : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 md:gap-3.5">
                    <item.icon className="text-base sm:text-lg md:text-xl lg:text-2xl" />
                    <span className="font-medium text-sm sm:text-sm md:text-base lg:text-lg">{item.label}</span>
                    {item.count && item.count > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full">{item.count}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Stats in Sidebar */}
            <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t">
              <p className="text-xs sm:text-xs md:text-sm lg:text-base font-semibold text-gray-600 mb-2 sm:mb-3">Quick Stats</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-600">Today&rsquo;s Patients</span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600">{getTodayAppointments()}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-600">Today&rsquo;s Earnings</span>
                  <span className="text-xs sm:text-sm font-bold text-green-600">
                    Rs {doctorData.billing?.earnings?.today?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-600">Patient Rating</span>
                  <span className="text-xs sm:text-sm font-bold text-purple-600 flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {doctorData.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 max-w-full overflow-x-hidden">
          {/* Search Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg mb-3 sm:mb-4 md:mb-5 lg:mb-6 border border-blue-100">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 sm:left-3.5 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patients, appointments, prescriptions..."
                  className="w-full pl-9 sm:pl-10 md:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-xs sm:text-sm md:text-base lg:text-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                <FaSearch className="inline mr-1 sm:mr-2 text-xs sm:text-sm md:text-base" />
                <span className="text-xs sm:text-sm md:text-base lg:text-lg">Search</span>
              </button>
            </form>
          </div>

          {/* Dynamic Content */}
          {renderActiveSection()}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard