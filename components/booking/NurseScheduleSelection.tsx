import { FaVideo, FaUser, FaHome, FaCalendarAlt, FaClock } from 'react-icons/fa'
import type { NurseBookingData } from '@/app/booking/nurses/[id]/page'

interface NurseScheduleSelectionProps {
  bookingData: NurseBookingData
  onUpdate: (updates: Partial<NurseBookingData>) => void
  onNext: () => void
  onBack: () => void
}

interface TimeSlot {
  time: string
  available: boolean
  type: "regular" | "urgent" | "priority"
}

const mockTimeSlots: TimeSlot[] = [
  { time: "08:00 AM", available: true, type: "regular" },
  { time: "09:00 AM", available: false, type: "regular" },
  { time: "10:00 AM", available: true, type: "priority" },
  { time: "11:00 AM", available: true, type: "regular" },
  { time: "12:00 PM", available: false, type: "regular" },
  { time: "01:00 PM", available: true, type: "urgent" },
  { time: "02:00 PM", available: true, type: "regular" },
  { time: "03:00 PM", available: true, type: "regular" },
  { time: "04:00 PM", available: false, type: "regular" },
  { time: "05:00 PM", available: true, type: "priority" },
  { time: "06:00 PM", available: true, type: "regular" },
  { time: "07:00 PM", available: true, type: "regular" }
]

const durationOptions = [
  { value: 1, label: "1 Hour", description: "Quick assessment or check-up" },
  { value: 2, label: "2 Hours", description: "Standard nursing care session" },
  { value: 4, label: "4 Hours", description: "Extended care or recovery support" },
  { value: 6, label: "6 Hours", description: "Day shift care" },
  { value: 8, label: "8 Hours", description: "Full day care" },
  { value: 12, label: "12 Hours", description: "Extended shift care" }
]

export default function NurseScheduleSelection({
  bookingData,
  onUpdate,
  onNext,
  onBack
}: NurseScheduleSelectionProps) {
  const handleTimeSelect = (time: string) => {
    onUpdate({ time })
  }

  const handleDateChange = (date: string) => {
    onUpdate({ date, time: '' }) // Reset time when date changes
  }

  const handleTypeChange = (type: 'video' | 'in-person' | 'home-visit') => {
    onUpdate({ type })
  }

  const handleDurationChange = (duration: number) => {
    onUpdate({ duration })
  }

  const getTimeSlotStyle = (slot: TimeSlot, isSelected: boolean) => {
    if (!slot.available) return "bg-gray-100 text-gray-400 cursor-not-allowed"
    if (isSelected) return "bg-blue-600 text-white border-blue-600"
    
    switch (slot.type) {
      case "urgent":
        return "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
      case "priority":
        return "border-green-300 text-green-600 hover:bg-green-50 hover:border-green-500"
      default:
        return "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
    }
  }

  const calculateEstimatedCost = () => {
    const rate = bookingData.type === 'video' 
      ? bookingData.nurse.videoConsultationRate 
      : bookingData.nurse.hourlyRate
    return rate * bookingData.duration
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
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-4">
              Service Type
            </label>
            <div className="space-y-3">
              {bookingData.nurse.consultationTypes.includes("Video Consultation") && (
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  bookingData.type === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="video"
                    checked={bookingData.type === "video"}
                    onChange={(e) => handleTypeChange(e.target.value as "video")}
                    className="mr-4"
                  />
                  <FaVideo className="text-green-600 text-xl mr-3" />
                  <div>
                    <span className="font-semibold">Video Consultation</span>
                    <p className="text-sm text-gray-600">Connect via secure video call</p>
                    <p className="text-sm font-medium text-green-600">
                      Rs {bookingData.nurse.videoConsultationRate}/hour
                    </p>
                  </div>
                </label>
              )}
              
              {bookingData.nurse.consultationTypes.includes("In-Person") && (
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  bookingData.type === 'in-person' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="in-person"
                    checked={bookingData.type === "in-person"}
                    onChange={(e) => handleTypeChange(e.target.value as "in-person")}
                    className="mr-4"
                  />
                  <FaUser className="text-blue-600 text-xl mr-3" />
                  <div>
                    <span className="font-semibold">In-Person Service</span>
                    <p className="text-sm text-gray-600">At the clinic or healthcare facility</p>
                    <p className="text-sm font-medium text-blue-600">
                      Rs {bookingData.nurse.hourlyRate}/hour
                    </p>
                  </div>
                </label>
              )}

              {bookingData.nurse.consultationTypes.includes("Home Visit") && (
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  bookingData.type === 'home-visit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="home-visit"
                    checked={bookingData.type === "home-visit"}
                    onChange={(e) => handleTypeChange(e.target.value as "home-visit")}
                    className="mr-4"
                  />
                  <FaHome className="text-purple-600 text-xl mr-3" />
                  <div>
                    <span className="font-semibold">Home Visit</span>
                    <p className="text-sm text-gray-600">Nurse visits your location</p>
                    <p className="text-sm font-medium text-purple-600">
                      Rs {bookingData.nurse.hourlyRate}/hour
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
          <div className="space-y-3">
            {durationOptions.map((option) => (
              <label 
                key={option.value}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  bookingData.duration === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
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
                <FaClock className="text-blue-600 text-lg mr-3" />
                <div className="flex-1">
                  <span className="font-semibold">{option.label}</span>
                  <p className="text-sm text-gray-600">{option.description}</p>
                  <p className="text-sm font-medium text-green-600">
                    Rs {(bookingData.type === 'video' 
                      ? bookingData.nurse.videoConsultationRate 
                      : bookingData.nurse.hourlyRate) * option.value}
                  </p>
                </div>
              </label>
            ))}
          </div>
          
          {/* Cost Estimate */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Estimated Cost</h4>
            <p className="text-lg font-bold text-blue-600">
              Rs {calculateEstimatedCost().toLocaleString()}
            </p>
            <p className="text-sm text-blue-700">
              {bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''} × Rs {bookingData.type === 'video' 
                ? bookingData.nurse.videoConsultationRate 
                : bookingData.nurse.hourlyRate}/hour
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
                    <strong>Selected:</strong> {bookingData.time} for {bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}
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
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}