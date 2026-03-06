'use client'

import { useUser } from '@/hooks/useUser'
import ProviderReviews from '@/components/shared/ProviderReviews'

export default function PharmacistReviewsPage() {
  const { user, loading } = useUser()

  if (loading || !user) return null

  return (
    <ProviderReviews
      providerUserId={user.id}
      providerLabel="Pharmacist"
      headerGradient="from-teal-500 via-teal-600 to-cyan-600"
      isOwner
    />
  )
}
