"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaVideo,
  FaUser,
  FaToggleOn,
  FaToggleOff,
  FaCopy
} from "react-icons/fa"

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  booked: boolean;
  patientName?: string;
}

interface DaySchedule {
  date: string;
  dayName: string;
  isWorkingDay: boolean;
  timeSlots: TimeSlot[];
  location: string;
  consultationType: "video" | "in-person" | "both";
}

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

const mockSchedule: DaySchedule[] = [
  {
    date: "2024-01-15",
    dayName: "Monday",
    isWorkingDay: true,
    timeSlots: [
      { id: "1", startTime: "09:00", endTime: "09:30", available: true, booked: false },
      { id: "2", startTime: "09:30", endTime: "10:00", available: true, booked: true, patientName: "John Smith" },
      { id: "3", startTime: "10:00", endTime: "10:30", available: true, booked: false },
      { id: "4", startTime: "10:30", endTime: "11:00", available: true, booked: true, patientName: "Maria Garcia" },
      { id: "5", startTime: "11:00", endTime: "11:30", available: false, booked: false },
      { id: "6", startTime: "14:00", endTime: "14:30", available: true, booked: false },
      { id: "7", startTime: "14:30", endTime: "15:00", available: true, booked: true, patientName: "David Chen" },
      { id: "8", startTime: "15:00", endTime: "15:30", available: true, booked: false },
    ],
    location: "Apollo Bramwell Hospital",
    consultationType: "both"
  },
  {
    date: "2024-01-16",
    dayName: "Tuesday",
    isWorkingDay: true,
    timeSlots: [
      { id: "9", startTime: "09:00", endTime: "09:30", available: true, booked: false },
      { id: "10", startTime: "09:30", endTime: "10:00", available: true, booked: false },
      { id: "11", startTime: "10:00", endTime: "10:30", available: true, booked: true, patientName: "Emma Wilson" },
      { id: "12", startTime: "10:30", endTime: "11:00", available: true, booked: false },
    ],
    location: "Private Clinic",
    consultationType: "in-person"
  },
  {
    date: "2024-01-17",
    dayName: "Wednesday",
    isWorkingDay: true,
    timeSlots: [],
    location: "Virtual",
    consultationType: "video"
  }
]

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    startDate: "2024-01-25",
    endDate: "2024-01-26",
    reason: "Medical Conference",
    status: "approved"
  },
  {
    id: "2",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    reason: "Personal Leave",
    status: "pending"
  }
]

export default function DoctorAvailabilityPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(mockSchedule)
  const [selectedWeek, setSelectedWeek] = useState("2024-W03")
  const [editMode, setEditMode] = useState(false)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  console.log(setLeaveRequests)
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [defaultSettings, setDefaultSettings] = useState({
    consultationDuration: 30,
    breakBetweenSlots: 0,
    maxPatientsPerDay: 20,
    autoAcceptBookings: true,
    advanceBookingDays: 30
  })

  const handleToggleSlot = (dayIndex: number, slotId: string) => {
    const newSchedule = [...schedule]
    const slotIndex = newSchedule[dayIndex].timeSlots.findIndex(s => s.id === slotId)
    if (slotIndex !== -1) {
      newSchedule[dayIndex].timeSlots[slotIndex].available = !newSchedule[dayIndex].timeSlots[slotIndex].available
    }
    setSchedule(newSchedule)
  }

  const handleAddSlot = (dayIndex: number) => {
    const newSchedule = [...schedule]
    const lastSlot = newSchedule[dayIndex].timeSlots[newSchedule[dayIndex].timeSlots.length - 1]
    const newSlot: TimeSlot = {
      id: `new-${Date.now()}`,
      startTime: lastSlot ? lastSlot.endTime : "09:00",
      endTime: lastSlot ? addMinutes(lastSlot.endTime, 30) : "09:30",
      available: true,
      booked: false
    }
    newSchedule[dayIndex].timeSlots.push(newSlot)
    setSchedule(newSchedule)
  }

  const addMinutes = (time: string, minutes: number) => {
    const [hours, mins] = time.split(":").map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60)
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`
  }

  const handleToggleDay = (dayIndex: number) => {
    const newSchedule = [...schedule]
    newSchedule[dayIndex].isWorkingDay = !newSchedule[dayIndex].isWorkingDay
    setSchedule(newSchedule)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/doctor/dashboard" className="text-gray-600 hover:text-primary-blue">
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
                <p className="text-gray-600">Set your working hours and manage schedule</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false)
                      // Save changes
                    }}
                    className="btn-gradient px-6 py-2 flex items-center gap-2"
                  >
                    <FaSave />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn-gradient px-6 py-2 flex items-center gap-2"
                >
                  <FaEdit />
                  Edit Schedule
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Settings</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Default Consultation Duration
              </label>
              <select
                value={defaultSettings.consultationDuration}
                onChange={(e) => setDefaultSettings({
                  ...defaultSettings,
                  consultationDuration: parseInt(e.target.value)
                })}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue disabled:bg-gray-100"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Max Patients Per Day
              </label>
              <input
                type="number"
                value={defaultSettings.maxPatientsPerDay}
                onChange={(e) => setDefaultSettings({
                  ...defaultSettings,
                  maxPatientsPerDay: parseInt(e.target.value)
                })}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Auto-Accept Bookings
              </label>
              <button
                onClick={() => setDefaultSettings({
                  ...defaultSettings,
                  autoAcceptBookings: !defaultSettings.autoAcceptBookings
                })}
                disabled={!editMode}
                className="flex items-center gap-2 text-2xl"
              >
                {defaultSettings.autoAcceptBookings ? (
                  <FaToggleOn className="text-green-500" />
                ) : (
                  <FaToggleOff className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Week Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Weekly Schedule</h2>
            <div className="flex items-center gap-4">
              <input
                type="week"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
              />
              {editMode && (
                <button
                  onClick={() => setShowRecurringModal(true)}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaCopy />
                  Set Recurring
                </button>
              )}
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="space-y-6">
            {schedule.map((day, dayIndex) => (
              <div key={day.date} className="border rounded-lg overflow-hidden">
                <div className={`p-4 ${day.isWorkingDay ? "bg-gray-50" : "bg-gray-100"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{day.dayName}</h3>
                        <p className="text-sm text-gray-600">{day.date}</p>
                      </div>
                      {day.isWorkingDay && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-gray-500" />
                            <span>{day.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {day.consultationType === "video" && <FaVideo className="text-green-500" />}
                            {day.consultationType === "in-person" && <FaUser className="text-blue-500" />}
                            {day.consultationType === "both" && (
                              <>
                                <FaVideo className="text-green-500" />
                                <FaUser className="text-blue-500" />
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {editMode && (
                      <button
                        onClick={() => handleToggleDay(dayIndex)}
                        className={`px-4 py-2 rounded-lg ${
                          day.isWorkingDay
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {day.isWorkingDay ? "Working Day" : "Day Off"}
                      </button>
                    )}
                  </div>
                </div>
                
                {day.isWorkingDay && (
                  <div className="p-4">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {day.timeSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-3 rounded-lg text-center ${
                            slot.booked
                              ? "bg-blue-100 border border-blue-300"
                              : slot.available
                              ? "bg-green-50 border border-green-300"
                              : "bg-gray-100 border border-gray-300"
                          }`}
                        >
                          <p className="text-sm font-medium">
                            {slot.startTime} - {slot.endTime}
                          </p>
                          {slot.booked ? (
                            <p className="text-xs text-blue-600 mt-1">Booked</p>
                          ) : (
                            editMode && (
                              <button
                                onClick={() => handleToggleSlot(dayIndex, slot.id)}
                                className="text-xs mt-1"
                              >
                                {slot.available ? (
                                  <span className="text-green-600">Available</span>
                                ) : (
                                  <span className="text-gray-500">Blocked</span>
                                )}
                              </button>
                            )
                          )}
                        </div>
                      ))}
                      
                      {editMode && (
                        <button
                          onClick={() => handleAddSlot(dayIndex)}
                          className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-blue hover:text-primary-blue"
                        >
                          <FaPlus className="mx-auto" />
                          <p className="text-xs mt-1">Add Slot</p>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leave Management */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Leave & Vacation</h2>
            <button
              onClick={() => setShowAddLeaveModal(true)}
              className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FaPlus />
              Request Leave
            </button>
          </div>
          
          <div className="space-y-4">
            {leaveRequests.map((leave) => (
              <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {leave.startDate} to {leave.endDate}
                  </p>
                  <p className="text-sm text-gray-600">{leave.reason}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                  {leave.status === "pending" && (
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Leave Modal */}
      {showAddLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Request Leave</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Reason</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
                  placeholder="Enter reason for leave..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddLeaveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddLeaveModal(false)
                  // Add leave request
                }}
                className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Schedule Modal */}
      {showRecurringModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Set Recurring Schedule</h3>
            <p className="text-gray-600 mb-4">
              Apply current week  schedule to future weeks
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Apply for next
                </label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-blue">
                  <option>2 weeks</option>
                  <option>4 weeks</option>
                  <option>8 weeks</option>
                  <option>12 weeks</option>
                </select>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FaExclamationTriangle className="text-yellow-500 mt-1" />
                  <p className="text-sm text-yellow-800">
                    This will overwrite any existing schedule for the selected period
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRecurringModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRecurringModal(false)
                  // Apply recurring schedule
                }}
                className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
              >
                Apply Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}