'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
    FaUserEdit, FaCalendarAlt, FaCreditCard, FaFileUpload, FaSave, FaTrash, 
    FaCheckCircle, FaTimes, FaToggleOn, FaToggleOff, FaDollarSign, FaShieldAlt, 
    FaUniversity, FaSync, FaClock, FaCrown, FaExclamationCircle, FaStethoscope,
    FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGraduationCap, FaLanguage,
    FaUserGraduate, FaBriefcaseMedical, FaCertificate, FaIdCard
} from 'react-icons/fa'

import { IconType } from 'react-icons'

type ActiveTab = 'profile' | 'availability' | 'billing' | 'subscription'

interface TabButtonProps {
  icon: IconType
  label: string
  tabName: ActiveTab
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
}

interface DoctorProfileSettings {
    name: string
    email: string
    phone: string
    alternatePhone: string
    avatar: string
    specialty: string
    subSpecialty: string
    qualification: string
    experience: number
    registrationNumber: string
    location: string
    clinicAddress: string
    bio: string
    languages: string[]
    education: Array<{
        id: string
        degree: string
        institution: string
        year: string
    }>
    specializations: string[]
    services: string[]
    consultationFee: number
    followUpFee: number
    videoConsultationFee: number
    emergencyConsultationAvailable: boolean
}

interface TimeSlot {
    start: string
    end: string
    isAvailable: boolean
}

interface DayAvailability {
    day: string
    morning: TimeSlot
    afternoon: TimeSlot
    evening: TimeSlot
    isClosed: boolean
}

interface BillingSettings {
    accountType: 'MCB Juice' | 'Bank Transfer' | 'Mobile Money'
    accountDetails: {
        accountNumber: string
        accountName: string
        bankName: string
    }
    paymentMethods: string[]
    taxId: string
}

interface SubscriptionPlan {
    id: string
    name: string
    price: number
    features: string[]
    period: 'monthly' | 'yearly'
    isCurrent: boolean
}

// --- MOCK DATA ---
const mockProfileData: DoctorProfileSettings = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@healthcare.mu",
    phone: "+230 5789 0123",
    alternatePhone: "+230 5789 0124",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c0aede",
    specialty: "Cardiology",
    subSpecialty: "Interventional Cardiology",
    qualification: "MD, FACC, FSCAI",
    experience: 15,
    registrationNumber: "MED-2008-1234",
    location: "Port Louis",
    clinicAddress: "123 Royal Street, Port Louis, Mauritius",
    bio: "Board-certified cardiologist with over 15 years of experience in interventional cardiology. Specialized in complex coronary interventions and structural heart disease.",
    languages: ["English", "French", "Creole", "Hindi"],
    education: [
        { id: 'e1', degree: 'MD', institution: 'Harvard Medical School', year: '2008' },
        { id: 'e2', degree: 'Fellowship in Cardiology', institution: 'Mayo Clinic', year: '2012' },
    ],
    specializations: ["Coronary Angioplasty", "Heart Failure Management", "Echocardiography", "Pacemaker Implantation"],
    services: ["In-Person Consultation", "Video Consultation", "Second Opinion", "Emergency Consultation"],
    consultationFee: 2500,
    followUpFee: 1500,
    videoConsultationFee: 2000,
    emergencyConsultationAvailable: true,
}

const mockAvailabilityData: DayAvailability[] = [
    { 
        day: 'Monday', 
        morning: { start: '09:00', end: '12:00', isAvailable: true },
        afternoon: { start: '14:00', end: '17:00', isAvailable: true },
        evening: { start: '17:30', end: '20:00', isAvailable: true },
        isClosed: false 
    },
    { 
        day: 'Tuesday', 
        morning: { start: '09:00', end: '12:00', isAvailable: true },
        afternoon: { start: '14:00', end: '17:00', isAvailable: true },
        evening: { start: '17:30', end: '20:00', isAvailable: true },
        isClosed: false 
    },
    { 
        day: 'Wednesday', 
        morning: { start: '09:00', end: '12:00', isAvailable: true },
        afternoon: { start: '14:00', end: '17:00', isAvailable: false },
        evening: { start: '17:30', end: '20:00', isAvailable: false },
        isClosed: false 
    },
    { 
        day: 'Thursday', 
        morning: { start: '09:00', end: '12:00', isAvailable: true },
        afternoon: { start: '14:00', end: '17:00', isAvailable: true },
        evening: { start: '17:30', end: '20:00', isAvailable: true },
        isClosed: false 
    },
    { 
        day: 'Friday', 
        morning: { start: '09:00', end: '12:00', isAvailable: true },
        afternoon: { start: '14:00', end: '17:00', isAvailable: true },
        evening: { start: '17:30', end: '20:00', isAvailable: false },
        isClosed: false 
    },
    { 
        day: 'Saturday', 
        morning: { start: '09:00', end: '12:00', isAvailable: true },
        afternoon: { start: '14:00', end: '17:00', isAvailable: false },
        evening: { start: '17:30', end: '20:00', isAvailable: false },
        isClosed: false 
    },
    { 
        day: 'Sunday', 
        morning: { start: '09:00', end: '12:00', isAvailable: false },
        afternoon: { start: '14:00', end: '17:00', isAvailable: false },
        evening: { start: '17:30', end: '20:00', isAvailable: false },
        isClosed: true 
    },
]

const mockBillingData: BillingSettings = {
    accountType: 'MCB Juice',
    accountDetails: {
        accountNumber: '•••• •••• 1234',
        accountName: 'Dr. Sarah Johnson',
        bankName: 'MCB',
    },
    paymentMethods: ['MCB Juice', 'Credit Card', 'Cash', 'Insurance'],
    taxId: 'TAX-123456789',
}

const mockSubscriptionPlans: SubscriptionPlan[] = [
    {
        id: 'basic',
        name: 'Basic',
        price: 0,
        features: [
            'Up to 50 appointments/month',
            'Basic patient management',
            'Email support',
            'Standard analytics',
        ],
        period: 'monthly',
        isCurrent: false,
    },
    {
        id: 'professional',
        name: 'Professional',
        price: 4999,
        features: [
            'Unlimited appointments',
            'Advanced patient management',
            'Priority support',
            'Advanced analytics',
            'Video consultations',
            'Prescription management',
            'Lab report integration',
        ],
        period: 'monthly',
        isCurrent: true,
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 9999,
        features: [
            'Everything in Professional',
            'Multi-clinic support',
            'Custom branding',
            'API access',
            'Dedicated account manager',
            'Training sessions',
            'Custom integrations',
        ],
        period: 'monthly',
        isCurrent: false,
    },
]

// --- REUSABLE COMPONENTS ---
const TabButton = ({ icon: Icon, label, tabName, activeTab, setActiveTab }: TabButtonProps) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
      activeTab === tabName
        ? 'bg-gradient-to-r from-primary-blue to-secondary-purple text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="mr-3 text-lg" />
    {label}
  </button>
)

const FormInput = ({ 
    label, 
    name, 
    value, 
    onChange, 
    type = 'text', 
    placeholder = '',
    icon: Icon 
}: { 
    label: string
    name: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
    placeholder?: string
    icon?: IconType 
}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative mt-1">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue ${Icon ? 'pl-10' : ''}`}
            />
        </div>
    </div>
)

const TagInput = ({ label, tags, onChange }: { label: string, tags: string[], onChange: (newTags: string[]) => void }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(inputValue.trim())) {
                onChange([...tags, inputValue.trim()]);
            }
            setInputValue('');
        }
    };
    
    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md">
                {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-primary-blue/10 text-primary-blue text-sm font-medium px-2 py-1 rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-primary-blue hover:text-blue-800">
                            <FaTimes size={12} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type and press Enter"
                    className="flex-1 border-none outline-none focus:ring-0 min-w-[150px]"
                />
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function DoctorSettingsPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as ActiveTab | null
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'profile')
  const [profile, setProfile] = useState<DoctorProfileSettings>(mockProfileData)
  const [availability, setAvailability] = useState<DayAvailability[]>(mockAvailabilityData)
  const [billing, setBilling] = useState<BillingSettings>(mockBillingData)
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | undefined>(
    mockSubscriptionPlans.find(plan => plan.isCurrent)
  )

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  const handleAvailabilityChange = (dayIndex: number, period: 'morning' | 'afternoon' | 'evening', field: keyof TimeSlot, value: string | boolean) => {
    const newAvailability = [...availability];
    if (field === 'isAvailable') {
        newAvailability[dayIndex][period].isAvailable = value as boolean;
    } else {
        newAvailability[dayIndex][period][field] = value as string;
    }
    setAvailability(newAvailability);
  }

  const handleDayToggle = (dayIndex: number) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].isClosed = !newAvailability[dayIndex].isClosed;
    setAvailability(newAvailability);
  }

  const addEducation = () => {
    setProfile({
        ...profile,
        education: [
            ...profile.education,
            { id: `e${Date.now()}`, degree: '', institution: '', year: '' }
        ]
    });
  }

  const removeEducation = (id: string) => {
    setProfile({
        ...profile,
        education: profile.education.filter(e => e.id !== id)
    });
  }

  const handleEducationChange = (index: number, field: 'degree' | 'institution' | 'year', value: string) => {
    const updatedEducation = [...profile.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setProfile({ ...profile, education: updatedEducation });
  }

  const handlePaymentMethodToggle = (method: string) => {
    if (billing.paymentMethods.includes(method)) {
        setBilling({
            ...billing,
            paymentMethods: billing.paymentMethods.filter(m => m !== method)
        });
    } else {
        setBilling({
            ...billing,
            paymentMethods: [...billing.paymentMethods, method]
        });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              <TabButton icon={FaUserEdit} label="Profile Management" tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCalendarAlt} label="Availability" tabName="availability" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCreditCard} label="Billing & Payments" tabName="billing" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCrown} label="Subscription" tabName="subscription" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </aside>

          {/* Content Area */}
          <main className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Profile Management Tab */}
              {activeTab === 'profile' && (
                <form className="space-y-8">
                    {/* Personal Information */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Full Name" name="name" value={profile.name} onChange={handleProfileChange} icon={FaUserEdit} />
                            <FormInput label="Email" name="email" value={profile.email} onChange={handleProfileChange} type="email" icon={FaEnvelope} />
                            <FormInput label="Primary Phone" name="phone" value={profile.phone} onChange={handleProfileChange} icon={FaPhone} />
                            <FormInput label="Alternate Phone" name="alternatePhone" value={profile.alternatePhone} onChange={handleProfileChange} icon={FaPhone} />
                            <FormInput label="Registration Number" name="registrationNumber" value={profile.registrationNumber} onChange={handleProfileChange} icon={FaIdCard} />
                            <FormInput label="Tax ID" name="taxId" value={billing.taxId} onChange={(e) => setBilling({...billing, taxId: e.target.value})} icon={FaCertificate} />
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Primary Specialty</label>
                                <select id="specialty" name="specialty" value={profile.specialty} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue">
                                    <option>Cardiology</option>
                                    <option>Dermatology</option>
                                    <option>Neurology</option>
                                    <option>Pediatrics</option>
                                    <option>Orthopedics</option>
                                    <option>General Practice</option>
                                </select>
                            </div>
                            <FormInput label="Sub-Specialty" name="subSpecialty" value={profile.subSpecialty} onChange={handleProfileChange} icon={FaStethoscope} />
                            <FormInput label="Qualifications" name="qualification" value={profile.qualification} onChange={handleProfileChange} icon={FaGraduationCap} />
                            <FormInput label="Years of Experience" name="experience" value={profile.experience} onChange={handleProfileChange} type="number" icon={FaBriefcaseMedical} />
                        </div>
                        <div className="mt-6">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Professional Bio</label>
                            <textarea 
                                id="bio" 
                                name="bio" 
                                value={profile.bio} 
                                onChange={handleProfileChange} 
                                rows={5} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue"
                            />
                        </div>
                    </div>

                    {/* Education */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Education & Training</h2>
                        <div className="space-y-3">
                            {profile.education.map((edu, index) => (
                                <div key={edu.id} className="flex items-center gap-3 p-3 border rounded-md">
                                    <FaGraduationCap className="text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={edu.degree} 
                                        placeholder="Degree" 
                                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} 
                                        className="flex-1 border-0 focus:ring-0 bg-transparent" 
                                    />
                                    <input 
                                        type="text" 
                                        value={edu.institution} 
                                        placeholder="Institution" 
                                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} 
                                        className="flex-1 border-0 focus:ring-0 bg-transparent" 
                                    />
                                    <input 
                                        type="text" 
                                        value={edu.year} 
                                        placeholder="Year" 
                                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)} 
                                        className="w-24 border-0 focus:ring-0 bg-transparent" 
                                    />
                                    <button type="button" onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-700">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addEducation} className="text-sm text-primary-blue font-semibold mt-3 hover:underline">
                            + Add Education
                        </button>
                    </div>

                    {/* Skills & Services */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Specializations & Services</h2>
                        <div className="space-y-6">
                            <TagInput 
                                label="Languages Spoken" 
                                tags={profile.languages} 
                                onChange={(newLanguages) => setProfile(p => ({ ...p, languages: newLanguages }))} 
                            />
                            <TagInput 
                                label="Specializations" 
                                tags={profile.specializations} 
                                onChange={(newSpecializations) => setProfile(p => ({ ...p, specializations: newSpecializations }))} 
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Services Offered</label>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    {["In-Person Consultation", "Video Consultation", "Second Opinion", "Emergency Consultation", "Home Visit", "Follow-up Care"].map(service => (
                                        <label key={service} className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                checked={profile.services.includes(service)} 
                                                onChange={() => {
                                                    const newServices = profile.services.includes(service) 
                                                        ? profile.services.filter(s => s !== service) 
                                                        : [...profile.services, service];
                                                    setProfile(p => ({...p, services: newServices}));
                                                }} 
                                                className="h-4 w-4 rounded border-gray-300 text-primary-blue focus:ring-primary-blue" 
                                            />
                                            <span className="text-sm text-gray-600">{service}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Consultation Fees */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Consultation Fees</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative">
                                <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">Standard Consultation</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rs</span>
                                    <input 
                                        type="number" 
                                        id="consultationFee" 
                                        name="consultationFee" 
                                        value={profile.consultationFee} 
                                        onChange={handleProfileChange} 
                                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue" 
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="followUpFee" className="block text-sm font-medium text-gray-700">Follow-up Consultation</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rs</span>
                                    <input 
                                        type="number" 
                                        id="followUpFee" 
                                        name="followUpFee" 
                                        value={profile.followUpFee} 
                                        onChange={handleProfileChange} 
                                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue" 
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="videoConsultationFee" className="block text-sm font-medium text-gray-700">Video Consultation</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rs</span>
                                    <input 
                                        type="number" 
                                        id="videoConsultationFee" 
                                        name="videoConsultationFee" 
                                        value={profile.videoConsultationFee} 
                                        onChange={handleProfileChange} 
                                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaShieldAlt className="text-red-500" /> 
                                Emergency Consultation Available
                            </label>
                            <button 
                                type="button" 
                                onClick={() => setProfile(p => ({...p, emergencyConsultationAvailable: !p.emergencyConsultationAvailable}))}
                            >
                                {profile.emergencyConsultationAvailable ? 
                                    <FaToggleOn className="text-3xl text-green-500" /> : 
                                    <FaToggleOff className="text-3xl text-gray-400" />
                                }
                            </button>
                        </div>
                    </div>

                    <div className="text-right pt-6 mt-6 border-t">
                        <button type="submit" className="btn-gradient px-6 py-2.5 flex items-center gap-2 inline-flex">
                            <FaSave />
                            Save Profile Changes
                        </button>
                    </div>
                </form>
              )}

              {/* Availability Management Tab */}
              {activeTab === 'availability' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Your Availability</h2>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            Set your regular consultation hours. Patients will be able to book appointments during these times.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-left">Day</th>
                                    <th className="p-3 text-center">Morning (9AM-12PM)</th>
                                    <th className="p-3 text-center">Afternoon (2PM-5PM)</th>
                                    <th className="p-3 text-center">Evening (5:30PM-8PM)</th>
                                    <th className="p-3 text-center">Day Off</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availability.map((day, dayIndex) => (
                                    <tr key={day.day} className={`border-b ${day.isClosed ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                                        <td className="p-3 font-medium">{day.day}</td>
                                        <td className="p-3 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={day.morning.isAvailable && !day.isClosed} 
                                                onChange={() => handleAvailabilityChange(dayIndex, 'morning', 'isAvailable', !day.morning.isAvailable)} 
                                                disabled={day.isClosed}
                                                className="h-5 w-5 rounded border-gray-300 text-primary-blue focus:ring-primary-blue cursor-pointer disabled:opacity-50" 
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={day.evening.isAvailable && !day.isClosed} 
                                                onChange={() => handleAvailabilityChange(dayIndex, 'evening', 'isAvailable', !day.evening.isAvailable)} 
                                                disabled={day.isClosed}
                                                className="h-5 w-5 rounded border-gray-300 text-primary-blue focus:ring-primary-blue cursor-pointer disabled:opacity-50" 
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={day.isClosed} 
                                                onChange={() => handleDayToggle(dayIndex)} 
                                                className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer" 
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <button type="button" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                                Set All Weekdays
                            </button>
                            <button type="button" className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                                Copy Monday to All
                            </button>
                            <button type="button" className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                                Clear All
                            </button>
                        </div>
                    </div>
                    <div className="text-right mt-6">
                        <button type="button" className="btn-gradient px-6 py-2.5 flex items-center gap-2 inline-flex">
                            <FaSave />
                            Save Availability
                        </button>
                    </div>
                </div>
              )}

              {/* Billing & Payments Tab */}
              {activeTab === 'billing' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Billing & Payment Settings</h2>
                    
                    {/* Payout Account */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-lg mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                    <FaUniversity className="text-xl" /> 
                                    Primary Payout Account
                                </h3>
                                <div className="space-y-1 text-sm text-gray-700">
                                    <p><span className="font-medium">Type:</span> {billing.accountType}</p>
                                    <p><span className="font-medium">Account:</span> {billing.accountDetails.accountNumber}</p>
                                    <p><span className="font-medium">Name:</span> {billing.accountDetails.accountName}</p>
                                    <p><span className="font-medium">Bank:</span> {billing.accountDetails.bankName}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                    Change Account
                                </button>
                                <button className="px-4 py-2 bg-white text-primary-blue border border-primary-blue rounded-lg hover:bg-blue-50 transition-colors text-sm">
                                    Add Secondary
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MCB Juice Integration */}
                    <div className="border rounded-lg p-6 mb-6">
                        <h3 className="font-bold text-gray-800 mb-4">MCB Juice Integration</h3>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img src="https://www.mcb.mu/images/mcb-juice-logo.png" alt="MCB Juice" className="h-10" />
                                <div>
                                    <p className="font-medium text-gray-800">MCB Juice</p>
                                    <p className="text-sm text-gray-600">Enable instant payments through MCB Juice</p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => {
                                    if (billing.accountType === 'MCB Juice') {
                                        setBilling({...billing, accountType: 'Bank Transfer'});
                                    } else {
                                        setBilling({...billing, accountType: 'MCB Juice'});
                                    }
                                }}
                            >
                                {billing.accountType === 'MCB Juice' ? 
                                    <FaToggleOn className="text-4xl text-green-500" /> : 
                                    <FaToggleOff className="text-4xl text-gray-400" />
                                }
                            </button>
                        </div>
                        {billing.accountType === 'MCB Juice' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-800 flex items-center gap-2">
                                    <FaCheckCircle /> MCB Juice is connected and active
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Accepted Payment Methods */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 mb-4">Accepted Payment Methods</h3>
                        <p className="text-sm text-gray-600 mb-4">Select payment methods you accept from patients</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {['MCB Juice', 'Credit Card', 'Debit Card', 'Cash', 'Insurance', 'Bank Transfer'].map(method => (
                                <label key={method} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={billing.paymentMethods.includes(method)} 
                                        onChange={() => handlePaymentMethodToggle(method)}
                                        className="h-5 w-5 rounded border-gray-300 text-primary-blue focus:ring-primary-blue" 
                                    />
                                    <span className="text-gray-700">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Transaction Settings */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 mb-4">Transaction Settings</h3>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-800">Auto-confirm appointments</p>
                                    <p className="text-sm text-gray-600">Automatically confirm appointments when payment is received</p>
                                </div>
                                <FaToggleOn className="text-3xl text-green-500" />
                            </label>
                            <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-800">Send payment receipts</p>
                                    <p className="text-sm text-gray-600">Automatically email receipts to patients after payment</p>
                                </div>
                                <FaToggleOn className="text-3xl text-green-500" />
                            </label>
                            <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-800">Allow refunds</p>
                                    <p className="text-sm text-gray-600">Enable refund processing for cancellations</p>
                                </div>
                                <FaToggleOff className="text-3xl text-gray-400" />
                            </label>
                        </div>
                    </div>

                    <div className="text-right mt-6 pt-6 border-t">
                        <button type="button" className="btn-gradient px-6 py-2.5 flex items-center gap-2 inline-flex">
                            <FaSave />
                            Save Billing Settings
                        </button>
                    </div>
                </div>
              )}

              {/* Subscription Management Tab */}
              {activeTab === 'subscription' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Subscription Management</h2>
                    
                    {/* Current Plan */}
                    {currentPlan && (
                        <div className="bg-gradient-to-r from-primary-blue to-secondary-purple text-white p-6 rounded-lg mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Current Plan: {currentPlan.name}</h3>
                                    <p className="text-white/90 mb-4">Rs {currentPlan.price.toLocaleString()}/month</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span>Next billing: September 1, 2025</span>
                                        <span>•</span>
                                        <span>Status: Active</span>
                                    </div>
                                </div>
                                <FaCrown className="text-4xl text-yellow-300" />
                            </div>
                        </div>
                    )}

                    {/* Available Plans */}
                    <h3 className="font-bold text-gray-800 mb-4">Available Plans</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {mockSubscriptionPlans.map(plan => (
                            <div key={plan.id} className={`border rounded-lg p-6 ${plan.isCurrent ? 'border-primary-blue bg-blue-50' : 'hover:shadow-lg transition-shadow'}`}>
                                {plan.isCurrent && (
                                    <div className="bg-primary-blue text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                                        CURRENT PLAN
                                    </div>
                                )}
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-gray-900">Rs {plan.price.toLocaleString()}</span>
                                    <span className="text-gray-600">/{plan.period}</span>
                                </div>
                                <ul className="space-y-2 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                {!plan.isCurrent && (
                                    <button className="w-full py-2 px-4 border border-primary-blue text-primary-blue rounded-lg hover:bg-primary-blue hover:text-white transition-colors">
                                        {plan.price > (currentPlan?.price || 0) ? 'Upgrade' : 'Downgrade'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Billing History */}
                    <div className="mt-8">
                        <h3 className="font-bold text-gray-800 mb-4">Billing History</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 text-left">Date</th>
                                        <th className="p-3 text-left">Description</th>
                                        <th className="p-3 text-right">Amount</th>
                                        <th className="p-3 text-center">Status</th>
                                        <th className="p-3 text-center">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="p-3">Aug 1, 2025</td>
                                        <td className="p-3">Professional Plan - Monthly</td>
                                        <td className="p-3 text-right">Rs 4,999</td>
                                        <td className="p-3 text-center">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button className="text-primary-blue hover:underline">Download</button>
                                        </td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="p-3">Jul 1, 2025</td>
                                        <td className="p-3">Professional Plan - Monthly</td>
                                        <td className="p-3 text-right">Rs 4,999</td>
                                        <td className="p-3 text-center">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button className="text-primary-blue hover:underline">Download</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800">Payment Method</p>
                                <p className="text-sm text-gray-600">Visa ending in 4242</p>
                            </div>
                            <button className="text-primary-blue hover:underline">Update</button>
                        </div>
                    </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 