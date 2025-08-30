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
  FaCheckCircle,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash
} from "react-icons/fa"
import { useCart } from '@/app/search/medicines/contexts/CartContext'

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

interface PrescriptionUpload {
  medicineId: number;
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
  prescriptions: Map<number, PrescriptionUpload>;
  deliveryAddress: string;
  deliverySlot: DeliverySlot | null;
  specialInstructions: string;
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
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    pharmacy: mockPharmacy,
    prescriptions: new Map(),
    deliveryAddress: "",
    deliverySlot: null,
    specialInstructions: "",
    emergencyContact: "",
    communicationPreference: "app"
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const steps = [
    { number: 1, title: "Cart Review", icon: FaShoppingCart },
    { number: 2, title: "Prescriptions", icon: FaFileAlt },
    { number: 3, title: "Delivery", icon: FaTruck },
    { number: 4, title: "Payment", icon: FaWallet },
    { number: 5, title: "Confirmation", icon: FaTicketAlt }
  ]

  // Check if any items require prescription
  const prescriptionRequired = cartItems.some(item => item.prescriptionRequired)

  const handleDeliverySlotSelect = (slot: DeliverySlot) => {
    setOrderDetails({
      ...orderDetails,
      deliverySlot: slot
    })
  }

  const handlePrescriptionUpload = (medicineId: number, prescription: Partial<PrescriptionUpload>) => {
    const updatedPrescriptions = new Map(orderDetails.prescriptions)
    const existing = updatedPrescriptions.get(medicineId) || {
      medicineId,
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
    }
    
    updatedPrescriptions.set(medicineId, { ...existing, ...prescription })
    setOrderDetails({
      ...orderDetails,
      prescriptions: updatedPrescriptions
    })
  }

  const validatePrescription = (medicineId: number) => {
    setTimeout(() => {
      handlePrescriptionUpload(medicineId, {
        validated: true,
        verificationNotes: "Prescription verified by licensed pharmacist. Dosage and instructions confirmed."
      })
    }, 2000)
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setOrderConfirmed(true)
      setTicketId(`PHM-${Date.now()}`)
      setCurrentStep(5)
      clearCart() // Clear cart after successful order
    }, 3000)
  }

  const calculateSubtotal = () => {
    return getTotalPrice()
  }

  const calculateFinalAmount = () => {
    const subtotal = calculateSubtotal()
    const deliveryFee = orderDetails.deliverySlot?.fee || 0
    const total = subtotal + deliveryFee
    
    if (!selectedPaymentMethod) return total
    
    // Apply discount only to prescription medicines
    if (selectedPaymentMethod.discount) {
      const prescriptionTotal = cartItems
        .filter(item => item.prescriptionRequired)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      const nonPrescriptionTotal = cartItems
        .filter(item => !item.prescriptionRequired)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      const discountAmount = prescriptionTotal * (selectedPaymentMethod.discount / 100)
      return nonPrescriptionTotal + (prescriptionTotal - discountAmount) + deliveryFee
    }
    
    return total
  }

  const allPrescriptionsValidated = () => {
    const prescriptionItems = cartItems.filter(item => item.prescriptionRequired)
    return prescriptionItems.every(item => {
      const prescription = orderDetails.prescriptions.get(item.id)
      return prescription?.validated === true
    })
  }

  // Redirect to medicines page if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderConfirmed) {
      window.location.href = '/patient/pharmacy/medicines'
    }
  }, [cartItems, orderConfirmed])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/patient/pharmacy/medicines" className="text-gray-600 hover:text-green-600">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Order</h1>
              <p className="text-gray-600">{cartItems.length} items from {orderDetails.pharmacy.name}</p>
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
        {/* Step 1: Cart Review */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Cart</h2>
              
              {/* Pharmacy Info */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{orderDetails.pharmacy.avatar}</span>
                  <div>
                    <h3 className="font-semibold text-green-800">{orderDetails.pharmacy.name}</h3>
                    <p className="text-green-600 text-sm">{orderDetails.pharmacy.location}</p>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.brand} - {item.genericName}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {item.prescriptionRequired && (
                            <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">
                              Prescription Required
                            </span>
                          )}
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                            {item.stockStatus === 'in-stock' ? 'In Stock' : 'Limited Stock'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="font-medium w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Rs {item.price} × {item.quantity}</p>
                        <p className="font-bold text-green-600">Rs {item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-green-600">Rs {calculateSubtotal()}</span>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Link
                  href="/patient/pharmacy/medicines"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={() => setCurrentStep(prescriptionRequired ? 2 : 3)}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Prescriptions (if required) */}
        {currentStep === 2 && prescriptionRequired && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Prescriptions</h2>
              
              <div className="space-y-6">
                {cartItems.filter(item => item.prescriptionRequired).map((item) => (
                  <div key={item.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.brand} - Qty: {item.quantity}</p>
                      </div>
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                        Prescription Required
                      </span>
                    </div>

                    <div className="space-y-4">
                      {!orderDetails.prescriptions.get(item.id)?.file ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <FaUpload className="text-3xl text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-3">Upload prescription for {item.name}</p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handlePrescriptionUpload(item.id, { file })
                            }}
                            className="hidden"
                            id={`prescription-${item.id}`}
                          />
                          <label
                            htmlFor={`prescription-${item.id}`}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 cursor-pointer inline-block"
                          >
                            Choose File
                          </label>
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaFileAlt className="text-green-600" />
                              <div>
                                <p className="font-medium text-green-800">
                                  {orderDetails.prescriptions.get(item.id)?.file?.name}
                                </p>
                                <p className="text-green-600 text-sm">
                                  Prescription uploaded
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handlePrescriptionUpload(item.id, { file: undefined, validated: false })}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      )}

                      {orderDetails.prescriptions.get(item.id)?.file && (
                        <button
                          onClick={() => validatePrescription(item.id)}
                          disabled={orderDetails.prescriptions.get(item.id)?.validated}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {orderDetails.prescriptions.get(item.id)?.validated ? "Validated ✓" : "Validate Prescription"}
                        </button>
                      )}

                      {orderDetails.prescriptions.get(item.id)?.validated && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <FaCheckCircle className="text-green-600 mt-0.5" />
                            <div>
                              <p className="font-semibold text-green-800 text-sm">Verified</p>
                              <p className="text-green-700 text-xs">
                                {orderDetails.prescriptions.get(item.id)?.verificationNotes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {cartItems.some(item => !item.prescriptionRequired) && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-blue-800 font-semibold text-sm">Note</p>
                      <p className="text-blue-700 text-sm">
                        Your cart also contains {cartItems.filter(item => !item.prescriptionRequired).length} over-the-counter 
                        medicine(s) that do not require prescription.
                      </p>
                    </div>
                  </div>
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
                  disabled={!allPrescriptionsValidated()}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Delivery
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
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
                              !slot.available 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                : orderDetails.deliverySlot === slot
                                ? "bg-green-600 text-white border-green-600"
                                : slot.type === "express"
                                ? "border-red-300 text-red-600 hover:bg-red-50"
                                : slot.type === "priority"
                                ? "border-orange-300 text-orange-600 hover:bg-orange-50"
                                : "border-gray-300 hover:border-green-400 hover:bg-green-50"
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
                onClick={() => setCurrentStep(prescriptionRequired ? 2 : 1)}
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
                            {method.discount}% OFF on Rx
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
                <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {/* Items breakdown */}
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} × {item.quantity}</span>
                      <span className="font-medium">Rs {item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">Rs {calculateSubtotal()}</span>
                    </div>
                  </div>
                  
                  {orderDetails.deliverySlot && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">Rs {orderDetails.deliverySlot.fee}</span>
                    </div>
                  )}
                  
                  {selectedPaymentMethod?.discount && cartItems.some(item => item.prescriptionRequired) && (
                    <div className="flex justify-between text-green-600">
                      <span>Insurance Discount ({selectedPaymentMethod.discount}% on Rx items)</span>
                      <span className="font-medium">
                        - Rs {Math.round(
                          cartItems
                            .filter(item => item.prescriptionRequired)
                            .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                          * selectedPaymentMethod.discount / 100
                        )}
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
                      Pay Rs {Math.round(calculateFinalAmount())}
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
                
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-green-200">Delivery Date & Time</p>
                    <p className="font-semibold">
                      {orderDetails.deliverySlot?.date} at {orderDetails.deliverySlot?.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-200">Total Amount Paid</p>
                    <p className="font-semibold text-lg">Rs {Math.round(calculateFinalAmount())}</p>
                  </div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}