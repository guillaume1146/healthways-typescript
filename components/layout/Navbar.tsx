'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  FaHeartbeat, 
  FaHome, 
  FaUserMd, 
  FaPills, 
  FaRobot, 
  FaPhone, 
  FaSearch, 
  FaBars, 
  FaTimes,
  FaInfoCircle
} from 'react-icons/fa'
import type { NavLink } from '@/types'
import HealthwyzLogo from '@/components/ui/HealthwyzLogo'

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: FaHome },
  { href: '/doctors', label: 'Find Doctors', icon: FaUserMd },
  { href: '/medicines', label: 'Medicines', icon: FaPills },
  { href: '/ai-search', label: 'AI Health', icon: FaRobot },
  { href: '/about', label: 'About', icon: FaInfoCircle },
  { href: '/contact', label: 'Contact', icon: FaPhone },
]

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
    // In real app, this would redirect to search results
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <HealthwyzLogo width={160} height={40} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-blue transition"
              >
                <link.icon />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Search and Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search diseases, symptoms..."
                className="pl-4 pr-10 py-2 border rounded-full w-64 focus:outline-none focus:border-primary-blue"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <FaSearch className="text-gray-400" />
              </button>
            </form>
            
            {/* Unified Login */}
            <Link 
              href="/login" 
              className="px-4 py-2 border border-primary-blue text-primary-blue rounded-full hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
            <Link href="/signup" className="btn-gradient">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-700 py-2 hover:bg-gray-50 rounded px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {/* Auth Buttons */}
              <div className="pt-4 border-t space-y-2">
                <Link 
                  href="/login" 
                  className="block text-center py-2 border border-primary-blue text-primary-blue rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="block text-center btn-gradient"
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