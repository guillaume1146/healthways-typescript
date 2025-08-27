import { CorporateStats, Employee, ClaimsData, CorporateProfile, PaymentMethod, NotificationSettings, BillingHistory } from './types'

export const mockCorporateStats: CorporateStats = {
  totalEmployees: 245,
  activePolicyHolders: 230,
  pendingVerifications: 15,
  approvedClaims: 127,
  pendingClaims: 8,
  rejectedClaims: 3,
  monthlyContribution: 485000,
  totalClaims: 138
}

export const mockRecentEmployees: Employee[] = [
  {
    id: 'emp001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.mu',
    department: 'IT',
    policyType: 'Premium Health',
    status: 'active',
    joinDate: '2024-01-15',
    lastActivity: '2024-01-20'
  },
  {
    id: 'emp002',
    name: 'Michael Chen',
    email: 'michael.chen@company.mu',
    department: 'Marketing',
    policyType: 'Basic Health',
    status: 'pending',
    joinDate: '2024-01-18',
    lastActivity: 'N/A'
  },
  {
    id: 'emp003',
    name: 'Emma Wilson',
    email: 'emma.wilson@company.mu',
    department: 'Finance',
    policyType: 'Premium Health',
    status: 'active',
    joinDate: '2024-01-10',
    lastActivity: '2024-01-19'
  },
  {
    id: 'emp004',
    name: 'David Rodriguez',
    email: 'david.rodriguez@company.mu',
    department: 'HR',
    policyType: 'Family Health',
    status: 'active',
    joinDate: '2024-01-12',
    lastActivity: '2024-01-21'
  }
]

export const mockRecentClaims: ClaimsData[] = [
  {
    id: 'claim001',
    employeeName: 'Sarah Johnson',
    claimType: 'Medical Consultation',
    amount: 2500,
    status: 'approved',
    date: '2024-01-19',
    description: 'Cardiology consultation'
  },
  {
    id: 'claim002',
    employeeName: 'David Rodriguez',
    claimType: 'Lab Tests',
    amount: 1800,
    status: 'pending',
    date: '2024-01-20',
    description: 'Blood work and analysis'
  },
  {
    id: 'claim003',
    employeeName: 'Emma Wilson',
    claimType: 'Prescription',
    amount: 450,
    status: 'approved',
    date: '2024-01-18',
    description: 'Monthly medication refill'
  },
  {
    id: 'claim004',
    employeeName: 'Michael Chen',
    claimType: 'Emergency Care',
    amount: 5200,
    status: 'rejected',
    date: '2024-01-17',
    description: 'Emergency room visit'
  }
]

export const mockCorporateProfile: CorporateProfile = {
  companyName: 'TechCorp Mauritius Ltd',
  adminName: 'John Smith',
  email: 'admin@techcorp.mu',
  phone: '+230 212 3456',
  companyAddress: '123 Business Park, Ebene, Mauritius',
  taxId: 'TAX-2024-001234',
  sector: 'Information Technology',
  logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TC&backgroundColor=3b82f6',
  description: 'Leading technology company in Mauritius specializing in software development and digital solutions.',
  website: 'www.techcorp.mu',
  employeeCount: 245
}

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm001',
    type: 'Bank Transfer',
    details: 'MCB Account ****4567',
    isPrimary: true
  },
  {
    id: 'pm002',
    type: 'MCB Juice',
    details: 'Corporate Account +230 5xxx xxxx',
    isPrimary: false
  }
]

export const mockNotificationSettings: NotificationSettings = {
  newClaims: true,
  employeeAdditions: true,
  billingUpdates: true,
  policyRenewals: true,
  employeeNotifications: true,
  customAlerts: false
}

export const mockBillingHistory: BillingHistory[] = [
  {
    id: 'bill001',
    date: '2024-01-01',
    description: 'Monthly Premium - January 2024',
    amount: 485000,
    status: 'paid',
    invoice: 'INV-2024-001'
  },
  {
    id: 'bill002',
    date: '2023-12-01',
    description: 'Monthly Premium - December 2023',
    amount: 478000,
    status: 'paid',
    invoice: 'INV-2023-012'
  },
  {
    id: 'bill003',
    date: '2023-11-01',
    description: 'Monthly Premium - November 2023',
    amount: 465000,
    status: 'paid',
    invoice: 'INV-2023-011'
  }
]