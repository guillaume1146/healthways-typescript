'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaCalendarAlt,
  FaUsers,
  FaComments,
  FaVideo,
  FaStar,
  FaStethoscope,
  FaPrescriptionBottle,
  FaHistory,
  FaCalendarCheck,
  FaUserPlus,
  FaNotesMedical,
  FaDollarSign,
  FaUserMd,
  FaSpinner,
} from 'react-icons/fa'
import { useDoctorData } from './context'
import WalletBalanceCard from '@/components/shared/WalletBalanceCard'

interface OverviewAppointment {
  id: string
  patientName: string
  date: string
  time: string
  type: string
  status: string
  reason: string
  roomId?: string
}

interface OverviewData {
  specialty: string[]
  clinicAffiliation: string
  rating: number
  reviewCount: number
  totalPatients: number
  upcomingAppointments: OverviewAppointment[]
  pastAppointments: OverviewAppointment[]
  activePrescriptions: number
}

export default function DoctorOverviewPage() {
  const user = useDoctorData()
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [profileRes, upcomingRes, pastRes, patientsRes, prescRes] = await Promise.all([
          fetch(`/api/users/${user.id}`),
          fetch(`/api/doctors/${user.id}/appointments?status=upcoming&limit=5`),
          fetch(`/api/doctors/${user.id}/appointments?status=completed&limit=5`),
          fetch(`/api/doctors/${user.id}/patients`),
          fetch(`/api/doctors/${user.id}/prescriptions`),
        ])

        const [profile, upcoming, past, patients, prescriptions] = await Promise.all([
          profileRes.json(),
          upcomingRes.json(),
          pastRes.json(),
          patientsRes.json(),
          prescRes.json(),
        ])

        const doctorProfile = profile.data?.doctorProfile || profile.data?.profile || {}

        const mapApt = (apt: {
          id: string
          patient?: { user: { firstName: string; lastName: string } }
          scheduledAt: string
          type?: string
          status: string
          reason?: string
          roomId?: string
        }): OverviewAppointment => ({
          id: apt.id,
          patientName: apt.patient
            ? `${apt.patient.user.firstName} ${apt.patient.user.lastName}`
            : 'Patient',
          date: apt.scheduledAt,
          time: new Date(apt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          type: (apt.type || '').replace(/_/g, '-'),
          status: apt.status,
          reason: apt.reason || '',
          roomId: apt.roomId,
        })

        setData({
          specialty: doctorProfile.specialty || [],
          clinicAffiliation: doctorProfile.clinicAffiliation || '',
          rating: doctorProfile.rating || 0,
          reviewCount: doctorProfile.reviewCount || 0,
          totalPatients: patients.data?.length || 0,
          upcomingAppointments: (upcoming.data || []).map(mapApt),
          pastAppointments: (past.data || []).map(mapApt),
          activePrescriptions: prescriptions.success
            ? (prescriptions.data || []).filter((p: { isActive: boolean }) => p.isActive).length
            : 0,
        })
      } catch (error) {
        console.error('Failed to fetch overview:', error)
        setData({
          specialty: [],
          clinicAffiliation: '',
          rating: 0,
          reviewCount: 0,
          totalPatients: 0,
          upcomingAppointments: [],
          pastAppointments: [],
          activePrescriptions: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [user.id])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
              Welcome back, Dr. {user.firstName}!
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base lg:text-lg">
              {data.specialty.length > 0 ? data.specialty.join(', ') : 'Doctor'} {data.clinicAffiliation ? `\u2022 ${data.clinicAffiliation}` : ''}
            </p>
          </div>
          {data.rating > 0 && (
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs opacity-80">Performance Rating</p>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-300" />
                  <span className="text-xl font-bold">{data.rating}</span>
                  <span className="text-sm opacity-80">({data.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Balance */}
      <WalletBalanceCard userId={user.id} />

      {/* Today's Schedule Overview */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg border border-green-100">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-800">
            Today&rsquo;s Schedule
          </h3>
          <FaCalendarCheck className="text-green-500 text-base sm:text-lg md:text-xl lg:text-2xl" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
              {data.upcomingAppointments.filter((a) => {
                const aptDate = new Date(a.date)
                const today = new Date()
                return aptDate.toDateString() === today.toDateString()
              }).length}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">Today&rsquo;s Appointments</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
              {data.upcomingAppointments.length}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">Total Upcoming</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">
              {data.totalPatients}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">Total Patients</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 md:gap-4 lg:gap-5">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-5 lg:p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-700 text-xs md:text-sm font-medium">Active Patients</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 mt-1">
                {data.totalPatients}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
              <FaUsers className="text-blue-600 text-base md:text-xl lg:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-5 lg:p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-700 text-xs md:text-sm font-medium">Upcoming</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600 mt-1">
                {data.upcomingAppointments.length}
              </p>
              <p className="text-xs md:text-sm text-green-600 mt-1">Appointments</p>
            </div>
            <div className="p-2 md:p-3 bg-green-100 rounded-lg">
              <FaDollarSign className="text-green-600 text-base md:text-xl lg:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 md:p-5 lg:p-6 shadow-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-700 text-xs md:text-sm font-medium">Consultations</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600 mt-1">
                {data.pastAppointments.length}
              </p>
              <p className="text-xs md:text-sm text-purple-600 mt-1">Completed</p>
            </div>
            <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
              <FaStethoscope className="text-purple-600 text-base md:text-xl lg:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 md:p-5 lg:p-6 shadow-lg border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-700 text-xs md:text-sm font-medium">Prescriptions</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600 mt-1">
                {data.activePrescriptions}
              </p>
              <p className="text-xs md:text-sm text-orange-600 mt-1">Active prescriptions</p>
            </div>
            <div className="p-2 md:p-3 bg-orange-100 rounded-lg">
              <FaPrescriptionBottle className="text-orange-600 text-base md:text-xl lg:text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      {data.upcomingAppointments.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg border border-indigo-100">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Upcoming Appointments
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {data.upcomingAppointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 lg:p-5 bg-white bg-opacity-70 rounded-lg sm:rounded-xl hover:bg-opacity-90 transition"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                  <FaUserMd className="text-blue-600 text-sm sm:text-base" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base lg:text-lg truncate">
                    {appointment.patientName}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time} &bull; {appointment.type}
                  </p>
                </div>
                {appointment.type === 'video' && appointment.roomId && (
                  <Link
                    href={`/doctor/dashboard/video?roomId=${appointment.roomId}`}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition text-xs sm:text-sm flex-shrink-0"
                  >
                    <FaVideo className="inline mr-1" />
                    <span className="hidden sm:inline">Join</span>
                  </Link>
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
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-3 md:gap-4 lg:gap-5">
          <Link
            href="/doctor/dashboard/appointments"
            className="w-full p-3 md:p-4 lg:p-5 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all transform hover:scale-105 bg-gradient-to-br from-blue-50 to-indigo-50 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2"
          >
            <FaCalendarAlt className="text-blue-600 text-xl md:text-2xl lg:text-3xl" />
            <p className="text-xs md:text-sm lg:text-base font-medium text-gray-700">View Schedule</p>
          </Link>

          <Link
            href="/doctor/dashboard/patients"
            className="w-full p-3 md:p-4 lg:p-5 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all transform hover:scale-105 bg-gradient-to-br from-purple-50 to-pink-50 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2"
          >
            <FaUserPlus className="text-purple-600 text-xl md:text-2xl lg:text-3xl" />
            <p className="text-xs md:text-sm lg:text-base font-medium text-gray-700">My Patients</p>
          </Link>

          <Link
            href="/doctor/dashboard/prescriptions"
            className="w-full p-3 md:p-4 lg:p-5 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all transform hover:scale-105 bg-gradient-to-br from-orange-50 to-yellow-50 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2"
          >
            <FaNotesMedical className="text-orange-600 text-xl md:text-2xl lg:text-3xl" />
            <p className="text-xs md:text-sm lg:text-base font-medium text-gray-700">Write Prescription</p>
          </Link>

          <Link
            href="/doctor/dashboard/messages"
            className="w-full p-3 md:p-4 lg:p-5 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all transform hover:scale-105 bg-gradient-to-br from-pink-50 to-purple-50 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2"
          >
            <FaComments className="text-pink-600 text-xl md:text-2xl lg:text-3xl" />
            <p className="text-xs md:text-sm lg:text-base font-medium text-gray-700">Messages</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {data.pastAppointments.length > 0 && (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg border border-cyan-100">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Recent Activity
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {data.pastAppointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 lg:p-5 bg-white bg-opacity-70 rounded-lg sm:rounded-xl hover:bg-opacity-90 transition"
              >
                <div className="p-1.5 sm:p-2 bg-cyan-100 rounded-lg">
                  <FaHistory className="text-cyan-600 text-sm sm:text-base md:text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base lg:text-lg truncate">
                    Consultation with {appointment.patientName}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {new Date(appointment.date).toLocaleDateString()} &bull; {appointment.reason}
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
      )}
    </div>
  )
}
