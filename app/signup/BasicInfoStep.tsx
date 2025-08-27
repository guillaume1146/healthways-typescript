import { ChangeEvent } from 'react'
import { FaEye, FaEyeSlash, FaUsers } from 'react-icons/fa'
import { SignupFormData, UserType } from './types'

interface BasicInfoStepProps {
  formData: SignupFormData;
  selectedType: UserType | undefined;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onFormChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPasswordToggle: () => void;
  onConfirmPasswordToggle: () => void;
}

export default function BasicInfoStep({ 
  formData, 
  selectedType, 
  showPassword, 
  showConfirmPassword, 
  onFormChange, 
  onPasswordToggle, 
  onConfirmPasswordToggle 
}: BasicInfoStepProps) {
  const SelectedIcon = selectedType?.icon

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedType?.color}`}>
          {SelectedIcon && <SelectedIcon className="text-3xl" />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{selectedType?.label} Registration</h2>
          <p className="text-gray-600">Please provide your basic information</p>
        </div>
      </div>

      <form className="space-y-6">
        {/* Referral Code Section - Universal for all user types */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaUsers className="text-blue-600 text-xl" />
            <h3 className="text-lg font-bold text-gray-900">Referral Information</h3>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
              Optional
            </span>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Referral Code or Email</label>
            <input
              type="text"
              name="referralCode"
              placeholder="Enter referral code or email of person who referred you"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
              value={formData.referralCode || ''}
              onChange={onFormChange}
            />
            <p className="text-gray-500 text-sm mt-2">
              If someone referred you to HealthWyz, please enter their referral code or email address to give them credit.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="Enter your full legal name"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
              value={formData.fullName}
              onChange={onFormChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
              value={formData.email}
              onChange={onFormChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Create a strong password"
                className="w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:border-blue-600"
                value={formData.password}
                onChange={onFormChange}
              />
              <button
                type="button"
                onClick={onPasswordToggle}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:border-blue-600"
                value={formData.confirmPassword}
                onChange={onFormChange}
              />
              <button
                type="button"
                onClick={onConfirmPasswordToggle}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+230 5xxx xxxx"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
              value={formData.phone}
              onChange={onFormChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
              value={formData.dateOfBirth}
              onChange={onFormChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Gender *</label>
            <select
              name="gender"
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
              value={formData.gender}
              onChange={onFormChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Corporate Administrator specific fields */}
          {formData.userType === 'corporate' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="Enter your company name"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.companyName || ''}
                  onChange={onFormChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Job Title *</label>
                <input
                  type="text"
                  name="jobTitle"
                  required
                  placeholder="Your position in the company"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.jobTitle || ''}
                  onChange={onFormChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Company Registration Number</label>
                <input
                  type="text"
                  name="companyRegistrationNumber"
                  placeholder="Official company registration number"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.companyRegistrationNumber || ''}
                  onChange={onFormChange}
                />
              </div>
            </>
          )}

          {/* Regional Administrator specific fields */}
          {formData.userType === 'regional-admin' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Target Country *</label>
                <input
                  type="text"
                  name="targetCountry"
                  required
                  placeholder="Country you want to manage"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.targetCountry || ''}
                  onChange={onFormChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Target Region/State</label>
                <input
                  type="text"
                  name="targetRegion"
                  placeholder="Specific region or state (optional)"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.targetRegion || ''}
                  onChange={onFormChange}
                />
              </div>
            </>
          )}

          {/* Referral Partner specific fields */}
          {formData.userType === 'referral-partner' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Business Type</label>
                <select
                  name="businessType"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.businessType || ''}
                  onChange={onFormChange}
                >
                  <option value="">Select Business Type</option>
                  <option value="individual">Individual Marketer</option>
                  <option value="agency">Marketing Agency</option>
                  <option value="influencer">Social Media Influencer</option>
                  <option value="healthcare-related">Healthcare Related Business</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Marketing Experience</label>
                <select
                  name="marketingExperience"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.marketingExperience || ''}
                  onChange={onFormChange}
                >
                  <option value="">Select Experience</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="experienced">Experienced (5+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Social Media Handles</label>
                <input
                  type="text"
                  name="socialMediaHandles"
                  placeholder="Your main social media profiles (optional)"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.socialMediaHandles || ''}
                  onChange={onFormChange}
                />
              </div>
            </>
          )}

          {/* Professional fields for healthcare workers */}
          {['doctor', 'nurse', 'pharmacist', 'lab', 'emergency'].includes(formData.userType) && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-2">License/Registration Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="Enter your professional license number"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.licenseNumber || ''}
                  onChange={onFormChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {formData.userType === 'doctor' ? 'Specialization' : 
                   formData.userType === 'nurse' ? 'Area of Expertise' :
                   formData.userType === 'pharmacist' ? 'Pharmacy Type' :
                   'Area of Work'}
                </label>
                <input
                  type="text"
                  name="specialization"
                  placeholder={`Enter your ${formData.userType === 'doctor' ? 'medical specialization' : 'area of expertise'}`}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.specialization || ''}
                  onChange={onFormChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Institution/Workplace</label>
                <input
                  type="text"
                  name="institution"
                  placeholder="Enter your current workplace"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.institution || ''}
                  onChange={onFormChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
                <select
                  name="experience"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                  value={formData.experience || ''}
                  onChange={onFormChange}
                >
                  <option value="">Select Experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="16-20">16-20 years</option>
                  <option value="20+">20+ years</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Full Address *</label>
          <textarea
            name="address"
            required
            rows={3}
            placeholder="Enter your complete address"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
            value={formData.address}
            onChange={onFormChange}
          />
        </div>

        {/* Corporate Administrator company address */}
        {formData.userType === 'corporate' && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Company Address *</label>
            <textarea
              name="companyAddress"
              required
              rows={3}
              placeholder="Enter your company's complete address"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
              value={formData.companyAddress || ''}
              onChange={onFormChange}
            />
          </div>
        )}

        {/* Regional Administrator business plan */}
        {formData.userType === 'regional-admin' && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Business Plan Overview *</label>
            <textarea
              name="businessPlan"
              required
              rows={4}
              placeholder="Provide a brief overview of your business plan for managing HealthWyz in your target region"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
              value={formData.businessPlan || ''}
              onChange={onFormChange}
            />
          </div>
        )}

        {/* Emergency Contact */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Emergency Contact Information</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                placeholder="Full name"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                value={formData.emergencyContactName || ''}
                onChange={onFormChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Contact Phone</label>
              <input
                type="tel"
                name="emergencyContactPhone"
                placeholder="+230 5xxx xxxx"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                value={formData.emergencyContactPhone || ''}
                onChange={onFormChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Relationship</label>
              <select
                name="emergencyContactRelation"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-600"
                value={formData.emergencyContactRelation || ''}
                onChange={onFormChange}
              >
                <option value="">Select Relationship</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}