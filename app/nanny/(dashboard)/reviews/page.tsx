'use client'

import { useState, useEffect } from 'react'
import ProviderReviews from '@/components/shared/ProviderReviews'

export default function NannyReviewsPage() {
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
      providerLabel="Childcare Provider"
      headerGradient="from-purple-500 via-purple-600 to-pink-500"
      isOwner
    />
  )
}
