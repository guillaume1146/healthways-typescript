import Link from 'next/link'
import Image from 'next/image'
import { 
  FaCheck, FaVideo, FaInfoCircle, FaDownload, FaPrint, 
  FaCalendarPlus, FaPhone, FaStar, FaMapMarkerAlt, FaHospital 
} from 'react-icons/fa'
import type { BookingData } from '@/app/booking/doctors/[id]/page'

interface BookingConfirmationProps {
  bookingData: BookingData
}

export default function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getConsultationTypeText = () => {
    return bookingData.type === 'video' ? 'Video Consultation' : 'In-Person Visit'
  }

  const getFeeAmount = () => {
    return bookingData.type === 'video' 
      ? bookingData.doctor.videoConsultationFee 
      : bookingData.doctor.consultationFee
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheck className="text-green-600 text-3xl" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Consultation Booked!</h2>
        <p className="text-gray-600 mb-8">
          Your appointment has been successfully confirmed. Here is your digital ticket.
        </p>
        
        {/* Digital Ticket */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Digital Consultation Ticket</h3>
              <p className="text-blue-100 text-sm">Keep this for your records</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Ticket ID</p>
              <p className="font-bold text-lg">{bookingData.ticketId}</p>
            </div>
          </div>
          
          {/* Doctor & Patient Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-100">Doctor Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Image 
                    src={bookingData.doctor.profileImage} 
                    alt={`Dr. ${bookingData.doctor.firstName} ${bookingData.doctor.lastName}`}
                    width={40} 
                    height={40}
                    className="rounded-full border-2 border-blue-300"
                  />
                  <div>
                    <p className="font-semibold">Dr. {bookingData.doctor.firstName} {bookingData.doctor.lastName}</p>
                    <p className="text-blue-200 text-xs">{bookingData.doctor.specialty.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span>{bookingData.doctor.rating} ({bookingData.doctor.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHospital className="text-blue-200" />
                  <span className="text-xs">{bookingData.doctor.clinicAffiliation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-200" />
                  <span className="text-xs">{bookingData.doctor.location}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-blue-100">Appointment Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-blue-200">Date:</span> {formatDate(bookingData.date)}</p>
                <p><span className="text-blue-200">Time:</span> {bookingData.time}</p>
                <p><span className="text-blue-200">Type:</span> {getConsultationTypeText()}</p>
                <p><span className="text-blue-200">Reason:</span> {bookingData.reason.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <p><span className="text-blue-200">Amount Paid:</span> Rs {Math.round(bookingData.finalAmount).toLocaleString()}</p>
                <p><span className="text-blue-200">Payment Method:</span> {bookingData.selectedPaymentMethod?.name}</p>
              </div>
            </div>
          </div>
          
          {/* Type-specific Instructions */}
          {bookingData.type === 'video' ? (
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaVideo className="text-blue-200" />
                <span className="font-semibold text-blue-100">Video Call Instructions</span>
              </div>
              <p className="text-blue-100 text-sm">
                A secure video call link will be sent to your email 30 minutes before the appointment. 
                Please ensure you have a stable internet connection and access to a camera/microphone.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="text-blue-200" />
                <span className="font-semibold text-blue-100">Clinic Visit Instructions</span>
              </div>
              <p className="text-blue-100 text-sm">
                Please arrive 15 minutes early at {bookingData.doctor.clinicAffiliation}. 
                Bring a valid ID and any previous medical reports or test results.
              </p>
            </div>
          )}
        </div>

        {/* Important Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-yellow-600 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Confirmation email sent to your registered email address</li>
                <li>• You will receive SMS reminders 24 hours and 1 hour before appointment</li>
                <li>• Please arrive 15 minutes early for in-person consultations</li>
                <li>• Bring your ID and any previous medical reports</li>
                <li>• Free rescheduling available up to 4 hours before appointment</li>
                <li>• Cancellation allowed up to 2 hours before appointment for full refund</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <h4 className="font-semibold text-gray-900 mb-4">What happens next?</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Confirmation Email</p>
                <p className="text-gray-600 text-sm">You will receive a detailed confirmation email with all appointment information within 5 minutes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Automated Reminders</p>
                <p className="text-gray-600 text-sm">SMS and email reminders will be sent 24 hours and 1 hour before your appointment</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Pre-Consultation Preparation</p>
                <p className="text-gray-600 text-sm">
                  {bookingData.type === 'video' 
                    ? 'Video call link will be sent 30 minutes before the appointment' 
                    : 'Clinic directions and parking information will be provided'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">4</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Consultation & Follow-up</p>
                <p className="text-gray-600 text-sm">After consultation, receive digital prescriptions and follow-up care instructions via our platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FaDownload className="text-blue-600 text-xl" />
            <span className="text-sm font-medium">Download PDF</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FaPrint className="text-green-600 text-xl" />
            <span className="text-sm font-medium">Print Ticket</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FaCalendarPlus className="text-purple-600 text-xl" />
            <span className="text-sm font-medium">Add to Calendar</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FaPhone className="text-orange-600 text-xl" />
            <span className="text-sm font-medium">Contact Support</span>
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Link 
            href="/patient/appointments" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-center"
          >
            View My Appointments
          </Link>
          <Link 
            href="/patient/dashboard" 
            className="border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center"
          >
            Go to Dashboard
          </Link>
        </div>
        
        {/* Book Another Appointment */}
        <div className="mb-6">
          <Link 
            href="/search/doctors" 
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Book Another Appointment →
          </Link>
        </div>
        
        {/* Emergency Contact */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Need immediate assistance or have questions about your appointment?
          </p>
          <p className="text-sm text-gray-600">
            Call our 24/7 helpline: 
            <a href="tel:+2304004000" className="font-semibold text-blue-600 hover:underline ml-1">
              +230 400 4000
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}