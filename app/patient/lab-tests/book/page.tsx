"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  FaFlask,
  FaMapMarkerAlt,
  FaClock,
  FaArrowLeft,
  FaSearch,
  FaShoppingCart,
  FaHome,
  FaBuilding,
  FaCheckCircle,
  FaInfoCircle,
  FaDownload,
  FaFileAlt,
  FaTint,
  FaPrescriptionBottle
} from "react-icons/fa"

interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  preparation: string;
  fastingRequired: boolean;
  sampleType: string;
  resultTime: string;
  popular: boolean;
  icon: string;
}

interface TestPackage {
  id: string;
  name: string;
  description: string;
  tests: string[];
  price: number;
  savings: number;
  recommended: boolean;
}

interface LabCenter {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  availableSlots: number;
  homeCollection: boolean;
  openTime: string;
  closeTime: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

// interface BookingDetails {
//   tests: LabTest[];
//   package: TestPackage | null;
//   date: string;
//   time: string;
//   location: LabCenter | null;
//   collectionType: "home" | "lab";
//   patientName: string;
//   patientAge: number;
//   patientGender: string;
//   prescription: boolean;
//   totalAmount: number;
// }

interface PastTestResult {
  id: string;
  testName: string;
  date: string;
  status: "ready" | "pending" | "processing";
  reportUrl: string;
  doctor: string;
}

const mockLabTests: LabTest[] = [
  {
    id: "LT001",
    name: "Complete Blood Count (CBC)",
    category: "Hematology",
    price: 800,
    description: "Comprehensive blood test measuring different components",
    preparation: "No special preparation required",
    fastingRequired: false,
    sampleType: "Blood",
    resultTime: "Same day",
    popular: true,
    icon: "🩸"
  },
  {
    id: "LT002",
    name: "Lipid Profile",
    category: "Biochemistry",
    price: 1200,
    description: "Cholesterol and triglycerides test",
    preparation: "12 hours fasting required",
    fastingRequired: true,
    sampleType: "Blood",
    resultTime: "Same day",
    popular: true,
    icon: "🧪"
  },
  {
    id: "LT003",
    name: "Thyroid Function Test",
    category: "Hormones",
    price: 1500,
    description: "TSH, T3, T4 levels",
    preparation: "No special preparation",
    fastingRequired: false,
    sampleType: "Blood",
    resultTime: "Next day",
    popular: true,
    icon: "🦋"
  },
  {
    id: "LT004",
    name: "HbA1c",
    category: "Diabetes",
    price: 1000,
    description: "3-month average blood sugar",
    preparation: "No fasting required",
    fastingRequired: false,
    sampleType: "Blood",
    resultTime: "Same day",
    popular: true,
    icon: "💉"
  },
  {
    id: "LT005",
    name: "Vitamin D",
    category: "Vitamins",
    price: 1800,
    description: "25-hydroxy vitamin D test",
    preparation: "No special preparation",
    fastingRequired: false,
    sampleType: "Blood",
    resultTime: "2 days",
    popular: false,
    icon: "☀️"
  },
  {
    id: "LT006",
    name: "COVID-19 RT-PCR",
    category: "Infectious Disease",
    price: 2500,
    description: "COVID-19 detection test",
    preparation: "Avoid eating/drinking 30 min before",
    fastingRequired: false,
    sampleType: "Nasal/Throat Swab",
    resultTime: "24 hours",
    popular: false,
    icon: "🦠"
  }
]

const mockPackages: TestPackage[] = [
  {
    id: "PKG001",
    name: "Basic Health Checkup",
    description: "Essential tests for overall health monitoring",
    tests: ["CBC", "Lipid Profile", "Blood Sugar"],
    price: 2500,
    savings: 500,
    recommended: true
  },
  {
    id: "PKG002",
    name: "Comprehensive Health Package",
    description: "Complete health assessment with all major tests",
    tests: ["CBC", "Lipid Profile", "Thyroid", "Liver Function", "Kidney Function", "HbA1c"],
    price: 5500,
    savings: 1500,
    recommended: false
  },
  {
    id: "PKG003",
    name: "Diabetes Care Package",
    description: "Specialized tests for diabetes management",
    tests: ["HbA1c", "Fasting Blood Sugar", "Lipid Profile", "Kidney Function"],
    price: 3200,
    savings: 800,
    recommended: false
  }
]

const mockLabCenters: LabCenter[] = [
  {
    id: "LC001",
    name: "MediLab Diagnostics - Port Louis",
    address: "123 Royal Road, Port Louis",
    distance: 2.5,
    rating: 4.8,
    availableSlots: 12,
    homeCollection: true,
    openTime: "07:00",
    closeTime: "20:00"
  },
  {
    id: "LC002",
    name: "HealthCheck Lab - Rose Hill",
    address: "45 Vandermeersch St, Rose Hill",
    distance: 5.2,
    rating: 4.6,
    availableSlots: 8,
    homeCollection: true,
    openTime: "08:00",
    closeTime: "18:00"
  },
  {
    id: "LC003",
    name: "Apollo Diagnostics",
    address: "Apollo Bramwell Hospital, Moka",
    distance: 8.3,
    rating: 4.9,
    availableSlots: 15,
    homeCollection: false,
    openTime: "06:00",
    closeTime: "22:00"
  }
]

const mockTimeSlots: TimeSlot[] = [
  { time: "07:00 AM", available: true },
  { time: "07:30 AM", available: true },
  { time: "08:00 AM", available: false },
  { time: "08:30 AM", available: true },
  { time: "09:00 AM", available: true },
  { time: "09:30 AM", available: true },
  { time: "10:00 AM", available: false },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: true }
]

const mockPastResults: PastTestResult[] = [
  {
    id: "RES001",
    testName: "Complete Blood Count",
    date: "2024-01-10",
    status: "ready",
    reportUrl: "/reports/cbc-report.pdf",
    doctor: "Dr. Sarah Johnson"
  },
  {
    id: "RES002",
    testName: "Lipid Profile",
    date: "2024-01-05",
    status: "ready",
    reportUrl: "/reports/lipid-report.pdf",
    doctor: "Dr. Michael Chen"
  }
]

export default function LabTestsBookingPage() {
  const [activeTab, setActiveTab] = useState<"book" | "packages" | "results">("book")
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([])
  const [selectedPackage, setSelectedPackage] = useState<TestPackage | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [collectionType, setCollectionType] = useState<"home" | "lab">("lab")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedLab, setSelectedLab] = useState<LabCenter | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  const categories = ["all", "Hematology", "Biochemistry", "Hormones", "Diabetes", "Vitamins", "Infectious Disease"]

  const filteredTests = mockLabTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || test.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddTest = (test: LabTest) => {
    if (!selectedTests.find(t => t.id === test.id)) {
      setSelectedTests([...selectedTests, test])
    }
  }

  // const handleRemoveTest = (testId: string) => {
  //   setSelectedTests(selectedTests.filter(t => t.id !== testId))
  // }

  const getTotalAmount = () => {
    if (selectedPackage) {
      return selectedPackage.price
    }
    return selectedTests.reduce((sum, test) => sum + test.price, 0)
  }

  const handleProceedToCheckout = () => {
    if (selectedTests.length > 0 || selectedPackage) {
      setShowCheckout(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/patient/dashboard" className="text-gray-600 hover:text-primary-blue">
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lab Tests Booking</h1>
                <p className="text-gray-600">Book lab tests with home collection or visit lab</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-primary-blue">
                <FaShoppingCart className="text-xl" />
                {(selectedTests.length > 0 || selectedPackage) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedPackage ? 1 : selectedTests.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="btn-gradient px-6 py-2"
                disabled={selectedTests.length === 0 && !selectedPackage}
              >
                Proceed to Book
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("book")}
                className={`flex-1 px-6 py-4 font-medium ${
                  activeTab === "book"
                    ? "text-primary-blue border-b-2 border-primary-blue"
                    : "text-gray-600"
                }`}
              >
                <FaFlask className="inline mr-2" />
                Individual Tests
              </button>
              <button
                onClick={() => setActiveTab("packages")}
                className={`flex-1 px-6 py-4 font-medium ${
                  activeTab === "packages"
                    ? "text-primary-blue border-b-2 border-primary-blue"
                    : "text-gray-600"
                }`}
              >
                <FaPrescriptionBottle className="inline mr-2" />
                Health Packages
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`flex-1 px-6 py-4 font-medium ${
                  activeTab === "results"
                    ? "text-primary-blue border-b-2 border-primary-blue"
                    : "text-gray-600"
                }`}
              >
                <FaFileAlt className="inline mr-2" />
                Past Results
              </button>
            </nav>
          </div>
        </div>

        {!showCheckout ? (
          <>
            {/* Individual Tests Tab */}
            {activeTab === "book" && (
              <>
                {/* Search and Filter */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Search for tests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:border-primary-blue"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Popular Tests */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Popular Tests</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTests.filter(t => t.popular).map((test) => (
                      <div key={test.id} className="bg-white rounded-lg p-4 shadow-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{test.icon}</span>
                            <div>
                              <h4 className="font-semibold">{test.name}</h4>
                              <p className="text-sm text-gray-600">{test.category}</p>
                            </div>
                          </div>
                          <span className="text-lg font-bold">Rs {test.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span><FaClock className="inline mr-1" />{test.resultTime}</span>
                          <span><FaTint className="inline mr-1" />{test.sampleType}</span>
                        </div>
                        {test.fastingRequired && (
                          <p className="text-xs text-orange-600 mb-3">⚠️ Fasting required</p>
                        )}
                        <button
                          onClick={() => handleAddTest(test)}
                          disabled={selectedTests.find(t => t.id === test.id) !== undefined}
                          className={`w-full py-2 rounded-lg ${
                            selectedTests.find(t => t.id === test.id)
                              ? "bg-green-100 text-green-800"
                              : "bg-primary-blue text-white hover:bg-blue-600"
                          }`}
                        >
                          {selectedTests.find(t => t.id === test.id) ? "✓ Added" : "Add to Cart"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Tests */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">All Tests</h3>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sample</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Results</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredTests.map((test) => (
                          <tr key={test.id}>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{test.name}</p>
                                <p className="text-sm text-gray-500">{test.category}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{test.sampleType}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{test.resultTime}</td>
                            <td className="px-6 py-4 font-semibold">Rs {test.price}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleAddTest(test)}
                                disabled={selectedTests.find(t => t.id === test.id) !== undefined}
                                className={`px-4 py-1 rounded ${
                                  selectedTests.find(t => t.id === test.id)
                                    ? "bg-green-100 text-green-800"
                                    : "bg-primary-blue text-white hover:bg-blue-600"
                                }`}
                              >
                                {selectedTests.find(t => t.id === test.id) ? "✓ Added" : "Add"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Packages Tab */}
            {activeTab === "packages" && (
              <div className="grid md:grid-cols-3 gap-6">
                {mockPackages.map((pkg) => (
                  <div key={pkg.id} className={`bg-white rounded-2xl p-6 shadow-lg ${pkg.recommended ? "border-2 border-primary-blue" : ""}`}>
                    {pkg.recommended && (
                      <span className="inline-block px-3 py-1 bg-primary-blue text-white rounded-full text-xs font-medium mb-3">
                        Recommended
                      </span>
                    )}
                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-primary-blue">Rs {pkg.price}</p>
                      <p className="text-sm text-green-600">Save Rs {pkg.savings}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Includes:</p>
                      <ul className="space-y-1">
                        {pkg.tests.map((test, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <FaCheckCircle className="text-green-500" />
                            {test}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPackage(pkg)
                        setSelectedTests([])
                      }}
                      className={`w-full py-2 rounded-lg ${
                        selectedPackage?.id === pkg.id
                          ? "bg-green-100 text-green-800"
                          : "bg-primary-blue text-white hover:bg-blue-600"
                      }`}
                    >
                      {selectedPackage?.id === pkg.id ? "✓ Selected" : "Select Package"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Past Results Tab */}
            {activeTab === "results" && (
              <div className="space-y-4">
                {mockPastResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg p-4 shadow-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{result.testName}</h4>
                      <p className="text-sm text-gray-600">Date: {result.date} • Prescribed by: {result.doctor}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        result.status === "ready" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {result.status}
                      </span>
                      {result.status === "ready" && (
                        <button className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                          <FaDownload />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Items Cart */}
            {(selectedTests.length > 0 || selectedPackage) && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
                <div className="container mx-auto flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {selectedPackage ? `1 package selected` : `${selectedTests.length} test(s) selected`}
                    </p>
                    <p className="text-xl font-bold">Total: Rs {getTotalAmount()}</p>
                  </div>
                  <button
                    onClick={handleProceedToCheckout}
                    className="btn-gradient px-8 py-3"
                  >
                    Proceed to Book
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Checkout Flow */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-6">Booking Details</h2>
              
              {/* Collection Type */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Collection Type</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className={`p-4 border-2 rounded-lg cursor-pointer ${
                    collectionType === "home" ? "border-primary-blue bg-blue-50" : "border-gray-300"
                  }`}>
                    <input
                      type="radio"
                      value="home"
                      checked={collectionType === "home"}
                      onChange={(e) => setCollectionType(e.target.value as "home" | "lab")}
                      className="mr-3"
                    />
                    <FaHome className="inline mr-2 text-primary-blue" />
                    Home Collection (Free)
                  </label>
                  <label className={`p-4 border-2 rounded-lg cursor-pointer ${
                    collectionType === "lab" ? "border-primary-blue bg-blue-50" : "border-gray-300"
                  }`}>
                    <input
                      type="radio"
                      value="lab"
                      checked={collectionType === "lab"}
                      onChange={(e) => setCollectionType(e.target.value as "home" | "lab")}
                      className="mr-3"
                    />
                    <FaBuilding className="inline mr-2 text-primary-blue" />
                    Visit Lab Center
                  </label>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Date</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Select Time Slot</h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {mockTimeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 rounded-lg text-sm ${
                          selectedTime === slot.time
                            ? "bg-primary-blue text-white"
                            : slot.available
                            ? "border border-gray-300 hover:border-primary-blue"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab Centers (if lab visit selected) */}
              {collectionType === "lab" && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Select Lab Center</h3>
                  <div className="space-y-3">
                    {mockLabCenters.map((center) => (
                      <label
                        key={center.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer ${
                          selectedLab?.id === center.id ? "border-primary-blue bg-blue-50" : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          value={center.id}
                          checked={selectedLab?.id === center.id}
                          onChange={() => setSelectedLab(center)}
                          className="mr-3"
                        />
                        <span className="font-medium">{center.name}</span>
                        <div className="text-sm text-gray-600 mt-1">
                          <FaMapMarkerAlt className="inline mr-1" />
                          {center.address} • {center.distance} km away
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <FaClock className="inline mr-1" />
                          {center.openTime} - {center.closeTime} • {center.availableSlots} slots available
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                {selectedPackage ? (
                  <div className="mb-3">
                    <p className="font-medium">{selectedPackage.name}</p>
                    <p className="text-sm text-gray-600">Package includes {selectedPackage.tests.length} tests</p>
                    <p className="text-right font-semibold">Rs {selectedPackage.price}</p>
                  </div>
                ) : (
                  <div className="space-y-2 mb-3">
                    {selectedTests.map((test) => (
                      <div key={test.id} className="flex justify-between">
                        <span>{test.name}</span>
                        <span>Rs {test.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-xl font-bold text-primary-blue">Rs {getTotalAmount()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  className="flex-1 btn-gradient py-3"
                  disabled={!selectedDate || !selectedTime || (collectionType === "lab" && !selectedLab)}
                >
                  Confirm Booking
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <FaInfoCircle className="text-blue-500 mb-2" />
              <h4 className="font-semibold text-blue-900 mb-2">Important Instructions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Some tests may require fasting for 10-12 hours</li>
                <li>• Drink plenty of water before the test</li>
                <li>• Carry a valid ID and prescription (if available)</li>
                <li>• Results will be available within the specified time</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}