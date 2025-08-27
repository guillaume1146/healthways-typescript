'use client'

import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { userTypes, documentRequirements } from './constants'
import { SignupFormData, Document } from './types'
import ProgressSteps from './ProgressSteps'
import AccountTypeStep from './AccountTypeStep'
import BasicInfoStep from './BasicInfoStep'
import DocumentUploadStep from './DocumentUploadStep'
import VerificationStep from './VerificationStep'
import NavigationButtons from './NavigationButtons'
import LegalModals from './LegalModals'

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedUserType, setSelectedUserType] = useState<string>('patient')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [documents, setDocuments] = useState<Document[]>(documentRequirements.patient)
  
  // Modal states
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const router = useRouter()

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    userType: 'patient',
    referralCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToDisclaimer: false
  })

  // Listen for custom events to open modals
  useEffect(() => {
    const handleOpenTerms = () => setTermsOpen(true)
    const handleOpenPrivacy = () => setPrivacyOpen(true)
    const handleOpenDisclaimer = () => setDisclaimerOpen(true)

    window.addEventListener('openTerms', handleOpenTerms)
    window.addEventListener('openPrivacy', handleOpenPrivacy)
    window.addEventListener('openDisclaimer', handleOpenDisclaimer)

    return () => {
      window.removeEventListener('openTerms', handleOpenTerms)
      window.removeEventListener('openPrivacy', handleOpenPrivacy)
      window.removeEventListener('openDisclaimer', handleOpenDisclaimer)
    }
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleUserTypeChange = (userTypeId: string) => {
    setSelectedUserType(userTypeId)
    setFormData(prev => ({ ...prev, userType: userTypeId }))
    setDocuments(documentRequirements[userTypeId] || [])
  }

  const handleFileUpload = (documentId: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, file, uploaded: true }
        : doc
    ))
  }

  const removeFile = (documentId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, file: undefined, uploaded: false }
        : doc
    ))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return selectedUserType !== ''
      case 2:
        // Base validation for all users
        const baseValid = !!(formData.fullName && formData.email && formData.password && 
               formData.confirmPassword && formData.phone && formData.dateOfBirth && 
               formData.gender && formData.address)
        
        if (!baseValid) return false

        // Additional validation for specific user types
        if (formData.userType === 'corporate') {
          return !!(formData.companyName && formData.jobTitle && formData.companyAddress)
        }
        
        if (formData.userType === 'regional-admin') {
          return !!(formData.targetCountry && formData.businessPlan)
        }
        
        return true
      case 3:
        const requiredDocs = documents.filter(doc => doc.required)
        return requiredDocs.every(doc => doc.uploaded)
      case 4:
        // For step 4, we just need the required documents uploaded and form filled
        // The checkboxes will be validated in handleSubmit
        const step4RequiredDocs = documents.filter(doc => doc.required)
        return step4RequiredDocs.every(doc => doc.uploaded)
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call - replace with your actual API endpoint
      console.log('Submitting registration:', { 
        formData, 
        documents: documents.filter(doc => doc.uploaded),
        userType: selectedUserType
      })

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Set success state
      setSubmissionSuccess(true)
      
      // Wait a moment to show success, then redirect
      setTimeout(() => {
        router.push('/login?registration=success')
      }, 2000)
      
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again later or contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedType = userTypes.find(type => type.id === selectedUserType)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Healthwyz</h1>
              <p className="text-gray-600 text-lg">Create your professional healthcare account</p>
            </div>

            {/* Progress Steps */}
            <ProgressSteps currentStep={currentStep} />

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Success Display */}
              {submissionSuccess && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-green-600 mb-4">Registration Submitted Successfully!</h2>
                  <div className="max-w-md mx-auto">
                    <p className="text-gray-600 mb-4">
                      Your registration has been received and is being processed.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-blue-800 text-sm">
                        {formData.userType === 'corporate' || formData.userType === 'regional-admin' 
                          ? 'Your account requires super administrator approval and will be reviewed within 2-5 business days.' 
                          : 'Your account will be verified within 2-5 business days.'
                        }
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm">
                      You will receive a confirmation email shortly. Redirecting to login page...
                    </p>
                    <div className="mt-4">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Form Steps */}
              {!submissionSuccess && (
                <>
                  {/* Step 1: Account Type Selection */}
                  {currentStep === 1 && (
                    <AccountTypeStep 
                      selectedUserType={selectedUserType} 
                      onUserTypeChange={handleUserTypeChange} 
                    />
                  )}

                  {/* Step 2: Basic Information */}
                  {currentStep === 2 && (
                    <BasicInfoStep 
                      formData={formData}
                      selectedType={selectedType}
                      showPassword={showPassword}
                      showConfirmPassword={showConfirmPassword}
                      onFormChange={handleChange}
                      onPasswordToggle={() => setShowPassword(!showPassword)}
                      onConfirmPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  )}

                  {/* Step 3: Document Upload */}
                  {currentStep === 3 && (
                    <DocumentUploadStep 
                      documents={documents}
                      onFileUpload={handleFileUpload}
                      onRemoveFile={removeFile}
                    />
                  )}

                  {/* Step 4: Verification */}
                  {currentStep === 4 && (
                    <VerificationStep 
                      formData={formData}
                      selectedType={selectedType}
                      documents={documents}
                    />
                  )}

                  {/* Navigation Buttons */}
                  <NavigationButtons 
                    currentStep={currentStep}
                    isSubmitting={isSubmitting}
                    canProceed={validateStep(currentStep)}
                    onPrevious={prevStep}
                    onNext={nextStep}
                    onSubmit={handleSubmit}
                  />
                </>
              )}
            </div>

            {/* Help Section */}
            {!submissionSuccess && (
              <>
                <div className="text-center mt-8">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                      Sign in here
                    </Link>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Need help with registration?{' '}
                    <Link href="/support" className="text-blue-600 hover:underline">
                      Contact Support
                    </Link>{' '}
                    or call +230 400 4000
                  </p>
                </div>

                {/* Legal Information Preview Buttons */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm mb-3">Review our legal documents before registration:</p>
                  <div className="flex justify-center gap-4 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setDisclaimerOpen(true)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium underline"
                    >
                      Medical Disclaimer
                    </button>
                    <button
                      type="button"
                      onClick={() => setTermsOpen(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    >
                      Terms of Service
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacyOpen(true)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium underline"
                    >
                      Privacy Policy
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Legal Modals */}
        <LegalModals
          disclaimerOpen={disclaimerOpen}
          termsOpen={termsOpen}
          privacyOpen={privacyOpen}
          onCloseDisclaimer={() => setDisclaimerOpen(false)}
          onCloseTerms={() => setTermsOpen(false)}
          onClosePrivacy={() => setPrivacyOpen(false)}
        />
      </div>
    </div>
  )
}