import { IconType } from 'react-icons'

export interface InsuranceDashboardData {
  name: string
  location: string
  avatar: string
  companyName: string
  stats: {
    activePolicies: number
    pendingClaims: number
    monthlyCommission: number
    policyHolders: number
    expiringPolicies: number
    claimApprovalRate: number
  }
  recentClaims: InsuranceClaim[]
  policyHolders: PolicyHolder[]
  earnings: {
    totalCommission: number
    platformFee: number
    netPayout: number
  }
}

export interface InsuranceClaim {
  id: string
  claimId: string
  policyHolderName: string
  policyType: string
  claimAmount: number
  status: 'pending' | 'approved' | 'rejected' | 'processing'
  submittedDate: string
  description: string
}

export interface PolicyHolder {
  id: string
  name: string
  email: string
  phone: string
  policyNumber: string
  policyType: string
  premium: number
  status: 'active' | 'expired' | 'suspended'
  expiryDate: string
  coverageAmount: number
}

export interface StatCardProps {
  icon: IconType
  title: string
  value: string | number
  color: string
  subtitle?: string
}

export interface InsuranceProfileSettings {
  name: string
  email: string
  phone: string
  alternatePhone: string
  address: string
  companyName: string
  licenseNumber: string
  specialization: string
  experience: number
  bio: string
  languages: string[]
  services: string[]
}

export interface BillingSettings {
  accountType: 'MCB Juice' | 'Bank Transfer' | 'Mobile Money'
  accountDetails: {
    accountNumber: string
    accountName: string
    bankName: string
  }
  commissionRate: number
  paymentMethods: string[]
  taxId: string
}

export interface NotificationSettings {
  policyExpiry: boolean
  claimUpdates: boolean
  paymentReminders: boolean
  commissionAlerts: boolean
  systemUpdates: boolean
}