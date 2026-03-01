'use client'

import { useState } from 'react'
import { FaUser, FaSave, FaStethoscope } from 'react-icons/fa'

interface DoctorProfileData {
  name: string
  email: string
  phone: string
  specialty: string
  licenseNumber: string
  clinicName: string
  clinicAddress: string
  consultationFee: string
  bio: string
}

const DoctorProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfileData>({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    licenseNumber: '',
    clinicName: '',
    clinicAddress: '',
    consultationFee: '',
    bio: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <form className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaUser className="text-blue-600" /> Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input name="name" value={profile.name} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input name="email" type="email" value={profile.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input name="phone" value={profile.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
            <input name="licenseNumber" value={profile.licenseNumber} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaStethoscope className="text-blue-600" /> Professional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
            <select name="specialty" value={profile.specialty} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500">
              <option value="">Select specialty...</option>
              <option>General Medicine</option>
              <option>Endocrinology</option>
              <option>Cardiology</option>
              <option>Pediatrics</option>
              <option>Dermatology</option>
              <option>Orthopedics</option>
              <option>Neurology</option>
              <option>Psychiatry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (MUR)</label>
            <input name="consultationFee" type="number" value={profile.consultationFee} onChange={handleChange} placeholder="e.g. 1500" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
            <input name="clinicName" value={profile.clinicName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Address</label>
            <input name="clinicAddress" value={profile.clinicAddress} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} rows={4} placeholder="Describe your experience and specialties..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
        </div>
      </div>

      <div className="text-right pt-4">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 ml-auto">
          <FaSave /> Save Changes
        </button>
      </div>
    </form>
  )
}

export default DoctorProfileTab
