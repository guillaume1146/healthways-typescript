'use client'

import { useState, useEffect } from 'react'
import ProviderReviews from '@/components/shared/ProviderReviews'

export default function LabTechReviewsPage() {
  const [userId, setUserId] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) setUserId(JSON.parse(stored).id)
    } catch {
      // Corrupted localStorage
    }
  }, [])

  if (!userId) return null

  return (
    <ProviderReviews
      providerUserId={userId}
      providerLabel="Lab Technician"
      headerGradient="from-cyan-500 via-cyan-600 to-blue-600"
      isOwner
    />
  )
}
