'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
    FaUserEdit, FaCalendarAlt, FaCreditCard, FaFileUpload, FaSave, FaTrash, 
    FaCheckCircle, FaTimes, FaToggleOn, FaToggleOff, FaDollarSign, FaShieldAlt, 
    FaUniversity, FaSync, FaClock, FaRocket, FaExclamationCircle
} from 'react-icons/fa'
import { IconType } from 'react-icons'

// --- TYPE DEFINITIONS ---
type ActiveTab = 'profile' | 'availability' | 'payments' | 'documents'

interface ResponderProfileSettings {
    name: string
    type: string
    category: string
    phone: string
    alternatePhone: string
    email: string
    location: string
    coverage: string
    bio: string
    services: string[]
    equipment: string[]
    vehicleTypes: string[]
    responseTime: string
    onCallStatus: boolean
    languages: string[]
    gpsTracking: boolean
    governmentApproved: boolean
}

interface ShiftData {
    [day: string]: boolean[]; // Array of 24 booleans, one for each hour
}

interface Transaction {
    id: string
    date: string
    ticketId: string
    incidentType: string
    amount: number
    fee: number
    payout: number
    status: 'Paid' | 'Pending'
}

interface Document {
    id: string
    name: string
    type: 'Certification' | 'License' | 'ID'
    status: 'Verified' | 'Pending Review' | 'Expired'
    issueDate: string
    expiryDate: string
}

// --- MOCK DATA ---
const mockProfileData: ResponderProfileSettings = {
    name: "MediRescue Ambulance Service",
    type: "Emergency Ambulance",
    category: "Medical Emergency",
    phone: "911",
    alternatePhone: "+230 5789 9911",
    email: "dispatch@medirescue.mu",
    location: "Port Louis",
    coverage: "Port Louis & Surrounding Areas",
    bio: "Leading emergency medical service with state-of-the-art ambulances and highly trained paramedics.",
    services: ["Advanced Life Support", "Cardiac Emergency", "Trauma Care", "Patient Transport"],
    equipment: ["Ventilator", "Defibrillator", "Emergency Medications", "Trauma Kit"],
    vehicleTypes: ["ALS Ambulance", "BLS Ambulance", "Critical Care Unit"],
    responseTime: "5-8 minutes",
    onCallStatus: true,
    languages: ["English", "French", "Creole", "Hindi"],
    gpsTracking: true,
    governmentApproved: true,
}

const initialShifts: ShiftData = {
    Monday: Array(24).fill(true), // 24/7 on-call
    Tuesday: Array(24).fill(true),
    Wednesday: Array(24).fill(true),
    Thursday: Array(24).fill(true),
    Friday: Array(24).fill(true),
    Saturday: Array(24).fill(true),
    Sunday: Array(24).fill(true),
};

const mockTransactionData: Transaction[] = [
    { id: 't1', date: '2025-08-22', ticketId: 'EMG-1661154321-123', incidentType: 'Cardiac Arrest', amount: 2500, fee: 250, payout: 2250, status: 'Paid' },
    { id: 't2', date: '2025-08-21', ticketId: 'EMG-1661067921-456', incidentType: 'Trauma - Fall', amount: 1800, fee: 180, payout: 1620, status: 'Paid' },
    { id: 't3', date: '2025-08-20', ticketId: 'EMG-1660981521-789', incidentType: 'Patient Transport', amount: 1200, fee: 120, payout: 1080, status: 'Paid' },
    { id: 't4', date: '2025-08-24', ticketId: 'EMG-1661327121-101', incidentType: 'Severe Allergic Reaction', amount: 2250, fee: 225, payout: 2025, status: 'Pending' },
]

const mockDocumentData: Document[] = [
    { id: 'd1', name: 'Advanced Life Support (ALS)', type: 'Certification', status: 'Verified', issueDate: '2024-09-01', expiryDate: '2026-09-01' },
    { id: 'd2', name: 'Emergency Medical Service License', type: 'License', status: 'Verified', issueDate: '2025-01-01', expiryDate: '2026-01-01' },
    { id: 'd3', name: 'Paramedic ID - J. Patel', type: 'ID', status: 'Verified', issueDate: '2023-01-15', expiryDate: '2028-01-15' },
    { id: 'd4', name: 'Pediatric Advanced Life Support (PALS)', type: 'Certification', status: 'Expired', issueDate: '2023-07-15', expiryDate: '2025-07-15' },
    { id: 'd5', name: 'Hazmat Response Training', type: 'Certification', status: 'Pending Review', issueDate: '2025-08-20', expiryDate: '2027-08-20' },
]

// --- REUSABLE COMPONENTS ---
const TabButton = ({ icon: Icon, label, tabName, activeTab, setActiveTab }: { icon: IconType, label: string, tabName: ActiveTab, activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void }) => (
  <button onClick={() => setActiveTab(tabName)} className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tabName ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}><Icon className="mr-3 text-lg" />{label}</button>
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
                {tags.map(tag => (<span key={tag} className="flex items-center gap-1 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">{tag}<button type="button" onClick={() => removeTag(tag)} className="text-red-600 hover:text-red-800"><FaTimes size={12} /></button></span>))}
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type and press Enter" className="flex-1 border-none outline-none focus:ring-0 min-w-[150px]" />
            </div>
        </div>
    );
};

// --- MAIN CLIENT COMPONENT ---
export default function SettingsClient() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as ActiveTab | null;
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'profile');
  const [profile, setProfile] = useState<ResponderProfileSettings>(mockProfileData);
  const [shifts, setShifts] = useState<ShiftData>(initialShifts);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const toggleShiftHour = (day: string, hour: number) => {
    setShifts(prev => {
        const newDayShifts = [...prev[day]];
        newDayShifts[hour] = !newDayShifts[hour];
        return { ...prev, [day]: newDayShifts };
    });
  };
  
  const getStatusBadge = (status: 'Verified' | 'Pending Review' | 'Expired') => {
    switch (status) {
        case 'Verified': return <span className="flex items-center gap-1 text-green-600 font-medium"><FaCheckCircle/> Verified</span>;
        case 'Pending Review': return <span className="flex items-center gap-1 text-orange-600 font-medium"><FaSync className="animate-spin"/> Pending</span>;
        case 'Expired': return <span className="flex items-center gap-1 text-red-600 font-medium"><FaExclamationCircle/> Expired</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Emergency Service Settings</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              <TabButton icon={FaUserEdit} label="Service Profile" tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCalendarAlt} label="Availability & Shifts" tabName="availability" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCreditCard} label="Payments & Billing" tabName="payments" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaFileUpload} label="Certifications & ID" tabName="documents" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </aside>
          <main className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              {activeTab === 'profile' && (
                <form className="space-y-8">
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Service Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name</label><input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" /></div>
                            <div><label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label><select id="category" name="category" value={profile.category} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"><option>Emergency Medical</option><option>Fire & Rescue</option><option>Security</option></select></div>
                            <div className="md:col-span-2"><label htmlFor="bio" className="block text-sm font-medium text-gray-700">Service Description</label><textarea id="bio" name="bio" value={profile.bio} onChange={handleProfileChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"></textarea></div>
                        </div>
                    </div>
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Contact & Location</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700">Emergency Hotline</label><input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" /></div>
                            <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Dispatch Email</label><input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" /></div>
                            <div><label htmlFor="location" className="block text-sm font-medium text-gray-700">Base Location</label><input type="text" id="location" name="location" value={profile.location} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" /></div>
                            <div><label htmlFor="coverage" className="block text-sm font-medium text-gray-700">Coverage Area</label><input type="text" id="coverage" name="coverage" value={profile.coverage} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500" /></div>
                        </div>
                    </div>
                    <div className="pb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Capabilities</h2>
                        <div className="space-y-6">
                            <TagInput label="Services Offered" tags={profile.services} onChange={(tags) => setProfile(p => ({ ...p, services: tags }))} />
                            <TagInput label="On-board Equipment" tags={profile.equipment} onChange={(tags) => setProfile(p => ({ ...p, equipment: tags }))} />
                            <TagInput label="Vehicle Types" tags={profile.vehicleTypes} onChange={(tags) => setProfile(p => ({ ...p, vehicleTypes: tags }))} />
                        </div>
                    </div>
                    <div className="text-right pt-6 mt-6 border-t">
                        <button type="button" className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex">
                            <FaSave />
                            Save Profile
                        </button>
                    </div>
                </form>
              )}
              {activeTab === 'availability' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Availability & Shift Management</h2>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <p className="text-sm text-yellow-800">Your live status on the dashboard overrides these hours. This schedule defines your standard on-call periods.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 border rounded-lg bg-gray-50">
                      <div>
                        <label htmlFor="responseTime" className="block text-sm font-medium text-gray-700">Advertised Response Time</label>
                        <input 
                          type="text" 
                          id="responseTime" 
                          name="responseTime" 
                          value={profile.responseTime} 
                          onChange={handleProfileChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaRocket className="text-green-500" /> 
                                On-Call Status
                            </label>
                            <button type="button" onClick={() => setProfile(p => ({...p, onCallStatus: !p.onCallStatus}))}>
                                {profile.onCallStatus ? <FaToggleOn className="text-3xl text-green-500" /> : <FaToggleOff className="text-3xl text-gray-400" />}
                            </button>
                        </div>
                      </div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-4">Set On-Call Hours (Weekly Schedule)</h3>
                  <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-xs text-center">
                          <thead className="bg-gray-100">
                              <tr>
                                  <th className="p-2 font-medium text-gray-600 text-left">Day</th>
                                  {Array.from({ length: 24 }).map((_, hour) => <th key={hour} className="p-1 font-normal text-gray-500">{hour.toString().padStart(2, '0')}</th>)}
                              </tr>
                          </thead>
                          <tbody>
                              {Object.entries(shifts).map(([day, hours]) => (
                                  <tr key={day} className="border-t">
                                      <td className="p-2 font-medium text-left">{day}</td>
                                      {hours.map((isOnCall, hour) => (
                                          <td key={hour} className="p-0">
                                              <button onClick={() => toggleShiftHour(day, hour)} className={`w-full h-6 transition-colors ${isOnCall ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 hover:bg-gray-300'}`}></button>
                                          </td>
                                      ))}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <div className="text-right mt-6">
                    <button type="button" className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex">
                        <FaSave />
                        Save Availability
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'payments' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Payments & Billing</h2>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-blue-900 mb-1 flex items-center gap-2"><FaUniversity /> Payout Account</h3>
                          <p className="text-sm text-blue-800">Receiving funds at: •••• •••• 1114 (SBM)</p>
                        </div>
                        <button className="text-sm font-medium text-red-600 hover:underline">Configure</button>
                      </div>
                    </div>
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 mb-4">Service Pricing & Surcharges</h3>
                        <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
                            <label className="flex justify-between items-center">
                                <span>Standard Intervention Fee</span>
                                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rs</span><input type="number" defaultValue="1800" className="w-32 pl-8 pr-2 py-1 border rounded-md" /></div>
                            </label>
                            <label className="flex justify-between items-center">
                                <span>Urgent Care Surcharge</span>
                                <div className="relative"><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span><input type="number" defaultValue="25" className="w-32 pr-8 pl-2 py-1 border rounded-md" /></div>
                            </label>
                            <label className="flex justify-between items-center">
                                <span>Critical Care Surcharge</span>
                                <div className="relative"><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span><input type="number" defaultValue="50" className="w-32 pr-8 pl-2 py-1 border rounded-md" /></div>
                            </label>
                        </div>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50">
                                <tr className="border-b">
                                    <th className="p-3 font-medium text-gray-600">Date</th>
                                    <th className="p-3 font-medium text-gray-600">Ticket ID</th>
                                    <th className="p-3 font-medium text-gray-600">Incident</th>
                                    <th className="p-3 text-right font-medium text-gray-600">Payout</th>
                                    <th className="p-3 text-center font-medium text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockTransactionData.map(tx => (
                                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{tx.date}</td>
                                        <td className="p-3 font-mono text-xs">{tx.ticketId}</td>
                                        <td className="p-3">{tx.incidentType}</td>
                                        <td className="p-3 text-right font-medium text-green-600">Rs {tx.payout.toFixed(2)}</td>
                                        <td className="p-3 text-center"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${tx.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{tx.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-right mt-6">
                        <button type="button" className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex">
                            <FaSave />
                            Save Billing Info
                        </button>
                    </div>
                </div>
              )}
              {activeTab === 'documents' && (
                 <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Certifications & Verification</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                            <div className="flex items-center gap-3">
                                <FaShieldAlt className="text-blue-600 text-2xl"/>
                                <div>
                                    <h4 className="font-bold text-blue-900">Government Approval</h4>
                                    <p className="text-sm text-blue-800">Status: Verified</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-50 border-l-4 border-green-400 p-4">
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-600 text-2xl"/>
                                <div>
                                    <h4 className="font-bold text-green-900">Platform Verification</h4>
                                    <p className="text-sm text-green-800">Status: Verified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 mb-6">
                        {mockDocumentData.map(doc => (
                            <div key={doc.id} className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg ${doc.status === 'Expired' ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                                <div>
                                    <p className="font-medium text-gray-900">{doc.name}</p>
                                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                                        <span>Type: {doc.type}</span>
                                        <span>Expires: {doc.expiryDate}</span>
                                        {getStatusBadge(doc.status)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-2 md:mt-0">
                                    {doc.status === 'Expired' && (<button className="text-sm font-semibold text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600">Renew</button>)}
                                    <button className="text-gray-500 hover:text-red-600"><FaTrash /></button>
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
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
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
