'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import MedicalDisclaimer from '@/components/shared/MedicalDisclaimer'
import { FaPills, FaTruck, FaCheckCircle, FaHeadset, FaUndo, FaShoppingCart } from 'react-icons/fa'
import type { IconType } from 'react-icons'

interface MedicineFeature {
  icon: IconType
  title: string
  subtitle: string
}

export default function MedicinesPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [category, setCategory] = useState<string>('all')
  const [cartCount] = useState<number>(0)

  const features: MedicineFeature[] = [
    { icon: FaTruck, title: 'Fast Delivery', subtitle: 'Same day delivery' },
    { icon: FaCheckCircle, title: 'Verified Quality', subtitle: 'Authentic medicines' },
    { icon: FaHeadset, title: '24/7 Support', subtitle: 'Always available' },
    { icon: FaUndo, title: 'Easy Returns', subtitle: 'Hassle-free returns' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching medicines:', searchQuery, 'Category:', category)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCategory('all')
  }

  return (
    <>
      <PageHeader
        icon={FaPills}
        title="Medicine Store"
        description="Browse and purchase medicines with doctor's prescription. Fast delivery across Mauritius."
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines by name, category, or condition..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
            />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
            >
              <option value="all">All Categories</option>
              <option value="antibiotics">Antibiotics</option>
              <option value="pain-relief">Pain Relief</option>
              <option value="vitamins">Vitamins</option>
              <option value="diabetes">Diabetes</option>
            </select>
            <button type="button" className="btn-gradient px-8 py-3 flex items-center justify-center gap-2">
              <FaShoppingCart />
              Cart ({cartCount})
            </button>
          </div>
        </form>
        
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <Icon className="text-3xl text-primary-blue mx-auto mb-2" />
                <h6 className="font-semibold">{feature.title}</h6>
                <p className="text-sm text-gray-600">{feature.subtitle}</p>
              </div>
            )
          })}
        </div>
        
        <EmptyState
          icon={FaPills}
          title="No medicines found"
          description="Try adjusting your search criteria or browse all categories"
          buttonText="Clear Filters"
          onButtonClick={handleClearFilters}
        />
        
        <MedicalDisclaimer />
      </div>
    </>
  )
}