'use client'

import { useUser } from '@/hooks/useUser'
import ProviderReviews from '@/components/shared/ProviderReviews'

export default function LabTechReviewsPage() {
  const { user, loading } = useUser()

  if (loading || !user) return null

  return (
    <ProviderReviews
      providerUserId={user.id}
      providerLabel="Lab Technician"
      headerGradient="from-cyan-500 via-cyan-600 to-blue-600"
      isOwner
    />
  )
}
