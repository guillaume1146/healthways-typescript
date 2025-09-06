import { 
  FaUser, 
  FaUserMd, 
  FaUserNurse, 
  FaFlask, 
  FaPills, 
  FaAmbulance, 
  FaChild, 
  FaUserCog,
  FaBuilding,
  FaHandshake,
  FaGlobe,
  FaShieldAlt
} from 'react-icons/fa'
import { UserType } from './types'

export const userTypes: UserType[] = [
  {
    id: 'patient',
    label: 'Patient',
    icon: FaUser,
    description: 'Book appointments & manage health',
    redirectPath: '/patient/dashboard',
    demoEmail: 'emma.johnson@healthwyz.mu',
    demoPassword: 'Patient123!'  
  },
  {
    id: 'doctor',
    label: 'Doctor',
    icon: FaUserMd,
    description: 'Manage patients & consultations',
    redirectPath: '/doctor/dashboard',
    demoEmail: 'sarah.johnson@healthwyz.mu',
    demoPassword: 'SecurePass123!'  // Demo password for testing
  },
  {
    id: 'nurse',
    label: 'Nurse',
    icon: FaUserNurse,
    description: 'Provide home care services',
    redirectPath: '/nurse/dashboard',
    demoEmail: 'maria.thompson@homecare.mu',
    demoPassword: 'CareGiver123!'  // Demo password for testing
  },
  {
    id: 'child-care-nurse',
    label: 'Nanny',
    icon: FaChild,
    description: 'Provide child care services',
    redirectPath: '/nanny/dashboard',
    demoEmail: 'sophie.chen@nannycare.mu',
    demoPassword: 'ChildCare123!'  // Demo password for testing
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    icon: FaPills,
    description: 'Manage inventory & prescriptions',
    redirectPath: '/pharmacist/dashboard',
    demoEmail: 'pharmacy@healthwyz.mu',
    demoPassword: 'PharmacyPass123!'  // Demo password for testing
  },
  {
    id: 'lab',
    label: 'Lab Partner',
    icon: FaFlask,
    description: 'Laboratory services & results',
    redirectPath: '/lab-technician/dashboard',
    demoEmail: 'lab@healthwyz.mu',
    demoPassword: 'LabPass123!'  // Demo password for testing
  },
  {
    id: 'ambulance',
    label: 'Emergency',
    icon: FaAmbulance,
    description: 'Emergency services coordination',
    redirectPath: '/responder/dashboard',
    demoEmail: 'ambulance@healthwyz.mu',
    demoPassword: 'AmbulancePass123!'  // Demo password for testing
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: FaUserCog,
    description: 'Platform management & oversight',
    redirectPath: '/admin/dashboard',
    demoEmail: 'admin@healthwyz.mu',
    demoPassword: 'AdminPass123!'  // Demo password for testing
  },
  {
    id: 'corporate',
    label: 'Corporate',
    icon: FaBuilding,
    description: 'Corporate wellness programs',
    redirectPath: '/corporate/dashboard',
    demoEmail: 'corporate@healthwyz.mu',
    demoPassword: 'CorporatePass123!'  // Demo password for testing
  },
  {
    id: 'insurance',
    label: 'Insurance',
    icon: FaShieldAlt,
    description: 'Claims & policy management',
    redirectPath: '/insurance/dashboard',
    demoEmail: 'insurance@healthwyz.mu',
    demoPassword: 'InsurancePass123!'  // Demo password for testing
  },
  {
    id: 'referral-partner',
    label: 'Partner',
    icon: FaHandshake,
    description: 'Earn by referring new users',
    redirectPath: '/referral-partner/dashboard',
    demoEmail: 'partner@healthwyz.mu',
    demoPassword: 'PartnerPass123!'  // Demo password for testing
  }
]