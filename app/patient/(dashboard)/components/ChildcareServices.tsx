import React, { useState, useEffect } from 'react'
import { Patient } from '@/lib/data/patients'
import WeeklySlotPicker from '@/components/booking/WeeklySlotPicker'
import BookingsList, { BookingItem } from '@/components/booking/BookingsList'
import ProviderPageHeader from '@/components/booking/ProviderPageHeader'
import ProviderSearchSelect, { ProviderOption } from '@/components/booking/ProviderSearchSelect'
import {
  FaBaby,
  FaMoon,
  FaVideo,
  FaComments,
  FaPlus,
  FaCheckCircle,
  FaTimes,
  FaHeart,
  FaGamepad,
  FaBook,
  FaPaintBrush,
  FaMusic,
  FaCertificate,
  FaAward,
  FaShieldAlt,
  FaFirstAid,
  FaLanguage,
  FaSun,
  FaUtensils,
  FaBed,
  FaHome,
  FaUserCheck,
  FaCameraRetro,
  FaSpinner,
  FaHospital,
} from 'react-icons/fa'

interface Props {
  patientData: Patient
  onVideoCall: () => void
}

interface AvailableNanny {
  id: string
  userId: string
  name: string
  profileImage: string | null
  experience: string
  certifications: string[]
}

const ChildcareServices: React.FC<Props> = ({ patientData, onVideoCall }) => {
  const [showBookingForm, setShowBookingForm] = useState(false)

  // Booking form state
  const [availableNannies, setAvailableNannies] = useState<AvailableNanny[]>([])
  const [loadingNannies, setLoadingNannies] = useState(false)
  const [selectedNannyId, setSelectedNannyId] = useState('')
  const [careType, setCareType] = useState<'regular' | 'overnight'>('regular')
  const [consultationType, setConsultationType] = useState<'home_visit' | 'in_person' | 'video'>('home_visit')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [duration, setDuration] = useState(2)
  const [childrenNames, setChildrenNames] = useState<string[]>([''])
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const childcareActivities = [
    { icon: FaBook, name: 'Reading & Storytelling', description: 'Age-appropriate books and interactive stories' },
    { icon: FaPaintBrush, name: 'Arts & Crafts', description: 'Creative activities to develop fine motor skills' },
    { icon: FaMusic, name: 'Music & Dancing', description: 'Musical activities for cognitive development' },
    { icon: FaGamepad, name: 'Educational Games', description: 'Learning through play and structured activities' },
    { icon: FaUtensils, name: 'Meal Preparation', description: 'Healthy meal planning and preparation' },
    { icon: FaBed, name: 'Sleep Routines', description: 'Establishing healthy sleep patterns' },
    { icon: FaFirstAid, name: 'Safety & First Aid', description: 'Comprehensive safety and emergency care' },
    { icon: FaLanguage, name: 'Language Development', description: 'Multilingual exposure and communication skills' }
  ]

  // Fetch available nannies
  useEffect(() => {
    const fetchNannies = async () => {
      setLoadingNannies(true)
      try {
        const res = await fetch('/api/nannies/available')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            setAvailableNannies(json.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch available nannies:', error)
      } finally {
        setLoadingNannies(false)
      }
    }
    fetchNannies()
  }, [])

  const resetBookingForm = () => {
    setSelectedNannyId('')
    setCareType('regular')
    setConsultationType('home_visit')
    setScheduledDate('')
    setScheduledTime('')
    setDuration(2)
    setChildrenNames([''])
    setSpecialInstructions('')
    setSubmitError('')
    setSubmitSuccess(false)
  }

  const handleBookingSubmit = async () => {
    const validChildren = childrenNames.filter(n => n.trim())
    if (!selectedNannyId || !scheduledDate || !scheduledTime || validChildren.length === 0) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/bookings/nanny', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nannyId: selectedNannyId,
          consultationType,
          scheduledDate,
          scheduledTime,
          reason: `${careType === 'overnight' ? 'Overnight' : 'Regular'} childcare`,
          notes: specialInstructions || undefined,
          duration: careType === 'overnight' ? 720 : duration * 60,
          children: validChildren,
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

  const selectedNanny = availableNannies.find(n => n.id === selectedNannyId || n.userId === selectedNannyId)
  const validChildren = childrenNames.filter(n => n.trim())
  const canSubmit = selectedNannyId && scheduledDate && scheduledTime && validChildren.length > 0 && !isSubmitting

  // Map childcare bookings to BookingItem format
  const bookingItems: BookingItem[] = (patientData.childcareBookings || []).map((b) => ({
    id: b.id,
    providerName: b.nannyName,
    date: b.date,
    time: b.time,
    status: b.status,
    type: b.type,
    service: `${b.type === 'overnight' ? 'Overnight' : 'Regular'} Care - ${b.children.length} ${b.children.length === 1 ? 'child' : 'children'}`,
    notes: b.specialInstructions,
    details: [
      { label: 'Children', value: b.children.join(', ') },
      { label: 'Duration', value: `${b.duration} hours` },
      { label: 'Nanny ID', value: b.nannyId },
      { label: 'Care Type', value: b.type === 'overnight' ? 'Overnight' : 'Regular' },
    ],
  }))

  const renderBookingForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-5 md:p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Book Childcare Service</h3>
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
              <p className="text-gray-600 text-sm">Your childcare booking request has been sent. You will be notified once the nanny confirms.</p>
            </div>
          ) : (
            <>
              {/* Service Type Selection */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                  Select Service Type <span className="text-red-500">*</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => setCareType('regular')}
                    className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 text-left transition ${
                      careType === 'regular'
                        ? 'bg-yellow-50 border-yellow-500 ring-2 ring-yellow-300'
                        : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <FaSun className={`text-lg sm:text-xl ${careType === 'regular' ? 'text-yellow-600' : 'text-yellow-500'}`} />
                      <h5 className="font-semibold text-gray-900 text-sm sm:text-base">Regular Care</h5>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Daytime childcare</p>
                  </button>

                  <button
                    onClick={() => setCareType('overnight')}
                    className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 text-left transition ${
                      careType === 'overnight'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-300'
                        : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <FaMoon className={`text-lg sm:text-xl ${careType === 'overnight' ? 'text-purple-600' : 'text-purple-500'}`} />
                      <h5 className="font-semibold text-gray-900 text-sm sm:text-base">Overnight Care</h5>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">12+ hours care</p>
                  </button>
                </div>
              </div>

              {/* Choose Nanny */}
              <ProviderSearchSelect
                providers={availableNannies.map((n): ProviderOption => ({
                  id: n.id,
                  userId: n.userId,
                  name: n.name,
                  subtitle: `${n.experience} experience`,
                  tags: n.certifications.slice(0, 3),
                }))}
                selectedId={selectedNannyId}
                onSelect={setSelectedNannyId}
                loading={loadingNannies}
                label="Choose Your Nanny"
                placeholder="Search nannies by name, certification..."
                accentColor="purple"
                avatarGradient="from-purple-400 to-pink-600"
              />

              {/* Visit Type */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Visit Type</h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: 'home_visit' as const, label: 'Home Visit', icon: FaHome },
                    { value: 'in_person' as const, label: 'Facility', icon: FaHospital },
                    { value: 'video' as const, label: 'Video Call', icon: FaVideo },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setConsultationType(type.value)}
                      className={`p-3 border rounded-lg text-center transition ${
                        consultationType === type.value
                          ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-300'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <type.icon className={`mx-auto text-lg mb-1 ${consultationType === type.value ? 'text-purple-600' : 'text-gray-400'}`} />
                      <p className="text-xs sm:text-sm font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration (regular only) */}
              {careType === 'regular' && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                  >
                    <option value="2">2 hours</option>
                    <option value="4">4 hours</option>
                    <option value="6">6 hours</option>
                    <option value="8">8 hours</option>
                  </select>
                </div>
              )}

              {/* Weekly Time Slot Selection */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Select Time Slot <span className="text-red-500">*</span>
                </h4>
                {!selectedNannyId ? (
                  <p className="text-sm text-gray-400 py-3">Select a nanny first to see available times</p>
                ) : (
                  <WeeklySlotPicker
                    providerId={selectedNannyId}
                    providerType="nanny"
                    onSelect={(date, time) => { setScheduledDate(date); setScheduledTime(time) }}
                    selectedDate={scheduledDate}
                    selectedTime={scheduledTime}
                    accentColor="purple"
                  />
                )}
              </div>

              {/* Children Information */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Children Names <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {childrenNames.map((name, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          const updated = [...childrenNames]
                          updated[index] = e.target.value
                          setChildrenNames(updated)
                        }}
                        placeholder={`Child ${index + 1} name`}
                        className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                      />
                      {childrenNames.length > 1 && (
                        <button
                          onClick={() => setChildrenNames(childrenNames.filter((_, i) => i !== index))}
                          className="px-3 text-red-400 hover:text-red-600"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setChildrenNames([...childrenNames, ''])}
                    className="text-purple-600 hover:text-purple-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                  >
                    <FaPlus />
                    Add Another Child
                  </button>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Special Instructions (optional)</label>
                <textarea
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                  placeholder="Any allergies, special needs, dietary restrictions, favorite activities, bedtime routines..."
                />
              </div>

              {/* Summary */}
              {canSubmit && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Booking Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div><span className="text-gray-500">Nanny:</span> <span className="font-medium">{selectedNanny?.name}</span></div>
                    <div><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{careType} Care</span></div>
                    <div><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(scheduledDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>
                    <div><span className="text-gray-500">Time:</span> <span className="font-medium">{scheduledTime}</span></div>
                    <div><span className="text-gray-500">Duration:</span> <span className="font-medium">{careType === 'overnight' ? '12 hours' : `${duration} hours`}</span></div>
                    <div><span className="text-gray-500">Children:</span> <span className="font-medium">{validChildren.join(', ')}</span></div>
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
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={!canSubmit}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Book Childcare'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  if (!patientData.childcareBookings || patientData.childcareBookings.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Empty State */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center border border-purple-200">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
            <FaBaby className="text-purple-500 text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Childcare Services</h3>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">Professional childcare services for your peace of mind</p>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center gap-2 justify-center text-sm sm:text-base"
          >
            <FaPlus />
            Book Childcare Service
          </button>
        </div>

        {/* Service Features */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-pink-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center">
            <FaHeart className="mr-2 text-pink-500" />
            Our Childcare Activities
          </h3>

          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 md:gap-4">
            {childcareActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-white/70 to-purple-50/70 border border-purple-200 rounded-lg sm:rounded-xl hover:border-purple-300 hover:from-white/90 hover:to-purple-100/90 transition">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <activity.icon className="text-purple-600 text-sm sm:text-base" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">{activity.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Nannies */}
        {availableNannies.length > 0 && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-yellow-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center">
              <FaAward className="mr-2 text-yellow-500" />
              Our Certified Nannies
            </h3>

            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 md:gap-6">
              {availableNannies.map((nanny) => (
                <div key={nanny.id} className="bg-gradient-to-br from-white/70 to-orange-50/70 border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg mx-auto mb-2 sm:mb-3">
                      {nanny.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{nanny.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{nanny.experience} experience</p>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Certifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {nanny.certifications.slice(0, 2).map((cert, index) => (
                          <span key={index} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded text-xs">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => { setSelectedNannyId(nanny.userId); setShowBookingForm(true) }}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-xs sm:text-sm"
                    >
                      Book with {nanny.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Features */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
            <FaShieldAlt className="mr-2" />
            Safety & Trust Features
          </h3>
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <FaUserCheck className="text-xl sm:text-2xl mb-2" />
              <p className="font-medium text-sm sm:text-base">Background Verified</p>
              <p className="text-xs sm:text-sm opacity-90">All nannies thoroughly screened</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <FaFirstAid className="text-xl sm:text-2xl mb-2" />
              <p className="font-medium text-sm sm:text-base">First Aid Certified</p>
              <p className="text-xs sm:text-sm opacity-90">CPR and emergency training</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <FaCameraRetro className="text-xl sm:text-2xl mb-2" />
              <p className="font-medium text-sm sm:text-base">Photo Updates</p>
              <p className="text-xs sm:text-sm opacity-90">Regular activity photos</p>
            </div>
          </div>
        </div>

        {showBookingForm && renderBookingForm()}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <ProviderPageHeader
        icon={FaBaby}
        title="Childcare Services"
        subtitle="Professional childcare for your little ones"
        gradient="from-purple-500 via-pink-500 to-purple-600"
        onBook={() => setShowBookingForm(true)}
        bookLabel="Book Service"
      />

      {/* Bookings List (Reusable Component) */}
      <BookingsList
        bookings={bookingItems}
        providerLabel="Nanny"
        accentColor="purple"
        onVideoCall={() => onVideoCall()}
        emptyMessage="No childcare bookings yet."
      />

      {/* Nanny Chat Messages */}
      {patientData.chatHistory?.nannies && patientData.chatHistory.nannies.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-purple-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FaComments className="mr-2 text-purple-500" />
            Recent Nanny Communications
          </h3>
          <div className="space-y-2.5 sm:space-y-3">
            {patientData.chatHistory.nannies.map((nannyChat) => (
              <div key={nannyChat.nannyId} className="bg-gradient-to-r from-white/70 to-purple-50/70 border border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {(nannyChat.nannyName || 'N').split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{nannyChat.nannyName}</h4>
                      <p className="text-xs text-gray-500">{nannyChat.lastMessageTime}</p>
                    </div>
                  </div>
                  {nannyChat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full">
                      {nannyChat.unreadCount} unread
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 bg-gradient-to-r from-white to-purple-50 rounded-lg p-2.5 sm:p-3 border">
                  {nannyChat.lastMessage}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBookingForm && renderBookingForm()}
    </div>
  )
}

export default ChildcareServices
