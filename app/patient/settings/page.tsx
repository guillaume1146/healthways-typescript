'use client'

import React, { Suspense, useState, useCallback } from 'react'

type ActiveTab = 'profile' | 'security' | 'notifications' | 'payment' | 'subscription' | 'documents'

interface PatientProfileSettings {
    name: string
    email: string
    phone: string
    dob: string
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say'
    address: string
    emergencyContact: {
        name: string
        phone: string
        relationship: string
    }
}

interface PaymentMethod {
    id: string
    type: 'Visa' | 'Mastercard' | 'MCB Juice'
    details: string
    isPrimary: boolean
}

interface NotificationSettings {
    appointmentReminders: boolean
    prescriptionRefills: boolean
    labResults: boolean
    healthTips: boolean
    promotions: boolean
}

interface SubscriptionPlan {
    id: string
    name: string
    price: number
    features: string[]
    period: 'monthly' | 'yearly'
    isCurrent: boolean
}

interface UploadedFile {
    file: File
    progress: number
}

// --- MOCK DATA ---

const mockProfileData: PatientProfileSettings = {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+230 5123 4567",
    dob: "1989-05-15",
    gender: "Male",
    address: "456 Royal Road, Curepipe, Mauritius",
    emergencyContact: {
        name: "Jane Smith",
        phone: "+230 5765 4321",
        relationship: "Spouse",
    },
}

const mockPaymentMethods: PaymentMethod[] = [
    { id: 'pm1', type: 'Visa', details: 'ending in 4242', isPrimary: true },
    { id: 'pm2', type: 'MCB Juice', details: 'linked to +230 5123 4567', isPrimary: false },
]

const mockNotificationSettings: NotificationSettings = {
    appointmentReminders: true,
    prescriptionRefills: true,
    labResults: true,
    healthTips: false,
    promotions: false,
}

const mockSubscriptionPlans: SubscriptionPlan[] = [
    {
        id: 'basic', name: 'Basic Health', price: 999, period: 'monthly', isCurrent: false,
        features: ['2 Doctor Consultations', 'Basic Health Checkup', 'Email Support']
    },
    {
        id: 'premium', name: 'Premium Care', price: 2499, period: 'monthly', isCurrent: true,
        features: ['Unlimited Consultations', 'Full Body Checkup', 'Priority Support', 'Dietitian Session']
    },
    {
        id: 'corporate', name: 'Corporate Wellness', price: 0, period: 'yearly', isCurrent: false,
        features: ['Covered by Employer', 'Annual Health Screening', 'Wellness Workshops']
    }
]


// --- REUSABLE COMPONENTS ---

interface TabButtonProps {
    iconClass: string
    label: string
    tabName: ActiveTab
    activeTab: ActiveTab
    setActiveTab: (tab: ActiveTab) => void
}

const TabButton = ({ iconClass, label, tabName, activeTab, setActiveTab }: TabButtonProps) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
      activeTab === tabName
        ? 'bg-gradient-to-r from-primary-blue to-secondary-purple text-black shadow-md'
        : 'text-black hover:bg-gray-100'
    }`}
  >
    <i className={`fas ${iconClass} mr-3 text-lg w-6 text-center`}></i>
    {label}
  </button>
)

const FormInput = ({ 
    label, name, value, onChange, type = 'text', placeholder = '', iconClass, required = false 
}: { 
    label: string, name: string, value: string | number, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string, placeholder?: string, iconClass?: string, required?: boolean
}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative mt-1">
            {iconClass && <i className={`fas ${iconClass} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400`}></i>}
            <input
                type={type} id={name} name={name} value={value}
                onChange={onChange} placeholder={placeholder} required={required}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue ${iconClass ? 'pl-10' : ''}`}
            />
        </div>
    </div>
)

interface FileUploadProps {
    title: string;
    description: string;
    required: boolean;
    acceptedFormats: string;
    onFileUpload: (file: File) => void;
    fileName?: string;
}

const FileUpload = ({ title, description, required, acceptedFormats, onFileUpload, fileName }: FileUploadProps) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileUpload(event.target.files[0]);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800">{title} {required && <span className="text-red-500">*</span>}</h4>
            <p className="text-sm text-gray-500 mb-2">{description}</p>
            <label className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer block hover:border-primary-blue hover:bg-blue-50">
                <input type="file" className="sr-only" onChange={handleFileChange} />
                <i className="fas fa-upload mx-auto text-gray-400 text-2xl mb-2"></i>
                {fileName ? (
                    <p className="text-sm text-green-600 font-semibold">{fileName}</p>
                ) : (
                    <p className="text-sm text-gray-600">Drag & drop, or click to browse</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Accepted: {acceptedFormats}</p>
            </label>
        </div>
    )
}

interface SubscriptionPlanCardProps {
    plan: SubscriptionPlan;
    onSelect: (id: string) => void;
    isSelected: boolean;
}

const SubscriptionPlanCard = ({ plan, onSelect, isSelected }: SubscriptionPlanCardProps) => (
    <div className={`border rounded-lg p-6 text-center transition-all ${isSelected ? 'border-primary-blue ring-2 ring-primary-blue' : 'hover:shadow-lg'}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-3xl font-bold mb-4">
            {plan.price > 0 ? `Rs ${plan.price}` : 'Free'}
            <span className="text-base font-normal text-gray-500">/{plan.period}</span>
        </p>
        <ul className="space-y-2 text-gray-600 mb-6">
            {plan.features.map(feature => (
                <li key={feature} className="flex items-center justify-center gap-2">
                    <i className="fas fa-check-circle text-green-500"></i> {feature}
                </li>
            ))}
        </ul>
        <button 
            onClick={() => onSelect(plan.id)}
            className={`w-full py-2 rounded-lg font-semibold ${isSelected ? 'bg-primary-blue text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
            {isSelected ? 'Current Plan' : 'Choose Plan'}
        </button>
    </div>
)

// --- MAIN CLIENT COMPONENT ---

function PatientSettingsPageClient() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile')
    const [profile, setProfile] = useState<PatientProfileSettings>(mockProfileData)
    const [notifications, setNotifications] = useState<NotificationSettings>(mockNotificationSettings)
    const [currentPlanId, setCurrentPlanId] = useState('premium')
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: UploadedFile }>({})

    const handleFileUpload = (fileType: string) => (file: File) => {
        setUploadedFiles(prev => ({ ...prev, [fileType]: { file, progress: 100 } }));
    };
    
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    }

    const handleNotificationToggle = (key: keyof NotificationSettings) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-1/4">
                        <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
                            <TabButton iconClass="fa-user-edit" label="Profile" tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton iconClass="fa-shield-alt" label="Security" tabName="security" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton iconClass="fa-credit-card" label="Billing & Payments" tabName="payment" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton iconClass="fa-crown" label="Subscription" tabName="subscription" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton iconClass="fa-bell" label="Notifications" tabName="notifications" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton iconClass="fa-file-pdf" label="Documents" tabName="documents" activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>
                    </aside>

                    {/* Content Area */}
                    <main className="w-full md:w-3/4">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            {activeTab === 'profile' && (
                                <form className="space-y-8">
                                    <div className="pb-6 border-b">
                                        <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Management</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput label="Full Name" name="name" value={profile.name} onChange={handleProfileChange} iconClass="fa-user" required />
                                            <FormInput label="Email Address" name="email" value={profile.email} onChange={handleProfileChange} type="email" iconClass="fa-envelope" required />
                                            <FormInput label="Phone Number" name="phone" value={profile.phone} onChange={handleProfileChange} iconClass="fa-phone" required />
                                            <FormInput label="Date of Birth" name="dob" value={profile.dob} onChange={handleProfileChange} type="date" iconClass="fa-birthday-cake" required />
                                            <div>
                                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                                                <select id="gender" name="gender" value={profile.gender} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue">
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                    <option>Prefer not to say</option>
                                                </select>
                                            </div>
                                            <FormInput label="Full Address" name="address" value={profile.address} onChange={handleProfileChange} iconClass="fa-map-marker-alt" required />
                                        </div>
                                    </div>
                                    <div className="pb-6 border-b">
                                        <h2 className="text-xl font-bold text-gray-800 mb-4">Emergency Contact Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <FormInput label="Contact Name" name="emergencyName" value={profile.emergencyContact.name} onChange={() => {}} />
                                            <FormInput label="Contact Phone" name="emergencyPhone" value={profile.emergencyContact.phone} onChange={() => {}} />
                                            <FormInput label="Relationship" name="emergencyRelationship" value={profile.emergencyContact.relationship} onChange={() => {}} />
                                        </div>
                                    </div>
                                    <div className="text-right pt-6">
                                        <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 inline-flex"><i className="fas fa-save"></i> Save Changes</button>
                                    </div>
                                </form>
                            )}
                            {activeTab === 'security' && (
                                <div className="space-y-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Password Settings</h2>
                                    <FormInput label="Current Password" name="currentPassword" value="" onChange={() => {}} type="password" iconClass="fa-lock" required />
                                    <FormInput label="New Password" name="newPassword" value="" onChange={() => {}} type="password" iconClass="fa-lock" required />
                                    <FormInput label="Confirm New Password" name="confirmPassword" value="" onChange={() => {}} type="password" iconClass="fa-lock" required />
                                </div>
                            )}
                            {activeTab === 'payment' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Billing & Payments</h2>
                                    <div className="border rounded-lg p-6 mb-6">
                                        <h3 className="font-bold text-gray-800 mb-4">MCB Juice Integration</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src="https://www.mcb.mu/images/mcb-juice-logo.png" alt="MCB Juice" className="h-10" />
                                                <div>
                                                    <p className="font-medium text-gray-800">MCB Juice</p>
                                                    <p className="text-sm text-gray-600">Enable instant payments</p>
                                                </div>
                                            </div>
                                            <i className="fas fa-toggle-on text-4xl text-green-500"></i>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'subscription' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Subscription Management</h2>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {mockSubscriptionPlans.map(plan => (
                                            <SubscriptionPlanCard key={plan.id} plan={plan} onSelect={setCurrentPlanId} isSelected={currentPlanId === plan.id} />
                                        ))}
                                    </div>
                                </div>
                            )}
                             {activeTab === 'notifications' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
                                    <div className="space-y-4">
                                        {Object.entries({
                                            appointmentReminders: "Appointment Reminders",
                                            prescriptionRefills: "Prescription Refill Alerts",
                                            labResults: "Lab Results Ready",
                                            healthTips: "Weekly Health Tips",
                                            promotions: "Promotions & Offers"
                                        }).map(([key, label]) => (
                                            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                                                <p className="font-medium text-gray-800">{label}</p>
                                                <button type="button" onClick={() => handleNotificationToggle(key as keyof NotificationSettings)}>
                                                    {notifications[key as keyof NotificationSettings] ? (
                                                        <i className="fas fa-toggle-on text-3xl text-green-500"></i>
                                                    ) : (
                                                        <i className="fas fa-toggle-off text-3xl text-gray-400"></i>
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-right pt-6 mt-6 border-t">
                                        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 inline-flex">
                                            <i className="fas fa-save"></i> Save Preferences
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'documents' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Upload</h2>
                                    <p className="text-gray-600 mb-6">Please upload the required documents for verification.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FileUpload title="National ID/Passport" description="Valid government-issued identification" required={true} acceptedFormats=".pdf, .jpg, .png" onFileUpload={handleFileUpload('nationalId')} fileName={uploadedFiles.nationalId?.file.name} />
                                        <FileUpload title="Proof of Address" description="Utility bill or rental contract" required={true} acceptedFormats=".pdf, .jpg, .png" onFileUpload={handleFileUpload('proofOfAddress')} fileName={uploadedFiles.proofOfAddress?.file.name} />
                                        <FileUpload title="Health Insurance Card" description="If insured" required={false} acceptedFormats=".pdf, .jpg, .png" onFileUpload={handleFileUpload('insuranceCard')} fileName={uploadedFiles.insuranceCard?.file.name} />
                                        <FileUpload title="Medical History Document" description="Vaccination card or chronic illness file" required={false} acceptedFormats=".pdf, .jpg, .png" onFileUpload={handleFileUpload('medicalHistory')} fileName={uploadedFiles.medicalHistory?.file.name} />
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="font-semibold">Upload Progress</h3>
                                        <p>Required Documents: {Object.keys(uploadedFiles).filter(k => ['nationalId', 'proofOfAddress'].includes(k)).length} / 2</p>
                                        <p>Optional Documents: {Object.keys(uploadedFiles).filter(k => ['insuranceCard', 'medicalHistory'].includes(k)).length} / 2</p>
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

function SettingsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
        <p className="mt-4 text-gray-600">Loading your settings...</p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <PatientSettingsPageClient />
    </Suspense>
  )
}
