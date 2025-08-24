'use client'
import { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Corrected Mauritius Flag Component - Horizontal orientation
const MauritiusFlag: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.div 
      className={`inline-flex flex-col rounded-sm overflow-hidden ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.5 }}
    >
      <motion.div 
        className="h-1.5 w-6 bg-red-600"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      />
      <motion.div 
        className="h-1.5 w-6 bg-blue-600"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      />
      <motion.div 
        className="h-1.5 w-6 bg-yellow-400"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      />
      <motion.div 
        className="h-1.5 w-6 bg-green-600"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.3 }}
      />
    </motion.div>
  )
}

const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  const heroImages = [
    {
      src: "/images/hero/medicine-1.jpg",
      alt: "Browse and purchase medicines with doctor's prescription. Fast delivery across Mauritius.",
      title: "Medicine Store"
    },
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
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  }

  const imageVariants = {
    enter: {
      opacity: 0,
      scale: 1.2,
      rotateY: 45,
      clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      filter: "blur(10px) brightness(0.5)"
    },
    center: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      filter: "blur(0px) brightness(1)",
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        clipPath: {
          duration: 1.5,
          ease: "easeInOut" as const
        },
        filter: {
          duration: 0.8
        }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateY: -45,
      clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      filter: "blur(5px) brightness(0.3)",
      transition: {
        duration: 0.8,
        ease: [0.55, 0.085, 0.68, 0.53] as const
      }
    }
  }

  return (
    <section className="bg-gradient-hero text-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 60%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-First Layout: Text at top, Image below */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Text Content - Always first on mobile */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full order-1 lg:order-1 text-center lg:text-left"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 mb-4 sm:mb-6 border border-white/20"
            >
              <MauritiusFlag className="mr-2 sm:mr-3" />
              <motion.span 
                className="text-xs sm:text-sm font-medium text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                Mauritius&apos;s Leading Healthcare Platform
              </motion.span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Your Health,
              </motion.span>
              <br />
              <motion.span 
                className="text-yellow-400"
                initial={{ opacity: 0, y: 20, textShadow: "0 0 0px rgba(245, 158, 11, 0)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  textShadow: [
                    "0 0 0px rgba(245, 158, 11, 0)",
                    "0 0 20px rgba(245, 158, 11, 0.5)",
                    "0 0 0px rgba(245, 158, 11, 0)"
                  ]
                }}
                transition={{ 
                  delay: 1.0, 
                  duration: 0.6,
                  textShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                Our Priority
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 leading-relaxed px-2 lg:px-0"
            >
              Connect with qualified doctors, get AI-powered health insights, 
              and access medicines across Mauritius. Your trusted healthcare 
              companion.
            </motion.p>
            
            {/* Search Form - Responsive */}
            <motion.form 
              variants={itemVariants}
              onSubmit={handleSearch} 
              className="bg-white rounded-xl p-1.5 sm:p-2 flex items-center w-full max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 shadow-2xl border border-white/20"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors, diseases..."
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 outline-none rounded-l-xl text-sm sm:text-base"
              />
              <motion.button 
                type="submit" 
                className="btn-gradient px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 rounded-r-xl relative overflow-hidden text-sm sm:text-base"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ background: "linear-gradient(45deg, #3B82F6, #1D4ED8)" }}
                animate={{
                  background: [
                    "linear-gradient(45deg, #3B82F6, #1D4ED8)",
                    "linear-gradient(45deg, #1D4ED8, #3B82F6)",
                    "linear-gradient(45deg, #3B82F6, #1D4ED8)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaSearch className="text-xs sm:text-sm" />
                <span className="hidden sm:inline">Search</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </motion.form>

            {/* Action Buttons - Responsive Grid */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0"
            >
              {[
                { icon: "👨‍⚕️", text: "Find Doctors", shortText: "Doctors" },
                { icon: "💊", text: "Buy Medicines", shortText: "Medicines" },
                { icon: "🤖", text: "AI Health Assistant", shortText: "AI Health" }
              ].map((button, index) => (
                <motion.button 
                  key={button.text}
                  variants={itemVariants}
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-white/30 transition flex items-center justify-center gap-2 relative overflow-hidden group text-sm sm:text-base"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: "0 10px 25px rgba(255,255,255,0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    className="text-base sm:text-lg"
                  >
                    {button.icon}
                  </motion.span>
                  <span className="block sm:hidden">{button.shortText}</span>
                  <span className="hidden sm:block">{button.text}</span>
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-yellow-400"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Carousel - Second on mobile, responsive sizing */}
          <motion.div
            className="w-full order-2 lg:order-2"
            initial={{ opacity: 0, x: 100, rotateY: 30 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.3,
              type: "spring",
              stiffness: 60,
              damping: 15
            }}
          >
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] w-full mx-auto perspective-1000 max-w-md lg:max-w-none">
              {/* Dark Background Overlay */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                animate={{
                  backgroundColor: [
                    "rgba(0,0,0,0.2)",
                    "rgba(0,0,0,0.3)",
                    "rgba(0,0,0,0.2)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Nature-themed Background Gradient */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  background: [
                    "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(16,78,139,0.6) 30%, rgba(16,185,129,0.5) 60%, rgba(0,0,0,0.7) 100%)",
                    "linear-gradient(225deg, rgba(0,0,0,0.7) 0%, rgba(16,185,129,0.6) 30%, rgba(29,78,216,0.5) 60%, rgba(0,0,0,0.8) 100%)",
                    "linear-gradient(315deg, rgba(16,78,139,0.8) 0%, rgba(0,0,0,0.6) 30%, rgba(16,185,129,0.5) 60%, rgba(0,0,0,0.7) 100%)",
                    "linear-gradient(45deg, rgba(16,185,129,0.7) 0%, rgba(0,0,0,0.6) 30%, rgba(16,78,139,0.5) 60%, rgba(0,0,0,0.8) 100%)",
                    "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(16,78,139,0.6) 30%, rgba(16,185,129,0.5) 60%, rgba(0,0,0,0.7) 100%)"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Animated Border Ring - Responsive */}
              <motion.div
                className="absolute -inset-2 sm:-inset-4 rounded-3xl"
                animate={{
                  background: [
                    "conic-gradient(from 0deg, #000000, #104E8B, #10B981, #000000, #1D4ED8, #10B981, #000000)",
                    "conic-gradient(from 90deg, #000000, #104E8B, #10B981, #000000, #1D4ED8, #10B981, #000000)",
                    "conic-gradient(from 180deg, #000000, #104E8B, #10B981, #000000, #1D4ED8, #10B981, #000000)",
                    "conic-gradient(from 270deg, #000000, #104E8B, #10B981, #000000, #1D4ED8, #10B981, #000000)",
                    "conic-gradient(from 360deg, #000000, #104E8B, #10B981, #000000, #1D4ED8, #10B981, #000000)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ padding: "2px" }}
              >
                <div className="w-full h-full bg-gray-900 rounded-3xl" />
              </motion.div>

              {/* Enhanced Scanline Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute w-full h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-emerald-400 via-blue-400 to-transparent shadow-lg"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))"
                  }}
                  animate={{ 
                    y: [0, "100vh", 0],
                    background: [
                      "linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.9) 50%, transparent 100%)",
                      "linear-gradient(90deg, transparent 0%, rgba(29, 78, 216, 0.9) 50%, transparent 100%)",
                      "linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.9) 50%, transparent 100%)"
                    ]
                  }}
                  transition={{ 
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    background: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Nature-themed Highlight Border */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-transparent"
                    animate={{
                      borderColor: [
                        "rgba(0, 0, 0, 0)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(29, 78, 216, 0.8)",
                        "rgba(0, 0, 0, 0.6)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(0, 0, 0, 0)"
                      ],
                      boxShadow: [
                        "0 0 0px rgba(0, 0, 0, 0)",
                        "0 0 30px rgba(16, 185, 129, 0.5)",
                        "0 0 30px rgba(29, 78, 216, 0.5)",
                        "0 0 20px rgba(0, 0, 0, 0.7)",
                        "0 0 30px rgba(16, 185, 129, 0.5)",
                        "0 0 0px rgba(0, 0, 0, 0)"
                      ]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <div className="relative w-full h-full">
                    <Image
                      src={heroImages[currentImageIndex].src}
                      alt={heroImages[currentImageIndex].alt}
                      fill
                      className="object-cover object-center"
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 50vw"
                    />
                    
                    {/* Gradient Overlay with Animation */}
                    <motion.div 
                      className="absolute inset-0"
                      animate={{
                        background: [
                          "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 50%)",
                          "linear-gradient(225deg, rgba(0,0,0,0.3) 0%, transparent 50%)",
                          "linear-gradient(315deg, rgba(0,0,0,0.3) 0%, transparent 50%)",
                          "linear-gradient(45deg, rgba(0,0,0,0.3) 0%, transparent 50%)",
                          "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 50%)"
                        ]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Image Title - Responsive */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 text-white"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
                    >
                      <motion.div
                        className="bg-black/40 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/20"
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                        }}
                      >
                        <motion.h3 
                          className="text-base sm:text-xl font-bold mb-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0, duration: 0.4 }}
                        >
                          {heroImages[currentImageIndex].title}
                        </motion.h3>
                        <motion.p 
                          className="text-xs sm:text-sm text-white/80 line-clamp-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2, duration: 0.4 }}
                        >
                          {heroImages[currentImageIndex].alt}
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Enhanced Indicators - Responsive positioning */}
              <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2">
                {heroImages.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-500 relative overflow-hidden ${
                      index === currentImageIndex 
                        ? 'bg-yellow-400 w-6 sm:w-8 shadow-lg' 
                        : 'bg-white/50 hover:bg-white/70 w-2 sm:w-3'
                    }`}
                    whileHover={{ scale: 1.3, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    animate={index === currentImageIndex ? {
                      boxShadow: [
                        "0 0 0px rgba(245, 158, 11, 0)",
                        "0 0 15px rgba(245, 158, 11, 0.8)",
                        "0 0 0px rgba(245, 158, 11, 0)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {index === currentImageIndex && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Enhanced Navigation Arrows - Responsive */}
              <motion.button
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-2 sm:p-3 rounded-full hover:bg-black/60 transition border border-white/20"
                onClick={() => setCurrentImageIndex(prev => prev === 0 ? heroImages.length - 1 : prev - 1)}
                whileHover={{ scale: 1.15, x: -2 }}
                whileTap={{ scale: 0.9 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <motion.button
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-2 sm:p-3 rounded-full hover:bg-black/60 transition border border-white/20"
                onClick={() => setCurrentImageIndex(prev => (prev + 1) % heroImages.length)}
                whileHover={{ scale: 1.15, x: 2 }}
                whileTap={{ scale: 0.9 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + i * 20}%`,
                    background: i % 2 === 0 
                      ? "rgba(16, 185, 129, 0.6)" 
                      : "rgba(29, 78, 216, 0.6)"
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.4, 0.9, 0.4],
                    scale: [0.8, 1.2, 0.8],
                    background: i % 2 === 0 
                      ? [
                          "rgba(16, 185, 129, 0.6)",
                          "rgba(0, 0, 0, 0.7)",
                          "rgba(16, 185, 129, 0.6)"
                        ]
                      : [
                          "rgba(29, 78, 216, 0.6)",
                          "rgba(0, 0, 0, 0.7)",
                          "rgba(29, 78, 216, 0.6)"
                        ]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection