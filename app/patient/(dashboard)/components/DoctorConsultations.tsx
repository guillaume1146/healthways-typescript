import React, { useState, useEffect } from 'react'
import { Patient } from '@/lib/data/patients'
import BookingsList, { BookingItem } from '@/components/booking/BookingsList'
import WeeklySlotPicker from '@/components/booking/WeeklySlotPicker'
import ProviderPageHeader from '@/components/booking/ProviderPageHeader'
import ProviderSearchSelect, { ProviderOption } from '@/components/booking/ProviderSearchSelect'
import {
  FaVideo,
  FaPlus,
  FaStethoscope,
  FaUserMd,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaHome,
  FaHospital,
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

interface AvailableDoctor {
  id: string
  userId: string
  name: string
  profileImage: string | null
  specialty: string[]
  consultationFee: number | null
  rating: number | null
  location: string | null
}

const DoctorConsultations: React.FC<Props> = ({ patientData, onVideoCall }) => {
  const [showBookingForm, setShowBookingForm] = useState(false)

  // Booking form state
  const [availableDoctors, setAvailableDoctors] = useState<AvailableDoctor[]>([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [consultationType, setConsultationType] = useState<'in_person' | 'home_visit' | 'video'>('in_person')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const upcoming = (patientData.upcomingAppointments ?? []) as Appointment[]
  const past = (patientData.pastAppointments ?? []) as Appointment[]
  const allAppointments: Appointment[] = [...upcoming, ...past]

  // Fetch available doctors when booking form opens
  useEffect(() => {
    if (!showBookingForm) return
    const fetchDoctors = async () => {
      setLoadingDoctors(true)
      try {
        const res = await fetch('/api/doctors/available')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            setAvailableDoctors(json.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch available doctors:', error)
      } finally {
        setLoadingDoctors(false)
      }
    }
    fetchDoctors()
  }, [showBookingForm])

  const resetBookingForm = () => {
    setSelectedDoctorId('')
    setConsultationType('in_person')
    setScheduledDate('')
    setScheduledTime('')
    setReason('')
    setNotes('')
    setSubmitError('')
    setSubmitSuccess(false)
  }

  const handleBookingSubmit = async () => {
    if (!selectedDoctorId || !scheduledDate || !scheduledTime || !reason.trim()) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/bookings/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          consultationType,
          scheduledDate,
          scheduledTime,
          reason: reason.trim(),
          notes: notes.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          setShowBookingForm(false)
          resetBookingForm()
          window.location.reload()
        }, 2000)
      } else {
        setSubmitError(data.message || 'Booking failed. Please try again.')
      }
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedDoctor = availableDoctors.find(d => d.id === selectedDoctorId || d.userId === selectedDoctorId)
  const canSubmit = selectedDoctorId && scheduledDate && scheduledTime && reason.trim() && !isSubmitting

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

  const renderBookingForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-5 md:p-6 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Book Doctor Consultation</h3>
            <button
              onClick={() => { setShowBookingForm(false); resetBookingForm() }}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-500 text-3xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Booking Submitted!</h4>
              <p className="text-gray-600 text-sm">Your consultation request has been sent. You will be notified once the doctor confirms.</p>
            </div>
          ) : (
            <>
              {/* Step 1: Select Doctor */}
              <ProviderSearchSelect
                providers={availableDoctors.map((d): ProviderOption => ({
                  id: d.id,
                  userId: d.userId,
                  name: d.name,
                  subtitle: d.specialty.join(', '),
                  tags: [
                    ...(d.rating ? [`★ ${d.rating}`] : []),
                    ...(d.consultationFee ? [`Rs ${d.consultationFee}`] : []),
                    ...(d.location ? [d.location] : []),
                  ],
                }))}
                selectedId={selectedDoctorId}
                onSelect={setSelectedDoctorId}
                loading={loadingDoctors}
                label="Select Doctor"
                placeholder="Search doctors by name, specialty..."
                accentColor="blue"
                avatarGradient="from-blue-400 to-indigo-600"
              />

              {/* Step 2: Consultation Type */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Consultation Type</h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: 'in_person' as const, label: 'In-Person', icon: FaHospital },
                    { value: 'home_visit' as const, label: 'Home Visit', icon: FaHome },
                    { value: 'video' as const, label: 'Video Call', icon: FaVideo },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setConsultationType(type.value)}
                      className={`p-3 border rounded-lg text-center transition ${
                        consultationType === type.value
                          ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <type.icon className={`mx-auto text-lg mb-1 ${consultationType === type.value ? 'text-blue-600' : 'text-gray-400'}`} />
                      <p className="text-xs sm:text-sm font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Weekly Time Slot Selection */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Select Time Slot <span className="text-red-500">*</span>
                </h4>
                {!selectedDoctorId ? (
                  <p className="text-sm text-gray-400 py-3">Select a doctor first to see available times</p>
                ) : (
                  <WeeklySlotPicker
                    providerId={selectedDoctorId}
                    providerType="doctor"
                    onSelect={(date, time) => { setScheduledDate(date); setScheduledTime(time) }}
                    selectedDate={scheduledDate}
                    selectedTime={scheduledTime}
                    accentColor="blue"
                  />
                )}
              </div>

              {/* Step 4: Reason */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="e.g., Annual checkup, headache, follow-up..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Additional Notes (optional)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Any specific symptoms or information for the doctor..."
                />
              </div>

              {/* Summary */}
              {canSubmit && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Booking Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div><span className="text-gray-500">Doctor:</span> <span className="font-medium">{selectedDoctor?.name}</span></div>
                    <div><span className="text-gray-500">Specialty:</span> <span className="font-medium">{selectedDoctor?.specialty.join(', ')}</span></div>
                    <div><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(scheduledDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>
                    <div><span className="text-gray-500">Time:</span> <span className="font-medium">{scheduledTime}</span></div>
                    <div><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{consultationType.replace('_', ' ')}</span></div>
                    <div><span className="text-gray-500">Reason:</span> <span className="font-medium">{reason}</span></div>
                  </div>
                </div>
              )}

              {/* Error */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  {submitError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => { setShowBookingForm(false); resetBookingForm() }}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-lg hover:from-gray-200 hover:to-slate-200 transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={!canSubmit}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Book Consultation'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  if (allAppointments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center border border-blue-200">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
            <FaUserMd className="text-blue-500 text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Consultations Found</h3>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">You have not booked any consultations yet. Start your health journey today!</p>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base w-fit"
          >
            <FaPlus />
            Book Your First Consultation
          </button>
        </div>
        {showBookingForm && renderBookingForm()}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <ProviderPageHeader
        icon={FaStethoscope}
        title="Doctor Consultations"
        subtitle="Manage your appointments and medical consultations"
        gradient="from-blue-500 via-indigo-500 to-purple-600"
        onBook={() => setShowBookingForm(true)}
        bookLabel="Book Appointment"
      />

      {/* Bookings List (Reusable Component) */}
      <BookingsList
        bookings={bookingItems}
        providerLabel="Doctor"
        accentColor="blue"
        onVideoCall={handleBookingVideoCall}
        emptyMessage="No doctor consultations yet."
      />

      {showBookingForm && renderBookingForm()}
    </div>
  )
}

export default DoctorConsultations
