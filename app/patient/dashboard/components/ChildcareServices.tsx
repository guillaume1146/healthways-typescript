import React, { useState } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaBaby, 
  FaCalendarAlt, 
  FaClock, 
  FaChild, 
  FaExclamationTriangle, 
  FaMoon,
  FaVideo,
  FaComments,
  FaPlus,
  FaFilter,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimes,
  FaStar,
  FaHeart,
  FaGamepad,
  FaBook,
  FaPaintBrush,
  FaMusic,
  FaCertificate,
  FaAward,
  FaGraduationCap,
  FaShieldAlt,
  FaFirstAid,
  FaPhone,
  FaMapMarkerAlt,
  FaLanguage,
  FaHandsHelping,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaCalendarPlus,
  FaHistory,
  FaFileAlt,
  FaDownload,
  FaShare,
  FaImage,
  FaSmile,
  FaSun,
  FaUtensils,
  FaBed,
  FaHome,
  FaUserCheck,
  FaCameraRetro
} from 'react-icons/fa'

interface Props {
  patientData: Patient
  onVideoCall: () => void
}

interface FilterOptions {
  status: 'all' | 'upcoming' | 'completed' | 'cancelled'
  type: 'all' | 'regular' | 'overnight'
  nanny: 'all' | string
}

const ChildcareServices: React.FC<Props> = ({ patientData, onVideoCall }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    type: 'all',
    nanny: 'all'
  })
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)

  // Sample nanny data for booking
  const availableNannies = [
    {
      id: 'NAN001',
      name: 'Sophie Chen',
      specialties: ['Newborn Care', 'Educational Activities', 'Multilingual'],
      experience: '6 years',
      rating: 4.9,
      hourlyRate: 'Rs 350/hour',
      languages: ['English', 'French', 'Mandarin'],
      certifications: ['CPR Certified', 'Early Childhood Education', 'First Aid'],
      availability: 'Available this week',
      description: 'Experienced childcare professional with expertise in early childhood development and educational activities.',
      specialSkills: ['Music', 'Art & Crafts', 'Educational Games', 'Language Development'],
      ageGroups: ['0-2 years', '3-5 years', '6-12 years']
    },
    {
      id: 'NAN002',
      name: 'Rachel Brown',
      specialties: ['Special Needs Care', 'Behavioral Support', 'Homework Help'],
      experience: '8 years',
      rating: 4.8,
      hourlyRate: 'Rs 400/hour',
      languages: ['English', 'Hindi'],
      certifications: ['Special Needs Certified', 'Behavioral Therapy', 'CPR & First Aid'],
      availability: 'Available weekends',
      description: 'Specialized in caring for children with special needs and providing educational support.',
      specialSkills: ['Homework Assistance', 'Behavioral Management', 'Therapeutic Activities'],
      ageGroups: ['3-5 years', '6-12 years', '13+ years']
    },
    {
      id: 'NAN003',
      name: 'Maria Santos',
      specialties: ['Overnight Care', 'Infant Care', 'Meal Preparation'],
      experience: '10 years',
      rating: 4.9,
      hourlyRate: 'Rs 300/hour',
      languages: ['English', 'Spanish', 'Portuguese'],
      certifications: ['Infant Care Specialist', 'Nutrition Certified', 'Sleep Training'],
      availability: 'Available nights',
      description: 'Expert in overnight care and infant development with focus on healthy routines.',
      specialSkills: ['Sleep Training', 'Meal Planning', 'Potty Training', 'Infant Massage'],
      ageGroups: ['0-2 years', '3-5 years']
    }
  ]

  const childcareActivities = [
    { icon: FaBook, name: 'Reading & Storytelling', description: 'Age-appropriate books and interactive stories' },
    { icon: FaPaintBrush, name: 'Arts & Crafts', description: 'Creative activities to develop fine motor skills' },
    { icon: FaMusic, name: 'Music & Dancing', description: 'Musical activities for cognitive development' },
    { icon: FaGamepad, name: 'Educational Games', description: 'Learning through play and structured activities' },
    { icon: FaUtensils, name: 'Meal Preparation', description: 'Healthy meal planning and preparation' },
    { icon: FaBed, name: 'Sleep Routines', description: 'Establishing healthy sleep patterns' },
    { icon: FaFirstAid, name: 'Safety & First Aid', description: 'Comprehensive safety and emergency care' },
    { icon: FaLanguage, name: 'Language Development', description: 'Multilingual exposure and communication skills' }
  ]

  // Get unique nannies
  const nannies = Array.from(new Set(
    (patientData.childcareBookings || []).map(booking => booking.nannyName)
  ))

  // Filter bookings
  const filteredBookings = (patientData.childcareBookings || []).filter(booking => {
    const matchesSearch = 
      booking.nannyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.children.some(child => child.toLowerCase().includes(searchQuery.toLowerCase())) ||
      booking.specialInstructions?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filters.status === 'all' || booking.status === filters.status
    const matchesType = filters.type === 'all' || booking.type === filters.type
    const matchesNanny = filters.nanny === 'all' || booking.nannyName === filters.nanny

    return matchesSearch && matchesStatus && matchesType && matchesNanny
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <FaClock />
      case 'completed': return <FaCheckCircle />
      case 'cancelled': return <FaTimes />
      default: return <FaExclamationTriangle />
    }
  }

  const renderBookingForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-5 md:p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Book Childcare Service</h3>
            <button
              onClick={() => setShowBookingForm(false)}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Service Type Selection */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Select Service Type</h4>
            <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-purple-300 cursor-pointer">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <FaSun className="text-yellow-500 text-lg sm:text-xl" />
                  <h5 className="font-semibold text-gray-900 text-sm sm:text-base">Regular Care</h5>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Daytime childcare for daily activities and play</p>
                <p className="text-xs text-gray-500 mt-2">Rs 300-400/hour • Flexible hours</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-purple-300 cursor-pointer">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <FaMoon className="text-purple-500 text-lg sm:text-xl" />
                  <h5 className="font-semibold text-gray-900 text-sm sm:text-base">Overnight Care</h5>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Complete overnight care including sleep routines</p>
                <p className="text-xs text-gray-500 mt-2">Rs 2500-3500/night • 12+ hours</p>
              </div>
            </div>
          </div>

          {/* Available Nannies */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Choose Your Nanny</h4>
            <div className="space-y-3 sm:space-y-4">
              {availableNannies.map((nanny) => (
                <div key={nanny.id} className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-400 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg flex-shrink-0">
                        {nanny.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div>
                            <h5 className="font-semibold text-gray-900 text-sm sm:text-base">{nanny.name}</h5>
                            <p className="text-xs sm:text-sm text-gray-600">{nanny.experience} experience • {nanny.hourlyRate}</p>
                          </div>
                          <div className="flex items-center gap-3 sm:text-right">
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-500 text-xs sm:text-sm" />
                              <span className="font-medium text-gray-900 text-xs sm:text-sm">{nanny.rating}</span>
                            </div>
                            <p className="text-xs text-green-600">{nanny.availability}</p>
                          </div>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{nanny.description}</p>

                        <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2 md:gap-3 mb-2 sm:mb-3">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                            <div className="flex flex-wrap gap-1">
                              {nanny.specialties.map((specialty, index) => (
                                <span key={index} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Languages:</p>
                            <div className="flex flex-wrap gap-1">
                              {nanny.languages.map((lang, index) => (
                                <span key={index} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Certifications:</p>
                            <div className="flex flex-wrap gap-1">
                              {nanny.certifications.map((cert, index) => (
                                <span key={index} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
                                  <FaCertificate className="text-xs" />
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Age Groups:</p>
                            <div className="flex flex-wrap gap-1">
                              {nanny.ageGroups.map((age, index) => (
                                <span key={index} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                                  {age}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-xs sm:text-sm">
                          Select {nanny.name.split(' ')[0]}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Preferred Date</label>
              <input
                type="date"
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Start Time</label>
              <input
                type="time"
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Duration</label>
              <select className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm">
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="6">6 hours</option>
                <option value="8">8 hours</option>
                <option value="12">12 hours (overnight)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Number of Children</label>
              <select className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm">
                <option value="1">1 child</option>
                <option value="2">2 children</option>
                <option value="3">3 children</option>
                <option value="4">4+ children</option>
              </select>
            </div>
          </div>

          {/* Children Information */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Children Details</label>
            <div className="space-y-2 sm:space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Child's name"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Age"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                />
                <select className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm">
                  <option>Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <button className="text-purple-600 hover:text-purple-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <FaPlus />
                Add Another Child
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Special Instructions & Requirements</label>
            <textarea
              rows={3}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
              placeholder="Any allergies, special needs, dietary restrictions, favorite activities, bedtime routines, or other important information..."
            ></textarea>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => setShowBookingForm(false)}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-xs sm:text-sm">
              Book Childcare
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (!patientData.childcareBookings || patientData.childcareBookings.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Empty State */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center border border-purple-200">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
            <FaBaby className="text-purple-500 text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Childcare Services</h3>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">Professional childcare services for your peace of mind</p>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base"
          >
            <FaPlus />
            Book Childcare Service
          </button>
        </div>

        {/* Service Features */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-pink-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center">
            <FaHeart className="mr-2 text-pink-500" />
            Our Childcare Activities
          </h3>
          
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 md:gap-4">
            {childcareActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-white/70 to-purple-50/70 border border-purple-200 rounded-lg sm:rounded-xl hover:border-purple-300 hover:from-white/90 hover:to-purple-100/90 transition">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <activity.icon className="text-purple-600 text-sm sm:text-base" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">{activity.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Nannies */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-yellow-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center">
            <FaAward className="mr-2 text-yellow-500" />
            Our Certified Nannies
          </h3>
          
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 md:gap-6">
            {availableNannies.map((nanny) => (
              <div key={nanny.id} className="bg-gradient-to-br from-white/70 to-orange-50/70 border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg mx-auto mb-2 sm:mb-3">
                    {nanny.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{nanny.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{nanny.experience} experience</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <FaStar className="text-yellow-500 text-xs sm:text-sm" />
                    <span className="font-medium text-gray-900 text-xs sm:text-sm">{nanny.rating}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-600 font-medium mt-1">{nanny.hourlyRate}</p>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {nanny.specialties.slice(0, 2).map((specialty, index) => (
                        <span key={index} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowBookingForm(true)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-xs sm:text-sm"
                  >
                    Book with {nanny.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Features */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
            <FaShieldAlt className="mr-2" />
            Safety & Trust Features
          </h3>
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <FaUserCheck className="text-xl sm:text-2xl mb-2" />
              <p className="font-medium text-sm sm:text-base">Background Verified</p>
              <p className="text-xs sm:text-sm opacity-90">All nannies thoroughly screened</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <FaFirstAid className="text-xl sm:text-2xl mb-2" />
              <p className="font-medium text-sm sm:text-base">First Aid Certified</p>
              <p className="text-xs sm:text-sm opacity-90">CPR and emergency training</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <FaCameraRetro className="text-xl sm:text-2xl mb-2" />
              <p className="font-medium text-sm sm:text-base">Photo Updates</p>
              <p className="text-xs sm:text-sm opacity-90">Regular activity photos</p>
            </div>
          </div>
        </div>

        {showBookingForm && renderBookingForm()}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
              <FaBaby className="mr-2 sm:mr-3" />
              Childcare Services
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Professional childcare for your little ones</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-center">
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg p-2 sm:p-3">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{patientData.childcareBookings.length}</p>
              <p className="text-xs opacity-90">Total Bookings</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg p-2 sm:p-3">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{patientData.childcareBookings.filter(b => b.status === 'upcoming').length}</p>
              <p className="text-xs opacity-90">Upcoming</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg p-2 sm:p-3">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{patientData.childcareBookings.filter(b => b.status === 'completed').length}</p>
              <p className="text-xs opacity-90">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-purple-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
            <input
              type="text"
              placeholder="Search nannies, children..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-sm sm:text-base"
            />
          </div>

          <button
            onClick={() => setShowBookingForm(true)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-500 text-white rounded-lg sm:rounded-xl hover:bg-purple-600 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaPlus />
            <span className="hidden sm:inline">Book Service</span>
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-lg sm:rounded-xl hover:from-gray-200 hover:to-slate-200 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaFilter />
            <span className="hidden sm:inline">Filters</span>
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-purple-200 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterOptions['type'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm sm:text-base"
            >
              <option value="all">All Types</option>
              <option value="regular">Regular Care</option>
              <option value="overnight">Overnight Care</option>
            </select>

            <select
              value={filters.nanny}
              onChange={(e) => setFilters({ ...filters, nanny: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm sm:text-base"
            >
              <option value="all">All Nannies</option>
              {nannies.map(nanny => (
                <option key={nanny} value={nanny}>{nanny}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Bookings List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredBookings.map((booking) => (
          <div 
            key={booking.id} 
            className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl sm:rounded-2xl shadow-lg border border-purple-200 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                {/* Booking Info */}
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg flex-shrink-0">
                    {booking.nannyName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{booking.nannyName}</h3>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span>{booking.status}</span>
                      </span>
                      {booking.type === 'overnight' && (
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">
                          <FaMoon className="inline mr-1" />
                          Overnight
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-purple-500" />
                        <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-blue-500" />
                        <span>{booking.time} ({booking.duration}h)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaChild className="text-pink-500" />
                        <span>{booking.children.length} {booking.children.length === 1 ? 'child' : 'children'}</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3">
                      <p className="text-xs sm:text-sm font-medium text-purple-800 mb-2">Children:</p>
                      <div className="space-y-1">
                        {booking.children.map((child, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <FaChild className="text-purple-500 text-xs sm:text-sm" />
                            <span className="text-purple-700 text-xs sm:text-sm">{child}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {booking.specialInstructions && (
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                        <p className="text-xs sm:text-sm font-medium text-yellow-800 mb-1 flex items-center">
                          <FaExclamationTriangle className="mr-1 sm:mr-2" />
                          Special Instructions:
                        </p>
                        <p className="text-yellow-700 text-xs sm:text-sm">{booking.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:flex-shrink-0">
                  {booking.status === 'upcoming' && (
                    <>
                      <button
                        onClick={onVideoCall}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-lg hover:from-green-100 hover:to-emerald-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <FaVideo />
                        <span className="hidden sm:inline">Video</span>
                      </button>
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <FaComments />
                        <span className="hidden sm:inline">Message</span>
                      </button>
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-600 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <FaEdit />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    </>
                  )}
                  
                  <button 
                    onClick={() => setExpandedBooking(
                      expandedBooking === booking.id ? null : booking.id
                    )}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 rounded-lg hover:from-gray-100 hover:to-slate-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                  >
                    <FaEye />
                    <span className="hidden sm:inline">{expandedBooking === booking.id ? 'Less' : 'Details'}</span>
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedBooking === booking.id && (
                <div className="mt-4 pt-4 border-t border-purple-200 space-y-3 sm:space-y-4">
                  <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 md:gap-4 lg:gap-6">
                    {/* Nanny Information */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h4 className="font-semibold text-purple-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <FaBaby className="mr-2" />
                        Nanny Information
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-700">Name:</span>
                          <span className="font-medium">{booking.nannyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700">Nanny ID:</span>
                          <span className="font-medium">{booking.nannyId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700">Service Type:</span>
                          <span className="font-medium capitalize">{booking.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h4 className="font-semibold text-blue-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <FaCalendarAlt className="mr-2" />
                        Booking Details
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Date & Time:</span>
                          <span className="font-medium">{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Duration:</span>
                          <span className="font-medium">{booking.duration} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Status:</span>
                          <span className="font-medium capitalize">{booking.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Photos */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold text-green-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                      <FaImage className="mr-2" />
                      Activity Updates
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          <FaSmile className="text-green-500 text-lg sm:text-xl" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-green-700 mt-2">Activity photos will be shared during the session</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg hover:from-green-200 hover:to-emerald-200 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <FaDownload />
                      Report
                    </button>
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <FaShare />
                      Photos
                    </button>
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-pink-200 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <FaFileAlt />
                      Activity Log
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-lg border border-purple-200">
            <FaSearch className="text-gray-400 text-2xl sm:text-3xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">No childcare bookings found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setFilters({ status: 'all', type: 'all', nanny: 'all' })
              }}
              className="mt-3 text-purple-600 hover:underline text-sm sm:text-base"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Nanny Chat Messages */}
      {patientData.chatHistory?.nannies && patientData.chatHistory.nannies.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-purple-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FaComments className="mr-2 text-purple-500" />
            Recent Nanny Communications
          </h3>
          <div className="space-y-2.5 sm:space-y-3">
            {patientData.chatHistory.nannies.map((nannyChat) => (
              <div key={nannyChat.nannyId} className="bg-gradient-to-r from-white/70 to-purple-50/70 border border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {nannyChat.nannyName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{nannyChat.nannyName}</h4>
                      <p className="text-xs text-gray-500">{nannyChat.lastMessageTime}</p>
                    </div>
                  </div>
                  {nannyChat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full">
                      {nannyChat.unreadCount} unread
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 bg-gradient-to-r from-white to-purple-50 rounded-lg p-2.5 sm:p-3 border">
                  {nannyChat.lastMessage}
                </p>
                <div className="mt-2 sm:mt-3 flex gap-2">
                  <button className="px-2.5 sm:px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition">
                    Reply
                  </button>
                  <button className="px-2.5 sm:px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition">
                    Video Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 md:gap-4">
          <button 
            onClick={() => setShowBookingForm(true)}
            className="w-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-purple-400/30 hover:to-pink-400/30 transition text-left"
          >
            <FaCalendarPlus className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">Book New Service</p>
            <p className="text-xs sm:text-sm opacity-90">Schedule childcare</p>
          </button>
          
          <button className="w-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-purple-400/30 hover:to-pink-400/30 transition text-left">
            <FaHandsHelping className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">Emergency Care</p>
            <p className="text-xs sm:text-sm opacity-90">Urgent childcare needs</p>
          </button>
          
          <button className="w-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-purple-400/30 hover:to-pink-400/30 transition text-left">
            <FaImage className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">Activity Gallery</p>
            <p className="text-xs sm:text-sm opacity-90">View all photos</p>
          </button>
          
          <button className="w-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-purple-400/30 hover:to-pink-400/30 transition text-left">
            <FaHistory className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">Care History</p>
            <p className="text-xs sm:text-sm opacity-90">All past services</p>
          </button>
        </div>
      </div>

      {showBookingForm && renderBookingForm()}
    </div>
  )
}

export default ChildcareServices