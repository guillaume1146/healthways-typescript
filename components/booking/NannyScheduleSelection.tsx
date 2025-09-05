

// ===== NannyScheduleSelection.tsx =====
import { FaBaby, FaHome, FaCalendarAlt, FaClock } from 'react-icons/fa'
import type { NannyBookingData } from '@/app/booking/nannies/[id]/page'

interface NannyScheduleSelectionProps {
  bookingData: NannyBookingData
  onUpdate: (updates: Partial<NannyBookingData>) => void
  onNext: () => void
  onBack: () => void
}

interface TimeSlot {
  time: string
  available: boolean
  type: "regular" | "urgent" | "priority"
}

const mockTimeSlots: TimeSlot[] = [
  { time: "07:00 AM", available: true, type: "regular" },
  { time: "08:00 AM", available: false, type: "regular" },
  { time: "09:00 AM", available: true, type: "priority" },
  { time: "10:00 AM", available: true, type: "regular" },
  { time: "11:00 AM", available: false, type: "regular" },
  { time: "12:00 PM", available: true, type: "urgent" },
  { time: "01:00 PM", available: true, type: "regular" },
  { time: "02:00 PM", available: true, type: "regular" },
  { time: "03:00 PM", available: false, type: "regular" },
  { time: "04:00 PM", available: true, type: "priority" },
  { time: "05:00 PM", available: true, type: "regular" },
  { time: "06:00 PM", available: true, type: "regular" }
]

const durationOptions = [
  { value: 2, label: "2 Hours", description: "Short childcare session" },
  { value: 4, label: "4 Hours", description: "Half-day care" },
  { value: 6, label: "6 Hours", description: "Extended care session" },
  { value: 8, label: "8 Hours", description: "Full day care" },
  { value: 10, label: "10 Hours", description: "Extended day care" },
  { value: 12, label: "12 Hours", description: "Overnight care" }
]

export function NannyScheduleSelection({
  bookingData,
  onUpdate,
  onNext,
  onBack
}: NannyScheduleSelectionProps) {
  const handleTimeSelect = (time: string) => {
    onUpdate({ time })
  }

  const handleDateChange = (date: string) => {
    onUpdate({ date, time: '' }) // Reset time when date changes
  }

  const handleTypeChange = (type: 'regular' | 'overnight') => {
    onUpdate({ type })
  }

  const handleDurationChange = (duration: number) => {
    onUpdate({ duration })
  }

  const getTimeSlotStyle = (slot: TimeSlot, isSelected: boolean) => {
    if (!slot.available) return "bg-gray-100 text-gray-400 cursor-not-allowed"
    if (isSelected) return "bg-purple-600 text-white border-purple-600"
    
    switch (slot.type) {
      case "urgent":
        return "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
      case "priority":
        return "border-green-300 text-green-600 hover:bg-green-50 hover:border-green-500"
      default:
        return "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
    }
  }

  const calculateEstimatedCost = () => {
    const rate = bookingData.type === 'overnight' ? bookingData.nanny.overnightRate : bookingData.nanny.hourlyRate
    return bookingData.type === 'overnight' ? rate : rate * bookingData.duration
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Date & Service Type Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Select Date & Service Type</h3>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Service Date
            </label>
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-4">
              Service Type
            </label>
            <div className="space-y-3">
              <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                bookingData.type === 'regular' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="regular"
                  checked={bookingData.type === "regular"}
                  onChange={(e) => handleTypeChange(e.target.value as "regular")}
                  className="mr-4"
                />
                <FaBaby className="text-purple-600 text-xl mr-3" />
                <div>
                  <span className="font-semibold">Regular Childcare</span>
                  <p className="text-sm text-gray-600">Standard hourly childcare service</p>
                  <p className="text-sm font-medium text-purple-600">
                    Rs {bookingData.nanny.hourlyRate}/hour
                  </p>
                </div>
              </label>
              
              {bookingData.nanny.overnightRate > 0 && (
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  bookingData.type === 'overnight' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="overnight"
                    checked={bookingData.type === "overnight"}
                    onChange={(e) => handleTypeChange(e.target.value as "overnight")}
                    className="mr-4"
                  />
                  <FaHome className="text-blue-600 text-xl mr-3" />
                  <div>
                    <span className="font-semibold">Overnight Care</span>
                    <p className="text-sm text-gray-600">Full night childcare service</p>
                    <p className="text-sm font-medium text-blue-600">
                      Rs {bookingData.nanny.overnightRate} per night
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Service Duration</h3>
          {bookingData.type === 'overnight' ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Overnight Care</h4>
              <p className="text-blue-800">Full night service (typically 10-12 hours)</p>
              <p className="text-lg font-bold text-blue-600 mt-2">
                Rs {bookingData.nanny.overnightRate}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {durationOptions.map((option) => (
                <label 
                  key={option.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    bookingData.duration === option.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    checked={bookingData.duration === option.value}
                    onChange={(e) => handleDurationChange(Number(e.target.value))}
                    className="mr-4"
                  />
                  <FaClock className="text-purple-600 text-lg mr-3" />
                  <div className="flex-1">
                    <span className="font-semibold">{option.label}</span>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <p className="text-sm font-medium text-green-600">
                      Rs {(bookingData.nanny.hourlyRate * option.value).toLocaleString()}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
          
          {/* Cost Estimate */}
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Estimated Cost</h4>
            <p className="text-lg font-bold text-purple-600">
              Rs {calculateEstimatedCost().toLocaleString()}
            </p>
            <p className="text-sm text-purple-700">
              {bookingData.type === 'overnight' 
                ? 'Overnight rate' 
                : `${bookingData.duration} hour${bookingData.duration > 1 ? 's' : ''} × Rs ${bookingData.nanny.hourlyRate}/hour`
              }
            </p>
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Available Time Slots</h3>
          {bookingData.date ? (
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-gray-300 rounded"></div>
                    <span>Regular</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-green-300 rounded"></div>
                    <span>Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-red-300 rounded"></div>
                    <span>Urgent</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {mockTimeSlots.map((slot) => (
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
              
              {bookingData.time && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Selected:</strong> {bookingData.time} 
                    {bookingData.type === 'overnight' 
                      ? ' for overnight care' 
                      : ` for ${bookingData.duration} hour${bookingData.duration > 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Please select a date to view available times</p>
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
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}