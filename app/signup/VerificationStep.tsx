import Link from 'next/link'
import { FaCheck, FaInfoCircle } from 'react-icons/fa'
import { SignupFormData, UserType, Document } from './types'

interface VerificationStepProps {
  formData: SignupFormData;
  selectedType: UserType | undefined;
  documents: Document[];
}

export default function VerificationStep({ formData, selectedType, documents }: VerificationStepProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheck className="text-green-600 text-3xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Please review your information before submitting your registration</p>
      </div>

      {/* Summary */}
      <div className="space-y-6">
        {/* Account Type */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Account Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Account Type:</span>
              <p className="font-semibold">{selectedType?.label}</p>
            </div>
            <div>
              <span className="text-gray-600">Full Name:</span>
              <p className="font-semibold">{formData.fullName}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-semibold">{formData.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <p className="font-semibold">{formData.phone}</p>
            </div>
          </div>
        </div>

        {/* Professional Info (if applicable) */}
        {formData.userType !== 'patient' && (formData.licenseNumber || formData.specialization) && (
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Professional Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {formData.licenseNumber && (
                <div>
                  <span className="text-gray-600">License Number:</span>
                  <p className="font-semibold">{formData.licenseNumber}</p>
                </div>
              )}
              {formData.specialization && (
                <div>
                  <span className="text-gray-600">Specialization:</span>
                  <p className="font-semibold">{formData.specialization}</p>
                </div>
              )}
              {formData.institution && (
                <div>
                  <span className="text-gray-600">Institution:</span>
                  <p className="font-semibold">{formData.institution}</p>
                </div>
              )}
              {formData.experience && (
                <div>
                  <span className="text-gray-600">Experience:</span>
                  <p className="font-semibold">{formData.experience} years</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents Summary */}
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Uploaded Documents</h3>
          <div className="space-y-2">
            {documents.filter(doc => doc.uploaded).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between">
                <span className="text-gray-700">{doc.name}</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <FaCheck className="text-sm" />
                  Uploaded
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Terms and Conditions</h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-1" required />
              <label htmlFor="terms" className="flex-1">
                I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and 
                <Link href="/privacy" className="text-blue-600 hover:underline ml-1">Privacy Policy</Link>
              </label>
            </div>
            
            <div className="flex items-start gap-3">
              <input type="checkbox" id="verify" className="mt-1" required />
              <label htmlFor="verify" className="flex-1">
                I certify that all information provided is accurate and complete. I understand that false information may result in account suspension.
              </label>
            </div>
            
            <div className="flex items-start gap-3">
              <input type="checkbox" id="consent" className="mt-1" required />
              <label htmlFor="consent" className="flex-1">
                I consent to the verification of my documents and credentials by Healthwyz and relevant regulatory bodies.
              </label>
            </div>
          </div>
        </div>

        {/* Verification Process Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-600 mt-1" />
            <div>
              <h4 className="font-bold text-blue-800 mb-2">What happens next?</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Your documents will be reviewed by our verification team</li>
                <li>• We may contact you for additional information if needed</li>
                <li>• Verification typically takes 2-5 business days</li>
                <li>• You will receive an email once your account is approved</li>
                <li>• Professional credentials will be verified with relevant authorities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}