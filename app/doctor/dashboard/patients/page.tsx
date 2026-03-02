'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FaSpinner } from 'react-icons/fa'
import { useDoctorData } from '../context'
import PatientManagement from '../components/PatientManagement'

export default function PatientsPage() {
  const user = useDoctorData()
  const router = useRouter()
  const [data, setData] = useState<{ statistics: Record<string, number>; patients: { current: any[]; past: any[] } }>({
    statistics: {},
    patients: { current: [], past: [] },
  })
  const [loading, setLoading] = useState(true)

  const fetchPatients = useCallback(async () => {
    try {
      const res = await fetch(`/api/doctors/${user.id}/patients`)
      const json = await res.json()
      if (json.success) {
        const patients = json.data.map((p: any) => ({
          id: p.id,
          userId: p.userId,
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email || '',
          phone: p.phone || '',
          status: 'active' as const,
          bloodType: p.bloodType,
          chronicConditions: p.chronicConditions,
          allergies: p.allergies,
          totalVisits: p.appointmentCount,
          lastVisit: p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : undefined,
          gender: p.gender,
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : undefined,
        }))
        setData({
          statistics: {
            totalPatients: patients.length,
            activePatients: patients.length,
            newPatientsThisMonth: 0,
          },
          patients: { current: patients, past: [] },
        })
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const handleVideoCall = async (patientId: string, userId: string) => {
    try {
      const res = await fetch('/api/video/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId: user.id }),
      })
      const data = await res.json()
      if (data.roomId) {
        router.push(`/doctor/dashboard/video?roomId=${data.roomId}`)
      }
    } catch {
      router.push('/doctor/dashboard/video')
    }
  }

  const handlePrescribe = (patientId: string) => {
    router.push(`/doctor/dashboard/prescriptions?patientId=${patientId}`)
  }

  const handleMessage = async (userId: string) => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantIds: [userId] }),
      })
      const data = await res.json()
      if (data.id) {
        router.push(`/doctor/dashboard/messages?conversationId=${data.id}`)
      } else {
        router.push('/doctor/dashboard/messages')
      }
    } catch {
      router.push('/doctor/dashboard/messages')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    )
  }

  return (
    <PatientManagement
      doctorData={data as any}
      onVideoCall={handleVideoCall}
      onPrescribe={handlePrescribe}
      onMessage={handleMessage}
    />
  )
}
