// components/VideoConsultation.tsx
// Updated to use the enhanced WebRTC hook and mobile-responsive UI

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'
import { useWebRTC } from '@/hooks/useWebRTC' // This should be the enhanced version
import VideoCallRoom from './VideoCallRoom' // New mobile-responsive component
import { Patient } from '@/lib/data/patients'
import { Doctor } from '@/lib/data/doctors'
import { 
  FaVideo, 
  FaVideoSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaPhone,
  FaClock,
  FaCalendarAlt,
  FaStethoscope,
  FaUser,
  FaUserMd,
  FaDownload,
  FaPrescriptionBottle
} from 'react-icons/fa'

interface Props {
  patientData?: Patient
  doctorData?: Doctor
}

type UserType = 'doctor' | 'patient'

interface VideoAppointment {
  id: string
  type: 'video'
  doctorId?: string
  doctorName?: string
  patientId?: string
  patientName?: string
  specialty?: string
  date: string
  time: string
  reason?: string
  roomId: string
}

const VideoConsultation: React.FC<Props> = ({ patientData, doctorData }) => {
  const router = useRouter()
  const { socket } = useSocket()
  
  const [isInCall, setIsInCall] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<VideoAppointment | null>(null)
  const [roomId, setRoomId] = useState<string>('')
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Determine user info based on whether it's patient or doctor
  const userInfo = patientData ? {
    id: patientData.id,
    name: `${patientData.firstName} ${patientData.lastName}`,
    type: 'patient' as UserType
  } : {
    id: doctorData?.id || '',
    name: `Dr. ${doctorData?.firstName} ${doctorData?.lastName}`,
    type: 'doctor' as UserType
  }
  
  // Get video appointments
  const videoAppointments: VideoAppointment[] = (() => {
    if (patientData) {
      return patientData.upcomingAppointments?.filter(apt => apt.type === 'video') as VideoAppointment[] || []
    } else if (doctorData) {
      return doctorData.upcomingAppointments?.filter(apt => apt.type === 'video') as VideoAppointment[] || []
    }
    return []
  })()
  
  // Use the enhanced WebRTC hook
  const {
    peers,
    remoteStreams,
    chatMessages,
    roomParticipants,
    isScreenSharing,
    connectionStatus,
    isReconnecting, // New state from enhanced hook
    sendChatMessage,
    toggleVideo: toggleVideoWebRTC,
    toggleAudio: toggleAudioWebRTC,
    startScreenShare,
    stopScreenShare
  } = useWebRTC({
    socket,
    roomId,
    userId: userInfo.id,
    userName: userInfo.name,
    userType: userInfo.type,
    localStream
  })
  
  // Initialize selected appointment
  useEffect(() => {
    if (videoAppointments.length > 0 && !selectedAppointment) {
      setSelectedAppointment(videoAppointments[0])
    }
  }, [videoAppointments, selectedAppointment])
  
  // Handle call duration
  useEffect(() => {
    if (isInCall) {
      callIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    } else {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current)
      }
      setCallDuration(0)
    }
    
    return () => {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current)
      }
    }
  }, [isInCall])
  
  // Cleanup media stream on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [localStream])
  
  const joinCall = async (appointment: VideoAppointment) => {
    if (!appointment.roomId) {
      alert('No room ID found for this appointment')
      return
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      setLocalStream(stream)
      setSelectedAppointment(appointment)
      setRoomId(appointment.roomId)
      setIsInCall(true)
      
      // Store call data for recovery
      const callData = {
        appointment,
        userId: userInfo.id,
        userName: userInfo.name,
        userType: userInfo.type,
        roomId: appointment.roomId,
        startTime: new Date().toISOString()
      }
      sessionStorage.setItem(`active_call_${appointment.roomId}`, JSON.stringify(callData))
      
    } catch (error) {
      console.error('Failed to initialize media:', error)
      alert('Failed to access camera/microphone. Please check permissions.')
    }
  }
  
  const endCall = () => {
    // Clean up media stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop()
      })
    }
    
    // Clean up WebRTC connections
    if (socket) {
      socket.emit('leave-room')
    }
    
    // Clear session storage
    if (roomId) {
      sessionStorage.removeItem(`active_call_${roomId}`)
    }
    
    // Reset states
    setIsInCall(false)
    setLocalStream(null)
    setRoomId('')
    setCallDuration(0)
  }
  
  const handleToggleVideo = () => {
    const newState = !isVideoOn
    setIsVideoOn(newState)
    toggleVideoWebRTC(newState)
  }
  
  const handleToggleMic = () => {
    const newState = !isMicOn
    setIsMicOn(newState)
    toggleAudioWebRTC(newState)
  }
  
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare()
    } else {
      await startScreenShare()
    }
  }
  
  const handleToggleChat = () => {
    setShowChat(!showChat)
  }
  
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      sendChatMessage(chatMessage)
      setChatMessage('')
    }
  }
  
  // Show waiting room if not in call
  if (!isInCall) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FaStethoscope className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Video Consultation</h2>
                  {selectedAppointment && (
                    <p className="text-blue-100">
                      {patientData ? `with ${selectedAppointment.doctorName}` : `with ${selectedAppointment.patientName}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative bg-gray-900 h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaClock className="text-4xl animate-pulse" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Waiting Room</h3>
              
              {selectedAppointment ? (
                <>
                  <p className="text-blue-100 mb-6">
                    Your consultation is scheduled for {selectedAppointment.time}
                  </p>
                  <p className="text-sm text-blue-200 mb-8">
                    Room ID: {selectedAppointment.roomId}
                  </p>
                  
                  <button
                    onClick={() => joinCall(selectedAppointment)}
                    className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all transform hover:scale-105"
                  >
                    Join Consultation
                  </button>
                </>
              ) : (
                <p className="text-gray-400">No video consultations scheduled</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Show upcoming video appointments */}
        {videoAppointments.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Upcoming Video Consultations
            </h3>
            <div className="space-y-3">
              {videoAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  onClick={() => setSelectedAppointment(appointment)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all ${
                    selectedAppointment?.id === appointment.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                        {patientData ? <FaUserMd /> : <FaUser />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {patientData ? appointment.doctorName : appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                    </div>
                    {selectedAppointment?.id === appointment.id && (
                      <span className="text-sm text-blue-600 font-medium">Selected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  
  // Render the mobile-responsive video call room
  return (
    <>
      <VideoCallRoom
        localStream={localStream}
        remoteStreams={remoteStreams}
        isVideoOn={isVideoOn}
        isMicOn={isMicOn}
        isScreenSharing={isScreenSharing}
        isReconnecting={isReconnecting}
        connectionStatus={connectionStatus}
        callDuration={callDuration}
        onToggleVideo={handleToggleVideo}
        onToggleMic={handleToggleMic}
        onToggleScreenShare={handleToggleScreenShare}
        onEndCall={endCall}
        onToggleChat={handleToggleChat}
        participantName={userInfo.name}
        remoteParticipantName={
          patientData 
            ? selectedAppointment?.doctorName 
            : selectedAppointment?.patientName
        }
      />
      
      {/* Chat Overlay (Mobile Friendly) */}
      {showChat && (
        <div className="fixed bottom-20 right-0 w-full sm:w-96 h-96 bg-white shadow-2xl z-50 rounded-t-2xl sm:rounded-l-2xl">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Chat</h3>
              <button
                onClick={handleToggleChat}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.socketId === socket?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.socketId === socket?.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-xs opacity-75">{msg.userName}</p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VideoConsultation