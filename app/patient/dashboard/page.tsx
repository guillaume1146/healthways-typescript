'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Patient } from '@/lib/data/patients'
import { 
  FaCalendarAlt, 
  FaPills, 
  FaFileAlt, 
  FaHeart, 
  FaVideo, 
  FaClipboardList,
  FaBell,
  FaSearch,
  FaPlus,
  FaClock,
  FaSignOutAlt,
  FaEdit,
  FaComments,
  FaUserNurse,
  FaBaby,
  FaAmbulance,
  FaFlask,
  FaShieldAlt,
  FaCog,
  FaRobot,
  FaBars,
  FaTimes,
  FaHome,
  FaPhone,
  FaStethoscope,
  FaTint,
  FaDumbbell,
  FaChartLine
} from 'react-icons/fa'

import DoctorConsultations from './components/DoctorConsultations'
import PrescriptionManagement from './components/PrescriptionManagement'
import HealthRecords from './components/HealthRecords'
import BotHealthAssistant from './components/BotHealthAssistant'
import NurseServices from './components/NurseServices'
import ChildcareServices from './components/ChildcareServices'
import EmergencyServices from './components/EmergencyServices'
import LabResults from './components/LabResults'
import InsuranceInfo from './components/InsuranceInfo'
import SettingsComponent from './components/SettingsComponent'
import ChatComponent from './components/ChatComponent'
import VideoConsultation from './components/VideoConsultation'

type ActiveSection = 'overview' | 'consultations' | 'prescriptions' | 'health-records' | 
  'bot-assistant' | 'nurse-services' | 'childcare' | 'emergency' | 'lab-results' | 
  'insurance' | 'settings' | 'chat-doctor' | 'chat-nurse' | 'chat-nanny' | 'chat-emergency' |
  'video-consultation'

interface SidebarItem {
  id: ActiveSection
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  count?: number
}

const PatientDashboard: React.FC = () => {
  const [patientData, setPatientData] = useState<Patient | null>(null)
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
    const loadPatientData = () => {
      try {
        const userData = localStorage.getItem('healthwyz_user')
        if (userData) {
          const parsedData = JSON.parse(userData) as Patient
          setPatientData(parsedData)
        } else {
          setError('No patient data found')
          router.push('/login')
        }
      } catch (err) {
        setError('Failed to load patient data')
        console.error('Error loading patient data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPatientData()
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

  if (error || !patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <p className="text-red-600 mb-6 font-medium">{error || 'Failed to load patient data'}</p>
          <Link href="/login" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all">
            Return to Login
          </Link>
        </div>
      </div>
    )
  }

  const getUpcomingAppointmentCount = (): number => {
    return patientData.upcomingAppointments?.length || 0
  }

  const getActivePrescriptionCount = (): number => {
    return patientData.activePrescriptions?.length || 0
  }

  const getTotalUnreadMessages = (): number => {
    let total = 0
    if (patientData.chatHistory?.doctors) {
      total += patientData.chatHistory.doctors.reduce((sum, doc) => sum + doc.unreadCount, 0)
    }
    if (patientData.chatHistory?.nurses) {
      total += patientData.chatHistory.nurses.reduce((sum, nurse) => sum + nurse.unreadCount, 0)
    }
    if (patientData.chatHistory?.nannies) {
      total += patientData.chatHistory.nannies.reduce((sum, nanny) => sum + nanny.unreadCount, 0)
    }
    return total
  }

  const getNextAppointment = () => {
    if (!patientData.upcomingAppointments || patientData.upcomingAppointments.length === 0) {
      return null
    }
    return patientData.upcomingAppointments[0]
  }

  const sidebarItems: SidebarItem[] = [
    { id: 'overview', label: 'Overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'consultations', label: 'Doctor Consultations', icon: FaStethoscope, color: 'text-green-600', bgColor: 'bg-green-50', count: getUpcomingAppointmentCount() },
    { id: 'prescriptions', label: 'Prescriptions', icon: FaPills, color: 'text-purple-600', bgColor: 'bg-purple-50', count: getActivePrescriptionCount() },
    { id: 'health-records', label: 'Health Records', icon: FaFileAlt, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'bot-assistant', label: 'AI Health Assistant', icon: FaRobot, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { id: 'nurse-services', label: 'Nurse Services', icon: FaUserNurse, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { id: 'childcare', label: 'Childcare Services', icon: FaBaby, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'emergency', label: 'Emergency Services', icon: FaAmbulance, color: 'text-red-600', bgColor: 'bg-red-50' },
    { id: 'lab-results', label: 'Lab Results', icon: FaFlask, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { id: 'insurance', label: 'Insurance', icon: FaShieldAlt, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600', bgColor: 'bg-gray-50' }
  ]

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'consultations':
        return <DoctorConsultations patientData={patientData} onVideoCall={() => setActiveSection('video-consultation')} />
      case 'prescriptions':
        return <PrescriptionManagement patientData={patientData} />
      case 'health-records':
        return <HealthRecords patientData={patientData} />
      case 'bot-assistant':
        return <BotHealthAssistant patientData={patientData} />
      case 'nurse-services':
        return <NurseServices patientData={patientData} onVideoCall={() => setActiveSection('video-consultation')} />
      case 'childcare':
        return <ChildcareServices patientData={patientData} onVideoCall={() => setActiveSection('video-consultation')} />
      case 'emergency':
        return <EmergencyServices patientData={patientData} />
      case 'lab-results':
        return <LabResults patientData={patientData} />
      case 'insurance':
        return <InsuranceInfo patientData={patientData} />
      case 'settings':
        return <SettingsComponent patientData={patientData} setPatientData={setPatientData} />
      case 'chat-doctor':
        return <ChatComponent patientData={patientData} chatType="doctor" />
      case 'chat-nurse':
        return <ChatComponent patientData={patientData} chatType="nurse" />
      case 'chat-nanny':
        return <ChatComponent patientData={patientData} chatType="nanny" />
      case 'chat-emergency':
        return <ChatComponent patientData={patientData} chatType="emergency" />
      case 'video-consultation':
        return <VideoConsultation patientData={patientData} />
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-4 md:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome back, {patientData.firstName}!</h2>
            <p className="opacity-90 text-sm md:text-base">Take charge of your health journey today</p>
          </div>
          <div className="hidden sm:block">
            <FaHeart className="text-3xl md:text-4xl opacity-20" />
          </div>
        </div>
      </div>

      {/* Health Score Card */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Your Health Score</h3>
          <FaChartLine className="text-green-500 text-lg md:text-xl" />
        </div>
        <div className="flex items-end space-x-4">
          <div className="text-3xl md:text-4xl font-bold text-green-500">{patientData.healthScore}%</div>
          <div className="text-xs md:text-sm text-gray-600 mb-2">
            Body Age: {patientData.bodyAge} years
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" 
            style={{ width: `${patientData.healthScore}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Upcoming Appointments</p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">{getUpcomingAppointmentCount()}</p>
              {getNextAppointment() && (
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Next: {new Date(getNextAppointment()!.date).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
              <FaCalendarAlt className="text-blue-600 text-lg md:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Active Prescriptions</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{getActivePrescriptionCount()}</p>
              <p className="text-xs md:text-sm text-green-600 mt-1">All active</p>
            </div>
            <div className="p-2 md:p-3 bg-green-100 rounded-lg">
              <FaPills className="text-green-600 text-lg md:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Health Records</p>
              <p className="text-xl md:text-2xl font-bold text-purple-600">{patientData.medicalRecords?.length || 0}</p>
              <p className="text-xs md:text-sm text-purple-600 mt-1">Documents</p>
            </div>
            <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
              <FaFileAlt className="text-purple-600 text-lg md:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Last Checkup</p>
              <p className="text-sm md:text-lg font-bold text-red-600">
                {new Date(patientData.lastCheckupDate).toLocaleDateString()}
              </p>
              <p className="text-xs md:text-sm text-red-600 mt-1">Regular checkup</p>
            </div>
            <div className="p-2 md:p-3 bg-red-100 rounded-lg">
              <FaClock className="text-red-600 text-lg md:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {sidebarItems.slice(1, 9).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`p-3 md:p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all transform hover:scale-105 ${item.bgColor}`}
            >
              <item.icon className={`${item.color} text-xl md:text-2xl mx-auto mb-2`} />
              <p className="text-xs md:text-sm font-medium text-gray-700">{item.label}</p>
              {item.count && item.count > 0 && (
                <span className="inline-block mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {patientData.medicalRecords && patientData.medicalRecords.slice(0, 3).map((record) => (
            <div key={record.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaFileAlt className="text-blue-600 text-sm md:text-base" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm md:text-base">{record.title}</p>
                <p className="text-xs md:text-sm text-gray-600">
                  {record.doctorResponsible} • {new Date(record.date).toLocaleDateString()}
                </p>
              </div>
              <FaEdit className="text-gray-400 hover:text-blue-500 cursor-pointer text-sm md:text-base" />
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
        <div className="px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                {sidebarOpen ? <FaTimes className="text-lg md:text-xl" /> : <FaBars className="text-lg md:text-xl" />}
              </button>
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                  {patientData.firstName} {patientData.lastName}
                </h1>
                <p className="text-xs md:text-sm text-gray-600">Patient Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button className="relative p-2 md:p-3 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-lg hover:bg-blue-100 transition">
                <FaBell className="text-lg md:text-xl" />
                {getTotalUnreadMessages() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-bold">
                    {getTotalUnreadMessages()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className="p-2 md:p-3 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-lg hover:bg-blue-100 transition"
              >
                <FaCog className="text-lg md:text-xl" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:from-red-600 hover:to-red-700 transition"
              >
                <FaSignOutAlt className="text-sm md:text-base" />
                <span className="hidden sm:inline text-sm md:text-base">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container with top padding for fixed header */}
      <div className="pt-16 md:pt-20 lg:pt-24 flex">
        
        {/* Sidebar */}
        <div className={`
          fixed md:static left-0 top-16 md:top-0 h-[calc(100vh-4rem)] md:h-auto w-72 md:w-80 lg:w-80
          bg-white shadow-2xl md:shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="h-full overflow-y-auto p-3 md:p-4 pt-4 md:pt-6">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    if (isMobile) setSidebarOpen(false)
                  }}
                  className={`w-full text-left px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all transform hover:scale-105 ${
                    activeSection === item.id 
                      ? `${item.bgColor} ${item.color} shadow-md` 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 md:gap-3">
                    <item.icon className="text-lg md:text-xl" />
                    <span className="font-medium text-sm md:text-base">{item.label}</span>
                    {item.count && item.count > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Communication Links */}
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
              <p className="text-xs md:text-sm font-semibold text-gray-600 mb-3">Communications</p>
              <div className="space-y-2">
                {patientData.chatHistory?.doctors && patientData.chatHistory.doctors.length > 0 && (
                  <button
                    onClick={() => {
                      setActiveSection('chat-doctor')
                      if (isMobile) setSidebarOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-xs md:text-sm hover:bg-blue-50 rounded-lg transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <FaComments className="text-blue-500" />
                      <span>Doctor Messages</span>
                    </div>
                    {patientData.chatHistory.doctors.reduce((sum, doc) => sum + doc.unreadCount, 0) > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {patientData.chatHistory.doctors.reduce((sum, doc) => sum + doc.unreadCount, 0)}
                      </span>
                    )}
                  </button>
                )}

                {patientData.upcomingAppointments && patientData.upcomingAppointments.some(apt => apt.type === 'video') && (
                  <button
                    onClick={() => {
                      setActiveSection('video-consultation')
                      if (isMobile) setSidebarOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-xs md:text-sm hover:bg-green-50 rounded-lg transition flex items-center gap-2"
                  >
                    <FaVideo className="text-green-500" />
                    <span>Video Call</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile - positioned to account for fixed header */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 top-16 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-3 md:p-4 lg:p-6">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-3 md:p-4 shadow-lg mb-4 md:mb-6 border border-gray-100">
            <form onSubmit={handleSearch} className="flex gap-3 md:gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm md:text-base" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for doctors, symptoms, medicines..."
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 border rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm md:text-base"
                />
              </div>
              <button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105">
                <FaSearch className="inline mr-1 md:mr-2 text-sm md:text-base" />
                <span className="hidden sm:inline text-sm md:text-base">Search</span>
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

export default PatientDashboard