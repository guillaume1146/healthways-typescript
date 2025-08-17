// app/patient/nanny-booking/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  FaArrowLeft,
  FaStar,
  FaLanguage,
  FaGraduationCap,
  FaShieldAlt,
  FaCertificate,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaUserCheck
} from "react-icons/fa"

interface NannyProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  experience: string;
  rating: number;
  reviews: number;
  specializations: string[];
  languages: string[];
  education: string;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  availability: string[];
  verified: boolean;
  backgroundCheck: boolean;
  bio: string;
  certifications: string[];
  skills: string[];
  preferredAgeGroup: string[];
}

interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: string;
  priceType: "hourly" | "daily" | "monthly";
}

interface BookingDetails {
  nanny: NannyProfile | null;
  serviceType: ServiceType | null;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  duration: "hourly" | "daily" | "weekly" | "monthly";
  numberOfChildren: number;
  childrenAges: number[];
  address: string;
  specialRequirements: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  totalAmount: number;
}

interface Review {
  id: string;
  parentName: string;
  rating: number;
  comment: string;
  date: string;
}

const mockNannies: NannyProfile[] = [
  {
    id: "NN001",
    name: "Sarah Williams",
    avatar: "👩",
    age: 28,
    experience: "5+ years",
    rating: 4.9,
    reviews: 87,
    specializations: ["Infant Care", "Toddler Care", "Special Needs"],
    languages: ["English", "French", "Creole"],
    education: "Early Childhood Education Diploma",
    hourlyRate: 300,
    dailyRate: 2000,
    monthlyRate: 35000,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    verified: true,
    backgroundCheck: true,
    bio: "Passionate childcare professional with extensive experience in infant and toddler care. Certified in first aid and child development.",
    certifications: ["First Aid", "CPR", "Child Development"],
    skills: ["Meal Preparation", "Educational Activities", "Sleep Training"],
    preferredAgeGroup: ["0-1 year", "1-3 years"]
  },
  {
    id: "NN002",
    name: "Marie Joseph",
    avatar: "👩",
    age: 35,
    experience: "10+ years",
    rating: 4.8,
    reviews: 156,
    specializations: ["Multiple Children", "Homework Help", "Household Management"],
    languages: ["English", "Creole", "Hindi"],
    education: "Bachelor in Child Psychology",
    hourlyRate: 350,
    dailyRate: 2500,
    monthlyRate: 40000,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    verified: true,
    backgroundCheck: true,
    bio: "Experienced nanny specializing in caring for multiple children. Expert in child psychology and educational development.",
    certifications: ["Child Psychology", "Montessori Training", "First Aid"],
    skills: ["Tutoring", "Behavior Management", "Creative Play"],
    preferredAgeGroup: ["3-6 years", "6-10 years"]
  },
  {
    id: "NN003",
    name: "Lisa Chen",
    avatar: "👩",
    age: 26,
    experience: "3+ years",
    rating: 4.7,
    reviews: 42,
    specializations: ["Newborn Care", "Night Nanny", "Sleep Training"],
    languages: ["English", "Mandarin", "French"],
    education: "Nursing Assistant Certificate",
    hourlyRate: 400,
    dailyRate: 3000,
    monthlyRate: 45000,
    availability: ["Mon", "Wed", "Fri", "Sat", "Sun"],
    verified: true,
    backgroundCheck: true,
    bio: "Specialized newborn care nanny with nursing background. Expert in establishing sleep routines and infant care.",
    certifications: ["Newborn Care Specialist", "Lactation Support", "CPR"],
    skills: ["Newborn Care", "Breastfeeding Support", "Sleep Routines"],
    preferredAgeGroup: ["0-6 months", "6-12 months"]
  }
]

const mockServiceTypes: ServiceType[] = [
  {
    id: "ST001",
    name: "Regular Childcare",
    description: "Daily childcare during working hours",
    icon: "👶",
    priceType: "daily"
  },
  {
    id: "ST002",
    name: "Night Nanny",
    description: "Overnight childcare support",
    icon: "🌙",
    priceType: "hourly"
  },
  {
    id: "ST003",
    name: "Weekend Care",
    description: "Weekend babysitting services",
    icon: "📅",
    priceType: "hourly"
  },
  {
    id: "ST004",
    name: "Full-Time Nanny",
    description: "Full-time live-in or live-out nanny",
    icon: "🏠",
    priceType: "monthly"
  },
  {
    id: "ST005",
    name: "Emergency Care",
    description: "Last-minute childcare services",
    icon: "🚨",
    priceType: "hourly"
  },
  {
    id: "ST006",
    name: "Special Needs Care",
    description: "Specialized care for children with special needs",
    icon: "💝",
    priceType: "hourly"
  }
]

const mockReviews: Review[] = [
  {
    id: "R001",
    parentName: "Jennifer M.",
    rating: 5,
    comment: "Sarah has been amazing with our 6-month-old. She is professional, caring, and very knowledgeable about infant care.",
    date: "2024-01-10"
  },
  {
    id: "R002",
    parentName: "Michael R.",
    rating: 5,
    comment: "Marie helped us manage our three kids wonderfully. She kept them engaged with educational activities all day.",
    date: "2024-01-05"
  }
]

export default function NannyBookingPage() {
  // const [activeTab, setActiveTab] = useState<"search" | "favorites" | "bookings">("search")
  const [selectedNanny, setSelectedNanny] = useState<NannyProfile | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAgeGroup, setFilterAgeGroup] = useState("all")
  // const [filterAvailability, setFilterAvailability] = useState("all")
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showNannyDetails, setShowNannyDetails] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    nanny: null,
    serviceType: null,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    duration: "daily",
    numberOfChildren: 1,
    childrenAges: [0],
    address: "",
    specialRequirements: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    totalAmount: 0
  })

  const ageGroups = ["all", "0-1 year", "1-3 years", "3-6 years", "6-10 years", "10+ years"]

  const filteredNannies = mockNannies.filter(nanny => {
    const matchesSearch = nanny.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nanny.bio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAge = filterAgeGroup === "all" || nanny.preferredAgeGroup.includes(filterAgeGroup)
    return matchesSearch && matchesAge
  })

  const handleSelectNanny = (nanny: NannyProfile) => {
    setSelectedNanny(nanny)
    setShowNannyDetails(true)
  }

  const handleBookNanny = () => {
    if (selectedNanny && selectedService) {
      setBookingDetails({
        ...bookingDetails,
        nanny: selectedNanny,
        serviceType: selectedService
      })
      setShowBookingForm(true)
      setShowNannyDetails(false)
    }
  }

  const calculateTotal = () => {
    if (!selectedNanny || !selectedService) return 0
    
    switch (selectedService.priceType) {
      case "hourly":
        return selectedNanny.hourlyRate * 8 // Assuming 8 hours
      case "daily":
        return selectedNanny.dailyRate
      case "monthly":
        return selectedNanny.monthlyRate
      default:
        return 0
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
                <h1 className="text-2xl font-bold text-gray-900">Nanny Services</h1>
                <p className="text-gray-600">Find trusted nannies for your children</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!showBookingForm ? (
          <>
            {/* Service Types */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">What type of care do you need?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {mockServiceTypes.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 bg-white rounded-lg shadow-lg text-center hover:shadow-xl transition ${
                      selectedService?.id === service.id ? "border-2 border-primary-blue" : ""
                    }`}
                  >
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <p className="text-sm font-medium">{service.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search nannies by name or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:border-primary-blue"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={filterAgeGroup}
                  onChange={(e) => setFilterAgeGroup(e.target.value)}
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                >
                  <option value="all">All Age Groups</option>
                  {ageGroups.slice(1).map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <FaFilter />
                  More Filters
                </button>
              </div>
            </div>

            {/* Nanny Profiles */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNannies.map((nanny) => (
                <div key={nanny.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{nanny.avatar}</div>
                        <div>
                          <h3 className="font-semibold text-lg">{nanny.name}</h3>
                          <p className="text-gray-600 text-sm">{nanny.age} years • {nanny.experience}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <FaStar className="text-yellow-500" />
                          <span className="font-semibold">{nanny.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">({nanny.reviews} reviews)</p>
                      </div>
                    </div>

                    {/* Verification Badges */}
                    <div className="flex gap-2 mb-3">
                      {nanny.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                          <FaShieldAlt />
                          Verified
                        </span>
                      )}
                      {nanny.backgroundCheck && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                          <FaUserCheck />
                          Background Check
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{nanny.bio}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {nanny.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <FaLanguage />
                      <span>{nanny.languages.join(", ")}</span>
                    </div>

                    {/* Pricing */}
                    <div className="border-t pt-3 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hourly</span>
                        <span className="font-semibold">Rs {nanny.hourlyRate}/hr</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Daily</span>
                        <span className="font-semibold">Rs {nanny.dailyRate}/day</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectNanny(nanny)}
                      className="w-full btn-gradient py-2"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Booking Form */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6">Complete Your Booking</h2>
              
              {/* Selected Nanny and Service */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedNanny?.avatar}</div>
                    <div>
                      <p className="font-semibold">{selectedNanny?.name}</p>
                      <p className="text-sm text-gray-600">{selectedService?.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-primary-blue hover:underline text-sm"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Booking Dates */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={bookingDetails.startDate}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, startDate: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={bookingDetails.endDate}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, endDate: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    value={bookingDetails.startTime}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, startTime: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    value={bookingDetails.endTime}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, endTime: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  />
                </div>
              </div>

              {/* Children Information */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Children Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Number of Children</label>
                    <input
                      type="number"
                      min="1"
                      value={bookingDetails.numberOfChildren}
                      onChange={(e) => setBookingDetails({ 
                        ...bookingDetails, 
                        numberOfChildren: parseInt(e.target.value),
                        childrenAges: new Array(parseInt(e.target.value)).fill(0)
                      })}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Ages</label>
                    <input
                      type="text"
                      placeholder="e.g., 2, 5, 8"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                    />
                  </div>
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
                  placeholder="Enter your complete address"
                />
              </div>

              {/* Emergency Contact */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Emergency Contact</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={bookingDetails.emergencyContact.name}
                      onChange={(e) => setBookingDetails({
                        ...bookingDetails,
                        emergencyContact: { ...bookingDetails.emergencyContact, name: e.target.value }
                      })}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={bookingDetails.emergencyContact.phone}
                      onChange={(e) => setBookingDetails({
                        ...bookingDetails,
                        emergencyContact: { ...bookingDetails.emergencyContact, phone: e.target.value }
                      })}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Relationship</label>
                    <input
                      type="text"
                      value={bookingDetails.emergencyContact.relationship}
                      onChange={(e) => setBookingDetails({
                        ...bookingDetails,
                        emergencyContact: { ...bookingDetails.emergencyContact, relationship: e.target.value }
                      })}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Special Requirements (Optional)</label>
                <textarea
                  value={bookingDetails.specialRequirements}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, specialRequirements: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                  placeholder="Any allergies, medical conditions, or special instructions..."
                />
              </div>

              {/* Total Amount */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Estimated Total</span>
                  <span className="text-2xl font-bold text-primary-blue">Rs {calculateTotal()}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">Final amount will be calculated based on actual hours</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button className="flex-1 btn-gradient py-3">
                  Confirm Booking
                </button>
              </div>
            </div>

            {/* Safety Guidelines */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <FaShieldAlt className="text-green-500 mb-2" />
              <h4 className="font-semibold text-green-900 mb-2">Safety & Trust</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• All nannies undergo thorough background checks</li>
                <li>• Regular training on child safety and first aid</li>
                <li>• 24/7 support available for any concerns</li>
                <li>• Insurance coverage for all bookings</li>
              </ul>
            </div>
          </div>
        )}

        {/* Nanny Details Modal */}
        {showNannyDetails && selectedNanny && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedNanny.avatar}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedNanny.name}</h2>
                    <p className="text-gray-600">{selectedNanny.age} years • {selectedNanny.experience}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNannyDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Profile Content */}
              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-600">{selectedNanny.bio}</p>
                </div>

                {/* Qualifications */}
                <div>
                  <h3 className="font-semibold mb-2">Qualifications</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      <FaGraduationCap className="inline mr-1" />
                      {selectedNanny.education}
                    </span>
                    {selectedNanny.certifications.map((cert, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        <FaCertificate className="inline mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h3 className="font-semibold mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNanny.specializations.map((spec, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedNanny.skills.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold mb-2">Availability</h3>
                  <div className="flex gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <span
                        key={day}
                        className={`px-3 py-1 rounded ${
                          selectedNanny.availability.includes(day)
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <h3 className="font-semibold mb-2">Recent Reviews</h3>
                  <div className="space-y-3">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="border-b pb-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{review.parentName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                        <p className="text-gray-500 text-xs mt-1">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowNannyDetails(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleBookNanny}
                    className="flex-1 btn-gradient py-3"
                    disabled={!selectedService}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}