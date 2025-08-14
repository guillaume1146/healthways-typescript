'use client'

import { useState } from 'react'
import { FaCheckCircle, FaHospital } from 'react-icons/fa'

const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  return (
    <section className="bg-gradient-main text-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <FaCheckCircle className="mr-2" />
              <span>Top Rated Healthcare Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Your Health,<br />
              <span className="text-highlight-yellow">Our Priority</span>
            </h1>
            
            <p className="text-xl mb-8 text-white/90">
              Connect with qualified doctors, get AI-powered health insights, 
              and access medicines across Mauritius. Your trusted healthcare companion.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-full p-2 flex items-center max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for doctors, medicines, or symptoms..."
                className="flex-1 px-4 py-2 text-gray-700 outline-none"
              />
              <button type="submit" className="btn-gradient px-6 py-2">
                Search
              </button>
            </form>
          </div>
          
          {/* Illustration */}
          <div className="hidden lg:block">
            <div className="animate-float">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 text-center">
                <FaHospital className="text-white/80 text-[200px] mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection