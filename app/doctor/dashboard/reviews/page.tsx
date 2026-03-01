'use client'

import { useDoctorData } from '../context'
import ReviewsRatings from '../components/ReviewsRatings'

export default function ReviewsPage() {
  const doctorData = useDoctorData()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ReviewsRatings doctorData={doctorData as any} />
}
