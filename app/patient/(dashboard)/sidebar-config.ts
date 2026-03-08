import {
  FaHome,
  FaNewspaper,
  FaStethoscope,
  FaPills,
  FaFileAlt,
  FaRobot,
  FaUserNurse,
  FaBaby,
  FaAmbulance,
  FaFlask,
  FaShieldAlt,
  FaVideo,
  FaComments,
  FaMoneyBillWave,
  FaSearch,
  FaUserMd,
  FaCapsules,
} from 'react-icons/fa'
import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'
import { createGetActiveSectionFromPath } from '@/lib/dashboard/getActiveSectionFromPath'

const base = '/patient'

export const PATIENT_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'feed', label: 'Feed', labelKey: 'nav.feed', icon: FaNewspaper, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/feed` },
  { id: 'overview', label: 'Dashboard', labelKey: 'nav.overview', icon: FaHome, color: 'text-blue-600', bgColor: 'bg-blue-50', href: base },
  { id: 'consultations', label: 'Doctor Consultations', labelKey: 'nav.consultations', icon: FaStethoscope, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/consultations` },

  { id: 'prescriptions', label: 'Prescriptions', labelKey: 'nav.prescriptions', icon: FaPills, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/prescriptions` },
  { id: 'health-records', label: 'Health Records', labelKey: 'nav.healthRecords', icon: FaFileAlt, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: `${base}/health-records` },
  { id: 'ai-assistant', label: 'AI Health Assistant', labelKey: 'nav.aiAssistant', icon: FaRobot, color: 'text-orange-600', bgColor: 'bg-orange-50', href: `${base}/ai-assistant` },
  { id: 'nurse-services', label: 'Nurse Services', labelKey: 'nav.nurseServices', icon: FaUserNurse, color: 'text-pink-600', bgColor: 'bg-pink-50', href: `${base}/nurse-services` },
  { id: 'childcare', label: 'Childcare Services', labelKey: 'nav.childcare', icon: FaBaby, color: 'text-yellow-600', bgColor: 'bg-yellow-50', href: `${base}/childcare` },
  { id: 'emergency', label: 'Emergency Services', labelKey: 'nav.emergency', icon: FaAmbulance, color: 'text-red-600', bgColor: 'bg-red-50', href: `${base}/emergency` },
  { id: 'lab-results', label: 'Lab Testing', labelKey: 'nav.labTesting', icon: FaFlask, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/lab-results` },
  { id: 'insurance', label: 'Insurance', labelKey: 'nav.insurance', icon: FaShieldAlt, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/insurance` },
  { id: 'billing', label: 'Billing', labelKey: 'nav.billing', icon: FaMoneyBillWave, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: `${base}/billing` },
  { id: 'video', label: 'Video Call', labelKey: 'nav.video', icon: FaVideo, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/video` },
  { id: 'chat', label: 'Messages', labelKey: 'nav.messages', icon: FaComments, color: 'text-blue-600', bgColor: 'bg-blue-50', href: `${base}/chat` },
  { id: 'divider-search', label: 'Search & Browse', icon: FaSearch, color: 'text-gray-400', bgColor: 'bg-gray-50', href: '', divider: true },
  { id: 'search-doctors', label: 'Find Doctors', labelKey: 'nav.findDoctors', icon: FaUserMd, color: 'text-blue-600', bgColor: 'bg-blue-50', href: `${base}/search/doctors` },
  { id: 'search-nurses', label: 'Find Nurses', labelKey: 'nav.findNurses', icon: FaUserNurse, color: 'text-purple-600', bgColor: 'bg-purple-50', href: `${base}/search/nurses` },
  { id: 'search-childcare', label: 'Find Childcare', labelKey: 'nav.findChildcare', icon: FaBaby, color: 'text-yellow-600', bgColor: 'bg-yellow-50', href: `${base}/search/childcare` },
  { id: 'search-lab', label: 'Find Lab Tests', labelKey: 'nav.findLab', icon: FaFlask, color: 'text-cyan-600', bgColor: 'bg-cyan-50', href: `${base}/search/lab` },
  { id: 'search-emergency', label: 'Emergency Services', labelKey: 'nav.findEmergency', icon: FaAmbulance, color: 'text-red-600', bgColor: 'bg-red-50', href: `${base}/search/emergency` },
  { id: 'search-medicines', label: 'Buy Medicines', labelKey: 'nav.findMedicines', icon: FaCapsules, color: 'text-green-600', bgColor: 'bg-green-50', href: `${base}/search/medicines` },
]

export const getActiveSectionFromPath = createGetActiveSectionFromPath(base, PATIENT_SIDEBAR_ITEMS)
