"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  FaUsers,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileUpload,
  FaArrowLeft,
  FaCamera,
  FaPhone,
  FaEnvelope,
  FaDownload,
  FaCreditCard,
  FaUserShield
} from "react-icons/fa"

interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  type: "health" | "medical" | "comprehensive";
  status: "active" | "inactive" | "pending";
}

interface InsurancePlan {
  id: string;
  provider: InsuranceProvider;
  policyNumber: string;
  groupNumber: string;
  memberSince: string;
  validUntil: string;
  status: "active" | "expired" | "pending";
  type: "individual" | "family" | "corporate";
  premium: number;
  deductible: number;
  copay: number;
  maxCoverage: number;
}

interface Coverage {
  category: string;
  covered: boolean;
  percentage: number;
  maxAmount: number;
  remainingAmount: number;
  notes: string;
}

interface Claim {
  id: string;
  date: string;
  provider: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "processing";
  type: string;
  documents: string[];
}

interface Dependent {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  policyNumber: string;
  status: "active" | "inactive";
}

interface InsuranceData {
  primaryPlan: InsurancePlan | null;
  secondaryPlan: InsurancePlan | null;
  coverage: Coverage[];
  recentClaims: Claim[];
  dependents: Dependent[];
  documents: {
    id: string;
    name: string;
    type: string;
    uploadedDate: string;
    status: "verified" | "pending" | "rejected";
  }[];
}

const mockInsuranceData: InsuranceData = {
  primaryPlan: {
    id: "INS-001",
    provider: {
      id: "1",
      name: "Mauritius Health Insurance",
      logo: "🏥",
      type: "health",
      status: "active"
    },
    policyNumber: "MHI-123456789",
    groupNumber: "GRP-987654",
    memberSince: "2020-01-15",
    validUntil: "2025-01-15",
    status: "active",
    type: "family",
    premium: 5000,
    deductible: 10000,
    copay: 500,
    maxCoverage: 1000000
  },
  secondaryPlan: null,
  coverage: [
    {
      category: "General Consultations",
      covered: true,
      percentage: 100,
      maxAmount: 50000,
      remainingAmount: 42000,
      notes: "Unlimited visits"
    },
    {
      category: "Specialist Consultations",
      covered: true,
      percentage: 80,
      maxAmount: 100000,
      remainingAmount: 85000,
      notes: "Requires referral"
    },
    {
      category: "Prescription Medications",
      covered: true,
      percentage: 80,
      maxAmount: 50000,
      remainingAmount: 35000,
      notes: "Generic drugs preferred"
    },
    {
      category: "Laboratory Tests",
      covered: true,
      percentage: 90,
      maxAmount: 75000,
      remainingAmount: 60000,
      notes: "Pre-authorization required for special tests"
    },
    {
      category: "Hospitalization",
      covered: true,
      percentage: 100,
      maxAmount: 500000,
      remainingAmount: 500000,
      notes: "Semi-private room"
    },
    {
      category: "Emergency Services",
      covered: true,
      percentage: 100,
      maxAmount: 200000,
      remainingAmount: 200000,
      notes: "24/7 coverage"
    }
  ],
  recentClaims: [
    {
      id: "CLM-001",
      date: "2024-01-10",
      provider: "Dr. Sarah Johnson",
      amount: 2500,
      status: "approved",
      type: "Consultation",
      documents: ["consultation_receipt.pdf"]
    },
    {
      id: "CLM-002",
      date: "2024-01-05",
      provider: "Apollo Pharmacy",
      amount: 1200,
      status: "processing",
      type: "Medication",
      documents: ["prescription.pdf", "pharmacy_bill.pdf"]
    },
    {
      id: "CLM-003",
      date: "2023-12-20",
      provider: "MediLab Diagnostics",
      amount: 3500,
      status: "approved",
      type: "Lab Tests",
      documents: ["lab_report.pdf", "payment_receipt.pdf"]
    }
  ],
  dependents: [
    {
      id: "DEP-001",
      name: "Jane Smith",
      relationship: "Spouse",
      dateOfBirth: "1990-03-20",
      policyNumber: "MHI-123456789-D1",
      status: "active"
    },
    {
      id: "DEP-002",
      name: "Tom Smith",
      relationship: "Child",
      dateOfBirth: "2015-07-10",
      policyNumber: "MHI-123456789-D2",
      status: "active"
    }
  ],
  documents: [
    {
      id: "DOC-001",
      name: "Insurance Card - Front",
      type: "image",
      uploadedDate: "2024-01-01",
      status: "verified"
    },
    {
      id: "DOC-002",
      name: "Insurance Card - Back",
      type: "image",
      uploadedDate: "2024-01-01",
      status: "verified"
    },
    {
      id: "DOC-003",
      name: "Policy Document",
      type: "pdf",
      uploadedDate: "2024-01-01",
      status: "verified"
    }
  ]
}

export default function InsuranceVerificationPage() {
  const [insuranceData] = useState<InsuranceData>(mockInsuranceData)
  const [activeTab, setActiveTab] = useState<"overview" | "coverage" | "claims" | "documents">("overview")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)

  console.log(showUploadModal)
  console.log(showClaimModal)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/patient/dashboard" className="text-gray-600 hover:text-primary-blue">
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Insurance Verification</h1>
                <p className="text-gray-600">Manage your insurance coverage and claims</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <FaFileUpload />
                Upload Document
              </button>
              <button
                onClick={() => setShowClaimModal(true)}
                className="btn-gradient px-6 py-2 flex items-center gap-2"
              >
                <FaCreditCard />
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Insurance Status Card */}
        {insuranceData.primaryPlan && (
          <div className="bg-gradient-main text-white rounded-2xl p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="text-6xl bg-white/20 rounded-2xl p-4">
                  {insuranceData.primaryPlan.provider.logo}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{insuranceData.primaryPlan.provider.name}</h2>
                  <p className="text-white/90 mb-4">Policy #{insuranceData.primaryPlan.policyNumber}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-white/70 text-sm">Status</p>
                      <span className="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium mt-1">
                        Active
                      </span>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Valid Until</p>
                      <p className="font-semibold">{insuranceData.primaryPlan.validUntil}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Deductible</p>
                      <p className="font-semibold">{formatCurrency(insuranceData.primaryPlan.deductible)}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Max Coverage</p>
                      <p className="font-semibold">{formatCurrency(insuranceData.primaryPlan.maxCoverage)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2">
                <FaDownload />
                Download Card
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { key: "overview" as const, label: "Overview", icon: FaShieldAlt },
                { key: "coverage" as const, label: "Coverage Details", icon: FaCheckCircle },
                { key: "claims" as const, label: "Claims History", icon: FaCreditCard },
                { key: "documents" as const, label: "Documents", icon: FaFileUpload }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium ${
                    activeTab === tab.key
                      ? "text-primary-blue border-b-2 border-primary-blue"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <tab.icon />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <FaUserShield className="text-blue-500 text-2xl mb-2" />
                    <p className="text-gray-600 text-sm">Plan Type</p>
                    <p className="font-semibold text-lg capitalize">{insuranceData.primaryPlan?.type}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <FaCheckCircle className="text-green-500 text-2xl mb-2" />
                    <p className="text-gray-600 text-sm">Coverage Used</p>
                    <p className="font-semibold text-lg">16%</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <FaUsers className="text-purple-500 text-2xl mb-2" />
                    <p className="text-gray-600 text-sm">Dependents</p>
                    <p className="font-semibold text-lg">{insuranceData.dependents.length}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <FaCreditCard className="text-orange-500 text-2xl mb-2" />
                    <p className="text-gray-600 text-sm">Monthly Premium</p>
                    <p className="font-semibold text-lg">{formatCurrency(insuranceData.primaryPlan?.premium || 0)}</p>
                  </div>
                </div>

                {/* Dependents */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Covered Dependents</h3>
                  <div className="space-y-3">
                    {insuranceData.dependents.map((dependent) => (
                      <div key={dependent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{dependent.name}</p>
                          <p className="text-sm text-gray-600">{dependent.relationship} • Born {dependent.dateOfBirth}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(dependent.status)}`}>
                          {dependent.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FaPhone />
                      <span>+230 123 4567</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-800">
                      <FaEnvelope />
                      <span>support@healthinsurance.mu</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Coverage Tab */}
            {activeTab === "coverage" && (
              <div className="space-y-4">
                {insuranceData.coverage.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.category}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">Coverage</p>
                            <p className="font-medium">{item.percentage}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Max Amount</p>
                            <p className="font-medium">{formatCurrency(item.maxAmount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Remaining</p>
                            <p className="font-medium text-green-600">{formatCurrency(item.remainingAmount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Used</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-primary-blue rounded-full h-2"
                                style={{ width: `${((item.maxAmount - item.remainingAmount) / item.maxAmount) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {item.covered ? (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      ) : (
                        <FaExclamationTriangle className="text-red-500 text-xl" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Claims Tab */}
            {activeTab === "claims" && (
              <div className="space-y-4">
                {insuranceData.recentClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">Claim #{claim.id}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </span>
                        </div>
                        <p className="text-gray-600">{claim.provider} • {claim.type}</p>
                        <p className="text-sm text-gray-500">{claim.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{formatCurrency(claim.amount)}</p>
                        <button className="text-primary-blue text-sm hover:underline mt-2">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-4">
                {insuranceData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {doc.type === "image" ? <FaCamera className="text-gray-500" /> : <FaFileUpload className="text-gray-500" />}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">Uploaded {doc.uploadedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      <button className="text-primary-blue hover:text-blue-700">
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}