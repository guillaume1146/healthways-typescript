'use client'

import { useState } from 'react'
import { FaSearch, FaAmbulance, FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaExclamationTriangle, FaHospital, FaFireExtinguisher,  FaHeartbeat, FaShieldAlt, FaCheckCircle, FaInfoCircle, FaBell, FaStarHalfAlt, FaEnvelope, FaIdCard, FaHelicopter,  FaTruck,  FaWifi } from 'react-icons/fa'

const mockEmergencyServices = [
  {
    id: 1,
    name: "MediRescue Ambulance Service",
    type: "Emergency Ambulance",
    category: "Medical Emergency",
    responseTime: "5-8 minutes",
    availability: "24/7",
    rating: 4.9,
    reviews: 467,
    location: "Port Louis",
    coverage: "Port Louis & Surrounding Areas",
    phone: "911",
    alternatePhone: "+230 5789 9911",
    email: "dispatch@medirescue.mu",
    services: ["Advanced Life Support", "Cardiac Emergency", "Trauma Care", "Patient Transport"],
    equipment: ["Ventilator", "Defibrillator", "Emergency Medications", "Trauma Kit"],
    certifications: ["ISO 9001", "Emergency Medical Service License", "Advanced Cardiac Life Support"],
    vehicleTypes: ["ALS Ambulance", "BLS Ambulance", "Critical Care Unit"],
    languages: ["English", "French", "Creole", "Hindi"],
    gpsTracking: true,
    verified: true,
    governmentApproved: true,
    bio: "Leading emergency medical service with state-of-the-art ambulances and highly trained paramedics",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MR&backgroundColor=ef4444"
  },
  {
    id: 2,
    name: "Rapid Response Fire & Rescue",
    type: "Fire Emergency",
    category: "Fire & Rescue",
    responseTime: "4-6 minutes",
    availability: "24/7",
    rating: 4.8,
    reviews: 234,
    location: "Curepipe",
    coverage: "Central Mauritius",
    phone: "995",
    alternatePhone: "+230 5789 9955",
    email: "alert@firerescue.mu",
    services: ["Fire Suppression", "Rescue Operations", "Hazmat Response", "Water Rescue"],
    equipment: ["Fire Engines", "Ladder Trucks", "Rescue Tools", "Breathing Apparatus"],
    certifications: ["National Fire Protection", "Hazmat Operations", "Technical Rescue"],
    vehicleTypes: ["Fire Engine", "Ladder Truck", "Rescue Vehicle", "Hazmat Unit"],
    languages: ["English", "French", "Creole"],
    gpsTracking: true,
    verified: true,
    governmentApproved: true,
    bio: "Professional fire and rescue service equipped for all types of emergencies including structural fires and technical rescues",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FR&backgroundColor=f97316"
  },
  {
    id: 3,
    name: "Emergency Medical Center",
    type: "Emergency Room",
    category: "Hospital Emergency",
    responseTime: "Immediate on arrival",
    availability: "24/7",
    rating: 4.7,
    reviews: 892,
    location: "Vacoas",
    coverage: "Walk-in & Ambulance",
    phone: "112",
    alternatePhone: "+230 5789 1122",
    email: "er@emergencycenter.mu",
    services: ["Trauma Care", "Cardiac Emergency", "Pediatric Emergency", "Surgical Emergency"],
    equipment: ["CT Scanner", "X-Ray", "Operating Theater", "ICU"],
    certifications: ["Level 1 Trauma Center", "Stroke Center", "Cardiac Care Certification"],
    vehicleTypes: ["Hospital-based"],
    languages: ["English", "French", "Creole", "Hindi", "Mandarin"],
    gpsTracking: false,
    verified: true,
    governmentApproved: true,
    bio: "Full-service emergency department with specialized trauma team and advanced diagnostic equipment",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=EM&backgroundColor=10b981"
  },
  {
    id: 4,
    name: "Coast Guard Emergency",
    type: "Maritime Rescue",
    category: "Water Emergency",
    responseTime: "10-15 minutes",
    availability: "24/7",
    rating: 4.8,
    reviews: 156,
    location: "Grand Baie",
    coverage: "Coastal Waters",
    phone: "999",
    alternatePhone: "+230 5789 9999",
    email: "rescue@coastguard.mu",
    services: ["Water Rescue", "Boat Emergency", "Diving Accidents", "Medical Evacuation"],
    equipment: ["Rescue Boats", "Diving Equipment", "Medical Supplies", "Helicopter Support"],
    certifications: ["Maritime Safety", "Swift Water Rescue", "Diving Medical Officer"],
    vehicleTypes: ["Patrol Boat", "Rescue Boat", "Jet Ski", "Helicopter"],
    languages: ["English", "French", "Creole"],
    gpsTracking: true,
    verified: true,
    governmentApproved: true,
    bio: "Specialized maritime emergency service for all water-related emergencies and coastal rescue operations",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=CG&backgroundColor=3b82f6"
  },
  {
    id: 5,
    name: "Air Ambulance Mauritius",
    type: "Air Medical Service",
    category: "Critical Care Transport",
    responseTime: "20-30 minutes",
    availability: "24/7",
    rating: 4.9,
    reviews: 89,
    location: "SSR International Airport",
    coverage: "Island-wide & International",
    phone: "988",
    alternatePhone: "+230 5789 9888",
    email: "flight@airambulance.mu",
    services: ["Critical Care Transport", "Inter-hospital Transfer", "International Repatriation", "Organ Transport"],
    equipment: ["ICU Equipment", "Ventilator", "ECMO", "Blood Products"],
    certifications: ["Aviation Medical", "Critical Care Transport", "International Air Ambulance"],
    vehicleTypes: ["Helicopter", "Fixed-wing Aircraft"],
    languages: ["English", "French"],
    gpsTracking: true,
    verified: true,
    governmentApproved: true,
    bio: "Specialized air medical transport for critical patients requiring rapid transport or international medical evacuation",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AA&backgroundColor=8b5cf6"
  },
  {
    id: 6,
    name: "Poison Control Center",
    type: "Toxicology Emergency",
    category: "Poison & Chemical",
    responseTime: "Immediate phone support",
    availability: "24/7",
    rating: 4.7,
    reviews: 234,
    location: "Port Louis",
    coverage: "Phone & On-site Support",
    phone: "977",
    alternatePhone: "+230 5789 9777",
    email: "poison@emergency.mu",
    services: ["Poison Identification", "Treatment Guidance", "Chemical Exposure", "Antidote Information"],
    equipment: ["Toxicology Database", "Antidotes", "Decontamination", "Lab Testing"],
    certifications: ["Clinical Toxicology", "Hazmat Response", "Medical Toxicology"],
    vehicleTypes: ["Mobile Response Unit"],
    languages: ["English", "French", "Creole", "Hindi"],
    gpsTracking: false,
    verified: true,
    governmentApproved: true,
    bio: "Specialized poison and chemical emergency service providing immediate telephone consultation and treatment guidance",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PC&backgroundColor=dc2626"
  },
  {
    id: 7,
    name: "Mental Health Crisis Team",
    type: "Psychiatric Emergency",
    category: "Mental Health",
    responseTime: "15-30 minutes",
    availability: "24/7",
    rating: 4.6,
    reviews: 178,
    location: "Quatre Bornes",
    coverage: "Island-wide",
    phone: "966",
    alternatePhone: "+230 5789 9666",
    email: "crisis@mentalhealth.mu",
    services: ["Crisis Intervention", "Suicide Prevention", "Psychiatric Assessment", "Emergency Counseling"],
    equipment: ["Mobile Crisis Unit", "Restraint Equipment", "Medications", "Assessment Tools"],
    certifications: ["Crisis Intervention", "Mental Health First Aid", "De-escalation Training"],
    vehicleTypes: ["Crisis Response Vehicle"],
    languages: ["English", "French", "Creole"],
    gpsTracking: false,
    verified: true,
    governmentApproved: true,
    bio: "Specialized mental health emergency team providing immediate intervention for psychiatric crises and emotional emergencies",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MH&backgroundColor=06b6d4"
  },
  {
    id: 8,
    name: "Disaster Response Unit",
    type: "Natural Disaster Response",
    category: "Disaster Management",
    responseTime: "30-60 minutes",
    availability: "24/7 On-Call",
    rating: 4.8,
    reviews: 123,
    location: "Rose Hill",
    coverage: "National Coverage",
    phone: "933",
    alternatePhone: "+230 5789 9333",
    email: "disaster@emergency.mu",
    services: ["Search & Rescue", "Evacuation", "Emergency Shelter", "Medical Support"],
    equipment: ["Heavy Machinery", "Emergency Supplies", "Communication Systems", "Temporary Shelters"],
    certifications: ["Disaster Management", "Urban Search & Rescue", "Emergency Management"],
    vehicleTypes: ["Command Vehicle", "Supply Trucks", "Rescue Equipment"],
    languages: ["English", "French", "Creole"],
    gpsTracking: true,
    verified: true,
    governmentApproved: true,
    bio: "National disaster response team equipped for cyclones, floods, and other natural disasters with comprehensive emergency management capabilities",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DR&backgroundColor=ea580c"
  }
]

import { IconType } from 'react-icons';

// Category icons mapping
const categoryIcons: { [key: string]: IconType } = {
  "Medical Emergency": FaAmbulance,
  "Fire & Rescue": FaFireExtinguisher,
  "Hospital Emergency": FaHospital,
  "Water Emergency": FaHelicopter,
  "Critical Care Transport": FaHelicopter,
  "Poison & Chemical": FaExclamationTriangle,
  "Mental Health": FaHeartbeat,
  "Disaster Management": FaTruck
};

// AI search simulation function
const aiSearchEmergency = (query: string, category: string): Promise<typeof mockEmergencyServices> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...mockEmergencyServices]
      
      if (category !== 'all') {
        results = results.filter(service => 
          service.category.toLowerCase().includes(category.toLowerCase()) ||
          service.type.toLowerCase().includes(category.toLowerCase())
        )
      }
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        results = results.filter(service => 
          service.name.toLowerCase().includes(lowerQuery) ||
          service.type.toLowerCase().includes(lowerQuery) ||
          service.category.toLowerCase().includes(lowerQuery) ||
          service.services.some(s => s.toLowerCase().includes(lowerQuery)) ||
          service.location.toLowerCase().includes(lowerQuery) ||
          service.bio.toLowerCase().includes(lowerQuery)
        )
      }
      
      resolve(results)
    }, 1500)
  })
}

// Emergency Service Card Component
interface ServiceProps {
  service: typeof mockEmergencyServices[0]
}

const EmergencyCard = ({ service }: ServiceProps) => {
  const CategoryIcon = categoryIcons[service.category] || FaAmbulance
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-red-100">
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 text-white text-center">
        <span className="text-sm font-semibold flex items-center justify-center gap-2">
          <FaBell className="animate-pulse" />
          {service.availability} Emergency Service
        </span>
      </div>
      <div className="p-6">
        {/* Header with Icon and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full border-4 border-red-100 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center"
              style={{ backgroundImage: `url(${service.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <CategoryIcon className="text-3xl text-red-500 opacity-0" />
            </div>
            {service.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            )}
            {service.governmentApproved && (
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                <FaShieldAlt className="text-white text-xs" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
            <p className="text-red-600 font-medium flex items-center gap-2">
              <CategoryIcon className="text-sm" />
              {service.type}
            </p>
            <p className="text-gray-600 text-sm">{service.category}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(service.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {service.rating % 1 !== 0 && <FaStarHalfAlt className="text-sm" />}
              </div>
              <span className="text-sm font-medium text-gray-700">{service.rating}</span>
              <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
            </div>
          </div>
        </div>
        
        {/* Emergency Response Time - Prominent Display */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-red-700">Response Time:</span>
            <span className="text-lg font-bold text-red-600 flex items-center gap-2">
              <FaClock className="animate-pulse" />
              {service.responseTime}
            </span>
          </div>
        </div>
        
        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.bio}</p>
        
        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.services.slice(0, 3).map((item, index) => (
            <span key={index} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
              {item}
            </span>
          ))}
        </div>
        
        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-red-500" />
            <span className="truncate">{service.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaShieldAlt className="text-red-500" />
            <span>{service.coverage}</span>
          </div>
          {service.gpsTracking && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaWifi className="text-green-500" />
              <span className="text-green-600 font-medium">GPS Tracking</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <FaIdCard className="text-red-500" />
            <span>{service.certifications.length} Certified</span>
          </div>
        </div>
        
        {/* Vehicle Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.vehicleTypes.slice(0, 3).map((vehicle, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
              <FaTruck className="text-xs" />
              {vehicle}
            </span>
          ))}
        </div>
        
        {/* Emergency Contact - Prominent */}
        <div className="bg-red-600 text-white rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90">Emergency Hotline</p>
              <p className="text-2xl font-bold">{service.phone}</p>
            </div>
            <a 
              href="patient/emergency/book/id"
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <FaPhone className="animate-pulse" />
              CALL NOW
            </a>
          </div>
        </div>
        
        {/* Secondary Contact */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaPhone className="text-xs" />
            <span>{service.alternatePhone}</span>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-all duration-200 font-medium flex items-center gap-1">
              <FaInfoCircle />
              Details
            </button>
            <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg transition-all duration-200 font-medium flex items-center gap-1">
              <FaEnvelope />
              Email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading Animation Component
const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-red-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-red-600 rounded-full animate-spin border-t-transparent"></div>
        <FaAmbulance className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 text-2xl animate-pulse" />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">AI is locating emergency services...</p>
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  )
}

// Empty State Component
interface EmptyStateProps {
  onClear: () => void
}

const EmptyState = ({ onClear }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <FaExclamationTriangle className="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No emergency services found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse all services</p>
      <button 
        onClick={onClear}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  )
}

// Main Component
export default function EmergencyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(mockEmergencyServices)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchExamples] = useState([
    "Need ambulance now",
    "Fire emergency",
    "Poison control",
    "Mental health crisis",
    "Water rescue",
    "Air ambulance"
  ])

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    
    const results = await aiSearchEmergency(searchQuery, category)
    
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCategory('all')
    setSearchResults(mockEmergencyServices)
    setHasSearched(false)
  }

  const handleExampleClick = (example: string) => {
    setSearchQuery(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      
      {/* Emergency Numbers Banner */}
      <div className="bg-red-900 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <FaAmbulance /> Ambulance: <strong>911</strong>
            </span>
            <span className="flex items-center gap-2">
              <FaFireExtinguisher /> Fire: <strong>995</strong>
            </span>
            <span className="flex items-center gap-2">
              <FaShieldAlt /> Police: <strong>999</strong>
            </span>
            <span className="flex items-center gap-2">
              <FaHospital /> Hospital: <strong>112</strong>
            </span>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <FaExclamationTriangle className="animate-pulse" />
            Emergency Services Directory
          </h1>
          <p className="text-xl text-red-100">
            AI-powered search to quickly connect you with emergency services in Mauritius
          </p>
          <div className="mt-6 bg-yellow-400 text-red-900 p-4 rounded-lg font-semibold">
            <FaBell className="inline mr-2 animate-pulse" />
            For life-threatening emergencies, always call 911 immediately
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 opacity-10">
          <FaAmbulance className="text-[200px] transform rotate-12" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="max-w-4xl mx-auto -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-red-200">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe your emergency or search for services (e.g., 'chest pain', 'fire', 'poison')"
                  className="w-full px-5 py-4 pr-12 border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors text-lg"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400" />
              </div>
              
              {/* Example Searches */}
              {!hasSearched && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Quick search:</span>
                  {searchExamples.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExampleClick(example)}
                      className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded-full transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-4">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                >
                  <option value="all">All Emergency Services</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="fire">Fire & Rescue</option>
                  <option value="water">Water Emergency</option>
                  <option value="poison">Poison Control</option>
                  <option value="mental">Mental Health Crisis</option>
                  <option value="disaster">Natural Disaster</option>
                </select>
                
                <button 
                  type="button"
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px] shadow-lg"
                >
                  <FaSearch />
                  Find Service
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="mt-12">
          {isSearching ? (
            <LoadingAnimation />
          ) : searchResults.length > 0 ? (
            <>
              {hasSearched && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{searchResults.length}</span> emergency services
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((service) => (
                  <EmergencyCard key={service.id} service={service} />
                ))}
              </div>
            </>
          ) : hasSearched ? (
            <EmptyState onClear={handleClearFilters} />
          ) : null}
        </div>
        
        {/* Emergency Categories Grid */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Emergency Service Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-red-100">
              <FaAmbulance className="text-4xl text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Medical Emergency</h3>
              <p className="text-gray-600 text-sm mb-3">Ambulance services for medical emergencies and patient transport</p>
              <p className="text-red-600 font-bold">Call: 911</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-orange-100">
              <FaFireExtinguisher className="text-4xl text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fire & Rescue</h3>
              <p className="text-gray-600 text-sm mb-3">Fire suppression, rescue operations, and hazmat response</p>
              <p className="text-red-600 font-bold">Call: 995</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-blue-100">
              <FaShieldAlt className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Police Emergency</h3>
              <p className="text-gray-600 text-sm mb-3">Law enforcement for crime, accidents, and public safety</p>
              <p className="text-red-600 font-bold">Call: 999</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-green-100">
              <FaHospital className="text-4xl text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Hospital ER</h3>
              <p className="text-gray-600 text-sm mb-3">Emergency rooms for immediate medical treatment</p>
              <p className="text-red-600 font-bold">Call: 112</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-purple-100">
              <FaHelicopter className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Air Ambulance</h3>
              <p className="text-gray-600 text-sm mb-3">Helicopter and air medical transport for critical cases</p>
              <p className="text-red-600 font-bold">Call: 988</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-yellow-100">
              <FaExclamationTriangle className="text-4xl text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Poison Control</h3>
              <p className="text-gray-600 text-sm mb-3">Immediate help for poisoning and chemical exposure</p>
              <p className="text-red-600 font-bold">Call: 977</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-cyan-100">
              <FaHeartbeat className="text-4xl text-cyan-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mental Health Crisis</h3>
              <p className="text-gray-600 text-sm mb-3">Crisis intervention and psychiatric emergency support</p>
              <p className="text-red-600 font-bold">Call: 966</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-gray-100">
              <FaTruck className="text-4xl text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Disaster Response</h3>
              <p className="text-gray-600 text-sm mb-3">Emergency management for natural disasters</p>
              <p className="text-red-600 font-bold">Call: 933</p>
            </div>
          </div>
        </div>
        
        {/* Emergency Preparedness Tips */}
        <div className="mt-16 bg-yellow-50 rounded-2xl p-8 border-2 border-yellow-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-600" />
            Emergency Preparedness Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Keep Emergency Numbers Visible</h3>
                <p className="text-sm text-gray-600">Post emergency numbers near all phones and save them in your mobile</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Know Your Location</h3>
                <p className="text-sm text-gray-600">Be able to provide your exact address and nearby landmarks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Stay Calm</h3>
                <p className="text-sm text-gray-600">Speak clearly and answer all questions from emergency operators</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">First Aid Kit</h3>
                <p className="text-sm text-gray-600">Keep a well-stocked first aid kit at home and in your vehicle</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Medical Information</h3>
                <p className="text-sm text-gray-600">Keep a list of medications, allergies, and medical conditions handy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Emergency Plan</h3>
                <p className="text-sm text-gray-600">Have a family emergency plan and practice it regularly</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* When to Call Emergency Services */}
        <div className="mt-16 bg-red-50 rounded-2xl p-8 border-2 border-red-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">When to Call Emergency Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <FaAmbulance />
                Medical Emergency (911)
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Chest pain or difficulty breathing</li>
                <li>• Unconsciousness or confusion</li>
                <li>• Severe bleeding</li>
                <li>• Signs of stroke</li>
                <li>• Serious injuries</li>
                <li>• Allergic reactions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                <FaFireExtinguisher />
                Fire Emergency (995)
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Building fires</li>
                <li>• Vehicle fires</li>
                <li>• Gas leaks</li>
                <li>• Chemical spills</li>
                <li>• Trapped persons</li>
                <li>• Smoke alarms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <FaShieldAlt />
                Police Emergency (999)
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Crime in progress</li>
                <li>• Violence or threats</li>
                <li>• Traffic accidents</li>
                <li>• Suspicious activity</li>
                <li>• Missing persons</li>
                <li>• Public safety threats</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Important Notice */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaBell className="animate-pulse" />
            Important Emergency Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">When Calling Emergency Services:</h3>
              <ul className="space-y-2 text-red-100">
                <li>✓ Stay calm and speak clearly</li>
                <li>✓ State your emergency</li>
                <li>✓ Give your exact location</li>
                <li>✓ Answer all questions</li>
                <li>✓ Follow instructions</li>
                <li>✓ Do not hang up unless told</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Emergency App Features:</h3>
              <ul className="space-y-2 text-red-100">
                <li>✓ GPS location sharing</li>
                <li>✓ Real-time tracking</li>
                <li>✓ Direct emergency calls</li>
                <li>✓ Service availability status</li>
                <li>✓ Response time estimates</li>
                <li>✓ Multi-language support</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-center font-semibold">
              This directory is for information purposes. In a real emergency, always call the appropriate emergency number directly.
            </p>
          </div>
        </div>
        
        {/* Download App CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Prepared with Our Mobile App</h2>
          <p className="text-gray-600 mb-6">Get instant access to emergency services with GPS tracking and one-tap calling</p>
          <div className="flex justify-center gap-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Download for iOS
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Download for Android
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}