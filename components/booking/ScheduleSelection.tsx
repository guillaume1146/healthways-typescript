'use client'

import { useState, useEffect } from 'react'
import { FaVideo, FaUser, FaCalendarAlt, FaSpinner } from 'react-icons/fa'
import type { BookingData } from '@/types/booking'

interface ScheduleSelectionProps {
  bookingData: BookingData
  onUpdate: (updates: Partial<BookingData>) => void
  onNext: () => void
  onBack: () => void
}

interface TimeSlot {
  time: string
  available: boolean
  type: 'regular' | 'urgent' | 'priority'
}

export default function ScheduleSelection({
  bookingData,
  onUpdate,
  onNext,
  onBack
}: ScheduleSelectionProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Fetch available time slots when date changes
  // Uses the unified available-slots endpoint that checks provider availability
  // settings AND filters out already-booked slots
  useEffect(() => {
    if (!bookingData.date || !bookingData.doctor?.id) return

    const fetchSlots = async () => {
      setLoadingSlots(true)
      try {
        const res = await fetch(
          `/api/bookings/available-slots?providerId=${bookingData.doctor.id}&date=${bookingData.date}&providerType=doctor`
        )
        if (res.ok) {
          const data = await res.json()
          if (data.success && Array.isArray(data.slots) && data.slots.length > 0) {
            setTimeSlots(data.slots.map((slot: string) => {
              const [hours, minutes] = slot.split(':')
              const h = parseInt(hours, 10)
              const ampm = h >= 12 ? 'PM' : 'AM'
              const displayHour = h % 12 || 12
              const formattedTime = `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`
              return {
                time: formattedTime,
                available: true,
                type: 'regular' as const,
              }
            }))
          } else {
            setTimeSlots(generateDefaultSlots())
          }
        } else {
          setTimeSlots(generateDefaultSlots())
        }
      } catch {
        setTimeSlots(generateDefaultSlots())
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [bookingData.date, bookingData.doctor?.id])

  const handleTimeSelect = (time: string) => {
    onUpdate({ time })
  }

  const handleDateChange = (date: string) => {
    onUpdate({ date, time: '' })
  }

  const handleTypeChange = (type: 'video' | 'in-person') => {
    onUpdate({ type })
  }

  const getTimeSlotStyle = (slot: TimeSlot, isSelected: boolean) => {
    if (!slot.available) return 'bg-gray-100 text-gray-400 cursor-not-allowed'
    if (isSelected) return 'bg-blue-600 text-white border-blue-600'

    switch (slot.type) {
      case 'urgent':
        return 'border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500'
      case 'priority':
        return 'border-green-300 text-green-600 hover:bg-green-50 hover:border-green-500'
      default:
        return 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Date & Type Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Select Date & Type</h3>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Consultation Date
            </label>
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-4">
              Consultation Type
            </label>
            <div className="space-y-3">
              <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                bookingData.type === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="video"
                  checked={bookingData.type === 'video'}
                  onChange={(e) => handleTypeChange(e.target.value as 'video')}
                  className="mr-4"
                />
                <FaVideo className="text-green-600 text-xl mr-3" />
                <div>
                  <span className="font-semibold">Video Consultation</span>
                  <p className="text-sm text-gray-600">Connect from anywhere via secure video call</p>
                  <p className="text-sm font-medium text-green-600">
                    Rs {bookingData.doctor.videoConsultationFee.toLocaleString()}
                  </p>
                </div>
              </label>

              <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                bookingData.type === 'in-person' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="in-person"
                  checked={bookingData.type === 'in-person'}
                  onChange={(e) => handleTypeChange(e.target.value as 'in-person')}
                  className="mr-4"
                />
                <FaUser className="text-blue-600 text-xl mr-3" />
                <div>
                  <span className="font-semibold">In-Person Visit</span>
                  <p className="text-sm text-gray-600">Visit the doctor at their clinic</p>
                  <p className="text-sm font-medium text-blue-600">
                    Rs {bookingData.doctor.consultationFee.toLocaleString()}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Available Time Slots</h3>
          {!bookingData.date ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Please select a date to view available times</p>
            </div>
          ) : loadingSlots ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading available times...</p>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No time slots available for this date</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-gray-300 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 rounded"></div>
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${getTimeSlotStyle(slot, bookingData.time === slot.time)}`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!bookingData.date || !bookingData.time}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

/** Generate default time slots when API is unavailable */
function generateDefaultSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  for (let hour = 9; hour <= 17; hour++) {
    for (const min of [0, 30]) {
      if (hour === 17 && min === 30) continue
      const h = hour > 12 ? hour - 12 : hour
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const time = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${ampm}`
      slots.push({ time, available: true, type: 'regular' })
    }
  }
  return slots
}
