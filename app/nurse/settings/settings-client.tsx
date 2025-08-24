'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
// Import the next/image component
import Image from 'next/image'
import { 
    FaUserEdit, FaCalendarAlt, FaCreditCard, FaFileUpload, FaSave, FaTrash, 
    FaCheckCircle, FaTimes, FaToggleOn, FaToggleOff, FaDollarSign, FaShieldAlt
} from 'react-icons/fa'
import { IconType } from 'react-icons'

// --- TYPE DEFINITIONS ---
type ActiveTab = 'profile' | 'availability' | 'payments' | 'documents'

interface TabButtonProps {
  icon: IconType
  label: string
  tabName: ActiveTab
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
}

interface Availability {
  day: string
  morning: boolean
  afternoon: boolean
  evening: boolean
  night: boolean
}

interface Transaction {
    id: string
    date: string
    patientName: string
    amount: number
    commission: number
    payout: number
    status: 'Paid' | 'Pending'
}

interface Document {
    id: string
    name: string
    type: 'Certification' | 'License' | 'ID'
    status: 'Verified' | 'Pending Review'
    uploadDate: string
    showOnProfile: boolean
}

interface NurseProfileSettings {
    name: string
    email: string
    phone: string
    avatar: string
    type: 'Registered Nurse' | 'Licensed Practical Nurse' | 'Pediatric Nurse' | 'Critical Care Nurse' | 'Home Health Nurse' | 'Rehabilitation Nurse'
    specialization: string
    qualification: string
    experience: number // Years
    location: string
    address: string
    bio: string
    languages: string[]
    specialties: string[]
    services: string[]
    hourlyRate: number
    weeklyRate: number
    monthlyRate: number
    emergencyAvailable: boolean
}

// --- MOCK DATA ---
const mockProfileData: NurseProfileSettings = {
    name: "Maria Thompson",
    email: "maria.t@healthcare.mu",
    phone: "+230 5789 0123",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Avery",
    type: "Registered Nurse",
    specialization: "Elderly Care Specialist",
    qualification: "BSN, RN, CCRN",
    experience: 12,
    location: "Port Louis",
    address: "Central Healthcare Services, Port Louis",
    bio: "Specialized in geriatric care with expertise in managing chronic conditions and providing compassionate end-of-life care.",
    languages: ["English", "French", "Creole"],
    specialties: ["Elderly Care", "Dementia Care", "Palliative Care", "Medication Management"],
    services: ["Home Care", "Hospital Care", "Night Shift Available"],
    hourlyRate: 45,
    weeklyRate: 1500,
    monthlyRate: 5500,
    emergencyAvailable: true,
}

const mockAvailabilityData: Availability[] = [
  { day: 'Monday', morning: true, afternoon: true, evening: true, night: true },
  { day: 'Tuesday', morning: true, afternoon: true, evening: true, night: true },
  { day: 'Wednesday', morning: true, afternoon: false, evening: true, night: false },
  { day: 'Thursday', morning: true, afternoon: true, evening: true, night: true },
  { day: 'Friday', morning: true, afternoon: true, evening: false, night: false },
  { day: 'Saturday', morning: true, afternoon: false, evening: false, night: false },
  { day: 'Sunday', morning: false, afternoon: false, evening: false, night: false },
]

const mockTransactionData: Transaction[] = [
    { id: 't1', date: '2025-07-20', patientName: 'John Smith', amount: 180.00, commission: 18.00, payout: 162.00, status: 'Paid' },
    { id: 't2', date: '2025-07-18', patientName: 'Sarah Johnson', amount: 250.00, commission: 25.00, payout: 225.00, status: 'Paid' },
    { id: 't3', date: '2025-07-15', patientName: 'Robert Chen', amount: 150.00, commission: 15.00, payout: 135.00, status: 'Paid' },
]

const mockDocumentData: Document[] = [
    { id: 'd1', name: 'Critical Care (CCRN).pdf', type: 'Certification', status: 'Verified', uploadDate: '2024-01-15', showOnProfile: true },
    { id: 'd2', name: 'Geriatric Nursing Cert.pdf', type: 'Certification', status: 'Verified', uploadDate: '2024-01-15', showOnProfile: true },
    { id: 'd3', name: 'RN-License-2025.pdf', type: 'License', status: 'Pending Review', uploadDate: '2025-06-30', showOnProfile: false },
]

// --- REUSABLE COMPONENTS ---
const TabButton = ({ icon: Icon, label, tabName, activeTab, setActiveTab }: TabButtonProps) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
      activeTab === tabName
        ? 'bg-teal-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="mr-3 text-lg" />
    {label}
  </button>
)

const FormInput = ({ label, name, value, onChange, type = 'text', placeholder = '' }: { label: string, name: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
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
                    <span key={tag} className="flex items-center gap-1 bg-teal-100 text-teal-800 text-sm font-medium px-2 py-1 rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-teal-600 hover:text-teal-800">
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
export default function SettingsClient() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as ActiveTab | null
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'profile')

  // State for all settings forms
  const [profile, setProfile] = useState<NurseProfileSettings>(mockProfileData)
  const [availability, setAvailability] = useState<Availability[]>(mockAvailabilityData)
  const [documents, setDocuments] = useState<Document[]>(mockDocumentData)

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  const handleAvailabilityChange = (dayIndex: number, period: keyof Omit<Availability, 'day'>) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex][period] = !newAvailability[dayIndex][period];
    setAvailability(newAvailability);
  }

  const handleDocumentToggle = (docId: string) => {
    setDocuments(docs => docs.map(doc => doc.id === docId ? { ...doc, showOnProfile: !doc.showOnProfile } : doc));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account & Profile Settings</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              <TabButton icon={FaUserEdit} label="Profile Details" tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCalendarAlt} label="My Availability" tabName="availability" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCreditCard} label="Payments & Payouts" tabName="payments" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaFileUpload} label="My Documents" tabName="documents" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </aside>

          {/* Content Area */}
          <main className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Profile Management Content */}
              {activeTab === 'profile' && (
                <form className="space-y-8">
                    {/* --- Personal Information --- */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                        <div className="flex items-center gap-6">
                            {/* FIXED: Replaced <img> with <Image> */}
                            <Image src={profile.avatar} alt="Avatar" width={96} height={96} className="w-24 h-24 rounded-full border-4 border-teal-200" />
                            <div>
                                <label htmlFor="avatar-upload" className="cursor-pointer bg-teal-100 text-teal-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-200">Change Photo</label>
                                <input id="avatar-upload" type="file" className="hidden" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <FormInput label="Full Name" name="name" value={profile.name} onChange={handleProfileChange} />
                            <FormInput label="Public Phone Number" name="phone" value={profile.phone} onChange={handleProfileChange} />
                            <FormInput label="Email Address" name="email" value={profile.email} onChange={handleProfileChange} type="email" />
                            <FormInput label="Location / City" name="location" value={profile.location} onChange={handleProfileChange} placeholder="e.g., Port Louis" />
                            <div className="md:col-span-2">
                                <FormInput label="Full Address" name="address" value={profile.address} onChange={handleProfileChange} placeholder="e.g., 123 Royal Street, Port Louis" />
                            </div>
                        </div>
                    </div>
                    
                    {/* --- Professional Details --- */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Nurse Type</label>
                                <select id="type" name="type" value={profile.type} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500">
                                    <option>Registered Nurse</option>
                                    <option>Licensed Practical Nurse</option>
                                    <option>Pediatric Nurse</option>
                                    <option>Critical Care Nurse</option>
                                    <option>Home Health Nurse</option>
                                    <option>Rehabilitation Nurse</option>
                                </select>
                            </div>
                           <FormInput label="Main Specialization" name="specialization" value={profile.specialization} onChange={handleProfileChange} placeholder="e.g., Elderly Care Specialist" />
                           <FormInput label="Qualifications" name="qualification" value={profile.qualification} onChange={handleProfileChange} placeholder="e.g., BSN, RN, CCRN" />
                           <FormInput label="Years of Experience" name="experience" value={profile.experience} onChange={handleProfileChange} type="number" />
                        </div>
                         <div className="mt-6">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Profile Bio</label>
                            <textarea id="bio" name="bio" value={profile.bio} onChange={handleProfileChange} rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"></textarea>
                        </div>
                    </div>

                    {/* --- Services & Skills --- */}
                     <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Services & Skills</h2>
                        <div className="space-y-6">
                            <TagInput 
                                label="Languages Spoken" 
                                tags={profile.languages} 
                                onChange={(newLanguages) => setProfile(p => ({ ...p, languages: newLanguages }))} 
                            />
                            <TagInput 
                                label="Specialties" 
                                tags={profile.specialties} 
                                onChange={(newSpecialties) => setProfile(p => ({ ...p, specialties: newSpecialties }))} 
                            />
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Services Offered</label>
                                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {["Home Care", "Hospital Care", "Night Shift Available", "Emergency Response", "Rehabilitation Support", "Day Care"].map(service => (
                                        <label key={service} className="flex items-center gap-2">
                                            <input type="checkbox" checked={profile.services.includes(service)} onChange={() => {
                                                const newServices = profile.services.includes(service) ? profile.services.filter(s => s !== service) : [...profile.services, service];
                                                setProfile(p => ({...p, services: newServices}));
                                            }} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                                            <span className="text-sm text-gray-600">{service}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Rates & Availability --- */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Rates & Emergency Availability</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="relative">
                                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                                <FaDollarSign className="absolute left-3 top-9 text-gray-400" />
                                <input type="number" id="hourlyRate" name="hourlyRate" value={profile.hourlyRate} onChange={handleProfileChange} className="pl-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                            </div>
                             <div className="relative">
                                <label htmlFor="weeklyRate" className="block text-sm font-medium text-gray-700">Weekly Rate (Optional)</label>
                                <FaDollarSign className="absolute left-3 top-9 text-gray-400" />
                                <input type="number" id="weeklyRate" name="weeklyRate" value={profile.weeklyRate} onChange={handleProfileChange} className="pl-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                            </div>
                             <div className="relative">
                                <label htmlFor="monthlyRate" className="block text-sm font-medium text-gray-700">Monthly Rate (Optional)</label>
                                <FaDollarSign className="absolute left-3 top-9 text-gray-400" />
                                <input type="number" id="monthlyRate" name="monthlyRate" value={profile.monthlyRate} onChange={handleProfileChange} className="pl-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                            </div>
                         </div>
                         <div className="mt-6 flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><FaShieldAlt className="text-red-500" /> Emergency Availability</label>
                            <button type="button" onClick={() => setProfile(p => ({...p, emergencyAvailable: !p.emergencyAvailable}))}>
                                {profile.emergencyAvailable ? <FaToggleOn className="text-3xl text-green-500" /> : <FaToggleOff className="text-3xl text-gray-400" />}
                            </button>
                         </div>
                    </div>

                    <div className="text-right pt-6 mt-6 border-t">
                      <button type="submit" className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center gap-2 inline-flex">
                        <FaSave />
                        Save All Changes
                      </button>
                    </div>
                </form>
              )}
              
              {/* Availability Content */}
              {activeTab === 'availability' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Your Weekly Schedule</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3">Day</th>
                            <th className="p-3 text-center">Morning (6AM-12PM)</th>
                            <th className="p-3 text-center">Afternoon (12PM-6PM)</th>
                            <th className="p-3 text-center">Evening (6PM-10PM)</th>
                            <th className="p-3 text-center">Night (10PM-6AM)</th>
                          </tr>
                       </thead>
                       <tbody>
                          {availability.map((day, dayIndex) => (
                              <tr key={day.day} className="border-b hover:bg-gray-50">
                                 <td className="p-3 font-medium">{day.day}</td>
                                 {(['morning', 'afternoon', 'evening', 'night'] as const).map(period => (
                                     <td key={period} className="p-3 text-center">
                                         <input type="checkbox" checked={day[period]} onChange={() => handleAvailabilityChange(dayIndex, period)} className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer" />
                                     </td>
                                 ))}
                              </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                   <div className="text-right mt-6">
                      <button type="button" className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center gap-2 inline-flex">
                        <FaSave />
                        Save Schedule
                      </button>
                    </div>
                </div>
              )}

              {/* Payments Content */}
              {activeTab === 'payments' && (
                  <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment & Payouts</h2>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                         <h3 className="font-bold text-blue-900 mb-2">Payout Method</h3>
                         <p className="text-sm text-blue-800">Bank Account: **** **** 1234 (Bank of Mauritius)</p>
                         <button className="text-sm font-medium text-teal-600 hover:underline mt-2">Change Payout Method</button>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-4">Transaction History</h3>
                      <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50">
                                  <tr>
                                      <th className="p-3">Date</th>
                                      <th className="p-3">Patient</th>
                                      <th className="p-3 text-right">Amount</th>
                                      <th className="p-3 text-right">Net Payout</th>
                                      <th className="p-3 text-center">Status</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {mockTransactionData.map(tx => (
                                      <tr key={tx.id} className="border-b hover:bg-gray-50">
                                          <td className="p-3">{tx.date}</td>
                                          <td className="p-3">{tx.patientName}</td>
                                          <td className="p-3 text-right">${tx.amount.toFixed(2)}</td>
                                          <td className="p-3 text-right font-medium text-green-600">${tx.payout.toFixed(2)}</td>
                                          <td className="p-3 text-center">
                                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tx.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{tx.status}</span>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {/* Documents Content */}
              {activeTab === 'documents' && (
                  <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Professional Documents</h2>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <p className="text-sm text-yellow-800">Keep documents up-to-date to maintain a &apos;Verified&apos; status. Only &apos;Verified&apos; certifications can be shown on your profile.</p>
                      </div>
                      <div className="space-y-4 mb-6">
                          {documents.map(doc => (
                              <div key={doc.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-gray-50">
                                  <div>
                                      <p className="font-medium text-gray-900">{doc.name}</p>
                                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                                          <span>Type: {doc.type}</span>
                                          <span>Uploaded: {doc.uploadDate}</span>
                                          {doc.status === 'Verified' ? (
                                              <span className="flex items-center gap-1 text-green-600 font-medium"><FaCheckCircle/> Verified</span>
                                          ) : (
                                              <span className="text-orange-600 font-medium">Pending Review</span>
                                          )}
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                                    {doc.status === 'Verified' && doc.type === 'Certification' && (
                                        <label className="flex items-center cursor-pointer">
                                            <input type="checkbox" checked={doc.showOnProfile} onChange={() => handleDocumentToggle(doc.id)} className="sr-only peer" />
                                            {/* FIXED: Removed the problematic after:content-[''] class */}
                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:after:translate-x-full after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                            <span className="ms-2 text-sm font-medium text-gray-700">Show on profile</span>
                                        </label>
                                    )}
                                    <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Document</label>
                           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none">
                                        <span>Click to upload</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                            </div>
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