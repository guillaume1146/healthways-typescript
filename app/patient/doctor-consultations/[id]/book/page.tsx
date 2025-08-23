"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  FaArrowLeft,
  FaMapMarkerAlt,
  FaVideo,
  FaUser,
  FaCheck,
  FaCreditCard,
  FaInfoCircle,
  FaStar,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaShieldAlt,
  FaBuilding,
  FaWallet,
  FaFileInvoiceDollar,
  FaTicketAlt,
  FaDownload,
  FaPrint,
  FaCalendarPlus
} from "react-icons/fa"

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  consultationFee: number;
  avatar: string;
  availability: string[];
  languages: string[];
  location: string;
  qualifications: string[];
  about: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  type: "regular" | "urgent" | "priority";
}

interface AppointmentDetails {
  doctor: Doctor;
  date: string;
  time: string;
  type: "video" | "in-person";
  reason: string;
  notes: string;
}

interface PaymentMethod {
  id: string;
  type: "mcb-juice" | "corporate" | "insurance" | "subscription";
  name: string;
  description: string;
  discount?: number;
  icon: string;
  available: boolean;
}

// Mock doctor data (pre-selected)
const mockDoctor: Doctor = {
  id: "1",
  name: "Dr. Sarah Johnson",
  specialty: "Cardiology",
  rating: 4.8,
  experience: "10+ years",
  consultationFee: 2500,
  avatar: "👩‍⚕️",
  availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  languages: ["English", "French", "Creole"],
  location: "Apollo Bramwell Hospital, Port Louis",
  qualifications: ["MBBS", "MD Cardiology", "FESC"],
  about: "Specialized in interventional cardiology with extensive experience in treating heart conditions. Expert in cardiac catheterization and coronary angioplasty."
}

const mockTimeSlots: TimeSlot[] = [
  { time: "09:00 AM", available: true, type: "regular" },
  { time: "09:30 AM", available: false, type: "regular" },
  { time: "10:00 AM", available: true, type: "priority" },
  { time: "10:30 AM", available: true, type: "regular" },
  { time: "11:00 AM", available: false, type: "regular" },
  { time: "11:30 AM", available: true, type: "urgent" },
  { time: "02:00 PM", available: true, type: "regular" },
  { time: "02:30 PM", available: true, type: "regular" },
  { time: "03:00 PM", available: false, type: "regular" },
  { time: "03:30 PM", available: true, type: "priority" },
  { time: "04:00 PM", available: true, type: "regular" },
  { time: "04:30 PM", available: true, type: "regular" }
]

const paymentMethods: PaymentMethod[] = [
  {
    id: "mcb-juice",
    type: "mcb-juice",
    name: "MCB Juice",
    description: "Pay instantly with MCB Juice mobile payment",
    icon: "📱",
    available: true
  },
  {
    id: "corporate",
    type: "corporate",
    name: "Corporate Health Plan",
    description: "Use your company's health benefits",
    discount: 50,
    icon: "🏢",
    available: true
  },
  {
    id: "insurance",
    type: "insurance",
    name: "Insurance Coverage",
    description: "Apply insurance coverage (80% covered)",
    discount: 80,
    icon: "🛡️",
    available: true
  },
  {
    id: "subscription",
    type: "subscription",
    name: "Monthly Subscription",
    description: "Use your active healthcare subscription",
    discount: 100,
    icon: "💳",
    available: true
  }
]

export default function DoctorConsultationBooking() {
  const [currentStep, setCurrentStep] = useState(1)
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    doctor: mockDoctor,
    date: "",
    time: "",
    type: "video",
    reason: "",
    notes: ""
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const steps = [
    { number: 1, title: "Doctor Details", icon: FaUser },
    { number: 2, title: "Schedule", icon: FaCalendarAlt },
    { number: 3, title: "Consultation Info", icon: FaInfoCircle },
    { number: 4, title: "Payment", icon: FaWallet },
    { number: 5, title: "Confirmation", icon: FaTicketAlt }
  ]

  const handleTimeSelect = (time: string) => {
    setAppointmentDetails({ ...appointmentDetails, time })
  }

  const handleDateChange = (date: string) => {
    setAppointmentDetails({ ...appointmentDetails, date })
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setBookingConfirmed(true)
      setTicketId(`TKT-${Date.now()}`)
      setCurrentStep(5)
    }, 3000)
  }

  const calculateFinalAmount = () => {
    if (!selectedPaymentMethod) return appointmentDetails.doctor.consultationFee + 50
    
    const baseAmount = appointmentDetails.doctor.consultationFee + 50
    if (selectedPaymentMethod.discount) {
      return baseAmount * (1 - selectedPaymentMethod.discount / 100)
    }
    return baseAmount
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard" className="text-gray-600 hover:text-blue-600">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book Consultation</h1>
              <p className="text-gray-600">Schedule your appointment with Dr. {appointmentDetails.doctor.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                    currentStep > step.number ? "bg-green-500 text-white" :
                    currentStep === step.number ? "bg-blue-600 text-white" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {currentStep > step.number ? <FaCheck /> : <step.icon />}
                  </div>
                  <span className={`text-xs mt-2 text-center ${
                    currentStep >= step.number ? "text-blue-600 font-medium" : "text-gray-500"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Doctor Details */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Doctor Information</h2>
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{appointmentDetails.doctor.avatar}</div>
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                      <FaStar />
                      <span className="font-bold text-lg">{appointmentDetails.doctor.rating}</span>
                      <span className="text-gray-600 text-sm">(248 reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{appointmentDetails.doctor.name}</h3>
                  <p className="text-lg text-blue-600 font-semibold mb-3">{appointmentDetails.doctor.specialty}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                      <p className="text-gray-600">{appointmentDetails.doctor.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Consultation Fee</h4>
                      <p className="text-2xl font-bold text-green-600">Rs {appointmentDetails.doctor.consultationFee}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Languages</h4>
                      <p className="text-gray-600">{appointmentDetails.doctor.languages.join(", ")}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Qualifications</h4>
                      <p className="text-gray-600">{appointmentDetails.doctor.qualifications.join(", ")}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt />
                      <span>{appointmentDetails.doctor.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                    <p className="text-gray-600">{appointmentDetails.doctor.about}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Continue to Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Schedule Selection */}
        {currentStep === 2 && (
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
                    value={appointmentDetails.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-4">
                    Consultation Type
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="type"
                        value="video"
                        checked={appointmentDetails.type === "video"}
                        onChange={(e) => setAppointmentDetails({
                          ...appointmentDetails,
                          type: e.target.value as "video" | "in-person"
                        })}
                        className="mr-4"
                      />
                      <FaVideo className="text-green-600 text-xl mr-3" />
                      <div>
                        <span className="font-semibold">Video Consultation</span>
                        <p className="text-sm text-gray-600">Connect from anywhere via secure video call</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="type"
                        value="in-person"
                        checked={appointmentDetails.type === "in-person"}
                        onChange={(e) => setAppointmentDetails({
                          ...appointmentDetails,
                          type: e.target.value as "video" | "in-person"
                        })}
                        className="mr-4"
                      />
                      <FaUser className="text-blue-600 text-xl mr-3" />
                      <div>
                        <span className="font-semibold">In-Person Visit</span>
                        <p className="text-sm text-gray-600">Visit the doctor at their clinic</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Available Time Slots</h3>
                {appointmentDetails.date ? (
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
                    
                    <div className="grid grid-cols-3 gap-3">
                      {mockTimeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => handleTimeSelect(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${getTimeSlotStyle(slot, appointmentDetails.time === slot.time)}`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
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
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!appointmentDetails.date || !appointmentDetails.time}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Consultation Details */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Consultation Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Reason for Consultation *
                  </label>
                  <select
                    value={appointmentDetails.reason}
                    onChange={(e) => setAppointmentDetails({
                      ...appointmentDetails,
                      reason: e.target.value
                    })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  >
                    <option value="">Select reason</option>
                    <option value="routine-checkup">Routine Checkup</option>
                    <option value="follow-up">Follow-up Consultation</option>
                    <option value="chest-pain">Chest Pain/Discomfort</option>
                    <option value="heart-palpitations">Heart Palpitations</option>
                    <option value="high-blood-pressure">High Blood Pressure</option>
                    <option value="shortness-breath">Shortness of Breath</option>
                    <option value="preventive-screening">Preventive Screening</option>
                    <option value="second-opinion">Second Opinion</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={appointmentDetails.notes}
                    onChange={(e) => setAppointmentDetails({
                      ...appointmentDetails,
                      notes: e.target.value
                    })}
                    rows={4}
                    placeholder="Please describe your symptoms, concerns, or any relevant medical history..."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Appointment Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-600" />
                    Appointment Summary
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Doctor:</span>
                      <p className="font-semibold">{appointmentDetails.doctor.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Specialty:</span>
                      <p className="font-semibold">{appointmentDetails.doctor.specialty}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <p className="font-semibold">{appointmentDetails.date}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <p className="font-semibold">{appointmentDetails.time}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-semibold">{appointmentDetails.type === "video" ? "Video Consultation" : "In-Person Visit"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Fee:</span>
                      <p className="font-semibold text-green-600">Rs {appointmentDetails.doctor.consultationFee}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={!appointmentDetails.reason}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Options</h2>
              
              {/* Payment Methods */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedPaymentMethod?.id === method.id 
                        ? "border-blue-600 bg-blue-50" 
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPaymentMethod?.id === method.id}
                      onChange={() => setSelectedPaymentMethod(method)}
                      className="mr-4"
                    />
                    <div className="text-3xl mr-4">{method.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{method.name}</span>
                        {method.discount && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            {method.discount}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                    </div>
                    {!method.available && (
                      <span className="text-sm text-red-600 font-medium">Unavailable</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border">
                <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-medium">Rs {appointmentDetails.doctor.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">Rs 50</span>
                  </div>
                  {selectedPaymentMethod?.discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({selectedPaymentMethod.discount}%)</span>
                      <span className="font-medium">
                        - Rs {Math.round((appointmentDetails.doctor.consultationFee + 50) * selectedPaymentMethod.discount / 100)}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-lg">Total Amount</span>
                    <span className="font-bold text-xl text-green-600">
                      Rs {Math.round(calculateFinalAmount())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Secure Payment</h4>
                    <p className="text-blue-700 text-sm">All payments are encrypted and processed securely. Your financial information is protected.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || isProcessing}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaWallet />
                      Confirm & Pay Rs {Math.round(calculateFinalAmount())}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && bookingConfirmed && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="text-green-600 text-3xl" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Consultation Booked!</h2>
              <p className="text-gray-600 mb-8">Your appointment has been successfully confirmed. Here is your digital ticket.</p>
              
              {/* Digital Ticket */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 text-left">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Digital Consultation Ticket</h3>
                    <p className="text-blue-100 text-sm">Keep this for your records</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">Ticket ID</p>
                    <p className="font-bold text-lg">{ticketId}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-100">Doctor Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-blue-200">Name:</span> {appointmentDetails.doctor.name}</p>
                      <p><span className="text-blue-200">Specialty:</span> {appointmentDetails.doctor.specialty}</p>
                      <p><span className="text-blue-200">Location:</span> {appointmentDetails.doctor.location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-100">Appointment Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-blue-200">Date:</span> {appointmentDetails.date}</p>
                      <p><span className="text-blue-200">Time:</span> {appointmentDetails.time}</p>
                      <p><span className="text-blue-200">Type:</span> {appointmentDetails.type === "video" ? "Video Call" : "In-Person"}</p>
                      <p><span className="text-blue-200">Amount Paid:</span> Rs {Math.round(calculateFinalAmount())}</p>
                    </div>
                  </div>
                </div>
                
                {appointmentDetails.type === "video" && (
                  <div className="mt-6 p-4 bg-white/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaVideo className="text-blue-200" />
                      <span className="font-semibold text-blue-100">Video Call Instructions</span>
                    </div>
                    <p className="text-blue-100 text-sm">
                      A secure video call link will be sent to your email 30 minutes before the appointment. 
                      Please ensure you have a stable internet connection and access to a camera/microphone.
                    </p>
                  </div>
                )}
              </div>

              {/* Important Information */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-yellow-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      <li>• Confirmation email sent to your registered email address</li>
                      <li>• You will receive SMS reminders 24 hours and 1 hour before appointment</li>
                      <li>• Please arrive 15 minutes early for in-person consultations</li>
                      <li>• Bring your ID and any previous medical reports</li>
                      <li>• Free rescheduling available up to 4 hours before appointment</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h4 className="font-semibold text-gray-900 mb-4">What happens next?</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Confirmation Email</p>
                      <p className="text-gray-600 text-sm">You will receive a detailed confirmation email with all appointment information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Reminders</p>
                      <p className="text-gray-600 text-sm">Automated reminders will be sent via SMS and email</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Consultation</p>
                      <p className="text-gray-600 text-sm">Join your scheduled consultation at the specified time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Follow-up</p>
                      <p className="text-gray-600 text-sm">Receive digital prescriptions and follow-up care instructions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-4 gap-3 mb-6">
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaDownload className="text-blue-600 text-xl" />
                  <span className="text-sm font-medium">Download Ticket</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaPrint className="text-green-600 text-xl" />
                  <span className="text-sm font-medium">Print Ticket</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaCalendarPlus className="text-purple-600 text-xl" />
                  <span className="text-sm font-medium">Add to Calendar</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaPhone className="text-orange-600 text-xl" />
                  <span className="text-sm font-medium">Contact Support</span>
                </button>
              </div>

              {/* Main Action Buttons */}
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/patient/appointments" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-center">
                  View My Appointments
                </Link>
                <Link href="/patient/dashboard" className="border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center">
                  Go to Dashboard
                </Link>
              </div>
              
              {/* Emergency Contact */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Need immediate assistance? Call our 24/7 helpline: 
                  <a href="tel:+2304004000" className="font-semibold text-blue-600 hover:underline ml-1">
                    +230 400 4000
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}