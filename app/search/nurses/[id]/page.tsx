'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { nursesData, type Nurse } from '@/lib/data'
import { 
  FaArrowLeft, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, 
  FaPhone, FaEnvelope, FaVideo, FaHome, FaLanguage, FaCheckCircle, 
  FaCertificate, FaGraduationCap, FaBriefcase, FaAward, FaHeart,
  FaUserNurse, FaDollarSign, FaExclamationCircle, FaComments,
  FaStethoscope, FaHospital, FaShieldAlt, FaUser, FaCalendar
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
          <Link href="/search/nurses" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
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
          <Link href="/search/nurses" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
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
                    className="rounded-full object-cover border-4 border-blue-100"
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
                      <p className="text-xl text-blue-600 font-medium mb-2">
                        {nurse.specialization.join(', ')}
                      </p>
                      <p className="text-gray-600">{nurse.experience} experience</p>
                      
                      {/* Type Badge */}
                      <div className="mt-2">
                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                          nurse.type === 'Registered Nurse' 
                            ? 'bg-purple-100 text-purple-700' 
                            : nurse.type === 'Licensed Practical Nurse'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {nurse.type}
                        </span>
                      </div>
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
                    <FaLanguage className="text-blue-500" />
                    <span className="text-gray-600">Languages:</span>
                    <span className="font-medium">{nurse.languages.join(', ')}</span>
                  </div>

                  {/* Clinic Affiliation */}
                  <div className="flex items-center gap-2 mb-4">
                    <FaHospital className="text-blue-500" />
                    <span className="text-gray-600">Affiliation:</span>
                    <span className="font-medium">{nurse.clinicAffiliation}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" />
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
                          ? 'border-blue-500 text-blue-600'
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

                    {/* Specializations & Sub-specialties */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-md font-medium text-gray-800 mb-2">Primary Specializations</h4>
                          <div className="flex flex-wrap gap-2">
                            {nurse.specialization.map((specialization, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {specialization}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-md font-medium text-gray-800 mb-2">Sub-specialties</h4>
                          <div className="flex flex-wrap gap-2">
                            {nurse.subSpecialties.map((subSpecialty, index) => (
                              <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                {subSpecialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h3>
                      <div className="flex flex-wrap gap-2">
                        {nurse.services.map((service, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaGraduationCap className="text-blue-500" />
                        Education
                      </h3>
                      <ul className="space-y-2">
                        {nurse.education.map((edu, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Work History */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaBriefcase className="text-blue-500" />
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
                        <FaCertificate className="text-blue-500" />
                        Certifications & Awards
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

                    {/* Consultation Types */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Options</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {nurse.consultationTypes.map((type, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                            {type === 'Video Consultation' && <FaVideo className="text-blue-500" />}
                            {type === 'In-Person' && <FaHome className="text-green-500" />}
                            {type === 'Home Visit' && <FaHome className="text-purple-500" />}
                            <span className="font-medium">{type}</span>
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
                        {nurse.patientComments.map((comment) => (
                          <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-4">
                              <Image 
                                src={comment.patientProfileImage} 
                                alt={`${comment.patientFirstName} ${comment.patientLastName}`}
                                width={40} 
                                height={40}
                                className="rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">
                                    {comment.patientFirstName} {comment.patientLastName}
                                  </h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>{comment.date}</span>
                                    <span>{comment.time}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                  {[...Array(comment.starRating)].map((_, i) => (
                                    <FaStar key={i} className="text-sm" />
                                  ))}
                                  {[...Array(5 - comment.starRating)].map((_, i) => (
                                    <FaStar key={i} className="text-sm text-gray-300" />
                                  ))}
                                </div>
                                <p className="text-gray-700 italic">&quot;{comment.comment}&quot;</p>
                              </div>
                            </div>
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

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Quick Booking Tips</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Book in advance for regular care services</li>
                        <li>• Emergency services available for urgent cases</li>
                        <li>• Video consultations available for follow-ups</li>
                        <li>• Home visits available in selected areas</li>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Nursing Service</h3>
              
              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="text-lg font-bold text-green-600">Rs {nurse.hourlyRate}/hr</span>
                </div>
                {nurse.videoConsultationRate > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Video Consultation Rate</span>
                    <span className="text-lg font-bold text-green-600">Rs {nurse.videoConsultationRate}/hr</span>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-blue-500" />
                  <a href={`tel:${nurse.phone}`} className="text-blue-600 hover:text-blue-700">
                    {nurse.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-500" />
                  <a href={`mailto:${nurse.email}`} className="text-blue-600 hover:text-blue-700 text-sm">
                    {nurse.email}
                  </a>
                </div>
              </div>

              {/* Book Button */}
              <Link 
                href={`/booking/nurses/${nurse.id}`}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalendarAlt />
                Book Nursing Service
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
                  <span className="text-gray-600">Patients Served</span>
                  <span className="font-medium">{nurse.reviews}+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Specializations</span>
                  <span className="font-medium">{nurse.specialization.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Services</span>
                  <span className="font-medium">{nurse.services.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}