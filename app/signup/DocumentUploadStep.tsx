import { FaUpload, FaCheck, FaFileAlt, FaTimes } from 'react-icons/fa'
import { Document } from './types'

interface DocumentUploadStepProps {
  documents: Document[];
  onFileUpload: (documentId: string, file: File) => void;
  onRemoveFile: (documentId: string) => void;
}

export default function DocumentUploadStep({ documents, onFileUpload, onRemoveFile }: DocumentUploadStepProps) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
          <FaUpload className="text-3xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
          <p className="text-gray-600">Please upload the required documents for verification</p>
        </div>
      </div>

      <div className="space-y-6">
        {documents.map((doc) => (
          <div key={doc.id} className={`border-2 rounded-xl p-6 ${doc.required ? 'border-red-200' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{doc.name}</h3>
                  {doc.required && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                      Required
                    </span>
                  )}
                  {doc.uploaded && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <FaCheck className="text-xs" />
                      Uploaded
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{doc.description}</p>
                <p className="text-gray-500 text-xs">Accepted formats: {doc.accepted}</p>
              </div>
            </div>

            {doc.uploaded && doc.file ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">{doc.file.name}</p>
                    <p className="text-green-600 text-sm">{(doc.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(doc.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
                <input
                  type="file"
                  accept={doc.accepted}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onFileUpload(doc.id, file)
                  }}
                  className="hidden"
                  id={`file-${doc.id}`}
                />
                <label
                  htmlFor={`file-${doc.id}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer inline-block"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upload Progress Summary */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">Upload Progress</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Required Documents:</span>
            <span className="font-medium ml-2">
              {documents.filter(doc => doc.required && doc.uploaded).length} / {documents.filter(doc => doc.required).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Optional Documents:</span>
            <span className="font-medium ml-2">
              {documents.filter(doc => !doc.required && doc.uploaded).length} / {documents.filter(doc => !doc.required).length}
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Required Documents Progress</span>
            <span className="font-medium">
              {Math.round((documents.filter(doc => doc.required && doc.uploaded).length / documents.filter(doc => doc.required).length) * 100) || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ 
                width: `${(documents.filter(doc => doc.required && doc.uploaded).length / documents.filter(doc => doc.required).length) * 100 || 0}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}