
import { FaInfoCircle } from 'react-icons/fa'
import type { NannyBookingData } from '@/app/booking/nannies/[id]/page'

interface NannyConsultationDetailsProps {
  bookingData: NannyBookingData
  onUpdate: (updates: Partial<NannyBookingData>) => void
  onNext: () => void
  onBack: () => void
}

export function NannyConsultationDetails({
  bookingData,
  onUpdate,
  onNext,
  onBack
}: NannyConsultationDetailsProps) {
  const handleReasonChange = (reason: string) => {
    onUpdate({ reason })
  }

  const handleNotesChange = (notes: string) => {
    onUpdate({ notes })
  }

  const getServiceTypeText = () => {
    return bookingData.type === 'overnight' ? 'Overnight Care' : 'Regular Childcare'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Childcare Service Information</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Reason for Childcare Service *
            </label>
            <select
              value={bookingData.reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
              required
            >
              <option value="">Select reason</option>
              <option value="regular-childcare">Regular Childcare</option>
              <option value="date-night">Date Night/Parents&apos; Night Out</option>
              <option value="work-coverage">Work Coverage</option>
              <option value="after-school-care">After School Care</option>
              <option value="homework-support">Homework Support</option>
              <option value="school-holiday-care">School Holiday Care</option>
              <option value="emergency-care">Emergency Childcare</option>
              <option value="newborn-support">Newborn Support</option>
              <option value="infant-care">Infant Care</option>
              <option value="toddler-care">Toddler Care</option>
              <option value="special-needs-support">Special Needs Support</option>
              <option value="overnight-care">Overnight Care</option>
              <option value="travel-childcare">Travel Childcare</option>
              <option value="event-childcare">Event Childcare</option>
              <option value="educational-activities">Educational Activities</option>
              <option value="outdoor-activities">Outdoor Activities</option>
              <option value="creative-activities">Creative Activities</option>
              <option value="meal-preparation">Meal Preparation</option>
              <option value="sleep-training">Sleep Training</option>
              <option value="behavioral-support">Behavioral Support</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Additional Information & Special Requirements (Optional)
            </label>
            <textarea
              value={bookingData.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={4}
              placeholder="Please describe your children's ages, personalities, specific needs, routines, allergies, emergency contacts, or any special instructions for the nanny..."
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              This information helps the nanny prepare appropriately and provide the best care for your children
            </p>
          </div>

          {/* Service Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-purple-600" />
              Service Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nanny:</span>
                <p className="font-semibold">{bookingData.nanny.firstName} {bookingData.nanny.lastName}</p>
              </div>
              <div>
                <span className="text-gray-600">Specializations:</span>
                <p className="font-semibold">{bookingData.nanny.specialization.join(', ')}</p>
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
                <p className="font-semibold">
                  {bookingData.type === 'overnight' 
                    ? 'Overnight' 
                    : `${bookingData.duration} hour${bookingData.duration > 1 ? 's' : ''}`
                  }
                </p>
              </div>
              <div>
                <span className="text-gray-600">Service Type:</span>
                <p className="font-semibold">{getServiceTypeText()}</p>
              </div>
              <div>
                <span className="text-gray-600">Rate:</span>
                <p className="font-semibold text-green-600">
                  {bookingData.type === 'overnight' 
                    ? `Rs ${bookingData.nanny.overnightRate} per night`
                    : `Rs ${bookingData.nanny.hourlyRate}/hour`
                  }
                </p>
              </div>
              <div>
                <span className="text-gray-600">Total Service Cost:</span>
                <p className="font-semibold text-green-600">
                  Rs {(bookingData.type === 'overnight' 
                    ? bookingData.nanny.overnightRate 
                    : bookingData.nanny.hourlyRate * bookingData.duration
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-semibold">{bookingData.nanny.location}</p>
              </div>
              <div>
                <span className="text-gray-600">Next Available:</span>
                <p className="font-semibold text-purple-600">{bookingData.nanny.nextAvailable}</p>
              </div>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Before the Service</h4>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Prepare emergency contact information and medical details</li>
              <li>• Have children&apos;s routines, meal preferences, and bedtime schedules ready</li>
              <li>• Note any allergies, medications, or special needs</li>
              <li>• Prepare activities, toys, or educational materials</li>
              <li>• Ensure safe and child-proofed environment</li>
              <li>• Have backup emergency plans and neighbor contacts available</li>
              <li>• Prepare any special equipment (car seats, strollers, etc.)</li>
            </ul>
          </div>

          {/* Nanny's Specializations */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h4 className="font-semibold text-purple-800 mb-2">This Nanny&apos;s Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {bookingData.nanny.specialization.map((specialization, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {specialization}
                </span>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-sm text-purple-700">
                <strong>Age Groups:</strong> {bookingData.nanny.ageGroups.join(', ')}
              </p>
              <p className="text-sm text-purple-700">
                <strong>Max Children:</strong> {bookingData.nanny.maxChildren}
              </p>
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  )
}