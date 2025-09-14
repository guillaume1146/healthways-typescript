"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCheck,
  FaInfoCircle,
  FaStar,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaShieldAlt,
  FaWallet,
  FaTicketAlt,
  FaDownload,
  FaPrint,
  FaCalendarPlus,
  FaUserNurse,
  FaHome,
  FaHospital,
  FaHeart,
  FaCertificate,
  FaExclamationTriangle,
  FaUserCheck,
  FaStethoscope,
  FaSyringe,
  FaNotesMedical,
  FaBandAid,
  FaHandHoldingHeart
} from "react-icons/fa"

interface Nurse {
  id: string;
  name: string;
  age: number;
  experience: string;
  hourlyRate: number;
  avatar: string;
  availability: string[];
  languages: string[];
  location: string;
  qualifications: string[];
  specializations: string[];
  about: string;
  rating: number;
  reviews: number;
  verified: boolean;
  licenseInfo: {
    number: string;
    expiry: string;
    authority: string;
  };
  certifications: string[];
  serviceTypes: string[];
}

interface TimeSlot {
  time: string;
  available: boolean;
  type: "regular" | "urgent" | "evening" | "night";
}

interface ServiceType {
  id: string;
  name: string;
  description: string;
  minHours: number;
  maxHours: number;
  baseRate: number;
  icon: React.ComponentType<{ className?: string; }>;
}

interface AppointmentDetails {
  nurse: Nurse;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  duration: number;
  totalCost: number;
  serviceLocation: "home" | "clinic";
  specificRequirements: string;
  medicalHistory: string;
  emergencyContact: string;
  communicationPreference: "phone" | "sms" | "email" | "app";
  carePlanNotes: string;
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

// Mock nurse data (pre-selected)
const mockNurse: Nurse = {
  id: "1",
  name: "Sarah Martinez, RN",
  age: 32,
  experience: "8+ years",
  hourlyRate: 450,
  avatar: "👩‍⚕️",
  availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  languages: ["English", "French", "Creole", "Spanish"],
  location: "Port Louis & Surrounding Areas",
  qualifications: ["BSc Nursing", "Critical Care Certification", "Wound Care Specialist"],
  specializations: ["Post-Operative Care", "Chronic Disease Management", "Elderly Care", "Wound Care", "IV Therapy"],
  about: "Experienced registered nurse with specialization in home healthcare and post-operative care. Dedicated to providing compassionate, professional nursing services in the comfort of your home.",
  rating: 4.8,
  reviews: 89,
  verified: true,
  licenseInfo: {
    number: "RN-2024-001",
    expiry: "2026-12-31",
    authority: "Mauritius Nursing Council"
  },
  certifications: ["BLS Certified", "ACLS Certified", "Wound Care Specialist", "IV Therapy Certified"],
  serviceTypes: ["Home Visits", "Post-Op Care", "Chronic Care", "Elder Care"]
}

const serviceTypes: ServiceType[] = [
  {
    id: "general-nursing",
    name: "General Nursing Care",
    description: "Basic nursing services including vital signs monitoring and medication administration",
    minHours: 2,
    maxHours: 12,
    baseRate: 450,
    icon: FaUserNurse
  },
  {
    id: "post-operative",
    name: "Post-Operative Care",
    description: "Specialized care for patients recovering from surgery",
    minHours: 4,
    maxHours: 24,
    baseRate: 550,
    icon: FaBandAid
  },
  {
    id: "chronic-care",
    name: "Chronic Disease Management",
    description: "Long-term care for patients with chronic conditions",
    minHours: 3,
    maxHours: 12,
    baseRate: 500,
    icon: FaHeart
  },
  {
    id: "elderly-care",
    name: "Elderly Care",
    description: "Comprehensive care services for elderly patients",
    minHours: 4,
    maxHours: 16,
    baseRate: 480,
    icon: FaHandHoldingHeart
  },
  {
    id: "wound-care",
    name: "Wound Care",
    description: "Specialized wound assessment, cleaning, and dressing",
    minHours: 1,
    maxHours: 4,
    baseRate: 600,
    icon: FaNotesMedical
  },
  {
    id: "iv-therapy",
    name: "IV Therapy",
    description: "Intravenous medication administration and monitoring",
    minHours: 2,
    maxHours: 8,
    baseRate: 650,
    icon: FaSyringe
  }
]

const mockTimeSlots: TimeSlot[] = [
  { time: "07:00 AM", available: true, type: "regular" },
  { time: "08:00 AM", available: true, type: "regular" },
  { time: "09:00 AM", available: false, type: "regular" },
  { time: "10:00 AM", available: true, type: "regular" },
  { time: "11:00 AM", available: true, type: "regular" },
  { time: "12:00 PM", available: true, type: "regular" },
  { time: "01:00 PM", available: false, type: "regular" },
  { time: "02:00 PM", available: true, type: "regular" },
  { time: "03:00 PM", available: true, type: "regular" },
  { time: "04:00 PM", available: true, type: "regular" },
  { time: "05:00 PM", available: true, type: "regular" },
  { time: "06:00 PM", available: true, type: "evening" },
  { time: "07:00 PM", available: true, type: "evening" },
  { time: "08:00 PM", available: true, type: "evening" },
  { time: "10:00 PM", available: true, type: "night" },
  { time: "11:00 PM", available: true, type: "night" }
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
    description: "Use your company's healthcare benefits",
    discount: 30,
    icon: "🏢",
    available: true
  },
  {
    id: "insurance",
    type: "insurance",
    name: "Health Insurance Coverage",
    description: "Apply health insurance (70% covered)",
    discount: 70,
    icon: "🛡️",
    available: true
  },
  {
    id: "subscription",
    type: "subscription",
    name: "Nursing Care Subscription",
    description: "Use your active nursing care plan",
    discount: 100,
    icon: "💳",
    available: true
  }
]

export default function NursingServiceBooking() {
  const [currentStep, setCurrentStep] = useState(1)
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    nurse: mockNurse,
    date: "",
    startTime: "",
    endTime: "",
    serviceType: "",
    duration: 4,
    totalCost: 0,
    serviceLocation: "home",
    specificRequirements: "",
    medicalHistory: "",
    emergencyContact: "",
    communicationPreference: "app",
    carePlanNotes: ""
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const steps = [
    { number: 1, title: "Nurse Profile", icon: FaUserCheck },
    { number: 2, title: "Service Details", icon: FaStethoscope },
    { number: 3, title: "Schedule", icon: FaCalendarAlt },
    { number: 4, title: "Payment", icon: FaWallet },
    { number: 5, title: "Confirmation", icon: FaTicketAlt }
  ]

  const handleTimeSelect = (time: string) => {
    setAppointmentDetails({ ...appointmentDetails, startTime: time })
    updateEndTimeAndCost(time, appointmentDetails.duration)
  }

  const handleDateChange = (date: string) => {
    setAppointmentDetails({ ...appointmentDetails, date })
  }

  const handleDurationChange = (duration: number) => {
    setAppointmentDetails({ ...appointmentDetails, duration })
    updateEndTimeAndCost(appointmentDetails.startTime, duration)
  }

  const handleServiceTypeChange = (serviceType: string) => {
    const service = serviceTypes.find(s => s.id === serviceType)
    if (service) {
      const newDuration = Math.max(appointmentDetails.duration, service.minHours)
      setAppointmentDetails({ 
        ...appointmentDetails, 
        serviceType,
        duration: newDuration
      })
      updateEndTimeAndCost(appointmentDetails.startTime, newDuration)
    }
  }

  const updateEndTimeAndCost = (startTime: string, duration: number) => {
    if (startTime) {
      const [time, period] = startTime.split(" ")
      const [hours, minutes] = time.split(":").map(Number)
      let hour24 = hours
      if (period === "PM" && hours !== 12) hour24 += 12
      if (period === "AM" && hours === 12) hour24 = 0
      
      const endHour = (hour24 + duration) % 24
      const endPeriod = endHour >= 12 ? "PM" : "AM"
      const displayEndHour = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour
      const endTimeFormatted = `${displayEndHour}:${minutes.toString().padStart(2, '0')} ${endPeriod}`
      
      const selectedService = serviceTypes.find(s => s.id === appointmentDetails.serviceType)
      const baseRate = selectedService?.baseRate || appointmentDetails.nurse.hourlyRate
      let baseCost = baseRate * duration
      
      // Apply surcharges
      if (hour24 >= 18 && hour24 < 22) baseCost *= 1.25 // Evening 25%
      if (hour24 >= 22 || hour24 < 6) baseCost *= 1.5 // Night 50%
      
      // Home visit surcharge
      if (appointmentDetails.serviceLocation === "home") baseCost += 200
      
      setAppointmentDetails(prev => ({
        ...prev,
        endTime: endTimeFormatted,
        totalCost: Math.round(baseCost)
      }))
    }
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setBookingConfirmed(true)
      setTicketId(`NUR-${Date.now()}`)
      setCurrentStep(5)
    }, 3000)
  }

  const calculateFinalAmount = () => {
    if (!selectedPaymentMethod) return appointmentDetails.totalCost + 50
    
    const baseAmount = appointmentDetails.totalCost + 50
    if (selectedPaymentMethod.discount) {
      return baseAmount * (1 - selectedPaymentMethod.discount / 100)
    }
    return baseAmount
  }

  const getTimeSlotStyle = (slot: TimeSlot, isSelected: boolean) => {
    if (!slot.available) return "bg-gray-100 text-gray-400 cursor-not-allowed"
    if (isSelected) return "bg-teal-600 text-white border-teal-600"
    
    switch (slot.type) {
      case "night":
        return "border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-500"
      case "evening":
        return "border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-500"
      case "urgent":
        return "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
      default:
        return "border-gray-300 hover:border-teal-400 hover:bg-teal-50"
    }
  }

  const selectedServiceType = serviceTypes.find(s => s.id === appointmentDetails.serviceType)

  // Update cost when service location changes
  useEffect(() => {
    if (appointmentDetails.startTime) {
      updateEndTimeAndCost(appointmentDetails.startTime, appointmentDetails.duration)
    }
  }, [appointmentDetails.serviceLocation, appointmentDetails.serviceType])

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard" className="text-gray-600 hover:text-teal-600">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book Nursing Service</h1>
              <p className="text-gray-600">Schedule professional care with {appointmentDetails.nurse.name}</p>
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
                    currentStep === step.number ? "bg-teal-600 text-white" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {currentStep > step.number ? <FaCheck /> : <step.icon />}
                  </div>
                  <span className={`text-xs mt-2 text-center ${
                    currentStep >= step.number ? "text-teal-600 font-medium" : "text-gray-500"
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
        {/* Step 1: Nurse Profile */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nurse Profile</h2>
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{appointmentDetails.nurse.avatar}</div>
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                      <FaStar />
                      <span className="font-bold text-lg">{appointmentDetails.nurse.rating}</span>
                      <span className="text-gray-600 text-sm">({appointmentDetails.nurse.reviews} reviews)</span>
                    </div>
                    {appointmentDetails.nurse.verified && (
                      <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                        <FaShieldAlt />
                        <span className="font-medium text-sm">Licensed Professional</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{appointmentDetails.nurse.name}</h3>
                  <p className="text-lg text-teal-600 font-semibold mb-3">Age {appointmentDetails.nurse.age} • {appointmentDetails.nurse.experience}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Hourly Rate</h4>
                      <p className="text-2xl font-bold text-green-600">Rs {appointmentDetails.nurse.hourlyRate}/hour</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Languages</h4>
                      <p className="text-gray-600">{appointmentDetails.nurse.languages.join(", ")}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Service Area</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt />
                        <span>{appointmentDetails.nurse.location}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
                      <p className="text-gray-600">{appointmentDetails.nurse.availability.join(", ")}</p>
                    </div>
                  </div>

                  {/* License Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <FaCertificate className="text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Professional License</h4>
                        <p className="text-blue-700 text-sm">
                          License #{appointmentDetails.nurse.licenseInfo.number} - Valid until {appointmentDetails.nurse.licenseInfo.expiry}
                          <br />
                          Issued by: {appointmentDetails.nurse.licenseInfo.authority}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Qualifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {appointmentDetails.nurse.qualifications.map((qual, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {appointmentDetails.nurse.specializations.map((spec, index) => (
                        <span key={index} className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {appointmentDetails.nurse.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <FaCheck className="text-green-500 text-xs" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                    <p className="text-gray-600">{appointmentDetails.nurse.about}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all"
                >
                  Continue to Service Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Service Details */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Service Type Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Select Nursing Service</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {serviceTypes.map((service) => {
                    const Icon = service.icon
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleServiceTypeChange(service.id)}
                        className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg ${
                          appointmentDetails.serviceType === service.id
                            ? "border-teal-600 bg-teal-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className={`text-3xl mb-4 ${
                          appointmentDetails.serviceType === service.id ? "text-teal-600" : "text-gray-400"
                        }`} />
                        <h4 className="font-bold text-lg mb-2">{service.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Duration: {service.minHours}-{service.maxHours} hours</span>
                          <span>Rs {service.baseRate}/hour</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Service Location */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Service Location</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                    appointmentDetails.serviceLocation === "home"
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <input
                      type="radio"
                      name="location"
                      value="home"
                      checked={appointmentDetails.serviceLocation === "home"}
                      onChange={(e) => setAppointmentDetails({ 
                        ...appointmentDetails, 
                        serviceLocation: e.target.value as "home" | "clinic" 
                      })}
                      className="sr-only"
                    />
                    <FaHome className={`text-3xl mb-4 ${
                      appointmentDetails.serviceLocation === "home" ? "text-teal-600" : "text-gray-400"
                    }`} />
                    <h4 className="font-bold text-lg mb-2">Home Visit</h4>
                    <p className="text-sm text-gray-600 mb-2">Nurse comes to your home</p>
                    <p className="text-xs text-green-600 font-medium">+ Rs 200 travel fee</p>
                  </label>

                  <label className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                    appointmentDetails.serviceLocation === "clinic"
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <input
                      type="radio"
                      name="location"
                      value="clinic"
                      checked={appointmentDetails.serviceLocation === "clinic"}
                      onChange={(e) => setAppointmentDetails({ 
                        ...appointmentDetails, 
                        serviceLocation: e.target.value as "home" | "clinic" 
                      })}
                      className="sr-only"
                    />
                    <FaHospital className={`text-3xl mb-4 ${
                      appointmentDetails.serviceLocation === "clinic" ? "text-teal-600" : "text-gray-400"
                    }`} />
                    <h4 className="font-bold text-lg mb-2">Clinic Visit</h4>
                    <p className="text-sm text-gray-600 mb-2">Visit nurse at healthcare facility</p>
                    <p className="text-xs text-gray-500">No additional fees</p>
                  </label>
                </div>
              </div>

              {/* Duration Selection */}
              {appointmentDetails.serviceType && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Service Duration</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Duration: {appointmentDetails.duration} hours
                    </label>
                    <input
                      type="range"
                      min={selectedServiceType?.minHours || 1}
                      max={selectedServiceType?.maxHours || 12}
                      step="1"
                      value={appointmentDetails.duration}
                      onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{selectedServiceType?.minHours}h</span>
                      <span>{selectedServiceType?.maxHours}h</span>
                    </div>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4">
                    <p className="text-teal-800 font-medium">
                      Estimated Cost: Rs {appointmentDetails.totalCost}
                      <span className="text-sm text-teal-600 ml-2">
                        ({appointmentDetails.duration} hours × Rs {selectedServiceType?.baseRate}/hour 
                        {appointmentDetails.serviceLocation === "home" && " + Rs 200 travel fee"})
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Medical Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Medical Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Medical History & Current Conditions</label>
                    <textarea
                      rows={3}
                      placeholder="Please describe your current health condition, recent surgeries, medications, etc..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-teal-600"
                      value={appointmentDetails.medicalHistory}
                      onChange={(e) => setAppointmentDetails({ ...appointmentDetails, medicalHistory: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Specific Care Requirements</label>
                    <textarea
                      rows={3}
                      placeholder="Specific nursing care needed (wound care, medication administration, IV therapy, etc.)"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-teal-600"
                      value={appointmentDetails.specificRequirements}
                      onChange={(e) => setAppointmentDetails({ ...appointmentDetails, specificRequirements: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Emergency Contact Information</label>
                    <input
                      type="text"
                      placeholder="Name and phone number of emergency contact"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-teal-600"
                      value={appointmentDetails.emergencyContact}
                      onChange={(e) => setAppointmentDetails({ ...appointmentDetails, emergencyContact: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Communication Preference</label>
                    <select
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-teal-600"
                      value={appointmentDetails.communicationPreference}
                      onChange={(e) => setAppointmentDetails({ 
                        ...appointmentDetails, 
                        communicationPreference: e.target.value as "phone" | "sms" | "email" | "app"
                      })}
                    >
                      <option value="app">In-App Messages</option>
                      <option value="phone">Phone Calls</option>
                      <option value="sms">SMS Updates</option>
                      <option value="email">Email Updates</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Care Plan Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Additional notes about your care plan, preferences, or special instructions..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-teal-600"
                      value={appointmentDetails.carePlanNotes}
                      onChange={(e) => setAppointmentDetails({ ...appointmentDetails, carePlanNotes: e.target.value })}
                    />
                  </div>
                </div>
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
                disabled={!appointmentDetails.serviceType || !appointmentDetails.medicalHistory}
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Schedule
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Schedule Selection */}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Select Date & Time</h3>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Service Date
                  </label>
                  <input
                    type="date"
                    value={appointmentDetails.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>

                {/* Service Summary */}
                <div className="bg-teal-50 rounded-lg p-4">
                  <h4 className="font-semibold text-teal-800 mb-2">Service Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-teal-700">Service:</span>
                      <span className="font-medium">{selectedServiceType?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-700">Duration:</span>
                      <span className="font-medium">{appointmentDetails.duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-700">Location:</span>
                      <span className="font-medium">{appointmentDetails.serviceLocation === "home" ? "Home Visit" : "Clinic"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-700">Base Rate:</span>
                      <span className="font-medium">Rs {selectedServiceType?.baseRate}/hour</span>
                    </div>
                    <div className="border-t border-teal-200 pt-2 mt-2 flex justify-between">
                      <span className="text-teal-700 font-semibold">Total Cost:</span>
                      <span className="font-bold">Rs {appointmentDetails.totalCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Available Times</h3>
                {appointmentDetails.date ? (
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center gap-4 text-xs flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-gray-300 rounded"></div>
                          <span>Regular</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-orange-300 rounded"></div>
                          <span>Evening (+25%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-purple-300 rounded"></div>
                          <span>Night (+50%)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {mockTimeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => handleTimeSelect(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${getTimeSlotStyle(slot, appointmentDetails.startTime === slot.time)}`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>

                    {appointmentDetails.startTime && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaClock className="text-green-600" />
                          <span className="font-semibold text-green-800">Scheduled Service</span>
                        </div>
                        <p className="text-green-700 text-sm">
                          {appointmentDetails.startTime} - {appointmentDetails.endTime}
                          <br />
                          Duration: {appointmentDetails.duration} hours
                          <br />
                          Location: {appointmentDetails.serviceLocation === "home" ? "Home Visit" : "Clinic"}
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
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                disabled={!appointmentDetails.date || !appointmentDetails.startTime}
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
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
                        ? "border-teal-600 bg-teal-50" 
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
                    <span className="text-gray-600">Nursing Service ({appointmentDetails.duration} hours)</span>
                    <span className="font-medium">Rs {appointmentDetails.totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">Rs 50</span>
                  </div>
                  {selectedPaymentMethod?.discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({selectedPaymentMethod.discount}%)</span>
                      <span className="font-medium">
                        - Rs {Math.round((appointmentDetails.totalCost + 50) * selectedPaymentMethod.discount / 100)}
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

              {/* Professional Care Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Professional Care Assurance</h4>
                    <p className="text-blue-700 text-sm">All nurses are licensed professionals with verified credentials and ongoing training. Your health and safety are our priority.</p>
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
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Nursing Service Booked!</h2>
              <p className="text-gray-600 mb-8">Your nursing appointment has been successfully confirmed.</p>
              
              {/* Digital Ticket */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-6 text-white mb-8 text-left">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Nursing Service Ticket</h3>
                    <p className="text-teal-100 text-sm">Keep this for your records</p>
                  </div>
                  <div className="text-right">
                    <p className="text-teal-100 text-sm">Ticket ID</p>
                    <p className="font-bold text-lg">{ticketId}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-teal-100">Nurse Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-teal-200">Name:</span> {appointmentDetails.nurse.name}</p>
                      <p><span className="text-teal-200">License:</span> {appointmentDetails.nurse.licenseInfo.number}</p>
                      <p><span className="text-teal-200">Rating:</span> {appointmentDetails.nurse.rating}⭐ ({appointmentDetails.nurse.reviews} reviews)</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-teal-100">Service Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-teal-200">Date:</span> {appointmentDetails.date}</p>
                      <p><span className="text-teal-200">Time:</span> {appointmentDetails.startTime} - {appointmentDetails.endTime}</p>
                      <p><span className="text-teal-200">Duration:</span> {appointmentDetails.duration} hours</p>
                      <p><span className="text-teal-200">Amount Paid:</span> Rs {Math.round(calculateFinalAmount())}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaStethoscope className="text-teal-200" />
                    <span className="font-semibold text-teal-100">Care Plan</span>
                  </div>
                  <p className="text-teal-100 text-sm">
                    {selectedServiceType?.name} - {appointmentDetails.serviceLocation === "home" ? "Home visit" : "Clinic visit"}
                    <br />
                    Professional nursing care with emergency protocols available.
                  </p>
                </div>
              </div>

              {/* Nurse Credentials Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <FaCertificate className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Nurse Credentials & Certifications</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">Professional License:</p>
                        <p className="text-blue-600">#{appointmentDetails.nurse.licenseInfo.number}</p>
                        <p className="text-blue-600">Valid until: {appointmentDetails.nurse.licenseInfo.expiry}</p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-medium">Certifications:</p>
                        <ul className="text-blue-600 text-xs space-y-1">
                          {appointmentDetails.nurse.certifications.map((cert, index) => (
                            <li key={index}>• {cert}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Protocols */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-red-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Emergency Protocols</h4>
                    <ul className="text-red-800 text-sm space-y-1">
                      <li>• 24/7 emergency support hotline available during service</li>
                      <li>• Nurse carries emergency medical equipment and supplies</li>
                      <li>• Direct communication line to supervising physician</li>
                      <li>• Immediate emergency services coordination if needed</li>
                      <li>• Real-time health monitoring and reporting</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h4 className="font-semibold text-gray-900 mb-4">What happens next?</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Nurse Contact</p>
                      <p className="text-gray-600 text-sm">Your nurse will contact you 2 hours before the service</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pre-Service Assessment</p>
                      <p className="text-gray-600 text-sm">Brief health assessment and care plan review</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Professional Care</p>
                      <p className="text-gray-600 text-sm">Receive professional nursing care as scheduled</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Care Report</p>
                      <p className="text-gray-600 text-sm">Receive detailed nursing report and follow-up recommendations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-4 gap-3 mb-6">
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaDownload className="text-teal-600 text-xl" />
                  <span className="text-sm font-medium">Download Ticket</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaPrint className="text-green-600 text-xl" />
                  <span className="text-sm font-medium">Print Details</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaCalendarPlus className="text-purple-600 text-xl" />
                  <span className="text-sm font-medium">Add to Calendar</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaPhone className="text-orange-600 text-xl" />
                  <span className="text-sm font-medium">Contact Nurse</span>
                </button>
              </div>

              {/* Main Action Buttons */}
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/patient/nursing/appointments" className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all text-center">
                  View My Appointments
                </Link>
                <Link href="/patient/dashboard" className="border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center">
                  Go to Dashboard
                </Link>
              </div>
              
              {/* Emergency Contact */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaExclamationTriangle className="text-red-600" />
                    <span className="font-semibold text-red-800">24/7 Emergency Support</span>
                  </div>
                  <p className="text-sm text-red-700">
                    For any medical emergencies during nursing service: 
                    <a href="tel:+2304004000" className="font-semibold hover:underline ml-1">
                      +230 400 4000
                    </a>
                  </p>
                </div>
              </div>

              {/* Service Rating */}
              <div className="mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaStar className="text-blue-600" />
                    <span className="font-semibold text-blue-800">Rate Your Nursing Experience</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Help us maintain quality care by rating your nursing service experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Emergency Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all">
            <FaPhone className="text-xl" />
          </button>
        </div>

        {/* Nursing Info Button */}
        <div className="fixed bottom-6 left-6 z-50">
          <button className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-all">
            <FaInfoCircle className="text-xl" />
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0d9488;
          cursor: pointer;
          box-shadow: 0 0 2px 0 #555;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #0d9488;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px 0 #555;
        }
      `}</style>
    </div>
  )
}