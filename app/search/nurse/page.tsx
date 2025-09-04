'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { nursesData, type Nurse } from '@/lib/data'
import { 
  FaSearch, FaUserNurse, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, 
  FaBaby, FaStarHalfAlt, FaHome, FaLanguage, FaCheckCircle, FaInfoCircle, 
  FaHandHoldingHeart, FaMedkit, FaWheelchair, FaUserMd, FaPills, FaHeartbeat, 
  FaShieldAlt, FaPhone, FaEnvelope 
} from 'react-icons/fa'

// Service type icons mapping
const serviceIcons = {
  "Elderly Care": FaHandHoldingHeart,
  "Dementia Care": FaHandHoldingHeart,
  "Palliative Care": FaHandHoldingHeart,
  "Post-Surgery Care": FaMedkit,
  "Wound Care": FaMedkit,
  "Physical Therapy Support": FaWheelchair,
  "Child Care": FaBaby,
  "Infant Care": FaBaby,
  "Pediatric Emergency": FaBaby,
  "ICU Care": FaHeartbeat,
  "Ventilator Management": FaHeartbeat,
  "Cardiac Care": FaHeartbeat,
  "Mental Health": FaUserMd,
  "Psychiatric Care": FaUserMd,
  "Addiction Recovery": FaPills,
  "Critical Care": FaHeartbeat,
  "Emergency Response": FaShieldAlt,
  "Home Health": FaHome,
  "Chronic Disease Management": FaPills
}

// AI search simulation function using centralized data
const aiSearchNurses = (query: string, serviceType: string) => {
  return new Promise<Nurse[]>((resolve) => {
    setTimeout(() => {
      let results = [...nursesData]
      
      if (serviceType !== 'all') {
        results = results.filter(nurse => 
          nurse.specialization.some(s => s.toLowerCase().includes(serviceType.toLowerCase())) ||
          nurse.type.toLowerCase().includes(serviceType.toLowerCase())
        )
      }
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        results = results.filter(nurse => 
          nurse.firstName.toLowerCase().includes(lowerQuery) ||
          nurse.lastName.toLowerCase().includes(lowerQuery) ||
          nurse.specialization.some(s => s.toLowerCase().includes(lowerQuery)) ||
          nurse.type.toLowerCase().includes(lowerQuery) ||
          nurse.location.toLowerCase().includes(lowerQuery) ||
          nurse.bio.toLowerCase().includes(lowerQuery) ||
          nurse.services.some(s => s.toLowerCase().includes(lowerQuery)) ||
          nurse.certifications.some(c => c.toLowerCase().includes(lowerQuery))
        )
      }
      
      resolve(results)
    }, 1500)
  })
}

// Nurse Card Component
interface NurseProps {
  nurse: Nurse
}

const NurseCard = ({ nurse }: NurseProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-teal-100">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Image 
              src={nurse.profileImage} 
              alt={`${nurse.firstName} ${nurse.lastName}`}
              width={80} 
              height={80}
              className="rounded-full object-cover border-4 border-teal-100"
            />
            {nurse.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {nurse.firstName} {nurse.lastName}
            </h3>
            <p className="text-teal-600 font-medium mb-2">
              {nurse.specialization.join(', ')}
            </p>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(nurse.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {nurse.rating % 1 !== 0 && <FaStarHalfAlt className="text-sm" />}
              </div>
              <span className="text-sm font-medium text-gray-700">{nurse.rating}</span>
              <span className="text-sm text-gray-500">({nurse.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <FaLanguage className="text-teal-500 text-sm" />
              <span className="text-sm text-gray-600">{nurse.languages.join(', ')}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-teal-500 text-sm" />
              <span className="text-sm text-gray-700">{nurse.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {nurse.services.includes("Home Care") && (
            <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
              <FaHome />
              <span>Home Care</span>
            </div>
          )}
          {nurse.services.includes("ICU Home Care") && (
            <div className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
              <FaHeartbeat />
              <span>ICU Care</span>
            </div>
          )}
          {nurse.emergencyAvailable && (
            <div className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
              <FaShieldAlt />
              <span>Emergency</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-lg font-bold text-gray-900">Rs{nurse.hourlyRate}/hr</p>
            <p className="text-sm text-gray-500">{nurse.nextAvailable}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/search/nurse/${nurse.id}`}>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium">
                Details
              </button>
            </Link>
            <Link href={`/patient/home-nursing/book/${nurse.id}`}>
              <button className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-medium">
                Book
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-teal-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-teal-600 rounded-full animate-spin border-t-transparent"></div>
        <FaUserNurse className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-teal-600 text-2xl" />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">AI is finding the best nursing care professionals...</p>
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
      <FaUserNurse className="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No nursing professionals found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse all available nurses</p>
      <button 
        onClick={onClear}
        className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
      >
        View All Nurses
      </button>
    </div>
  )
}

// Main Component
export default function NursingCarePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [serviceType, setServiceType] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(nursesData) // FIXED: Use nursesData instead of mockNurses
  const [hasSearched, setHasSearched] = useState(false)
  const [searchExamples] = useState([
    "Need elderly care at home",
    "Post-surgery recovery nurse",
    "Baby care specialist",
    "Night shift nursing",
    "ICU care at home",
    "Emergency nurse available now"
  ])

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    const results = await aiSearchNurses(searchQuery, serviceType)
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setServiceType('all')
    setSearchResults(nursesData) // FIXED: Use nursesData instead of mockNurses
    setHasSearched(false)
  }

  const handleExampleClick = (example: string) => {
    setSearchQuery(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Professional Nursing Care</h1>
          <p className="text-xl text-teal-100">
            AI-powered search to connect you with qualified nursing professionals in Mauritius
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaShieldAlt className="text-yellow-300" />
              <span>24/7 Emergency Care</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaCheckCircle className="text-green-300" />
              <span>Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaHome className="text-blue-300" />
              <span>Home Care Available</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe the care you need (e.g., 'elderly care at home', 'post-surgery help', 'baby nurse')"
                  className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors text-lg"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {!hasSearched && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Try:</span>
                  {searchExamples.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExampleClick(example)}
                      className="text-sm bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-1 rounded-full transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-4">
                <select 
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="all">All Service Types</option>
                  <option value="elderly">Elderly Care</option>
                  <option value="post-surgery">Post-Surgery Care</option>
                  <option value="child">Child & Baby Care</option>
                  <option value="chronic">Chronic Disease Management</option>
                  <option value="critical">Critical Care</option>
                  <option value="mental">Mental Health</option>
                  <option value="rehabilitation">Rehabilitation</option>
                  <option value="emergency">Emergency Care</option>
                </select>
                
                <button 
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px] disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch />
                      AI Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center border border-teal-100">
            <FaUserNurse className="text-3xl text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{nursesData.length}+</p>
            <p className="text-sm text-gray-600">Verified Nurses</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-yellow-100">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-red-100">
            <FaShieldAlt className="text-3xl text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">24/7</p>
            <p className="text-sm text-gray-600">Emergency Care</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-purple-100">
            <FaHome className="text-3xl text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-600">Home Care</p>
          </div>
        </div>
        
        <div className="mt-12">
          {isSearching ? (
            <LoadingAnimation />
          ) : searchResults.length > 0 ? (
            <>
              {hasSearched && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{searchResults.length}</span> nursing professionals matching your criteria
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((nurse) => (
                  <NurseCard key={nurse.id} nurse={nurse} />
                ))}
              </div>
            </>
          ) : hasSearched ? (
            <EmptyState onClear={handleClearFilters} />
          ) : null}
        </div>
        
        {/* Professional Banner */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Are you a nursing professional?</h2>
          <p className="text-purple-100 mb-6">
            Join our platform and connect with patients who need your expertise. 
            Get matched with care opportunities using our AI-powered system.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              Join as Nurse →
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Services Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Nursing Care Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <FaHome className="text-4xl text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Home Care</h3>
              <p className="text-gray-600 text-sm">Professional nursing care in the comfort of your home, including medication management and health monitoring.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <FaHandHoldingHeart className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Elderly Care</h3>
              <p className="text-gray-600 text-sm">Specialized care for seniors including dementia support, mobility assistance, and companionship.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <FaBaby className="text-4xl text-pink-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pediatric Care</h3>
              <p className="text-gray-600 text-sm">Expert care for infants and children, including newborn care, vaccination support, and development monitoring.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <FaMedkit className="text-4xl text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Post-Surgery Care</h3>
              <p className="text-gray-600 text-sm">Recovery support including wound care, pain management, and rehabilitation assistance.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <FaHeartbeat className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Critical Care</h3>
              <p className="text-gray-600 text-sm">High-level care for complex medical conditions, including ventilator management and ICU-level support.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <FaWheelchair className="text-4xl text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rehabilitation</h3>
              <p className="text-gray-600 text-sm">Support for physical therapy, occupational therapy, and recovery from strokes or injuries.</p>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Our Patients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">The elderly care nurse we found through this platform has been amazing with my mother. Professional, caring, and always on time.</p>
              <p className="font-semibold text-gray-900">- Sarah L.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Post-surgery care at home made my recovery so much easier. The nurse was knowledgeable and helped me heal faster.</p>
              <p className="font-semibold text-gray-900">- Michael R.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Finding a pediatric nurse for our newborn was stress-free. The AI search understood exactly what we needed.</p>
              <p className="font-semibold text-gray-900">- Emma K.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}