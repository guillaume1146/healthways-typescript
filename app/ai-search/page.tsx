'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import ProfessionalBanner from '@/components/shared/ProfessionalBanner'
import { FaRobot, FaSearch } from 'react-icons/fa'

export default function AISearchPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('AI Search for:', searchQuery)
  }

  return (
    <>
      <PageHeader
        icon={FaRobot}
        title="AI Health Search"
        description="Get instant health information, treatment suggestions, and holistic remedies powered by AI. Search for diseases, symptoms, or health conditions."
      />
      
      <div className="container mx-auto px-4 py-12">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for diseases, symptoms, treatments, remedies..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue text-lg"
            />
            <button type="submit" className="btn-gradient px-8 py-3 flex items-center gap-2">
              <FaSearch />
              Search
            </button>
          </div>
        </form>
        
        <ProfessionalBanner
          title="Need Professional Medical Advice?"
          description="While our AI provides helpful information, nothing replaces professional medical consultation"
          primaryButton="Book Consultation"
          secondaryButton="Chat with AI"
        />
      </div>
    </>
  )
}