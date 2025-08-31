'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaSearch, FaStethoscope, FaStar, FaMapMarkerAlt, FaClock, FaUserMd, FaCalendarAlt, FaHeart, FaBrain, FaBaby, FaEye, FaTooth, FaBone, FaStarHalfAlt, FaVideo, FaClinicMedical, FaLanguage, FaCheckCircle, FaInfoCircle } from 'react-icons/fa'

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    qualification: "MD, MBBS, FICS",
    experience: "15 years",
    rating: 4.8,
    reviews: 234,
    location: "Port Louis Medical Center",
    address: "12 Royal Street, Port Louis",
    languages: ["English", "French", "Creole"],
    consultationFee: "$75",
    availability: "Mon-Fri, 9:00 AM - 5:00 PM",
    nextAvailable: "Today, 2:30 PM",
    bio: "Specialized in interventional cardiology with expertise in complex cardiac procedures",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
    specialties: ["Heart Disease", "Hypertension", "Cardiac Surgery"],
    education: ["Harvard Medical School", "Johns Hopkins Fellowship"],
    awards: ["Best Cardiologist 2023", "Excellence in Patient Care"],
    consultationTypes: ["In-Person", "Video Consultation"],
    verified: true
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Neurologist",
    qualification: "MD, PhD, FRCP",
    experience: "20 years",
    rating: 4.9,
    reviews: 312,
    location: "Curepipe Neurological Institute",
    address: "45 Medical Plaza, Curepipe",
    languages: ["English", "Mandarin", "French"],
    consultationFee: "$85",
    availability: "Mon-Sat, 10:00 AM - 6:00 PM",
    nextAvailable: "Tomorrow, 11:00 AM",
    bio: "Expert in neurodegenerative diseases and pediatric neurology",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c0aede",
    specialties: ["Epilepsy", "Parkinson's", "Migraine", "Stroke"],
    education: ["Yale School of Medicine", "Mayo Clinic Residency"],
    awards: ["Research Excellence Award", "Top Neurologist 2022"],
    consultationTypes: ["In-Person", "Video Consultation"],
    verified: true
  },
  {
    id: 3,
    name: "Dr. Priya Patel",
    specialization: "Pediatrician",
    qualification: "MBBS, DCH, DNB",
    experience: "12 years",
    rating: 4.7,
    reviews: 456,
    location: "Children's Health Center",
    address: "78 Sunshine Avenue, Vacoas",
    languages: ["English", "Hindi", "French", "Creole"],
    consultationFee: "$60",
    availability: "Mon-Sat, 8:00 AM - 7:00 PM",
    nextAvailable: "Today, 4:00 PM",
    bio: "Dedicated to providing compassionate care for children from newborns to adolescents",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc",
    specialties: ["Child Development", "Vaccination", "Pediatric Nutrition"],
    education: ["All India Institute of Medical Sciences", "Boston Children's Hospital"],
    awards: ["Pediatrician of the Year 2023"],
    consultationTypes: ["In-Person", "Video Consultation", "Home Visit"],
    verified: true
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialization: "Orthopedic Surgeon",
    qualification: "MS, FRCS, FACS",
    experience: "18 years",
    rating: 4.6,
    reviews: 189,
    location: "Orthopedic Excellence Center",
    address: "23 Medical Drive, Quatre Bornes",
    languages: ["English", "French"],
    consultationFee: "$90",
    availability: "Tue-Sat, 9:00 AM - 4:00 PM",
    nextAvailable: "Wednesday, 10:00 AM",
    bio: "Specialized in sports medicine and joint replacement surgery",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=d4f1c9",
    specialties: ["Joint Replacement", "Sports Injuries", "Spine Surgery"],
    education: ["Oxford University", "Cleveland Clinic Fellowship"],
    awards: ["Excellence in Orthopedic Surgery"],
    consultationTypes: ["In-Person"],
    verified: true
  },
  {
    id: 5,
    name: "Dr. Emily Roberts",
    specialization: "Dermatologist",
    qualification: "MD, FAAD",
    experience: "10 years",
    rating: 4.8,
    reviews: 278,
    location: "Skin Care Clinic",
    address: "56 Beauty Lane, Grand Baie",
    languages: ["English", "French", "Spanish"],
    consultationFee: "$70",
    availability: "Mon-Fri, 10:00 AM - 6:00 PM",
    nextAvailable: "Today, 5:00 PM",
    bio: "Expert in cosmetic dermatology and skin cancer treatment",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffeaa7",
    specialties: ["Acne Treatment", "Skin Cancer", "Cosmetic Procedures"],
    education: ["Stanford Medical School", "NYU Dermatology Residency"],
    awards: ["Top Dermatologist 2023"],
    consultationTypes: ["In-Person", "Video Consultation"],
    verified: true
  },
  {
    id: 6,
    name: "Dr. Ahmed Hassan",
    specialization: "General Practitioner",
    qualification: "MBBS, MRCGP",
    experience: "8 years",
    rating: 4.5,
    reviews: 567,
    location: "Family Health Clinic",
    address: "90 Community Road, Rose Hill",
    languages: ["English", "Arabic", "French", "Creole"],
    consultationFee: "$50",
    availability: "Mon-Sun, 8:00 AM - 8:00 PM",
    nextAvailable: "Today, 3:00 PM",
    bio: "Committed to providing comprehensive primary care for the whole family",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&backgroundColor=a8e6cf",
    specialties: ["Family Medicine", "Preventive Care", "Chronic Disease Management"],
    education: ["Cairo University", "Royal College of General Practitioners"],
    awards: ["Community Service Award"],
    consultationTypes: ["In-Person", "Video Consultation", "Home Visit"],
    verified: true
  }
]

// Specialization icons mapping
const specializationIcons = {
  "Cardiologist": FaHeart,
  "Neurologist": FaBrain,
  "Pediatrician": FaBaby,
  "Orthopedic Surgeon": FaBone,
  "Dermatologist": FaUserMd,
  "General Practitioner": FaStethoscope,
  "Ophthalmologist": FaEye,
  "Dentist": FaTooth
}

// AI search simulation function
const aiSearchDoctors = (query: string, specialization: string) => {
  return new Promise<typeof mockDoctors>((resolve) => {
    setTimeout(() => {
      let results = [...mockDoctors]
      
      if (specialization !== 'all') {
        results = results.filter(doc => 
          doc.specialization.toLowerCase().includes(specialization.toLowerCase())
        )
      }
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        results = results.filter(doc => 
          doc.name.toLowerCase().includes(lowerQuery) ||
          doc.specialization.toLowerCase().includes(lowerQuery) ||
          doc.specialties.some(s => s.toLowerCase().includes(lowerQuery)) ||
          doc.location.toLowerCase().includes(lowerQuery) ||
          doc.bio.toLowerCase().includes(lowerQuery)
        )
      }
      
      resolve(results)
    }, 1500)
  })
}

interface DoctorProps {
  doctor: typeof mockDoctors[0]
}

const DoctorCard = ({ doctor }: DoctorProps) => {
  const SpecIcon = specializationIcons[doctor.specialization as keyof typeof specializationIcons] || FaUserMd
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full border-4 border-blue-100 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
              style={{ backgroundImage: `url(${doctor.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {/* Fallback icon if image fails */}
              <FaUserMd className="text-3xl text-blue-400 opacity-0" />
            </div>
            {doctor.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {doctor.name}
              {doctor.verified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </h3>
            <p className="text-blue-600 font-medium flex items-center gap-2">
              <SpecIcon className="text-sm" />
              {doctor.specialization}
            </p>
            <p className="text-gray-600 text-sm">{doctor.qualification}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(doctor.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {doctor.rating % 1 !== 0 && <FaStarHalfAlt className="text-sm" />}
              </div>
              <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
              <span className="text-sm text-gray-500">({doctor.reviews} reviews)</span>
            </div>
          </div>
        </div>
        
        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doctor.bio}</p>
        
        {/* Specialties Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {doctor.specialties.slice(0, 3).map((specialty, index) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              {specialty}
            </span>
          ))}
        </div>
        
        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaClock className="text-blue-500" />
            <span>{doctor.experience} experience</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-blue-500" />
            <span className="truncate">{doctor.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaLanguage className="text-blue-500" />
            <span>{doctor.languages[0]} +{doctor.languages.length - 1}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendarAlt className="text-blue-500" />
            <span className="text-green-600 font-medium">{doctor.nextAvailable}</span>
          </div>
        </div>
        
        {/* Consultation Types */}
        <div className="flex gap-2 mb-4">
          {doctor.consultationTypes.includes("Video Consultation") && (
            <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
              <FaVideo />
              <span>Video</span>
            </div>
          )}
          {doctor.consultationTypes.includes("In-Person") && (
            <div className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              <FaClinicMedical />
              <span>In-Person</span>
            </div>
          )}
        </div>
        
        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-gray-900">{doctor.consultationFee}</p>
            <p className="text-xs text-gray-500">per consultation</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2">
              <FaInfoCircle />
              Details
            </button>
            <Link href = "/patient/doctor-consultations/id/book" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center gap-2">
              <FaCalendarAlt />
              Book
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
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        <FaStethoscope className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 text-2xl" />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">AI is searching for the best doctors...</p>
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
      <FaStethoscope className="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse all doctors</p>
      <button 
        onClick={onClear}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  )
}

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [specialization, setSpecialization] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(mockDoctors)
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
    setSearchResults(mockDoctors)
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="max-w-4xl mx-auto -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-10">
            <div>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Describe what you're looking for (e.g., 'heart specialist', 'pediatrician near me', 'doctor for headaches')"
                    className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-lg"
                  />
                  <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                {/* Example Searches */}
                {!hasSearched && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500">Try:</span>
                    {searchExamples.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleExampleClick(example)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row gap-4">
                  <select 
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Specializations</option>
                    <option value="general">General Medicine</option>
                    <option value="cardiologist">Cardiology</option>
                    <option value="neurologist">Neurology</option>
                    <option value="pediatrician">Pediatrics</option>
                    <option value="orthopedic">Orthopedics</option>
                    <option value="dermatologist">Dermatology</option>
                  </select>
                  
                  <button 
                    type="button"
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px]"
                  >
                    <FaSearch />
                    AI Search
                  </button>
                </div>
              </div>
            </div>
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
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Are you a healthcare professional?</h2>
          <p className="text-purple-100 mb-6">
            Join our platform and connect with thousands of patients across Mauritius. 
            Grow your practice with our AI-powered patient matching system.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              Join as Doctor →
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}