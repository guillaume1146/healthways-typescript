import { FaInfoCircle } from 'react-icons/fa'
import type { NurseBookingData } from '@/app/booking/nurses/[id]/page'

interface NurseConsultationDetailsProps {
  bookingData: NurseBookingData
  onUpdate: (updates: Partial<NurseBookingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function NurseConsultationDetails({
  bookingData,
  onUpdate,
  onNext,
  onBack
}: NurseConsultationDetailsProps) {
  const handleReasonChange = (reason: string) => {
    onUpdate({ reason })
  }

  const handleNotesChange = (notes: string) => {
    onUpdate({ notes })
  }

  const getServiceTypeText = () => {
    switch (bookingData.type) {
      case 'video': return 'Video Consultation'
      case 'home-visit': return 'Home Visit'
      default: return 'In-Person Service'
    }
  }

  const getLocationText = () => {
    switch (bookingData.type) {
      case 'video': return 'Online Video Call'
      case 'home-visit': return 'Your Home/Location'
      default: return bookingData.nurse.clinicAffiliation
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Information</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Reason for Nursing Service *
            </label>
            <select
              value={bookingData.reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
              required
            >
              <option value="">Select reason</option>
              <option value="post-surgery-care">Post-Surgery Care</option>
              <option value="elderly-care">Elderly Care</option>
              <option value="chronic-disease-management">Chronic Disease Management</option>
              <option value="wound-care">Wound Care & Dressing</option>
              <option value="medication-administration">Medication Administration</option>
              <option value="rehabilitation-support">Rehabilitation Support</option>
              <option value="palliative-care">Palliative Care</option>
              <option value="child-care">Child/Pediatric Care</option>
              <option value="mental-health-support">Mental Health Support</option>
              <option value="diabetes-management">Diabetes Management</option>
              <option value="cardiac-care">Cardiac Care</option>
              <option value="respiratory-care">Respiratory Care</option>
              <option value="maternity-support">Maternity Support</option>
              <option value="emergency-care">Emergency Care</option>
              <option value="routine-health-monitoring">Routine Health Monitoring</option>
              <option value="mobility-assistance">Mobility Assistance</option>
              <option value="nutrition-support">Nutrition Support</option>
              <option value="infection-control">Infection Control</option>
              <option value="family-education">Family Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Additional Notes & Special Requirements (Optional)
            </label>
            <textarea
              value={bookingData.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={4}
              placeholder="Please describe your specific care needs, medical conditions, current medications, mobility issues, or any special equipment required..."
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              This information helps the nurse prepare appropriate care and bring necessary equipment
            </p>
          </div>

          {/* Service Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-blue-600" />
              Service Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nurse:</span>
                <p className="font-semibold">{bookingData.nurse.firstName} {bookingData.nurse.lastName}</p>
              </div>
              <div>
                <span className="text-gray-600">Specialization:</span>
                <p className="font-semibold">{bookingData.nurse.specialization.join(', ')}</p>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>
                <p className="font-semibold">
                  {bookingData.date ? new Date(bookingData.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not selected'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <p className="font-semibold">{bookingData.time || 'Not selected'}</p>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <p className="font-semibold">{bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</p>
              </div>
              <div>
                <span className="text-gray-600">Service Type:</span>
                <p className="font-semibold">{getServiceTypeText()}</p>
              </div>
              <div>
                <span className="text-gray-600">Hourly Rate:</span>
                <p className="font-semibold text-green-600">
                  Rs {(bookingData.type === 'video' 
                    ? bookingData.nurse.videoConsultationRate 
                    : bookingData.nurse.hourlyRate).toLocaleString()}/hour
                </p>
              </div>
              <div>
                <span className="text-gray-600">Total Service Cost:</span>
                <p className="font-semibold text-green-600">
                  Rs {((bookingData.type === 'video' 
                    ? bookingData.nurse.videoConsultationRate 
                    : bookingData.nurse.hourlyRate) * bookingData.duration).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-semibold">{getLocationText()}</p>
              </div>
              <div>
                <span className="text-gray-600">Next Available:</span>
                <p className="font-semibold text-blue-600">{bookingData.nurse.nextAvailable}</p>
              </div>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Before Your Service</h4>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Prepare a list of your current medications and dosages</li>
              <li>• Have your medical history and recent test results ready</li>
              <li>• Note any allergies or adverse reactions to medications</li>
              {bookingData.type === 'video' && (
                <>
                  <li>• Ensure stable internet connection and quiet environment</li>
                  <li>• Test your camera and microphone beforehand</li>
                  <li>• Have good lighting for visual assessment</li>
                </>
              )}
              {bookingData.type === 'home-visit' && (
                <>
                  <li>• Ensure clean, accessible space for care delivery</li>
                  <li>• Have emergency contact numbers readily available</li>
                  <li>• Prepare any existing medical equipment or supplies</li>
                </>
              )}
              {bookingData.type === 'in-person' && (
                <>
                  <li>• Arrive 15 minutes early for check-in</li>
                  <li>• Bring a valid ID and insurance card (if applicable)</li>
                  <li>• Wear comfortable, appropriate clothing for assessment</li>
                </>
              )}
            </ul>
          </div>

          {/* Nurse's Services */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">Services This Nurse Provides</h4>
            <div className="flex flex-wrap gap-2">
              {bookingData.nurse.services.map((service, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!bookingData.reason}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  )
}