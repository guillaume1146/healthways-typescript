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
  FaTruck,
  FaPills,
  FaUpload,
  FaExclamationTriangle,
  FaFileAlt,
  FaBell,
  FaCertificate,
  FaEdit,
  FaTimes,
  FaCheckCircle
} from "react-icons/fa"

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  license: string;
  operatingHours: string;
  deliveryRadius: string;
  certifications: string[];
  avatar: string;
}

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  strength: string;
  form: string;
  category: string;
  price: number;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  prescriptionRequired: boolean;
  controlledSubstance: boolean;
  expiryDate: string;
  description: string;
  sideEffects: string[];
  interactions: string[];
  contraindications: string[];
}

interface PrescriptionUpload {
  file?: File;
  doctorName: string;
  doctorLicense: string;
  prescriptionDate: string;
  patientName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  validated: boolean;
  verificationNotes: string;
}

interface DeliverySlot {
  date: string;
  time: string;
  available: boolean;
  type: "standard" | "priority" | "express";
  fee: number;
}

interface OrderDetails {
  pharmacy: Pharmacy;
  medicine: Medicine;
  quantity: number;
  prescriptionMethod: "upload" | "digital";
  prescription: PrescriptionUpload;
  deliveryAddress: string;
  deliverySlot: DeliverySlot | null;
  specialInstructions: string;
  totalCost: number;
  emergencyContact: string;
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

// Mock data
const mockPharmacy: Pharmacy = {
  id: "1",
  name: "HealthPlus Pharmacy",
  location: "Bagatelle Mall, Moka",
  rating: 4.6,
  reviews: 187,
  license: "PH-2024-001",
  operatingHours: "Monday - Saturday: 8:00 AM - 8:00 PM, Sunday: 9:00 AM - 6:00 PM",
  deliveryRadius: "Port Louis, Moka, Curepipe areas",
  certifications: ["Licensed Pharmacy", "Quality Assured", "Temperature Controlled"],
  avatar: "💊"
}

const mockMedicine: Medicine = {
  id: "1",
  name: "Panadol Extra",
  genericName: "Paracetamol + Caffeine",
  manufacturer: "GSK",
  strength: "500mg + 65mg",
  form: "Tablets",
  category: "Pain Relief",
  price: 125,
  stockStatus: "in-stock",
  prescriptionRequired: false,
  controlledSubstance: false,
  expiryDate: "2025-12-31",
  description: "Fast-acting pain relief with added caffeine for enhanced effectiveness",
  sideEffects: ["Nausea", "Allergic reactions (rare)", "Liver toxicity (with overdose)"],
  interactions: ["Warfarin", "Alcohol", "Other paracetamol-containing medicines"],
  contraindications: ["Severe liver disease", "Known hypersensitivity to paracetamol"]
}

const deliverySlots: DeliverySlot[] = [
  { date: "2024-02-15", time: "09:00 AM - 11:00 AM", available: true, type: "standard", fee: 50 },
  { date: "2024-02-15", time: "02:00 PM - 04:00 PM", available: true, type: "standard", fee: 50 },
  { date: "2024-02-15", time: "05:00 PM - 07:00 PM", available: false, type: "priority", fee: 75 },
  { date: "2024-02-16", time: "09:00 AM - 11:00 AM", available: true, type: "express", fee: 100 },
  { date: "2024-02-16", time: "11:00 AM - 01:00 PM", available: true, type: "standard", fee: 50 },
  { date: "2024-02-16", time: "02:00 PM - 04:00 PM", available: true, type: "standard", fee: 50 },
  { date: "2024-02-17", time: "10:00 AM - 12:00 PM", available: true, type: "standard", fee: 50 },
  { date: "2024-02-17", time: "03:00 PM - 05:00 PM", available: true, type: "priority", fee: 75 }
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
    description: "Use your company's pharmaceutical benefits",
    discount: 20,
    icon: "🏢",
    available: true
  },
  {
    id: "insurance",
    type: "insurance",
    name: "Health Insurance Coverage",
    description: "Apply health insurance (60% covered for prescribed medicines)",
    discount: 60,
    icon: "🛡️",
    available: true
  },
  {
    id: "subscription",
    type: "subscription",
    name: "Pharmacy Subscription",
    description: "Use your active medication subscription plan",
    discount: 100,
    icon: "💳",
    available: true
  }
]

export default function CompletePharmacyOrderBooking() {
  const [currentStep, setCurrentStep] = useState(1)
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    pharmacy: mockPharmacy,
    medicine: mockMedicine,
    quantity: 1,
    prescriptionMethod: mockMedicine.prescriptionRequired ? "upload" : "digital",
    prescription: {
      doctorName: "",
      doctorLicense: "",
      prescriptionDate: "",
      patientName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      validated: false,
      verificationNotes: ""
    },
    deliveryAddress: "",
    deliverySlot: null,
    specialInstructions: "",
    totalCost: mockMedicine.price,
    emergencyContact: "",
    communicationPreference: "app"
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [ticketId, setTicketId] = useState("")
  const [drugInteractions, setDrugInteractions] = useState<string[]>([])

  const steps = [
    { number: 1, title: "Medicine & Pharmacy", icon: FaPills },
    { number: 2, title: "Prescription", icon: FaFileAlt },
    { number: 3, title: "Delivery Details", icon: FaTruck },
    { number: 4, title: "Payment", icon: FaWallet },
    { number: 5, title: "Confirmation", icon: FaTicketAlt }
  ]

  const handleQuantityChange = (quantity: number) => {
    const newTotal = orderDetails.medicine.price * quantity
    const deliveryFee = orderDetails.deliverySlot?.fee || 0
    setOrderDetails({
      ...orderDetails,
      quantity,
      totalCost: newTotal + deliveryFee
    })
  }

  const handlePrescriptionFileUpload = (file: File) => {
    setOrderDetails({
      ...orderDetails,
      prescription: {
        ...orderDetails.prescription,
        file
      }
    })
  }

  const handleDeliverySlotSelect = (slot: DeliverySlot) => {
    const medicineTotal = orderDetails.medicine.price * orderDetails.quantity
    setOrderDetails({
      ...orderDetails,
      deliverySlot: slot,
      totalCost: medicineTotal + slot.fee
    })
  }

  const validatePrescription = () => {
    setTimeout(() => {
      setOrderDetails(prev => ({
        ...prev,
        prescription: {
          ...prev.prescription,
          validated: true,
          verificationNotes: "Prescription verified by licensed pharmacist. Dosage and instructions confirmed."
        }
      }))
    }, 2000)
  }

  const checkDrugInteractions = () => {
    if (orderDetails.medicine.interactions.length > 0) {
      setDrugInteractions(["No significant interactions found with commonly used medications"])
    }
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setOrderConfirmed(true)
      setTicketId(`PHM-${Date.now()}`)
      setCurrentStep(5)
    }, 3000)
  }

  const calculateFinalAmount = () => {
    if (!selectedPaymentMethod) return orderDetails.totalCost
    
    const baseAmount = orderDetails.totalCost
    if (selectedPaymentMethod.discount) {
      return baseAmount * (1 - selectedPaymentMethod.discount / 100)
    }
    return baseAmount
  }

  const getStockStatusStyle = (status: string) => {
    switch (status) {
      case "in-stock":
        return "text-green-600 bg-green-50 border-green-200"
      case "low-stock":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "out-of-stock":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getDeliverySlotStyle = (slot: DeliverySlot, isSelected: boolean) => {
    if (!slot.available) return "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
    if (isSelected) return "bg-green-600 text-white border-green-600"
    
    switch (slot.type) {
      case "express":
        return "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
      case "priority":
        return "border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-500"
      default:
        return "border-gray-300 hover:border-green-400 hover:bg-green-50"
    }
  }

  useEffect(() => {
    checkDrugInteractions()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard" className="text-gray-600 hover:text-green-600">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Medicine</h1>
              <p className="text-gray-600">Purchase {orderDetails.medicine.name} from {orderDetails.pharmacy.name}</p>
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
                    currentStep === step.number ? "bg-green-600 text-white" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {currentStep > step.number ? <FaCheck /> : <step.icon />}
                  </div>
                  <span className={`text-xs mt-2 text-center ${
                    currentStep >= step.number ? "text-green-600 font-medium" : "text-gray-500"
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
        {/* Step 1: Medicine & Pharmacy Details */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Pharmacy Information */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pharmacy Details</h2>
                
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/4 text-center">
                    <div className="text-6xl mb-4">{orderDetails.pharmacy.avatar}</div>
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                      <FaStar />
                      <span className="font-bold text-lg">{orderDetails.pharmacy.rating}</span>
                      <span className="text-gray-600 text-sm">({orderDetails.pharmacy.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="lg:w-3/4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{orderDetails.pharmacy.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <FaMapMarkerAlt />
                      <span>{orderDetails.pharmacy.location}</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">License</h4>
                        <p className="text-gray-600">{orderDetails.pharmacy.license}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Delivery Area</h4>
                        <p className="text-gray-600">{orderDetails.pharmacy.deliveryRadius}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {orderDetails.pharmacy.certifications.map((cert, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <FaClock className="text-green-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-1">Operating Hours</h4>
                          <p className="text-green-700 text-sm">{orderDetails.pharmacy.operatingHours}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medicine Information */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Medicine Details</h2>
                
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/4">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FaPills className="text-4xl text-green-600" />
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStockStatusStyle(orderDetails.medicine.stockStatus)}`}>
                        {orderDetails.medicine.stockStatus === "in-stock" && <FaCheckCircle className="mr-1" />}
                        {orderDetails.medicine.stockStatus.replace("-", " ").toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-3/4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{orderDetails.medicine.name}</h3>
                        <p className="text-lg text-gray-600">{orderDetails.medicine.genericName}</p>
                        <p className="text-green-600 font-semibold">{orderDetails.medicine.strength} - {orderDetails.medicine.form}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">Rs {orderDetails.medicine.price}</p>
                        <p className="text-sm text-gray-600">per pack</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Manufacturer</h4>
                        <p className="text-gray-600">{orderDetails.medicine.manufacturer}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                        <p className="text-gray-600">{orderDetails.medicine.category}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Expiry Date</h4>
                        <p className="text-gray-600">{orderDetails.medicine.expiryDate}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Prescription Required</h4>
                        <p className="text-gray-600">{orderDetails.medicine.prescriptionRequired ? "Yes" : "No"}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{orderDetails.medicine.description}</p>
                    </div>

                    {/* Quantity Selection */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Quantity</h4>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(Math.max(1, orderDetails.quantity - 1))}
                          className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="text-xl font-semibold w-12 text-center">{orderDetails.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(orderDetails.quantity + 1)}
                          className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                        <span className="text-gray-600 ml-4">Total: Rs {orderDetails.medicine.price * orderDetails.quantity}</span>
                      </div>
                    </div>

                    {/* Drug Safety Information */}
                    {orderDetails.medicine.prescriptionRequired && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <FaExclamationTriangle className="text-orange-600 mt-1" />
                          <div>
                            <h4 className="font-semibold text-orange-800 mb-1">Prescription Required</h4>
                            <p className="text-orange-700 text-sm">This medicine requires a valid prescription from a licensed doctor.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drug Interactions Check */}
              {drugInteractions.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Drug Interaction Check</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-600 mt-1" />
                      <div>
                        {drugInteractions.map((interaction, index) => (
                          <p key={index} className="text-green-700 text-sm">{interaction}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={orderDetails.medicine.stockStatus === "out-of-stock"}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Prescription
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Prescription Handling */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Prescription Information</h2>
              
              {orderDetails.medicine.prescriptionRequired ? (
                <div className="space-y-6">
                  {/* Prescription Method Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">How would you like to provide your prescription?</h3>
                    <div className="space-y-4">
                      <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        orderDetails.prescriptionMethod === "upload" ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"
                      }`}>
                        <input
                          type="radio"
                          name="prescription-method"
                          value="upload"
                          checked={orderDetails.prescriptionMethod === "upload"}
                          onChange={(e) => setOrderDetails({ ...orderDetails, prescriptionMethod: e.target.value as "upload" | "digital" })}
                          className="mr-4 mt-1"
                        />
                        <FaUpload className={`text-2xl mr-4 mt-1 ${orderDetails.prescriptionMethod === "upload" ? "text-green-600" : "text-gray-400"}`} />
                        <div>
                          <h4 className="font-bold text-lg mb-2">Upload Prescription Document</h4>
                          <p className="text-gray-600 text-sm">Upload a photo or scan of your existing prescription</p>
                        </div>
                      </label>

                      <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        orderDetails.prescriptionMethod === "digital" ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"
                      }`}>
                        <input
                          type="radio"
                          name="prescription-method"
                          value="digital"
                          checked={orderDetails.prescriptionMethod === "digital"}
                          onChange={(e) => setOrderDetails({ ...orderDetails, prescriptionMethod: e.target.value as "upload" | "digital" })}
                          className="mr-4 mt-1"
                        />
                        <FaEdit className={`text-2xl mr-4 mt-1 ${orderDetails.prescriptionMethod === "digital" ? "text-green-600" : "text-gray-400"}`} />
                        <div>
                          <h4 className="font-bold text-lg mb-2">Digital Prescription Form</h4>
                          <p className="text-gray-600 text-sm">Fill out prescription details manually</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Upload Method */}
                  {orderDetails.prescriptionMethod === "upload" && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Upload Prescription Document</h4>
                      {!orderDetails.prescription.file ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                          <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">Upload your prescription document</p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handlePrescriptionFileUpload(file)
                            }}
                            className="hidden"
                            id="prescription-upload"
                          />
                          <label
                            htmlFor="prescription-upload"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 cursor-pointer inline-block"
                          >
                            Choose File
                          </label>
                        </div>
                      ) : (
                        <div className="border border-green-200 rounded-xl p-4 bg-green-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaFileAlt className="text-green-600" />
                              <div>
                                <p className="font-medium text-green-800">{orderDetails.prescription.file.name}</p>
                                <p className="text-green-600 text-sm">{(orderDetails.prescription.file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setOrderDetails(prev => ({
                                ...prev,
                                prescription: { ...prev.prescription, file: undefined }
                              }))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Digital Form Method */}
                  {orderDetails.prescriptionMethod === "digital" && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Prescription Details</h4>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Doctor License Number *</label>
                          <input
                            type="text"
                            required
                            placeholder="MD-2024-001"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-600"
                            value={orderDetails.prescription.doctorLicense}
                            onChange={(e) => setOrderDetails(prev => ({
                              ...prev,
                              prescription: { ...prev.prescription, doctorLicense: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Prescription Date *</label>
                          <input
                            type="date"
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-600"
                            value={orderDetails.prescription.prescriptionDate}
                            onChange={(e) => setOrderDetails(prev => ({
                              ...prev,
                              prescription: { ...prev.prescription, prescriptionDate: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Patient Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Patient full name"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-600"
                            value={orderDetails.prescription.patientName}
                            onChange={(e) => setOrderDetails(prev => ({
                              ...prev,
                              prescription: { ...prev.prescription, patientName: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Dosage *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., 1 tablet"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-600"
                            value={orderDetails.prescription.dosage}
                            onChange={(e) => setOrderDetails(prev => ({
                              ...prev,
                              prescription: { ...prev.prescription, dosage: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Frequency *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., 3 times daily"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-600"
                            value={orderDetails.prescription.frequency}
                            onChange={(e) => setOrderDetails(prev => ({
                              ...prev,
                              prescription: { ...prev.prescription, frequency: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-medium mb-2">Duration *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., 7 days"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-600"
                            value={orderDetails.prescription.duration}
                            onChange={(e) => setOrderDetails(prev => ({
                              ...prev,
                              prescription: { ...prev.prescription, duration: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-medium mb-2">Special Instructions</label>
                          <textarea
                            rows={3}
                            placeholder="Take with food, avoid alcohol, etc."
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-600"
                            value={orderDetails.prescription.instructions}
                            onChange={(e) => setOrderDetails(prev => ({
                              ...prev,
                              prescription: { ...prev.prescription, instructions: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Validation Status */}
                  {(orderDetails.prescription.file || orderDetails.prescription.doctorName) && (
                    <div>
                      <button
                        onClick={validatePrescription}
                        disabled={orderDetails.prescription.validated}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                      >
                        {orderDetails.prescription.validated ? "Prescription Validated" : "Validate Prescription"}
                      </button>
                      
                      {orderDetails.prescription.validated && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <FaCheckCircle className="text-green-600 mt-1" />
                            <div>
                              <h4 className="font-semibold text-green-800 mb-1">Prescription Verified</h4>
                              <p className="text-green-700 text-sm">{orderDetails.prescription.verificationNotes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <FaCheckCircle className="text-4xl text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">No Prescription Required</h3>
                  <p className="text-green-700">This medicine can be purchased without a prescription.</p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={orderDetails.medicine.prescriptionRequired && !orderDetails.prescription.validated}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Delivery
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Delivery Details */}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Delivery Address *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Enter your complete address including street, city, and postal code"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-600"
                      value={orderDetails.deliveryAddress}
                      onChange={(e) => setOrderDetails({ ...orderDetails, deliveryAddress: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Special Delivery Instructions</label>
                    <textarea
                      rows={2}
                      placeholder="Any special instructions for delivery (gate code, landmark, etc.)"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-600"
                      value={orderDetails.specialInstructions}
                      onChange={(e) => setOrderDetails({ ...orderDetails, specialInstructions: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Emergency Contact</label>
                    <input
                      type="text"
                      placeholder="Name and phone number"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-600"
                      value={orderDetails.emergencyContact}
                      onChange={(e) => setOrderDetails({ ...orderDetails, emergencyContact: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Slots */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Select Delivery Slot</h3>
                
                <div className="mb-4">
                  <div className="flex items-center gap-4 text-xs flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-gray-300 rounded"></div>
                      <span>Standard (Rs 50)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-orange-300 rounded"></div>
                      <span>Priority (Rs 75)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-red-300 rounded"></div>
                      <span>Express (Rs 100)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {deliverySlots.reduce((acc, slot) => {
                    if (!acc.find(s => s.date === slot.date)) {
                      acc.push({ date: slot.date, slots: deliverySlots.filter(s => s.date === slot.date) });
                    }
                    return acc;
                  }, [] as { date: string; slots: DeliverySlot[] }[]).map((dateGroup) => (
                    <div key={dateGroup.date} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {new Date(dateGroup.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dateGroup.slots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleDeliverySlotSelect(slot)}
                            disabled={!slot.available}
                            className={`p-4 border-2 rounded-lg text-left transition-all ${
                              getDeliverySlotStyle(slot, orderDetails.deliverySlot === slot)
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium">{slot.time}</span>
                              <span className="text-sm">Rs {slot.fee}</span>
                            </div>
                            <span className="text-xs capitalize">{slot.type} Delivery</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {orderDetails.deliverySlot && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTruck className="text-green-600" />
                      <span className="font-semibold text-green-800">Delivery Scheduled</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      {new Date(orderDetails.deliverySlot.date).toLocaleDateString()} at {orderDetails.deliverySlot.time}
                      <br />
                      {orderDetails.deliverySlot.type.charAt(0).toUpperCase() + orderDetails.deliverySlot.type.slice(1)} delivery - Rs {orderDetails.deliverySlot.fee}
                    </p>
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
                disabled={!orderDetails.deliveryAddress || !orderDetails.deliverySlot}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                        ? "border-green-600 bg-green-50" 
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
                  </label>
                ))}
              </div>

              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border">
                <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{orderDetails.medicine.name} × {orderDetails.quantity}</span>
                    <span className="font-medium">Rs {orderDetails.medicine.price * orderDetails.quantity}</span>
                  </div>
                  {orderDetails.deliverySlot && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">Rs {orderDetails.deliverySlot.fee}</span>
                    </div>
                  )}
                  {selectedPaymentMethod?.discount && orderDetails.medicine.prescriptionRequired && (
                    <div className="flex justify-between text-green-600">
                      <span>Insurance Discount ({selectedPaymentMethod.discount}%)</span>
                      <span className="font-medium">
                        - Rs {Math.round(orderDetails.totalCost * selectedPaymentMethod.discount / 100)}
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

              {/* Pharmacy Quality Assurance */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">Quality Assurance</h4>
                    <p className="text-green-700 text-sm">All medicines are sourced from licensed manufacturers and stored under proper conditions. Expiry dates verified before dispatch.</p>
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
                      Confirm Order - Rs {Math.round(calculateFinalAmount())}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && orderConfirmed && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="text-green-600 text-3xl" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h2>
              <p className="text-gray-600 mb-8">Your medicine order has been successfully placed and will be processed shortly.</p>
              
              {/* Digital Order Ticket */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white mb-8 text-left">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Pharmacy Order Ticket</h3>
                    <p className="text-green-100 text-sm">Order tracking and delivery reference</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-100 text-sm">Order ID</p>
                    <p className="font-bold text-lg">{ticketId}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-100">Medicine Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-green-200">Medicine:</span> {orderDetails.medicine.name}</p>
                      <p><span className="text-green-200">Quantity:</span> {orderDetails.quantity} pack(s)</p>
                      <p><span className="text-green-200">Manufacturer:</span> {orderDetails.medicine.manufacturer}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-green-100">Delivery Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-green-200">Date:</span> {orderDetails.deliverySlot?.date}</p>
                      <p><span className="text-green-200">Time:</span> {orderDetails.deliverySlot?.time}</p>
                      <p><span className="text-green-200">Type:</span> {orderDetails.deliverySlot?.type} delivery</p>
                      <p><span className="text-green-200">Total Paid:</span> Rs {Math.round(calculateFinalAmount())}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaTruck className="text-green-200" />
                    <span className="font-semibold text-green-100">Order Status</span>
                  </div>
                  <p className="text-green-100 text-sm">
                    Your order is being prepared for delivery. Tracking details will be sent via SMS and email.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/patient/pharmacy/orders" className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all text-center">
                  View My Orders
                </Link>
                <Link href="/patient/dashboard" className="border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center">
                  Go to Dashboard
                </Link>
              </div>
              
              {/* Important Medicine Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaExclamationTriangle className="text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Important Medicine Information</span>
                  </div>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>Follow dosage instructions exactly as prescribed</p>
                    <p>Check expiry date before use: {orderDetails.medicine.expiryDate}</p>
                    <p>Store in a cool, dry place away from direct sunlight</p>
                    <p>Keep medicines away from children</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaPhone className="text-red-600" />
                    <span className="font-semibold text-red-800">24/7 Pharmacy Support</span>
                  </div>
                  <p className="text-sm text-red-700">
                    For urgent medicine queries or delivery issues: 
                    <a href="tel:+2304004000" className="font-semibold hover:underline ml-1">
                      +230 400 4000
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

