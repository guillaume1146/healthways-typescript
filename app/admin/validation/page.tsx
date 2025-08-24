'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaCheckCircle, FaTimes, FaEye, FaDownload, FaExclamationTriangle,
  FaUserMd, FaUserNurse, FaChild, FaAmbulance, FaPills, FaFlask,
  FaFileAlt, FaCertificate, FaIdCard, FaClock, FaSearch
} from 'react-icons/fa'

interface Document {
  id: string
  type: string
  name: string
  status: 'verified' | 'pending' | 'rejected'
  uploadDate: string
  expiryDate?: string
  fileUrl: string
}

interface ValidationRequest {
  id: string
  profileId: string
  name: string
  category: string
  email: string
  phone: string
  submittedDate: string
  documents: Document[]
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  priority: 'high' | 'medium' | 'low'
  avatar: string
}

const mockValidationRequests: ValidationRequest[] = [
  {
    id: 'V001',
    profileId: 'P003',
    name: 'Emily Carter',
    category: 'Child Care',
    email: 'emily.c@kids.mu',
    phone: '+230 5789 0125',
    submittedDate: '2025-08-20',
    priority: 'high',
    status: 'pending',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Emily',
    documents: [
      { id: 'd1', type: 'Certification', name: 'Pediatric-Nursing-Cert.pdf', status: 'pending', uploadDate: '2025-08-20', fileUrl: '#' },
      { id: 'd2', type: 'License', name: 'Nursing-License.pdf', status: 'pending', uploadDate: '2025-08-20', expiryDate: '2027-08-20', fileUrl: '#' },
      { id: 'd3', type: 'ID', name: 'National-ID.pdf', status: 'verified', uploadDate: '2025-08-20', fileUrl: '#' }
    ]
  },
  {
    id: 'V002',
    profileId: 'P007',
    name: 'Dr. Michael Chen',
    category: 'Doctor',
    email: 'michael.c@med.mu',
    phone: '+230 5789 0127',
    submittedDate: '2025-08-19',
    priority: 'medium',
    status: 'under_review',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Michael',
    documents: [
      { id: 'd4', type: 'Certification', name: 'Medical-Degree.pdf', status: 'verified', uploadDate: '2025-08-19', fileUrl: '#' },
      { id: 'd5', type: 'License', name: 'Medical-License.pdf', status: 'pending', uploadDate: '2025-08-19', expiryDate: '2026-12-31', fileUrl: '#' }
    ]
  },
  {
    id: 'V003',
    profileId: 'P008',
    name: 'QuickLab Diagnostics',
    category: 'Lab Tech',
    email: 'info@quicklab.mu',
    phone: '+230 5789 0128',
    submittedDate: '2025-08-18',
    priority: 'low',
    status: 'pending',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Lab',
    documents: [
      { id: 'd6', type: 'License', name: 'Lab-Operating-License.pdf', status: 'pending', uploadDate: '2025-08-18', expiryDate: '2026-06-30', fileUrl: '#' }
    ]
  }
]

export default function AccountValidation() {
  const [requests, setRequests] = useState(mockValidationRequests)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<ValidationRequest | null>(null)

  const categories = ['All', 'Doctor', 'Nurse', 'Child Care', 'Emergency', 'Pharmacy', 'Lab Tech']

  const filteredRequests = requests.filter(req => {
    const matchCategory = selectedCategory === 'All' || req.category === selectedCategory
    const matchSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        req.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return styles[priority as keyof typeof styles]
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      verified: 'bg-green-100 text-green-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'approved' as const } : req
    ))
    setSelectedRequest(null)
  }

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ))
    setSelectedRequest(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account Validation</h1>
              <p className="text-gray-600">Review and approve provider registrations</p>
            </div>
            <Link href="/admin/dashboard" className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{requests.filter(r => r.status === 'pending').length}</p>
                <p className="text-gray-600 text-sm">Pending Review</p>
              </div>
              <FaClock className="text-orange-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{requests.filter(r => r.status === 'under_review').length}</p>
                <p className="text-gray-600 text-sm">Under Review</p>
              </div>
              <FaEye className="text-blue-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'approved').length}</p>
                <p className="text-gray-600 text-sm">Approved Today</p>
              </div>
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{requests.filter(r => r.priority === 'high').length}</p>
                <p className="text-gray-600 text-sm">High Priority</p>
              </div>
              <FaExclamationTriangle className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
          </div>
        </div>

        {/* Validation Requests Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Provider</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Documents</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Priority</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Submitted</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Image 
                        src={request.avatar} 
                        alt={request.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{request.name}</p>
                        <p className="text-sm text-gray-500">{request.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700">{request.category}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">{request.documents.length} files</span>
                      <span className="text-xs text-gray-500">
                        ({request.documents.filter(d => d.status === 'verified').length} verified)
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700">{request.submittedDate}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        <FaEye />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Document Review: {selectedRequest.name}</h2>
            <div className="space-y-4">
              {selectedRequest.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-gray-600 text-xl" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">Type: {doc.type} • Uploaded: {doc.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(doc.status)}`}>
                      {doc.status}
                    </span>
                    <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}