import Link from 'next/link'
import Image from 'next/image'
import { 
  FaCheck, FaVideo, FaInfoCircle, FaDownload, FaPrint, 
  FaCalendarPlus, FaPhone, FaStar, FaMapMarkerAlt, FaHospital,
  FaHome, FaUserNurse, FaCertificate, FaClock
} from 'react-icons/fa'
import type { NurseBookingData } from '@/app/booking/nurses/[id]/page'

interface NurseBookingConfirmationProps {
  bookingData: NurseBookingData
}

export default function NurseBookingConfirmation({ bookingData }: NurseBookingConfirmationProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getServiceTypeText = () => {
    switch (bookingData.type) {
      case 'video': return 'Video Consultation'
      case 'home-visit': return 'Home Visit'
      default: return 'In-Person Service'
    }
  }

  const getServiceIcon = () => {
    switch (bookingData.type) {
      case 'video': return FaVideo
      case 'home-visit': return FaHome
      default: return FaUserNurse
    }
  }

  const getLocationText = () => {
    switch (bookingData.type) {
      case 'video': return 'Online Video Call'
      case 'home-visit': return 'Your Home/Location'
      default: return bookingData.nurse.clinicAffiliation
    }
  }

  const getHourlyRate = () => {
    return bookingData.type === 'video' 
      ? bookingData.nurse.videoConsultationRate 
      : bookingData.nurse.hourlyRate
  }

  const ServiceIcon = getServiceIcon()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheck className="text-green-600 text-3xl" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Nursing Service Booked!</h2>
        <p className="text-gray-600 mb-8">
          Your nursing service has been successfully confirmed. Here is your digital service ticket.
        </p>
        
        {/* Digital Ticket */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Digital Nursing Service Ticket</h3>
              <p className="text-blue-100 text-sm">Keep this for your records</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Ticket ID</p>
              <p className="font-bold text-lg">{bookingData.ticketId}</p>
            </div>
          </div>
          
          {/* Nurse & Service Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-100">Nurse Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Image 
                    src={bookingData.nurse.profileImage} 
                    alt={`${bookingData.nurse.firstName} ${bookingData.nurse.lastName}`}
                    width={40} 
                    height={40}
                    className="rounded-full border-2 border-blue-300"
                  />
                  <div>
                    <p className="font-semibold">{bookingData.nurse.firstName} {bookingData.nurse.lastName}</p>
                    <p className="text-blue-200 text-xs">{bookingData.nurse.specialization.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span>{bookingData.nurse.rating} ({bookingData.nurse.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCertificate className="text-blue-200" />
                  <span className="text-xs">{bookingData.nurse.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHospital className="text-blue-200" />
                  <span className="text-xs">{bookingData.nurse.clinicAffiliation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-200" />
                  <span className="text-xs">{bookingData.nurse.location}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-blue-100">Service Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-blue-200">Date:</span> {formatDate(bookingData.date)}</p>
                <p><span className="text-blue-200">Time:</span> {bookingData.time}</p>
                <p><span className="text-blue-200">Duration:</span> {bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</p>
                <p><span className="text-blue-200">Service Type:</span> {getServiceTypeText()}</p>
                <p><span className="text-blue-200">Reason:</span> {bookingData.reason.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <p><span className="text-blue-200">Hourly Rate:</span> Rs {getHourlyRate()}/hour</p>
                <p><span className="text-blue-200">Total Service Cost:</span> Rs {(getHourlyRate() * bookingData.duration).toLocaleString()}</p>
                <p><span className="text-blue-200">Amount Paid:</span> Rs {Math.round(bookingData.finalAmount).toLocaleString()}</p>
                <p><span className="text-blue-200">Payment Method:</span> {bookingData.selectedPaymentMethod?.name}</p>
              </div>
            </div>
          </div>
          
          {/* Service-specific Instructions */}
          {bookingData.type === 'video' ? (
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaVideo className="text-blue-200" />
                <span className="font-semibold text-blue-100">Video Call Instructions</span>
              </div>
              <p className="text-blue-100 text-sm">
                A secure video call link will be sent to your email 30 minutes before the appointment. 
                Please ensure you have a stable internet connection, camera, and microphone ready. Have good lighting for visual assessment.
              </p>
            </div>
          ) : bookingData.type === 'home-visit' ? (
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaHome className="text-blue-200" />
                <span className="font-semibold text-blue-100">Home Visit Instructions</span>
              </div>
              <p className="text-blue-100 text-sm">
                Our nurse will arrive at your specified location. Please ensure a clean, accessible space for care delivery. 
                Have emergency contact numbers and any existing medical equipment ready.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaUserNurse className="text-blue-200" />
                <span className="font-semibold text-blue-100">Clinic Visit Instructions</span>
              </div>
              <p className="text-blue-100 text-sm">
                Please arrive 15 minutes early at {bookingData.nurse.clinicAffiliation}. 
                Bring a valid ID, current medications list, and any medical reports or equipment needed.
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
                <li>• You will receive SMS reminders 24 hours and 1 hour before service</li>
                <li>• Please have your medical history and current medications ready</li>
                <li>• Free rescheduling available up to 4 hours before service</li>
                <li>• Cancellation allowed up to 2 hours before service for full refund</li>
                <li>• For home visits, ensure accessible parking and clear directions</li>
                <li>• Emergency contact: {bookingData.nurse.phone}</li>
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
                <p className="font-medium text-gray-900">Service Confirmation</p>
                <p className="text-gray-600 text-sm">You will receive a detailed confirmation email with all service information within 5 minutes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Nurse Preparation</p>
                <p className="text-gray-600 text-sm">Your assigned nurse will review your case and prepare appropriate equipment and care plan</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Service Reminders</p>
                <p className="text-gray-600 text-sm">
                  {bookingData.type === 'video' 
                    ? 'Video call link will be sent 30 minutes before the service' 
                    : bookingData.type === 'home-visit'
                    ? 'Nurse will contact you 1 hour before arrival with updates'
                    : 'Clinic location and any special instructions will be provided'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">4</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Service Delivery & Follow-up</p>
                <p className="text-gray-600 text-sm">Professional nursing care delivered as scheduled, with digital care reports and follow-up recommendations</p>
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
            href="/patient/nursing-services" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-center"
          >
            View My Services
          </Link>
          <Link 
            href="/patient/dashboard" 
            className="border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center"
          >
            Go to Dashboard
          </Link>
        </div>
        
        {/* Book Another Service */}
        <div className="mb-6">
          <Link 
            href="/search/nurses" 
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Book Another Nursing Service →
          </Link>
        </div>
        
        {/* Emergency Contact */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Need immediate assistance or have questions about your service?
          </p>
          <p className="text-sm text-gray-600">
            Call our 24/7 helpline: 
            <a href="tel:+2304004000" className="font-semibold text-blue-600 hover:underline ml-1">
              +230 400 4000
            </a>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Direct nurse contact: 
            <a href={`tel:${bookingData.nurse.phone}`} className="font-semibold text-blue-600 hover:underline ml-1">
              {bookingData.nurse.phone}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}