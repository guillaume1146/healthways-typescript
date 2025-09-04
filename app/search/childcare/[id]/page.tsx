'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { nanniesData, type Nanny } from '@/lib/data'
import { 
  FaArrowLeft, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, 
  FaPhone, FaEnvelope, FaHome, FaLanguage, FaCheckCircle, 
  FaCertificate, FaGraduationCap, FaBriefcase, FaBaby,
  FaDollarSign, FaComments, FaShieldAlt, FaUserCheck,
  FaChild, FaHeart, FaCar, FaGamepad, FaRunning,
  FaHandHoldingHeart, FaIdCard, FaUsers
} from 'react-icons/fa'

export default function NannyDetailsPage() {
  const params = useParams()
  const nannyId = params.id as string

  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability'>('overview')
  
  const nanny = nanniesData.find(n => n.id === nannyId)
  
  if (!nanny) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBaby className="text-6xl text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Caregiver Not Found</h1>
          <p className="text-gray-600 mb-6">The caregiver you are looking for does not exist.</p>
          <Link href="/search/childcare" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
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
          <Link href="/search/childcare" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
            <FaArrowLeft />
            Back to Search
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nanny Profile Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Image 
                    src={nanny.profileImage} 
                    alt={`${nanny.firstName} ${nanny.lastName}`}
                    width={120} 
                    height={120}
                    className="rounded-full object-cover border-4 border-purple-100"
                  />
                  {nanny.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                      <FaCheckCircle className="text-sm" />
                    </div>
                  )}
                  {nanny.backgroundCheck && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-2">
                      <FaShieldAlt className="text-sm" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {nanny.firstName} {nanny.lastName}
                      </h1>
                      <p className="text-xl text-purple-600 font-medium mb-1">
                        {nanny.type}
                      </p>
                      <p className="text-lg text-gray-600 mb-2">
                        {nanny.specialization.join(', ')}
                      </p>
                      <p className="text-gray-600">{nanny.experience} experience</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {nanny.verified && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          Verified
                        </span>
                      )}
                      {nanny.backgroundCheck && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          Background Check
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(Math.floor(nanny.rating))].map((_, i) => (
                        <FaStar key={i} className="text-lg" />
                      ))}
                      {nanny.rating % 1 !== 0 && <FaStar className="text-lg opacity-50" />}
                    </div>
                    <span className="text-lg font-semibold text-gray-700">{nanny.rating}</span>
                    <span className="text-gray-500">({nanny.reviews} reviews)</span>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-2 mb-4">
                    <FaLanguage className="text-purple-500" />
                    <span className="text-gray-600">Languages:</span>
                    <span className="font-medium">{nanny.languages.join(', ')}</span>
                  </div>

                  {/* Age Groups */}
                  <div className="flex items-center gap-2 mb-4">
                    <FaChild className="text-purple-500" />
                    <span className="text-gray-600">Age Groups:</span>
                    <span className="font-medium">{nanny.ageGroups.join(', ')}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-purple-500" />
                    <span className="text-gray-700">{nanny.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="border-b border-gray-200">
                <div className="flex">
                  {[
                    { id: 'overview', label: 'Overview', icon: FaBaby },
                    { id: 'reviews', label: 'Reviews', icon: FaComments },
                    { id: 'availability', label: 'Availability', icon: FaCalendarAlt }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as 'overview' | 'reviews' | 'availability')}
                      className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                        activeTab === id
                          ? 'border-purple-500 text-purple-600'
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
                      <p className="text-gray-700 leading-relaxed">{nanny.bio}</p>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaGraduationCap className="text-purple-500" />
                        Education & Training
                      </h3>
                      <ul className="space-y-2">
                        {nanny.education.map((edu, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Work History */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaBriefcase className="text-purple-500" />
                        Work Experience
                      </h3>
                      <ul className="space-y-2">
                        {nanny.workHistory.map((work, index) => (
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
                        <FaCertificate className="text-purple-500" />
                        Certifications
                      </h3>
                      <ul className="space-y-2">
                        {nanny.certifications.map((cert, index) => (
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
                        {nanny.services.map((service, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                            {service.includes('Full-time') && <FaClock className="text-purple-500" />}
                            {service.includes('Live-in') && <FaHome className="text-blue-500" />}
                            {service.includes('24/7') && <FaShieldAlt className="text-red-500" />}
                            {service.includes('Weekend') && <FaCalendarAlt className="text-green-500" />}
                            {service.includes('Travel') && <FaCar className="text-orange-500" />}
                            {service.includes('Special') && <FaHeart className="text-pink-500" />}
                            <span className="font-medium">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activities */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaGamepad className="text-purple-500" />
                        Activities & Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {nanny.activities.map((activity, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{nanny.rating}</div>
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                        {[...Array(Math.floor(nanny.rating))].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <p className="text-gray-600">Based on {nanny.reviews} reviews</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent Feedback</h3>
                      <div className="space-y-4">
                        {nanny.patientComments.map((comment, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-1 text-yellow-500 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-sm" />
                              ))}
                            </div>
                            <p className="text-gray-700 italic">&ldquo;{comment}&ldquo;</p>
                            <p className="text-gray-500 text-sm mt-2">- Verified Parent</p>
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
                          <span className="font-medium text-green-800">{nanny.nextAvailable}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Working Hours</h3>
                      <p className="text-gray-700">{nanny.availability}</p>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Service Information</h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Flexible scheduling available</li>
                        <li>• Emergency care can be arranged</li>
                        <li>• Travel care for family vacations</li>
                        <li>• References available upon request</li>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Childcare</h3>
              
              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="text-lg font-bold text-green-600">${nanny.hourlyRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly Rate</span>
                  <span className="text-lg font-bold text-green-600">${nanny.monthlyRate}</span>
                </div>
                <div className="text-xs text-gray-500">
                  *Rates may vary based on specific requirements
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-purple-500" />
                  <a href={`tel:${nanny.phone}`} className="text-purple-600 hover:text-purple-700">
                    {nanny.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-purple-500" />
                  <a href={`mailto:${nanny.email}`} className="text-purple-600 hover:text-purple-700">
                    {nanny.email}
                  </a>
                </div>
              </div>

              {/* Book Button */}
              <Link 
                href={`/patient/nanny-booking/${nanny.id}`}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalendarAlt />
                Book Childcare
              </Link>

              {/* Verification Badges */}
              <div className="mt-4 space-y-2">
                {nanny.verified && (
                  <div className="flex items-center gap-2 text-green-600">
                    <FaCheckCircle />
                    <span className="text-sm font-medium">Verified Caregiver</span>
                  </div>
                )}
                {nanny.backgroundCheck && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <FaShieldAlt />
                    <span className="text-sm font-medium">Background Checked</span>
                  </div>
                )}
                {nanny.transportAvailable && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <FaCar />
                    <span className="text-sm font-medium">Own Transportation</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{nanny.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium">{nanny.age} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Families Served</span>
                  <span className="font-medium">{nanny.reviews}+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">References</span>
                  <span className="font-medium">{nanny.references}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Age Groups</span>
                  <span className="font-medium">{nanny.ageGroups.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Activities</span>
                  <span className="font-medium">{nanny.activities.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}