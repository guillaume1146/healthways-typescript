import React, { useState } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaFlask, 
  FaDownload, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaPlus,
  FaFileDownload,
  FaHome,
  FaHospital,
  FaTint,
  FaHeartbeat,
  FaDna,
  FaMicroscope,
  FaUserMd,
  FaShoppingCart,
  FaStar,
  FaStethoscope,
  FaEye,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaAward,
  FaPercent,
  FaCertificate,
  FaPhone,
  FaEnvelope,
  FaShieldAlt,
  FaRocket,
  FaLightbulb,
  FaHardHat
} from 'react-icons/fa'

interface Props {
  patientData: Patient
}

interface LabTest {
  id: string
  name: string
  category: string
  price: number
  duration: string
  preparation: string
  description: string
  popular: boolean
  discount?: number
  requirements: string[]
  sampleType: string
  methodology: string
  accuracy: number
}

interface HealthPackage {
  id: string
  name: string
  description: string
  originalPrice: number
  discountedPrice: number
  discount: number
  tests: string[]
  duration: string
  popular: boolean
  recommended: boolean
  category: 'basic' | 'comprehensive' | 'premium' | 'specialized'
  targetAudience: string[]
  benefits: string[]
}

interface BookingSlot {
  date: string
  time: string
  available: boolean
  price?: number
  type: 'regular' | 'express' | 'priority'
}

interface LabPartner {
  id: string
  name: string
  address: string
  phone: string
  email: string
  rating: number
  certifications: string[]
  specialties: string[]
  openHours: string
  facilities: string[]
  services: string[]
  homeCollection: boolean
  emergencyService: boolean
}

const availableTests: LabTest[] = [
  {
    id: 'LT001',
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    price: 500,
    duration: '24 hours',
    preparation: 'No special preparation required',
    description: 'Comprehensive blood analysis measuring red cells, white cells, platelets, and hemoglobin levels',
    popular: true,
    requirements: ['No fasting required', 'Avoid strenuous exercise 24hrs before'],
    sampleType: 'Blood (5ml)',
    methodology: 'Flow Cytometry',
    accuracy: 99.8
  },
  {
    id: 'LT002',
    name: 'Lipid Profile Complete',
    category: 'Biochemistry',
    price: 800,
    duration: '24 hours',
    preparation: '12 hours fasting required',
    description: 'Comprehensive cholesterol analysis including total, LDL, HDL, VLDL, and triglycerides',
    popular: true,
    discount: 15,
    requirements: ['12 hours fasting', 'Avoid alcohol 24hrs before', 'Normal water intake allowed'],
    sampleType: 'Blood (3ml)',
    methodology: 'Enzymatic Colorimetric',
    accuracy: 99.5
  },
  {
    id: 'LT003',
    name: 'HbA1c (Glycated Hemoglobin)',
    category: 'Diabetes',
    price: 600,
    duration: '24 hours',
    preparation: 'No fasting required',
    description: 'Gold standard test for diabetes monitoring - shows average blood sugar over 3 months',
    popular: true,
    requirements: ['No fasting required', 'Can be done any time of day'],
    sampleType: 'Blood (2ml)',
    methodology: 'HPLC',
    accuracy: 99.9
  },
  {
    id: 'LT004',
    name: 'Thyroid Function Test (T3, T4, TSH)',
    category: 'Endocrinology',
    price: 1200,
    duration: '48 hours',
    preparation: 'No special preparation required',
    description: 'Complete thyroid assessment measuring T3, T4, and TSH levels for thyroid disorders',
    popular: true,
    discount: 20,
    requirements: ['Morning sample preferred', 'Avoid biotin supplements 72hrs before'],
    sampleType: 'Blood (3ml)',
    methodology: 'Chemiluminescence',
    accuracy: 99.7
  },
  {
    id: 'LT005',
    name: 'Liver Function Test (LFT)',
    category: 'Biochemistry',
    price: 900,
    duration: '24 hours',
    preparation: 'Fasting for 8-12 hours',
    description: 'Comprehensive liver assessment including ALT, AST, ALP, Bilirubin, and protein levels',
    popular: false,
    requirements: ['8-12 hours fasting', 'Avoid alcohol 48hrs before', 'Avoid fatty foods'],
    sampleType: 'Blood (4ml)',
    methodology: 'Kinetic UV',
    accuracy: 99.6
  },
  {
    id: 'LT006',
    name: 'Kidney Function Test (KFT)',
    category: 'Biochemistry',
    price: 850,
    duration: '24 hours',
    preparation: 'No special preparation required',
    description: 'Complete kidney assessment measuring creatinine, urea, uric acid, and electrolytes',
    popular: false,
    requirements: ['Normal water intake', 'Avoid excessive protein 24hrs before'],
    sampleType: 'Blood (3ml) + Urine',
    methodology: 'Kinetic Jaffe Method',
    accuracy: 99.4
  },
  {
    id: 'LT007',
    name: 'Vitamin D (25-OH) Test',
    category: 'Vitamins',
    price: 1000,
    duration: '48 hours',
    preparation: 'No special preparation required',
    description: 'Measures vitamin D levels for bone health and immune function assessment',
    popular: true,
    discount: 10,
    requirements: ['No special preparation', 'Can be done any time'],
    sampleType: 'Blood (2ml)',
    methodology: 'Chemiluminescence',
    accuracy: 99.3
  },
  {
    id: 'LT008',
    name: 'COVID-19 RT-PCR',
    category: 'Infectious Disease',
    price: 2500,
    duration: '24-48 hours',
    preparation: 'No eating/drinking 30 min before test',
    description: 'Highly accurate molecular test for active COVID-19 infection detection',
    popular: false,
    requirements: ['No food/drink 30min before', 'Avoid nasal medications 2hrs before'],
    sampleType: 'Nasopharyngeal Swab',
    methodology: 'RT-PCR',
    accuracy: 99.9
  },
  {
    id: 'LT009',
    name: 'Cardiac Risk Markers',
    category: 'Cardiology',
    price: 1800,
    duration: '24 hours',
    preparation: '12 hours fasting',
    description: 'Comprehensive cardiac risk assessment including CRP, Homocysteine, and Lipoprotein(a)',
    popular: false,
    discount: 25,
    requirements: ['12 hours fasting', 'Avoid stress before test', 'Normal medications allowed'],
    sampleType: 'Blood (5ml)',
    methodology: 'Turbidimetric/Nephelometric',
    accuracy: 99.2
  },
  {
    id: 'LT010',
    name: 'Cancer Marker Panel (Basic)',
    category: 'Oncology',
    price: 3500,
    duration: '72 hours',
    preparation: 'No special preparation',
    description: 'Basic cancer screening panel including CEA, AFP, CA 19-9, and PSA (for men)',
    popular: false,
    requirements: ['No special preparation', 'Inform about medications'],
    sampleType: 'Blood (6ml)',
    methodology: 'Chemiluminescence',
    accuracy: 98.8
  }
]

const healthPackages: HealthPackage[] = [
  {
    id: 'PKG001',
    name: 'Basic Health Checkup',
    description: 'Essential health screening for general wellness monitoring',
    originalPrice: 2500,
    discountedPrice: 1999,
    discount: 20,
    tests: ['Complete Blood Count', 'Blood Sugar (Fasting)', 'Lipid Profile', 'Urine Routine'],
    duration: '24-48 hours',
    popular: true,
    recommended: false,
    category: 'basic',
    targetAudience: ['Young adults', 'Health conscious individuals', 'Annual checkup'],
    benefits: ['Early disease detection', 'Baseline health metrics', 'Affordable pricing', 'Quick results']
  },
  {
    id: 'PKG002',
    name: 'Comprehensive Health Plus',
    description: 'Advanced health screening with detailed organ function analysis',
    originalPrice: 5000,
    discountedPrice: 3999,
    discount: 20,
    tests: ['All Basic Tests', 'Liver Function', 'Kidney Function', 'Thyroid Profile', 'Vitamin D', 'HbA1c'],
    duration: '48-72 hours',
    popular: false,
    recommended: true,
    category: 'comprehensive',
    targetAudience: ['Adults 35+', 'Those with family history', 'Chronic condition monitoring'],
    benefits: ['Comprehensive analysis', 'Organ function assessment', 'Disease prevention', 'Expert consultation']
  },
  {
    id: 'PKG003',
    name: 'Executive Health Premium',
    description: 'Complete executive health package with advanced screening and consultation',
    originalPrice: 10000,
    discountedPrice: 7999,
    discount: 20,
    tests: ['All Comprehensive Tests', 'Cardiac Risk Markers', 'Cancer Markers', 'Hormone Panel', 'Heavy Metals', 'Advanced Imaging'],
    duration: '72-96 hours',
    popular: false,
    recommended: false,
    category: 'premium',
    targetAudience: ['Executives', 'High-stress professionals', '40+ age group'],
    benefits: ['Premium healthcare', 'Priority service', 'Specialist consultation', 'Detailed health report']
  },
  {
    id: 'PKG004',
    name: 'Diabetes Management Panel',
    description: 'Specialized package for diabetes monitoring and management',
    originalPrice: 1800,
    discountedPrice: 1499,
    discount: 17,
    tests: ['HbA1c', 'Fasting Glucose', 'Post-meal Glucose', 'Kidney Function', 'Lipid Profile', 'Microalbumin'],
    duration: '24-48 hours',
    popular: true,
    recommended: true,
    category: 'specialized',
    targetAudience: ['Diabetic patients', 'Pre-diabetic individuals', 'Family history of diabetes'],
    benefits: ['Diabetes monitoring', 'Complication screening', 'Treatment optimization', 'Regular tracking']
  },
  {
    id: 'PKG005',
    name: 'Women\'s Health Complete',
    description: 'Comprehensive health package designed specifically for women',
    originalPrice: 4500,
    discountedPrice: 3599,
    discount: 20,
    tests: ['Basic Health Tests', 'Hormone Panel', 'Thyroid Function', 'Iron Studies', 'Vitamin D', 'Breast Cancer Markers'],
    duration: '48-72 hours',
    popular: true,
    recommended: true,
    category: 'specialized',
    targetAudience: ['Women 25+', 'Reproductive health', 'Hormonal concerns'],
    benefits: ['Women-specific screening', 'Hormonal assessment', 'Cancer screening', 'Nutritional status']
  },
  {
    id: 'PKG006',
    name: 'Senior Citizen Care',
    description: 'Tailored health package for seniors with comprehensive age-related screening',
    originalPrice: 6000,
    discountedPrice: 4799,
    discount: 20,
    tests: ['All Basic Tests', 'Cardiac Assessment', 'Bone Health', 'Cognitive Function', 'Vitamin B12', 'Prostate (Men)'],
    duration: '72 hours',
    popular: false,
    recommended: true,
    category: 'specialized',
    targetAudience: ['60+ years', 'Senior citizens', 'Age-related health concerns'],
    benefits: ['Age-appropriate screening', 'Preventive care', 'Early intervention', 'Senior-friendly service']
  }
]

const labPartners: LabPartner[] = [
  {
    id: 'LAB001',
    name: 'Central Lab Services',
    address: 'Port Louis, Mauritius',
    phone: '+230 212-3456',
    email: 'info@centrallab.mu',
    rating: 4.8,
    certifications: ['ISO 15189', 'CAP Accredited', 'NABL Certified'],
    specialties: ['Clinical Chemistry', 'Hematology', 'Microbiology', 'Molecular Diagnostics'],
    openHours: '24/7 Emergency, 6AM-10PM Regular',
    facilities: ['STAT Lab', 'Advanced Equipment', 'Temperature Controlled Storage'],
    services: ['Home Collection', 'Express Reports', 'Online Results'],
    homeCollection: true,
    emergencyService: true
  },
  {
    id: 'LAB002',
    name: 'Apollo Diagnostics',
    address: 'Quatre Bornes, Mauritius',
    phone: '+230 234-5678',
    email: 'contact@apollodiag.mu',
    rating: 4.9,
    certifications: ['ISO 15189', 'JCI Accredited', 'WHO-GMP'],
    specialties: ['Cardiology', 'Oncology', 'Genetics', 'Immunology'],
    openHours: '6AM-11PM Daily',
    facilities: ['AI-Powered Analysis', 'Robotic Systems', 'Digital Pathology'],
    services: ['Telemedicine Consultation', 'Health Packages', 'Corporate Wellness'],
    homeCollection: true,
    emergencyService: false
  },
  {
    id: 'LAB003',
    name: 'Wellkin Laboratory',
    address: 'Rose Hill, Mauritius',
    phone: '+230 345-6789',
    email: 'lab@wellkin.mu',
    rating: 4.7,
    certifications: ['ISO 15189', 'CLIA Certified'],
    specialties: ['Biochemistry', 'Endocrinology', 'Toxicology'],
    openHours: '7AM-9PM Mon-Sat',
    facilities: ['Automated Systems', 'Quality Control', 'Research Lab'],
    services: ['Specialized Testing', 'Research Support', 'Training Programs'],
    homeCollection: true,
    emergencyService: false
  },
  {
    id: 'LAB004',
    name: 'Fortis Diagnostic Center',
    address: 'Curepipe, Mauritius',
    phone: '+230 456-7890',
    email: 'diagnostics@fortis.mu',
    rating: 4.6,
    certifications: ['ISO 15189', 'NABH Accredited'],
    specialties: ['Pathology', 'Radiology Integration', 'Preventive Health'],
    openHours: '6AM-10PM Daily',
    facilities: ['Digital Reports', 'Mobile App', 'Patient Portal'],
    services: ['Health Checkups', 'Consultation', 'Follow-up Care'],
    homeCollection: true,
    emergencyService: true
  }
]

const availableSlots: BookingSlot[] = [
  { date: '2025-01-16', time: '08:00 AM', available: true, type: 'regular' },
  { date: '2025-01-16', time: '09:00 AM', available: true, type: 'regular' },
  { date: '2025-01-16', time: '10:00 AM', available: false, type: 'regular' },
  { date: '2025-01-16', time: '11:00 AM', available: true, type: 'express', price: 100 },
  { date: '2025-01-16', time: '02:00 PM', available: true, type: 'priority', price: 200 },
  { date: '2025-01-17', time: '08:00 AM', available: true, type: 'regular' },
  { date: '2025-01-17', time: '09:00 AM', available: true, type: 'regular' },
  { date: '2025-01-17', time: '10:00 AM', available: true, type: 'regular' },
  { date: '2025-01-17', time: '11:00 AM', available: false, type: 'express' },
  { date: '2025-01-17', time: '03:00 PM', available: true, type: 'priority', price: 200 }
]

const LabResults: React.FC<Props> = ({ patientData }) => {
  const [activeTab, setActiveTab] = useState<'results' | 'book' | 'packages' | 'partners'>('results')
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null)
  const [selectedLab, setSelectedLab] = useState<string>('LAB001')
  const [collectionType, setCollectionType] = useState<'home' | 'clinic'>('clinic')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedTest, setExpandedTest] = useState<string | null>(null)
  const [expandedResult, setExpandedResult] = useState<string | null>(null)

  const handleTestSelection = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    )
  }

  const handlePackageSelection = (packageId: string) => {
    setSelectedPackage(selectedPackage === packageId ? null : packageId)
    setSelectedTests([]) // Clear individual tests when package is selected
  }

  const calculateTotal = () => {
    let total = 0
    
    if (selectedPackage) {
      const pkg = healthPackages.find(p => p.id === selectedPackage)
      total = pkg?.discountedPrice || 0
    } else {
      total = selectedTests.reduce((sum, testId) => {
        const test = availableTests.find(t => t.id === testId)
        const price = test?.price || 0
        const discount = test?.discount || 0
        return sum + (price * (1 - discount / 100))
      }, 0)
    }
    
    // Add collection fee
    if (collectionType === 'home') total += 200
    
    // Add slot fee
    if (selectedSlot?.price) total += selectedSlot.price
    
    return total
  }

  const filteredTests = availableTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(availableTests.map(test => test.category)))]

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200'
      case 'abnormal': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getResultIcon = (status: string) => {
    switch (status) {
      case 'normal': return <FaCheckCircle className="text-green-500" />
      case 'abnormal': return <FaExclamationTriangle className="text-red-500" />
      default: return <FaInfoCircle className="text-gray-500" />
    }
  }

  const renderResults = () => (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Total Tests</p>
              <p className="text-2xl font-bold">{patientData.labTests?.length || 0}</p>
            </div>
            <FaFlask className="text-3xl text-cyan-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Normal Results</p>
              <p className="text-2xl font-bold">
                {patientData.labTests?.filter(test => 
                  test.results.every(r => r.status === 'normal')
                ).length || 0}
              </p>
            </div>
            <FaCheckCircle className="text-3xl text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Attention Needed</p>
              <p className="text-2xl font-bold">
                {patientData.labTests?.filter(test => 
                  test.results.some(r => r.status === 'abnormal')
                ).length || 0}
              </p>
            </div>
            <FaExclamationTriangle className="text-3xl text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">This Month</p>
              <p className="text-2xl font-bold">
                {patientData.labTests?.filter(test => {
                  const testDate = new Date(test.date)
                  const now = new Date()
                  return testDate.getMonth() === now.getMonth() && testDate.getFullYear() === now.getFullYear()
                }).length || 0}
              </p>
            </div>
            <FaCalendarAlt className="text-3xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Test Results */}
      {patientData.labTests && patientData.labTests.length > 0 ? (
        <div className="space-y-4">
          {patientData.labTests.map((test) => (
            <div key={test.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.testName}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-500" />
                        <span>{new Date(test.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaHospital className="text-green-500" />
                        <span>{test.facility}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUserMd className="text-purple-500" />
                        <span>Ordered by: {test.orderedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {test.reportUrl && (
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2">
                        <FaDownload />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    )}
                    <button 
                      onClick={() => setExpandedResult(expandedResult === test.id ? null : test.id)}
                      className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <FaEye />
                      {expandedResult === test.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Test Results Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {test.results.map((result, index) => (
                    <div key={index} className={`rounded-xl p-4 border ${getResultStatusColor(result.status)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-1">{result.parameter}</p>
                          <p className="text-xl font-bold text-gray-900">{result.value}</p>
                          <p className="text-xs text-gray-600 mt-1">Range: {result.normalRange}</p>
                        </div>
                        <div className="ml-2">
                          {getResultIcon(result.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expanded Details */}
                {expandedResult === test.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                          <FaMicroscope className="mr-2" />
                          Test Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Test ID:</span>
                            <span className="font-medium">{test.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Facility:</span>
                            <span className="font-medium">{test.facility}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Ordered By:</span>
                            <span className="font-medium">{test.orderedBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Date:</span>
                            <span className="font-medium">{new Date(test.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-xl p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          <FaStethoscope className="mr-2" />
                          Clinical Summary
                        </h4>
                        <div className="text-sm space-y-2">
                          <div>
                            <span className="text-green-700 font-medium">Overall Status: </span>
                            <span className={`font-bold ${
                              test.results.every(r => r.status === 'normal') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {test.results.every(r => r.status === 'normal') ? 'Normal' : 'Requires Attention'}
                            </span>
                          </div>
                          <div>
                            <span className="text-green-700 font-medium">Parameters Tested: </span>
                            <span>{test.results.length}</span>
                          </div>
                          <div>
                            <span className="text-green-700 font-medium">Abnormal Results: </span>
                            <span className="text-red-600 font-medium">
                              {test.results.filter(r => r.status === 'abnormal').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Results Table */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <FaChartLine className="mr-2" />
                        Detailed Results
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3">Parameter</th>
                              <th className="text-left py-2 px-3">Result</th>
                              <th className="text-left py-2 px-3">Normal Range</th>
                              <th className="text-left py-2 px-3">Status</th>
                              <th className="text-left py-2 px-3">Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {test.results.map((result, index) => (
                              <tr key={index} className="border-b border-gray-100">
                                <td className="py-2 px-3 font-medium">{result.parameter}</td>
                                <td className="py-2 px-3 font-bold">{result.value}</td>
                                <td className="py-2 px-3 text-gray-600">{result.normalRange}</td>
                                <td className="py-2 px-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    result.status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {result.status}
                                  </span>
                                </td>
                                <td className="py-2 px-3">
                                  <FaChartLine className="text-blue-500" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {test.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                          <FaInfoCircle className="mr-2" />
                          Clinical Notes
                        </h4>
                        <p className="text-yellow-700">{test.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaFlask className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Test Results Available</h3>
          <p className="text-gray-500 mb-6">Start your health journey by booking your first lab test</p>
          <button 
            onClick={() => setActiveTab('book')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            Book Lab Test
          </button>
        </div>
      )}
    </div>
  )

  const renderBookTest = () => (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests by name, category, or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
          >
            <FaFilter />
            Filters
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="all">All Price Ranges</option>
                <option value="0-500">Rs 0 - 500</option>
                <option value="500-1000">Rs 500 - 1000</option>
                <option value="1000-2000">Rs 1000 - 2000</option>
                <option value="2000+">Rs 2000+</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="all">All Durations</option>
                <option value="24">24 Hours</option>
                <option value="48">48 Hours</option>
                <option value="72">72+ Hours</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="all">All Tests</option>
                <option value="popular">Popular Only</option>
                <option value="discounted">Discounted</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Available Tests */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedTests.includes(test.id)}
                onChange={() => handleTestSelection(test.id)}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{test.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {test.category}
                      </span>
                      {test.popular && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
                          <FaStar />
                          Popular
                        </span>
                      )}
                      {test.discount && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                          <FaPercent />
                          {test.discount}% Off
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {test.discount ? (
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          Rs {Math.round(test.price * (1 - test.discount / 100))}
                        </p>
                        <p className="text-sm text-gray-500 line-through">Rs {test.price}</p>
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-gray-900">Rs {test.price}</p>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>Results in {test.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaTint />
                    <span>{test.sampleType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMicroscope />
                    <span>{test.methodology}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaAward />
                    <span>{test.accuracy}% Accuracy</span>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  {expandedTest === test.id ? 'Less Details' : 'More Details'}
                  {expandedTest === test.id ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {expandedTest === test.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Preparation Instructions:</h5>
                      <p className="text-sm text-gray-600">{test.preparation}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Requirements:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {test.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Selection */}
      {selectedTests.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <FaHospital className="mr-2 text-blue-500" />
            Select Laboratory
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {labPartners.slice(0, 2).map((lab) => (
              <button
                key={lab.id}
                onClick={() => setSelectedLab(lab.id)}
                className={`p-4 border rounded-xl text-left hover:shadow-md transition ${
                  selectedLab === lab.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{lab.name}</h4>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className="text-sm font-medium">{lab.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{lab.address}</p>
                <div className="flex flex-wrap gap-1">
                  {lab.certifications.slice(0, 2).map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {cert}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collection Type */}
      {selectedTests.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Collection Type</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setCollectionType('clinic')}
              className={`p-6 border rounded-xl ${
                collectionType === 'clinic' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <FaHospital className="text-3xl mb-3 mx-auto text-blue-500" />
              <h4 className="font-medium mb-2">Visit Lab</h4>
              <p className="text-sm text-gray-600 mb-2">Visit our partner laboratory</p>
              <p className="text-lg font-bold text-green-600">No additional charges</p>
            </button>
            
            <button
              onClick={() => setCollectionType('home')}
              className={`p-6 border rounded-xl ${
                collectionType === 'home' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <FaHome className="text-3xl mb-3 mx-auto text-green-500" />
              <h4 className="font-medium mb-2">Home Collection</h4>
              <p className="text-sm text-gray-600 mb-2">Our technician visits your home</p>
              <p className="text-lg font-bold text-orange-600">+Rs 200 collection fee</p>
            </button>
          </div>
        </div>
      )}

      {/* Time Slots */}
      {selectedTests.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Select Date & Time</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => slot.available && setSelectedSlot(slot)}
                disabled={!slot.available}
                className={`p-3 border rounded-lg text-sm transition ${
                  selectedSlot === slot
                    ? 'border-blue-500 bg-blue-50'
                    : slot.available
                    ? 'border-gray-300 hover:border-gray-400'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <p className="font-medium">{slot.date}</p>
                <p className={slot.available ? 'text-gray-600' : 'text-gray-400'}>
                  {slot.time}
                </p>
                {slot.type !== 'regular' && (
                  <p className={`text-xs font-medium ${
                    slot.type === 'express' ? 'text-orange-600' : 'text-purple-600'
                  }`}>
                    {slot.type} {slot.price && `+Rs ${slot.price}`}
                  </p>
                )}
                {!slot.available && (
                  <p className="text-xs text-red-500">Booked</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Booking Summary */}
      {selectedTests.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <FaShoppingCart className="mr-2 text-blue-500" />
            Booking Summary
          </h3>
          
          <div className="space-y-3 mb-4">
            {selectedTests.map(testId => {
              const test = availableTests.find(t => t.id === testId)
              if (!test) return null
              const discountedPrice = test.discount ? 
                Math.round(test.price * (1 - test.discount / 100)) : test.price
              
              return (
                <div key={testId} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{test.name}</span>
                    {test.discount && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {test.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    {test.discount ? (
                      <div>
                        <span className="font-semibold">Rs {discountedPrice}</span>
                        <span className="text-gray-500 line-through ml-2">Rs {test.price}</span>
                      </div>
                    ) : (
                      <span className="font-semibold">Rs {test.price}</span>
                    )}
                  </div>
                </div>
              )
            })}
            
            {collectionType === 'home' && (
              <div className="flex justify-between text-sm">
                <span>Home Collection Fee</span>
                <span className="font-semibold">Rs 200</span>
              </div>
            )}
            
            {selectedSlot?.price && (
              <div className="flex justify-between text-sm">
                <span>{selectedSlot.type} Service</span>
                <span className="font-semibold">Rs {selectedSlot.price}</span>
              </div>
            )}
          </div>
          
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-lg font-bold">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">Rs {calculateTotal()}</span>
          </div>
          
          <button
            disabled={!selectedSlot}
            className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all ${
              selectedSlot
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedSlot ? `Confirm Booking - Rs ${calculateTotal()}` : 'Select Date & Time'}
          </button>
          
          <p className="text-xs text-gray-600 mt-2 text-center">
            Secure payment • Free cancellation • 24/7 support
          </p>
        </div>
      )}
    </div>
  )

  const renderPackages = () => (
    <div className="space-y-6">
      {/* Package Categories */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Package Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'all', label: 'All Packages', icon: FaFlask, color: 'text-gray-600', count: healthPackages.length },
            { id: 'basic', label: 'Basic', icon: FaHeartbeat, color: 'text-blue-600', count: healthPackages.filter(p => p.category === 'basic').length },
            { id: 'comprehensive', label: 'Comprehensive', icon: FaStethoscope, color: 'text-green-600', count: healthPackages.filter(p => p.category === 'comprehensive').length },
            { id: 'specialized', label: 'Specialized', icon: FaDna, color: 'text-purple-600', count: healthPackages.filter(p => p.category === 'specialized').length }
          ].map((category) => (
            <button
              key={category.id}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition text-center"
            >
              <category.icon className={`${category.color} text-2xl mx-auto mb-2`} />
              <p className="font-medium text-gray-900">{category.label}</p>
              <p className="text-sm text-gray-600">{category.count} packages</p>
            </button>
          ))}
        </div>
      </div>

      {/* Health Packages Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {healthPackages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`bg-white border rounded-2xl p-6 hover:shadow-xl transition-all ${
              selectedPackage === pkg.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            } ${pkg.recommended ? 'ring-2 ring-purple-200' : ''}`}
          >
            {/* Package Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                  {pkg.popular && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
                      <FaStar />
                      Popular
                    </span>
                  )}
                  {pkg.recommended && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center gap-1">
                      <FaRocket />
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{pkg.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">Rs {pkg.discountedPrice}</div>
                <div className="text-sm text-gray-500 line-through">Rs {pkg.originalPrice}</div>
                <div className="text-xs text-green-600 font-medium">{pkg.discount}% OFF</div>
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <FaFlask className="mr-2 text-blue-500" />
                  Included Tests ({pkg.tests.length})
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {pkg.tests.slice(0, 4).map((test, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      {test}
                    </div>
                  ))}
                  {pkg.tests.length > 4 && (
                    <div className="text-sm text-blue-600 font-medium">
                      +{pkg.tests.length - 4} more tests
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <FaLightbulb className="mr-2 text-yellow-500" />
                  Key Benefits
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {pkg.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaHardHat className="text-green-500 text-xs" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Target Audience</h4>
                <div className="flex flex-wrap gap-1">
                  {pkg.targetAudience.map((audience, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FaClock className="text-blue-500" />
                  <span>Results in {pkg.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCertificate className="text-green-500" />
                  <span>Certified Labs</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handlePackageSelection(pkg.id)}
              className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all ${
                selectedPackage === pkg.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
              }`}
            >
              {selectedPackage === pkg.id ? 'Selected' : `Select Package - Rs ${pkg.discountedPrice}`}
            </button>
          </div>
        ))}
      </div>

      {/* Package Comparison */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Package Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Package</th>
                <th className="text-left py-3 px-4">Tests</th>
                <th className="text-left py-3 px-4">Duration</th>
                <th className="text-left py-3 px-4">Original Price</th>
                <th className="text-left py-3 px-4">Discounted Price</th>
                <th className="text-left py-3 px-4">Savings</th>
              </tr>
            </thead>
            <tbody>
              {healthPackages.slice(0, 4).map((pkg) => (
                <tr key={pkg.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{pkg.name}</div>
                    <div className="text-xs text-gray-500">{pkg.category}</div>
                  </td>
                  <td className="py-3 px-4">{pkg.tests.length}</td>
                  <td className="py-3 px-4">{pkg.duration}</td>
                  <td className="py-3 px-4 line-through text-gray-500">Rs {pkg.originalPrice}</td>
                  <td className="py-3 px-4 font-bold text-green-600">Rs {pkg.discountedPrice}</td>
                  <td className="py-3 px-4 text-green-600 font-medium">
                    Rs {pkg.originalPrice - pkg.discountedPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderPartners = () => (
    <div className="space-y-6">
      {/* Partners Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {labPartners.map((partner) => (
          <div key={partner.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{partner.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < Math.floor(partner.rating) ? 'text-yellow-500' : 'text-gray-300'} 
                      />
                    ))}
                    <span className="text-sm font-medium ml-1">{partner.rating}</span>
                  </div>
                  {partner.emergencyService && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                      24/7 Emergency
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                  <FaPhone className="inline mr-1" />
                  Call
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-gray-500 mt-1" />
                <div>
                  <p className="text-gray-700">{partner.address}</p>
                  <p className="text-sm text-gray-500">{partner.openHours}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-1">
                  {partner.specialties.map((specialty, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-1">
                  {partner.certifications.map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
                      <FaCertificate />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Services</h4>
                <div className="grid grid-cols-2 gap-2">
                  {partner.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FaPhone className="text-blue-500" />
                    <span>{partner.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaEnvelope className="text-green-500" />
                    <span>{partner.email}</span>
                  </div>
                </div>
                {partner.homeCollection && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium flex items-center gap-1">
                    <FaHome />
                    Home Collection
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Partner Services Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Our Lab Network</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaHospital className="text-blue-600 text-2xl" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{labPartners.length}+ Labs</h4>
            <p className="text-sm text-gray-600">Certified lab partners across Mauritius</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaShieldAlt className="text-green-600 text-2xl" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">ISO Certified</h4>
            <p className="text-sm text-gray-600">All partners meet international quality standards</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaHome className="text-orange-600 text-2xl" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Home Service</h4>
            <p className="text-sm text-gray-600">Convenient sample collection at your doorstep</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaClock className="text-red-600 text-2xl" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">24/7 Emergency</h4>
            <p className="text-sm text-gray-600">Emergency lab services available round the clock</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Lab Testing Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <FaFlask className="mr-3" />
              Laboratory Testing
            </h2>
            <p className="opacity-90">Comprehensive lab testing with certified partners</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm opacity-80">Next Available Slot</p>
            <p className="text-lg font-bold">Tomorrow 8:00 AM</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {[
              { id: 'results', label: 'Test Results', icon: FaFileDownload, color: 'text-cyan-600' },
              { id: 'book', label: 'Book Tests', icon: FaFlask, color: 'text-blue-600' },
              { id: 'packages', label: 'Health Packages', icon: FaPlus, color: 'text-green-600' },
              { id: 'partners', label: 'Lab Partners', icon: FaHospital, color: 'text-purple-600' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-shrink-0 px-6 py-4 text-center font-medium transition-all ${
                  activeTab === tab.id 
                    ? `${tab.color} border-b-2 border-current bg-blue-50` 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="inline mr-2" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'results' && renderResults()}
          {activeTab === 'book' && renderBookTest()}
          {activeTab === 'packages' && renderPackages()}
          {activeTab === 'partners' && renderPartners()}
        </div>
      </div>
    </div>
  )
}

export default LabResults