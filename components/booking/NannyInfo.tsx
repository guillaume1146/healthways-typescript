// ===== NannyInfo.tsx =====
import Image from 'next/image'
import { FaStar, FaMapMarkerAlt, FaUsers, FaLanguage, FaCertificate, FaClock } from 'react-icons/fa'
import type { Nanny } from '@/lib/data'

interface NannyInfoProps {
  nanny: Nanny
  onNext: () => void
}

export function NannyInfo({ nanny, onNext }: NannyInfoProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nanny Information</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="text-center">
              <Image 
                src={nanny.profileImage} 
                alt={`${nanny.firstName} ${nanny.lastName}`}
                width={200} 
                height={200}
                className="rounded-full object-cover border-4 border-purple-100 mx-auto mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${nanny.firstName}+${nanny.lastName}&background=random&color=fff&size=200`;
                }}
              />
              <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                <FaStar />
                <span className="font-bold text-lg">{nanny.rating}</span>
                <span className="text-gray-600 text-sm">({nanny.reviews} reviews)</span>
              </div>
              {nanny.verified && (
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <FaCertificate />
                  Verified Professional
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:w-2/3">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {nanny.firstName} {nanny.lastName}
            </h3>
            <p className="text-lg text-purple-600 font-semibold mb-3">
              {nanny.specialization.join(', ')}
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                <p className="text-gray-600">{nanny.experience}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Service Rates</h4>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-green-600">
                    Hourly: Rs {nanny.hourlyRate}/hour
                  </p>
                  {nanny.overnightRate > 0 && (
                    <p className="text-lg font-bold text-green-600">
                      Overnight: Rs {nanny.overnightRate}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaLanguage className="text-purple-500" />
                  Languages
                </h4>
                <p className="text-gray-600">{nanny.languages.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaUsers className="text-purple-500" />
                  Capacity
                </h4>
                <p className="text-gray-600">Maximum {nanny.maxChildren} children</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Age Groups Served</h4>
              <div className="flex flex-wrap gap-2">
                {nanny.ageGroups.map((ageGroup, index) => (
                  <span key={index} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                    {ageGroup}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-purple-500" />
                Location
              </h4>
              <p className="text-gray-600">{nanny.address}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Sub-specialties</h4>
              <div className="flex flex-wrap gap-2">
                {nanny.subSpecialties.map((subSpecialty, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {subSpecialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Services Offered</h4>
              <div className="flex flex-wrap gap-2">
                {nanny.services.map((service, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FaClock className="text-purple-500" />
                Availability
              </h4>
              <p className="text-gray-600">{nanny.availability}</p>
              <p className="text-sm text-purple-600 font-medium mt-1">Next Available: {nanny.nextAvailable}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About</h4>
              <p className="text-gray-600 leading-relaxed">{nanny.bio}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Continue to Schedule
          </button>
        </div>
      </div>
    </div>
  )
}