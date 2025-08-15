'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaHeartbeat, FaHome, FaUserMd, FaPills, FaRobot, FaPhone, FaSearch, FaBars, FaTimes } from 'react-icons/fa'
import type { NavLink } from '@/types'

import { FaInfoCircle } from 'react-icons/fa'

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: FaHome },
  { href: '/about', label: 'About', icon: FaInfoCircle },
  { href: '/doctors', label: 'Doctors', icon: FaUserMd },
  { href: '/medicines', label: 'Medicines', icon: FaPills },
  { href: '/ai-search', label: 'AI Search', icon: FaRobot },
  { href: '/contact', label: 'Contact', icon: FaPhone },
]

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-main p-2 rounded-xl">
              <FaHeartbeat className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-primary-blue">Healthways</span>
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
            <Link href="/login" className="px-4 py-2 border border-primary-blue text-primary-blue rounded-full hover:bg-blue-50">
              Login
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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t flex space-x-4">
                <Link href="/login" className="flex-1 text-center py-2 border border-primary-blue text-primary-blue rounded-full">
                  Login
                </Link>
                <Link href="/signup" className="flex-1 text-center btn-gradient">
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