'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { nursesData, type Nurse } from '@/lib/data'
import { 
  FaArrowLeft, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, 
  FaPhone, FaEnvelope, FaHome, FaLanguage, FaCheckCircle, 
  FaCertificate, FaGraduationCap, FaBriefcase, FaUserNurse,
  FaDollarSign, FaExclamationCircle, FaComments, FaShieldAlt,
  FaHeartbeat, FaMedkit, FaHandHoldingHeart, FaBaby, FaPills
} from 'react-icons/fa'

export default function NurseDetailsPage() {
  const params = useParams()
  const nurseId = params.id as string
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability'>('overview')
  
  const nurse = nursesData.find(n => n.id === nurseId)
  
  if (!nurse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUserNurse className="text-6xl text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nurse Not Found</h1>
          <p className="text-gray-600 mb-6">The nurse you are looking for does not exist.</p>
          <Link href="/search/nurse" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/search/nurse" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4">
            <FaArrowLeft />
            Back to Search
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nurse Profile Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Image 
                    src={nurse.profileImage} 
                    alt={`${nurse.firstName} ${nurse.lastName}`}
                    width={120} 
                    height={120}
                    className="rounded-full object-cover border-4 border-teal-100"
                  />
                  {nurse.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                      <FaCheckCircle className="text-sm" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {nurse.firstName} {nurse.lastName}
                      </h1>
                      <p className="text-xl text-teal-600 font-medium mb-1">
                        {nurse.type}
                      </p>
                      <p className="text-lg text-gray-600 mb-2">
                        {nurse.specialization.join(', ')}
                      </p>
                      <p className="text-gray-600">{nurse.experience} experience</p>
                    </div>
                    {nurse.emergencyAvailable && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        Emergency Available
                      </span>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(Math.floor(nurse.rating))].map((_, i) => (
                        <FaStar key={i} className="text-lg" />
                      ))}
                      {nurse.rating % 1 !== 0 && <FaStar className="text-lg opacity-50" />}
                    </div>
                    <span className="text-lg font-semibold text-gray-700">{nurse.rating}</span>
                    <span className="text-gray-500">({nurse.reviews} reviews)</span>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-2 mb-4">
                    <FaLanguage className="text-teal-500" />
                    <span className="text-gray-600">Languages:</span>
                    <span className="font-medium">{nurse.languages.join(', ')}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-teal-500" />
                    <span className="text-gray-700">{nurse.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="border-b border-gray-200">
                <div className="flex">
                  {[
                    { id: 'overview', label: 'Overview', icon: FaUserNurse },
                    { id: 'reviews', label: 'Reviews', icon: FaComments },
                    { id: 'availability', label: 'Availability', icon: FaCalendarAlt }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as 'overview' | 'reviews' | 'availability')}
                      className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                        activeTab === id
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                      <p className="text-gray-700 leading-relaxed">{nurse.bio}</p>
                    </div>

                    {/* Specializations */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {nurse.specialization.map((specialty, index) => (
                          <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaGraduationCap className="text-teal-500" />
                        Education
                      </h3>
                      <ul className="space-y-2">
                        {nurse.education.map((edu, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Work History */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaBriefcase className="text-teal-500" />
                        Work Experience
                      </h3>
                      <ul className="space-y-2">
                        {nurse.workHistory.map((work, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{work}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaCertificate className="text-teal-500" />
                        Certifications
                      </h3>
                      <ul className="space-y-2">
                        {nurse.certifications.map((cert, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Services */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nurse.services.map((service, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                            {service.includes('Home') && <FaHome className="text-teal-500" />}
                            {service.includes('ICU') && <FaHeartbeat className="text-red-500" />}
                            {service.includes('Night') && <FaClock className="text-blue-500" />}
                            {service.includes('Emergency') && <FaExclamationCircle className="text-red-500" />}
                            {service.includes('Hospital') && <FaMedkit className="text-green-500" />}
                            {service.includes('Child') && <FaBaby className="text-pink-500" />}
                            {service.includes('Mental') && <FaHandHoldingHeart className="text-purple-500" />}
                            {service.includes('Medication') && <FaPills className="text-orange-500" />}
                            <span className="font-medium">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{nurse.rating}</div>
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                        {[...Array(Math.floor(nurse.rating))].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <p className="text-gray-600">Based on {nurse.reviews} reviews</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Feedback</h3>
                      <div className="space-y-4">
                        {nurse.patientComments.map((comment, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-1 text-yellow-500 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-sm" />
                              ))}
                            </div>
                            <p className="text-gray-700 italic">&ldquo;{comment}&ldquo;</p>
                            <p className="text-gray-500 text-sm mt-2">- Verified Patient</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Availability Tab */}
                {activeTab === 'availability' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Availability</h3>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-green-600" />
                          <span className="font-medium text-green-800">{nurse.nextAvailable}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Working Hours</h3>
                      <p className="text-gray-700">{nurse.availability}</p>
                    </div>

                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <h4 className="font-medium text-teal-900 mb-2">Service Information</h4>
                      <ul className="text-sm text-teal-800 space-y-1">
                        <li>• Available for home care services</li>
                        <li>• Emergency care available 24/7</li>
                        <li>• Flexible scheduling for long-term care</li>
                        <li>• Can provide medical equipment if needed</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Nursing Care</h3>
              
              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="text-lg font-bold text-green-600">${nurse.hourlyRate}</span>
                </div>
                <div className="text-xs text-gray-500">
                  *Rates may vary based on specific care requirements
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-teal-500" />
                  <a href={`tel:${nurse.phone}`} className="text-teal-600 hover:text-teal-700">
                    {nurse.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-teal-500" />
                  <a href={`mailto:${nurse.email}`} className="text-teal-600 hover:text-teal-700">
                    {nurse.email}
                  </a>
                </div>
              </div>

              {/* Book Button */}
              <Link 
                href={`/patient/home-nursing/book/${nurse.id}`}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalendarAlt />
                Book Nursing Care
              </Link>

              {/* Verification Badge */}
              {nurse.verified && (
                <div className="mt-4 flex items-center gap-2 text-green-600">
                  <FaShieldAlt />
                  <span className="text-sm font-medium">Verified Nurse</span>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{nurse.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium">{nurse.age} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Patients Cared</span>
                  <span className="font-medium">{nurse.reviews}+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Specializations</span>
                  <span className="font-medium">{nurse.specialization.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Emergency Available</span>
                  <span className={`font-medium ${nurse.emergencyAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                    {nurse.emergencyAvailable ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}