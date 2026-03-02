'use client'

import { useState, useEffect } from 'react'
import { useDoctorData } from '../context'
import DoctorStatistics from '../components/DoctorStatistics'

export default function AnalyticsPage() {
  const user = useDoctorData()
  const [statsData, setStatsData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/doctors/${user.id}/statistics`)
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setStatsData(json.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch doctor statistics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [user.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return <DoctorStatistics doctorData={statsData || {}} />
}
