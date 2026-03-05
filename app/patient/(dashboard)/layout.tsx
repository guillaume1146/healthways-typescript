'use client'

import { createDashboardLayout } from '@/lib/dashboard/createDashboardLayout'
import { PATIENT_SIDEBAR_ITEMS, getActiveSectionFromPath } from './sidebar-config'
import { PatientDashboardProvider } from './context'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePrescription(p: any) {
  return {
    id: p.id,
    date: p.date,
    time: '',
    doctorName: p.doctor ? `${p.doctor.user.firstName} ${p.doctor.user.lastName}` : 'Unknown',
    doctorId: p.doctor?.id ?? '',
    diagnosis: p.diagnosis,
    isActive: p.isActive,
    nextRefill: p.nextRefill ?? null,
    notes: p.notes ?? '',
    medicines: (p.medicines ?? []).map((m: any) => ({
      name: m.medicine?.name ?? m.name ?? '',
      dosage: m.dosage ?? '',
      quantity: m.quantity ?? 0,
      frequency: m.frequency ?? '',
      duration: m.duration ?? '',
      instructions: m.instructions ?? '',
      beforeFood: false,
    })),
  }
}

async function fetchPatientData(baseData: { id: string }) {
  const userId = baseData.id

  const [activePrescriptionsRes, allPrescriptionsRes, recordsRes] = await Promise.all([
    fetch(`/api/patients/${userId}/prescriptions?active=true`).catch(() => null),
    fetch(`/api/patients/${userId}/prescriptions`).catch(() => null),
    fetch(`/api/patients/${userId}/medical-records`).catch(() => null),
  ])

  const [activePrescriptions, allPrescriptions, records] = await Promise.all([
    activePrescriptionsRes?.ok ? activePrescriptionsRes.json() : null,
    allPrescriptionsRes?.ok ? allPrescriptionsRes.json() : null,
    recordsRes?.ok ? recordsRes.json() : null,
  ])

  const activeList = (activePrescriptions?.data ?? []).map(normalizePrescription)
  const allList = (allPrescriptions?.data ?? []).map(normalizePrescription)
  const historyList = allList.filter((p: ReturnType<typeof normalizePrescription>) => !p.isActive)

  return {
    ...baseData,
    activePrescriptions: activeList,
    prescriptionHistory: historyList,
    medicalRecords: records?.data ?? [],
  }
}

export default createDashboardLayout({
  userSubtitle: 'Patient',
  sidebarItems: PATIENT_SIDEBAR_ITEMS,
  getActiveSectionFromPath,
  profileHref: '/patient/profile',
  ContextProvider: PatientDashboardProvider,
  fetchDashboardData: fetchPatientData,
})
