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
    description: 'Provide Child care services',
    redirectPath: '/nanny/dashboard',
    demoEmail: 'nurse@Healthwyz.mu'
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
    label: 'Emergency Responder',
    icon: FaAmbulance,
    description: 'Emergency services coordination',
    redirectPath: '/responder/dashboard',
    demoEmail: 'ambulance@Healthwyz.mu'
  },
  {
    id: 'admin',
    label: 'Administrator',
    icon: FaUserCog,
    description: 'Platform management & oversight',
    redirectPath: '/admin/dashboard',
    demoEmail: 'ambulance@Healthwyz.mu'
  },
  // NEW USER TYPES
  {
    id: 'corporate',
    label: 'Corporate Administrator',
    icon: FaBuilding,
    description: 'Corporate wellness program management',
    redirectPath: '/corporate/dashboard',
    demoEmail: 'corporate@Healthwyz.mu'
  },
  {
    id: 'insurance',
    label: 'Insurance Representative',
    icon: FaShieldAlt,
    description: 'Insurance claims & policy management',
    redirectPath: '/insurance/dashboard',
    demoEmail: 'insurance@Healthwyz.mu'
  },
  {
    id: 'referral-partner',
    label: 'Referral Partner',
    icon: FaHandshake,
    description: 'Earn by bringing new users to platform',
    redirectPath: '/referral-partner/dashboard',
    demoEmail: 'partner@Healthwyz.mu'
  }
]