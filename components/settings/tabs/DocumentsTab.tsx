'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaUpload, FaFileAlt, FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa'

export interface DocumentField {
  key: string
  title: string
  description: string
  required: boolean
  acceptedFormats: string
}

interface DocumentsTabProps {
  documents: DocumentField[]
}

interface DocumentUploadState {
  file: File | null
  status: 'idle' | 'uploading' | 'verified' | 'failed'
  message?: string
  confidence?: number
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents }) => {
  const [uploadStates, setUploadStates] = useState<Record<string, DocumentUploadState>>(() => {
    const initial: Record<string, DocumentUploadState> = {}
    documents.forEach((doc) => {
      initial[doc.key] = { file: null, status: 'idle' }
    })
    return initial
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')

  // Load userId and name from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        const user = JSON.parse(stored)
        if (user?.id) setUserId(user.id)
        if (user?.firstName && user?.lastName) {
          setUserName(`${user.firstName} ${user.lastName}`)
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const handleFileUpload = useCallback((key: string, documentType: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Update state with the selected file and set to uploading
    setUploadStates((prev) => ({
      ...prev,
      [key]: { file, status: 'uploading' },
    }))

    if (!userId) {
      setUploadStates((prev) => ({
        ...prev,
        [key]: { file, status: 'failed', message: 'User session not found. Please log in again.' },
      }))
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fullName', userName || 'Unknown User')
      formData.append('documentType', documentType)

      const res = await fetch('/api/documents/verify', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setUploadStates((prev) => ({
          ...prev,
          [key]: {
            file,
            status: 'failed',
            message: data.message || 'Upload failed. Please try again.',
          },
        }))
        return
      }

      if (data.verified) {
        setUploadStates((prev) => ({
          ...prev,
          [key]: {
            file,
            status: 'verified',
            message: `Document verified (confidence: ${Math.round((data.confidence || 0) * 100)}%)`,
            confidence: data.confidence,
          },
        }))
      } else {
        setUploadStates((prev) => ({
          ...prev,
          [key]: {
            file,
            status: 'failed',
            message: data.nameFound
              ? 'Document verified but name match was low confidence. Please re-upload a clearer document.'
              : 'Could not verify your name on this document. Please ensure the document is clear and contains your full name.',
          },
        }))
      }
    } catch {
      setUploadStates((prev) => ({
        ...prev,
        [key]: {
          file,
          status: 'failed',
          message: 'Network error. Please try again.',
        },
      }))
    }
  }, [userId, userName])

  const getStatusIcon = (status: DocumentUploadState['status']) => {
    switch (status) {
      case 'uploading':
        return <FaSpinner className="animate-spin text-blue-500" />
      case 'verified':
        return <FaCheckCircle className="text-green-500" />
      case 'failed':
        return <FaTimesCircle className="text-red-500" />
      default:
        return null
    }
  }

  const getStatusBorderColor = (status: DocumentUploadState['status']) => {
    switch (status) {
      case 'uploading':
        return 'border-blue-300 bg-blue-50'
      case 'verified':
        return 'border-green-300 bg-green-50'
      case 'failed':
        return 'border-red-300 bg-red-50'
      default:
        return 'border-gray-200'
    }
  }

  const requiredCount = documents.filter((d) => d.required).length
  const requiredUploaded = documents.filter((d) => d.required && uploadStates[d.key]?.status === 'verified').length
  const optionalCount = documents.filter((d) => !d.required).length
  const optionalUploaded = documents.filter((d) => !d.required && uploadStates[d.key]?.status === 'verified').length

  // Count files that have been selected (regardless of verification status)
  const requiredWithFile = documents.filter((d) => d.required && uploadStates[d.key]?.file).length
  const optionalWithFile = documents.filter((d) => !d.required && uploadStates[d.key]?.file).length

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <FaFileAlt className="text-blue-600" /> Document Upload
      </h2>
      <p className="text-gray-600 mb-6">Upload required documents for verification.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => {
          const state = uploadStates[doc.key] || { file: null, status: 'idle' as const }
          return (
            <div key={doc.key} className={`border rounded-lg p-4 ${getStatusBorderColor(state.status)}`}>
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-gray-800">
                  {doc.title} {doc.required && <span className="text-red-500">*</span>}
                </h4>
                {getStatusIcon(state.status)}
              </div>
              <p className="text-sm text-gray-500 mb-2">{doc.description}</p>
              <label className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer block hover:border-blue-500 hover:bg-blue-50 transition ${state.status === 'uploading' ? 'pointer-events-none opacity-60' : ''}`}>
                <input
                  type="file"
                  className="sr-only"
                  accept={doc.acceptedFormats}
                  onChange={handleFileUpload(doc.key, doc.key)}
                  disabled={state.status === 'uploading'}
                />
                {state.status === 'uploading' ? (
                  <>
                    <FaSpinner className="mx-auto text-blue-400 text-2xl mb-2 animate-spin" />
                    <p className="text-sm text-blue-600 font-semibold">Verifying document...</p>
                  </>
                ) : (
                  <>
                    <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                    {state.file ? (
                      <p className="text-sm text-green-600 font-semibold">{state.file.name}</p>
                    ) : (
                      <p className="text-sm text-gray-600">Drag & drop, or click to browse</p>
                    )}
                  </>
                )}
                <p className="text-xs text-gray-500 mt-1">Accepted: {doc.acceptedFormats}</p>
              </label>
              {state.message && (
                <div className={`mt-2 text-xs flex items-center gap-1 ${state.status === 'verified' ? 'text-green-600' : 'text-red-600'}`}>
                  {state.status === 'failed' && <FaExclamationTriangle />}
                  {state.status === 'verified' && <FaCheckCircle />}
                  {state.message}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Upload Progress</h3>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            Required: {requiredWithFile} / {requiredCount} uploaded
            {requiredUploaded > 0 && (
              <span className="text-green-600 ml-1">({requiredUploaded} verified)</span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            Optional: {optionalWithFile} / {optionalCount} uploaded
            {optionalUploaded > 0 && (
              <span className="text-green-600 ml-1">({optionalUploaded} verified)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DocumentsTab
