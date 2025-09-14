import Link from 'next/link'
import Image from 'next/image'
import { 
  FaCheck, FaInfoCircle, FaDownload, FaPrint, 
  FaCalendarPlus, FaPhone, FaStar, FaMapMarkerAlt,
  FaBaby, FaCertificate, FaUsers
} from 'react-icons/fa'
import type { NannyBookingData } from '@/app/booking/nannies/[id]/page'

interface NannyBookingConfirmationProps {
  bookingData: NannyBookingData
}

export function NannyBookingConfirmation({ bookingData }: NannyBookingConfirmationProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getServiceTypeText = () => {
    return bookingData.type === 'overnight' ? 'Overnight Care' : 'Regular Childcare'
  }

  const getTotalServiceCost = () => {
    return bookingData.type === 'overnight' 
      ? bookingData.nanny.overnightRate 
      : bookingData.nanny.hourlyRate * bookingData.duration
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheck className="text-green-600 text-3xl" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Childcare Service Booked!</h2>
        <p className="text-gray-600 mb-8">
          Your childcare service has been successfully confirmed. Here is your digital service ticket.
        </p>
        
        {/* Digital Ticket */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white mb-8 text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Digital Childcare Service Ticket</h3>
              <p className="text-purple-100 text-sm">Keep this for your records</p>
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">Ticket ID</p>
              <p className="font-bold text-lg">{bookingData.ticketId}</p>
            </div>
          </div>
          
          {/* Nanny & Service Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-100">Nanny Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Image 
                    src={bookingData.nanny.profileImage} 
                    alt={`${bookingData.nanny.firstName} ${bookingData.nanny.lastName}`}
                    width={40} 
                    height={40}
                    className="rounded-full border-2 border-purple-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${bookingData.nanny.firstName}+${bookingData.nanny.lastName}&background=random&color=fff&size=40`;
                    }}
                  />
                  <div>
                    <p className="font-semibold">{bookingData.nanny.firstName} {bookingData.nanny.lastName}</p>
                    <p className="text-purple-200 text-xs">{bookingData.nanny.specialization.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span>{bookingData.nanny.rating} ({bookingData.nanny.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCertificate className="text-purple-200" />
                  <span className="text-xs">{bookingData.nanny.yearsOfExperience} years experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-purple-200" />
                  <span className="text-xs">Max {bookingData.nanny.maxChildren} children</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-purple-200" />
                  <span className="text-xs">{bookingData.nanny.location}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-purple-100">Service Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-purple-200">Date:</span> {formatDate(bookingData.date)}</p>
                <p><span className="text-purple-200">Time:</span> {bookingData.time}</p>
                <p>
                  <span className="text-purple-200">Duration:</span> 
                  {bookingData.type === 'overnight' 
                    ? ' Overnight care' 
                    : ` ${bookingData.duration} hour${bookingData.duration > 1 ? 's' : ''}`
                  }
                </p>
                <p><span className="text-purple-200">Service Type:</span> {getServiceTypeText()}</p>
                <p><span className="text-purple-200">Reason:</span> {bookingData.reason.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <p>
                  <span className="text-purple-200">Rate:</span> 
                  {bookingData.type === 'overnight' 
                    ? ` Rs ${bookingData.nanny.overnightRate} per night`
                    : ` Rs ${bookingData.nanny.hourlyRate}/hour`
                  }
                </p>
                <p><span className="text-purple-200">Total Service Cost:</span> Rs {getTotalServiceCost().toLocaleString()}</p>
                <p><span className="text-purple-200">Amount Paid:</span> Rs {Math.round(bookingData.finalAmount).toLocaleString()}</p>
                <p><span className="text-purple-200">Payment Method:</span> {bookingData.selectedPaymentMethod?.name}</p>
              </div>
            </div>
          </div>
          
          {/* Service Instructions */}
          <div className="p-4 bg-white/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FaBaby className="text-purple-200" />
              <span className="font-semibold text-purple-100">Childcare Service Instructions</span>
            </div>
            <p className="text-purple-100 text-sm">
              Your nanny will arrive at the scheduled time with appropriate supplies and activities. 
              Please have emergency contacts,  routines of children , and any special instructions ready. 
              Ensure a safe, child-friendly environment is prepared.
            </p>
          </div>
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
                <li>• Please have emergency contacts and  information of children ready</li>
                <li>• Free rescheduling available up to 4 hours before service</li>
                <li>• Cancellation allowed up to 2 hours before service for full refund</li>
                <li>• Ensure child-safe environment and necessary supplies are available</li>
                <li>• Direct nanny contact: {bookingData.nanny.phone}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <h4 className="font-semibold text-gray-900 mb-4">What happens next?</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Service Confirmation</p>
                <p className="text-gray-600 text-sm">You will receive a detailed confirmation email with all service information within 5 minutes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Nanny Preparation</p>
                <p className="text-gray-600 text-sm">Your assigned nanny will review your requirements and prepare appropriate activities and supplies</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Pre-Service Contact</p>
                <p className="text-gray-600 text-sm">Nanny will contact you 1 hour before arrival to confirm details and address any last-minute questions</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">4</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Childcare Service & Follow-up</p>
                <p className="text-gray-600 text-sm">Professional childcare delivered as scheduled, with activity reports and follow-up recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FaDownload className="text-purple-600 text-xl" />
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
            href="/patient/childcare-services" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all text-center"
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
            href="/search/nannies" 
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Book Another Childcare Service →
          </Link>
        </div>
        
        {/* Emergency Contact */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Need immediate assistance or have questions about your service?
          </p>
          <p className="text-sm text-gray-600">
            Call our 24/7 helpline: 
            <a href="tel:+2304004000" className="font-semibold text-purple-600 hover:underline ml-1">
              +230 400 4000
            </a>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Direct nanny contact: 
            <a href={`tel:${bookingData.nanny.phone}`} className="font-semibold text-purple-600 hover:underline ml-1">
              {bookingData.nanny.phone}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}