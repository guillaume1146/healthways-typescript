"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhone,
  FaComments,
  FaClock,
  FaExpand,
  FaCompress,
  FaDesktop,
  FaPaperclip,
  FaPaperPlane,
  FaFileMedical,
  FaPrescriptionBottle,
  FaFileAlt,
  FaHeartbeat,
  FaAllergies,
  FaCamera,
  FaSave
} from "react-icons/fa"

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  lastVisit: string;
}

interface VitalSigns {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  oxygenSaturation: string;
}

interface ConsultationNotes {
  chiefComplaint: string;
  history: string;
  examination: string;
  diagnosis: string;
  treatment: string;
  followUp: string;
}

interface Message {
  id: number;
  sender: "patient" | "doctor";
  text: string;
  time: string;
}

const mockPatient: PatientInfo = {
  id: "PT-001",
  name: "John Smith",
  age: 35,
  gender: "Male",
  avatar: "👨",
  bloodType: "O+",
  allergies: ["Penicillin", "Peanuts"],
  chronicConditions: ["Hypertension", "Type 2 Diabetes"],
  currentMedications: ["Metformin 500mg", "Lisinopril 10mg"],
  lastVisit: "2024-01-10"
}

const mockVitals: VitalSigns = {
  bloodPressure: "120/80",
  heartRate: "72 bpm",
  temperature: "36.8°C",
  weight: "75 kg",
  height: "175 cm",
  oxygenSaturation: "98%"
}

export default function DoctorConsultationPage() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showPatientInfo, setShowPatientInfo] = useState(true)
  const [activeTab, setActiveTab] = useState<"info" | "history" | "notes" | "prescribe">("info")
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [callDuration, setCallDuration] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [consultationNotes, setConsultationNotes] = useState<ConsultationNotes>({
    chiefComplaint: "",
    history: "",
    examination: "",
    diagnosis: "",
    treatment: "",
    followUp: ""
  })
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    // Simulate connection
    setTimeout(() => {
      setConnectionStatus("connected")
    }, 2000)

    // Call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: "doctor",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleEndConsultation = () => {
    // Save consultation data
    console.log("Consultation ended", consultationNotes)
    window.location.href = "/doctor/dashboard"
  }

  const handleSaveNotes = () => {
    console.log("Notes saved", consultationNotes)
    // Show success message
  }

  if (connectionStatus === "connecting") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">Connecting to patient...</h2>
          <p className="text-gray-400">Setting up secure consultation room</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Sidebar - Patient Info */}
      {showPatientInfo && (
        <div className="w-96 bg-white h-screen overflow-y-auto">
          {/* Patient Header */}
          <div className="p-4 bg-gradient-main text-white">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{mockPatient.avatar}</div>
              <div>
                <h3 className="font-semibold">{mockPatient.name}</h3>
                <p className="text-sm opacity-90">
                  {mockPatient.age} years • {mockPatient.gender} • {mockPatient.bloodType}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "info"
                  ? "text-primary-blue border-b-2 border-primary-blue"
                  : "text-gray-600"
              }`}
            >
              Patient Info
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "history"
                  ? "text-primary-blue border-b-2 border-primary-blue"
                  : "text-gray-600"
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "notes"
                  ? "text-primary-blue border-b-2 border-primary-blue"
                  : "text-gray-600"
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab("prescribe")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "prescribe"
                  ? "text-primary-blue border-b-2 border-primary-blue"
                  : "text-gray-600"
              }`}
            >
              Prescribe
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === "info" && (
              <div className="space-y-4">
                {/* Vital Signs */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaHeartbeat className="text-red-500" />
                    Vital Signs
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Blood Pressure</span>
                      <span className="font-medium">{mockVitals.bloodPressure}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Heart Rate</span>
                      <span className="font-medium">{mockVitals.heartRate}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Temperature</span>
                      <span className="font-medium">{mockVitals.temperature}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium">{mockVitals.weight}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">SpO2</span>
                      <span className="font-medium">{mockVitals.oxygenSaturation}</span>
                    </div>
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaAllergies className="text-orange-500" />
                    Allergies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mockPatient.allergies.map((allergy, index) => (
                      <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chronic Conditions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Chronic Conditions</h4>
                  <div className="space-y-2">
                    {mockPatient.chronicConditions.map((condition, index) => (
                      <div key={index} className="p-2 bg-yellow-50 rounded">
                        {condition}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Medications */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Current Medications</h4>
                  <div className="space-y-2">
                    {mockPatient.currentMedications.map((med, index) => (
                      <div key={index} className="p-2 bg-blue-50 rounded">
                        {med}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-2">Last Visit</h5>
                  <p className="text-gray-600">{mockPatient.lastVisit}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Routine checkup - Blood pressure controlled with medication
                  </p>
                </div>
                <button className="w-full py-2 border border-primary-blue text-primary-blue rounded-lg hover:bg-blue-50">
                  View Full History
                </button>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chief Complaint
                  </label>
                  <textarea
                    value={consultationNotes.chiefComplaint}
                    onChange={(e) => setConsultationNotes({
                      ...consultationNotes,
                      chiefComplaint: e.target.value
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
                    placeholder="Patient's main concern..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    History
                  </label>
                  <textarea
                    value={consultationNotes.history}
                    onChange={(e) => setConsultationNotes({
                      ...consultationNotes,
                      history: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
                    placeholder="Medical history..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Examination
                  </label>
                  <textarea
                    value={consultationNotes.examination}
                    onChange={(e) => setConsultationNotes({
                      ...consultationNotes,
                      examination: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
                    placeholder="Physical examination findings..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis
                  </label>
                  <textarea
                    value={consultationNotes.diagnosis}
                    onChange={(e) => setConsultationNotes({
                      ...consultationNotes,
                      diagnosis: e.target.value
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
                    placeholder="Diagnosis..."
                  />
                </div>
                
                <button
                  onClick={handleSaveNotes}
                  className="w-full py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <FaSave />
                  Save Notes
                </button>
              </div>
            )}

            {activeTab === "prescribe" && (
              <div className="space-y-4">
                <Link
                  href="/doctor/prescriptions/new"
                  className="block w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center"
                >
                  <FaPrescriptionBottle className="inline mr-2" />
                  Write Prescription
                </Link>
                <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <FaFileAlt className="inline mr-2" />
                  Generate Report
                </button>
                <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <FaFileMedical className="inline mr-2" />
                  Order Lab Tests
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPatientInfo(!showPatientInfo)}
              className="text-white hover:text-gray-300"
            >
              {showPatientInfo ? "←" : "→"}
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-white text-sm">{connectionStatus === "connected" ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{formatDuration(callDuration)}</span>
            </div>
            {isRecording && (
              <div className="flex items-center gap-2 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Recording</span>
              </div>
            )}
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-gray-800">
          {/* Patient's Video (Main) */}
          <div className="h-full flex items-center justify-center">
            {isVideoOn ? (
              <div className="text-center">
                <div className="text-9xl mb-4">{mockPatient.avatar}</div>
                <p className="text-white text-xl">{mockPatient.name}</p>
              </div>
            ) : (
              <div className="text-center">
                <FaVideoSlash className="text-gray-600 text-6xl mx-auto mb-4" />
                <p className="text-gray-400">Patient video is off</p>
              </div>
            )}
          </div>

          {/* Doctor's Video (PiP) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg shadow-lg border-2 border-gray-600">
            {isVideoOn ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl">👩‍⚕️</div>
                  <p className="text-white text-xs mt-1">You</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <FaVideoSlash className="text-gray-500 text-2xl" />
              </div>
            )}
          </div>

          {/* Chat Panel */}
          {showChat && (
            <div className="absolute top-0 right-0 h-full w-96 bg-white shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Chat with Patient</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 h-[calc(100%-8rem)]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${message.sender === "doctor" ? "text-right" : "text-left"}`}
                  >
                    <div className={`inline-block p-3 rounded-lg max-w-xs ${
                      message.sender === "doctor"
                        ? "bg-primary-blue text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}>
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === "doctor" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <FaPaperclip />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-blue"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="bg-gray-800 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full ${
                  isVideoOn ? "bg-gray-700 text-white" : "bg-red-500 text-white"
                } hover:opacity-80`}
              >
                {isVideoOn ? <FaVideo /> : <FaVideoSlash />}
              </button>
              
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full ${
                  isMicOn ? "bg-gray-700 text-white" : "bg-red-500 text-white"
                } hover:opacity-80`}
              >
                {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
              </button>
              
              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-full ${
                  isScreenSharing ? "bg-primary-blue text-white" : "bg-gray-700 text-white"
                } hover:opacity-80`}
              >
                <FaDesktop />
              </button>
              
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-3 rounded-full ${
                  showChat ? "bg-primary-blue text-white" : "bg-gray-700 text-white"
                } hover:opacity-80`}
              >
                <FaComments />
              </button>
              
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-full ${
                  isRecording ? "bg-red-500 text-white" : "bg-gray-700 text-white"
                } hover:opacity-80`}
              >
                <FaCamera />
              </button>
              
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-3 rounded-full bg-gray-700 text-white hover:opacity-80"
              >
                {isFullScreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
            
            <button
              onClick={handleEndConsultation}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center gap-2"
            >
              <FaPhone className="rotate-135" />
              End Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}