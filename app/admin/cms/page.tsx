'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaNewspaper, FaImage, FaStar, FaChartBar, FaEdit, FaTrash, FaPlus,
  FaSave, FaEye, FaToggleOn, FaToggleOff, FaArrowUp, FaArrowDown,
  FaUserMd, FaUserNurse, FaChild, FaAmbulance, FaPills, FaFlask
} from 'react-icons/fa'

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

const mockSliders: Slider[] = [
  { id: 'S1', title: 'Quality Healthcare at Your Fingertips', description: 'Connect with top doctors instantly', imageUrl: PLACEHOLDER_IMAGE, link: '/doctors', order: 1, isActive: true },
  { id: 'S2', title: '24/7 Emergency Services', description: 'Rapid response when you need it most', imageUrl: PLACEHOLDER_IMAGE, link: '/emergency', order: 2, isActive: true },
  { id: 'S3', title: 'Professional Nursing Care', description: 'Compassionate care at home', imageUrl: PLACEHOLDER_IMAGE, link: '/nurses', order: 3, isActive: false }
]

const mockNews: News[] = [
  { id: 'N1', title: 'New Telemedicine Services Launched', content: 'We are excited to announce...', imageUrl: PLACEHOLDER_IMAGE, author: 'Admin', date: '2025-08-20', category: 'Announcement', isPublished: true },
  { id: 'N2', title: 'COVID-19 Vaccination Drive', content: 'Free vaccination available...', imageUrl: PLACEHOLDER_IMAGE, author: 'Health Team', date: '2025-08-18', category: 'Health', isPublished: true }
]

const mockTestimonials: Testimonial[] = [
  { id: 'T1', name: 'John Smith', role: 'Patient', content: 'Excellent service and caring staff!', rating: 5, imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=John', isActive: true },
  { id: 'T2', name: 'Mary Johnson', role: 'Family Member', content: 'The home care service was exceptional.', rating: 5, imageUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Mary', isActive: true }
]

const mockStatistics: Statistic[] = [
  { category: 'Doctors', count: 2341, icon: 'FaUserMd', color: 'blue' },
  { category: 'Nurses', count: 3456, icon: 'FaUserNurse', color: 'purple' },
  { category: 'Patients Served', count: 48750, icon: 'FaUsers', color: 'green' },
  { category: 'Emergency Responses', count: 12847, icon: 'FaAmbulance', color: 'red' }
]

export default function CMSManagement() {
  const [activeTab, setActiveTab] = useState<'slider' | 'news' | 'testimonials' | 'statistics'>('slider')
  const [sliders, setSliders] = useState(mockSliders)
  const [news, setNews] = useState(mockNews)
  const [testimonials, setTestimonials] = useState(mockTestimonials)
  const [statistics, setStatistics] = useState(mockStatistics)
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
            <Link href="/admin/dashboard" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl p-1 shadow mb-6">
          <div className="flex gap-1">
            {(['slider', 'news', 'testimonials', 'statistics'] as Array<'slider' | 'news' | 'testimonials' | 'statistics'>).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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