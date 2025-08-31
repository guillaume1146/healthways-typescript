'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaUserNurse, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, 
  FaPhone, FaEnvelope, FaLanguage, FaCheckCircle, FaShieldAlt,
  FaGraduationCap, FaCertificate, FaAward, FaHeart, FaComment,
  FaStethoscope, FaHospital, FaAmbulance, FaUserFriends,
  FaChevronLeft, FaChevronRight, FaQuoteLeft, FaFileDownload,
  FaVideo, FaWhatsapp, FaShareAlt, FaBookmark, FaExclamationTriangle
} from 'react-icons/fa'

// Type definitions
interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  verificationUrl?: string
  documentUrl?: string
}

interface Education {
  id: string
  degree: string
  institution: string
  year: string
  specialization?: string
}

interface Experience {
  id: string
  position: string
  organization: string
  duration: string
  location: string
  description: string
}

interface Review {
  id: string
  patientName: string
  patientAvatar: string
  rating: number
  date: string
  comment: string
  serviceType: string
  verified: boolean
}

interface Availability {
  day: string
  morning: boolean
  afternoon: boolean
  evening: boolean
  night: boolean
}

interface NurseProfile {
  id: string
  name: string
  type: string
  specialization: string
  qualification: string
  registrationNumber: string
  experience: string
  rating: number
  totalReviews: number
  completedServices: number
  responseTime: string
  location: string
  address: string
  languages: string[]
  hourlyRate: string
  weeklyRate: string
  monthlyRate: string
  bio: string
  avatar: string
  coverImage: string
  specialties: string[]
  certifications: Certification[]
  education: Education[]
  experiences: Experience[]
  services: string[]
  equipment: string[]
  verified: boolean
  emergencyAvailable: boolean
  instantBooking: boolean
  phone: string
  email: string
  whatsapp: string
  availability: Availability[]
  reviews: Review[]
  photos: string[]
  insuranceAccepted: string[]
  cancellationPolicy: string
  responseRate: number
  acceptanceRate: number
  repeatClientRate: number
}

// Mock data for demonstration
const mockNurseProfile: NurseProfile = {
  id: '1',
  name: 'Maria Thompson',
  type: 'Registered Nurse',
  specialization: 'Elderly Care Specialist',
  qualification: 'BSN, RN, CCRN',
  registrationNumber: 'RN-MU-2012-4567',
  experience: '12 years',
  rating: 4.9,
  totalReviews: 342,
  completedServices: 1250,
  responseTime: '< 1 hour',
  location: 'Port Louis',
  address: 'Central Healthcare Services, Royal Street, Port Louis',
  languages: ['English', 'French', 'Creole', 'Hindi'],
  hourlyRate: '$45',
  weeklyRate: '$1,500',
  monthlyRate: '$5,500',
  bio: 'I am a dedicated registered nurse with over 12 years of experience specializing in elderly care. My passion lies in providing compassionate, high-quality care to seniors, helping them maintain their dignity and quality of life. I have extensive experience in managing chronic conditions, dementia care, and providing emotional support to both patients and their families. My approach combines professional medical expertise with genuine empathy and respect for each individual\'s unique needs.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=e0f2fe',
  coverImage: '/images/nurse-cover.png',
  specialties: [
    'Elderly Care',
    'Dementia Care',
    'Palliative Care',
    'Medication Management',
    'Wound Care',
    'Diabetes Management',
    'Mobility Assistance',
    'Post-Stroke Care'
  ],
  certifications: [
    {
      id: '1',
      name: 'Critical Care Registered Nurse (CCRN)',
      issuer: 'American Association of Critical-Care Nurses',
      issueDate: '2020-03-15',
      expiryDate: '2025-03-15',
      verificationUrl: 'https://verify.aacn.org',
      documentUrl: '/docs/ccrn-cert.pdf'
    },
    {
      id: '2',
      name: 'Geriatric Nursing Certification',
      issuer: 'Gerontological Nursing Certification Commission',
      issueDate: '2019-06-20',
      expiryDate: '2024-06-20',
      verificationUrl: 'https://verify.gncc.org',
      documentUrl: '/docs/geriatric-cert.pdf'
    },
    {
      id: '3',
      name: 'Basic Life Support (BLS)',
      issuer: 'American Heart Association',
      issueDate: '2023-01-10',
      expiryDate: '2025-01-10',
      verificationUrl: 'https://verify.heart.org',
      documentUrl: '/docs/bls-cert.pdf'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Nursing',
      institution: 'University of Mauritius',
      year: '2012',
      specialization: 'Critical Care Nursing'
    },
    {
      id: '2',
      degree: 'Advanced Diploma in Geriatric Care',
      institution: 'Mauritius Institute of Health',
      year: '2015',
      specialization: 'Elderly Care Management'
    }
  ],
  experiences: [
    {
      id: '1',
      position: 'Senior Registered Nurse',
      organization: 'Central Healthcare Services',
      duration: '2018 - Present',
      location: 'Port Louis',
      description: 'Leading a team of nurses in providing comprehensive elderly care services, including home visits, medication management, and care coordination.'
    },
    {
      id: '2',
      position: 'ICU Nurse',
      organization: 'Apollo Bramwell Hospital',
      duration: '2014 - 2018',
      location: 'Moka',
      description: 'Provided critical care to patients in the intensive care unit, managing ventilators, monitoring vital signs, and coordinating with medical teams.'
    },
    {
      id: '3',
      position: 'Staff Nurse',
      organization: 'Sir Seewoosagur Ramgoolam National Hospital',
      duration: '2012 - 2014',
      location: 'Pamplemousses',
      description: 'General nursing duties in medical-surgical wards, gaining experience in various medical conditions and patient care protocols.'
    }
  ],
  services: [
    'Home Care',
    'Hospital Care',
    'Night Shift Available',
    'Weekend Available',
    'Emergency Response'
  ],
  equipment: [
    'Blood Pressure Monitor',
    'Glucometer',
    'Pulse Oximeter',
    'Thermometer',
    'Stethoscope',
    'First Aid Kit',
    'Nebulizer',
    'Wheelchair'
  ],
  verified: true,
  emergencyAvailable: true,
  instantBooking: true,
  phone: '+230 5789 0123',
  email: 'maria.t@healthcare.mu',
  whatsapp: '+230 5789 0123',
  availability: [
    { day: 'Monday', morning: true, afternoon: true, evening: true, night: true },
    { day: 'Tuesday', morning: true, afternoon: true, evening: true, night: true },
    { day: 'Wednesday', morning: true, afternoon: true, evening: true, night: true },
    { day: 'Thursday', morning: true, afternoon: true, evening: true, night: true },
    { day: 'Friday', morning: true, afternoon: true, evening: true, night: true },
    { day: 'Saturday', morning: true, afternoon: true, evening: true, night: false },
    { day: 'Sunday', morning: true, afternoon: true, evening: false, night: false }
  ],
  reviews: [
    {
      id: '1',
      patientName: 'John Smith',
      patientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      rating: 5,
      date: '2024-01-15',
      comment: 'Maria has been taking care of my elderly mother for the past 6 months. She is incredibly professional, caring, and goes above and beyond. My mother\'s health has improved significantly under her care.',
      serviceType: 'Elderly Care',
      verified: true
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      patientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      rating: 5,
      date: '2024-01-10',
      comment: 'Excellent post-surgery care. Maria helped me recover quickly with her expertise in wound care and pain management. Highly recommended!',
      serviceType: 'Post-Surgery Care',
      verified: true
    },
    {
      id: '3',
      patientName: 'Robert Chen',
      patientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
      rating: 4,
      date: '2023-12-20',
      comment: 'Very knowledgeable and patient. Maria helped manage my father\'s diabetes and taught us how to monitor his condition effectively.',
      serviceType: 'Diabetes Management',
      verified: true
    }
  ],
  photos: [
    '/images/nurse-work-1.png',
    '/images/nurse-work-2.png',
    '/images/nurse-work-3.png',
    '/images/nurse-work-4.png'
  ],
  insuranceAccepted: [
    'Swan Insurance',
    'Mauritius Union',
    'SICOM',
    'Jubilee Insurance',
    'Private Pay'
  ],
  cancellationPolicy: 'Free cancellation up to 24 hours before the appointment. 50% charge for cancellations within 24 hours.',
  responseRate: 98,
  acceptanceRate: 92,
  repeatClientRate: 85
}

export default function NurseProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [nurse] = useState<NurseProfile>(mockNurseProfile)
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'credentials' | 'availability'>('overview')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${nurse.name} - Professional Nurse`,
        text: `Check out ${nurse.name}\'s profile on HealthWays`,
        url: window.location.href
      })
    }
  }

  const handleSaveProfile = () => {
    setSavedProfile(!savedProfile)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-500" />)
    }
    if (hasHalfStar && fullStars < 5) {
      stars.push(<FaStar key="half-star" className="text-yellow-500 opacity-50" />)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />)
    }
    return stars
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-64 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 h-full flex items-center">
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <FaChevronLeft className="text-xl" />
          </button>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <FaShareAlt className="text-xl" />
            </button>
            <button
              onClick={handleSaveProfile}
              className={`${savedProfile ? 'bg-yellow-500' : 'bg-white/20'} backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors`}
            >
              <FaBookmark className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-teal-100 to-teal-200"
                  style={{ backgroundImage: `url(${nurse.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                {nurse.verified && (
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 border-2 border-white">
                    <FaCheckCircle className="text-white text-lg" />
                  </div>
                )}
                {nurse.emergencyAvailable && (
                  <div className="absolute top-0 right-0 bg-red-500 rounded-full p-2 border-2 border-white">
                    <FaAmbulance className="text-white text-lg" />
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{nurse.rating}</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{nurse.totalReviews}</p>
                  <p className="text-xs text-gray-500">Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{nurse.completedServices}</p>
                  <p className="text-xs text-gray-500">Services</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {nurse.name}
                    {nurse.verified && (
                      <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-normal">
                        Verified Professional
                      </span>
                    )}
                  </h1>
                  <p className="text-xl text-teal-600 font-medium mt-1">{nurse.specialization}</p>
                  <p className="text-gray-600 mt-1">{nurse.type} • {nurse.qualification}</p>
                  <p className="text-sm text-gray-500 mt-1">Registration: {nurse.registrationNumber}</p>
                  
                  <div className="flex items-center gap-1 mt-3">
                    {renderStars(nurse.rating)}
                    <span className="ml-2 text-gray-600">({nurse.totalReviews} reviews)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaClock className="text-teal-500" />
                      <span>{nurse.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaMapMarkerAlt className="text-teal-500" />
                      <span>{nurse.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaLanguage className="text-teal-500" />
                      <span>{nurse.languages.join(', ')}</span>
                    </div>
                  </div>

                  {/* Service Badges */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {nurse.instantBooking && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        Instant Booking
                      </span>
                    )}
                    {nurse.emergencyAvailable && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                        Emergency Available
                      </span>
                    )}
                    {nurse.services.includes('Night Shift Available') && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        Night Shifts
                      </span>
                    )}
                    {nurse.services.includes('Weekend Available') && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                        Weekends
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="bg-gray-50 rounded-xl p-4 min-w-[200px]">
                  <p className="text-sm text-gray-500 mb-2">Starting from</p>
                  <p className="text-3xl font-bold text-gray-900">{nurse.hourlyRate}</p>
                  <p className="text-sm text-gray-600 mb-3">per hour</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weekly:</span>
                      <span className="font-medium">{nurse.weeklyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly:</span>
                      <span className="font-medium">{nurse.monthlyRate}</span>
                    </div>
                  </div>
                  <Link 
                    href={`/patient/home-nursing/book/${nurse.id}`}
                    className="mt-4 w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                  >
                    <FaCalendarAlt />
                    Book Now
                  </Link>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <p className="text-gray-700 leading-relaxed">{nurse.bio}</p>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <a href={`tel:${nurse.phone}`} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                  <FaPhone />
                  Call Now
                </a>
                <a href={`mailto:${nurse.email}`} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <FaEnvelope />
                  Email
                </a>
                <a href={`https://wa.me/${nurse.whatsapp.replace(/\s+/g, '')}`} className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
                  <FaWhatsapp />
                  WhatsApp
                </a>
                <button className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors">
                  <FaVideo />
                  Video Consult
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">{nurse.responseRate}%</p>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-xs text-gray-500 mt-1">{nurse.responseTime}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">{nurse.acceptanceRate}%</p>
              <p className="text-sm text-gray-600">Acceptance Rate</p>
              <p className="text-xs text-gray-500 mt-1">Very High</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">{nurse.repeatClientRate}%</p>
              <p className="text-sm text-gray-600">Repeat Clients</p>
              <p className="text-xs text-gray-500 mt-1">Excellent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">{nurse.completedServices}+</p>
              <p className="text-sm text-gray-600">Completed Services</p>
              <p className="text-xs text-gray-500 mt-1">Experienced</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-lg mt-6 p-2">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-teal-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'credentials' 
                  ? 'bg-teal-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Credentials & Experience
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'reviews' 
                  ? 'bg-teal-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Reviews ({nurse.totalReviews})
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'availability' 
                  ? 'bg-teal-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Availability
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Specialties */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaStethoscope className="text-teal-600" />
                  Specialties & Services
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {nurse.specialties.map((specialty, index) => (
                    <div key={index} className="bg-teal-50 text-teal-700 px-4 py-2 rounded-lg text-center font-medium">
                      {specialty}
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Offered */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaHeart className="text-red-500" />
                  Services Offered
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nurse.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment Available */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaStethoscope className="text-blue-600" />
                  Medical Equipment Available
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {nurse.equipment.map((item, index) => (
                    <div key={index} className="bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm text-center">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-green-600" />
                  Insurance Accepted
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {nurse.insuranceAccepted.map((insurance, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      <span className="text-gray-700">{insurance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FaExclamationTriangle className="text-yellow-600" />
                  Cancellation Policy
                </h2>
                <p className="text-gray-700">{nurse.cancellationPolicy}</p>
              </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-6">
              {/* Certifications */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCertificate className="text-yellow-600" />
                  Certifications
                </h2>
                <div className="space-y-4">
                  {nurse.certifications.map((cert) => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{cert.issuer}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                            <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {cert.verificationUrl && (
                            <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                              <FaCheckCircle />
                            </a>
                          )}
                          {cert.documentUrl && (
                            <a href={cert.documentUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700">
                              <FaFileDownload />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-blue-600" />
                  Education
                </h2>
                <div className="space-y-4">
                  {nurse.education.map((edu) => (
                    <div key={edu.id} className="border-l-4 border-blue-600 pl-4">
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      {edu.specialization && (
                        <p className="text-sm text-gray-500 mt-1">Specialization: {edu.specialization}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">Graduated: {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaHospital className="text-purple-600" />
                  Professional Experience
                </h2>
                <div className="space-y-6">
                  {nurse.experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-8">
                      <div className="absolute left-0 top-2 w-3 h-3 bg-purple-600 rounded-full"></div>
                      <div className="absolute left-1.5 top-5 w-0.5 h-full bg-purple-200"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-teal-600 font-medium">{exp.organization}</p>
                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <FaClock className="text-xs" />
                            {exp.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-xs" />
                            {exp.location}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-2">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Reviews Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  Patient Reviews
                </h2>
                
                {/* Rating Summary */}
                <div className="flex items-center gap-8 mb-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-gray-900">{nurse.rating}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {renderStars(nurse.rating)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{nurse.totalReviews} reviews</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const percentage = stars === 5 ? 75 : stars === 4 ? 20 : stars === 3 ? 5 : 0
                        return (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-3">{stars}</span>
                            <FaStar className="text-yellow-500 text-sm" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-10">{percentage}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {(showAllReviews ? nurse.reviews : nurse.reviews.slice(0, 3)).map((review) => (
                    <div key={review.id} className="border-t pt-4">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-full bg-gray-200"
                          style={{ backgroundImage: `url(${review.patientAvatar})`, backgroundSize: 'cover' }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                {review.patientName}
                                {review.verified && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Verified Patient
                                  </span>
                                )}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  {renderStars(review.rating)}
                                </span>
                                <span>{new Date(review.date).toLocaleDateString()}</span>
                                <span className="text-teal-600">{review.serviceType}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <FaQuoteLeft className="text-gray-300 mb-2" />
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {nurse.reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
                  >
                    {showAllReviews ? 'Show Less' : `Show All ${nurse.reviews.length} Reviews`}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="space-y-6">
              {/* Weekly Schedule */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-teal-600" />
                  Weekly Availability
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 text-gray-600 font-medium">Day</th>
                        <th className="text-center py-2 px-3 text-gray-600 font-medium">Morning<br/><span className="text-xs font-normal">6AM-12PM</span></th>
                        <th className="text-center py-2 px-3 text-gray-600 font-medium">Afternoon<br/><span className="text-xs font-normal">12PM-6PM</span></th>
                        <th className="text-center py-2 px-3 text-gray-600 font-medium">Evening<br/><span className="text-xs font-normal">6PM-10PM</span></th>
                        <th className="text-center py-2 px-3 text-gray-600 font-medium">Night<br/><span className="text-xs font-normal">10PM-6AM</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {nurse.availability.map((day, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-3 font-medium text-gray-900">{day.day}</td>
                          <td className="text-center py-3 px-3">
                            {day.morning ? (
                              <span className="inline-block w-6 h-6 bg-green-500 rounded-full">
                                <FaCheckCircle className="text-white w-full h-full p-1" />
                              </span>
                            ) : (
                              <span className="inline-block w-6 h-6 bg-gray-300 rounded-full"></span>
                            )}
                          </td>
                          <td className="text-center py-3 px-3">
                            {day.afternoon ? (
                              <span className="inline-block w-6 h-6 bg-green-500 rounded-full">
                                <FaCheckCircle className="text-white w-full h-full p-1" />
                              </span>
                            ) : (
                              <span className="inline-block w-6 h-6 bg-gray-300 rounded-full"></span>
                            )}
                          </td>
                          <td className="text-center py-3 px-3">
                            {day.evening ? (
                              <span className="inline-block w-6 h-6 bg-green-500 rounded-full">
                                <FaCheckCircle className="text-white w-full h-full p-1" />
                              </span>
                            ) : (
                              <span className="inline-block w-6 h-6 bg-gray-300 rounded-full"></span>
                            )}
                          </td>
                          <td className="text-center py-3 px-3">
                            {day.night ? (
                              <span className="inline-block w-6 h-6 bg-green-500 rounded-full">
                                <FaCheckCircle className="text-white w-full h-full p-1" />
                              </span>
                            ) : (
                              <span className="inline-block w-6 h-6 bg-gray-300 rounded-full"></span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium mb-2">Quick Booking Options:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      Today
                    </button>
                    <button className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      Tomorrow
                    </button>
                    <button className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      This Week
                    </button>
                    <button className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      Emergency Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Booking Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Instant Booking Available</p>
                      <p className="text-gray-600">Book immediately without waiting for confirmation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">24/7 Emergency Service</p>
                      <p className="text-gray-600">Available for urgent care needs anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Flexible Scheduling</p>
                      <p className="text-gray-600">Can accommodate special timing requests</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Bar for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden z-50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-gray-900">{nurse.hourlyRate}</p>
              <p className="text-xs text-gray-500">per hour</p>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(nurse.rating)}
              <span className="text-sm text-gray-600 ml-1">({nurse.totalReviews})</span>
            </div>
          </div>
          <Link 
            href={`/patient/home-nursing/book/${nurse.id}`}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <FaCalendarAlt />
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}