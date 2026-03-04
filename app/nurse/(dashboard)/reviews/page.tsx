'use client'

import { useState, useEffect } from 'react'
import ProviderReviews from '@/components/shared/ProviderReviews'

export default function NurseReviewsPage() {
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
      providerLabel="Nurse"
      headerGradient="from-teal-500 via-teal-600 to-cyan-600"
      isOwner
    />
  )
}
