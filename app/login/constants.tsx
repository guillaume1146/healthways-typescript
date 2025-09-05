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
    demoEmail: 'patient@Healthwyz.mu'
  },
  {
    id: 'doctor',
    label: 'Doctor',
    icon: FaUserMd,
    description: 'Manage patients & consultations',
    redirectPath: '/doctor/dashboard',
    demoEmail: 'dr.sarah@Healthwyz.mu'
  },
  {
    id: 'nurse',
    label: 'Nurse',
    icon: FaUserNurse,
    description: 'Provide home care services',
    redirectPath: '/nurse/dashboard',
    demoEmail: 'nurse@Healthwyz.mu'
  },
  {
    id: 'child-care-nurse',
    label: 'Nanny',
    icon: FaChild,
    description: 'Provide child care services',
    redirectPath: '/nanny/dashboard',
    demoEmail: 'nanny@Healthwyz.mu'
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    icon: FaPills,
    description: 'Manage inventory & prescriptions',
    redirectPath: '/pharmacist/dashboard',
    demoEmail: 'pharmacy@Healthwyz.mu'
  },
  {
    id: 'lab',
    label: 'Lab Partner',
    icon: FaFlask,
    description: 'Laboratory services & results',
    redirectPath: '/lab-technician/dashboard',
    demoEmail: 'lab@Healthwyz.mu'
  },
  {
    id: 'ambulance',
    label: 'Emergency',
    icon: FaAmbulance,
    description: 'Emergency services coordination',
    redirectPath: '/responder/dashboard',
    demoEmail: 'ambulance@Healthwyz.mu'
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: FaUserCog,
    description: 'Platform management & oversight',
    redirectPath: '/admin/dashboard',
    demoEmail: 'admin@Healthwyz.mu'
  },
  {
    id: 'corporate',
    label: 'Corporate',
    icon: FaBuilding,
    description: 'Corporate wellness programs',
    redirectPath: '/corporate/dashboard',
    demoEmail: 'corporate@Healthwyz.mu'
  },
  {
    id: 'insurance',
    label: 'Insurance',
    icon: FaShieldAlt,
    description: 'Claims & policy management',
    redirectPath: '/insurance/dashboard',
    demoEmail: 'insurance@Healthwyz.mu'
  },
  {
    id: 'referral-partner',
    label: 'Partner',
    icon: FaHandshake,
    description: 'Earn by referring new users',
    redirectPath: '/referral-partner/dashboard',
    demoEmail: 'partner@Healthwyz.mu'
  }
]