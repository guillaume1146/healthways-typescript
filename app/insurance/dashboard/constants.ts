import { InsuranceDashboardData } from './types'

export const mockInsuranceData: InsuranceDashboardData = {
  name: 'Marie Dubois',
  location: 'Port Louis',
  companyName: 'SwissRe Mauritius',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MD&backgroundColor=3b82f6',
  stats: {
    activePolicies: 247,
    pendingClaims: 18,
    monthlyCommission: 45600,
    policyHolders: 312,
    expiringPolicies: 23,
    claimApprovalRate: 89.5,
  },
  recentClaims: [
    { 
      id: 'c1', 
      claimId: '#CLM-2025-0156', 
      policyHolderName: 'David Chen', 
      policyType: 'Health Insurance', 
      claimAmount: 15000, 
      status: 'pending',
      submittedDate: '2025-01-15',
      description: 'Hospitalization for cardiac procedure'
    },
    { 
      id: 'c2', 
      claimId: '#CLM-2025-0155', 
      policyHolderName: 'Sarah Williams', 
      policyType: 'Motor Insurance', 
      claimAmount: 8500, 
      status: 'approved',
      submittedDate: '2025-01-14',
      description: 'Vehicle collision damage repair'
    },
    { 
      id: 'c3', 
      claimId: '#CLM-2025-0154', 
      policyHolderName: 'Ahmed Hassan', 
      policyType: 'Life Insurance', 
      claimAmount: 250000, 
      status: 'processing',
      submittedDate: '2025-01-13',
      description: 'Life insurance claim settlement'
    },
    { 
      id: 'c4', 
      claimId: '#CLM-2025-0153', 
      policyHolderName: 'Lisa Johnson', 
      policyType: 'Property Insurance', 
      claimAmount: 12000, 
      status: 'rejected',
      submittedDate: '2025-01-12',
      description: 'Property damage due to flooding'
    },
  ],
  policyHolders: [
    {
      id: 'ph1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+230 5123 4567',
      policyNumber: 'POL-2024-0789',
      policyType: 'Health Insurance',
      premium: 3500,
      status: 'active',
      expiryDate: '2025-03-15',
      coverageAmount: 500000
    },
    {
      id: 'ph2',
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+230 5234 5678',
      policyNumber: 'POL-2024-0790',
      policyType: 'Motor Insurance',
      premium: 2800,
      status: 'active',
      expiryDate: '2025-04-20',
      coverageAmount: 150000
    },
    {
      id: 'ph3',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+230 5345 6789',
      policyNumber: 'POL-2024-0791',
      policyType: 'Life Insurance',
      premium: 4200,
      status: 'expired',
      expiryDate: '2024-12-30',
      coverageAmount: 1000000
    },
  ],
  earnings: {
    totalCommission: 45600,
    platformFee: 2280, // 5%
    netPayout: 43320,
  },
}

export const policyTypes = [
  'Health Insurance',
  'Motor Insurance',
  'Life Insurance',
  'Property Insurance',
  'Travel Insurance',
  'Business Insurance',
  'Marine Insurance',
]

export const claimStatuses = [
  { value: 'pending', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
]

export const policyStatuses = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800' },
  { value: 'suspended', label: 'Suspended', color: 'bg-yellow-100 text-yellow-800' },
]