'use client'

import { useDoctorData } from '../context'
import BillingEarnings from '../components/BillingEarnings'

export default function BillingPage() {
  const doctorData = useDoctorData()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BillingEarnings doctorData={doctorData as any} />
}
