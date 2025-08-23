"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaCheck,
  FaWallet,
  FaExclamationTriangle,
  FaHeartbeat,
  FaAmbulance,
  FaLocationArrow,
  FaUser,
  FaUserMd,
  FaShieldAlt,
  FaRoute,
  FaBroadcastTower,
  FaSpinner,
  FaPhoneAlt,
  FaDirections,
  FaCalendarAlt,
  FaInfoCircle,
  FaMobile,
  FaCar,
  FaHospital,
  FaMapMarkedAlt,
  FaRocket,
  FaCrosshairs,
  FaSatellite,
  FaMapPin,
  FaTimes,
  FaExclamation,
  FaClock,
  FaDownload,
  FaPrint
} from "react-icons/fa"

interface EmergencyService {
  id: string;
  name: string;
  type: string;
  category: string;
  responseTime: string;
  availability: string;
  rating: number;
  reviews: number;
  location: string;
  coverage: string;
  phone: string;
  alternatePhone: string;
  email: string;
  services: string[];
  equipment: string[];
  certifications: string[];
  vehicleTypes: string[];
  languages: string[];
  gpsTracking: boolean;
  verified: boolean;
  governmentApproved: boolean;
  bio: string;
  avatar: string;
  currentStatus: "available" | "busy" | "en-route";
  estimatedArrival?: string;
  unitNumber?: string;
  driverName?: string;
  vehicleDetails?: string;
}

interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  timestamp: Date;
}

interface EmergencyBooking {
  serviceId: string;
  service: EmergencyService;
  urgencyLevel: "critical" | "urgent" | "standard";
  location: LocationInfo | null;
  medicalCondition: string;
  patientDetails: {
    name: string;
    age: string;
    gender: string;
    conditions: string[];
    allergies: string[];
    medications: string[];
    emergencyContact: string;
    emergencyPhone: string;
  };
  paymentMethod: string;
  additionalInfo: string;
  bookingTime: Date;
}

interface PaymentMethod {
  id: string;
  type: "mcb-juice" | "corporate" | "insurance" | "subscription" | "emergency-fund";
  name: string;
  description: string;
  discount?: number;
  icon: string;
  available: boolean;
  processingTime: string;
}

const mockEmergencyService: EmergencyService = {
  id: "amb-001",
  name: "Rapid Response Ambulance",
  type: "Advanced Life Support",
  category: "Emergency Medical",
  responseTime: "8-12 minutes",
  availability: "24/7",
  rating: 4.9,
  reviews: 342,
  location: "Port Louis Central",
  coverage: "Island-wide",
  phone: "114",
  alternatePhone: "+230 5789 0114",
  email: "dispatch@rapidresponse.mu",
  services: ["Emergency Transport", "Advanced Life Support", "Cardiac Care", "Trauma Response"],
  equipment: ["Defibrillator", "Oxygen", "IV Equipment", "Spinal Board", "Cardiac Monitor"],
  certifications: ["Ministry of Health Approved", "Advanced Life Support", "Emergency Medical Services"],
  vehicleTypes: ["Type B Ambulance", "Critical Care Transport"],
  languages: ["English", "French", "Creole", "Hindi"],
  gpsTracking: true,
  verified: true,
  governmentApproved: true,
  bio: "Premier emergency medical service with advanced life support capabilities and fastest response times in Mauritius",
  avatar: "🚑",
  currentStatus: "available",
  unitNumber: "AMB-114-07",
  driverName: "Jean-Michel Patel",
  vehicleDetails: "Mercedes Sprinter 2023 - Advanced Life Support"
}

const emergencyPaymentMethods: PaymentMethod[] = [
  {
    id: "emergency-fund",
    type: "emergency-fund",
    name: "Emergency Fund",
    description: "Government emergency healthcare fund - No upfront payment",
    discount: 100,
    icon: "🆘",
    available: true,
    processingTime: "Instant"
  },
  {
    id: "mcb-juice",
    type: "mcb-juice",
    name: "MCB Juice",
    description: "Instant mobile payment - Priority processing",
    icon: "📱",
    available: true,
    processingTime: "< 30 seconds"
  },
  {
    id: "insurance",
    type: "insurance",
    name: "Insurance Coverage",
    description: "Direct billing to your health insurance",
    discount: 80,
    icon: "🛡️",
    available: true,
    processingTime: "< 2 minutes"
  },
  {
    id: "corporate",
    type: "corporate",
    name: "Corporate Emergency Plan",
    description: "Company emergency healthcare coverage",
    discount: 90,
    icon: "🏢",
    available: true,
    processingTime: "< 1 minute"
  },
  {
    id: "subscription",
    type: "subscription",
    name: "Healthwyz Premium",
    description: "Full coverage with premium subscription",
    discount: 100,
    icon: "⭐",
    available: true,
    processingTime: "Instant"
  }
]

const urgencyLevels = [
  {
    level: "critical",
    name: "CRITICAL",
    description: "Life-threatening emergency",
    color: "bg-red-600 text-white border-red-700",
    bgColor: "bg-red-50 border-red-300",
    textColor: "text-red-700",
    responseTime: "4-6 minutes",
    examples: ["Cardiac arrest", "Severe bleeding", "Unconscious", "Severe difficulty breathing"]
  },
  {
    level: "urgent",
    name: "URGENT", 
    description: "Serious medical situation",
    color: "bg-orange-500 text-white border-orange-600",
    bgColor: "bg-orange-50 border-orange-300",
    textColor: "text-orange-700",
    responseTime: "8-12 minutes",
    examples: ["Chest pain", "Broken bones", "High fever", "Severe allergic reaction"]
  },
  {
    level: "standard",
    name: "STANDARD",
    description: "Medical transport needed",
    color: "bg-blue-500 text-white border-blue-600",
    bgColor: "bg-blue-50 border-blue-300",
    textColor: "text-blue-700",
    responseTime: "15-20 minutes",
    examples: ["Medical appointments", "Non-emergency transport", "Stable patient transfer"]
  }
]

export default function EmergencyAmbulanceBooking() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [trackingActive, setTrackingActive] = useState(false)
  const [estimatedArrival, setEstimatedArrival] = useState("8 minutes")
  const [ambulanceLocation, setAmbulanceLocation] = useState("En route")
  
  const [booking, setBooking] = useState<EmergencyBooking>({
    serviceId: mockEmergencyService.id,
    service: mockEmergencyService,
    urgencyLevel: "urgent",
    location: null,
    medicalCondition: "",
    patientDetails: {
      name: "",
      age: "",
      gender: "",
      conditions: [],
      allergies: [],
      medications: [],
      emergencyContact: "",
      emergencyPhone: ""
    },
    paymentMethod: "",
    additionalInfo: "",
    bookingTime: new Date()
  })
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [ticketId, setTicketId] = useState("")

  const mapRef = useRef<HTMLDivElement>(null)

  const steps = [
    { number: 1, title: "Emergency Assessment", icon: FaExclamationTriangle },
    { number: 2, title: "Location & Details", icon: FaMapMarkerAlt },
    { number: 3, title: "Patient Information", icon: FaUser },
    { number: 4, title: "Payment & Dispatch", icon: FaWallet },
    { number: 5, title: "Live Tracking", icon: FaRoute }
  ]

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationInfo: LocationInfo = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Current Location",
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          }
          
          setBooking(prev => ({ ...prev, location: locationInfo }))
          setLocationPermissionGranted(true)
          setIsGettingLocation(false)
          
          setTimeout(() => {
            setBooking(prev => ({
              ...prev,
              location: {
                ...locationInfo,
                address: "123 Royal Street, Port Louis, Mauritius"
              }
            }))
          }, 1500)
        },
        (error) => {
          console.error("Location error:", error)
          setIsGettingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    }
  }

  const handleUrgencySelect = (level: "critical" | "urgent" | "standard") => {
    setBooking(prev => ({ ...prev, urgencyLevel: level }))
  }

  const handlePatientDetailsChange = (field: string, value: string | string[]) => {
    setBooking(prev => ({
      ...prev,
      patientDetails: {
        ...prev.patientDetails,
        [field]: value
      }
    }))
  }

  const handleEmergencyDispatch = () => {
    setIsProcessing(true)
    
    setTimeout(() => {
      setBookingConfirmed(true)
      setTicketId(`EMG-${Date.now()}-${Math.floor(Math.random() * 1000)}`)
      setTrackingActive(true)
      setCurrentStep(5)
      setIsProcessing(false)
      
      startLiveTracking()
    }, 2000)
  }

  const startLiveTracking = () => {
    const updates = [
      { time: "2 minutes", status: "Ambulance dispatched", location: "Central Station" },
      { time: "4 minutes", status: "En route to your location", location: "Travelling via A1" },
      { time: "6 minutes", status: "Approaching destination", location: "2 minutes away" },
      { time: "8 minutes", status: "Arrived at location", location: "On-site" }
    ]
    
    updates.forEach((update, index) => {
      setTimeout(() => {
        setEstimatedArrival(`${8 - (index + 1) * 2} minutes`)
        setAmbulanceLocation(update.status)
      }, (index + 1) * 2000)
    })
  }

  const selectedUrgency = urgencyLevels.find(u => u.level === booking.urgencyLevel)
  const baseCost = booking.urgencyLevel === "critical" ? 2500 : booking.urgencyLevel === "urgent" ? 1800 : 1200
  const finalCost = selectedPaymentMethod?.discount ? 
    baseCost * (1 - selectedPaymentMethod.discount / 100) : baseCost

  useEffect(() => {
    if (currentStep === 1) {
      getCurrentLocation()
    }
  }, [currentStep])

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard" className="text-red-100 hover:text-white">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-6xl">🚑</div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Emergency Ambulance Service
                  <FaBroadcastTower className="text-red-200 animate-pulse" />
                </h1>
                <p className="text-red-100 text-lg">24/7 Rapid Response • GPS Tracking • Advanced Life Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Status Banner */}
      <div className="bg-yellow-400 text-yellow-900 px-4 py-3">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <FaExclamation className="animate-pulse" />
          <span className="font-bold">EMERGENCY BOOKING IN PROGRESS</span>
          <FaClock className="animate-pulse" />
          <span>For life-threatening emergencies, call 114 directly</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg ${
                    currentStep > step.number ? "bg-green-500 text-white" :
                    currentStep === step.number ? "bg-red-600 text-white" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {currentStep > step.number ? <FaCheck /> : <step.icon />}
                  </div>
                  <span className={`text-sm mt-2 text-center font-medium ${
                    currentStep >= step.number ? "text-red-600" : "text-gray-500"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-2 mx-3 ${
                    currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Emergency Assessment */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-8xl">🚑</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{mockEmergencyService.name}</h2>
                  <p className="text-xl text-red-600 font-semibold mb-2">{mockEmergencyService.type}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-red-500" />
                      <span className="font-semibold">Response: {mockEmergencyService.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-green-500" />
                      <span className="font-semibold">24/7 Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkedAlt className="text-blue-500" />
                      <span className="font-semibold">GPS Tracking</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(mockEmergencyService.rating) ? "text-yellow-500" : "text-gray-300"}>⭐</span>
                        ))}
                      </div>
                      <span className="font-bold">{mockEmergencyService.rating}</span>
                      <span className="text-gray-600">({mockEmergencyService.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <div className="font-bold text-green-800">AVAILABLE</div>
                  <div className="text-green-700 text-sm">Ready to dispatch</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">Emergency Equipment & Capabilities</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Medical Equipment:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {mockEmergencyService.equipment.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <FaCheck className="text-green-500 text-xs" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Emergency Services:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {mockEmergencyService.services.map((service, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <FaHeartbeat className="text-red-500 text-xs" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Emergency Priority Level</h2>
              <p className="text-gray-600 mb-6">Choose the priority level that best describes the medical situation</p>
              
              <div className="space-y-4">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.level}
                    onClick={() => handleUrgencySelect(level.level as "critical" | "urgent" | "standard")}
                    className={`w-full p-6 border-3 rounded-2xl text-left transition-all ${
                      booking.urgencyLevel === level.level 
                        ? `${level.bgColor} border-current shadow-lg` 
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-4 py-2 rounded-full font-bold ${level.color}`}>
                        {level.name}
                      </div>
                      <div className={`text-sm font-semibold ${level.textColor}`}>
                        Response: {level.responseTime}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{level.description}</h3>
                    
                    <div className="mb-3">
                      <span className="text-sm text-gray-600 font-medium">Examples: </span>
                      <span className="text-sm text-gray-700">{level.examples.join(", ")}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-red-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-red-800 mb-2">Important Emergency Information</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• For immediate life-threatening emergencies, call <strong>114</strong> directly</li>
                      <li>• This booking system is for rapid emergency response with payment processing</li>
                      <li>• Emergency services will be dispatched immediately upon payment confirmation</li>
                      <li>• GPS tracking will be activated for real-time location sharing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!booking.urgencyLevel}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue Emergency Booking
                  <FaArrowLeft className="rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location & Medical Condition */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Emergency Location
                </h3>

                {isGettingLocation ? (
                  <div className="text-center py-12">
                    <FaSpinner className="text-4xl text-blue-500 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">Getting your exact location...</p>
                    <p className="text-gray-500 text-sm mt-2">This helps emergency services find you faster</p>
                  </div>
                ) : booking.location ? (
                  <div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <FaCrosshairs className="text-green-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-green-800 mb-1">Location Confirmed</h4>
                          <p className="text-green-700 text-sm mb-2">{booking.location.address}</p>
                          <p className="text-green-600 text-xs">
                            Coordinates: {booking.location.latitude.toFixed(6)}, {booking.location.longitude.toFixed(6)}
                          </p>
                          <p className="text-green-600 text-xs">
                            Accuracy: ±{Math.round(booking.location.accuracy)}m
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
                      <div className="text-center">
                        <FaMapPin className="text-3xl text-red-500 mx-auto mb-2" />
                        <p className="text-gray-600">Interactive Map</p>
                        <p className="text-gray-500 text-sm">Your emergency location is marked</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaLocationArrow className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Location access required for emergency dispatch</p>
                    <button
                      onClick={getCurrentLocation}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center gap-2 mx-auto"
                    >
                      <FaMapMarkedAlt />
                      Get My Location
                    </button>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2">Or enter address manually:</label>
                  <textarea
                    rows={3}
                    placeholder="Enter exact address, building name, landmarks..."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-red-500"
                    value={booking.location?.address || ""}
                    onChange={(e) => {
                      if (booking.location) {
                        setBooking(prev => ({
                          ...prev,
                          location: { ...prev.location!, address: e.target.value }
                        }))
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUserMd className="text-blue-500" />
                  Medical Condition
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Describe the medical emergency *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe symptoms, injuries, or medical situation requiring emergency transport..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-red-500"
                      value={booking.medicalCondition}
                      onChange={(e) => setBooking(prev => ({ ...prev, medicalCondition: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Additional Emergency Information
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Any additional information that could help emergency responders (medications, allergies, special needs)..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                      value={booking.additionalInfo}
                      onChange={(e) => setBooking(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    />
                  </div>

                  {selectedUrgency && (
                    <div className={`p-4 rounded-lg border-2 ${selectedUrgency.bgColor}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${selectedUrgency.color}`}>
                          {selectedUrgency.name}
                        </div>
                        <span className={`text-sm font-semibold ${selectedUrgency.textColor}`}>
                          Expected Response: {selectedUrgency.responseTime}
                        </span>
                      </div>
                      <p className={`text-sm ${selectedUrgency.textColor}`}>
                        {selectedUrgency.description} - Emergency team will be dispatched immediately
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-2">Emergency Contact (Optional but Recommended)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Contact name"
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                      value={booking.patientDetails.emergencyContact}
                      onChange={(e) => handlePatientDetailsChange("emergencyContact", e.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                      value={booking.patientDetails.emergencyPhone}
                      onChange={(e) => handlePatientDetailsChange("emergencyPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!booking.location || !booking.medicalCondition}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-bold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Patient Details
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Patient Information */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaUser className="text-blue-500" />
                Patient Information
              </h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Patient Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full name of patient"
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                      value={booking.patientDetails.name}
                      onChange={(e) => handlePatientDetailsChange("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Age *</label>
                    <input
                      type="number"
                      required
                      placeholder="Age"
                      min="0"
                      max="120"
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                      value={booking.patientDetails.age}
                      onChange={(e) => handlePatientDetailsChange("age", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Gender *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                      value={booking.patientDetails.gender}
                      onChange={(e) => handlePatientDetailsChange("gender", e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="+230 5xxx xxxx"
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                      value={booking.patientDetails.emergencyPhone}
                      onChange={(e) => handlePatientDetailsChange("emergencyPhone", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Known Medical Conditions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                    {["Diabetes", "Hypertension", "Heart Disease", "Asthma", "Epilepsy", "Allergies"].map((condition) => (
                      <label key={condition} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={booking.patientDetails.conditions.includes(condition)}
                          onChange={(e) => {
                            const currentConditions = booking.patientDetails.conditions
                            if (e.target.checked) {
                              handlePatientDetailsChange("conditions", [...currentConditions, condition])
                            } else {
                              handlePatientDetailsChange("conditions", currentConditions.filter(c => c !== condition))
                            }
                          }}
                        />
                        <span className="text-sm">{condition}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Other conditions (separate with commas)"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                    onChange={(e) => {
                      const otherConditions = e.target.value.split(",").map(s => s.trim()).filter(s => s)
                      const predefinedConditions = booking.patientDetails.conditions.filter(c => 
                        ["Diabetes", "Hypertension", "Heart Disease", "Asthma", "Epilepsy", "Allergies"].includes(c)
                      )
                      handlePatientDetailsChange("conditions", [...predefinedConditions, ...otherConditions])
                    }}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Known Allergies</label>
                  <input
                    type="text"
                    placeholder="List any known allergies (medications, foods, etc.)"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                    onChange={(e) => handlePatientDetailsChange("allergies", e.target.value.split(",").map(s => s.trim()))}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Current Medications</label>
                  <input
                    type="text"
                    placeholder="List current medications (separate with commas)"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                    onChange={(e) => handlePatientDetailsChange("medications", e.target.value.split(",").map(s => s.trim()))}
                  />
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-3">Emergency Summary</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-600">Priority:</span>
                      <span className="font-semibold ml-2">{selectedUrgency?.name}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Location:</span>
                      <span className="font-semibold ml-2">{booking.location?.address}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Patient:</span>
                      <span className="font-semibold ml-2">{booking.patientDetails.name} ({booking.patientDetails.age})</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Condition:</span>
                      <span className="font-semibold ml-2">{booking.medicalCondition.substring(0, 50)}...</span>
                    </div>
                  </div>
                </div>
              </form>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={!booking.patientDetails.name || !booking.patientDetails.age || !booking.patientDetails.gender}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-bold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment & Dispatch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment & Emergency Dispatch */}
        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaWallet className="text-green-500" />
                Emergency Payment & Dispatch
              </h2>

              <div className="space-y-4 mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Select Emergency Payment Method</h3>
                {emergencyPaymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedPaymentMethod?.id === method.id 
                        ? "border-red-500 bg-red-50" 
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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{method.name}</span>
                        {method.discount && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            {method.discount}% Covered
                          </span>
                        )}
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          {method.processingTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border">
                <h3 className="font-bold text-gray-900 mb-4">Emergency Service Cost</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Emergency Transport</span>
                    <span className="font-medium">Rs {baseCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority Level: {selectedUrgency?.name}</span>
                    <span className="font-medium text-red-600">
                      {booking.urgencyLevel === "critical" ? "Highest Priority" : 
                       booking.urgencyLevel === "urgent" ? "High Priority" : "Standard"}
                    </span>
                  </div>
                  {selectedPaymentMethod?.discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Coverage ({selectedPaymentMethod.discount}%)</span>
                      <span className="font-medium">- Rs {Math.round(baseCost * selectedPaymentMethod.discount / 100)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-lg">Your Payment</span>
                    <span className="font-bold text-xl text-green-600">Rs {Math.round(finalCost)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-red-600 mt-1 text-xl" />
                  <div>
                    <h4 className="font-bold text-red-800 mb-2">Emergency Dispatch Confirmation</h4>
                    <ul className="text-red-700 text-sm space-y-1 mb-4">
                      <li>• Ambulance will be dispatched immediately upon payment confirmation</li>
                      <li>• Expected arrival time: <strong>{selectedUrgency?.responseTime}</strong></li>
                      <li>• GPS tracking will be activated for real-time location sharing</li>
                      <li>• Emergency team will call you within 2 minutes of dispatch</li>
                      <li>• Hospital notification will be sent automatically</li>
                    </ul>
                    
                    <div className="bg-white rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FaAmbulance className="text-red-600" />
                        <span className="font-semibold">Unit: {mockEmergencyService.unitNumber}</span>
                        <span className="text-gray-600">•</span>
                        <span>Driver: {mockEmergencyService.driverName}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{mockEmergencyService.vehicleDetails}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <h4 className="font-bold text-yellow-800 mb-2">Emergency Contacts (For Reference)</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-yellow-700">Direct Emergency Line:</span>
                    <span className="font-bold ml-2">114</span>
                  </div>
                  <div>
                    <span className="text-yellow-700">Service Phone:</span>
                    <span className="font-bold ml-2">{mockEmergencyService.alternatePhone}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleEmergencyDispatch}
                  disabled={!selectedPaymentMethod || isProcessing}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Dispatching Emergency...
                    </>
                  ) : (
                    <>
                      <FaRocket />
                      Dispatch Ambulance - Rs {Math.round(finalCost)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Live Tracking */}
        {currentStep === 5 && bookingConfirmed && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaAmbulance className="text-green-600 text-3xl animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Emergency Dispatched!</h2>
                <p className="text-gray-600 text-lg mb-4">Your ambulance is on the way with live GPS tracking</p>
                <div className="bg-green-100 border border-green-300 rounded-xl p-4 inline-block">
                  <p className="text-green-800 font-bold text-lg">Ticket ID: {ticketId}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <FaBroadcastTower className="text-red-500 animate-pulse" />
                    Live Emergency Status
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Emergency Priority:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedUrgency?.color}`}>
                        {selectedUrgency?.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Estimated Arrival:</span>
                      <span className="font-bold text-xl text-red-600">{estimatedArrival}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Current Status:</span>
                      <span className="font-semibold text-blue-600">{ambulanceLocation}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Unit Number:</span>
                      <span className="font-semibold">{mockEmergencyService.unitNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <FaCar className="text-blue-500" />
                    Ambulance Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Driver:</span>
                      <p className="font-semibold">{mockEmergencyService.driverName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Vehicle:</span>
                      <p className="font-semibold">{mockEmergencyService.vehicleDetails}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Equipment:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mockEmergencyService.equipment.slice(0, 4).map((item, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-xl p-6 mb-8 border">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <FaSatellite className="text-purple-500" />
                  Live GPS Tracking
                </h3>
                
                <div className="bg-white rounded-lg h-64 flex items-center justify-center border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold">Ambulance Location</span>
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold">Your Location</span>
                    </div>
                    <FaRoute className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Live GPS tracking active</p>
                    <p className="text-gray-500 text-sm">Ambulance route updating in real-time</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <button className="flex flex-col items-center gap-2 p-4 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                  <FaPhoneAlt className="text-red-600 text-2xl" />
                  <span className="font-semibold text-red-600">Call Ambulance</span>
                  <span className="text-sm text-gray-600">{mockEmergencyService.phone}</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
                  <FaDirections className="text-blue-600 text-2xl" />
                  <span className="font-semibold text-blue-600">Share Location</span>
                  <span className="text-sm text-gray-600">Send to family</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition-colors">
                  <FaHospital className="text-green-600 text-2xl" />
                  <span className="font-semibold text-green-600">Hospital Status</span>
                  <span className="text-sm text-gray-600">Emergency notified</span>
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                  <FaInfoCircle />
                  Important Instructions
                </h4>
                <ul className="text-yellow-800 text-sm space-y-2">
                  <li>• Keep your phone charged and nearby for emergency communication</li>
                  <li>• The ambulance crew will call you when they arrive</li>
                  <li>• Have the patient ready for transport with any necessary medications</li>
                  <li>• Ensure clear access to your location for the ambulance</li>
                  <li>• Stay calm and follow instructions from the emergency medical team</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white mb-8">
                <h3 className="text-xl font-bold mb-4">Emergency Service Ticket</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-red-200">Ticket ID:</span>
                    <p className="font-bold text-lg">{ticketId}</p>
                  </div>
                  <div>
                    <span className="text-red-200">Service:</span>
                    <p className="font-bold">{mockEmergencyService.name}</p>
                  </div>
                  <div>
                    <span className="text-red-200">Patient:</span>
                    <p className="font-bold">{booking.patientDetails.name}</p>
                  </div>
                  <div>
                    <span className="text-red-200">Location:</span>
                    <p className="font-bold">{booking.location?.address}</p>
                  </div>
                  <div>
                    <span className="text-red-200">Priority:</span>
                    <p className="font-bold">{selectedUrgency?.name}</p>
                  </div>
                  <div>
                    <span className="text-red-200">Amount Paid:</span>
                    <p className="font-bold">Rs {Math.round(finalCost)}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-red-400">
                  <p className="text-center text-red-100 text-sm">
                    Keep this ticket for your records. Emergency services are en route.
                  </p>
                </div>
              </div>

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
                  <FaPhone className="text-purple-600 text-xl" />
                  <span className="text-sm font-medium">Call Family</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaRoute className="text-orange-600 text-xl" />
                  <span className="text-sm font-medium">Share Route</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/patient/appointments" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all text-center">
                  View Emergency History
                </Link>
                <Link href="/patient/dashboard" className="border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-50 transition-all text-center">
                  Go to Dashboard
                </Link>
              </div>

              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  For immediate assistance call: 
                  <a href="tel:114" className="font-bold text-red-600 hover:underline ml-2 text-xl">
                    114 (Emergency)
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