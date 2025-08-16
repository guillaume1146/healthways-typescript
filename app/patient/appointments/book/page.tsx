"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  FaArrowLeft,
  FaMapMarkerAlt,
  FaVideo,
  FaUser,
  FaCheck,
  FaCreditCard,
  FaInfoCircle,
  FaStethoscope,
  FaHeart,
  FaBrain,
  FaBaby,
  FaUserMd,
  FaShieldAlt,
  FaStar
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
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentDetails {
  doctor: Doctor | null;
  date: string;
  time: string;
  type: "video" | "in-person";
  reason: string;
  notes: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    rating: 4.8,
    experience: "10+ years",
    consultationFee: 2500,
    avatar: "👩‍⚕️",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    languages: ["English", "French"],
    location: "Apollo Bramwell Hospital, Port Louis"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "General Medicine",
    rating: 4.7,
    experience: "8+ years",
    consultationFee: 1500,
    avatar: "👨‍⚕️",
    availability: ["Mon", "Wed", "Fri", "Sat"],
    languages: ["English", "Creole"],
    location: "Wellkin Hospital, Moka"
  },
  {
    id: "3",
    name: "Dr. Priya Sharma",
    specialty: "Pediatrics",
    rating: 4.9,
    experience: "12+ years",
    consultationFee: 2000,
    avatar: "👩‍⚕️",
    availability: ["Tue", "Thu", "Fri", "Sat"],
    languages: ["English", "Hindi", "French"],
    location: "Fortis Clinique Darné, Floreal"
  }
]

const mockTimeSlots: TimeSlot[] = [
  { time: "09:00 AM", available: true },
  { time: "09:30 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: true },
  { time: "02:00 PM", available: true },
  { time: "02:30 PM", available: true },
  { time: "03:00 PM", available: false },
  { time: "03:30 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "04:30 PM", available: true }
]

const mockPaymentMethods: PaymentMethod[] = [
  { id: "1", type: "card", last4: "4242", brand: "Visa" },
  { id: "2", type: "card", last4: "5555", brand: "Mastercard" }
]

const specialties = [
  { icon: FaStethoscope, name: "General Medicine", color: "text-blue-500" },
  { icon: FaHeart, name: "Cardiology", color: "text-red-500" },
  { icon: FaBrain, name: "Neurology", color: "text-purple-500" },
  { icon: FaBaby, name: "Pediatrics", color: "text-pink-500" },
  { icon: FaUserMd, name: "All Specialties", color: "text-gray-500" }
]

export default function AppointmentBookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    doctor: null,
    date: "",
    time: "",
    type: "video",
    reason: "",
    notes: ""
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(mockPaymentMethods[0])
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    { number: 1, title: "Choose Doctor" },
    { number: 2, title: "Select Date & Time" },
    { number: 3, title: "Appointment Details" },
    { number: 4, title: "Payment" },
    { number: 5, title: "Confirmation" }
  ]

  const handleDoctorSelect = (doctor: Doctor) => {
    setAppointmentDetails({ ...appointmentDetails, doctor })
    setCurrentStep(2)
  }

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
      setCurrentStep(5)
    }, 2000)
  }

  const filteredDoctors = selectedSpecialty === "All Specialties" 
    ? mockDoctors 
    : mockDoctors.filter(doc => doc.specialty === selectedSpecialty)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard" className="text-gray-600 hover:text-primary-blue">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
              <p className="text-gray-600">Schedule your consultation with qualified doctors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep > step.number ? "bg-green-500 text-white" :
                    currentStep === step.number ? "bg-primary-blue text-white" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {currentStep > step.number ? <FaCheck /> : step.number}
                  </div>
                  <span className={`text-xs mt-2 ${
                    currentStep >= step.number ? "text-primary-blue font-medium" : "text-gray-500"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-2 ${
                    currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                  }`} style={{ width: "60px" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Choose Doctor */}
        {currentStep === 1 && (
          <div className="max-w-6xl mx-auto">
            {/* Specialty Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Select Specialty</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {specialties.map((specialty) => (
                  <button
                    key={specialty.name}
                    onClick={() => setSelectedSpecialty(specialty.name)}
                    className={`p-4 border-2 rounded-lg text-center transition ${
                      selectedSpecialty === specialty.name
                        ? "border-primary-blue bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <specialty.icon className={`${specialty.color} text-2xl mx-auto mb-2`} />
                    <span className="text-sm font-medium">{specialty.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Doctors List */}
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{doctor.avatar}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                        <p className="text-gray-600">{doctor.specialty} • {doctor.experience}</p>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-500" />
                            <span className="font-semibold">{doctor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <FaMapMarkerAlt />
                            <span className="text-sm">{doctor.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Languages: {doctor.languages.join(", ")}</span>
                          <span>Available: {doctor.availability.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">Rs {doctor.consultationFee}</p>
                      <p className="text-sm text-gray-600 mb-3">per consultation</p>
                      <button
                        onClick={() => handleDoctorSelect(doctor)}
                        className="btn-gradient px-6 py-2"
                      >
                        Select Doctor
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {currentStep === 2 && appointmentDetails.doctor && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Selected Doctor</h2>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{appointmentDetails.doctor.avatar}</div>
                <div>
                  <h3 className="font-semibold">{appointmentDetails.doctor.name}</h3>
                  <p className="text-gray-600">{appointmentDetails.doctor.specialty}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Date</h3>
                <input
                  type="date"
                  value={appointmentDetails.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                />
                
                {/* Consultation Type */}
                <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">Consultation Type</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="type"
                      value="video"
                      checked={appointmentDetails.type === "video"}
                      onChange={(e) => setAppointmentDetails({
                        ...appointmentDetails,
                        type: e.target.value as "video" | "in-person"
                      })}
                      className="mr-3"
                    />
                    <FaVideo className="text-green-500 mr-2" />
                    <span>Video Consultation</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="type"
                      value="in-person"
                      checked={appointmentDetails.type === "in-person"}
                      onChange={(e) => setAppointmentDetails({
                        ...appointmentDetails,
                        type: e.target.value as "video" | "in-person"
                      })}
                      className="mr-3"
                    />
                    <FaUser className="text-blue-500 mr-2" />
                    <span>In-Person Visit</span>
                  </label>
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Available Time Slots</h3>
                {appointmentDetails.date ? (
                  <div className="grid grid-cols-3 gap-3">
                    {mockTimeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 rounded-lg text-sm font-medium transition ${
                          appointmentDetails.time === slot.time
                            ? "bg-primary-blue text-white"
                            : slot.available
                            ? "border border-gray-300 hover:border-primary-blue hover:bg-blue-50"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Please select a date first</p>
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
                className="btn-gradient px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Appointment Details */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Appointment Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Reason for Visit
                  </label>
                  <select
                    value={appointmentDetails.reason}
                    onChange={(e) => setAppointmentDetails({
                      ...appointmentDetails,
                      reason: e.target.value
                    })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  >
                    <option value="">Select reason</option>
                    <option value="general-checkup">General Checkup</option>
                    <option value="follow-up">Follow-up Consultation</option>
                    <option value="new-symptoms">New Symptoms</option>
                    <option value="chronic-management">Chronic Disease Management</option>
                    <option value="preventive-care">Preventive Care</option>
                    <option value="second-opinion">Second Opinion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Describe Your Symptoms (Optional)
                  </label>
                  <textarea
                    value={appointmentDetails.notes}
                    onChange={(e) => setAppointmentDetails({
                      ...appointmentDetails,
                      notes: e.target.value
                    })}
                    rows={4}
                    placeholder="Please describe your symptoms or concerns..."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Appointment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-medium">{appointmentDetails.doctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{appointmentDetails.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{appointmentDetails.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{appointmentDetails.type === "video" ? "Video Call" : "In-Person"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee:</span>
                      <span className="font-medium">Rs {appointmentDetails.doctor?.consultationFee}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="btn-gradient px-6 py-3"
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
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>
              
              {/* Payment Methods */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Select Payment Method</h3>
                {mockPaymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPaymentMethod?.id === method.id}
                      onChange={() => setSelectedPaymentMethod(method)}
                      className="mr-3"
                    />
                    <FaCreditCard className="text-gray-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">{method.brand} •••• {method.last4}</p>
                    </div>
                  </label>
                ))}
                
                <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-blue hover:text-primary-blue">
                  + Add New Payment Method
                </button>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-medium">Rs {appointmentDetails.doctor?.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charge</span>
                    <span className="font-medium">Rs 50</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-lg">Rs {(appointmentDetails.doctor?.consultationFee || 0) + 50}</span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Secure Payment</h4>
                    <p className="text-blue-700 text-sm">Your payment information is encrypted and secure.</p>
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
                  disabled={isProcessing}
                  className="btn-gradient px-8 py-3 disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Confirm & Pay"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="text-green-500 text-3xl" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
              <p className="text-gray-600 mb-6">Your appointment has been successfully booked</p>
              
              <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Doctor</p>
                    <p className="font-medium">{appointmentDetails.doctor?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Date & Time</p>
                    <p className="font-medium">{appointmentDetails.date} at {appointmentDetails.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Consultation Type</p>
                    <p className="font-medium">{appointmentDetails.type === "video" ? "Video Consultation" : "In-Person Visit"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Location</p>
                    <p className="font-medium">
                      {appointmentDetails.type === "video" ? "Virtual (Link will be sent)" : appointmentDetails.doctor?.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Booking ID</p>
                    <p className="font-medium">APT-2024-{Math.floor(Math.random() * 10000)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <FaInfoCircle className="text-blue-500 mb-2" />
                <p className="text-blue-800 text-sm">
                  A confirmation email has been sent to your registered email address with appointment details.
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/patient/appointments" className="flex-1 btn-gradient py-3 text-center">
                  View My Appointments
                </Link>
                <Link href="/patient/dashboard" className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 text-center">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}