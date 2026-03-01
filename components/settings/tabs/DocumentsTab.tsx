'use client'

import { useState } from 'react'
import { FaUpload, FaFileAlt } from 'react-icons/fa'

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

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents }) => {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({})

  const handleFileUpload = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedFiles((prev) => ({ ...prev, [key]: e.target.files![0] }))
    }
  }

  const requiredCount = documents.filter((d) => d.required).length
  const requiredUploaded = documents.filter((d) => d.required && uploadedFiles[d.key]).length
  const optionalCount = documents.filter((d) => !d.required).length
  const optionalUploaded = documents.filter((d) => !d.required && uploadedFiles[d.key]).length

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <FaFileAlt className="text-blue-600" /> Document Upload
      </h2>
      <p className="text-gray-600 mb-6">Upload required documents for verification.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800">
              {doc.title} {doc.required && <span className="text-red-500">*</span>}
            </h4>
            <p className="text-sm text-gray-500 mb-2">{doc.description}</p>
            <label className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer block hover:border-blue-500 hover:bg-blue-50 transition">
              <input type="file" className="sr-only" accept={doc.acceptedFormats} onChange={handleFileUpload(doc.key)} />
              <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
              {uploadedFiles[doc.key] ? (
                <p className="text-sm text-green-600 font-semibold">{uploadedFiles[doc.key].name}</p>
              ) : (
                <p className="text-sm text-gray-600">Drag & drop, or click to browse</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Accepted: {doc.acceptedFormats}</p>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Upload Progress</h3>
        <p className="text-sm text-gray-600">Required: {requiredUploaded} / {requiredCount}</p>
        <p className="text-sm text-gray-600">Optional: {optionalUploaded} / {optionalCount}</p>
      </div>
    </div>
  )
}

export default DocumentsTab
