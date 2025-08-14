'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import ProfessionalBanner from '@/components/shared/ProfessionalBanner'
import { FaSearch, FaStethoscope } from 'react-icons/fa'

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [specialization, setSpecialization] = useState<string>('all')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery, 'Specialization:', specialization)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSpecialization('all')
  }

  return (
    <>
      <PageHeader
        title="Find Qualified Doctors"
        description="Connect with verified healthcare professionals across Mauritius. Book online consultations or clinic visits with ease."
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialization, or condition..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
            />
            <select 
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
            >
              <option value="all">All Specializations</option>
              <option value="general">General Medicine</option>
              <option value="cardiology">Cardiology</option>
              <option value="dermatology">Dermatology</option>
              <option value="pediatrics">Pediatrics</option>
            </select>
            <button type="submit" className="btn-gradient px-8 py-3 flex items-center justify-center gap-2">
              <FaSearch />
              Search
            </button>
          </div>
        </form>
        
        <EmptyState
          icon={FaStethoscope}
          title="No doctors found"
          description="Try adjusting your search criteria or browse all doctors"
          buttonText="Clear Filters"
          onButtonClick={handleClearFilters}
        />
        
        <ProfessionalBanner
          title="Are you a healthcare professional?"
          description="Join our platform and connect with thousands of patients across Mauritius"
          primaryButton="Join as Doctor →"
        />
      </div>
    </>
  )
}