'use client'

import { useUser } from '@/hooks/useUser'
import ProviderReviews from '@/components/shared/ProviderReviews'

export default function ResponderReviewsPage() {
  const { user, loading } = useUser()

  if (loading || !user) return null

  return (
    <ProviderReviews
      providerUserId={user.id}
      providerLabel="Emergency Responder"
      headerGradient="from-red-500 via-red-600 to-orange-600"
      isOwner
    />
  )
}
