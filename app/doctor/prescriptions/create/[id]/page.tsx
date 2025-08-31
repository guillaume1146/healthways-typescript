'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  FaUser, 
  FaPills, 
  FaClipboardCheck, 
  FaSignature,
  FaFilePdf,
  FaPlus,
  FaTrash,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaClock,
  FaCalendarAlt,
  FaNotesMedical,
  FaEnvelope
} from 'react-icons/fa'

// TypeScript Interfaces
interface Patient {
  id: string
  name: string
  age: number
  gender: string
  email: string
  phone: string
  medicalHistory: string[]
  allergies: string[]
}

interface Medicine {
  id: string
  name: string
  dosage: string
  unit: 'mg' | 'ml' | 'tablets' | 'capsules' | 'drops'
  frequency: string
  duration: string
  quantity: number
  instructions: string
  beforeFood: boolean
}

interface Prescription {
  id: string
  patientId: string
  doctorId: string
  medicines: Medicine[]
  diagnosis: string
  additionalNotes: string
  nextVisit?: string
  createdAt: Date
  validUntil: Date
}

interface DoctorInfo {
  id: string
  name: string
  specialization: string
  registrationNumber: string
  email: string
  phone: string
  clinicName: string
  clinicAddress: string
  signature: string // Base64 encoded signature
}

// Mock medicine database for autocomplete
const medicineDatabase = [
  'Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Metformin', 'Omeprazole',
  'Atorvastatin', 'Levothyroxine', 'Amlodipine', 'Metoprolol', 'Losartan',
  'Lisinopril', 'Albuterol', 'Gabapentin', 'Sertraline', 'Simvastatin'
]

const PrescriptionCreatePage = () => {
  const params = useParams()
  const router = useRouter()
  const patientId = params?.patientId as string

  // State Management
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  
  // Patient and Doctor Data
  const [patient, setPatient] = useState<Patient | null>(null)
  const [doctor] = useState<DoctorInfo>({
    id: 'doc123',
    name: 'Dr. Sarah Johnson',
    specialization: 'General Medicine',
    registrationNumber: 'MED-2024-001',
    email: 'dr.johnson@healthways.com',
    phone: '+230 5123 4567',
    clinicName: 'HealthWays Medical Center',
    clinicAddress: 'Port Louis, Mauritius',
    signature: 'base64_signature_here'
  })

  // Prescription Data
  const [prescription, setPrescription] = useState<Prescription>({
    id: '',
    patientId: patientId,
    doctorId: doctor.id,
    medicines: [],
    diagnosis: '',
    additionalNotes: '',
    nextVisit: '',
    createdAt: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days validity
  })

  // Current Medicine Being Added
  const [currentMedicine, setCurrentMedicine] = useState<Medicine>({
    id: '',
    name: '',
    dosage: '',
    unit: 'mg',
    frequency: 'Once daily',
    duration: '7 days',
    quantity: 1,
    instructions: '',
    beforeFood: false
  })

  // Load Patient Data
  useEffect(() => {
    // Simulated patient data fetch
    setPatient({
      id: patientId,
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      email: 'john.doe@email.com',
      phone: '+230 5987 6543',
      medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
      allergies: ['Penicillin']
    })
  }, [patientId])

  // Stepper Configuration
  const steps = [
    { id: 1, title: 'Patient Info', icon: FaUser },
    { id: 2, title: 'Add Medicines', icon: FaPills },
    { id: 3, title: 'Review', icon: FaClipboardCheck },
    { id: 4, title: 'E-Signature', icon: FaSignature },
    { id: 5, title: 'Complete', icon: FaFilePdf }
  ]

  // Medicine Management Functions
  const addMedicine = () => {
    if (currentMedicine.name && currentMedicine.dosage) {
      const newMedicine: Medicine = {
        ...currentMedicine,
        id: Date.now().toString()
      }
      setPrescription({
        ...prescription,
        medicines: [...prescription.medicines, newMedicine]
      })
      // Reset current medicine
      setCurrentMedicine({
        id: '',
        name: '',
        dosage: '',
        unit: 'mg',
        frequency: 'Once daily',
        duration: '7 days',
        quantity: 1,
        instructions: '',
        beforeFood: false
      })
      setSearchTerm('')
    }
  }

  const removeMedicine = (id: string) => {
    setPrescription({
      ...prescription,
      medicines: prescription.medicines.filter(m => m.id !== id)
    })
  }

  // PDF Generation and Email
  const generateAndSendPrescription = async () => {
    setIsLoading(true)
    
    // Simulate PDF generation and email sending
    setTimeout(() => {
      console.log('Generating PDF...')
      console.log('Applying e-signature...')
      console.log('Sending email to patient...')
      console.log('Prescription saved to records')
      
      setIsLoading(false)
      setCurrentStep(5)
    }, 2000)
  }

  // Navigation Functions
  const handleNext = () => {
    if (currentStep === 4) {
      generateAndSendPrescription()
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Filtered medicines for autocomplete
  const filteredMedicines = medicineDatabase.filter(med =>
    med.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Prescription</h1>
          <p className="text-gray-600">Generate a digital prescription with e-signature</p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  currentStep >= step.id ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= step.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                  }`}>
                    <step.icon className="text-xl" />
                  </div>
                  <span className="text-sm font-medium hidden md:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-24 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step 1: Patient Information */}
          {currentStep === 1 && patient && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{patient.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{patient.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{patient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{patient.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-4">Medical History</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Conditions:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {patient.medicalHistory.map((condition, index) => (
                          <span key={index} className="px-3 py-1 bg-white rounded-full text-sm">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Allergies:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {patient.allergies.map((allergy, index) => (
                          <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-700 mb-2">Diagnosis</label>
                <textarea
                  value={prescription.diagnosis}
                  onChange={(e) => setPrescription({...prescription, diagnosis: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Enter diagnosis..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Add Medicines */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Medicines</h2>
              
              {/* Medicine Input Form */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="block text-gray-700 mb-2">Medicine Name</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentMedicine({...currentMedicine, name: e.target.value})
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Search medicine..."
                    />
                    {showSuggestions && searchTerm && (
                      <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                        {filteredMedicines.map((med, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setCurrentMedicine({...currentMedicine, name: med})
                              setSearchTerm(med)
                              setShowSuggestions(false)
                            }}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                          >
                            {med}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Dosage</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentMedicine.dosage}
                        onChange={(e) => setCurrentMedicine({...currentMedicine, dosage: e.target.value})}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Amount"
                      />
                      <select
                        value={currentMedicine.unit}
                        onChange={(e) => setCurrentMedicine({...currentMedicine, unit: e.target.value as Medicine['unit']})}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="mg">mg</option>
                        <option value="ml">ml</option>
                        <option value="tablets">tablets</option>
                        <option value="capsules">capsules</option>
                        <option value="drops">drops</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Frequency</label>
                    <select
                      value={currentMedicine.frequency}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, frequency: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option>Once daily</option>
                      <option>Twice daily</option>
                      <option>Three times daily</option>
                      <option>Four times daily</option>
                      <option>Every 6 hours</option>
                      <option>Every 8 hours</option>
                      <option>Every 12 hours</option>
                      <option>As needed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Duration</label>
                    <select
                      value={currentMedicine.duration}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, duration: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option>3 days</option>
                      <option>5 days</option>
                      <option>7 days</option>
                      <option>10 days</option>
                      <option>14 days</option>
                      <option>21 days</option>
                      <option>30 days</option>
                      <option>As directed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={currentMedicine.quantity}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, quantity: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Food Instructions</label>
                    <select
                      value={currentMedicine.beforeFood ? 'before' : 'after'}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, beforeFood: e.target.value === 'before'})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="after">After food</option>
                      <option value="before">Before food</option>
                      <option value="with">With food</option>
                      <option value="any">Any time</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Special Instructions</label>
                    <input
                      type="text"
                      value={currentMedicine.instructions}
                      onChange={(e) => setCurrentMedicine({...currentMedicine, instructions: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Additional instructions..."
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={addMedicine}
                      className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <FaPlus />
                      Add Medicine
                    </button>
                  </div>
                </div>
              </div>

              {/* Added Medicines List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Prescribed Medicines ({prescription.medicines.length})</h3>
                {prescription.medicines.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No medicines added yet. Add medicines using the form above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prescription.medicines.map((medicine) => (
                      <div key={medicine.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                              <span>📊 {medicine.dosage} {medicine.unit}</span>
                              <span>⏰ {medicine.frequency}</span>
                              <span>📅 {medicine.duration}</span>
                              <span>💊 Qty: {medicine.quantity}</span>
                            </div>
                            {medicine.instructions && (
                              <p className="mt-2 text-sm text-gray-600">
                                📝 {medicine.instructions}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeMedicine(medicine.id)}
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={prescription.additionalNotes}
                  onChange={(e) => setPrescription({...prescription, additionalNotes: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Any additional instructions or notes..."
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Next Visit Date (Optional)</label>
                <input
                  type="date"
                  value={prescription.nextVisit}
                  onChange={(e) => setPrescription({...prescription, nextVisit: e.target.value})}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && patient && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Prescription</h2>
              
              {/* Prescription Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8 rounded-xl">
                {/* Header */}
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
                  <h3 className="text-2xl font-bold text-blue-500">{doctor.clinicName}</h3>
                  <p className="text-gray-600 mt-2">{doctor.clinicAddress}</p>
                  <p className="text-gray-600">Tel: {doctor.phone} | Email: {doctor.email}</p>
                </div>

                {/* Doctor & Patient Info */}
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Doctor Information</h4>
                    <p className="text-gray-600">{doctor.name}</p>
                    <p className="text-gray-600">{doctor.specialization}</p>
                    <p className="text-gray-600">Reg No: {doctor.registrationNumber}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Patient Information</h4>
                    <p className="text-gray-600">{patient.name}</p>
                    <p className="text-gray-600">Age: {patient.age} | Gender: {patient.gender}</p>
                    <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Diagnosis</h4>
                  <p className="text-gray-600">{prescription.diagnosis || 'Not specified'}</p>
                </div>

                {/* Medicines */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Prescription (Rx)</h4>
                  <div className="space-y-3">
                    {prescription.medicines.map((medicine, index) => (
                      <div key={medicine.id} className="bg-white p-4 rounded-lg">
                        <div className="flex items-start">
                          <span className="font-semibold mr-3">{index + 1}.</span>
                          <div className="flex-1">
                            <p className="font-semibold">{medicine.name}</p>
                            <p className="text-gray-600 text-sm">
                              {medicine.dosage} {medicine.unit} - {medicine.frequency} - {medicine.duration}
                            </p>
                            {medicine.instructions && (
                              <p className="text-gray-600 text-sm mt-1">{medicine.instructions}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                {prescription.additionalNotes && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Additional Notes</h4>
                    <p className="text-gray-600">{prescription.additionalNotes}</p>
                  </div>
                )}

                {/* Next Visit */}
                {prescription.nextVisit && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Next Visit</h4>
                    <p className="text-gray-600">{new Date(prescription.nextVisit).toLocaleDateString()}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 pt-6 border-t-2 border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    This prescription is valid for 30 days from the date of issue
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: E-Signature */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply E-Signature</h2>
              
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8 rounded-xl text-center">
                  <FaSignature className="text-6xl text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Digital Signature Verification</h3>
                  <p className="text-gray-600 mb-6">
                    By proceeding, you confirm that all the information in this prescription is accurate 
                    and you authorize the application of your digital signature.
                  </p>
                  
                  <div className="bg-white p-6 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-semibold">{doctor.name}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600">Registration No:</span>
                      <span className="font-semibold">{doctor.registrationNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-semibold">{new Date().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="confirm"
                      className="mt-1"
                      required
                    />
                    <label htmlFor="confirm" className="text-left text-sm text-gray-600">
                      I confirm that I have reviewed the prescription and all information is correct. 
                      I authorize the application of my digital signature and understand that this 
                      prescription will be sent to the patient via email.
                    </label>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Once signed, this prescription will be automatically:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 text-left list-disc list-inside">
                      <li>Generated as a PDF document</li>
                      <li>Sent to patient email: {patient?.email}</li>
                      <li>Stored in patient medical records</li>
                      <li>Available for pharmacy verification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheck className="text-5xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Prescription Created Successfully!</h2>
                  <p className="text-gray-600 text-lg">
                    The prescription has been generated and sent to the patient.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8 rounded-xl mb-8">
                  <h3 className="text-xl font-semibold mb-6">Summary</h3>
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <FaCheck className="text-green-500" />
                      <span>Prescription ID: #RX{Date.now()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaCheck className="text-green-500" />
                      <span>PDF generated with e-signature</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaCheck className="text-green-500" />
                      <span>Email sent to: {patient?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaCheck className="text-green-500" />
                      <span>Saved to patient medical records</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaCheck className="text-green-500" />
                      <span>Available for pharmacy verification</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push(`/doctor/patients/${patientId}`)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    View Patient Profile
                  </button>
                  <button
                    onClick={() => router.push('/doctor/prescriptions')}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    View All Prescriptions
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaPlus />
                    Create New Prescription
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || currentStep === 5}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                currentStep === 1 || currentStep === 5
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <FaArrowLeft />
              Back
            </button>

            <div className="flex gap-4">
              {currentStep === 5 ? (
                <button
                  onClick={() => {
                    window.print()
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaFilePdf />
                  Download PDF
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !prescription.diagnosis) ||
                    (currentStep === 2 && prescription.medicines.length === 0) ||
                    isLoading
                  }
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                    ((currentStep === 1 && !prescription.diagnosis) ||
                    (currentStep === 2 && prescription.medicines.length === 0) ||
                    isLoading)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {currentStep === 4 ? (
                    isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaSignature />
                        Sign & Send
                      </>
                    )
                  ) : (
                    <>
                      Next
                      <FaArrowRight />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaFilePdf className="text-blue-500 text-xl" />
              </div>
              <h3 className="font-semibold">PDF Generation</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Prescriptions are automatically converted to PDF format with your digital signature embedded.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaEnvelope className="text-green-500 text-xl" />
              </div>
              <h3 className="font-semibold">Email Delivery</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Patients receive their prescriptions instantly via email for convenience and record-keeping.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <FaNotesMedical className="text-teal-500 text-xl" />
              </div>
              <h3 className="font-semibold">Digital Records</h3>
            </div>
            <p className="text-gray-600 text-sm">
              All prescriptions are securely stored and can be accessed by authorized pharmacies.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionCreatePage