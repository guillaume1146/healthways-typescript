// app/patient/emergency/ambulance/page.tsx
"use client"

import { useState, useEffect } from "react"
import type { ReactElement } from 'react';
import Link from "next/link"
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaAmbulance,
  FaLocationArrow,
  FaUser,
  FaRoute,
  FaBroadcastTower,
  FaSpinner,
  FaPhoneAlt,
  FaClock,
  FaDownload,
  FaMobileAlt,
  FaUserFriends,
  FaTimes,
  FaInfoCircle
} from "react-icons/fa"
import { SiVisa, SiMastercard } from "react-icons/si"

interface LocationInfo {
  latitude: number
  longitude: number
  address: string
  accuracy: number
  timestamp: Date
}

interface PatientDetails {
  bookingFor: 'self' | 'other'
  name: string
  contactPhone: string
  relationship?: string
  additionalInfo?: string
}

interface EmergencyBooking {
  urgencyLevel: 'critical' | 'urgent' | 'standard'
  location: LocationInfo | null
  patientDetails: PatientDetails
  paymentMethod: string
  payLater: boolean
  bookingTime: Date
}

interface PaymentMethod {
  id: string
  type: 'mcb_juice' | 'visa' | 'mastercard' | 'pay_later'
  name: string
  description: string
  icon: ReactElement
  available: boolean
  isDefault?: boolean
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "mcb_juice",
    type: "mcb_juice",
    name: "MCB Juice",
    description: "Instant mobile payment (Default)",
    icon: <FaMobileAlt className="text-orange-600 text-2xl" />,
    available: true,
    isDefault: true
  },
  {
    id: "visa",
    type: "visa",
    name: "Visa Card",
    description: "Credit/Debit card payment",
    icon: <SiVisa className="text-blue-600 text-2xl" />,
    available: true
  },
  {
    id: "mastercard",
    type: "mastercard",
    name: "Mastercard",
    description: "Credit/Debit card payment",
    icon: <SiMastercard className="text-red-600 text-2xl" />,
    available: true
  },
  {
    id: "pay_later",
    type: "pay_later",
    name: "Pay Later (Emergency)",
    description: "Payment after service - For emergencies only",
    icon: <FaClock className="text-purple-600 text-2xl" />,
    available: true
  }
]

const urgencyLevels = [
  {
    level: "critical",
    name: "CRITICAL",
    description: "Life-threatening",
    color: "bg-red-600 text-white",
    borderColor: "border-red-600",
    responseTime: "5-8 min"
  },
  {
    level: "urgent",
    name: "URGENT",
    description: "Serious condition",
    color: "bg-orange-500 text-white",
    borderColor: "border-orange-500",
    responseTime: "10-15 min"
  },
  {
    level: "standard",
    name: "STANDARD",
    description: "Medical transport",
    color: "bg-blue-500 text-white",
    borderColor: "border-blue-500",
    responseTime: "20-30 min"
  }
]

export default function SimplifiedEmergencyBooking() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [ticketId, setTicketId] = useState("")
  const [showEmergencyContact, setShowEmergencyContact] = useState(true)
 
  const [booking, setBooking] = useState<EmergencyBooking>({
    urgencyLevel: 'urgent',
    location: null,
    patientDetails: {
      bookingFor: 'self',
      name: '',
      contactPhone: '',
      relationship: undefined,
      additionalInfo: undefined
    },
    paymentMethod: 'mcb_juice',
    payLater: false,
    bookingTime: new Date()
  })

  const EMERGENCY_NUMBER = "114"
  const AMBULANCE_SERVICE = "+230 5789 0114"

  useEffect(() => {
    // Auto-get location on page load
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationInfo: LocationInfo = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Fetching address...",
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          }
         
          setBooking(prev => ({ ...prev, location: locationInfo }))
          setIsGettingLocation(false)
         
          // Simulate address fetch
          setTimeout(() => {
            setBooking(prev => ({
              ...prev,
              location: locationInfo.latitude ? {
                ...locationInfo,
                address: "123 Royal Street, Port Louis"
              } : null
            }))
          }, 1000)
        },
        (error) => {
          console.error("Location error:", error)
          setIsGettingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    }
  }

  const handleQuickDispatch = () => {
    // Validate minimum required info
    if (!booking.patientDetails.contactPhone) {
      alert("Please provide a contact phone number")
      return
    }

    setIsProcessing(true)
   
    setTimeout(() => {
      setTicketId(`EMG-${Date.now().toString().slice(-8)}`)
      setBookingConfirmed(true)
      setCurrentStep(3)
      setIsProcessing(false)
    }, 1500)
  }

  const selectedUrgency = urgencyLevels.find(u => u.level === booking.urgencyLevel)

  if (bookingConfirmed && currentStep === 3) {
    // Confirmation Screen
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <FaAmbulance className="text-green-600 text-4xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Ambulance Dispatched!</h1>
                <p className="text-xl text-gray-600">Help is on the way</p>
                <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-mono font-bold">
                  Ticket: {ticketId}
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700">Estimated Arrival:</span>
                  <span className="text-2xl font-bold text-red-600">{selectedUrgency?.responseTime}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700">Priority Level:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedUrgency?.color}`}>
                    {selectedUrgency?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Payment:</span>
                  <span className="font-medium">
                    {booking.paymentMethod === 'pay_later' ? 'Pay Later (After Service)' :
                     paymentMethods.find(p => p.id === booking.paymentMethod)?.name}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-3">Important Contacts</h3>
                <div className="space-y-3">
                  <a href={`tel:${EMERGENCY_NUMBER}`} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <FaPhoneAlt className="text-red-600" />
                      <span className="font-medium">Emergency Line</span>
                    </div>
                    <span className="font-bold text-lg">{EMERGENCY_NUMBER}</span>
                  </a>
                  <a href={`tel:${AMBULANCE_SERVICE}`} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <FaPhoneAlt className="text-blue-600" />
                      <span className="font-medium">Ambulance Service</span>
                    </div>
                    <span className="font-bold">{AMBULANCE_SERVICE}</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:bg-gray-50">
                  <FaRoute className="text-blue-600 text-2xl" />
                  <span className="text-sm font-medium">Track Ambulance</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:bg-gray-50">
                  <FaDownload className="text-green-600 text-2xl" />
                  <span className="text-sm font-medium">Download Ticket</span>
                </button>
              </div>

              <Link href="/patient/dashboard" className="block w-full bg-blue-600 text-white py-3 rounded-xl font-medium text-center hover:bg-blue-700">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/patient/dashboard" className="text-white/80 hover:text-white">
                <FaArrowLeft />
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  Emergency Ambulance
                  <FaBroadcastTower className="text-red-300 animate-pulse" />
                </h1>
                <p className="text-red-100 text-sm">Quick dispatch • GPS tracking</p>
              </div>
            </div>
            <a href={`tel:${EMERGENCY_NUMBER}`} className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
              <FaPhoneAlt />
              <span className="hidden sm:inline">Call</span> {EMERGENCY_NUMBER}
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Contact Banner */}
      {showEmergencyContact && (
        <div className="bg-yellow-400 text-yellow-900 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="animate-pulse" />
              <span className="text-sm font-medium">For immediate help, call {EMERGENCY_NUMBER}</span>
            </div>
            <button onClick={() => setShowEmergencyContact(false)} className="text-yellow-800 hover:text-yellow-900">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              {/* Step 1: Quick Form */}
              <h2 className="text-xl font-bold text-gray-900 mb-6">Emergency Information</h2>
             
              {/* Urgency Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Priority Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {urgencyLevels.map((level) => (
                    <button
                      key={level.level}
                      onClick={() => setBooking(prev => ({ ...prev, urgencyLevel: level.level as 'critical' | 'urgent' | 'standard' }))}
                      className={`p-3 rounded-lg border-2 transition ${
                        booking.urgencyLevel === level.level
                          ? `${level.color} ${level.borderColor}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-sm">{level.name}</div>
                      <div className="text-xs mt-1">{level.responseTime}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Location</label>
                {isGettingLocation ? (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <FaSpinner className="animate-spin text-blue-600" />
                    <span className="text-blue-700">Getting your location...</span>
                  </div>
                ) : booking.location ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-green-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-green-800">{booking.location.address}</p>
                        <button onClick={getCurrentLocation} className="text-sm text-green-600 hover:underline mt-1">
                          Update location
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button onClick={getCurrentLocation} className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-gray-600">
                    <FaLocationArrow className="mx-auto mb-2" />
                    Get My Location
                  </button>
                )}
              </div>

              {/* Booking For */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Booking For</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBooking(prev => ({
                      ...prev,
                      patientDetails: { ...prev.patientDetails, bookingFor: 'self' }
                    }))}
                    className={`flex-1 p-3 rounded-lg border-2 transition ${
                      booking.patientDetails.bookingFor === 'self'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FaUser className="mx-auto mb-1" />
                    <div className="text-sm font-medium">Myself</div>
                  </button>
                  <button
                    onClick={() => setBooking(prev => ({
                      ...prev,
                      patientDetails: { ...prev.patientDetails, bookingFor: 'other' }
                    }))}
                    className={`flex-1 p-3 rounded-lg border-2 transition ${
                      booking.patientDetails.bookingFor === 'other'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FaUserFriends className="mx-auto mb-1" />
                    <div className="text-sm font-medium">Someone Else</div>
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+230 5XXX XXXX"
                    value={booking.patientDetails.contactPhone}
                    onChange={(e) => setBooking(prev => ({
                      ...prev,
                      patientDetails: { ...prev.patientDetails, contactPhone: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {booking.patientDetails.bookingFor === 'other' && (
                  <>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Patient Name <span className="text-gray-400 text-sm">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Name of patient"
                        value={booking.patientDetails.name}
                        onChange={(e) => setBooking(prev => ({
                          ...prev,
                          patientDetails: { ...prev.patientDetails, name: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Relationship <span className="text-gray-400 text-sm">(Optional)</span>
                      </label>
                      <select
                        value={booking.patientDetails.relationship || ''}
                        onChange={(e) => setBooking(prev => ({
                          ...prev,
                          patientDetails: { ...prev.patientDetails, relationship: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="child">Child</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Additional Info <span className="text-gray-400 text-sm">(Optional)</span>
                  </label>
                  <textarea
                    placeholder="Brief description of emergency (optional)"
                    value={booking.patientDetails.additionalInfo || ''}
                    onChange={(e) => setBooking(prev => ({
                      ...prev,
                      patientDetails: { ...prev.patientDetails, additionalInfo: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                    rows={2}
                  />
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={!booking.patientDetails.contactPhone || !booking.location}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>

            {/* Emergency Numbers Card */}
            <div className="mt-4 bg-blue-50 rounded-xl p-4">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <FaInfoCircle />
                Emergency Contacts
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${EMERGENCY_NUMBER}`} className="flex items-center gap-2 text-blue-700 hover:underline">
                  <FaPhoneAlt />
                  <span className="font-medium">{EMERGENCY_NUMBER} (Emergency)</span>
                </a>
                <a href={`tel:${AMBULANCE_SERVICE}`} className="flex items-center gap-2 text-blue-700 hover:underline">
                  <FaPhoneAlt />
                  <span className="font-medium">{AMBULANCE_SERVICE} (Service)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
             
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 ${
                      booking.paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={booking.paymentMethod === method.id}
                      onChange={() => setBooking(prev => ({
                        ...prev,
                        paymentMethod: method.id,
                        payLater: method.id === 'pay_later'
                      }))}
                      className="mr-4"
                    />
                    <div className="mr-4">{method.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {method.name}
                        {method.isDefault && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {booking.paymentMethod === 'visa' || booking.paymentMethod === 'mastercard' ? (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ) : booking.paymentMethod === 'mcb_juice' ? (
                <div className="bg-orange-50 rounded-lg p-4 mb-6">
                  <p className="text-orange-800 text-sm">
                    You will be redirected to MCB Juice for secure payment
                  </p>
                </div>
              ) : booking.paymentMethod === 'pay_later' ? (
                <div className="bg-purple-50 rounded-lg p-4 mb-6">
                  <p className="text-purple-800 text-sm">
                    Payment will be collected after emergency service is provided.
                    This option is for genuine emergencies only.
                  </p>
                </div>
              ) : null}

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleQuickDispatch}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <FaAmbulance />
                      Dispatch Ambulance
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}