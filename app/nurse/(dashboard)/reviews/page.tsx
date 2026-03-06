'use client'

import ProviderReviews from '@/components/shared/ProviderReviews'
import { useUser } from '@/hooks/useUser'

export default function NurseReviewsPage() {
  const { user, loading } = useUser()

  if (loading || !user) return null

  return (
    <ProviderReviews
      providerUserId={user.id}
      providerLabel="Nurse"
      headerGradient="from-teal-500 via-teal-600 to-cyan-600"
      isOwner
    />
  )
}
