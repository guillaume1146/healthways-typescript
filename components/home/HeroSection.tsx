'use client'

import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  return (
    <section className="bg-gradient-hero text-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-6">
              <span className="text-sm font-medium text-white">🇲🇺 Mauritius&apos;s Leading Healthcare Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Your Health,<br />
              <span className="text-yellow-400">Our Priority</span>
            </h1>
            
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Connect with qualified doctors, get AI-powered health insights, 
              and access medicines across Mauritius. Your trusted healthcare 
              companion.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 flex items-center max-w-lg mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for doctors, diseases, symptoms, treatments..."
                className="flex-1 px-4 py-3 text-gray-700 outline-none rounded-l-xl"
              />
              <button type="submit" className="btn-gradient px-6 py-3 flex items-center gap-2 rounded-r-xl">
                <FaSearch />
                Search
              </button>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition flex items-center gap-2">
                <span>👨‍⚕️</span> Find Doctors
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition flex items-center gap-2">
                <span>💊</span> Buy Medicines
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition flex items-center gap-2">
                <span>🤖</span> AI Health Assistant
              </button>
            </div>
          </div>
          
          {/* Healthcare Illustration */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center animate-float">
                <div className="text-8xl mb-4">🏥</div>
                <div className="grid grid-cols-3 gap-4 text-4xl">
                  <div>👨‍⚕️</div>
                  <div>🔬</div>
                  <div>💊</div>
                  <div>🩺</div>
                  <div>❤️</div>
                  <div>🧬</div>
                </div>
                <div className="mt-6 text-center">
                  <div className="text-6xl font-bold text-white opacity-80">HEALTHCARE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection