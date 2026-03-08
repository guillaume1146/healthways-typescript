'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaSearch, FaAmbulance, FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaExclamationTriangle, FaHospital, FaFireExtinguisher, FaHeartbeat, FaShieldAlt, FaCheckCircle, FaInfoCircle, FaBell, FaStarHalfAlt, FaEnvelope, FaIdCard, FaHelicopter, FaTruck, FaWifi, FaPhoneAlt } from 'react-icons/fa'

import { IconType } from 'react-icons'
import AuthBookingLink from '@/components/booking/AuthBookingLink'
import ConnectButton from '@/components/search/ConnectButton'
import MessageButton from '@/components/search/MessageButton'
import CallButton from '@/components/search/CallButton'

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
}

// Emergency Service interface (mapped from API response)
interface EmergencyService {
  id: string
  name: string
  type: string
  category: string
  responseTime: string
  availability: string
  rating: number
  reviews: number
  location: string
  coverage: string
  phone: string
  alternatePhone: string
  email: string
  services: string[]
  equipment: string[]
  certifications: string[]
  vehicleTypes: string[]
  languages: string[]
  gpsTracking: boolean
  verified: boolean
  governmentApproved: boolean
  bio: string
  avatar: string
}

// Emergency Service Card Component
const EmergencyCard = ({ service }: { service: EmergencyService }) => {
  const CategoryIcon = categoryIcons[service.category] || FaAmbulance

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-blue-100">
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-2 text-white text-center">
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
              className="w-20 h-20 rounded-full border-4 border-blue-100 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center"
              style={{ backgroundImage: `url(${service.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <CategoryIcon className="text-3xl text-blue-500 opacity-0" />
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
            <p className="text-blue-600 font-medium flex items-center gap-2">
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

        {/* Emergency Response Time */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-700">Response Time:</span>
            <span className="text-lg font-bold text-blue-600 flex items-center gap-2">
              <FaClock className="animate-pulse" />
              {service.responseTime}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.bio}</p>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.services.slice(0, 3).map((item: string, index: number) => (
            <span key={index} className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full">
              {item}
            </span>
          ))}
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-blue-500" />
            <span className="truncate">{service.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaShieldAlt className="text-blue-500" />
            <span>{service.coverage}</span>
          </div>
          {service.gpsTracking && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaWifi className="text-green-500" />
              <span className="text-green-600 font-medium">GPS Tracking</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <FaIdCard className="text-blue-500" />
            <span>{service.certifications.length} Certified</span>
          </div>
        </div>

        {/* Vehicle Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.vehicleTypes.slice(0, 3).map((vehicle: string, index: number) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
              <FaTruck className="text-xs" />
              {vehicle}
            </span>
          ))}
        </div>

        {/* Emergency Contact Info */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90">Emergency Hotline</p>
              <a href={`tel:${service.phone}`} className="text-2xl font-bold hover:underline">{service.phone}</a>
            </div>
            {service.alternatePhone && (
              <div className="text-right">
                <p className="text-xs opacity-90">Alternate</p>
                <a href={`tel:${service.alternatePhone}`} className="text-sm font-medium hover:underline">{service.alternatePhone}</a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons — Call, Book Service, Message, Connect */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <CallButton providerId={service.id} className="w-full justify-center" />
          <AuthBookingLink
            type="emergency"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors w-full"
          >
            <FaAmbulance className="w-4 h-4" />
            Book Service
          </AuthBookingLink>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MessageButton providerId={service.id} className="w-full justify-center" />
          <ConnectButton providerId={service.id} className="w-full justify-center" />
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
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        <FaAmbulance className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 text-2xl animate-pulse" />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">Locating emergency services...</p>
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  )
}

// Empty State Component
const EmptyState = ({ onClear }: { onClear: () => void }) => {
  return (
    <div className="text-center py-12">
      <FaExclamationTriangle className="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No emergency services found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse all services</p>
      <button
        onClick={onClear}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  )
}

// Booking status filter tabs
const STATUS_FILTERS = [
  { value: 'all', label: 'All Services' },
  { value: 'pending', label: 'Pending' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'on-scene', label: 'On Scene' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

// Main Component
export default function EmergencyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [allServices, setAllServices] = useState<EmergencyService[]>([])
  const [searchResults, setSearchResults] = useState<EmergencyService[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchExamples] = useState([
    "Need ambulance now",
    "Fire emergency",
    "Poison control",
    "Mental health crisis",
    "Water rescue",
    "Air ambulance"
  ])

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/search/emergency')
      if (!res.ok) throw new Error('Failed to fetch emergency services')
      const json = await res.json()
      interface ApiEmergencyService {
        id: string
        worker?: { name?: string; phone?: string; certifications?: string[]; vehicleType?: string; verified?: boolean; profileImage?: string }
        serviceName?: string
        serviceType?: string
        responseTime?: string
        available24h?: boolean
        coverageArea?: string
        contactNumber?: string
        specializations?: string[]
        description?: string
      }
      const mapped = ((json.data || json) as ApiEmergencyService[]).map((s: ApiEmergencyService) => ({
        id: s.id,
        name: s.worker?.name || s.serviceName || 'Emergency Service',
        type: s.serviceType || 'Emergency Service',
        category: s.serviceType || 'Medical Emergency',
        responseTime: s.responseTime || 'N/A',
        availability: s.available24h ? '24/7' : 'Limited Hours',
        rating: 4.7,
        reviews: Math.floor(Math.random() * 400) + 50,
        location: s.coverageArea || 'Mauritius',
        coverage: s.coverageArea || 'Local Area',
        phone: s.contactNumber || '114',
        alternatePhone: s.worker?.phone || '',
        email: '',
        services: s.specializations || [],
        equipment: [],
        certifications: s.worker?.certifications || [],
        vehicleTypes: s.worker?.vehicleType ? [s.worker.vehicleType] : [],
        languages: ['English', 'French', 'Creole'],
        gpsTracking: true,
        verified: s.worker?.verified || false,
        governmentApproved: s.worker?.verified || false,
        bio: s.description || '',
        avatar: s.worker?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.serviceName || 'ES')}&backgroundColor=3b82f6`
      }))
      setAllServices(mapped)
      setSearchResults(mapped)
    } catch (err) {
      console.error('Error fetching emergency services:', err)
      setAllServices([])
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)

    let results = [...allServices]

    if (category !== 'all') {
      results = results.filter(service =>
        service.category.toLowerCase().includes(category.toLowerCase()) ||
        service.type.toLowerCase().includes(category.toLowerCase())
      )
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      results = results.filter(service =>
        service.name.toLowerCase().includes(lowerQuery) ||
        service.type.toLowerCase().includes(lowerQuery) ||
        service.category.toLowerCase().includes(lowerQuery) ||
        (service.services || []).some((s: string) => s.toLowerCase().includes(lowerQuery)) ||
        service.location.toLowerCase().includes(lowerQuery) ||
        service.bio.toLowerCase().includes(lowerQuery)
      )
    }

    setSearchResults(results)
    setIsSearching(false)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCategory('all')
    setStatusFilter('all')
    setSearchResults(allServices)
    setHasSearched(false)
  }

  const handleExampleClick = (example: string) => {
    setSearchQuery(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Emergency Numbers Banner */}
      <div className="bg-blue-900 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <span className="text-blue-200 font-medium">Real Emergency? Call:</span>
            <a href="tel:114" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
              <FaAmbulance /> SAMU: <strong>114</strong>
            </a>
            <a href="tel:115" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
              <FaFireExtinguisher /> Fire: <strong>115</strong>
            </a>
            <a href="tel:999" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
              <FaShieldAlt /> Police: <strong>999</strong>
            </a>
            <a href="tel:112" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
              <FaHospital /> Hospital: <strong>112</strong>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-4 border-2 border-blue-200">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emergency services (e.g., 'ambulance', 'fire rescue', 'medical transport')"
                  className="w-full px-4 py-3 pr-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-base"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
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
                      className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full transition-colors"
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
                  className="flex-1 px-4 py-2.5 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
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
                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-2.5 rounded-xl hover:from-blue-700 hover:to-teal-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px] shadow-lg"
                >
                  <FaSearch />
                  Find Service
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === filter.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {isLoading || isSearching ? (
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
                    className="text-blue-600 hover:text-blue-700 font-medium"
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

        {/* Disclaimer */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            <strong>Note:</strong> This is a booking platform for emergency services. In a life-threatening emergency, always call{' '}
            <a href="tel:114" className="text-blue-600 font-semibold hover:underline">114</a> (SAMU),{' '}
            <a href="tel:115" className="text-blue-600 font-semibold hover:underline">115</a> (Fire), or{' '}
            <a href="tel:999" className="text-blue-600 font-semibold hover:underline">999</a> (Police) directly.
          </p>
        </div>
      </div>
    </div>
  )
}
