'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {  FaCreditCard, FaFileUpload, FaSave, FaTrash, FaTruck , 
    FaCheckCircle, FaToggleOn, FaToggleOff,  
    FaUniversity,  FaClock,  FaStore, FaUserMd
} from 'react-icons/fa'
import { IconType } from 'react-icons'

// --- TYPE DEFINITIONS ---
type ActiveTab = 'profile' | 'availability' | 'payments' | 'documents'

interface PharmacyProfileSettings {
    name: string
    licenseNumber: string
    phone: string
    email: string
    address: string
    pharmacists: { id: string, name: string, registration: string }[]
}

interface AvailabilitySettings {
    storeHours: {
        [day: string]: { open: string, close: string, isClosed: boolean }
    }
    deliveryAvailable: boolean
}

// --- MOCK DATA ---
const mockProfileData: PharmacyProfileSettings = {
    name: "HealthFirst Pharmacy",
    licenseNumber: "PHARM-2023-0123",
    phone: "+230 212 3456",
    email: "contact@healthfirst.mu",
    address: "123 Royal Street, Port Louis, Mauritius",
    pharmacists: [
        { id: 'p1', name: 'Mr. Jean Dupont', registration: 'RP-0456' },
        { id: 'p2', name: 'Mrs. Priya Sharma', registration: 'RP-0789' },
    ]
}

const mockAvailabilityData: AvailabilitySettings = {
    storeHours: {
        Monday: { open: "08:00", close: "20:00", isClosed: false },
        Tuesday: { open: "08:00", close: "20:00", isClosed: false },
        Wednesday: { open: "08:00", close: "20:00", isClosed: false },
        Thursday: { open: "08:00", close: "20:00", isClosed: false },
        Friday: { open: "08:00", close: "20:00", isClosed: false },
        Saturday: { open: "09:00", close: "18:00", isClosed: false },
        Sunday: { open: "09:00", close: "13:00", isClosed: true },
    },
    deliveryAvailable: true,
}

// Reusable components (omitted for brevity)
const TabButton = ({ icon: Icon, label, tabName, activeTab, setActiveTab }: { icon: IconType, label: string, tabName: ActiveTab, activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void }) => (
  <button onClick={() => setActiveTab(tabName)} className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tabName ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}><Icon className="mr-3 text-lg" />{label}</button>
);

// --- MAIN CLIENT COMPONENT ---
export default function SettingsClient() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as ActiveTab | null;
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'profile');
  const [profile, setProfile] = useState<PharmacyProfileSettings>(mockProfileData);
  const [availability, setAvailability] = useState<AvailabilitySettings>(mockAvailabilityData);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePharmacistChange = (index: number, field: 'name' | 'registration', value: string) => {
    const updatedPharmacists = [...profile.pharmacists];
    updatedPharmacists[index] = { ...updatedPharmacists[index], [field]: value };
    setProfile({ ...profile, pharmacists: updatedPharmacists });
  };

  const addPharmacist = () => {
    setProfile({
        ...profile,
        pharmacists: [
            ...profile.pharmacists,
            { id: `p${Date.now()}`, name: '', registration: '' }
        ]
    });
  };

  const removePharmacist = (id: string) => {
    setProfile({
        ...profile,
        pharmacists: profile.pharmacists.filter(p => p.id !== id)
    });
  };

  const handleStoreHoursChange = (day: string, field: 'open' | 'close' | 'isClosed', value: string | boolean) => {
    setAvailability(prev => ({
        ...prev,
        storeHours: {
            ...prev.storeHours,
            [day]: { ...prev.storeHours[day], [field]: value }
        }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pharmacy Settings</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              <TabButton icon={FaStore} label="Business Profile" tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaClock} label="Store Hours" tabName="availability" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCreditCard} label="Payments" tabName="payments" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaFileUpload} label="Licenses" tabName="documents" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </aside>
          <main className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              {activeTab === 'profile' && (
                <form className="space-y-8">
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Pharmacy Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Pharmacy Name</label><input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" /></div>
                            <div><label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">License Number</label><input type="text" id="licenseNumber" name="licenseNumber" value={profile.licenseNumber} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" /></div>
                            <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700">Public Phone</label><input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" /></div>
                            <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Public Email</label><input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" /></div>
                            <div className="md:col-span-2"><label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label><textarea id="address" name="address" value={profile.address} onChange={handleProfileChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></textarea></div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Registered Pharmacists</h2>
                        <div className="space-y-3">
                            {profile.pharmacists.map((p, index) => (
                                <div key={p.id} className="flex items-center gap-3 p-2 border rounded-md">
                                    <FaUserMd className="text-gray-400" />
                                    <input type="text" value={p.name} placeholder="Pharmacist Name" onChange={(e) => handlePharmacistChange(index, 'name', e.target.value)} className="flex-1 border-0 focus:ring-0 bg-transparent" />
                                    <input type="text" value={p.registration} placeholder="Registration No." onChange={(e) => handlePharmacistChange(index, 'registration', e.target.value)} className="w-32 border-0 focus:ring-0 bg-transparent" />
                                    <button type="button" onClick={() => removePharmacist(p.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addPharmacist} className="text-sm text-green-600 font-semibold mt-3 hover:underline">+ Add Pharmacist</button>
                    </div>
                    <div className="text-right pt-6 mt-6 border-t"><button type="button" className="bg-gradient-to-r from-green-600 to-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex"><FaSave />Save Profile</button></div>
                </form>
              )}
              {activeTab === 'availability' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Store & Delivery Hours</h2>
                  <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700 flex items-center gap-2"><FaTruck /> Delivery Service</label>
                        <button type="button" onClick={() => setAvailability(p => ({...p, deliveryAvailable: !p.deliveryAvailable}))}>{availability.deliveryAvailable ? <FaToggleOn className="text-3xl text-green-500" /> : <FaToggleOff className="text-3xl text-gray-400" />}</button>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-4">Weekly Store Hours</h3>
                  <div className="space-y-4">
                      {Object.entries(availability.storeHours).map(([day, hours]) => (
                          <div key={day} className={`grid grid-cols-4 items-center gap-4 p-3 rounded-lg ${hours.isClosed ? 'bg-gray-100' : ''}`}>
                              <span className={`font-semibold ${hours.isClosed ? 'text-gray-400' : 'text-gray-800'}`}>{day}</span>
                              <input type="time" value={hours.open} onChange={(e) => handleStoreHoursChange(day, 'open', e.target.value)} disabled={hours.isClosed} className="border-gray-300 rounded-md shadow-sm disabled:bg-gray-200" />
                              <input type="time" value={hours.close} onChange={(e) => handleStoreHoursChange(day, 'close', e.target.value)} disabled={hours.isClosed} className="border-gray-300 rounded-md shadow-sm disabled:bg-gray-200" />
                              <label className="flex items-center gap-2 justify-self-end"><input type="checkbox" checked={hours.isClosed} onChange={(e) => handleStoreHoursChange(day, 'isClosed', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" /> Closed</label>
                          </div>
                      ))}
                  </div>
                  <div className="text-right mt-6"><button type="button" className="bg-gradient-to-r from-green-600 to-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex"><FaSave />Save Hours</button></div>
                </div>
              )}
              {activeTab === 'payments' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Configuration</h2>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6"><div className="flex justify-between items-center"><div><h3 className="font-bold text-blue-900 mb-1 flex items-center gap-2"><FaUniversity /> Payout Account</h3><p className="text-sm text-blue-800">Receiving funds at: •••• •••• 5678 (MCB)</p></div><button className="text-sm font-medium text-green-600 hover:underline">Configure</button></div></div>
                    <div className="mb-6"><h3 className="font-bold text-gray-800 mb-4">Accepted Payment Methods</h3><div className="p-4 border rounded-lg space-y-3 bg-gray-50"><label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="h-5 w-5 rounded text-green-600" /><span>Credit / Debit Card</span></label><label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="h-5 w-5 rounded text-green-600" /><span>MCB Juice</span></label><label className="flex items-center gap-3"><input type="checkbox" className="h-5 w-5 rounded text-green-600" /><span>Insurance Billing</span></label></div></div>
                    <div className="text-right mt-6"><button type="button" className="bg-gradient-to-r from-green-600 to-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex"><FaSave />Save Payment Settings</button></div>
                </div>
              )}
              {activeTab === 'documents' && (
                 <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Licenses & Verification</h2>
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6"><div className="flex items-center gap-3"><FaCheckCircle className="text-green-600 text-2xl"/><div><h4 className="font-bold text-green-900">Platform Verification: Complete</h4><p className="text-sm text-green-800">Your pharmacy is a verified partner on our platform.</p></div></div></div>
                    <div className="space-y-4 mb-6">{[{id: 'd1', name: 'Pharmacy-Operating-License-2025.pdf', type: 'License', status: 'Verified', expiryDate: '2026-01-01'}, {id: 'd2', name: 'Pharmacist-Cert-JDupont.pdf', type: 'Certification', status: 'Verified', expiryDate: '2027-09-01'}].map(doc => (<div key={doc.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-gray-50"><div><p className="font-medium text-gray-900">{doc.name}</p><div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1"><span>Type: {doc.type}</span><span>Expires: {doc.expiryDate}</span><span className="flex items-center gap-1 text-green-600 font-medium"><FaCheckCircle/> Verified</span></div></div><div className="flex items-center gap-4 mt-2 md:mt-0"><button className="text-gray-500 hover:text-red-600"><FaTrash /></button></div></div>))}</div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Upload New Document</label><div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"><div className="space-y-1 text-center"><FaFileUpload className="mx-auto h-12 w-12 text-gray-400" /><div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"><span>Click to upload</span><input id="file-upload" name="file-upload" type="file" className="sr-only"/></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p></div></div></div>
                 </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
