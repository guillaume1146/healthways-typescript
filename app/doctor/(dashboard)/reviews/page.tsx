'use client'

import { useDoctorData } from '../context'
import ProviderReviews from '@/components/shared/ProviderReviews'

export default function ReviewsPage() {
  const doctorData = useDoctorData()

  return (
    <ProviderReviews
      providerUserId={doctorData.id}
      providerLabel="Doctor"
      headerGradient="from-yellow-500 via-orange-500 to-red-500"
      isOwner
    />
  )
}
