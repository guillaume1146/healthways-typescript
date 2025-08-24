'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { 
    FaUserEdit, FaCalendarAlt, FaCreditCard, FaFileUpload, FaSave, FaTrash, 
    FaCheckCircle, FaTimes, FaToggleOn, FaToggleOff, FaDollarSign, FaShieldAlt, 
    FaCar, FaUniversity, FaSync
} from 'react-icons/fa'
import { IconType } from 'react-icons'

// --- TYPE DEFINITIONS ---
type ActiveTab = 'profile' | 'availability' | 'payments' | 'documents'

interface CaregiverProfileSettings {
    name: string
    email: string
    phone: string
    avatar: string
    type: string
    specialization: string
    qualification: string
    experience: number
    location: string
    address: string
    bio: string
    languages: string[]
    ageGroups: string[]
    specialties: string[]
    activities: string[]
    services: string[]
    hourlyRate: number
    monthlyRate: number | string
    transportAvailable: boolean
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
    familyName: string
    amount: number
    fee: number
    payout: number
    status: 'Paid' | 'Pending'
}

interface Document {
    id: string
    name: string
    type: 'Certification' | 'Diploma' | 'ID' | 'First Aid'
    status: 'Verified' | 'Pending Review'
    uploadDate: string
    showOnProfile: boolean
}

// --- MOCK DATA ---
const mockProfileData: CaregiverProfileSettings = {
    name: "Emma Williams",
    email: "emma.w@childcare.mu",
    phone: "+230 5789 1001",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=fef3c7",
    type: "Professional Nanny",
    specialization: "Infant & Toddler Care",
    qualification: "Early Childhood Education Degree, CPR Certified",
    experience: 8,
    location: "Port Louis",
    address: "Available for home visits",
    bio: "Passionate about early childhood development with expertise in Montessori methods and creating engaging educational activities.",
    languages: ["English", "French", "Sign Language"],
    ageGroups: ["0-1 year", "1-3 years"],
    specialties: ["Sleep Training", "Potty Training", "Educational Activities", "Meal Preparation"],
    activities: ["Reading", "Arts & Crafts", "Music", "Outdoor Play"],
    services: ["Full-time", "Part-time", "Live-out", "Overnight Care"],
    hourlyRate: 25,
    monthlyRate: 2800,
    transportAvailable: true,
}

const mockAvailabilityData: Availability[] = [
  { day: 'Monday', morning: true, afternoon: true, evening: true, night: false },
  { day: 'Tuesday', morning: true, afternoon: true, evening: true, night: false },
  { day: 'Wednesday', morning: true, afternoon: true, evening: true, night: false },
  { day: 'Thursday', morning: true, afternoon: true, evening: true, night: false },
  { day: 'Friday', morning: true, afternoon: true, evening: true, night: false },
  { day: 'Saturday', morning: false, afternoon: false, evening: true, night: true },
  { day: 'Sunday', morning: false, afternoon: false, evening: true, night: true },
]

const mockTransactionData: Transaction[] = [
    { id: 't1', date: '2025-08-01', familyName: 'The Smith Family', amount: 1200.00, fee: 150.00, payout: 1050.00, status: 'Paid' },
    { id: 't2', date: '2025-07-25', familyName: 'The Garcia Family', amount: 200.00, fee: 25.00, payout: 175.00, status: 'Paid' },
    { id: 't3', date: '2025-07-18', familyName: 'The Chen Family', amount: 150.00, fee: 18.75, payout: 131.25, status: 'Paid' },
    { id: 't4', date: '2025-08-15', familyName: 'The Rodriguez Family', amount: 1400.00, fee: 175.00, payout: 1225.00, status: 'Pending' },
]

const mockDocumentData: Document[] = [
    { id: 'd1', name: 'Early Childhood Education.pdf', type: 'Diploma', status: 'Verified', uploadDate: '2024-01-15', showOnProfile: true },
    { id: 'd2', name: 'CPR & First Aid Cert.pdf', type: 'First Aid', status: 'Verified', uploadDate: '2025-06-20', showOnProfile: true },
    { id: 'd3', name: 'National ID Card.pdf', type: 'ID', status: 'Verified', uploadDate: '2024-01-10', showOnProfile: false },
    { id: 'd4', name: 'Montessori Method Cert.pdf', type: 'Certification', status: 'Pending Review', uploadDate: '2025-08-10', showOnProfile: false },
]

// --- REUSABLE COMPONENTS ---
const TabButton = ({ icon: Icon, label, tabName, activeTab, setActiveTab }: { icon: IconType, label: string, tabName: ActiveTab, activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void }) => (
  <button onClick={() => setActiveTab(tabName)} className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tabName ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}><Icon className="mr-3 text-lg" />{label}</button>
);

const TagInput = ({ label, tags, onChange }: { label: string, tags: string[], onChange: (newTags: string[]) => void }) => {
    const [inputValue, setInputValue] = useState('');
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) { e.preventDefault(); if (!tags.includes(inputValue.trim())) { onChange([...tags, inputValue.trim()]); } setInputValue(''); }
    };
    const removeTag = (tagToRemove: string) => onChange(tags.filter(tag => tag !== tagToRemove));
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md">
                {tags.map(tag => (<span key={tag} className="flex items-center gap-1 bg-purple-100 text-purple-800 text-sm font-medium px-2 py-1 rounded-full">{tag}<button type="button" onClick={() => removeTag(tag)} className="text-purple-600 hover:text-purple-800"><FaTimes size={12} /></button></span>))}
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type and press Enter" className="flex-1 border-none outline-none focus:ring-0 min-w-[150px]" />
            </div>
        </div>
    );
};

// --- MAIN CLIENT COMPONENT ---
export default function SettingsClient() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as ActiveTab | null
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'profile')
  const [profile, setProfile] = useState<CaregiverProfileSettings>(mockProfileData)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Caregiver Account & Profile</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              <TabButton icon={FaUserEdit} label="My Profile" tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCalendarAlt} label="My Availability" tabName="availability" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCreditCard} label="Payments & Payouts" tabName="payments" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaFileUpload} label="My Documents" tabName="documents" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </aside>
          <main className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              {activeTab === 'profile' && (
                <form className="space-y-8">
                    {/* --- Personal Info --- */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                        <div className="flex items-center gap-6"><Image src={profile.avatar} alt="Avatar" width={96} height={96} className="w-24 h-24 rounded-full border-4 border-purple-200" /><div><label htmlFor="avatar-upload" className="cursor-pointer bg-purple-100 text-purple-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-200">Change Photo</label><input id="avatar-upload" type="file" className="hidden" /></div></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500" /></div>
                            <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700">Public Phone</label><input type="text" id="phone" name="phone" value={profile.phone} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500" /></div>
                        </div>
                    </div>
                    {/* --- Professional Details --- */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label htmlFor="type" className="block text-sm font-medium text-gray-700">Caregiver Type</label><select id="type" name="type" value={profile.type} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"><option>Professional Nanny</option><option>Au Pair</option><option>Childminder</option><option>Babysitter</option><option>Special Needs Carer</option></select></div>
                            <div><label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label><input type="number" id="experience" name="experience" value={profile.experience} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500" /></div>
                            <div className="md:col-span-2"><label htmlFor="qualification" className="block text-sm font-medium text-gray-700">Qualifications</label><input type="text" id="qualification" name="qualification" value={profile.qualification} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500" /></div>
                            <div className="md:col-span-2"><label htmlFor="bio" className="block text-sm font-medium text-gray-700">Profile Bio</label><textarea id="bio" name="bio" value={profile.bio} onChange={handleProfileChange} rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"></textarea></div>
                        </div>
                    </div>
                    {/* --- Skills & Services --- */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">My Skills & Services</h2>
                        <div className="space-y-6">
                            <div><label className="block text-sm font-medium text-gray-700">Age Groups I Work With</label><div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">{["0-1 year", "1-3 years", "3-5 years", "6-10 years", "11+ years"].map(age => (<label key={age} className="flex items-center gap-2"><input type="checkbox" checked={profile.ageGroups.includes(age)} onChange={() => { const newAges = profile.ageGroups.includes(age) ? profile.ageGroups.filter(a => a !== age) : [...profile.ageGroups, age]; setProfile(p => ({ ...p, ageGroups: newAges })); }} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" /><span className="text-sm text-gray-600">{age}</span></label>))}</div></div>
                            <TagInput label="Specialties" tags={profile.specialties} onChange={(tags) => setProfile(p => ({ ...p, specialties: tags }))} />
                            <TagInput label="Activities I Offer" tags={profile.activities} onChange={(tags) => setProfile(p => ({ ...p, activities: tags }))} />
                            <TagInput label="Languages I Speak" tags={profile.languages} onChange={(tags) => setProfile(p => ({ ...p, languages: tags }))} />
                        </div>
                    </div>
                    {/* --- Rates & Transport --- */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">My Rates & Transport</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="relative"><label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate</label><FaDollarSign className="absolute left-3 top-9 text-gray-400" /><input type="number" id="hourlyRate" name="hourlyRate" value={profile.hourlyRate} onChange={handleProfileChange} className="pl-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500" /></div>
                             <div className="relative"><label htmlFor="monthlyRate" className="block text-sm font-medium text-gray-700">Monthly Rate (Optional)</label><FaDollarSign className="absolute left-3 top-9 text-gray-400" /><input type="text" id="monthlyRate" name="monthlyRate" value={profile.monthlyRate} onChange={handleProfileChange} className="pl-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500" /></div>
                        </div>
                        <div className="mt-6 flex items-center gap-4"><label className="text-sm font-medium text-gray-700 flex items-center gap-2"><FaCar className="text-blue-500" /> Transport Available</label><button type="button" onClick={() => setProfile(p => ({...p, transportAvailable: !p.transportAvailable}))}>{profile.transportAvailable ? <FaToggleOn className="text-3xl text-green-500" /> : <FaToggleOff className="text-3xl text-gray-400" />}</button></div>
                    </div>
                    <div className="text-right pt-6 mt-6 border-t"><button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex"><FaSave />Save Profile</button></div>
                </form>
              )}
              {activeTab === 'availability' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Your Weekly Availability</h2>
                  <p className="text-sm text-gray-500 mb-6">This sets your recurring weekly schedule. You can manage one-off exceptions on the main appointments calendar.</p>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 font-medium text-gray-600">Day</th>
                            <th className="p-3 text-center font-medium text-gray-600">Morning (7am-12pm)</th>
                            <th className="p-3 text-center font-medium text-gray-600">Afternoon (12pm-5pm)</th>
                            <th className="p-3 text-center font-medium text-gray-600">Evening (5pm-9pm)</th>
                            <th className="p-3 text-center font-medium text-gray-600">Overnight (9pm+)</th>
                          </tr>
                       </thead>
                       <tbody>
                          {availability.map((day, dayIndex) => (
                              <tr key={day.day} className="border-b hover:bg-gray-50">
                                 <td className="p-3 font-medium">{day.day}</td>
                                 {(['morning', 'afternoon', 'evening', 'night'] as const).map(period => (
                                     <td key={period} className="p-3 text-center">
                                         <input type="checkbox" checked={day[period]} onChange={() => handleAvailabilityChange(dayIndex, period)} className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                                     </td>
                                 ))}
                              </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                   <div className="text-right mt-6">
                      <button type="button" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex">
                        <FaSave />
                        Save Schedule
                      </button>
                    </div>
                </div>
              )}
              {activeTab === 'payments' && (
                  <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payments & Payouts</h2>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                         <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-blue-900 mb-1 flex items-center gap-2"><FaUniversity /> Payout Method</h3>
                                <p className="text-sm text-blue-800">Bank Account: •••• •••• 1234 (MCB)</p>
                            </div>
                            <button className="text-sm font-medium text-purple-600 hover:underline">Change</button>
                         </div>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-4">Transaction History</h3>
                      <div className="overflow-x-auto border rounded-lg">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50">
                                  <tr>
                                      <th className="p-3 font-medium text-gray-600">Date</th>
                                      <th className="p-3 font-medium text-gray-600">Family</th>
                                      <th className="p-3 text-right font-medium text-gray-600">Amount</th>
                                      <th className="p-3 text-right font-medium text-gray-600">Payout</th>
                                      <th className="p-3 text-center font-medium text-gray-600">Status</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {mockTransactionData.map(tx => (
                                      <tr key={tx.id} className="border-b hover:bg-gray-50">
                                          <td className="p-3">{tx.date}</td>
                                          <td className="p-3 font-medium">{tx.familyName}</td>
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
              {activeTab === 'documents' && (
                  <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Documents & Verification</h2>
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <div className="flex items-center gap-3">
                           <FaShieldAlt className="text-blue-600 text-2xl"/>
                           <div>
                              <h4 className="font-bold text-blue-900">Background Check: Complete</h4>
                              <p className="text-sm text-blue-800">Your background check was successfully completed on Jan 10, 2024. This builds trust with families.</p>
                           </div>
                        </div>
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
                                              <span className="flex items-center gap-1 text-orange-600 font-medium"><FaSync className="animate-spin"/> Pending Review</span>
                                          )}
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                                    {doc.status === 'Verified' && (
                                        <label className="flex items-center cursor-pointer">
                                            <input type="checkbox" checked={doc.showOnProfile} onChange={() => handleDocumentToggle(doc.id)} className="sr-only peer" />
                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-300 peer-checked:after:translate-x-full after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
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
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none">
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