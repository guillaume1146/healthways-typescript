'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { nursesData, type Nurse } from '@/lib/data'
import { 
  FaSearch, FaUserNurse, FaStar, FaMapMarkerAlt, FaClock,  FaShieldAlt,
  FaVideo, FaHome, FaLanguage, FaCheckCircle, FaExclamationCircle,
} from 'react-icons/fa'

// AI search simulation function using centralized data
const aiSearchNurses = (query: string, specialization: string) => {
  return new Promise<Nurse[]>((resolve) => {
    setTimeout(() => {
      let results = [...nursesData]
      
      if (specialization !== 'all') {
        results = results.filter(nurse => 
          nurse.specialization.some(s => s.toLowerCase().includes(specialization.toLowerCase()))
        )
      }
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        results = results.filter(nurse => 
          nurse.firstName.toLowerCase().includes(lowerQuery) ||
          nurse.lastName.toLowerCase().includes(lowerQuery) ||
          nurse.specialization.some(s => s.toLowerCase().includes(lowerQuery)) ||
          nurse.location.toLowerCase().includes(lowerQuery) ||
          nurse.bio.toLowerCase().includes(lowerQuery) ||
          nurse.education.some(e => e.toLowerCase().includes(lowerQuery))
        )
      }
      
      resolve(results)
    }, 1500)
  })
}

interface NurseProps {
  nurse: Nurse
}

const NurseCard = ({ nurse }: NurseProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        {/* Nurse Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Image 
              src={nurse.profileImage} 
              alt={`${nurse.firstName} ${nurse.lastName}`}
              width={80} 
              height={80}
              className="rounded-full object-cover border-4 border-blue-100"
            />
            {nurse.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                <FaCheckCircle className="text-xs" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {nurse.firstName} {nurse.lastName}
            </h3>
            <p className="text-blue-600 font-medium mb-2">
              {nurse.specialization.join(', ')}
            </p>
            
            {/* Type Badge */}
            <div className="mb-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                nurse.type === 'Registered Nurse' 
                  ? 'bg-purple-100 text-purple-700' 
                  : nurse.type === 'Licensed Practical Nurse'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {nurse.type}
              </span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(nurse.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {nurse.rating % 1 !== 0 && <FaStar className="text-sm opacity-50" />}
              </div>
              <span className="text-sm font-semibold text-gray-700">{nurse.rating}</span>
              <span className="text-sm text-gray-500">({nurse.reviews} reviews)</span>
            </div>

            {/* Languages */}
            <div className="flex items-center gap-2 mb-2">
              <FaLanguage className="text-blue-500 text-sm" />
              <span className="text-sm text-gray-600">{nurse.languages.slice(0, 2).join(', ')}</span>
              {nurse.languages.length > 2 && <span className="text-sm text-gray-400">+{nurse.languages.length - 2}</span>}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500 text-sm" />
              <span className="text-sm text-gray-700">{nurse.location}</span>
            </div>
          </div>
        </div>

        {/* Service Types - Bigger Display */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {nurse.consultationTypes.includes("In-Person") && (
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaHome className="text-green-600" />
                <span className="text-green-700 font-medium text-sm">In-Person</span>
              </div>
            )}
            {nurse.consultationTypes.includes("Video Consultation") && (
              <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <FaVideo className="text-purple-600" />
                <span className="text-purple-700 font-medium text-sm">Video Call</span>
              </div>
            )}
            {nurse.consultationTypes.includes("Home Visit") && (
              <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <FaHome className="text-blue-600" />
                <span className="text-blue-700 font-medium text-sm">Home Visit</span>
              </div>
            )}
          </div>
          
          {/* Emergency Available - Fixed height container */}
          <div className="mt-2 h-10 flex items-center">
            {nurse.emergencyAvailable && (
              <div className="w-full flex items-center justify-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <FaExclamationCircle className="text-red-600" />
                <span className="text-red-700 font-medium text-sm">Emergency Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Next Availability */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <FaClock className="text-blue-600" />
            <div>
              <p className="text-xs text-blue-600 font-medium">Next Available</p>
              <p className="text-sm font-semibold text-blue-800">{nurse.nextAvailable}</p>
            </div>
          </div>
        </div>

        {/* Spacer to push pricing/actions to bottom */}
        <div className="flex-1"></div>

        {/* Pricing & Actions - Fixed at bottom */}
        <div className="mt-auto">
          {/* Pricing */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Hourly Rate:</span>
              <span className="text-lg font-bold text-green-600">Rs {nurse.hourlyRate}/hr</span>
            </div>
            {nurse.videoConsultationRate > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Video Rate:</span>
                <span className="text-lg font-bold text-green-600">Rs {nurse.videoConsultationRate}/hr</span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Link href={`/search/nurses/${nurse.id}`} className="flex-1">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Details
              </button>
            </Link>
            <Link href={`/booking/nurses/${nurse.id}`} className="flex-1">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Book
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const LoadingAnimation = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Finding the best nurses for you...</span>
  </div>
)

const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="text-center py-12">
    <FaUserNurse className="text-6xl text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No nurses found</h3>
    <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all available nurses</p>
    <button 
      onClick={onClear}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      View All Nurses
    </button>
  </div>
)

export default function NursesSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [specialization, setSpecialization] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(nursesData)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchExamples] = useState([
    "Find elderly care nurse near me",
    "I need post-surgery care nurse",
    "Looking for pediatric nurse",
    "ICU nurse for critical care",
    "Nurse who speaks French",
    "Home visit nurse available"
  ])

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    
    const results = await aiSearchNurses(searchQuery, specialization)
    
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSpecialization('all')
    setSearchResults(nursesData)
    setHasSearched(false)
  }

  const handleExampleClick = (example: string) => {
    setSearchQuery(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Nurse</h1>
          <p className="text-xl text-blue-100">
            AI-powered search to connect you with the best nursing professionals in Mauritius
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 mt-15">
        {/* Search Form */}
        <div className="max-w-4xl mx-auto -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe what you are looking for (e.g., 'elderly care nurse', 'post-surgery care', 'pediatric nurse')"
                  className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-lg"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Specializations</option>
                  <option value="elderly">Elderly Care</option>
                  <option value="post-surgery">Post-Surgery Care</option>
                  <option value="child">Child Care</option>
                  <option value="icu">ICU Care</option>
                  <option value="mental-health">Mental Health</option>
                  <option value="cancer">Cancer Care</option>
                  <option value="cardiac">Cardiac Care</option>
                  <option value="maternity">Labor & Delivery</option>
                  <option value="rehabilitation">Rehabilitation</option>
                  <option value="emergency">Emergency Care</option>
                </select>
                
                <button 
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px] shadow-lg disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch />
                      Find Nurses
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Search Examples */}
            {!hasSearched && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">Try searching for:</p>
                <div className="flex flex-wrap gap-2">
                  {searchExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center border border-blue-100">
            <FaUserNurse className="text-3xl text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{nursesData.length}+</p>
            <p className="text-sm text-gray-600">Verified Nurses</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-green-100">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">4.7</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-purple-100">
            <FaShieldAlt className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-600">Verified & Licensed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-orange-100">
            <FaCheckCircle className="text-3xl text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">96%</p>
            <p className="text-sm text-gray-600">Patient Satisfaction</p>
          </div>
        </div>
        
        {/* Results */}
        <div className="mt-12">
          {isSearching ? (
            <LoadingAnimation />
          ) : searchResults.length > 0 ? (
            <>
              {hasSearched && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{searchResults.length}</span> nurses matching your criteria
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
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Are you a nursing professional?</h2>
          <p className="text-blue-100 mb-6">
            Join our platform and connect with patients who need your care. 
            Get matched with nursing opportunities using our AI-powered system.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Join as Nurse →
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}