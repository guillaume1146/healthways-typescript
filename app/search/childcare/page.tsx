'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { nanniesData, type Nanny } from '@/lib/data'
import { 
  FaSearch, FaBaby, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaHeart, 
  FaChild, FaStarHalfAlt, FaHome, FaLanguage, FaCheckCircle, FaInfoCircle, 
  FaHandHoldingHeart, FaCar, FaGraduationCap, FaShieldAlt, FaCertificate, 
  FaPhone, FaEnvelope, FaRunning, FaBed, FaFirstAid, FaUsers, FaUserCheck, 
  FaIdCard, FaBus, FaGamepad, FaPuzzlePiece 
} from 'react-icons/fa'

// Service type icons mapping
const serviceIcons = {
  "Professional Nanny": FaBaby,
  "Au Pair": FaHome,
  "Babysitter": FaClock,
  "Childminder": FaChild,
  "Special Needs Caregiver": FaHeart,
  "Special Needs Care": FaHeart,
  "Newborn Specialist": FaHandHoldingHeart,
  "Governess/Tutor": FaGraduationCap,
  "Multilingual Nanny": FaLanguage,
  "Infant Care": FaBaby,
  "Toddler Development": FaChild,
  "Educational Activities": FaGraduationCap,
  "Live-in Childcare": FaHome,
  "Language Teaching": FaLanguage,
  "Cultural Exchange": FaUsers,
  "Evening Care": FaClock,
  "Weekend Sitting": FaClock,
  "Special Events": FaStar,
  "Autism Care": FaHeart,
  "Developmental Delays": FaHeart,
  "Behavioral Support": FaHeart,
  "Sleep Training": FaBed,
  "Breastfeeding Support": FaHandHoldingHeart,
  "Academic Tutoring": FaGraduationCap,
  "Homework Supervision": FaGraduationCap,
  "Educational Planning": FaGraduationCap,
  "Bilingual Development": FaLanguage
}

// AI search simulation function using centralized data
const aiSearchChildcare = (query: string, careType: string) => {
  return new Promise<Nanny[]>((resolve) => {
    setTimeout(() => {
      let results = [...nanniesData]
      
      if (careType !== 'all') {
        results = results.filter(nanny => 
          nanny.type.toLowerCase().includes(careType.toLowerCase()) ||
          nanny.specialization.some(s => s.toLowerCase().includes(careType.toLowerCase()))
        )
      }
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        results = results.filter(nanny => 
          nanny.firstName.toLowerCase().includes(lowerQuery) ||
          nanny.lastName.toLowerCase().includes(lowerQuery) ||
          nanny.type.toLowerCase().includes(lowerQuery) ||
          nanny.specialization.some(s => s.toLowerCase().includes(lowerQuery)) ||
          nanny.ageGroups.some(a => a.toLowerCase().includes(lowerQuery)) ||
          nanny.activities.some(a => a.toLowerCase().includes(lowerQuery)) ||
          nanny.location.toLowerCase().includes(lowerQuery) ||
          nanny.bio.toLowerCase().includes(lowerQuery) ||
          nanny.services.some(s => s.toLowerCase().includes(lowerQuery)) ||
          nanny.certifications.some(c => c.toLowerCase().includes(lowerQuery))
        )
      }
      
      resolve(results)
    }, 1500)
  })
}

// Nanny Card Component
interface NannyProps {
  nanny: Nanny
}

const NannyCard = ({ nanny }: NannyProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-100">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Image 
              src={nanny.profileImage} 
              alt={`${nanny.firstName} ${nanny.lastName}`}
              width={80} 
              height={80}
              className="rounded-full object-cover border-4 border-purple-100"
            />
            {nanny.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {nanny.firstName} {nanny.lastName}
            </h3>
            <p className="text-purple-600 font-medium mb-2">
              {nanny.specialization.join(', ')}
            </p>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(nanny.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {nanny.rating % 1 !== 0 && <FaStarHalfAlt className="text-sm" />}
              </div>
              <span className="text-sm font-medium text-gray-700">{nanny.rating}</span>
              <span className="text-sm text-gray-500">({nanny.reviews} reviews)</span>
            </div>

            {/* Languages - Show all without truncation */}
            <div className="flex items-center gap-2 mb-2">
              <FaLanguage className="text-purple-500 text-sm" />
              <span className="text-sm text-gray-600">{nanny.languages.join(', ')}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-500 text-sm" />
              <span className="text-sm text-gray-700">{nanny.location}</span>
            </div>
          </div>
        </div>

        {/* Age Groups */}
        <div className="flex flex-wrap gap-2 mb-4">
          {nanny.ageGroups.map((ageGroup, index) => (
            <span key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
              {ageGroup}
            </span>
          ))}
        </div>

        {/* Service Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {nanny.services.includes("Full-time") && (
            <div className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              <FaClock />
              <span>Full-time</span>
            </div>
          )}
          {nanny.services.includes("Live-in Care") && (
            <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <FaHome />
              <span>Live-in</span>
            </div>
          )}
          {nanny.services.includes("Weekend Care") && (
            <div className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
              <FaCalendarAlt />
              <span>Weekends</span>
            </div>
          )}
        </div>
        
        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-lg font-bold text-gray-900">Rs{nanny.hourlyRate}/hr</p>
            <p className="text-sm text-gray-500">Rs{nanny.monthlyRate}/month</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/search/childcare/${nanny.id}`}>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium">
                Details
              </button>
            </Link>
            <Link href={`/patient/nanny-booking/${nanny.id}`}>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium">
                Book
              </button>
            </Link>
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
        <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
        <FaBaby className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600 text-2xl" />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">AI is finding the perfect childcare match...</p>
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
      <FaBaby className="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No childcare providers found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse all available caregivers</p>
      <button 
        onClick={onClear}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        View All Caregivers
      </button>
    </div>
  )
}

export default function ChildcarePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [careType, setCareType] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(nanniesData) // FIXED: Use nanniesData instead of mockNannies
  const [hasSearched, setHasSearched] = useState(false)
  const [searchExamples] = useState([
    "Nanny for newborn baby",
    "After school care needed",
    "Weekend babysitter",
    "Special needs support",
    "Live-in au pair",
    "Homework help for 8 year old"
  ])

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    
    const results = await aiSearchChildcare(searchQuery, careType)
    
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCareType('all')
    setSearchResults(nanniesData) // FIXED: Use nanniesData instead of mockNannies
    setHasSearched(false)
  }

  const handleExampleClick = (example: string) => {
    setSearchQuery(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4">Find Trusted Childcare & Nannies</h1>
          <p className="text-xl text-purple-100">
            AI-powered matching to connect you with verified childcare professionals in Mauritius
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaShieldAlt className="text-yellow-300" />
              <span>Background Checked</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaCheckCircle className="text-green-300" />
              <span>Verified Profiles</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaUserCheck className="text-blue-300" />
              <span>Reference Checked</span>
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
                  placeholder="Describe your childcare needs (e.g., 'nanny for newborn', 'after school care', 'weekend babysitter')"
                  className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-lg"
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
                      className="text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1 rounded-full transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-4">
                <select 
                  value={careType}
                  onChange={(e) => setCareType(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="all">All Care Types</option>
                  <option value="nanny">Professional Nanny</option>
                  <option value="au pair">Au Pair</option>
                  <option value="babysitter">Babysitter</option>
                  <option value="childminder">Childminder</option>
                  <option value="special needs">Special Needs</option>
                  <option value="newborn">Newborn Specialist</option>
                  <option value="governess">Governess/Tutor</option>
                </select>
                
                <button 
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px] shadow-lg disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch />
                      Find Care
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center border border-purple-100">
            <FaUsers className="text-3xl text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{nanniesData.length}+</p>
            <p className="text-sm text-gray-600">Verified Caregivers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-pink-100">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-purple-100">
            <FaShieldAlt className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-600">Background Checked</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-pink-100">
            <FaIdCard className="text-3xl text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">98%</p>
            <p className="text-sm text-gray-600">Parent Satisfaction</p>
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
                    Found <span className="font-semibold text-gray-900">{searchResults.length}</span> childcare providers matching your needs
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((nanny) => (
                  <NannyCard key={nanny.id} nanny={nanny} />
                ))}
              </div>
            </>
          ) : hasSearched ? (
            <EmptyState onClear={handleClearFilters} />
          ) : null}
        </div>
        
        {/* Services Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Types of Childcare We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-purple-100">
              <FaBaby className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nannies</h3>
              <p className="text-gray-600 text-sm">Full-time professional childcare in your home</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-pink-100">
              <FaHome className="text-4xl text-pink-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Au Pairs</h3>
              <p className="text-gray-600 text-sm">Live-in childcare with cultural exchange</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-purple-100">
              <FaClock className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Babysitters</h3>
              <p className="text-gray-600 text-sm">Flexible evening and weekend care</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-orange-100">
              <FaHeart className="text-4xl text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Special Needs</h3>
              <p className="text-gray-600 text-sm">Specialized care for children with special needs</p>
            </div>
          </div>
        </div>

        {/* Professional Banner */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Are you a childcare professional?</h2>
          <p className="text-purple-100 mb-6">
            Join our platform and connect with families who need your expertise. 
            Get matched with childcare opportunities using our AI-powered system.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              Join as Caregiver →
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Parents Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Found the perfect nanny for our twins through this platform. The AI matching was spot-on with our needs.</p>
              <p className="font-semibold text-gray-900">- Jennifer M.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Our au pair is amazing! She is teaching our kids French while providing excellent care.</p>
              <p className="font-semibold text-gray-900">- David & Sarah K.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">The special needs caregiver we found has been incredible with our son. Professional, patient, and caring.</p>
              <p className="font-semibold text-gray-900">- Maria L.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}