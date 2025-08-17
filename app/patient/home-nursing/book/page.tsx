// app/patient/nurse-booking/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  FaUserNurse,
  FaArrowLeft,
  FaClock,
  FaCalendarAlt,
  FaStar,
  FaBandAid,
  FaHeartbeat,
  FaCheckCircle,
  FaInfoCircle,
  FaSearch,
  FaShieldAlt,
  FaLanguage,
} from "react-icons/fa"

interface NurseProfile {
  id: string;
  name: string;
  avatar: string;
  qualification: string;
  experience: string;
  rating: number;
  reviews: number;
  specializations: string[];
  languages: string[];
  hourlyRate: number;
  availability: string[];
  verified: boolean;
  bio: string;
  completedServices: number;
}

interface NursingService {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  icon: string;
  popular: boolean;
}

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  services: string[];
  duration: string;
  price: number;
  savings: number;
  recommended: boolean;
}

interface BookingRequest {
  nurse: NurseProfile | null;
  services: NursingService[];
  package: ServicePackage | null;
  date: string;
  time: string;
  duration: number;
  address: string;
  patientName: string;
  patientAge: number;
  patientCondition: string;
  specialInstructions: string;
  totalAmount: number;
}

interface PastBooking {
  id: string;
  nurseName: string;
  service: string;
  date: string;
  status: "completed" | "cancelled" | "upcoming";
  rating: number | null;
}

const mockNurses: NurseProfile[] = [
  {
    id: "N001",
    name: "Sister Mary Johnson",
    avatar: "👩‍⚕️",
    qualification: "RN, BSN",
    experience: "8+ years",
    rating: 4.9,
    reviews: 156,
    specializations: ["Post-Surgery Care", "Wound Care", "Elderly Care"],
    languages: ["English", "French", "Creole"],
    hourlyRate: 800,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    verified: true,
    bio: "Experienced nurse specializing in home healthcare with a focus on post-operative and elderly care",
    completedServices: 450
  },
  {
    id: "N002",
    name: "Nurse Patricia Chen",
    avatar: "👩‍⚕️",
    qualification: "RN, Critical Care Certified",
    experience: "10+ years",
    rating: 4.8,
    reviews: 203,
    specializations: ["Critical Care", "IV Therapy", "Medication Management"],
    languages: ["English", "Mandarin", "Creole"],
    hourlyRate: 900,
    availability: ["Mon", "Wed", "Fri", "Sat", "Sun"],
    verified: true,
    bio: "Critical care nurse with extensive experience in complex medical conditions and IV therapy",
    completedServices: 580
  },
  {
    id: "N003",
    name: "Nurse David Kumar",
    avatar: "👨‍⚕️",
    qualification: "RN, Pediatric Specialist",
    experience: "6+ years",
    rating: 4.7,
    reviews: 89,
    specializations: ["Pediatric Care", "Vaccination", "Newborn Care"],
    languages: ["English", "Hindi", "French"],
    hourlyRate: 750,
    availability: ["Tue", "Thu", "Fri", "Sat", "Sun"],
    verified: true,
    bio: "Pediatric specialist providing compassionate care for children and newborns",
    completedServices: 280
  }
]

const mockServices: NursingService[] = [
  {
    id: "NS001",
    name: "Post-Surgery Care",
    category: "Medical Care",
    description: "Professional post-operative care including wound dressing and monitoring",
    duration: "2-4 hours",
    price: 1500,
    icon: "🏥",
    popular: true
  },
  {
    id: "NS002",
    name: "IV Therapy",
    category: "Medical Care",
    description: "Intravenous medication administration and monitoring",
    duration: "1-2 hours",
    price: 1200,
    icon: "💉",
    popular: true
  },
  {
    id: "NS003",
    name: "Wound Dressing",
    category: "Medical Care",
    description: "Professional wound cleaning and dressing change",
    duration: "30-60 min",
    price: 600,
    icon: "🩹",
    popular: true
  },
  {
    id: "NS004",
    name: "Elderly Care",
    category: "Long-term Care",
    description: "Comprehensive care for elderly patients including medication management",
    duration: "4-8 hours",
    price: 2500,
    icon: "👴",
    popular: true
  },
  {
    id: "NS005",
    name: "Injection Administration",
    category: "Medical Care",
    description: "Safe administration of prescribed injections",
    duration: "15-30 min",
    price: 400,
    icon: "💊",
    popular: false
  },
  {
    id: "NS006",
    name: "Vital Signs Monitoring",
    category: "Medical Care",
    description: "Regular monitoring of blood pressure, temperature, and other vitals",
    duration: "30 min",
    price: 500,
    icon: "❤️",
    popular: false
  },
  {
    id: "NS007",
    name: "Newborn Care",
    category: "Pediatric",
    description: "Specialized care for newborns including feeding and hygiene",
    duration: "4-6 hours",
    price: 2000,
    icon: "👶",
    popular: false
  },
  {
    id: "NS008",
    name: "Physiotherapy Assistance",
    category: "Rehabilitation",
    description: "Assistance with prescribed physiotherapy exercises",
    duration: "1-2 hours",
    price: 1000,
    icon: "🏃",
    popular: false
  }
]

const mockPackages: ServicePackage[] = [
  {
    id: "PKG001",
    name: "Post-Surgery Recovery",
    description: "Complete post-operative care package",
    services: ["Wound Dressing", "IV Therapy", "Vital Monitoring", "Medication Management"],
    duration: "7 days",
    price: 8500,
    savings: 1500,
    recommended: true
  },
  {
    id: "PKG002",
    name: "Elderly Care Package",
    description: "Comprehensive elderly care with daily visits",
    services: ["Daily Care", "Medication Management", "Vital Monitoring", "Hygiene Assistance"],
    duration: "30 days",
    price: 35000,
    savings: 5000,
    recommended: false
  },
  {
    id: "PKG003",
    name: "New Mother Support",
    description: "Support for new mothers and newborn care",
    services: ["Newborn Care", "Breastfeeding Support", "Mother Care", "Baby Hygiene"],
    duration: "14 days",
    price: 18000,
    savings: 3000,
    recommended: false
  }
]

const mockPastBookings: PastBooking[] = [
  {
    id: "BK001",
    nurseName: "Sister Mary Johnson",
    service: "Post-Surgery Care",
    date: "2024-01-10",
    status: "completed",
    rating: 5
  },
  {
    id: "BK002",
    nurseName: "Nurse Patricia Chen",
    service: "IV Therapy",
    date: "2024-01-15",
    status: "upcoming",
    rating: 0
  }
]

export default function NurseBookingPage() {
  const [activeTab, setActiveTab] = useState<"services" | "packages" | "nurses" | "history">("services")
  const [selectedServices, setSelectedServices] = useState<NursingService[]>([])
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null)
  const [selectedNurse, setSelectedNurse] = useState<NurseProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [bookingStep, setBookingStep] = useState(1)
  const [bookingDetails, setBookingDetails] = useState<BookingRequest>({
    nurse: null,
    services: [],
    package: null,
    date: "",
    time: "",
    duration: 0,
    address: "",
    patientName: "",
    patientAge: 0,
    patientCondition: "",
    specialInstructions: "",
    totalAmount: 0
  })

  const categories = ["all", "Medical Care", "Long-term Care", "Pediatric", "Rehabilitation"]

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || service.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddService = (service: NursingService) => {
    if (!selectedServices.find(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service])
      setSelectedPackage(null)
    }
  }

  const handleSelectPackage = (pkg: ServicePackage) => {
    setSelectedPackage(pkg)
    setSelectedServices([])
  }

  const handleSelectNurse = (nurse: NurseProfile) => {
    setSelectedNurse(nurse)
    setBookingDetails({ ...bookingDetails, nurse })
  }

  const getTotalAmount = () => {
    if (selectedPackage) {
      return selectedPackage.price
    }
    return selectedServices.reduce((sum, service) => sum + service.price, 0)
  }

  const handleProceedToBooking = () => {
    if ((selectedServices.length > 0 || selectedPackage) && selectedNurse) {
      setBookingStep(2)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/patient/dashboard" className="text-gray-600 hover:text-primary-blue">
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Home Nursing Services</h1>
                <p className="text-gray-600">Book professional nursing care at home</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {(selectedServices.length > 0 || selectedPackage) && selectedNurse && (
                <button
                  onClick={handleProceedToBooking}
                  className="btn-gradient px-6 py-2"
                >
                  Proceed to Book
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {bookingStep === 1 ? (
          <>
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab("services")}
                    className={`flex-1 px-6 py-4 font-medium ${
                      activeTab === "services"
                        ? "text-primary-blue border-b-2 border-primary-blue"
                        : "text-gray-600"
                    }`}
                  >
                    <FaHeartbeat className="inline mr-2" />
                    Services
                  </button>
                  <button
                    onClick={() => setActiveTab("packages")}
                    className={`flex-1 px-6 py-4 font-medium ${
                      activeTab === "packages"
                        ? "text-primary-blue border-b-2 border-primary-blue"
                        : "text-gray-600"
                    }`}
                  >
                    <FaBandAid className="inline mr-2" />
                    Packages
                  </button>
                  <button
                    onClick={() => setActiveTab("nurses")}
                    className={`flex-1 px-6 py-4 font-medium ${
                      activeTab === "nurses"
                        ? "text-primary-blue border-b-2 border-primary-blue"
                        : "text-gray-600"
                    }`}
                  >
                    <FaUserNurse className="inline mr-2" />
                    Choose Nurse
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`flex-1 px-6 py-4 font-medium ${
                      activeTab === "history"
                        ? "text-primary-blue border-b-2 border-primary-blue"
                        : "text-gray-600"
                    }`}
                  >
                    <FaClock className="inline mr-2" />
                    History
                  </button>
                </nav>
              </div>
            </div>

            {/* Services Tab */}
            {activeTab === "services" && (
              <>
                {/* Search and Filter */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Search nursing services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:border-primary-blue"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Popular Services */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Popular Services</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredServices.filter(s => s.popular).map((service) => (
                      <div key={service.id} className="bg-white rounded-lg p-4 shadow-lg">
                        <div className="text-center mb-3">
                          <span className="text-4xl">{service.icon}</span>
                        </div>
                        <h4 className="font-semibold text-center mb-2">{service.name}</h4>
                        <p className="text-sm text-gray-600 text-center mb-3">{service.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-500">
                            <FaClock className="inline mr-1" />
                            {service.duration}
                          </span>
                          <span className="font-bold">Rs {service.price}</span>
                        </div>
                        <button
                          onClick={() => handleAddService(service)}
                          disabled={selectedServices.find(s => s.id === service.id) !== undefined}
                          className={`w-full py-2 rounded-lg ${
                            selectedServices.find(s => s.id === service.id)
                              ? "bg-green-100 text-green-800"
                              : "bg-primary-blue text-white hover:bg-blue-600"
                          }`}
                        >
                          {selectedServices.find(s => s.id === service.id) ? "✓ Selected" : "Select"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Services */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">All Services</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredServices.filter(s => !s.popular).map((service) => (
                      <div key={service.id} className="bg-white rounded-lg p-4 shadow-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{service.icon}</span>
                          <div>
                            <h4 className="font-semibold">{service.name}</h4>
                            <p className="text-sm text-gray-600">{service.category} • {service.duration}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold mb-2">Rs {service.price}</p>
                          <button
                            onClick={() => handleAddService(service)}
                            disabled={selectedServices.find(s => s.id === service.id) !== undefined}
                            className={`px-4 py-1 rounded ${
                              selectedServices.find(s => s.id === service.id)
                                ? "bg-green-100 text-green-800"
                                : "bg-primary-blue text-white hover:bg-blue-600"
                            }`}
                          >
                            {selectedServices.find(s => s.id === service.id) ? "✓" : "Add"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Packages Tab */}
            {activeTab === "packages" && (
              <div className="grid md:grid-cols-3 gap-6">
                {mockPackages.map((pkg) => (
                  <div key={pkg.id} className={`bg-white rounded-2xl p-6 shadow-lg ${pkg.recommended ? "border-2 border-primary-blue" : ""}`}>
                    {pkg.recommended && (
                      <span className="inline-block px-3 py-1 bg-primary-blue text-white rounded-full text-xs font-medium mb-3">
                        Recommended
                      </span>
                    )}
                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-primary-blue">Rs {pkg.price}</p>
                      <p className="text-sm text-green-600">Save Rs {pkg.savings}</p>
                      <p className="text-sm text-gray-500">Duration: {pkg.duration}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Includes:</p>
                      <ul className="space-y-1">
                        {pkg.services.map((service, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <FaCheckCircle className="text-green-500" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleSelectPackage(pkg)}
                      className={`w-full py-2 rounded-lg ${
                        selectedPackage?.id === pkg.id
                          ? "bg-green-100 text-green-800"
                          : "bg-primary-blue text-white hover:bg-blue-600"
                      }`}
                    >
                      {selectedPackage?.id === pkg.id ? "✓ Selected" : "Select Package"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Nurses Tab */}
            {activeTab === "nurses" && (
              <div className="space-y-6">
                {mockNurses.map((nurse) => (
                  <div key={nurse.id} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-5xl">{nurse.avatar}</div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{nurse.name}</h3>
                            {nurse.verified && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                                <FaShieldAlt />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{nurse.qualification} • {nurse.experience}</p>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-500" />
                              <span className="font-semibold">{nurse.rating}</span>
                              <span className="text-gray-500">({nurse.reviews} reviews)</span>
                            </div>
                            <span className="text-gray-500">
                              <FaCheckCircle className="inline mr-1 text-green-500" />
                              {nurse.completedServices} services
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{nurse.bio}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {nurse.specializations.map((spec, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                {spec}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              <FaLanguage className="inline mr-1" />
                              {nurse.languages.join(", ")}
                            </span>
                            <span>
                              <FaCalendarAlt className="inline mr-1" />
                              Available: {nurse.availability.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold mb-2">Rs {nurse.hourlyRate}/hr</p>
                        <button
                          onClick={() => handleSelectNurse(nurse)}
                          className={`px-6 py-2 rounded-lg ${
                            selectedNurse?.id === nurse.id
                              ? "bg-green-100 text-green-800"
                              : "bg-primary-blue text-white hover:bg-blue-600"
                          }`}
                        >
                          {selectedNurse?.id === nurse.id ? "✓ Selected" : "Select Nurse"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {mockPastBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg p-4 shadow-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{booking.nurseName}</h4>
                      <p className="text-sm text-gray-600">{booking.service} • {booking.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "completed" ? "bg-green-100 text-green-800" :
                        booking.status === "upcoming" ? "bg-blue-100 text-blue-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {booking.status}
                      </span>
                      {booking.status === "completed" && booking.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < (booking.rating ?? 0) ? "text-yellow-500" : "text-gray-300"} />
                          ))}
                        </div>
                      )}
                      {booking.status === "completed" && !booking.rating && (
                        <button className="px-4 py-1 bg-primary-blue text-white rounded-lg hover:bg-blue-600">
                          Rate Service
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Summary */}
            {(selectedServices.length > 0 || selectedPackage || selectedNurse) && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
                <div className="container mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {(selectedServices.length > 0 || selectedPackage) && (
                      <div>
                        <p className="text-sm text-gray-600">
                          {selectedPackage ? "1 package" : `${selectedServices.length} service(s)`} selected
                        </p>
                        <p className="font-bold">Rs {getTotalAmount()}</p>
                      </div>
                    )}
                    {selectedNurse && (
                      <div>
                        <p className="text-sm text-gray-600">Nurse</p>
                        <p className="font-bold">{selectedNurse.name}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleProceedToBooking}
                    disabled={!(selectedServices.length > 0 || selectedPackage) || !selectedNurse}
                    className="btn-gradient px-8 py-3 disabled:opacity-50"
                  >
                    Proceed to Book
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Booking Details Step */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6">Booking Details</h2>
              
              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Service Date</label>
                  <input
                    type="date"
                    value={bookingDetails.date}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Preferred Time</label>
                  <input
                    type="time"
                    value={bookingDetails.time}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  />
                </div>
              </div>

              {/* Patient Information */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Patient Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Patient Name</label>
                    <input
                      type="text"
                      value={bookingDetails.patientName}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, patientName: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Age</label>
                    <input
                      type="number"
                      value={bookingDetails.patientAge}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, patientAge: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                      placeholder="Enter age"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Medical Condition</label>
                  <textarea
                    value={bookingDetails.patientCondition}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, patientCondition: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                    placeholder="Describe the patient condition..."
                  />
                </div>
              </div>

              {/* Service Address */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Service Address</label>
                <textarea
                  value={bookingDetails.address}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  placeholder="Enter complete address for home service"
                />
              </div>

              {/* Special Instructions */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Special Instructions (Optional)</label>
                <textarea
                  value={bookingDetails.specialInstructions}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, specialInstructions: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  placeholder="Any special requirements or instructions..."
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nurse</span>
                    <span className="font-medium">{selectedNurse?.name}</span>
                  </div>
                  {selectedPackage ? (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package</span>
                      <span className="font-medium">{selectedPackage.name}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Services ({selectedServices.length})</span>
                      <span className="font-medium">Multiple</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-xl font-bold text-primary-blue">Rs {getTotalAmount()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setBookingStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  className="flex-1 btn-gradient py-3"
                  disabled={!bookingDetails.date || !bookingDetails.time || !bookingDetails.patientName || !bookingDetails.address}
                >
                  Confirm Booking
                </button>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <FaInfoCircle className="text-blue-500 mb-2" />
              <h4 className="font-semibold text-blue-900 mb-2">Safety Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• All nurses are background verified and certified</li>
                <li>• Service includes proper safety equipment and hygiene protocols</li>
                <li>• Emergency support available 24/7</li>
                <li>• Service can be cancelled up to 2 hours before scheduled time</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}