'use client'

import { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useAppConfig } from '@/hooks/useAppConfig'

// Corrected Mauritius Flag Component - Horizontal orientation (static)
const MauritiusFlag: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`inline-flex flex-col rounded-sm overflow-hidden ${className}`}>
      <div className="h-1.5 w-6 bg-red-600" />
      <div className="h-1.5 w-6 bg-blue-600" />
      <div className="h-1.5 w-6 bg-yellow-400" />
      <div className="h-1.5 w-6 bg-green-600" />
    </div>
  )
}

interface HeroSectionProps {
  content?: {
    mainTitle?: string
    highlightWord?: string
    subtitle?: string
    platformBadge?: string
    searchPlaceholder?: string
    ctaButtons?: Array<{ icon: string; label: string; shortLabel: string }>
  }
  slides?: Array<{
    id: string
    title: string
    subtitle?: string | null
    imageUrl: string
    sortOrder: number
  }>
}

const HeroSection: React.FC<HeroSectionProps> = ({ content, slides }) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { config } = useAppConfig()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  const defaultHeroImages = [
    {
      src: "/images/hero/gemini-doctor-3-removebg-1.png",
      alt: "Specialist Medical Doctor",
      title: "Medical Specialists"
    },
    {
      src: "/images/hero/medicine-1.png",
      alt: "Browse and purchase medicines with doctor's prescription. Fast delivery across Mauritius.",
      title: "Medicine Store"
    },
    {
      src: "/images/hero/doctor-1.png",
      alt: "Professional Doctor Consultation",
      title: "Expert Medical Care"
    },
    {
      src: "/images/hero/ambulance-1.png",
      alt: "Emergency Ambulance Service",
      title: "Emergency Services"
    },
    {
      src: "/images/hero/insurance-1.png",
      alt: "Health Insurance Coverage",
      title: "Insurance Protection"
    },
    {
      src: "/images/hero/nurse-1.png",
      alt: "Professional Nurse Care",
      title: "Nursing Excellence"
    },
    {
      src: "/images/hero/doctor-2.png",
      alt: "Experienced Medical Doctor",
      title: "Healthcare Professionals"
    },
    {
      src: "/images/hero/patient-1.png",
      alt: "Patient Care Services",
      title: "Patient-Centered Care"
    }
  ]

  const heroImages = slides
    ? slides.map((s) => ({ src: s.imageUrl, alt: s.subtitle || s.title, title: s.title }))
    : defaultHeroImages

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
      scale: 1.05,
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.5,
        ease: [0.55, 0.085, 0.68, 0.53] as const
      }
    }
  }

  return (
    <section className="relative overflow-hidden text-white py-6 sm:py-8 lg:py-14"
      style={{
        background: 'linear-gradient(135deg, rgba(18, 95, 249, 0.95) 0%, rgba(0, 143, 163, 0.9) 50%, rgba(0, 165, 66, 0.85) 100%)'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full order-1 lg:order-1 lg:col-span-6 text-center lg:text-left"
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
                {content?.platformBadge || config.platformDescription}
              </motion.span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-white"
            >
              {(content?.mainTitle || config.heroTitle).split(',').map((part, index) => (
                <span
                  key={index}
                  className={index === 1 ? "text-yellow-400" : ""}
                >
                  {part.trim()}
                  {index === 0 && ','}
                  {index === 0 && <br />}
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base text-left sm:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 leading-relaxed px-2 lg:px-0 max-w-xl sm:mx-auto lg:mx-0 line-clamp-3 sm:line-clamp-none"
            >
              {content?.subtitle || 'Connect with qualified doctors, get AI-powered health insights, and access medicines across Mauritius. Your trusted healthcare companion.'}
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
                placeholder={content?.searchPlaceholder || "Search doctors, diseases..."}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 outline-none rounded-l-xl text-sm sm:text-base bg-white/90"
              />
              <button
                type="submit"
                className="px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 rounded-r-xl text-sm sm:text-base text-white font-medium transition-transform hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(45deg, #3B82F6, #1D4ED8)" }}
              >
                <FaSearch className="text-xs sm:text-sm" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </motion.form>

            {/* Action Buttons - Responsive Grid */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0"
            >
              {(content?.ctaButtons || [
                { icon: "👨‍⚕️", label: "Find Doctors", shortLabel: "Doctors" },
                { icon: "💊", label: "Buy Medicines", shortLabel: "Medicines" },
                { icon: "🤖", label: "AI Health Assistant", shortLabel: "AI Health" }
              ]).map((button) => (
                <motion.button
                  key={button.label}
                  variants={itemVariants}
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-white/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span className="text-base sm:text-lg">{button.icon}</span>
                  <span className="block sm:hidden">{button.shortLabel}</span>
                  <span className="hidden sm:block">{button.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full order-2 lg:order-2 lg:col-span-6"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1.0,
              delay: 0.3,
              type: "spring",
              stiffness: 50,
              damping: 15
            }}
          >
            <div className="relative w-full aspect-[5/4]">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                >

                  <div className="relative w-full h-full">
                    
                    <Image
                      src={heroImages[currentImageIndex].src}
                      alt={heroImages[currentImageIndex].alt}
                      fill
                      className="object-center" 
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 70vw"
                    />
                    
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{ background: "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, transparent 60%)" }}
                    />
                    
                    {/* Image Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                      <div className="bg-slate-900/15 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/10">
                        <h3 className="text-base sm:text-xl font-bold mb-1">
                          {heroImages[currentImageIndex].title}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                          {heroImages[currentImageIndex].alt}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Carousel Indicators */}
              <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-yellow-400 w-8 sm:w-10 shadow-lg scale-110'
                        : 'bg-white/30 hover:bg-white/50 w-2 sm:w-3'
                    }`}
                  />
                ))}
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection