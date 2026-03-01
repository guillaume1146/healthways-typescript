'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaSpinner } from 'react-icons/fa'
import HeroSectionEditor from './HeroSectionEditor'
import SectionItemsEditor from './SectionItemsEditor'
import DetailedServicesEditor from './DetailedServicesEditor'
import CtaBannerEditor from './CtaBannerEditor'
import HeroSlidesManager from './HeroSlidesManager'
import TestimonialsManager from './TestimonialsManager'

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'stats', label: 'Stats' },
  { id: 'services', label: 'Services' },
  { id: 'detailed_services', label: 'Detailed Services' },
  { id: 'specialties', label: 'Specialties' },
  { id: 'why_choose', label: 'Why Choose' },
  { id: 'cta_banner', label: 'CTA Banner' },
  { id: 'hero_slides', label: 'Hero Slides' },
  { id: 'testimonials', label: 'Testimonials' },
] as const

type TabId = (typeof TABS)[number]['id']

const STATS_FIELDS = [
  { key: 'number', label: 'Number', type: 'text' as const },
  { key: 'label', label: 'Label', type: 'text' as const },
  { key: 'color', label: 'Color', type: 'select' as const, options: ['text-blue-500', 'text-green-500', 'text-purple-500', 'text-orange-500', 'text-red-500', 'text-cyan-500', 'text-yellow-500', 'text-pink-500', 'text-indigo-500'] },
]

const SERVICES_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' as const },
  { key: 'description', label: 'Description', type: 'textarea' as const },
  { key: 'icon', label: 'Icon', type: 'select' as const, options: ['FaVideo', 'FaCalendarCheck', 'FaTruck', 'FaRobot', 'FaStethoscope', 'FaHeart', 'FaPills', 'FaHospital', 'FaShieldAlt', 'FaClock', 'FaAward'] },
  { key: 'gradient', label: 'Gradient', type: 'select' as const, options: ['bg-gradient-blue', 'bg-gradient-green', 'bg-gradient-purple', 'bg-gradient-orange'] },
]

const SPECIALTIES_FIELDS = [
  { key: 'name', label: 'Name', type: 'text' as const },
  { key: 'icon', label: 'Icon', type: 'select' as const, options: ['FaStethoscope', 'FaHeart', 'FaBrain', 'FaBaby', 'FaFemale', 'FaBone', 'FaLeaf', 'FaHeartbeat', 'FaWeight'] },
  { key: 'color', label: 'Color', type: 'select' as const, options: ['text-blue-500', 'text-red-500', 'text-cyan-500', 'text-yellow-500', 'text-pink-500', 'text-green-500', 'text-purple-500', 'text-green-600', 'text-red-600', 'text-blue-600', 'text-orange-500', 'text-indigo-500'] },
]

const WHY_CHOOSE_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' as const },
  { key: 'description', label: 'Description', type: 'textarea' as const },
  { key: 'icon', label: 'Icon', type: 'select' as const, options: ['FaShieldAlt', 'FaClock', 'FaAward', 'FaHeart', 'FaUserMd', 'FaStethoscope'] },
]

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hero')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sections, setSections] = useState<Record<string, any>>({})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }, [])

  const fetchAllData = useCallback(async () => {
    setLoading(true)
    try {
      const [sectionsRes, slidesRes, testimonialsRes] = await Promise.all([
        fetch('/api/cms/sections?includeHidden=true'),
        fetch('/api/cms/hero-slides?includeInactive=true'),
        fetch('/api/cms/testimonials?includeInactive=true'),
      ])

      if (sectionsRes.ok) {
        const sectionsData = await sectionsRes.json()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const indexed: Record<string, any> = {}
        const items = sectionsData.data || sectionsData
        if (Array.isArray(items)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items.forEach((s: any) => {
            indexed[s.sectionType] = s
          })
        }
        setSections(indexed)
      }

      if (slidesRes.ok) {
        const slidesData = await slidesRes.json()
        setHeroSlides(slidesData.data || slidesData || [])
      }

      if (testimonialsRes.ok) {
        const testimonialsData = await testimonialsRes.json()
        setTestimonials(testimonialsData.data || testimonialsData || [])
      }
    } catch (err) {
      console.error('Failed to fetch CMS data:', err)
      showMessage('error', 'Failed to load CMS data')
    } finally {
      setLoading(false)
    }
  }, [showMessage])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveSection = useCallback(async (sectionType: string, content: any) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/cms/sections/${sectionType}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (res.ok) {
        const updated = await res.json()
        setSections((prev) => ({
          ...prev,
          [sectionType]: updated.data || updated,
        }))
        showMessage('success', `${sectionType.replace(/_/g, ' ')} section saved successfully!`)
      } else {
        const err = await res.json().catch(() => ({}))
        showMessage('error', err.error || 'Failed to save section')
      }
    } catch (err) {
      console.error('Save error:', err)
      showMessage('error', 'Network error while saving')
    } finally {
      setSaving(false)
    }
  }, [showMessage])

  const refreshSlides = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/hero-slides?includeInactive=true')
      if (res.ok) {
        const data = await res.json()
        setHeroSlides(data.data || data || [])
      }
    } catch (err) {
      console.error('Failed to refresh slides:', err)
    }
  }, [])

  const refreshTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/testimonials?includeInactive=true')
      if (res.ok) {
        const data = await res.json()
        setTestimonials(data.data || data || [])
      }
    } catch (err) {
      console.error('Failed to refresh testimonials:', err)
    }
  }, [])

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-blue-600 text-3xl" />
          <span className="ml-3 text-gray-600 text-lg">Loading CMS data...</span>
        </div>
      )
    }

    switch (activeTab) {
      case 'hero':
        return (
          <HeroSectionEditor
            data={sections.hero?.content || {}}
            onSave={(content) => handleSaveSection('hero', content)}
          />
        )
      case 'stats':
        return (
          <SectionItemsEditor
            sectionType="stats"
            data={sections.stats?.content || {}}
            fields={STATS_FIELDS}
            onSave={(content) => handleSaveSection('stats', content)}
          />
        )
      case 'services':
        return (
          <SectionItemsEditor
            sectionType="services"
            data={sections.services?.content || {}}
            fields={SERVICES_FIELDS}
            onSave={(content) => handleSaveSection('services', content)}
          />
        )
      case 'detailed_services':
        return (
          <DetailedServicesEditor
            data={sections.detailed_services?.content || {}}
            onSave={(content) => handleSaveSection('detailed_services', content)}
          />
        )
      case 'specialties':
        return (
          <SectionItemsEditor
            sectionType="specialties"
            data={sections.specialties?.content || {}}
            fields={SPECIALTIES_FIELDS}
            onSave={(content) => handleSaveSection('specialties', content)}
          />
        )
      case 'why_choose':
        return (
          <SectionItemsEditor
            sectionType="why_choose"
            data={sections.why_choose?.content || {}}
            fields={WHY_CHOOSE_FIELDS}
            onSave={(content) => handleSaveSection('why_choose', content)}
          />
        )
      case 'cta_banner':
        return (
          <CtaBannerEditor
            data={sections.cta_banner?.content || {}}
            onSave={(content) => handleSaveSection('cta_banner', content)}
          />
        )
      case 'hero_slides':
        return <HeroSlidesManager slides={heroSlides} onRefresh={refreshSlides} />
      case 'testimonials':
        return <TestimonialsManager testimonials={testimonials} onRefresh={refreshTestimonials} />
      default:
        return null
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-1">Manage landing page sections, hero slides, and testimonials</p>
      </div>

      {/* Toast Message */}
      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-1.5 shadow mb-6">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Saving Overlay */}
      {saving && (
        <div className="mb-4 flex items-center gap-2 text-blue-600">
          <FaSpinner className="animate-spin" />
          <span className="text-sm font-medium">Saving changes...</span>
        </div>
      )}

      {/* Tab Content */}
      {renderTabContent()}
    </>
  )
}
