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
      scale: 1.1,
      rotateY: 25,
      clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      filter: "blur(8px) brightness(0.7)"
    },
    center: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      filter: "blur(0px) brightness(1)",
      transition: {
        duration: 1.0,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        clipPath: {
          duration: 1.2,
          ease: "easeInOut" as const
        },
        filter: {
          duration: 0.6
        }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      rotateY: -25,
      clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      filter: "blur(5px) brightness(0.5)",
      transition: {
        duration: 0.6,
        ease: [0.55, 0.085, 0.68, 0.53] as const
      }
    }
  }

  return (
    <section className="relative overflow-hidden text-white py-8 sm:py-10 lg:py-12" 
      style={{ 
        background: `
          radial-gradient(ellipse at 0% 50%, rgba(0, 0, 180, 0.9) 0%, transparent 50%),
          radial-gradient(circle at 40% 30%, rgba(0, 80, 200, 0.9) 0%, transparent 60%),
          radial-gradient(circle at 95% 50%, rgba(21, 128, 61, 0.7) 0%, transparent 25%),
          linear-gradient(90deg, 
            rgba(0, 0, 180, 0.95) 0%, 
            rgba(0, 80, 200, 0.9) 25%, 
            rgba(0, 100, 220, 0.8) 50%, 
            rgba(0, 120, 160, 0.7) 75%,
            rgba(22, 101, 52, 0.7) 90%, 
            rgba(21, 128, 61, 0.8) 97%, 
            rgba(20, 83, 45, 0.7) 100%
          )
        `
      }}
    >
      {/* Enhanced Animated Background Elements - Space-like */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            "radial-gradient(circle at 15% 15%, rgba(0, 80, 200, 0.8) 0%, transparent 40%)",
            "radial-gradient(circle at 85% 85%, rgba(21, 128, 61, 0.6) 0%, transparent 45%)",
            "radial-gradient(circle at 50% 50%, rgba(0, 100, 220, 0.7) 0%, transparent 50%)",
            "radial-gradient(circle at 25% 75%, rgba(16, 100, 120, 0.6) 0%, transparent 40%)",
            "radial-gradient(circle at 15% 15%, rgba(0, 80, 200, 0.8) 0%, transparent 40%)"
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Stars/Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modified Layout: Adjusted grid layout and spacing */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 lg:gap-8 items-center">
          
          {/* Text Content - Takes 2 columns on large screens */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full order-1 lg:order-1 lg:col-span-2 text-center lg:text-left"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 mb-4 sm:mb-6 border border-white/10"
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
              className="bg-white/10 backdrop-blur-md rounded-xl p-1.5 sm:p-2 flex items-center w-full max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 shadow-2xl border border-white/20"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors, diseases..."
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 outline-none rounded-l-xl text-sm sm:text-base bg-white/90"
              />
              <motion.button 
                type="submit" 
                className="btn-gradient px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 rounded-r-xl relative overflow-hidden text-sm sm:text-base"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
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
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-white/20 transition flex items-center justify-center gap-2 relative overflow-hidden group text-sm sm:text-base"
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

          {/* WIDER CAROUSEL - Takes 3 columns on large screens, shorter height, more rectangular */}
          <motion.div
            className="w-full order-2 lg:order-2 lg:col-span-3"
            initial={{ opacity: 0, x: 100, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.3,
              type: "spring",
              stiffness: 50,
              damping: 15
            }}
          >
            {/* BIGGER & MORE RECTANGULAR CAROUSEL - Increased height by reducing margins */}
            <div className="relative h-72 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] w-full perspective-1000">
              
              {/* Subtle Transparent Border Ring - Matches hero background */}
              <motion.div
                className="absolute -inset-1 sm:-inset-2 rounded-3xl opacity-30"
                animate={{
                  background: [
                    "conic-gradient(from 0deg, rgba(0, 0, 0, 0.4), rgba(25, 57, 138, 0.6), rgba(34, 197, 94, 0.4), rgba(0, 0, 0, 0.4))",
                    "conic-gradient(from 90deg, rgba(0, 0, 0, 0.4), rgba(25, 57, 138, 0.6), rgba(34, 197, 94, 0.4), rgba(0, 0, 0, 0.4))",
                    "conic-gradient(from 180deg, rgba(0, 0, 0, 0.4), rgba(25, 57, 138, 0.6), rgba(34, 197, 94, 0.4), rgba(0, 0, 0, 0.4))",
                    "conic-gradient(from 270deg, rgba(0, 0, 0, 0.4), rgba(25, 57, 138, 0.6), rgba(34, 197, 94, 0.4), rgba(0, 0, 0, 0.4))"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ padding: "1px" }}
              >
                <div className="w-full h-full bg-transparent rounded-3xl" />
              </motion.div>

              {/* Subtle Scanline Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10 opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-800/40 to-transparent"
                  style={{
                    filter: "drop-shadow(0 0 4px rgba(30, 64, 175, 0.3))"
                  }}
                  animate={{ 
                    y: ["-10%", "110%"],
                    background: [
                      "linear-gradient(90deg, transparent 0%, rgba(30, 64, 175, 0.4) 50%, transparent 100%)",
                      "linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.3) 50%, transparent 100%)",
                      "linear-gradient(90deg, transparent 0%, rgba(30, 64, 175, 0.4) 50%, transparent 100%)"
                    ]
                  }}
                  transition={{ 
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    background: { duration: 8, repeat: Infinity, ease: "easeInOut" }
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
                  {/* Enhanced Transparent Highlight Border - Matches background theme */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border border-transparent opacity-30"
                    animate={{
                      borderColor: [
                        "rgba(0, 0, 0, 0.2)",
                        "rgba(25, 57, 138, 0.7)",
                        "rgba(34, 197, 94, 0.5)",
                        "rgba(30, 64, 175, 0.6)",
                        "rgba(16, 185, 129, 0.5)",
                        "rgba(0, 0, 0, 0.2)"
                      ],
                      boxShadow: [
                        "0 0 0px rgba(0, 0, 0, 0)",
                        "0 0 25px rgba(25, 57, 138, 0.5)",
                        "0 0 25px rgba(34, 197, 94, 0.3)",
                        "0 0 20px rgba(30, 64, 175, 0.4)",
                        "0 0 25px rgba(16, 185, 129, 0.3)",
                        "0 0 0px rgba(0, 0, 0, 0)"
                      ]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <div className="relative w-full h-full">
                    <Image
                      src={heroImages[currentImageIndex].src}
                      alt={heroImages[currentImageIndex].alt}
                      fill
                      className="object-cover object-center"
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 70vw"
                    />
                    
                    {/* Very Subtle Gradient Overlay */}
                    <motion.div 
                      className="absolute inset-0 opacity-15"
                      animate={{
                        background: [
                          "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, transparent 60%)",
                          "linear-gradient(225deg, rgba(59, 130, 246, 0.1) 0%, transparent 60%)",
                          "linear-gradient(315deg, rgba(34, 197, 94, 0.1) 0%, transparent 60%)",
                          "linear-gradient(45deg, rgba(0, 0, 0, 0.2) 0%, transparent 60%)",
                          "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, transparent 60%)"
                        ]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Image Title - Enhanced transparency */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
                    >
                      <motion.div
                        className="bg-slate-900/15 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/10"
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
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
              
              {/* Enhanced Indicators */}
              <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
                {heroImages.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-500 relative overflow-hidden ${
                      index === currentImageIndex 
                        ? 'bg-yellow-400 w-8 sm:w-10 shadow-lg' 
                        : 'bg-white/30 hover:bg-white/50 w-2 sm:w-3'
                    }`}
                    whileHover={{ scale: 1.3, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    animate={index === currentImageIndex ? {
                      boxShadow: [
                        "0 0 0px rgba(245, 158, 11, 0)",
                        "0 0 15px rgba(245, 158, 11, 0.6)",
                        "0 0 0px rgba(245, 158, 11, 0)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                ))}
              </div>


              {/* Enhanced floating particles around carousel */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full opacity-40"
                  style={{
                    left: `${10 + i * 8}%`,
                    top: `${5 + i * 12}%`,
                    background: i % 3 === 0 
                      ? "rgba(25, 57, 138, 0.7)" 
                      : i % 3 === 1
                      ? "rgba(34, 197, 94, 0.6)"
                      : "rgba(255, 255, 255, 0.4)"
                  }}
                  animate={{
                    y: [-15, 15, -15],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.6, 1.4, 0.6],
                    background: i % 3 === 0 
                      ? [
                          "rgba(25, 57, 138, 0.7)",
                          "rgba(30, 64, 175, 0.9)",
                          "rgba(25, 57, 138, 0.7)"
                        ]
                      : i % 3 === 1
                      ? [
                          "rgba(34, 197, 94, 0.6)",
                          "rgba(16, 185, 129, 0.8)",
                          "rgba(34, 197, 94, 0.6)"
                        ]
                      : [
                          "rgba(255, 255, 255, 0.4)",
                          "rgba(255, 255, 255, 0.7)",
                          "rgba(255, 255, 255, 0.4)"
                        ]
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
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