import React, { useState, useEffect, useRef } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaVideo, 
  FaVideoSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaPhone, 
  FaExpand, 
  FaCompress, 
  FaDesktop,
  FaCamera,
  FaCog,
  FaVolumeUp,
  FaVolumeOff,
  FaUsers,
  FaComments,
  FaPaperPlane,
  FaFileAlt,
  FaDownload,
  FaRecordVinyl,
  FaStop,
  FaPlay,
  FaClock,
  FaWifi,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaHeart,
  FaThermometerHalf,
  FaNotesMedical,
  FaPrescriptionBottle,
  FaCalendarAlt,
  FaStethoscope,
  FaEye,
  FaHandPaper,
  FaMoon,
  FaSun,
  FaAdjust,
  FaBars,
  FaTimes,
  FaCheck,
  FaUserMd,
  FaUser
} from 'react-icons/fa'

interface Props {
  patientData: Patient
}

interface CallParticipant {
  id: string
  name: string
  role: 'doctor' | 'nurse' | 'patient' | 'specialist'
  avatar?: string
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor'
}

interface CallStats {
  duration: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  latency: number
  bitrate: string
  resolution: string
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: Date
  type: 'text' | 'system'
}

const VideoConsultation: React.FC<Props> = ({ patientData }) => {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [participants, setParticipants] = useState<CallParticipant[]>([])
  const [callStats, setCallStats] = useState<CallStats>({
    duration: 0,
    quality: 'excellent',
    latency: 45,
    bitrate: '1.2 Mbps',
    resolution: '1080p'
  })
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newChatMessage, setNewChatMessage] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const [waitingForDoctor, setWaitingForDoctor] = useState(true)
  const [callNotes, setCallNotes] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [brightness, setBrightness] = useState(50)
  const [contrast, setContrast] = useState(50)
  const [volume, setVolume] = useState(80)

  const videoRef = useRef<HTMLVideoElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const upcomingVideoAppointment = patientData.upcomingAppointments?.find(apt => apt.type === 'video')

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
        setCallStats(prev => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isInCall])

  useEffect(() => {
    if (upcomingVideoAppointment) {
      // Simulate participants joining
      setParticipants([
        {
          id: patientData.id,
          name: `${patientData.firstName} ${patientData.lastName}`,
          role: 'patient',
          isVideoEnabled: isVideoOn,
          isAudioEnabled: isMicOn,
          isScreenSharing: false,
          connectionQuality: 'excellent'
        },
        {
          id: upcomingVideoAppointment.doctorId,
          name: upcomingVideoAppointment.doctorName,
          role: 'doctor',
          isVideoEnabled: true,
          isAudioEnabled: true,
          isScreenSharing: false,
          connectionQuality: 'good'
        }
      ])

      // Simulate initial chat messages
      setChatMessages([
        {
          id: '1',
          sender: 'System',
          message: 'Video consultation room is ready',
          timestamp: new Date(),
          type: 'system'
        }
      ])
    }
  }, [upcomingVideoAppointment, patientData, isVideoOn, isMicOn])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const joinCall = () => {
    setIsInCall(true)
    setWaitingForDoctor(false)
    addChatMessage('System', `${patientData.firstName} joined the call`, 'system')
    
    // Simulate doctor joining after a delay
    setTimeout(() => {
      if (upcomingVideoAppointment) {
        addChatMessage('System', `${upcomingVideoAppointment.doctorName} joined the call`, 'system')
      }
    }, 2000)
  }

  const endCall = () => {
    setIsInCall(false)
    setCallDuration(0)
    addChatMessage('System', 'Call ended', 'system')
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    setParticipants(prev => 
      prev.map(p => 
        p.id === patientData.id 
          ? { ...p, isVideoEnabled: !isVideoOn }
          : p
      )
    )
  }

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
    setParticipants(prev => 
      prev.map(p => 
        p.id === patientData.id 
          ? { ...p, isAudioEnabled: !isMicOn }
          : p
      )
    )
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    setParticipants(prev => 
      prev.map(p => 
        p.id === patientData.id 
          ? { ...p, isScreenSharing: !isScreenSharing }
          : p
      )
    )
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    addChatMessage('System', isRecording ? 'Recording stopped' : 'Recording started', 'system')
  }

  const addChatMessage = (sender: string, message: string, type: 'text' | 'system' = 'text') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      message,
      timestamp: new Date(),
      type
    }
    setChatMessages(prev => [...prev, newMessage])
  }

  const sendChatMessage = () => {
    if (newChatMessage.trim()) {
      addChatMessage(`${patientData.firstName} ${patientData.lastName}`, newChatMessage)
      setNewChatMessage('')
    }
  }

  const getConnectionIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <FaWifi className="text-green-500" />
      case 'good': return <FaWifi className="text-blue-500" />
      case 'fair': return <FaWifi className="text-yellow-500" />
      case 'poor': return <FaWifi className="text-red-500" />
      default: return <FaWifi className="text-gray-500" />
    }
  }

  if (!upcomingVideoAppointment && patientData.videoCallHistory?.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center border border-gray-100">
        <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <FaVideo className="text-blue-500 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Video Consultations</h3>
        <p className="text-gray-500 mb-6">You do not have any upcoming video consultations</p>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all">
          Schedule Video Consultation
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Video Consultation Interface */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaStethoscope className="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Video Consultation</h2>
                {upcomingVideoAppointment && (
                  <p className="text-blue-100">
                    with {upcomingVideoAppointment.doctorName} • {upcomingVideoAppointment.specialty}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              {isInCall ? (
                <div>
                  <p className="text-sm text-blue-100">Call Duration</p>
                  <p className="text-2xl font-bold">{formatDuration(callDuration)}</p>
                </div>
              ) : upcomingVideoAppointment ? (
                <div>
                  <p className="text-sm text-blue-100">Scheduled</p>
                  <p className="text-lg font-bold">
                    {new Date(upcomingVideoAppointment.date).toLocaleDateString()} at {upcomingVideoAppointment.time}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Video Area */}
        <div className="relative bg-gray-900 h-96 lg:h-[500px]">
          {isInCall ? (
            <div className="h-full flex">
              {/* Main video area */}
              <div className="flex-1 relative">
                {isScreenSharing ? (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <FaDesktop className="text-6xl mb-4 mx-auto" />
                      <p className="text-xl">Screen sharing active</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUserMd className="text-4xl" />
                      </div>
                      <p className="text-xl font-semibold">{upcomingVideoAppointment?.doctorName}</p>
                      <p className="text-blue-100">{upcomingVideoAppointment?.specialty}</p>
                    </div>
                  </div>
                )}

                {/* Video overlay controls */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="p-3 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition"
                    >
                      <FaCog className="text-xl" />
                    </button>
                    <button
                      onClick={() => setIsFullScreen(!isFullScreen)}
                      className="p-3 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition"
                    >
                      {isFullScreen ? <FaCompress className="text-xl" /> : <FaExpand className="text-xl" />}
                    </button>
                  </div>
                </div>

                {/* Connection quality indicator */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg px-3 py-2 text-white text-sm flex items-center space-x-2">
                  {getConnectionIcon(callStats.quality)}
                  <span className="capitalize">{callStats.quality}</span>
                </div>

                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 right-4 bg-red-500 rounded-lg px-3 py-2 text-white text-sm flex items-center space-x-2">
                    <FaRecordVinyl className="animate-pulse" />
                    <span>Recording</span>
                  </div>
                )}
              </div>

              {/* Participants sidebar */}
              <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <FaUsers className="mr-2" />
                  Participants ({participants.length})
                </h3>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{participant.name}</p>
                            <p className="text-gray-300 text-xs capitalize">{participant.role}</p>
                          </div>
                        </div>
                        {getConnectionIcon(participant.connectionQuality)}
                      </div>
                      <div className="flex space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          participant.isVideoEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {participant.isVideoEnabled ? 'Video On' : 'Video Off'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          participant.isAudioEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {participant.isAudioEnabled ? 'Audio On' : 'Audio Off'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live notes section */}
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-2">Live Notes</h4>
                  <textarea
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Take notes during the consultation..."
                    className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ) : waitingForDoctor ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaClock className="text-4xl animate-pulse" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Waiting Room</h3>
                <p className="text-blue-100 mb-6">
                  Your consultation with {upcomingVideoAppointment?.doctorName} is about to begin
                </p>
                <p className="text-sm text-blue-200 mb-8">
                  Scheduled for {new Date(upcomingVideoAppointment?.date || '').toLocaleDateString()} 
                  at {upcomingVideoAppointment?.time}
                </p>
                
                {/* Pre-call setup */}
                <div className="bg-black bg-opacity-30 rounded-xl p-6 max-w-md mx-auto">
                  <h4 className="text-lg font-semibold mb-4">Check Your Setup</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Camera</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${isVideoOn ? 'text-green-400' : 'text-red-400'}`}>
                          {isVideoOn ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          onClick={toggleVideo}
                          className={`p-2 rounded-full ${isVideoOn ? 'bg-green-500' : 'bg-red-500'} text-white`}
                        >
                          {isVideoOn ? <FaVideo /> : <FaVideoSlash />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Microphone</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${isMicOn ? 'text-green-400' : 'text-red-400'}`}>
                          {isMicOn ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          onClick={toggleMic}
                          className={`p-2 rounded-full ${isMicOn ? 'bg-green-500' : 'bg-red-500'} text-white`}
                        >
                          {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={joinCall}
                  className="mt-8 px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all transform hover:scale-105"
                >
                  Join Consultation
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-white">
                <FaCheckCircle className="text-6xl text-green-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Ready to Connect</h3>
                <p className="text-gray-300 mb-4">Your video consultation is ready to begin</p>
                <button
                  onClick={joinCall}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Join Call
                </button>
              </div>
            </div>
          )}

          {/* Picture-in-picture self view */}
          {isInCall && (
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto">
                    <FaUser className="text-sm" />
                  </div>
                  <p className="text-xs mt-1">You</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        {isInCall && (
          <div className="bg-gray-800 p-4">
            <div className="flex items-center justify-between">
              {/* Left controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="text-white hover:text-blue-400 transition"
                >
                  <FaWifi className="text-lg" />
                </button>
                
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="text-white hover:text-blue-400 transition relative"
                >
                  <FaComments className="text-lg" />
                  {chatMessages.filter(m => m.type === 'text').length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {chatMessages.filter(m => m.type === 'text').length}
                    </span>
                  )}
                </button>
              </div>

              {/* Center controls */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={toggleMic}
                  className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                    isMicOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {isMicOn ? <FaMicrophone className="text-xl" /> : <FaMicrophoneSlash className="text-xl" />}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                    isVideoOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {isVideoOn ? <FaVideo className="text-xl" /> : <FaVideoSlash className="text-xl" />}
                </button>

                <button
                  onClick={toggleScreenShare}
                  className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                    isScreenSharing ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <FaDesktop className="text-xl" />
                </button>

                <button
                  onClick={toggleRecording}
                  className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                    isRecording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {isRecording ? <FaStop className="text-xl" /> : <FaRecordVinyl className="text-xl" />}
                </button>

                <button
                  onClick={endCall}
                  className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <FaPhone className="rotate-135" />
                  <span className="font-semibold">End Call</span>
                </button>
              </div>

              {/* Right controls */}
              <div className="flex items-center space-x-4">
                <div className="text-white text-sm">
                  <FaClock className="inline mr-1" />
                  {formatDuration(callDuration)}
                </div>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-blue-400 transition"
                >
                  <FaCog className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {showChat && isInCall && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-80 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`${
                  message.type === 'system'
                    ? 'text-center text-gray-500 text-sm italic'
                    : message.sender.includes(patientData.firstName)
                    ? 'text-right'
                    : 'text-left'
                }`}
              >
                {message.type === 'system' ? (
                  <p>{message.message}</p>
                ) : (
                  <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender.includes(patientData.firstName)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-xs font-medium mb-1">{message.sender}</p>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender.includes(patientData.firstName) ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={sendChatMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Stats */}
      {showStats && isInCall && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Call Statistics</h3>
            <button
              onClick={() => setShowStats(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FaClock className="text-blue-500 text-2xl mx-auto mb-2" />
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-lg font-bold text-gray-900">{formatDuration(callStats.duration)}</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <FaWifi className="text-green-500 text-2xl mx-auto mb-2" />
              <p className="text-sm text-gray-600">Quality</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{callStats.quality}</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FaHeart className="text-purple-500 text-2xl mx-auto mb-2" />
              <p className="text-sm text-gray-600">Latency</p>
              <p className="text-lg font-bold text-gray-900">{callStats.latency}ms</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <FaDesktop className="text-orange-500 text-2xl mx-auto mb-2" />
              <p className="text-sm text-gray-600">Resolution</p>
              <p className="text-lg font-bold text-gray-900">{callStats.resolution}</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Video Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Video Settings */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Video</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Brightness</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Dark</span>
                    <span>{brightness}%</span>
                    <span>Bright</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Contrast</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>{contrast}%</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Audio Settings */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Audio</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Mute</span>
                    <span>{volume}%</span>
                    <span>Max</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-700">Noise Cancellation</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Echo Reduction</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pre-call Checklist */}
      {!isInCall && upcomingVideoAppointment && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pre-Consultation Checklist</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                Technical Setup
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 ml-6">
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-xs" />
                  Test your camera and microphone
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-xs" />
                  Ensure stable internet connection
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-xs" />
                  Find a quiet, well-lit space
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-xs" />
                  Close unnecessary applications
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center">
                <FaNotesMedical className="text-blue-500 mr-2" />
                Medical Preparation
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 ml-6">
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-xs" />
                  Have your medical records ready
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-xs" />
                  Prepare your questions for the doctor
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-xs" />
                  List current medications
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-2 text-xs" />
                  Note any symptoms or concerns
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Video Call History */}
      {patientData.videoCallHistory && patientData.videoCallHistory.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaFileAlt className="mr-2 text-purple-500" />
            Previous Video Consultations
          </h3>
          <div className="space-y-4">
            {patientData.videoCallHistory.map((call) => (
              <div key={call.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                      <FaVideo />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{call.withName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(call.date).toLocaleDateString()} • {call.startTime} - {call.endTime}
                      </p>
                      <p className="text-sm text-gray-500">Duration: {call.duration} minutes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      call.callQuality === 'excellent' ? 'bg-green-100 text-green-800' :
                      call.callQuality === 'good' ? 'bg-blue-100 text-blue-800' :
                      call.callQuality === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {call.callQuality} quality
                    </span>
                    {call.recording && (
                      <div className="mt-2">
                        <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <FaDownload />
                          Download Recording
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {call.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {call.notes}
                    </p>
                  </div>
                )}
                {call.prescription && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700">
                      <FaPrescriptionBottle className="inline mr-1" />
                      Prescription issued during this call
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoConsultation