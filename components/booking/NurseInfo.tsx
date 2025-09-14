import Image from 'next/image'
import { FaStar, FaMapMarkerAlt, FaHospital, FaLanguage, FaCertificate } from 'react-icons/fa'
import type { Nurse } from '@/lib/data'

interface NurseInfoProps {
  nurse: Nurse
  onNext: () => void
}

export default function NurseInfo({ nurse, onNext }: NurseInfoProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nurse Information</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="text-center">
              <Image 
                src={nurse.profileImage} 
                alt={`${nurse.firstName} ${nurse.lastName}`}
                width={200} 
                height={200}
                className="rounded-full object-cover border-4 border-blue-100 mx-auto mb-4"
              />
              <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                <FaStar />
                <span className="font-bold text-lg">{nurse.rating}</span>
                <span className="text-gray-600 text-sm">({nurse.reviews} reviews)</span>
              </div>
              {nurse.verified && (
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <FaCertificate />
                  Verified Professional
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:w-2/3">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {nurse.firstName} {nurse.lastName}
            </h3>
            <p className="text-lg text-blue-600 font-semibold mb-3">
              {nurse.specialization.join(', ')}
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                <p className="text-gray-600">{nurse.experience}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Service Rates</h4>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-green-600">
                    In-Person: Rs {nurse.hourlyRate}/hour
                  </p>
                  {nurse.videoConsultationRate > 0 && (
                    <p className="text-lg font-bold text-green-600">
                      Video: Rs {nurse.videoConsultationRate}/hour
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaLanguage className="text-blue-500" />
                  Languages
                </h4>
                <p className="text-gray-600">{nurse.languages.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Professional Type</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FaHospital className="text-blue-500" />
                Clinic Affiliation
              </h4>
              <p className="text-gray-600">{nurse.clinicAffiliation}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                Location
              </h4>
              <p className="text-gray-600">{nurse.address}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Sub-specialties</h4>
              <div className="flex flex-wrap gap-2">
                {nurse.subSpecialties.map((subSpecialty, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {subSpecialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Services Offered</h4>
              <div className="flex flex-wrap gap-2">
                {nurse.services.map((service, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
              <p className="text-gray-600">{nurse.availability}</p>
              <p className="text-sm text-blue-600 font-medium mt-1">Next Available: {nurse.nextAvailable}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About</h4>
              <p className="text-gray-600 leading-relaxed">{nurse.bio}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Continue to Schedule
          </button>
        </div>
      </div>
    </div>
  )
}