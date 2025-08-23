'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaSearch, FaBaby, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaHeart, FaChild, FaStarHalfAlt, FaHome, FaLanguage, FaCheckCircle, FaInfoCircle, FaHandHoldingHeart, FaCar, FaGraduationCap, FaShieldAlt, FaCertificate, FaPhone, FaEnvelope,  FaRunning, FaBed, FaFirstAid, FaUsers, FaUserCheck, FaIdCard, FaBus, FaGamepad, FaPuzzlePiece } from 'react-icons/fa'

const mockNannies = [
  {
    id: 1,
    name: "Emma Williams",
    type: "Professional Nanny",
    specialization: "Infant & Toddler Care",
    qualification: "Early Childhood Education Degree, CPR Certified",
    experience: "8 years",
    rating: 4.9,
    reviews: 156,
    location: "Port Louis",
    address: "Available for home visits",
    languages: ["English", "French", "Sign Language"],
    hourlyRate: "$25",
    monthlyRate: "$2,800",
    availability: "Mon-Fri, 7:00 AM - 7:00 PM",
    nextAvailable: "Available Now",
    bio: "Passionate about early childhood development with expertise in Montessori methods and creating engaging educational activities",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=fef3c7",
    ageGroups: ["0-1 year", "1-3 years", "3-5 years"],
    specialties: ["Sleep Training", "Potty Training", "Educational Activities", "Meal Preparation"],
    certifications: ["CPR & First Aid", "Early Childhood Education", "Food Safety", "Child Psychology"],
    services: ["Full-time", "Part-time", "Live-out", "Overnight Care"],
    activities: ["Reading", "Arts & Crafts", "Music", "Outdoor Play"],
    verified: true,
    backgroundCheck: true,
    references: 3,
    phone: "+230 5789 1001",
    email: "emma.w@childcare.mu",
    transportAvailable: true
  },
  {
    id: 2,
    name: "Sophie Martin",
    type: "Au Pair",
    specialization: "Live-in Childcare",
    qualification: "Au Pair Certificate, Bachelor in Education",
    experience: "5 years",
    rating: 4.8,
    reviews: 89,
    location: "Curepipe",
    address: "Willing to relocate",
    languages: ["French", "English", "Spanish", "Creole"],
    hourlyRate: "$20",
    monthlyRate: "$2,200",
    availability: "Live-in, Flexible Schedule",
    nextAvailable: "From next Monday",
    bio: "Experienced au pair who loves creating a fun, safe, and educational environment for children while helping with household tasks",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=e0f2fe",
    ageGroups: ["3-5 years", "6-10 years", "11+ years"],
    specialties: ["Language Teaching", "Homework Help", "Light Housekeeping", "Travel Care"],
    certifications: ["Au Pair Certificate", "First Aid", "International Driver's License"],
    services: ["Live-in", "Weekend Care", "Holiday Care", "Travel Companion"],
    activities: ["Language Lessons", "Swimming", "Cooking Together", "Cultural Exchange"],
    verified: true,
    backgroundCheck: true,
    references: 5,
    phone: "+230 5789 1002",
    email: "sophie.m@childcare.mu",
    transportAvailable: true
  },
  {
    id: 3,
    name: "Priya Sharma",
    type: "Childminder",
    specialization: "After-School Care",
    qualification: "Childcare Level 3 Diploma, Pediatric First Aid",
    experience: "10 years",
    rating: 4.7,
    reviews: 234,
    location: "Vacoas",
    address: "Home-based childcare available",
    languages: ["English", "Hindi", "French", "Creole"],
    hourlyRate: "$18",
    monthlyRate: "$1,800",
    availability: "Mon-Sat, 6:00 AM - 8:00 PM",
    nextAvailable: "Today, 3:00 PM",
    bio: "Registered childminder with a warm home environment, specializing in after-school care and homework support",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=dcfce7",
    ageGroups: ["3-5 years", "6-10 years"],
    specialties: ["After-School Care", "Homework Support", "Healthy Snacks", "School Pick-up"],
    certifications: ["Childcare Diploma", "Food Hygiene", "Safeguarding Children"],
    services: ["After-school", "School Holidays", "Emergency Care", "Drop-in Care"],
    activities: ["Homework Help", "Board Games", "Garden Play", "Baking"],
    verified: true,
    backgroundCheck: true,
    references: 8,
    phone: "+230 5789 1003",
    email: "priya.s@childcare.mu",
    transportAvailable: false
  },
  {
    id: 4,
    name: "Michael Thompson",
    type: "Manny (Male Nanny)",
    specialization: "Active & Sports Care",
    qualification: "Sports Science Degree, Childcare Certificate",
    experience: "6 years",
    rating: 4.8,
    reviews: 112,
    location: "Quatre Bornes",
    address: "Mobile service",
    languages: ["English", "French"],
    hourlyRate: "$22",
    monthlyRate: "$2,500",
    availability: "Flexible, Including Weekends",
    nextAvailable: "Tomorrow, 9:00 AM",
    bio: "Energetic male nanny specializing in active play, sports coaching, and positive role modeling for children",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=d4f1c9",
    ageGroups: ["5-10 years", "11+ years"],
    specialties: ["Sports Coaching", "Outdoor Activities", "Swimming Lessons", "Discipline & Structure"],
    certifications: ["Sports Coaching", "Lifeguard", "First Aid", "Child Protection"],
    services: ["Part-time", "Weekend Care", "Holiday Camps", "Sports Training"],
    activities: ["Football", "Swimming", "Cycling", "Adventure Play"],
    verified: true,
    backgroundCheck: true,
    references: 4,
    phone: "+230 5789 1004",
    email: "michael.t@childcare.mu",
    transportAvailable: true
  },
  {
    id: 5,
    name: "Lisa Chen",
    type: "Special Needs Carer",
    specialization: "Special Educational Needs",
    qualification: "Special Education Degree, ABA Therapy Certified",
    experience: "12 years",
    rating: 4.9,
    reviews: 78,
    location: "Rose Hill",
    address: "In-home care",
    languages: ["English", "Mandarin", "French", "Makaton"],
    hourlyRate: "$30",
    monthlyRate: "$3,500",
    availability: "Mon-Fri, Custom Schedule",
    nextAvailable: "By appointment",
    bio: "Specialized in caring for children with autism, ADHD, and learning disabilities using evidence-based therapeutic approaches",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=fde8e8",
    ageGroups: ["All ages"],
    specialties: ["Autism Support", "ADHD Management", "Sensory Play", "Behavioral Therapy"],
    certifications: ["Special Education", "ABA Therapy", "Speech Therapy Assistant", "Makaton"],
    services: ["One-on-One Care", "School Support", "Therapy Sessions", "Parent Training"],
    activities: ["Sensory Activities", "Social Skills", "Communication Games", "Routine Building"],
    verified: true,
    backgroundCheck: true,
    references: 6,
    phone: "+230 5789 1005",
    email: "lisa.c@childcare.mu",
    transportAvailable: true
  },
  {
    id: 6,
    name: "Sarah Johnson",
    type: "Babysitter",
    specialization: "Evening & Weekend Care",
    qualification: "Childcare Course, Red Cross Babysitting Certificate",
    experience: "4 years",
    rating: 4.6,
    reviews: 198,
    location: "Grand Baie",
    address: "Available for home visits",
    languages: ["English", "French", "Italian"],
    hourlyRate: "$15",
    monthlyRate: "N/A",
    availability: "Evenings & Weekends",
    nextAvailable: "Tonight, 6:00 PM",
    bio: "Reliable babysitter perfect for date nights and weekend care, great with bedtime routines and keeping children entertained",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=e0e7ff",
    ageGroups: ["2-5 years", "6-10 years"],
    specialties: ["Evening Care", "Bedtime Routines", "Emergency Babysitting", "Pet-Friendly"],
    certifications: ["Babysitting Certificate", "First Aid", "Child Safety"],
    services: ["Evening Care", "Weekend Care", "Date Night", "Emergency Care"],
    activities: ["Movie Nights", "Story Time", "Simple Crafts", "Board Games"],
    verified: true,
    backgroundCheck: true,
    references: 12,
    phone: "+230 5789 1006",
    email: "sarah.j@childcare.mu",
    transportAvailable: true
  },
  {
    id: 7,
    name: "Marie-Claire Dubois",
    type: "Governess",
    specialization: "Educational Excellence",
    qualification: "Masters in Education, French Teaching Certificate",
    experience: "15 years",
    rating: 4.9,
    reviews: 67,
    location: "Moka",
    address: "Premium home service",
    languages: ["French", "English", "German", "Latin"],
    hourlyRate: "$35",
    monthlyRate: "$4,000",
    availability: "Mon-Fri, Academic Schedule",
    nextAvailable: "Next term",
    bio: "Professional governess providing high-quality education, etiquette training, and cultural enrichment for discerning families",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarieClaire&backgroundColor=f3e8ff",
    ageGroups: ["5-10 years", "11+ years"],
    specialties: ["Academic Excellence", "Language Instruction", "Etiquette", "Music & Arts"],
    certifications: ["Teaching Certificate", "Child Development", "Music Grade 8", "Art History"],
    services: ["Full-time Education", "Homeschooling", "Tutoring", "Cultural Education"],
    activities: ["Academic Lessons", "Piano", "French Literature", "Museum Visits"],
    verified: true,
    backgroundCheck: true,
    references: 10,
    phone: "+230 5789 1007",
    email: "mc.dubois@childcare.mu",
    transportAvailable: true
  },
  {
    id: 8,
    name: "Amanda Foster",
    type: "Newborn Specialist",
    specialization: "Newborn & Infant Care",
    qualification: "Newborn Care Specialist, Lactation Consultant",
    experience: "9 years",
    rating: 4.8,
    reviews: 94,
    location: "Floreal",
    address: "24-hour support available",
    languages: ["English", "French"],
    hourlyRate: "$28",
    monthlyRate: "$3,200",
    availability: "24/7 for first 3 months",
    nextAvailable: "Booking for next month",
    bio: "Certified newborn specialist helping families navigate the first months with sleep training, feeding support, and parent education",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda&backgroundColor=fef3c7",
    ageGroups: ["0-6 months"],
    specialties: ["Sleep Training", "Breastfeeding Support", "Twin Care", "Parent Education"],
    certifications: ["Newborn Care Specialist", "Lactation Consultant", "Infant CPR", "Postpartum Doula"],
    services: ["Night Nanny", "24-hour Care", "Twin Support", "Parent Coaching"],
    activities: ["Infant Massage", "Tummy Time", "Developmental Play", "Sleep Routines"],
    verified: true,
    backgroundCheck: true,
    references: 7,
    phone: "+230 5789 1008",
    email: "amanda.f@childcare.mu",
    transportAvailable: false
  }
]

// Service type icons mapping
const serviceIcons = {
  "Professional Nanny": FaBaby,
  "Au Pair": FaHome,
  "Childminder": FaChild,
  "Manny (Male Nanny)": FaRunning,
  "Special Needs Carer": FaHeart,
  "Babysitter": FaClock,
  "Governess": FaGraduationCap,
  "Newborn Specialist": FaHandHoldingHeart
}

// AI search simulation function
const aiSearchChildcare = (query: string, careType: string) => {
  return new Promise<typeof mockNannies>((resolve) => {
    setTimeout(() => {
      let results = [...mockNannies]
      
      if (careType !== 'all') {
        results = results.filter(nanny => 
          nanny.type.toLowerCase().includes(careType.toLowerCase()) ||
          nanny.specialization.toLowerCase().includes(careType.toLowerCase())
        )
      }
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        results = results.filter(nanny => 
          nanny.name.toLowerCase().includes(lowerQuery) ||
          nanny.type.toLowerCase().includes(lowerQuery) ||
          nanny.specialization.toLowerCase().includes(lowerQuery) ||
          nanny.specialties.some(s => s.toLowerCase().includes(lowerQuery)) ||
          nanny.ageGroups.some(a => a.toLowerCase().includes(lowerQuery)) ||
          nanny.activities.some(a => a.toLowerCase().includes(lowerQuery)) ||
          nanny.location.toLowerCase().includes(lowerQuery) ||
          nanny.bio.toLowerCase().includes(lowerQuery) ||
          nanny.services.some(s => s.toLowerCase().includes(lowerQuery))
        )
      }
      
      resolve(results)
    }, 1500)
  })
}

// Nanny Card Component
interface NannyProps {
  nanny: typeof mockNannies[0]
}

const NannyCard = ({ nanny }: NannyProps) => {
  const TypeIcon = serviceIcons[nanny.type as keyof typeof serviceIcons] || FaBaby
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-100">
      <div className="p-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full border-4 border-purple-100 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"
              style={{ backgroundImage: `url(${nanny.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <FaBaby className="text-3xl text-purple-400 opacity-0" />
            </div>
            {nanny.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            )}
            {nanny.backgroundCheck && (
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                <FaShieldAlt className="text-white text-xs" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {nanny.name}
              {nanny.verified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
              {nanny.backgroundCheck && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Background ✓
                </span>
              )}
            </h3>
            <p className="text-purple-600 font-medium flex items-center gap-2">
              <TypeIcon className="text-sm" />
              {nanny.type}
            </p>
            <p className="text-gray-600 text-sm">{nanny.specialization}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(nanny.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {nanny.rating % 1 !== 0 && <FaStarHalfAlt className="text-sm" />}
              </div>
              <span className="text-sm font-medium text-gray-700">{nanny.rating}</span>
              <span className="text-sm text-gray-500">({nanny.reviews} reviews)</span>
              {nanny.references > 0 && (
                <span className="text-sm text-purple-600">• {nanny.references} references</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{nanny.bio}</p>
        
        {/* Age Groups */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-gray-500">Ages:</span>
          {nanny.ageGroups.map((age, index) => (
            <span key={index} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
              {age}
            </span>
          ))}
        </div>
        
        {/* Specialties Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {nanny.specialties.slice(0, 3).map((specialty, index) => (
            <span key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
              {specialty}
            </span>
          ))}
        </div>
        
        {/* Activities */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-gray-500">Activities:</span>
          {nanny.activities.slice(0, 3).map((activity, index) => (
            <span key={index} className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded">
              {activity}
            </span>
          ))}
        </div>
        
        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaClock className="text-purple-500" />
            <span>{nanny.experience} experience</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-purple-500" />
            <span className="truncate">{nanny.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaLanguage className="text-purple-500" />
            <span>{nanny.languages.length} languages</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendarAlt className="text-purple-500" />
            <span className="text-green-600 font-medium">{nanny.nextAvailable}</span>
          </div>
        </div>
        
        {/* Service Types & Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {nanny.transportAvailable && (
            <div className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              <FaCar />
              <span>Transport</span>
            </div>
          )}
          {nanny.services.includes("Live-in") && (
            <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <FaHome />
              <span>Live-in</span>
            </div>
          )}
          {nanny.services.includes("Overnight Care") && (
            <div className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
              <FaBed />
              <span>Overnight</span>
            </div>
          )}
          {nanny.certifications.includes("First Aid") && (
            <div className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
              <FaFirstAid />
              <span>First Aid</span>
            </div>
          )}
        </div>
        
        {/* Contact Info */}
        <div className="flex gap-4 mb-4 text-sm">
          <a href={`tel:${nanny.phone}`} className="flex items-center gap-1 text-gray-600 hover:text-purple-600">
            <FaPhone className="text-xs" />
            <span>{nanny.phone}</span>
          </a>
          <a href={`mailto:${nanny.email}`} className="flex items-center gap-1 text-gray-600 hover:text-purple-600">
            <FaEnvelope className="text-xs" />
            <span>Email</span>
          </a>
        </div>
        
        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">{nanny.hourlyRate}</p>
              <span className="text-xs text-gray-500">/hour</span>
            </div>
            {nanny.monthlyRate !== "N/A" && (
              <p className="text-sm text-gray-600">{nanny.monthlyRate}/month</p>
            )}
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2">
              <FaInfoCircle />
              Details
            </button>
            <Link href = "patient/childcare/book/id" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center gap-2">
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
        <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
        <FaBaby className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600 text-2xl" />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">AI is finding the perfect childcare match...</p>
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
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
        Clear Filters
      </button>
    </div>
  )
}

export default function ChildcarePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [careType, setCareType] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(mockNannies)
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
    setSearchResults(mockNannies)
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
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaCertificate className="text-orange-300" />
              <span>Certified Caregivers</span>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 text-purple-300 opacity-20">
          <FaPuzzlePiece className="text-6xl transform rotate-12" />
        </div>
        <div className="absolute bottom-10 left-10 text-pink-300 opacity-20">
          <FaGamepad className="text-6xl transform -rotate-12" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="max-w-4xl mx-auto -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100">
            <div>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tell us what you need (e.g., 'nanny for 2 year old', 'after school care', 'weekend babysitter')"
                    className="w-full px-5 py-4 pr-12 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-lg"
                  />
                  <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
                </div>
                
                {!hasSearched && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500">Popular searches:</span>
                    {searchExamples.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleExampleClick(example)}
                        className="text-sm bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 px-3 py-1 rounded-full transition-colors border border-purple-200"
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
                    className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
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
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px] shadow-lg"
                  >
                    <FaSearch />
                    Find Care
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center border border-purple-100">
            <FaUsers className="text-3xl text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">1,000+</p>
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
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-pink-100">
              <FaChild className="text-4xl text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Childminders</h3>
              <p className="text-gray-600 text-sm">Registered home-based childcare</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-purple-100">
              <FaGraduationCap className="text-4xl text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tutors</h3>
              <p className="text-gray-600 text-sm">Educational support and homework help</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-pink-100">
              <FaHeart className="text-4xl text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Special Needs</h3>
              <p className="text-gray-600 text-sm">Specialized care for children with additional needs</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-purple-100">
              <FaBus className="text-4xl text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">School Runs</h3>
              <p className="text-gray-600 text-sm">Safe transportation to and from school</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-pink-100">
              <FaHandHoldingHeart className="text-4xl text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Newborn Care</h3>
              <p className="text-gray-600 text-sm">Specialist support for new parents</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Tell Us Your Needs</h3>
              <p className="text-sm text-gray-600">Describe what kind of childcare you are looking for</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">AI Matches You</h3>
              <p className="text-sm text-gray-600">Our AI finds the perfect caregivers for your family</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Review & Connect</h3>
              <p className="text-sm text-gray-600">View profiles, references, and contact caregivers</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Book with Confidence</h3>
              <p className="text-sm text-gray-600">Secure booking with verified, insured caregivers</p>
            </div>
          </div>
        </div>
        
        {/* Parent Testimonials */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Happy Families</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-purple-100">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Found an amazing nanny within days! The AI matching was spot on - she is perfect for our twins.</p>
              <p className="font-semibold text-gray-900">- Jessica M.</p>
              <p className="text-xs text-gray-500">Parent of 2</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border border-pink-100">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">The background checks and references gave us complete peace of mind. Highly recommend!</p>
              <p className="font-semibold text-gray-900">- David L.</p>
              <p className="text-xs text-gray-500">Parent of 3</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg border border-purple-100">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Our au pair has become part of the family. The cultural exchange has been wonderful for the kids.</p>
              <p className="font-semibold text-gray-900">- Maria S.</p>
              <p className="text-xs text-gray-500">Parent of 1</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Are you a childcare professional?</h2>
          <p className="text-purple-100 mb-6">
            Join thousands of verified caregivers and connect with families looking for your expertise. 
            Set your own rates and schedule with our flexible platform.
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
      </div>
    </div>
  )
}