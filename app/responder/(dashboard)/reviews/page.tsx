'use client'

import { useState, useEffect } from 'react'
import ProviderReviews from '@/components/shared/ProviderReviews'

export default function ResponderReviewsPage() {
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
      providerLabel="Emergency Responder"
      headerGradient="from-red-500 via-red-600 to-orange-600"
      isOwner
    />
  )
}
