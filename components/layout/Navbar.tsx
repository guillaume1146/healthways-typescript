'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {  
  FaHome,  
  FaUserMd,  
  FaPills, 
  FaRobot, 
  FaPhone, 
  FaSearch, 
  FaBars, 
  FaTimes,
  FaInfoCircle,
  FaUserNurse,
  FaAmbulance,
  FaFlask,
  FaHandshake,
  FaBaby,
  FaChevronDown,
  FaShieldAlt
} from 'react-icons/fa'
import type { NavLink } from '@/types'
import HealthwyzLogo from '@/components/ui/HealthwyzLogo'

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: FaHome },
  { href: '/doctors', label: 'Find Doctors', icon: FaUserMd },
  { href: '/medicines', label: 'Medicines', icon: FaPills },
  { href: '/nursing-care', label: 'Nursing Care', icon: FaUserNurse },
  { href: '/childcare', label: 'Childcare Services', icon: FaBaby },
  { href: '/emergency-ambulance', label: 'Emergency Services', icon: FaAmbulance },
  { href: '/lab-testing', label: 'Lab Testing', icon: FaFlask },
  { href: '/corporate-partners', label: 'Corporate Health', icon: FaHandshake },
  { href: '/ai-search', label: 'AI Support', icon: FaRobot },
  { href: '/about', label: 'About', icon: FaInfoCircle },
  { href: '/contact', label: 'Contact', icon: FaPhone },
]

const serviceCategories = {
  'Healthcare Services': [
    { href: '/doctors', label: 'Find Doctors', icon: FaUserMd },
    { href: '/nursing-care', label: 'Nursing Care', icon: FaUserNurse },
    { href: '/childcare', label: 'Childcare Services', icon: FaBaby },
    { href: '/emergency-ambulance', label: 'Emergency Services', icon: FaAmbulance },
  ],
  'Medical Services': [
    { href: '/medicines', label: 'Medicines', icon: FaPills },
    { href: '/lab-testing', label: 'Lab Testing', icon: FaFlask },
    { href: '/insurance', label: 'Insurance', icon: FaShieldAlt },
  ],
  'Digital Health': [
    { href: '/ai-search', label: 'AI Support', icon: FaRobot },
    { href: '/corporate-partners', label: 'Corporate Health', icon: FaHandshake },
  ]
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // Handle responsive logo sizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  const toggleDropdown = (category: string) => {
    setActiveDropdown(activeDropdown === category ? null : category)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo - Responsive sizing */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <HealthwyzLogo 
              width={isMobile ? 140 : 160} 
              height={isMobile ? 35 : 40} 
            />
          </Link>

          {/* Desktop Navigation - Hidden on mobile and tablet */}
          <div className="hidden xl:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
            >
              <FaHome className="text-sm" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50">
                <FaUserMd className="text-sm" />
                <span className="text-sm font-medium">Services</span>
                <FaChevronDown className="text-xs" />
              </button>
              
              <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4 grid grid-cols-1 gap-4">
                  {Object.entries(serviceCategories).map(([category, services]) => (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{category}</h4>
                      <div className="space-y-1">
                        {services.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-colors duration-200 group/item"
                          >
                            <service.icon className="text-blue-600 group-hover/item:text-green-600 transition-colors" />
                            <span className="text-sm text-gray-700 group-hover/item:text-gray-900">{service.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
            >
              <FaInfoCircle className="text-sm" />
              <span className="text-sm font-medium">About</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
            >
              <FaPhone className="text-sm" />
              <span className="text-sm font-medium">Contact</span>
            </Link>
          </div>

          {/* Search and Auth - Responsive */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search - Hidden on smaller screens, shown on medium+ */}
            <form onSubmit={handleSearch} className="relative hidden lg:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search diseases, symptoms..."
                className="pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-full w-48 xl:w-64 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
              <button type="submit" className="absolute right-3 top-3">
                <FaSearch className="text-gray-400 hover:text-blue-600 transition-colors" />
              </button>
            </form>
            
            {/* Auth Buttons with Blue-Green Gradient */}
            <Link 
              href="/login" 
              className="px-4 py-2.5 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200 font-medium text-sm"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-full hover:from-blue-700 hover:to-green-600 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile/Tablet Menu */}
        {isMenuOpen && (
          <div className="xl:hidden">
            <div className="py-4 border-t border-gray-200">
              {/* Mobile Search */}
              <div className="px-2 mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search diseases, symptoms..."
                    className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                  <button type="submit" className="absolute right-3 top-3.5">
                    <FaSearch className="text-gray-400" />
                  </button>
                </form>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 px-2">
                {/* Home Link */}
                <Link
                  href="/"
                  className="flex items-center space-x-3 text-gray-700 py-3 px-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome className="text-blue-600" />
                  <span className="font-medium">Home</span>
                </Link>

                {/* Service Categories */}
                {Object.entries(serviceCategories).map(([category, services]) => (
                  <div key={category} className="border-b border-gray-100 pb-3 mb-3">
                    <button
                      onClick={() => toggleDropdown(category)}
                      className="flex items-center justify-between w-full text-left py-2 px-3 text-gray-800 font-semibold hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="text-sm">{category}</span>
                      <FaChevronDown 
                        className={`text-xs transition-transform duration-200 ${
                          activeDropdown === category ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {activeDropdown === category && (
                      <div className="mt-2 space-y-1 pl-4">
                        {services.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="flex items-center space-x-3 py-2.5 px-3 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <service.icon className="text-blue-500" />
                            <span>{service.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <Link
                  href="/about"
                  className="flex items-center space-x-3 text-gray-700 py-3 px-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaInfoCircle className="text-blue-600" />
                  <span className="font-medium">About</span>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center space-x-3 text-gray-700 py-3 px-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaPhone className="text-blue-600" />
                  <span className="font-medium">Contact</span>
                </Link>
              </div>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 px-2 space-y-3 border-t border-gray-200 mt-4">
                <Link 
                  href="/login" 
                  className="block text-center py-3 border-2 border-blue-500 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="block text-center py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-full font-medium shadow-md hover:from-blue-700 hover:to-green-600 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar