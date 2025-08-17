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
  FaNotesMedical,
  FaExclamationTriangle,
  FaArrowLeft,
  FaFileDownload
} from "react-icons/fa"

interface ConsultationData {
  id: string;
  doctor: {
    name: string;
    specialty: string;
    avatar: string;
  };
  patient: {
    name: string;
    age: number;
    avatar: string;
  };
  scheduledTime: string;
  duration: number;
  status: "waiting" | "ongoing" | "completed";
  notes: string;
}

interface Message {
  id: number;
  sender: "patient" | "doctor";
  text: string;
  time: string;
}

const mockConsultation: ConsultationData = {
  id: "CONS-001",
  doctor: {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    avatar: "👩‍⚕️"
  },
  patient: {
    name: "John Smith",
    age: 35,
    avatar: "👨"
  },
  scheduledTime: "10:00 AM",
  duration: 30,
  status: "ongoing",
  notes: ""
}

const mockMessages: Message[] = [
  { id: 1, sender: "doctor", text: "Hello Mr. Smith, how are you feeling today?", time: "10:00 AM" },
  { id: 2, sender: "patient", text: "Hi Doctor, I've been having chest pain for the past 2 days", time: "10:01 AM" },
  { id: 3, sender: "doctor", text: "Can you describe the pain? Is it sharp or dull?", time: "10:02 AM" },
  { id: 4, sender: "patient", text: "It's more of a dull ache, especially when I breathe deeply", time: "10:03 AM" }
]

export default function PatientTeleconsultationPage() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [callDuration, setCallDuration] = useState(0)
  const [showEndCallConfirm, setShowEndCallConfirm] = useState(false)

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
        sender: "patient",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleEndCall = () => {
    setShowEndCallConfirm(false)
    window.location.href = "/patient/dashboard"
  }

  if (connectionStatus === "connecting") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">Connecting to consultation...</h2>
          <p className="text-gray-400">Please wait while we establish a secure connection</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/patient/appointments" className="text-white hover:text-gray-300">
            <FaArrowLeft />
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{mockConsultation.doctor.avatar}</div>
            <div>
              <h3 className="text-white font-semibold">{mockConsultation.doctor.name}</h3>
              <p className="text-gray-400 text-sm">{mockConsultation.doctor.specialty}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-white text-sm">{connectionStatus === "connected" ? "Connected" : "Disconnected"}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <FaClock />
            <span>{formatDuration(callDuration)}</span>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Doctor's Video (Main) */}
        <div className="h-full bg-gray-800 flex items-center justify-center">
          {isVideoOn ? (
            <div className="text-center">
              <div className="text-9xl mb-4">{mockConsultation.doctor.avatar}</div>
              <p className="text-white text-xl">{mockConsultation.doctor.name}</p>
            </div>
          ) : (
            <div className="text-center">
              <FaVideoSlash className="text-gray-600 text-6xl mx-auto mb-4" />
              <p className="text-gray-400">Video is turned off</p>
            </div>
          )}
        </div>

        {/* Patient's Video (PiP) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg shadow-lg border-2 border-gray-600">
          {isVideoOn ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl">{mockConsultation.patient.avatar}</div>
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
              <h3 className="font-semibold">Chat</h3>
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
                  className={`mb-4 ${message.sender === "patient" ? "text-right" : "text-left"}`}
                >
                  <div className={`inline-block p-3 rounded-lg max-w-xs ${
                    message.sender === "patient"
                      ? "bg-primary-blue text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}>
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === "patient" ? "text-blue-100" : "text-gray-500"
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

        {/* Quick Actions */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 space-y-3">
          <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100">
            <FaFileMedical className="text-gray-700" />
          </button>
          <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100">
            <FaNotesMedical className="text-gray-700" />
          </button>
          <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100">
            <FaFileDownload className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
              } hover:opacity-80 relative`}
            >
              <FaComments />
              {messages.length > 0 && !showChat && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {messages.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-3 rounded-full bg-gray-700 text-white hover:opacity-80"
            >
              {isFullScreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
          
          <button
            onClick={() => setShowEndCallConfirm(true)}
            className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center gap-2"
          >
            <FaPhone className="rotate-135" />
            End Call
          </button>
        </div>
      </div>

      {/* End Call Confirmation Modal */}
      {showEndCallConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-xl" />
              <h3 className="text-lg font-semibold">End Consultation?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end this consultation? Make sure you have discussed all your concerns with the doctor.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndCallConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Continue Call
              </button>
              <button
                onClick={handleEndCall}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}