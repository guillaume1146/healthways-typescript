import React from 'react'
import Link from 'next/link'
import { Patient } from '@/lib/data/patients'
import BookingsList, { BookingItem } from '@/components/booking/BookingsList'
import {
  FaVideo,
  FaPlus,
  FaStethoscope,
  FaFileAlt,
  FaUserMd,
  FaDownload,
  FaPrescriptionBottle,
} from 'react-icons/fa'

/** Shared appointment fields */
type AppointmentBase = {
  id: string
  doctorId: string
  doctorName: string
  specialty: string
  date: string
  time: string
  duration: number
  status: 'upcoming' | 'completed' | 'cancelled'
  reason: string
  notes?: string
}

type VideoAppointment = AppointmentBase & {
  type: 'video'
  roomId: string
}

type InPersonAppointment = AppointmentBase & {
  type: 'in-person'
  location: string
}

type Appointment = VideoAppointment | InPersonAppointment

interface Props {
  patientData: Patient
  onVideoCall: (appointment?: VideoAppointment) => void
}

const DoctorConsultations: React.FC<Props> = ({ patientData, onVideoCall }) => {
  const upcoming = (patientData.upcomingAppointments ?? []) as Appointment[]
  const past = (patientData.pastAppointments ?? []) as Appointment[]
  const allAppointments: Appointment[] = [...upcoming, ...past]

  const handleVideoCall = (appointment: VideoAppointment) => {
    if (appointment.roomId) {
      localStorage.setItem(`current_video_appointment`, JSON.stringify(appointment))
      onVideoCall(appointment)
    } else {
      alert('This appointment does not have a room ID for video consultation')
    }
  }

  // Map appointments to BookingItem format
  const bookingItems: BookingItem[] = allAppointments.map((apt) => ({
    id: apt.id,
    providerName: apt.doctorName,
    date: apt.date,
    time: apt.time,
    status: apt.status,
    type: apt.type,
    service: apt.specialty,
    notes: apt.reason + (apt.notes ? ` | ${apt.notes}` : ''),
    details: [
      { label: 'Specialty', value: apt.specialty },
      { label: 'Duration', value: `${apt.duration} minutes` },
      { label: 'Type', value: apt.type === 'video' ? 'Video Consultation' : 'In-Person Visit' },
      ...(apt.type === 'in-person' ? [{ label: 'Location', value: apt.location }] : []),
      ...(apt.type === 'video' && apt.roomId ? [{ label: 'Room ID', value: apt.roomId }] : []),
    ],
  }))

  const handleBookingVideoCall = (booking: BookingItem) => {
    const apt = allAppointments.find(a => a.id === booking.id)
    if (apt && apt.type === 'video' && 'roomId' in apt) {
      handleVideoCall(apt as VideoAppointment)
    }
  }

  if (allAppointments.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center border border-blue-200">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
          <FaUserMd className="text-blue-500 text-2xl sm:text-3xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Consultations Found</h3>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">You have not booked any consultations yet. Start your health journey today!</p>
        <Link href="/search/doctors" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base w-fit">
          <FaPlus />
          Book Your First Consultation
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 flex items-center">
              <FaStethoscope className="mr-2 sm:mr-3" />
              Doctor Consultations
            </h2>
            <p className="opacity-90 text-xs sm:text-sm">Manage your appointments and medical consultations</p>
          </div>
          <Link
            href="/search/doctors"
            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition flex items-center gap-2 text-sm w-fit"
          >
            <FaPlus />
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Bookings List (Reusable Component) */}
      <BookingsList
        bookings={bookingItems}
        providerLabel="Doctor"
        accentColor="blue"
        onVideoCall={handleBookingVideoCall}
        emptyMessage="No doctor consultations yet."
      />

      {/* Video Call History */}
      {patientData.videoCallHistory && patientData.videoCallHistory.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-green-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FaVideo className="mr-2 text-green-500" />
            Video Call History
          </h3>
          <div className="space-y-2.5 sm:space-y-3">
            {patientData.videoCallHistory.map((call) => (
              <div key={call.id} className="bg-gradient-to-r from-white/70 to-green-50/70 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaVideo className="text-green-600 text-sm sm:text-base" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{call.withName}</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(call.date).toLocaleDateString()} • {call.startTime} - {call.endTime}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">Duration: {call.duration} minutes</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                      call.callQuality === 'excellent' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' :
                      call.callQuality === 'good' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800' :
                      call.callQuality === 'fair' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800' :
                      'bg-gradient-to-r from-red-100 to-pink-100 text-red-800'
                    }`}>
                      {call.callQuality} quality
                    </span>
                    {call.recording && (
                      <div className="mt-1">
                        <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <FaDownload />
                          Recording
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {call.notes && (
                  <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600">
                      <strong>Notes:</strong> {call.notes}
                    </p>
                  </div>
                )}
                {call.prescription && (
                  <div className="mt-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <p className="text-xs text-purple-700">
                      <FaPrescriptionBottle className="inline mr-1" />
                      Prescription issued during this call
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <a href="/search/doctors" className="bg-gradient-to-br from-indigo-400/20 to-purple-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-indigo-400/30 hover:to-purple-400/30 transition text-left block">
            <FaPlus className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-xs sm:text-sm">Book Appointment</p>
            <p className="text-xs opacity-90">Schedule with doctor</p>
          </a>

          <button
            onClick={() => {
              const nextVideoAppointment = (patientData.upcomingAppointments as Appointment[] | undefined)
                ?.find((apt): apt is VideoAppointment => apt.type === 'video' && 'roomId' in apt && Boolean(apt.roomId))
              if (nextVideoAppointment) {
                handleVideoCall(nextVideoAppointment)
              } else {
                alert('No upcoming video consultations found')
              }
            }}
            className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-green-400/30 hover:to-emerald-400/30 transition text-left"
          >
            <FaVideo className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-xs sm:text-sm">Join Video Call</p>
            <p className="text-xs opacity-90">Connect to consultation</p>
          </button>

          <button className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-blue-400/30 hover:to-cyan-400/30 transition text-left">
            <FaFileAlt className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-xs sm:text-sm">View Records</p>
            <p className="text-xs opacity-90">Medical history</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorConsultations
