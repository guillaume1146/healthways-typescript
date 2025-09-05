'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  FaArrowRight,
  FaClock,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaRobot,
  FaAmbulance,
  FaFlask,
  FaSignOutAlt,
  FaEdit
} from 'react-icons/fa'

import { IconType } from 'react-icons';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Stat {
  upcomingAppointments: number;
  activePrescriptions: number;
  healthScore: number;
  lastCheckup: string;
}

interface UpcomingAppointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  location: string;
}

interface RecentActivity {
  id: number;
  activity: string;
  time: string;
  type: string;
}

interface QuickAction {
  id: number;
  title: string;
  icon: IconType;
  href: string;
  color: string;
}

interface PatientData {
  name: string;
  age: number;
  avatar: string;
  membershipType: string;
  stats: Stat;
  upcomingAppointments: UpcomingAppointment[];
  recentActivity: RecentActivity[];
  quickActions: QuickAction[];
}

interface StatCardProps {
  icon: IconType;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

const mockPatientData: PatientData = {
  name: "John Smith",
  age: 35,
  avatar: "👨",
  membershipType: "Premium",
  stats: {
    upcomingAppointments: 2,
    activePrescriptions: 3,
    healthScore: 85,
    lastCheckup: "2024-01-10",
  },
  upcomingAppointments: [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2024-01-16",
      time: "10:00 AM",
      type: "Video Call",
      location: "Virtual Consultation",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "General Medicine",
      date: "2024-01-18",
      time: "2:30 PM",
      type: "In-Person",
      location: "Apollo Bramwell Hospital",
    },
  ],
  recentActivity: [
    { id: 1, activity: "Consultation completed with Dr. Sarah Johnson", time: "2 days ago", type: "consultation" },
    { id: 2, activity: "Prescription refilled - Metformin 500mg", time: "3 days ago", type: "prescription" },
    { id: 3, activity: "Lab test results available", time: "1 week ago", type: "lab" },
    { id: 4, activity: "Health reminder: Annual checkup due", time: "2 weeks ago", type: "reminder" },
  ],
  quickActions: [
    { id: 1, title: "Find Doctors", icon: FaCalendarAlt, href: "/doctors", color: "bg-blue-500" },
    { id: 2, title: "Book Appointment", icon: FaCalendarAlt, href: "/patient/doctor-consultations/book", color: "bg-green-500" },
    { id: 3, title: "Order Medicines", icon: FaPills, href: "/medicines", color: "bg-purple-500" },
    { id: 4, title: "AI Health Check", icon: FaRobot, href: "/ai-search", color: "bg-orange-500" },
    { id: 5, title: "Lab Tests", icon: FaFlask, href: "/patient/lab-tests/book", color: "bg-cyan-500" },
    { id: 6, title: "Emergency", icon: FaAmbulance, href: "/emergency", color: "bg-red-500" },
    { id: 7, title: "Nanny Services", icon: FaAmbulance, href: "/patient/nanny-services/book", color: "bg-red-500" },
    { id: 8, title: "Home Nursing", icon: FaAmbulance, href: "/patient/home-nursing/book", color: "bg-red-500" },
    { id: 9, title: "Health Records", icon: FaFileAlt, href: "/patient/health-records", color: "bg-gray-500" },
    { id: 10, title: "Profile Settings", icon: FaEdit, href: "/patient/profile", color: "bg-yellow-500" },
    { id: 11, title: "Emergency Contacts", icon: FaBell, href: "/patient/emergency-contacts", color: "bg-red-500" },
    { id: 12, title: "Insurance", icon: FaBell, href: "/patient/insurance", color: "bg-red-600" },
    { id: 13, title: "Prescriptions", icon: FaClipboardList, href: "/patient/doctor-prescriptions", color: "bg-gray-300" },  
    { id: 14, title: "Health Tips", icon: FaHeart, href: "/patient/health-tips", color: "bg-pink-500" },
    { id: 15, title: "Notifications", icon: FaBell, href: "/patient/notifications", color: "bg-indigo-500" },
    { id: 16, title: "Support", icon: FaRobot, href: "/patient/support", color: "bg-teal-500" },
    { id: 17, title: "Settings", icon: FaEdit, href: "/patient/settings", color: "bg-gray-400" },
    { id: 18, title: "Logout", icon: FaSignOutAlt, href: "/", color: "bg-red-600" },
  ],
};

const PatientDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching:', searchQuery)
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: StatCardProps) => (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs sm:text-sm font-medium">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color}`}>
          <Icon className="text-white text-lg sm:text-xl" />
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedUserTypes={['patient']}>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-3xl sm:text-4xl">{mockPatientData.avatar}</div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {mockPatientData.name}</h1>
                <p className="text-sm text-gray-600">
                  {mockPatientData.age} years old • {mockPatientData.membershipType} Member
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="relative p-2 text-gray-600 hover:text-primary-blue">
                <FaBell className="text-lg sm:text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <Link href="/patient/settings" className="btn-gradient px-4 sm:px-6 py-2 text-sm sm:text-base">
                <FaEdit className="inline mr-1 sm:mr-2" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick Search */}
        <div className="bg-gradient-main text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="max-w-full sm:max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">How can we help you today?</h2>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for doctors, symptoms, medicines..."
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-gray-900 focus:outline-none text-sm sm:text-base"
              />
              <button type="submit" className="bg-white text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition text-sm sm:text-base">
                <FaSearch className="inline mr-1 sm:mr-2" />
                Search
              </button>
            </form>
            <p className="text-white/90 text-xs sm:text-sm">
              Find doctors, book appointments, order medicines, or get AI health insights
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={FaCalendarAlt}
            title="Upcoming Appointments"
            value={mockPatientData.stats.upcomingAppointments}
            subtitle="Next: Tomorrow 10:00 AM"
            color="bg-blue-500"
          />
          <StatCard
            icon={FaPills}
            title="Active Prescriptions"
            value={mockPatientData.stats.activePrescriptions}
            subtitle="2 ready for refill"
            color="bg-green-500"
          />
          <StatCard
            icon={FaHeart}
            title="Health Score"
            value={`${mockPatientData.stats.healthScore}%`}
            subtitle="Excellent condition"
            color="bg-purple-500"
          />
          <StatCard
            icon={FaClipboardList}
            title="Last Checkup"
            value="6 days ago"
            subtitle={mockPatientData.stats.lastCheckup}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {mockPatientData.quickActions.map((action) => (
                  <Link
                    key={action.id}
                    href={action.href}
                    className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary-blue hover:bg-blue-50 transition group"
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="text-white text-lg sm:text-xl" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{action.title}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                <Link href="/patient/doctor-consultations" className="text-primary-blue hover:underline text-sm sm:text-base">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {mockPatientData.upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 w-full">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                          {appointment.doctor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{appointment.doctor}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm">{appointment.specialty}</p>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FaClock />
                              <span>{appointment.date} at {appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaMapMarkerAlt />
                              <span className="truncate">{appointment.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.type === 'Video Call' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.type}
                        </span>
                        {appointment.type === 'Video Call' && (
                          <a className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm hover:bg-green-600 transition" href="doctor-consultations/id">
                            <FaVideo className="inline mr-1" /> Join
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/doctor-consultations/book" className="block mt-4 text-center border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-gray-600 hover:border-primary-blue hover:text-primary-blue transition text-sm sm:text-base">
                <FaPlus className="inline mr-1 sm:mr-2" />
                Book New Appointment
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Summary */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Health Summary</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Overall Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="font-semibold text-green-600 text-xs sm:text-sm">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Blood Pressure</span>
                  <span className="text-green-600 font-medium text-xs sm:text-sm">Normal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">Cholesterol</span>
                  <span className="text-yellow-600 font-medium text-xs sm:text-sm">Monitor</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs sm:text-sm">BMI</span>
                  <span className="text-green-600 font-medium text-xs sm:text-sm">Healthy</span>
                </div>
              </div>
              <Link href="/patient/health-records" className="btn-gradient w-full mt-4 block text-center py-2 sm:py-3 text-sm sm:text-base">
                <FaFileAlt className="inline mr-1 sm:mr-2" />
                View Full Records
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {mockPatientData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2 sm:gap-3">
                    <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'consultation' ? 'bg-blue-100' :
                      activity.type === 'prescription' ? 'bg-green-100' :
                      activity.type === 'lab' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      {activity.type === 'consultation' && <FaPills className="text-blue-600 text-xs sm:text-sm" />}
                      {activity.type === 'prescription' && <FaPills className="text-green-600 text-xs sm:text-sm" />}
                      {activity.type === 'lab' && <FaFlask className="text-purple-600 text-xs sm:text-sm" />}
                      {activity.type === 'reminder' && <FaBell className="text-orange-600 text-xs sm:text-sm" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-gray-900">{activity.activity}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-primary-blue text-xs sm:text-sm hover:underline mt-4">
                View All Activity
              </button>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-red-800 mb-2">Emergency</h3>
              <p className="text-red-700 text-xs sm:text-sm mb-4">
                Need immediate medical attention?
              </p>
              <div className="space-y-2">
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base">
                  <FaAmbulance className="inline mr-1 sm:mr-2" />
                  Call Ambulance
                </button>
                <button className="w-full border border-red-300 text-red-700 py-2 sm:py-3 rounded-lg hover:bg-red-50 transition text-sm sm:text-base">
                  Emergency Consultation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Services */}
        <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Explore Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/ai-search" className="group p-4 sm:p-6 border border-gray-200 rounded-lg hover:border-primary-blue hover:bg-blue-50 transition">
              <FaRobot className="text-2xl sm:text-3xl text-orange-500 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">AI Health Assistant</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3">Get instant health insights and symptom checking powered by AI</p>
              <span className="text-primary-blue font-medium text-xs sm:text-sm">Try Now <FaArrowRight className="inline ml-1" /></span>
            </Link>

            <Link href="/medicines" className="group p-4 sm:p-6 border border-gray-200 rounded-lg hover:border-primary-blue hover:bg-blue-50 transition">
              <FaShoppingCart className="text-2xl sm:text-3xl text-green-500 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Medicine Delivery</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3">Order prescribed medicines with same-day delivery across Mauritius</p>
              <span className="text-primary-blue font-medium text-xs sm:text-sm">Order Now <FaArrowRight className="inline ml-1" /></span>
            </Link>

            <Link href="/patient/lab-tests/book" className="group p-4 sm:p-6 border border-gray-200 rounded-lg hover:border-primary-blue hover:bg-blue-50 transition">
              <FaFlask className="text-2xl sm:text-3xl text-purple-500 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Lab Tests</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3">Book lab tests and get results digitally with home collection</p>
              <span className="text-primary-blue font-medium text-xs sm:text-sm">Book Test <FaArrowRight className="inline ml-1" /></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}

export default PatientDashboard