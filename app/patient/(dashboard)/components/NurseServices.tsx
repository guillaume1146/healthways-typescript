import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Patient } from '@/lib/data/patients'
import WeeklySlotPicker from '@/components/booking/WeeklySlotPicker'
import BookingsList, { BookingItem } from '@/components/booking/BookingsList'
import {
  FaUserNurse,
  FaHome,
  FaHospital,
  FaVideo,
  FaComments,
  FaStethoscope,
  FaPlus,
  FaCheckCircle,
  FaTimes,
  FaExternalLinkAlt,
  FaSpinner,
  FaMedkit,
  FaCalendarPlus,
  FaUserClock,
  FaClipboardList,
  FaHistory,
} from 'react-icons/fa'

interface Props {
  patientData: Patient
  onVideoCall: () => void
}

interface AvailableNurse {
  id: string
  userId: string
  name: string
  profileImage: string | null
  experience: string
  specializations: string[]
}

const NurseServices: React.FC<Props> = ({ patientData, onVideoCall }) => {
  const [showBookingForm, setShowBookingForm] = useState(false)

  // Booking form state
  const [availableNurses, setAvailableNurses] = useState<AvailableNurse[]>([])
  const [selectedNurseId, setSelectedNurseId] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [consultationType, setConsultationType] = useState<'home_visit' | 'in_person' | 'video'>('home_visit')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [loadingNurses, setLoadingNurses] = useState(false)

  const nurseServices = [
    'Blood pressure monitoring',
    'Medication administration',
    'Wound care and dressing',
    'Injection services',
    'Health assessment',
    'Post-surgery care',
    'Diabetes management',
    'Elderly care assistance',
    'Health education',
    'Vital signs monitoring'
  ]

  // Fetch available nurses
  useEffect(() => {
    if (!showBookingForm) return
    const fetchNurses = async () => {
      setLoadingNurses(true)
      try {
        const res = await fetch('/api/nurses/available')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            setAvailableNurses(json.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch available nurses:', error)
      } finally {
        setLoadingNurses(false)
      }
    }
    fetchNurses()
  }, [showBookingForm])

  const resetBookingForm = () => {
    setSelectedNurseId('')
    setSelectedService('')
    setConsultationType('home_visit')
    setScheduledDate('')
    setScheduledTime('')
    setNotes('')
    setSubmitError('')
    setSubmitSuccess(false)
  }

  const handleBookingSubmit = async () => {
    if (!selectedNurseId || !selectedService || !scheduledDate || !scheduledTime) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/bookings/nurse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nurseId: selectedNurseId,
          consultationType,
          scheduledDate,
          scheduledTime,
          reason: selectedService,
          notes: notes || undefined,
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

  const selectedNurse = availableNurses.find(n => n.id === selectedNurseId || n.userId === selectedNurseId)

  const canSubmit = selectedNurseId && selectedService && scheduledDate && scheduledTime && !isSubmitting

  // Map nurse bookings to BookingItem format
  const bookingItems: BookingItem[] = (patientData.nurseBookings || []).map((b) => ({
    id: b.id,
    providerName: b.nurseName,
    date: b.date,
    time: b.time,
    status: b.status,
    type: b.type,
    service: b.service,
    notes: b.notes,
    details: [
      { label: 'Nurse ID', value: b.nurseId },
      { label: 'Service Type', value: (b.type || '').replace('_', ' ') },
    ],
  }))

  const renderBookingForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-pink-50 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-5 md:p-6 border-b border-pink-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Book Nurse Service</h3>
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
              <p className="text-gray-600 text-sm">Your nurse booking request has been sent. You will be notified once the nurse confirms.</p>
            </div>
          ) : (
            <>
              {/* Step 1: Service Selection */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Select Service <span className="text-red-500">*</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {nurseServices.map((service, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedService(service)}
                      className={`p-2.5 sm:p-3 border rounded-lg text-left transition ${
                        selectedService === service
                          ? 'bg-pink-100 border-pink-500 ring-2 ring-pink-300'
                          : 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 hover:border-pink-300 hover:from-pink-100 hover:to-purple-100'
                      }`}
                    >
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">{service}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Nurse */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Select Nurse <span className="text-red-500">*</span>
                </h4>
                {loadingNurses ? (
                  <div className="flex items-center gap-2 py-4 text-gray-500">
                    <FaSpinner className="animate-spin" />
                    <span className="text-sm">Loading available nurses...</span>
                  </div>
                ) : availableNurses.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No nurses available at the moment.</p>
                ) : (
                  <div className="space-y-2">
                    {availableNurses.map((nurse) => (
                      <button
                        key={nurse.id}
                        onClick={() => setSelectedNurseId(nurse.userId)}
                        className={`w-full p-3 sm:p-4 border rounded-lg sm:rounded-xl text-left transition ${
                          selectedNurseId === nurse.userId
                            ? 'bg-pink-100 border-pink-500 ring-2 ring-pink-300'
                            : 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 hover:border-pink-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                            {nurse.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 text-sm sm:text-base">{nurse.name}</h5>
                            <p className="text-xs sm:text-sm text-gray-600">{nurse.experience} experience</p>
                            {nurse.specializations.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {nurse.specializations.slice(0, 3).map((spec, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs">
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {selectedNurseId === nurse.userId && (
                            <FaCheckCircle className="text-pink-500 text-lg flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 3: Consultation Type */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Service Type</h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: 'home_visit' as const, label: 'Home Visit', icon: FaHome },
                    { value: 'in_person' as const, label: 'Clinic', icon: FaHospital },
                    { value: 'video' as const, label: 'Video Call', icon: FaVideo },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setConsultationType(type.value)}
                      className={`p-3 border rounded-lg text-center transition ${
                        consultationType === type.value
                          ? 'bg-pink-100 border-pink-500 ring-2 ring-pink-300'
                          : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      <type.icon className={`mx-auto text-lg mb-1 ${consultationType === type.value ? 'text-pink-600' : 'text-gray-400'}`} />
                      <p className="text-xs sm:text-sm font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Weekly Time Slot Selection */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Select Time Slot <span className="text-red-500">*</span>
                </h4>
                {!selectedNurseId ? (
                  <p className="text-sm text-gray-400 py-3">Select a nurse first to see available times</p>
                ) : (
                  <WeeklySlotPicker
                    providerId={selectedNurseId}
                    providerType="nurse"
                    onSelect={(date, time) => { setScheduledDate(date); setScheduledTime(time) }}
                    selectedDate={scheduledDate}
                    selectedTime={scheduledTime}
                    accentColor="pink"
                  />
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Special Instructions (optional)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-sm"
                  placeholder="Any specific requirements or notes for the nurse..."
                />
              </div>

              {/* Summary */}
              {canSubmit && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Booking Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div><span className="text-gray-500">Nurse:</span> <span className="font-medium">{selectedNurse?.name}</span></div>
                    <div><span className="text-gray-500">Service:</span> <span className="font-medium">{selectedService}</span></div>
                    <div><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(scheduledDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>
                    <div><span className="text-gray-500">Time:</span> <span className="font-medium">{scheduledTime}</span></div>
                    <div><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{consultationType.replace('_', ' ')}</span></div>
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
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  if (!patientData.nurseBookings || patientData.nurseBookings.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Empty State */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center border border-pink-200">
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
            <FaUserNurse className="text-pink-500 text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Nurse Services</h3>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">Professional nursing care at your home or clinic</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowBookingForm(true)}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center gap-2 justify-center text-sm sm:text-base"
            >
              <FaPlus />
              Book Nurse Service
            </button>
            <Link
              href="/search/nurses"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 justify-center text-sm sm:text-base"
            >
              <FaExternalLinkAlt />
              Find & Book a Nurse
            </Link>
          </div>
        </div>

        {/* Available Services */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-pink-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center">
            <FaMedkit className="mr-2 text-pink-500" />
            Available Nursing Services
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {nurseServices.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-white/70 to-pink-50/70 border border-pink-200 rounded-lg sm:rounded-xl hover:border-pink-300 hover:from-pink-100 hover:to-purple-100 transition cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <FaStethoscope className="text-pink-600 text-sm sm:text-base" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">{service}</p>
                  <p className="text-xs text-gray-600">Professional nursing care</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showBookingForm && renderBookingForm()}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 flex items-center">
              <FaUserNurse className="mr-2 sm:mr-3" />
              Nurse Services
            </h2>
            <p className="opacity-90 text-xs sm:text-sm">Professional nursing care and health support</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBookingForm(true)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition flex items-center gap-2 text-sm"
            >
              <FaPlus />
              Book Service
            </button>
            <Link
              href="/search/nurses"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition flex items-center gap-2 text-sm"
            >
              <FaExternalLinkAlt />
              Find Nurse
            </Link>
          </div>
        </div>
      </div>

      {/* Bookings List (Reusable Component) */}
      <BookingsList
        bookings={bookingItems}
        providerLabel="Nurse"
        accentColor="pink"
        onVideoCall={() => onVideoCall()}
        emptyMessage="No nurse bookings yet."
      />

      {/* Nurse Chat Messages */}
      {patientData.chatHistory?.nurses && patientData.chatHistory.nurses.length > 0 && (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-pink-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FaComments className="mr-2 text-pink-500" />
            Recent Nurse Communications
          </h3>
          <div className="space-y-2.5 sm:space-y-3">
            {patientData.chatHistory.nurses.map((nurseChat) => (
              <div key={nurseChat.nurseId} className="bg-gradient-to-r from-white/70 to-pink-50/70 border border-pink-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {(nurseChat.nurseName || 'N').split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{nurseChat.nurseName}</h4>
                      <p className="text-xs text-gray-500">{nurseChat.lastMessageTime}</p>
                    </div>
                  </div>
                  {nurseChat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full">
                      {nurseChat.unreadCount} unread
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 bg-gradient-to-r from-white to-pink-50 rounded-lg p-2.5 sm:p-3 border border-pink-100">
                  {nurseChat.lastMessage}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-gradient-to-br from-pink-400/20 to-purple-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-pink-400/30 hover:to-purple-400/30 transition text-left"
          >
            <FaCalendarPlus className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm md:text-base">Book Service</p>
            <p className="text-xs opacity-80">Schedule visit</p>
          </button>

          <button className="bg-gradient-to-br from-red-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-red-400/30 hover:to-pink-400/30 transition text-left">
            <FaUserClock className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm md:text-base">Emergency</p>
            <p className="text-xs opacity-80">24/7 available</p>
          </button>

          <button className="bg-gradient-to-br from-blue-400/20 to-indigo-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-blue-400/30 hover:to-indigo-400/30 transition text-left">
            <FaClipboardList className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm md:text-base">Care Plans</p>
            <p className="text-xs opacity-80">View plans</p>
          </button>

          <button className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-green-400/30 hover:to-emerald-400/30 transition text-left">
            <FaHistory className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm md:text-base">History</p>
            <p className="text-xs opacity-80">Past services</p>
          </button>
        </div>
      </div>

      {showBookingForm && renderBookingForm()}
    </div>
  )
}

export default NurseServices
