'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { doctorsData, type Doctor } from '@/lib/data'
import { 
  FaSearch, FaUserMd, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt,
  FaHeart, FaBrain, FaBaby, FaBone, FaEye, FaTooth, FaStethoscope,
  FaFilter, FaCertificate, FaShieldAlt, FaPhone, FaEnvelope,
  FaVideo, FaHome, FaLanguage, FaCheckCircle, FaExclamationCircle,
  FaGraduationCap, FaAward, FaDollarSign
} from 'react-icons/fa'

// Specialization icons mapping
const specializationIcons = {
  "Cardiology": FaHeart,
  "Interventional Cardiology": FaHeart,
  "Neurology": FaBrain,
  "Epilepsy": FaBrain,
  "Pediatrics": FaBaby,
  "Child Development": FaBaby,
  "Orthopedic Surgery": FaBone,
  "Sports Medicine": FaBone,
  "Dermatology": FaUserMd,
  "Cosmetic Dermatology": FaUserMd,
  "General Practitioner": FaStethoscope,
  "Family Medicine": FaStethoscope,
  "Ophthalmology": FaEye,
  "Retinal Surgery": FaEye,
  "Emergency Medicine": FaUserMd,
  "Trauma Care": FaUserMd,
  "General Dentistry": FaTooth,
  "Cosmetic Dentistry": FaTooth,
  "Psychiatry": FaBrain,
  "Anxiety Disorders": FaBrain,
  "Depression": FaBrain,
  "Gastroenterology": FaUserMd,
  "Endoscopy": FaUserMd
}

// AI search simulation function using centralized data
const aiSearchDoctors = (query: string, specialization: string) => {
  return new Promise<Doctor[]>((resolve) => {
    setTimeout(() => {
      let results = [...doctorsData]
      
      if (specialization !== 'all') {
        results = results.filter(doc => 
          doc.specialty.some(s => s.toLowerCase().includes(specialization.toLowerCase()))
        )
      }
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        results = results.filter(doc => 
          doc.firstName.toLowerCase().includes(lowerQuery) ||
          doc.lastName.toLowerCase().includes(lowerQuery) ||
          doc.specialty.some(s => s.toLowerCase().includes(lowerQuery)) ||
          doc.location.toLowerCase().includes(lowerQuery) ||
          doc.bio.toLowerCase().includes(lowerQuery) ||
          doc.education.some(e => e.toLowerCase().includes(lowerQuery))
        )
      }
      
      resolve(results)
    }, 1500)
  })
}

interface DoctorProps {
  doctor: Doctor
}

const DoctorCard = ({ doctor }: DoctorProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        {/* Doctor Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Image 
              src={doctor.profileImage} 
              alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
              width={80} 
              height={80}
              className="rounded-full object-cover border-4 border-blue-100"
            />
            {doctor.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                <FaCheckCircle className="text-xs" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            <p className="text-blue-600 font-medium mb-2">
              {doctor.specialty.join(', ')}
            </p>
            
            {/* Category Badge */}
            <div className="mb-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                doctor.category === 'Specialist' 
                  ? 'bg-purple-100 text-purple-700' 
                  : doctor.category === 'General Practice'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {doctor.category}
              </span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(doctor.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {doctor.rating % 1 !== 0 && <FaStar className="text-sm opacity-50" />}
              </div>
              <span className="text-sm font-semibold text-gray-700">{doctor.rating}</span>
              <span className="text-sm text-gray-500">({doctor.reviews} reviews)</span>
            </div>

            {/* Languages */}
            <div className="flex items-center gap-2 mb-2">
              <FaLanguage className="text-blue-500 text-sm" />
              <span className="text-sm text-gray-600">{doctor.languages.slice(0, 2).join(', ')}</span>
              {doctor.languages.length > 2 && <span className="text-sm text-gray-400">+{doctor.languages.length - 2}</span>}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500 text-sm" />
              <span className="text-sm text-gray-700">{doctor.location}</span>
            </div>
          </div>
        </div>

        {/* Consultation Types - Bigger Display */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {doctor.consultationTypes.includes("In-Person") && (
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaHome className="text-green-600" />
                <span className="text-green-700 font-medium text-sm">In-Person</span>
              </div>
            )}
            {doctor.consultationTypes.includes("Video Consultation") && (
              <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <FaVideo className="text-purple-600" />
                <span className="text-purple-700 font-medium text-sm">Video Call</span>
              </div>
            )}
          </div>
          
          {/* Emergency Available - Fixed height container */}
          <div className="mt-2 h-10 flex items-center">
            {doctor.emergencyAvailable && (
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
              <p className="text-sm font-semibold text-blue-800">{doctor.nextAvailable}</p>
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
              <span className="text-sm text-gray-600">In-Person:</span>
              <span className="text-lg font-bold text-green-600">Rs {doctor.consultationFee.toLocaleString()}</span>
            </div>
            {doctor.videoConsultationFee > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Video Call:</span>
                <span className="text-lg font-bold text-green-600">Rs {doctor.videoConsultationFee.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Link href={`/search/doctors/${doctor.id}`} className="flex-1">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Details
              </button>
            </Link>
            <Link href={`/booking/doctors/${doctor.id}`} className="flex-1">
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
    <span className="ml-3 text-gray-600">Finding the best doctors for you...</span>
  </div>
)

const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="text-center py-12">
    <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
    <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all available doctors</p>
    <button 
      onClick={onClear}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      View All Doctors
    </button>
  </div>
)

export default function DoctorsSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [specialization, setSpecialization] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(doctorsData)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchExamples] = useState([
    "Find a heart specialist near me",
    "I need a pediatrician for my baby",
    "Looking for skin doctor",
    "Neurologist for migraine treatment",
    "Doctor who speaks French",
    "Weekend availability doctor"
  ])

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    
    const results = await aiSearchDoctors(searchQuery, specialization)
    
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSpecialization('all')
    setSearchResults(doctorsData)
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
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Doctor</h1>
          <p className="text-xl text-blue-100">
            AI-powered search to connect you with the best healthcare professionals in Mauritius
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
                  placeholder="Describe what you are looking for (e.g., 'heart specialist', 'pediatrician near me', 'doctor for headaches')"
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
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="orthopedic">Orthopedic Surgery</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="emergency">Emergency Medicine</option>
                  <option value="dentistry">Dentistry</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="gastroenterology">Gastroenterology</option>
                  <option value="ophthalmology">Ophthalmology</option>
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
                      Find Doctors
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
            <FaUserMd className="text-3xl text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{doctorsData.length}+</p>
            <p className="text-sm text-gray-600">Verified Doctors</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-green-100">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-purple-100">
            <FaShieldAlt className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-600">Verified & Licensed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-orange-100">
            <FaCheckCircle className="text-3xl text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">95%</p>
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
                    Found <span className="font-semibold text-gray-900">{searchResults.length}</span> doctors matching your criteria
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
                {searchResults.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </>
          ) : hasSearched ? (
            <EmptyState onClear={handleClearFilters} />
          ) : null}
        </div>
        
        {/* Professional Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Are you a healthcare professional?</h2>
          <p className="text-blue-100 mb-6">
            Join our platform and connect with patients who need your expertise. 
            Get matched with consultation opportunities using our AI-powered system.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Join as Doctor →
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