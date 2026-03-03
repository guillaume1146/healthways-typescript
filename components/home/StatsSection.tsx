'use client'

import { useState, useEffect } from 'react'
import { STATS } from '@/lib/constants'
import StatCard from '@/components/shared/StatCard'
import { Stat } from '@/types'

interface StatsSectionProps {
  items?: Stat[]
}

const StatsSection: React.FC<StatsSectionProps> = ({ items }) => {
  const [stats, setStats] = useState<Stat[]>(items || STATS)

  useEffect(() => {
    if (items) return // Use CMS data if provided
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        const data = await res.json()
        if (data.success && data.data) {
          setStats(data.data.map((s: { number: number; label: string; color: string }) => ({
            number: String(s.number) + '+',
            label: s.label,
            color: s.color,
          })))
        }
      } catch {
        // Keep fallback STATS
      }
    }
    fetchStats()
  }, [items])

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
