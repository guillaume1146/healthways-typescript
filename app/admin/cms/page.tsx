'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  FaNewspaper, FaImage, FaStar, FaEdit, FaTrash, FaPlus, FaEye, FaToggleOn, FaToggleOff, FaArrowUp, FaArrowDown, FaChartBar, FaSpinner
} from 'react-icons/fa'
import type { IconType } from 'react-icons'

interface Slider {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
  order: number
  isActive: boolean
}

interface News {
  id: string
  title: string
  content: string
  imageUrl: string
  author: string
  date: string
  category: string
  isPublished: boolean
}

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  imageUrl: string
  isActive: boolean
}

interface Statistic {
  category: string
  count: number
  icon: string
  color: string
}

// Using base64 placeholder or dicebear API
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTUwIiBzdHlsZT0iZmlsbDojOTk5O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjE5cHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NDAweDMwMDwvdGV4dD48L3N2Zz4='

export default function CMSManagement() {
  const [activeTab, setActiveTab] = useState<'slider' | 'news' | 'testimonials' | 'statistics'>('slider')
  const [sliders, setSliders] = useState<Slider[]>([])
  const [news, setNews] = useState<News[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [statistics, setStatistics] = useState<Statistic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const stored = localStorage.getItem('healthwyz_user')
        if (!stored) return
        let userId: string
        try { userId = JSON.parse(stored).id } catch { return }
        const res = await fetch(`/api/admin/${userId}/cms`)
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            if (json.data.sliders) setSliders(json.data.sliders)
            if (json.data.news) setNews(json.data.news)
            if (json.data.testimonials) setTestimonials(json.data.testimonials)
            if (json.data.statistics) setStatistics(json.data.statistics)
          }
        }
      } catch {
        // Failed to fetch CMS data
      } finally {
        setLoading(false)
      }
    }
    fetchCmsData()
  }, [])
  const [editingItem, setEditingItem] = useState<Slider | News | Testimonial | Statistic | null>(null);
  const [editType, setEditType] = useState<string>('')

  const moveSlider = (id: string, direction: 'up' | 'down') => {
    const index = sliders.findIndex(s => s.id === id)
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < sliders.length - 1)) {
      const newSliders = [...sliders]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      ;[newSliders[index], newSliders[targetIndex]] = [newSliders[targetIndex], newSliders[index]]
      newSliders.forEach((s, i) => s.order = i + 1)
      setSliders(newSliders)
    }
  }

  const toggleSliderStatus = (id: string) => {
    setSliders(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s))
  }

  const toggleNewsPublish = (id: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, isPublished: !n.isPublished } : n))
  }

  const toggleTestimonialStatus = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Management System</h1>
              <p className="text-gray-600">Manage landing page content and appearance</p>
            </div>
            <Link href="/admin" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl p-1 shadow mb-6">
          <div className="flex gap-1">
            {([
              { id: 'slider' as const, label: 'Slider', icon: FaImage as IconType },
              { id: 'news' as const, label: 'News', icon: FaNewspaper as IconType },
              { id: 'testimonials' as const, label: 'Testimonials', icon: FaStar as IconType },
              { id: 'statistics' as const, label: 'Statistics', icon: FaChartBar as IconType },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-3 rounded-lg font-medium transition flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={tab.label}
                aria-label={tab.label}
              >
                <tab.icon className="text-lg" />
              </button>
            ))}
          </div>
        </div>

        {/* Slider Management */}
        {activeTab === 'slider' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Image Slider/Carousel</h2>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <FaPlus /> Add Slide
              </button>
            </div>
            {sliders.map((slide, idx) => (
              <div key={slide.id} className="bg-white rounded-xl p-6 shadow flex gap-6">
                <div className="w-48 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FaImage className="text-gray-400 text-3xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{slide.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{slide.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Link: {slide.link}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveSlider(slide.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 bg-gray-100 rounded disabled:opacity-50"
                    >
                      <FaArrowUp />
                    </button>
                    <button 
                      onClick={() => moveSlider(slide.id, 'down')}
                      disabled={idx === sliders.length - 1}
                      className="p-1 bg-gray-100 rounded disabled:opacity-50"
                    >
                      <FaArrowDown />
                    </button>
                  </div>
                  <button onClick={() => toggleSliderStatus(slide.id)}>
                    {slide.isActive ? 
                      <FaToggleOn className="text-3xl text-green-500" /> : 
                      <FaToggleOff className="text-3xl text-gray-400" />
                    }
                  </button>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                    <FaEdit />
                  </button>
                  <button className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* News Management */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">News & Updates</h2>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <FaPlus /> Add Article
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map(article => (
                <div key={article.id} className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <FaNewspaper className="text-gray-400 text-4xl" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{article.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        article.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {article.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{article.content}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-gray-500">{article.date} • {article.author}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleNewsPublish(article.id)}
                          className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        >
                          <FaEye />
                        </button>
                        <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                          <FaEdit />
                        </button>
                        <button className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Management */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customer Testimonials</h2>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <FaPlus /> Add Testimonial
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow">
                  <div className="flex items-start gap-4">
                    <Image 
                      src={testimonial.imageUrl} 
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mt-3 italic">{testimonial.content}</p>
                      <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => toggleTestimonialStatus(testimonial.id)}>
                          {testimonial.isActive ? 
                            <FaToggleOn className="text-2xl text-green-500" /> : 
                            <FaToggleOff className="text-2xl text-gray-400" />
                          }
                        </button>
                        <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                          <FaEdit />
                        </button>
                        <button className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Management */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statistics.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {stat.count.toLocaleString()}
                    </div>
                    <p className="text-gray-700 font-medium">{stat.category}</p>
                    <button className="mt-4 text-sm text-blue-600 hover:underline">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}