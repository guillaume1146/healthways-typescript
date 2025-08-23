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
  FaCalendarPlus,
  FaFlask,
  FaHome,
  FaHospital,
  FaUserCheck,
  FaMicroscope,
  FaSyringe,
  FaVial,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaFileAlt,
  FaHeart,
  FaLock,
  FaBell,
  FaCertificate
} from "react-icons/fa"

interface LabFacility {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  certifications: string[];
  equipment: string[];
  specializations: string[];
  operatingHours: string;
  homeCollection: boolean;
  avatar: string;
}

interface LabTest {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  sampleType: string;
  fastingRequired: boolean;
  fastingHours?: number;
  preparationInstructions: string[];
  reportDelivery: string;
  icon: React.ComponentType<{ className?: string; }>;
}

interface TimeSlot {
  time: string;
  available: boolean;
  type: "regular" | "priority" | "early-morning";
}

interface AppointmentDetails {
  labFacility: LabFacility;
  selectedTests: LabTest[];
  date: string;
  time: string;
  collectionMethod: "home" | "lab";
  totalCost: number;
  patientNotes: string;
  emergencyContact: string;
  communicationPreference: "phone" | "sms" | "email" | "app";
  doctorNotification: boolean;
  doctorEmail?: string;
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

// Mock lab facility data (pre-selected)
const mockLabFacility: LabFacility = {
  id: "1",
  name: "MediLab Diagnostics",
  location: "Ebène Cybercity, Mauritius",
  rating: 4.7,
  reviews: 234,
  certifications: ["ISO 15189", "CAP Accredited", "NABL Certified"],
  equipment: ["Automated Analyzers", "PCR Machines", "Flow Cytometry", "Mass Spectrometry"],
  specializations: ["Clinical Chemistry", "Hematology", "Microbiology", "Molecular Diagnostics"],
  operatingHours: "Monday - Saturday: 6:00 AM - 6:00 PM, Sunday: 7:00 AM - 2:00 PM",
  homeCollection: true,
  avatar: "🔬"
}

const availableTests: LabTest[] = [
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    description: "Comprehensive blood analysis including red cells, white cells, and platelets",
    category: "Hematology",
    price: 350,
    duration: "2-4 hours",
    sampleType: "Blood",
    fastingRequired: false,
    preparationInstructions: ["No special preparation required", "Stay hydrated"],
    reportDelivery: "Same day",
    icon: FaVial
  },
  {
    id: "lipid-profile",
    name: "Lipid Profile",
    description: "Cholesterol and triglyceride levels analysis",
    category: "Clinical Chemistry",
    price: 450,
    duration: "4-6 hours",
    sampleType: "Blood",
    fastingRequired: true,
    fastingHours: 12,
    preparationInstructions: ["Fast for 12 hours", "Only water allowed", "No smoking before test"],
    reportDelivery: "Next day",
    icon: FaHeart
  },
  {
    id: "blood-glucose",
    name: "Blood Glucose (Fasting)",
    description: "Blood sugar level measurement after fasting",
    category: "Clinical Chemistry",
    price: 200,
    duration: "1-2 hours",
    sampleType: "Blood",
    fastingRequired: true,
    fastingHours: 8,
    preparationInstructions: ["Fast for 8-12 hours", "Only plain water allowed", "Take medications as prescribed"],
    reportDelivery: "Same day",
    icon: FaSyringe
  },
  {
    id: "thyroid-profile",
    name: "Thyroid Function Test (T3, T4, TSH)",
    description: "Complete thyroid hormone analysis",
    category: "Endocrinology",
    price: 650,
    duration: "6-8 hours",
    sampleType: "Blood",
    fastingRequired: false,
    preparationInstructions: ["No special preparation", "Inform about thyroid medications"],
    reportDelivery: "Next day",
    icon: FaMicroscope
  },
  {
    id: "liver-function",
    name: "Liver Function Test (LFT)",
    description: "Assessment of liver enzymes and function",
    category: "Clinical Chemistry",
    price: 550,
    duration: "4-6 hours",
    sampleType: "Blood",
    fastingRequired: true,
    fastingHours: 8,
    preparationInstructions: ["Fast for 8 hours", "Avoid alcohol 24 hours before", "List all medications"],
    reportDelivery: "Next day",
    icon: FaFlask
  },
  {
    id: "kidney-function",
    name: "Kidney Function Test (KFT)",
    description: "Creatinine, urea, and electrolyte analysis",
    category: "Clinical Chemistry",
    price: 400,
    duration: "4-6 hours",
    sampleType: "Blood",
    fastingRequired: false,
    preparationInstructions: ["No special preparation", "Maintain normal fluid intake"],
    reportDelivery: "Same day",
    icon: FaVial
  }
]

const mockTimeSlots: TimeSlot[] = [
  { time: "06:00 AM", available: true, type: "early-morning" },
  { time: "06:30 AM", available: true, type: "early-morning" },
  { time: "07:00 AM", available: true, type: "regular" },
  { time: "07:30 AM", available: false, type: "regular" },
  { time: "08:00 AM", available: true, type: "regular" },
  { time: "08:30 AM", available: true, type: "regular" },
  { time: "09:00 AM", available: true, type: "regular" },
  { time: "09:30 AM", available: false, type: "regular" },
  { time: "10:00 AM", available: true, type: "priority" },
  { time: "10:30 AM", available: true, type: "regular" },
  { time: "11:00 AM", available: true, type: "regular" },
  { time: "11:30 AM", available: true, type: "regular" }
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
    description: "Use your company's health screening benefits",
    discount: 25,
    icon: "🏢",
    available: true
  },
  {
    id: "insurance",
    type: "insurance",
    name: "Health Insurance Coverage",
    description: "Apply health insurance (80% covered)",
    discount: 80,
    icon: "🛡️",
    available: true
  },
  {
    id: "subscription",
    type: "subscription",
    name: "Health Screening Package",
    description: "Use your active health screening subscription",
    discount: 100,
    icon: "💳",
    available: true
  }
]

export default function LabTestingBooking() {
  const [currentStep, setCurrentStep] = useState(1)
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    labFacility: mockLabFacility,
    selectedTests: [availableTests[0]], // Pre-selected test
    date: "",
    time: "",
    collectionMethod: "lab",
    totalCost: availableTests[0].price,
    patientNotes: "",
    emergencyContact: "",
    communicationPreference: "app",
    doctorNotification: false,
    doctorEmail: ""
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const steps = [
    { number: 1, title: "Lab & Tests", icon: FaFlask },
    { number: 2, title: "Collection Method", icon: FaHome },
    { number: 3, title: "Schedule", icon: FaCalendarAlt },
    { number: 4, title: "Payment", icon: FaWallet },
    { number: 5, title: "Confirmation", icon: FaTicketAlt }
  ]

  const handleTestSelection = (test: LabTest, selected: boolean) => {
    if (selected) {
      setAppointmentDetails(prev => ({
        ...prev,
        selectedTests: [...prev.selectedTests, test],
        totalCost: prev.totalCost + test.price
      }))
    } else {
      setAppointmentDetails(prev => ({
        ...prev,
        selectedTests: prev.selectedTests.filter(t => t.id !== test.id),
        totalCost: prev.totalCost - test.price
      }))
    }
  }

  const handleTimeSelect = (time: string) => {
    setAppointmentDetails({ ...appointmentDetails, time })
  }

  const handleDateChange = (date: string) => {
    setAppointmentDetails({ ...appointmentDetails, date })
  }

  const handleCollectionMethodChange = (method: "home" | "lab") => {
    const homeCollectionFee = method === "home" ? 150 : 0
    const baseCost = appointmentDetails.selectedTests.reduce((sum, test) => sum + test.price, 0)
    setAppointmentDetails({
      ...appointmentDetails,
      collectionMethod: method,
      totalCost: baseCost + homeCollectionFee
    })
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setBookingConfirmed(true)
      setTicketId(`LAB-${Date.now()}`)
      setCurrentStep(5)
    }, 3000)
  }

  const calculateFinalAmount = () => {
    if (!selectedPaymentMethod) return appointmentDetails.totalCost + 30
    
    const baseAmount = appointmentDetails.totalCost + 30
    if (selectedPaymentMethod.discount) {
      return baseAmount * (1 - selectedPaymentMethod.discount / 100)
    }
    return baseAmount
  }

  const getTimeSlotStyle = (slot: TimeSlot, isSelected: boolean) => {
    if (!slot.available) return "bg-gray-100 text-gray-400 cursor-not-allowed"
    if (isSelected) return "bg-blue-600 text-white border-blue-600"
    
    switch (slot.type) {
      case "early-morning":
        return "border-green-300 text-green-600 hover:bg-green-50 hover:border-green-500"
      case "priority":
        return "border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-500"
      default:
        return "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
    }
  }

  const hasFastingTests = appointmentDetails.selectedTests.some(test => test.fastingRequired)
  const maxFastingHours = Math.max(...appointmentDetails.selectedTests
    .filter(test => test.fastingRequired)
    .map(test => test.fastingHours || 0)
  )

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
              <h1 className="text-2xl font-bold text-gray-900">Book Lab Tests</h1>
              <p className="text-gray-600">Schedule laboratory testing at {appointmentDetails.labFacility.name}</p>
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
        {/* Step 1: Lab & Tests Selection */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Lab Facility Info */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Laboratory Facility</h2>
                
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/4 text-center">
                    <div className="text-6xl mb-4">{appointmentDetails.labFacility.avatar}</div>
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                      <FaStar />
                      <span className="font-bold text-lg">{appointmentDetails.labFacility.rating}</span>
                      <span className="text-gray-600 text-sm">({appointmentDetails.labFacility.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="lg:w-3/4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{appointmentDetails.labFacility.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <FaMapMarkerAlt />
                      <span>{appointmentDetails.labFacility.location}</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {appointmentDetails.labFacility.certifications.map((cert, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Specializations</h4>
                        <div className="flex flex-wrap gap-2">
                          {appointmentDetails.labFacility.specializations.map((spec, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <FaClock className="text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-1">Operating Hours</h4>
                          <p className="text-blue-700 text-sm">{appointmentDetails.labFacility.operatingHours}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Available Laboratory Tests</h3>
                
                <div className="grid gap-4">
                  {availableTests.map((test) => {
                    const Icon = test.icon
                    const isSelected = appointmentDetails.selectedTests.some(t => t.id === test.id)
                    return (
                      <div
                        key={test.id}
                        className={`border-2 rounded-xl p-6 transition-all ${
                          isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleTestSelection(test, e.target.checked)}
                                className="mr-3 w-5 h-5"
                              />
                            </label>
                            
                            <Icon className={`text-3xl mt-1 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                            
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-2">{test.name}</h4>
                              <p className="text-gray-600 text-sm mb-3">{test.description}</p>
                              
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Category:</span>
                                  <span className="font-medium ml-1">{test.category}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Sample:</span>
                                  <span className="font-medium ml-1">{test.sampleType}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Duration:</span>
                                  <span className="font-medium ml-1">{test.duration}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Results:</span>
                                  <span className="font-medium ml-1">{test.reportDelivery}</span>
                                </div>
                              </div>
                              
                              {test.fastingRequired && (
                                <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FaExclamationTriangle className="text-orange-600" />
                                    <span className="font-semibold text-orange-800">Fasting Required</span>
                                  </div>
                                  <p className="text-orange-700 text-xs">Fast for {test.fastingHours} hours before the test</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">Rs {test.price}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Selected Tests Summary */}
                {appointmentDetails.selectedTests.length > 0 && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Selected Tests</h4>
                    <div className="space-y-2">
                      {appointmentDetails.selectedTests.map((test, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{test.name}</span>
                          <span className="font-medium">Rs {test.price}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total Tests Cost:</span>
                        <span>Rs {appointmentDetails.selectedTests.reduce((sum, test) => sum + test.price, 0)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={appointmentDetails.selectedTests.length === 0}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Collection Method
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Collection Method */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Collection Method</h2>
              
              <div className="space-y-4 mb-8">
                <label className={`flex items-start p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                  appointmentDetails.collectionMethod === "lab"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <input
                    type="radio"
                    name="collection"
                    value="lab"
                    checked={appointmentDetails.collectionMethod === "lab"}
                    onChange={(e) => handleCollectionMethodChange(e.target.value as "home" | "lab")}
                    className="mr-4 mt-1"
                  />
                  <FaHospital className={`text-3xl mr-4 ${
                    appointmentDetails.collectionMethod === "lab" ? "text-blue-600" : "text-gray-400"
                  }`} />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Lab Visit</h3>
                    <p className="text-gray-600 text-sm mb-2">Visit our laboratory for sample collection</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Professional sample collection</p>
                      <p>• Immediate sample processing</p>
                      <p>• No additional charges</p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-start p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                  appointmentDetails.collectionMethod === "home"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <input
                    type="radio"
                    name="collection"
                    value="home"
                    checked={appointmentDetails.collectionMethod === "home"}
                    onChange={(e) => handleCollectionMethodChange(e.target.value as "home" | "lab")}
                    className="mr-4 mt-1"
                  />
                  <FaHome className={`text-3xl mr-4 ${
                    appointmentDetails.collectionMethod === "home" ? "text-blue-600" : "text-gray-400"
                  }`} />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Home Collection</h3>
                    <p className="text-gray-600 text-sm mb-2">Trained technician visits your home</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Convenient home service</p>
                      <p>• Sterile collection procedures</p>
                      <p>• Additional Rs 150 service fee</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Preparation Instructions */}
              {hasFastingTests && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">Important: Fasting Required</h4>
                      <p className="text-orange-700 text-sm mb-3">
                        Some of your selected tests require fasting for {maxFastingHours} hours before collection.
                      </p>
                      <div className="space-y-2">
                        {appointmentDetails.selectedTests
                          .filter(test => test.fastingRequired)
                          .map((test, index) => (
                            <div key={index} className="bg-white rounded p-3">
                              <p className="font-medium text-orange-800">{test.name}</p>
                              <ul className="text-orange-700 text-xs mt-1 space-y-1">
                                {test.preparationInstructions.map((instruction, idx) => (
                                  <li key={idx}>• {instruction}</li>
                                ))}
                              </ul>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="Name and phone number"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
                    value={appointmentDetails.emergencyContact}
                    onChange={(e) => setAppointmentDetails({ ...appointmentDetails, emergencyContact: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Any specific instructions or medical conditions to note..."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
                    value={appointmentDetails.patientNotes}
                    onChange={(e) => setAppointmentDetails({ ...appointmentDetails, patientNotes: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={appointmentDetails.doctorNotification}
                      onChange={(e) => setAppointmentDetails({ ...appointmentDetails, doctorNotification: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-700 font-medium">Notify my doctor about test results</span>
                  </label>
                  
                  {appointmentDetails.doctorNotification && (
                    <div className="mt-3">
                      <input
                        type="email"
                        placeholder="Doctor's email address"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
                        value={appointmentDetails.doctorEmail}
                        onChange={(e) => setAppointmentDetails({ ...appointmentDetails, doctorEmail: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Continue to Schedule
                </button>
              </div>
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
                    Test Date
                  </label>
                  <input
                    type="date"
                    value={appointmentDetails.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Collection Summary */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Collection Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Method:</span>
                      <span className="font-medium">{appointmentDetails.collectionMethod === "home" ? "Home Collection" : "Lab Visit"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Tests:</span>
                      <span className="font-medium">{appointmentDetails.selectedTests.length} selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Location:</span>
                      <span className="font-medium">{appointmentDetails.collectionMethod === "home" ? "Your Address" : appointmentDetails.labFacility.location}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between">
                      <span className="text-blue-700 font-semibold">Total Cost:</span>
                      <span className="font-bold">Rs {appointmentDetails.totalCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Available Time Slots</h3>
                {appointmentDetails.date ? (
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center gap-4 text-xs flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-gray-300 rounded"></div>
                          <span>Regular</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-green-300 rounded"></div>
                          <span>Early Morning</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-orange-300 rounded"></div>
                          <span>Priority</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
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

                    {appointmentDetails.time && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaClock className="text-green-600" />
                          <span className="font-semibold text-green-800">Appointment Scheduled</span>
                        </div>
                        <p className="text-green-700 text-sm">
                          {appointmentDetails.date} at {appointmentDetails.time}
                          <br />
                          {appointmentDetails.collectionMethod === "home" ? "Home Collection" : "Lab Visit"}
                        </p>
                      </div>
                    )}

                    {hasFastingTests && appointmentDetails.time && (
                      <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaBell className="text-orange-600" />
                          <span className="font-semibold text-orange-800">Fasting Reminder</span>
                        </div>
                        <p className="text-orange-700 text-sm">
                          Start fasting {maxFastingHours} hours before your appointment.
                          <br />
                          {appointmentDetails.time && (() => {
                            const appointmentTime = appointmentDetails.time;
                            const [time, period] = appointmentTime.split(" ");
                            const [hours, minutes] = time.split(":").map(Number);
                            let hour24 = hours;
                            if (period === "PM" && hours !== 12) hour24 += 12;
                            if (period === "AM" && hours === 12) hour24 = 0;
                            
                            const fastingStartHour = (hour24 - maxFastingHours + 24) % 24;
                            const fastingStartPeriod = fastingStartHour >= 12 ? "PM" : "AM";
                            const displayFastingHour = fastingStartHour === 0 ? 12 : fastingStartHour > 12 ? fastingStartHour - 12 : fastingStartHour;
                            
                            return `Begin fasting from ${displayFastingHour}:${minutes.toString().padStart(2, '0')} ${fastingStartPeriod} today.`;
                          })()}
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
                disabled={!appointmentDetails.date || !appointmentDetails.time}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {appointmentDetails.selectedTests.map((test, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{test.name}</span>
                      <span className="font-medium">Rs {test.price}</span>
                    </div>
                  ))}
                  {appointmentDetails.collectionMethod === "home" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Home Collection Fee</span>
                      <span className="font-medium">Rs 150</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-medium">Rs 30</span>
                  </div>
                  {selectedPaymentMethod?.discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({selectedPaymentMethod.discount}%)</span>
                      <span className="font-medium">
                        - Rs {Math.round((appointmentDetails.totalCost + 30) * selectedPaymentMethod.discount / 100)}
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

              {/* Lab Quality Assurance */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Quality Assurance</h4>
                    <p className="text-blue-700 text-sm">All tests performed with ISO 15189 certified processes. Results reviewed by qualified pathologists.</p>
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
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Lab Tests Booked!</h2>
              <p className="text-gray-600 mb-8">Your laboratory testing appointment has been successfully confirmed.</p>
              
              {/* Digital Ticket */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 text-left">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Laboratory Test Ticket</h3>
                    <p className="text-blue-100 text-sm">Present this at the lab or to collection technician</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">Ticket ID</p>
                    <p className="font-bold text-lg">{ticketId}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-100">Lab Facility</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-blue-200">Name:</span> {appointmentDetails.labFacility.name}</p>
                      <p><span className="text-blue-200">Location:</span> {appointmentDetails.labFacility.location}</p>
                      <p><span className="text-blue-200">Rating:</span> {appointmentDetails.labFacility.rating}⭐</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-100">Test Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-blue-200">Date:</span> {appointmentDetails.date}</p>
                      <p><span className="text-blue-200">Time:</span> {appointmentDetails.time}</p>
                      <p><span className="text-blue-200">Collection:</span> {appointmentDetails.collectionMethod === "home" ? "Home Visit" : "Lab Visit"}</p>
                      <p><span className="text-blue-200">Amount Paid:</span> Rs {Math.round(calculateFinalAmount())}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaFlask className="text-blue-200" />
                    <span className="font-semibold text-blue-100">Selected Tests</span>
                  </div>
                  <div className="text-blue-100 text-sm space-y-1">
                    {appointmentDetails.selectedTests.map((test, index) => (
                      <p key={index}>• {test.name}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Test Preparation Reminder */}
              {hasFastingTests && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8 text-left">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">Pre-Test Preparation Required</h4>
                      <div className="text-orange-800 text-sm space-y-3">
                        <p className="font-medium">Fasting Period: {maxFastingHours} hours before test</p>
                        {appointmentDetails.selectedTests
                          .filter(test => test.fastingRequired)
                          .map((test, index) => (
                            <div key={index} className="bg-white rounded p-3">
                              <p className="font-medium">{test.name}:</p>
                              <ul className="mt-1 space-y-1">
                                {test.preparationInstructions.map((instruction, idx) => (
                                  <li key={idx} className="text-xs">• {instruction}</li>
                                ))}
                              </ul>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Result Delivery Information */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <FaLock className="text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Secure Result Delivery</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Results will be available in your patient portal</li>
                      <li>• Email notification when reports are ready</li>
                      <li>• SMS alerts for critical values</li>
                      {appointmentDetails.doctorNotification && (
                        <li>• Doctor will be automatically notified: {appointmentDetails.doctorEmail}</li>
                      )}
                      <li>• Physical reports available for pickup</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Lab Quality Certifications */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <FaCertificate className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Quality Certifications</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">Accreditations:</p>
                        <ul className="text-blue-600 text-xs space-y-1">
                          {appointmentDetails.labFacility.certifications.map((cert, index) => (
                            <li key={index}>• {cert}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-blue-700 font-medium">Equipment:</p>
                        <ul className="text-blue-600 text-xs space-y-1">
                          {appointmentDetails.labFacility.equipment.slice(0, 3).map((equipment, index) => (
                            <li key={index}>• {equipment}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
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
                      <p className="font-medium text-gray-900">Preparation Reminder</p>
                      <p className="text-gray-600 text-sm">
                        {hasFastingTests 
                          ? `Follow fasting instructions ${maxFastingHours} hours before your appointment`
                          : "No special preparation required for your selected tests"
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sample Collection</p>
                      <p className="text-gray-600 text-sm">
                        {appointmentDetails.collectionMethod === "home" 
                          ? "Trained technician will visit your home for sample collection"
                          : "Visit the lab facility for professional sample collection"
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Processing & Analysis</p>
                      <p className="text-gray-600 text-sm">Your samples will be processed using state-of-the-art equipment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Result Delivery</p>
                      <p className="text-gray-600 text-sm">Secure digital delivery through patient portal and email notification</p>
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
                  <span className="text-sm font-medium">Print Details</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaCalendarPlus className="text-purple-600 text-xl" />
                  <span className="text-sm font-medium">Add to Calendar</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaPhone className="text-orange-600 text-xl" />
                  <span className="text-sm font-medium">Contact Lab</span>
                </button>
              </div>

              {/* Main Action Buttons */}
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/patient/lab-tests/results" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-center">
                  View Test Results
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
                    <span className="font-semibold text-red-800">Lab Support</span>
                  </div>
                  <p className="text-sm text-red-700">
                    For any questions about your tests or results: 
                    <a href="tel:+2304004000" className="font-semibold hover:underline ml-1">
                      +230 400 4000
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Help Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all">
            <FaInfoCircle className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  )
}