"use client"

import { useState } from "react"
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
  FaBaby,
  FaHome,
  FaGraduationCap,
  FaHeart,
  FaCertificate,
  FaExclamationTriangle,
  FaUserCheck
} from "react-icons/fa"

interface Nanny {
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
  specialties: string[];
  about: string;
  rating: number;
  reviews: number;
  verified: boolean;
  backgroundCheck: {
    status: "verified" | "pending" | "expired";
    date: string;
    authority: string;
  };
  certifications: string[];
}

interface TimeSlot {
  time: string;
  available: boolean;
  type: "regular" | "urgent" | "evening";
}

interface ServiceType {
  id: string;
  name: string;
  description: string;
  minHours: number;
  maxHours: number;
  icon: React.ComponentType<{ className?: string; }>;
}

interface Child {
  name: string;
  age: number;
  specialNeeds: string;
  allergies: string;
  emergencyContact: string;
  preferences: string;
}

interface AppointmentDetails {
  nanny: Nanny;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  duration: number;
  totalCost: number;
  children: Child[];
  specialRequirements: string;
  parentNotes: string;
  communicationPreference: "phone" | "sms" | "email" | "app";
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

// Mock nanny data (pre-selected)
const mockNanny: Nanny = {
  id: "1",
  name: "Marie Dubois",
  age: 28,
  experience: "5+ years",
  hourlyRate: 350,
  avatar: "👩‍🍼",
  availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  languages: ["English", "French", "Creole"],
  location: "Curepipe, Mauritius",
  qualifications: ["Child Development Certificate", "First Aid Certified", "Early Childhood Education"],
  specialties: ["Infant Care", "Special Needs", "Educational Activities", "Meal Preparation"],
  about: "Experienced and caring childcare provider with specialization in infant care and early childhood development. Passionate about creating safe, nurturing environments for children to learn and grow.",
  rating: 4.9,
  reviews: 127,
  verified: true,
  backgroundCheck: {
    status: "verified",
    date: "2024-01-15",
    authority: "Mauritius Police Force"
  },
  certifications: ["CPR Certified", "First Aid", "Child Protection Training", "Nutrition & Safety"]
}

const serviceTypes: ServiceType[] = [
  {
    id: "babysitting",
    name: "Babysitting",
    description: "General childcare supervision and activities",
    minHours: 2,
    maxHours: 12,
    icon: FaBaby
  },
  {
    id: "overnight",
    name: "Overnight Care",
    description: "Extended care including overnight supervision",
    minHours: 8,
    maxHours: 24,
    icon: FaHome
  },
  {
    id: "educational",
    name: "Educational Activities",
    description: "Learning-focused care with educational games",
    minHours: 3,
    maxHours: 8,
    icon: FaGraduationCap
  },
  {
    id: "special-needs",
    name: "Special Needs Care",
    description: "Specialized care for children with special requirements",
    minHours: 4,
    maxHours: 10,
    icon: FaHeart
  }
]

const mockTimeSlots: TimeSlot[] = [
  { time: "08:00 AM", available: true, type: "regular" },
  { time: "09:00 AM", available: true, type: "regular" },
  { time: "10:00 AM", available: false, type: "regular" },
  { time: "11:00 AM", available: true, type: "regular" },
  { time: "12:00 PM", available: true, type: "regular" },
  { time: "01:00 PM", available: true, type: "regular" },
  { time: "02:00 PM", available: false, type: "regular" },
  { time: "03:00 PM", available: true, type: "regular" },
  { time: "04:00 PM", available: true, type: "regular" },
  { time: "05:00 PM", available: true, type: "regular" },
  { time: "06:00 PM", available: true, type: "evening" },
  { time: "07:00 PM", available: true, type: "evening" }
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
    name: "Corporate Childcare Plan",
    description: "Use your company's childcare benefits",
    discount: 40,
    icon: "🏢",
    available: true
  },
  {
    id: "insurance",
    type: "insurance",
    name: "Family Insurance Coverage",
    description: "Apply family care insurance (60% covered)",
    discount: 60,
    icon: "🛡️",
    available: true
  },
  {
    id: "subscription",
    type: "subscription",
    name: "Childcare Subscription",
    description: "Use your active childcare plan",
    discount: 100,
    icon: "💳",
    available: true
  }
]

export default function ChildcareAppointmentBooking() {
  const [currentStep, setCurrentStep] = useState(1)
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    nanny: mockNanny,
    date: "",
    startTime: "",
    endTime: "",
    serviceType: "",
    duration: 4,
    totalCost: 0,
    children: [{ name: "", age: 0, specialNeeds: "", allergies: "", emergencyContact: "", preferences: "" }],
    specialRequirements: "",
    parentNotes: "",
    communicationPreference: "app"
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const steps = [
    { number: 1, title: "Nanny Profile", icon: FaUserCheck },
    { number: 2, title: "Service Details", icon: FaBaby },
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
      const endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      const endPeriod = endHour >= 12 ? "PM" : "AM"
      const displayEndHour = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour
      const endTimeFormatted = `${displayEndHour}:${minutes.toString().padStart(2, '0')} ${endPeriod}`
      
      const baseCost = appointmentDetails.nanny.hourlyRate * duration
      const eveningRate = startTime.includes("PM") && hour24 >= 18 ? baseCost * 0.2 : 0
      const totalCost = baseCost + eveningRate
      
      setAppointmentDetails(prev => ({
        ...prev,
        endTime: endTimeFormatted,
        totalCost
      }))
    }
  }

  const addChild = () => {
    setAppointmentDetails(prev => ({
      ...prev,
      children: [...prev.children, { name: "", age: 0, specialNeeds: "", allergies: "", emergencyContact: "", preferences: "" }]
    }))
  }

  const removeChild = (index: number) => {
    setAppointmentDetails(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }))
  }

  const updateChild = (index: number, field: keyof Child, value: string | number) => {
    setAppointmentDetails(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }))
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setBookingConfirmed(true)
      setTicketId(`CHD-${Date.now()}`)
      setCurrentStep(5)
    }, 3000)
  }

  const calculateFinalAmount = () => {
    if (!selectedPaymentMethod) return appointmentDetails.totalCost + 25
    
    const baseAmount = appointmentDetails.totalCost + 25
    if (selectedPaymentMethod.discount) {
      return baseAmount * (1 - selectedPaymentMethod.discount / 100)
    }
    return baseAmount
  }

  const getTimeSlotStyle = (slot: TimeSlot, isSelected: boolean) => {
    if (!slot.available) return "bg-gray-100 text-gray-400 cursor-not-allowed"
    if (isSelected) return "bg-pink-600 text-white border-pink-600"
    
    switch (slot.type) {
      case "evening":
        return "border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-500"
      case "urgent":
        return "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
      default:
        return "border-gray-300 hover:border-pink-400 hover:bg-pink-50"
    }
  }

  const selectedServiceType = serviceTypes.find(s => s.id === appointmentDetails.serviceType)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard" className="text-gray-600 hover:text-pink-600">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book Childcare Service</h1>
              <p className="text-gray-600">Schedule care with {appointmentDetails.nanny.name}</p>
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
                    currentStep === step.number ? "bg-pink-600 text-white" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {currentStep > step.number ? <FaCheck /> : <step.icon />}
                  </div>
                  <span className={`text-xs mt-2 text-center ${
                    currentStep >= step.number ? "text-pink-600 font-medium" : "text-gray-500"
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
        {/* Step 1: Nanny Profile */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nanny Profile</h2>
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{appointmentDetails.nanny.avatar}</div>
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                      <FaStar />
                      <span className="font-bold text-lg">{appointmentDetails.nanny.rating}</span>
                      <span className="text-gray-600 text-sm">({appointmentDetails.nanny.reviews} reviews)</span>
                    </div>
                    {appointmentDetails.nanny.verified && (
                      <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                        <FaShieldAlt />
                        <span className="font-medium text-sm">Verified Caregiver</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{appointmentDetails.nanny.name}</h3>
                  <p className="text-lg text-pink-600 font-semibold mb-3">Age {appointmentDetails.nanny.age} • {appointmentDetails.nanny.experience}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Hourly Rate</h4>
                      <p className="text-2xl font-bold text-green-600">Rs {appointmentDetails.nanny.hourlyRate}/hour</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Languages</h4>
                      <p className="text-gray-600">{appointmentDetails.nanny.languages.join(", ")}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt />
                        <span>{appointmentDetails.nanny.location}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
                      <p className="text-gray-600">{appointmentDetails.nanny.availability.join(", ")}</p>
                    </div>
                  </div>

                  {/* Background Check Verification */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <FaCertificate className="text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">Background Check Verified</h4>
                        <p className="text-green-700 text-sm">
                          Verified on {appointmentDetails.nanny.backgroundCheck.date} by {appointmentDetails.nanny.backgroundCheck.authority}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Qualifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {appointmentDetails.nanny.qualifications.map((qual, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {appointmentDetails.nanny.specialties.map((specialty, index) => (
                        <span key={index} className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {appointmentDetails.nanny.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <FaCheck className="text-green-500 text-xs" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                    <p className="text-gray-600">{appointmentDetails.nanny.about}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-pink-800 transition-all"
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
                <h3 className="text-xl font-bold text-gray-900 mb-6">Select Service Type</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {serviceTypes.map((service) => {
                    const Icon = service.icon
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleServiceTypeChange(service.id)}
                        className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg ${
                          appointmentDetails.serviceType === service.id
                            ? "border-pink-600 bg-pink-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className={`text-3xl mb-4 ${
                          appointmentDetails.serviceType === service.id ? "text-pink-600" : "text-gray-400"
                        }`} />
                        <h4 className="font-bold text-lg mb-2">{service.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <p className="text-xs text-gray-500">
                          Duration: {service.minHours}-{service.maxHours} hours
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Duration Selection */}
              {appointmentDetails.serviceType && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Service Duration</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Hours of Care: {appointmentDetails.duration} hours
                    </label>
                    <input
                      type="range"
                      min={selectedServiceType?.minHours || 2}
                      max={selectedServiceType?.maxHours || 12}
                      step="1"
                      value={appointmentDetails.duration}
                      onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{selectedServiceType?.minHours}h</span>
                      <span>{selectedServiceType?.maxHours}h</span>
                    </div>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4">
                    <p className="text-pink-800 font-medium">
                      Estimated Cost: Rs {appointmentDetails.totalCost} 
                      <span className="text-sm text-pink-600 ml-2">
                        ({appointmentDetails.duration} hours × Rs {appointmentDetails.nanny.hourlyRate}/hour)
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Children Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Children Information</h3>
                  <button
                    onClick={addChild}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-700 flex items-center gap-2"
                  >
                    <FaBaby />
                    Add Child
                  </button>
                </div>
                
                {appointmentDetails.children.map((child, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Child {index + 1}</h4>
                      {appointmentDetails.children.length > 1 && (
                        <button
                          onClick={() => removeChild(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Name *</label>
                        <input
                          type="text"
                          placeholder="Child's name"
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-600"
                          value={child.name}
                          onChange={(e) => updateChild(index, 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Age *</label>
                        <input
                          type="number"
                          placeholder="Age"
                          min="0"
                          max="18"
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-600"
                          value={child.age}
                          onChange={(e) => updateChild(index, 'age', parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Special Needs</label>
                        <input
                          type="text"
                          placeholder="Any special needs or conditions"
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-600"
                          value={child.specialNeeds}
                          onChange={(e) => updateChild(index, 'specialNeeds', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Allergies</label>
                        <input
                          type="text"
                          placeholder="Food or other allergies"
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-600"
                          value={child.allergies}
                          onChange={(e) => updateChild(index, 'allergies', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-gray-700 font-medium mb-2">Care Preferences</label>
                      <textarea
                        rows={2}
                        placeholder="Activities they enjoy, bedtime routines, meal preferences..."
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-600"
                        value={child.preferences}
                        onChange={(e) => updateChild(index, 'preferences', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Requirements */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Special Requirements</label>
                    <textarea
                      rows={3}
                      placeholder="Any special care instructions, house rules, or requirements..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-600"
                      value={appointmentDetails.specialRequirements}
                      onChange={(e) => setAppointmentDetails({ ...appointmentDetails, specialRequirements: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Communication Preference</label>
                    <select
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-600"
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
                    <label className="block text-gray-700 font-medium mb-2">Notes for Nanny</label>
                    <textarea
                      rows={3}
                      placeholder="Any additional notes, emergency contacts, or important information..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-600"
                      value={appointmentDetails.parentNotes}
                      onChange={(e) => setAppointmentDetails({ ...appointmentDetails, parentNotes: e.target.value })}
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
                disabled={!appointmentDetails.serviceType || appointmentDetails.children.some(child => !child.name || child.age === 0)}
                className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-pink-600"
                  />
                </div>

                {/* Service Summary */}
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-800 mb-2">Service Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-pink-700">Service:</span>
                      <span className="font-medium">{selectedServiceType?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pink-700">Duration:</span>
                      <span className="font-medium">{appointmentDetails.duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pink-700">Children:</span>
                      <span className="font-medium">{appointmentDetails.children.filter(c => c.name).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pink-700">Rate:</span>
                      <span className="font-medium">Rs {appointmentDetails.nanny.hourlyRate}/hour</span>
                    </div>
                    <div className="border-t border-pink-200 pt-2 mt-2 flex justify-between">
                      <span className="text-pink-700 font-semibold">Total Cost:</span>
                      <span className="font-bold">Rs {appointmentDetails.totalCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Available Start Times</h3>
                {appointmentDetails.date ? (
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-gray-300 rounded"></div>
                          <span>Regular Hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-purple-300 rounded"></div>
                          <span>Evening (+20%)</span>
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
                          <span className="font-semibold text-green-800">Scheduled Time</span>
                        </div>
                        <p className="text-green-700 text-sm">
                          {appointmentDetails.startTime} - {appointmentDetails.endTime}
                          <br />
                          Duration: {appointmentDetails.duration} hours
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
                className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                        ? "border-pink-600 bg-pink-50" 
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
                    <span className="text-gray-600">Service Fee ({appointmentDetails.duration} hours)</span>
                    <span className="font-medium">Rs {appointmentDetails.totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">Rs 25</span>
                  </div>
                  {selectedPaymentMethod?.discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({selectedPaymentMethod.discount}%)</span>
                      <span className="font-medium">
                        - Rs {Math.round((appointmentDetails.totalCost + 25) * selectedPaymentMethod.discount / 100)}
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

              {/* Safety Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Child Safety Guarantee</h4>
                    <p className="text-blue-700 text-sm">All our caregivers undergo thorough background checks and safety training. The  safety of your child is our top priority.</p>
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
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Childcare Service Booked!</h2>
              <p className="text-gray-600 mb-8">Your childcare appointment has been successfully confirmed.</p>
              
              {/* Digital Ticket */}
              <div className="bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl p-6 text-white mb-8 text-left">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Childcare Service Ticket</h3>
                    <p className="text-pink-100 text-sm">Keep this for your records</p>
                  </div>
                  <div className="text-right">
                    <p className="text-pink-100 text-sm">Ticket ID</p>
                    <p className="font-bold text-lg">{ticketId}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-pink-100">Nanny Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-pink-200">Name:</span> {appointmentDetails.nanny.name}</p>
                      <p><span className="text-pink-200">Experience:</span> {appointmentDetails.nanny.experience}</p>
                      <p><span className="text-pink-200">Rating:</span> {appointmentDetails.nanny.rating}⭐ ({appointmentDetails.nanny.reviews} reviews)</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-pink-100">Service Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-pink-200">Date:</span> {appointmentDetails.date}</p>
                      <p><span className="text-pink-200">Time:</span> {appointmentDetails.startTime} - {appointmentDetails.endTime}</p>
                      <p><span className="text-pink-200">Duration:</span> {appointmentDetails.duration} hours</p>
                      <p><span className="text-pink-200">Amount Paid:</span> Rs {Math.round(calculateFinalAmount())}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaBaby className="text-pink-200" />
                    <span className="font-semibold text-pink-100">Children Care</span>
                  </div>
                  <p className="text-pink-100 text-sm">
                    Service for {appointmentDetails.children.filter(c => c.name).length} child(ren). 
                    Nanny will arrive 15 minutes before start time for briefing.
                  </p>
                </div>
              </div>

              {/* Safety Information */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Safety & Security</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Background check verified on {appointmentDetails.nanny.backgroundCheck.date}</li>
                      <li>• Emergency contact information shared with nanny</li>
                      <li>• Real-time updates available through app</li>
                      <li>• 24/7 support hotline available during service</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h4 className="font-semibold text-gray-900 mb-4">What happens next?</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-pink-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Nanny Contact</p>
                      <p className="text-gray-600 text-sm">Your nanny will contact you 24 hours before the service</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-pink-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pre-Service Briefing</p>
                      <p className="text-gray-600 text-sm">15-minute briefing about the needs of your children and preferences</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-pink-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Service Updates</p>
                      <p className="text-gray-600 text-sm">Receive regular updates via your preferred communication method</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-pink-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Service Report</p>
                      <p className="text-gray-600 text-sm">Receive detailed report of activities and care provided</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-4 gap-3 mb-6">
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaDownload className="text-pink-600 text-xl" />
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
                  <span className="text-sm font-medium">Contact Nanny</span>
                </button>
              </div>

              {/* Main Action Buttons */}
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/patient/childcare/appointments" className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-pink-700 hover:to-pink-800 transition-all text-center">
                  View My Bookings
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
                    <span className="font-semibold text-red-800">Emergency Support</span>
                  </div>
                  <p className="text-sm text-red-700">
                    For any concerns during childcare service, call our 24/7 emergency line: 
                    <a href="tel:+2304004000" className="font-semibold hover:underline ml-1">
                      +230 400 4000
                    </a>
                  </p>
                </div>
              </div>

              {/* Rating Reminder */}
              <div className="mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaStar className="text-blue-600" />
                    <span className="font-semibold text-blue-800">Rate Your Experience</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    After your service, please rate your experience to help other families and improve our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Emergency Button (visible on all steps) */}
        <div className="fixed bottom-6 right-6 z-50">
          <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all">
            <FaPhone className="text-xl" />
          </button>
        </div>

        {/* Service Information Modal Trigger */}
        <div className="fixed bottom-6 left-6 z-50">
          <button className="bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-full shadow-lg transition-all">
            <FaInfoCircle className="text-xl" />
          </button>
        </div>
      </div>

      {/* Additional Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          box-shadow: 0 0 2px 0 #555;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px 0 #555;
        }
      `}</style>
    </div>
  )
}