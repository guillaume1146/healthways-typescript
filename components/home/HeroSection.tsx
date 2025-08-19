'use client'
import { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  // Updated with proper titles and alt text based on your file names
  const heroImages = [
    {
      src: "/images/hero/doctor-1.jpg",
      alt: "Professional Doctor Consultation",
      title: "Expert Medical Care"
    },
    {
      src: "/images/hero/ambulance-1.jpg",
      alt: "Emergency Ambulance Service",
      title: "Emergency Services"
    },
    {
      src: "/images/hero/insurance-1.jpg",
      alt: "Health Insurance Coverage",
      title: "Insurance Protection"
    },
    {
      src: "/images/hero/nurse-1.jpg",
      alt: "Professional Nurse Care",
      title: "Nursing Excellence"
    },
    {
      src: "/images/hero/doctor-2.jpg",
      alt: "Experienced Medical Doctor",
      title: "Healthcare Professionals"
    },
    {
      src: "/images/hero/doctor-3.jpg",
      alt: "Specialist Medical Doctor",
      title: "Medical Specialists"
    },
    {
      src: "/images/hero/patient-1.jpg",
      alt: "Patient Care Services",
      title: "Patient-Centered Care"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <section className="bg-gradient-hero text-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
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
            
            <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 flex items-center max-w-lg mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for doctors, diseases, symptoms, treatments..."
                className="flex-1 px-4 py-3 text-gray-700 outline-none rounded-l-xl"
              />
              <motion.button 
                type="submit" 
                className="btn-gradient px-6 py-3 flex items-center gap-2 rounded-r-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSearch />
                Search
              </motion.button>
            </form>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>👨‍⚕️</span> Find Doctors
              </motion.button>
              <motion.button 
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>💊</span> Buy Medicines
              </motion.button>
              <motion.button 
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🤖</span> AI Health Assistant
              </motion.button>
            </div>
          </motion.div>

          {/* Right - Enhanced Image Carousel */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Increased width and height with no gaps */}
            <div className="relative h-[500px] w-full  mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotateY: -15 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border-0 carousel-no-gaps"
                >
                  {/* Image container with no gaps */}
                  <div className="relative w-full h-full m-0 p-0">
                    <Image
                      src={heroImages[currentImageIndex].src}
                      alt={heroImages[currentImageIndex].alt}
                      fill
                      className="object-cover object-center w-full h-full m-0 p-0"
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    
                    {/* Gradient overlay - softer for better image visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Image info overlay */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-6 text-white"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-xl font-bold mb-1">
                          {heroImages[currentImageIndex].title}
                        </h3>
                        <p className="text-sm text-white/80">
                          {heroImages[currentImageIndex].alt}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Enhanced Navigation Indicators */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {heroImages.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-yellow-400 w-8' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <motion.button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/50 transition"
                onClick={() => setCurrentImageIndex(prev => prev === 0 ? heroImages.length - 1 : prev - 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <motion.button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/50 transition"
                onClick={() => setCurrentImageIndex(prev => (prev + 1) % heroImages.length)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400/30 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400/30 rounded-full"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection