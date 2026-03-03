'use client'

import { useDoctorData } from '../context'
import ReviewsRatings from '../components/ReviewsRatings'

export default function ReviewsPage() {
  const doctorData = useDoctorData()
  return (
    <ReviewsRatings
      doctorData={{
        patientComments: [],
        rating: 0,
        reviews: 0,
      }}
    />
  )
}
