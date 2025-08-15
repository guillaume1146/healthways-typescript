// File: app/doctor/dashboard/page.tsx
'use client'

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
  FaClipboardList,
  FaEdit,
} from 'react-icons/fa'



import { IconType } from 'react-icons';

interface Stat {
  todayAppointments: number;
  totalPatients: number;
  monthlyEarnings: number;
  rating: number;
  consultationsCompleted: number;
  pendingApprovals: number;
}

interface RecentPatient {
  id: number;
  name: string;
  time: string;
  type: string;
  status: string;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  type: string;
}

interface DoctorData {
  name: string;
  specialty: string;
  avatar: string;
  stats: Stat;
  recentPatients: RecentPatient[];
  notifications: Notification[];
}

interface StatCardProps {
  icon: IconType;
  title: string;
  value: string | number;
  change?: number;
  color: string;
}

const mockDoctorData: DoctorData = {
  name: "Dr. Sarah Johnson",
  specialty: "Cardiology",
  avatar: "👩‍⚕️",
  stats: {
    todayAppointments: 8,
    totalPatients: 247,
    monthlyEarnings: 15420,
    rating: 4.8,
    consultationsCompleted: 1250,
    pendingApprovals: 3,
  },
  recentPatients: [
    { id: 1, name: "John Smith", time: "09:00 AM", type: "Video Call", status: "completed" },
    { id: 2, name: "Maria Garcia", time: "10:30 AM", type: "In-Person", status: "upcoming" },
    { id: 3, name: "David Chen", time: "02:00 PM", type: "Video Call", status: "upcoming" },
    { id: 4, name: "Emma Wilson", time: "03:30 PM", type: "Follow-up", status: "upcoming" },
  ],
  notifications: [
    { id: 1, message: "New patient booking for tomorrow", time: "5 min ago", type: "booking" },
    { id: 2, message: "Prescription approved by pharmacy", time: "1 hour ago", type: "prescription" },
    { id: 3, message: "Weekly earnings report available", time: "2 hours ago", type: "earnings" },
  ],
};

const DoctorDashboard = () => {

  const StatCard = ({ icon: Icon, title, value, change, color }: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-1">
            +{change}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-white text-xl" />
      </div>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{mockDoctorData.avatar}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockDoctorData.name}</h1>
                <p className="text-gray-600">{mockDoctorData.specialty} Specialist</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-primary-blue">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <Link href="/doctor/profile" className="btn-gradient px-6 py-2">
                <FaEdit className="inline mr-2" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaCalendarAlt}
            title="Today's Appointments"
            value={mockDoctorData.stats.todayAppointments}
            change={12}
            color="bg-blue-500"
          />
          <StatCard
            icon={FaUsers}
            title="Total Patients"
            value={mockDoctorData.stats.totalPatients}
            change={8}
            color="bg-green-500"
          />
          <StatCard
            icon={FaDollarSign}
            title="Monthly Earnings"
            value={`$${mockDoctorData.stats.monthlyEarnings.toLocaleString()}`}
            change={15}
            color="bg-purple-500"
          />
          <StatCard
            icon={FaStar}
            title="Patient Rating"
            value={mockDoctorData.stats.rating}
            color="bg-yellow-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Today s Schedule</h2>
                <Link href="/doctor/appointments" className="text-primary-blue hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {mockDoctorData.recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-semibold">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-gray-600 text-sm">{patient.time} • {patient.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {patient.status}
                      </span>
                      {patient.status === 'upcoming' && patient.type === 'Video Call' && (
                        <button className="bg-primary-blue text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600">
                          <FaVideo className="inline mr-1" />
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/doctor/consultations/new" className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-blue hover:bg-blue-50 transition">
                  <FaVideo className="text-2xl text-primary-blue mx-auto mb-2" />
                  <p className="text-sm font-medium">Start Consultation</p>
                </Link>
                <Link href="/doctor/prescriptions/new" className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition">
                  <FaPrescriptionBottle className="text-2xl text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Write Prescription</p>
                </Link>
                <Link href="/doctor/availability" className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition">
                  <FaClock className="text-2xl text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Manage Schedule</p>
                </Link>
                <Link href="/doctor/patients" className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-orange-500 hover:bg-orange-50 transition">
                  <FaClipboardList className="text-2xl text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Patient Records</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Consultations</span>
                  <span className="font-semibold">{mockDoctorData.stats.consultationsCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Patient Rating</span>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className="font-semibold">{mockDoctorData.stats.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Approvals</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {mockDoctorData.stats.pendingApprovals}
                  </span>
                </div>
              </div>
              <Link href="/doctor/analytics" className="btn-gradient w-full mt-4 block text-center">
                <FaChartLine className="inline mr-2" />
                View Detailed Analytics
              </Link>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                {mockDoctorData.notifications.map((notification) => (
                  <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <button className="text-primary-blue text-sm hover:underline mt-4">
                View All Notifications
              </button>
            </div>

            {/* Profile Completion */}
            <div className="bg-gradient-main text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Complete Your Profile</h3>
              <p className="text-white/90 text-sm mb-4">
                Boost your visibility by completing your professional profile
              </p>
              <div className="bg-white/20 rounded-full h-2 mb-4">
                <div className="bg-white rounded-full h-2 w-3/4"></div>
              </div>
              <p className="text-sm mb-4">75% Complete</p>
              <Link href="/doctor/profile" className="bg-white text-primary-blue px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">
                Complete Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard