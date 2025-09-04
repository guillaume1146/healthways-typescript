'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { doctorsData, type Doctor } from '@/lib/data'
import { 
  FaArrowLeft, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, 
  FaPhone, FaEnvelope, FaVideo, FaHome, FaLanguage, FaCheckCircle, 
  FaCertificate, FaGraduationCap, FaBriefcase, FaAward, FaHeart,
  FaUserMd, FaDollarSign, FaExclamationCircle, FaComments,
  FaStethoscope, FaHospital, FaShieldAlt
} from 'react-icons/fa'

export default function DoctorDetailsPage() {
  const params = useParams()
  const doctorId = params.id as string

  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability'>('overview')
  
  const doctor = doctorsData.find(d => d.id === doctorId)
  
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h1>
          <p className="text-gray-600 mb-6">The doctor you&apos;re looking for doesn&apos;t exist..</p>
          <Link href="/search/doctors" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
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
          <Link href="/search/doctors" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <FaArrowLeft />
            Back to Search
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Profile Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Image 
                    src={doctor.profileImage} 
                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    width={120} 
                    height={120}
                    className="rounded-full object-cover border-4 border-blue-100"
                  />
                  {doctor.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                      <FaCheckCircle className="text-sm" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h1>
                      <p className="text-xl text-blue-600 font-medium mb-2">
                        {doctor.specialty.join(', ')}
                      </p>
                      <p className="text-gray-600">{doctor.experience} experience</p>
                    </div>
                    {doctor.emergencyAvailable && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        Emergency Available
                      </span>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(Math.floor(doctor.rating))].map((_, i) => (
                        <FaStar key={i} className="text-lg" />
                      ))}
                      {doctor.rating % 1 !== 0 && <FaStar className="text-lg opacity-50" />}
                    </div>
                    <span className="text-lg font-semibold text-gray-700">{doctor.rating}</span>
                    <span className="text-gray-500">({doctor.reviews} reviews)</span>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-2 mb-4">
                    <FaLanguage className="text-blue-500" />
                    <span className="text-gray-600">Languages:</span>
                    <span className="font-medium">{doctor.languages.join(', ')}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span className="text-gray-700">{doctor.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="border-b border-gray-200">
                <div className="flex">
                  {[
                    { id: 'overview', label: 'Overview', icon: FaUserMd },
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
                      <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specialty.map((specialty, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {specialty}
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
                        {doctor.education.map((edu, index) => (
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
                        {doctor.workHistory.map((work, index) => (
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
                        {doctor.certifications.map((cert, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Consultation Types */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Consultation Options</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {doctor.consultationTypes.map((type, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                            {type === 'Video Consultation' && <FaVideo className="text-blue-500" />}
                            {type === 'In-Person' && <FaHome className="text-green-500" />}
                            {type === 'Emergency' && <FaExclamationCircle className="text-red-500" />}
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
                      <div className="text-3xl font-bold text-gray-900 mb-2">{doctor.rating}</div>
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                        {[...Array(Math.floor(doctor.rating))].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <p className="text-gray-600">Based on {doctor.reviews} reviews</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Feedback</h3>
                      <div className="space-y-4">
                        {doctor.patientComments.map((comment, index) => (
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
                          <span className="font-medium text-green-800">{doctor.nextAvailable}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Working Hours</h3>
                      <p className="text-gray-700">{doctor.availability}</p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Quick Booking Tips</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Book in advance for regular consultations</li>
                        <li>• Emergency appointments available for urgent cases</li>
                        <li>• Video consultations available for follow-ups</li>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Consultation</h3>
              
              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">In-Person Consultation</span>
                  <span className="text-lg font-bold text-green-600">Rs {doctor.consultationFee.toLocaleString()}</span>
                </div>
                {doctor.videoConsultationFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Video Consultation</span>
                    <span className="text-lg font-bold text-green-600">Rs {doctor.videoConsultationFee.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-blue-500" />
                  <a href={`tel:${doctor.phone}`} className="text-blue-600 hover:text-blue-700">
                    {doctor.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-500" />
                  <a href={`mailto:${doctor.email}`} className="text-blue-600 hover:text-blue-700">
                    {doctor.email}
                  </a>
                </div>
              </div>

              {/* Book Button */}
              <Link 
                href={`/patient/doctor-consultations/${doctor.id}/book`}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalendarAlt />
                Book Consultation
              </Link>

              {/* Verification Badge */}
              {doctor.verified && (
                <div className="mt-4 flex items-center gap-2 text-green-600">
                  <FaShieldAlt />
                  <span className="text-sm font-medium">Verified Doctor</span>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{doctor.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium">{doctor.age} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Patients Treated</span>
                  <span className="font-medium">{doctor.reviews}+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Specializations</span>
                  <span className="font-medium">{doctor.specialty.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}