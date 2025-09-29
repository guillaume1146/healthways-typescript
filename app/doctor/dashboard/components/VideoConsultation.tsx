// components/VideoConsultation.tsx
// Enhanced version with database session management

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useWebRTC } from '@/hooks/useWebRTC'
import VideoCallRoom from './VideoCallRoom'
import { Patient } from '@/lib/data/patients'
import { Doctor } from '@/lib/data/doctors'
import { 
  FaVideoSlash, 
  FaClock,
  FaStethoscope,
  FaUser,
  FaUserMd,
  FaSync,
  FaWifi,
  FaExclamationTriangle,
  FaCheckCircle,
  FaDatabase,
  FaRedo
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

interface SessionData {
  sessionId: string
  roomId: string
  status: string
  isActive: boolean
  canRecover: boolean
}

const VideoConsultation: React.FC<Props> = ({ patientData, doctorData }) => {
  const { 
    socket, 
    connected, 
    isReconnecting: socketReconnecting,
    reconnectAttempts,
    serverStatus,
    saveRoomState, 
    clearRoomState,
    manualReconnect 
  } = useSocket()
  
  const [isInCall, setIsInCall] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<VideoAppointment | null>(null)
  const [roomId, setRoomId] = useState<string>('')
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [mediaError, setMediaError] = useState<string>('')
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [recoveryAvailable, setRecoveryAvailable] = useState(false)
  const [connectionHealth, setConnectionHealth] = useState<'good' | 'poor' | 'recovering'>('good')
  
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const callStartTime = useRef<number | null>(null)
  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null)
  
  // Determine user info
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
  
  // Use enhanced WebRTC hook
  const {
    remoteStreams,
    chatMessages,
    isScreenSharing,
    connectionStatus,
    isReconnecting: webrtcReconnecting,
    sessionId,
    sendChatMessage,
    toggleVideo: toggleVideoWebRTC,
    toggleAudio: toggleAudioWebRTC,
    startScreenShare,
    stopScreenShare,
    triggerIceRestart,
    requestRecovery
  } = useWebRTC({
    socket,
    roomId,
    userId: userInfo.id,
    userName: userInfo.name,
    userType: userInfo.type,
    localStream,
    saveRoomState,
    clearRoomState
  })
  
  // Combined reconnection status
  const isReconnecting = socketReconnecting || webrtcReconnecting
  
  // Monitor connection health
  useEffect(() => {
    if (connectionStatus === 'connected') {
      setConnectionHealth('good')
    } else if (connectionStatus === 'reconnecting' || isReconnecting) {
      setConnectionHealth('recovering')
    } else if (connectionStatus === 'failed') {
      setConnectionHealth('poor')
    }
  }, [connectionStatus, isReconnecting])
  
  // Create or update database session
  const createDatabaseSession = async (roomId: string) => {
    try {
      const response = await fetch('/api/webrtc/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          userId: userInfo.id,
          userName: userInfo.name,
          userType: userInfo.type
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSessionData({
          sessionId: data.data.session.id,
          roomId: data.data.session.roomId,
          status: data.data.session.status,
          isActive: true,
          canRecover: true
        })
        console.log('Database session created:', data.data.session.id)
      }
    } catch (error) {
      console.error('Failed to create database session:', error)
    }
  }
  
  // Check for existing session
  const checkExistingSession = async (roomId: string) => {
    try {
      const response = await fetch(`/api/webrtc/session?roomId=${roomId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data.isActive) {
          setSessionData({
            sessionId: data.data.id,
            roomId: data.data.roomId,
            status: data.data.status,
            isActive: data.data.isActive,
            canRecover: true
          })
          setRecoveryAvailable(true)
          return data.data
        }
      }
    } catch (error) {
      console.error('Failed to check existing session:', error)
    }
    return null
  }
  
  // Request recovery from database
  const requestDatabaseRecovery = async () => {
    if (!roomId || !userInfo.id) return
    
    try {
      const response = await fetch('/api/webrtc/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          userId: userInfo.id
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.canRecover) {
          console.log('Recovery available:', data.data)
          setRecoveryAvailable(true)
          
          // Re-initialize media and join
          await initializeMediaAndJoin(selectedAppointment!)
        } else {
          console.log('Recovery not available:', data.reason)
          setRecoveryAvailable(false)
        }
      }
    } catch (error) {
      console.error('Failed to request recovery:', error)
    }
  }
  
  // Periodic session health check
  useEffect(() => {
    if (!isInCall || !sessionData) return
    
    sessionCheckInterval.current = setInterval(async () => {
      try {
        const response = await fetch('/api/webrtc/session', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionData.sessionId,
            userId: userInfo.id,
            connectionState: connectionStatus,
            iceState: connectionHealth === 'good' ? 'connected' : 'checking'
          })
        })
        
        if (!response.ok) {
          console.error('Failed to update session health')
        }
      } catch (error) {
        console.error('Session health check failed:', error)
      }
    }, 30000) // Every 30 seconds
    
    return () => {
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current)
      }
    }
  }, [isInCall, sessionData, connectionStatus, connectionHealth, userInfo.id])
  
  // Initialize media and join call
  const initializeMediaAndJoin = async (appointment: VideoAppointment) => {
    try {
      setMediaError('')
      
      // Check for existing session first
      const existingSession = await checkExistingSession(appointment.roomId)
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        }
      })
      
      setLocalStream(stream)
      setRoomId(appointment.roomId)
      setIsInCall(true)
      
      // Create database session if not exists
      if (!existingSession) {
        await createDatabaseSession(appointment.roomId)
      }
      
      // Save state for recovery
      const callData = {
        appointment,
        userId: userInfo.id,
        userName: userInfo.name,
        userType: userInfo.type,
        roomId: appointment.roomId,
        sessionId: existingSession?.id || sessionId,
        startTime: new Date().toISOString()
      }
      
      sessionStorage.setItem(`active_call_${appointment.roomId}`, JSON.stringify(callData))
      
      saveRoomState({
        roomId: appointment.roomId,
        userId: userInfo.id,
        userName: userInfo.name,
        userType: userInfo.type,
        sessionId: existingSession?.id || sessionId
      })
      
    } catch (error) {
      console.error('Failed to initialize media:', error)
      if (error instanceof Error) {
        setMediaError(error.message || 'Failed to access camera/microphone')
      } else {
        setMediaError('Failed to access camera/microphone')
      }
    }
  }
  
  // Join call handler
  const joinCall = async (appointment: VideoAppointment) => {
    if (!appointment.roomId) {
      alert('No room ID found for this appointment')
      return
    }
    
    setSelectedAppointment(appointment)
    await initializeMediaAndJoin(appointment)
  }
  
  // Recover session
  const recoverSession = async () => {
    console.log('Attempting session recovery...')
    await requestDatabaseRecovery()
    requestRecovery() // WebRTC recovery
  }
  
  // End call with database cleanup
  const endCall = async () => {
    // Update database session
    if (sessionData) {
      try {
        await fetch(`/api/webrtc/session?sessionId=${sessionData.sessionId}&userId=${userInfo.id}`, {
          method: 'DELETE'
        })
      } catch (error) {
        console.error('Failed to end database session:', error)
      }
    }
    
    // Clear persisted states
    if (roomId) {
      sessionStorage.removeItem(`active_call_${roomId}`)
    }
    clearRoomState()
    
    // Clean up media stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop()
      })
    }
    
    // Leave room
    if (socket && socket.connected) {
      socket.emit('leave-room')
    }
    
    // Reset all states
    setIsInCall(false)
    setLocalStream(null)
    setRoomId('')
    setCallDuration(0)
    setSessionData(null)
    setRecoveryAvailable(false)
    callStartTime.current = null
    setMediaError('')
  }
  
  // Restore call state on mount
  useEffect(() => {
    const restoreCallState = async () => {
      const activeCallKeys = Object.keys(sessionStorage).filter(key => 
        key.startsWith('active_call_')
      )
      
      if (activeCallKeys.length > 0) {
        try {
          const callData = JSON.parse(sessionStorage.getItem(activeCallKeys[0]) || '{}')
          
          if (callData.roomId && callData.appointment) {
            console.log('Restoring previous call state:', callData)
            
            setSelectedAppointment(callData.appointment)
            setRoomId(callData.roomId)
            
            // Check if session is still active in database
            const session = await checkExistingSession(callData.roomId)
            if (session) {
              await initializeMediaAndJoin(callData.appointment)
            } else {
              // Session expired, clear state
              sessionStorage.removeItem(activeCallKeys[0])
            }
          }
        } catch (error) {
          console.error('Failed to restore call state:', error)
          sessionStorage.clear()
        }
      }
    }
    
    restoreCallState()
  }, [])
  
  // Handle call duration
  useEffect(() => {
    if (isInCall) {
      if (!callStartTime.current) {
        callStartTime.current = Date.now()
      }
      
      callIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - callStartTime.current!) / 1000)
        setCallDuration(elapsed)
      }, 1000)
    } else {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current)
      }
      if (!isReconnecting) {
        setCallDuration(0)
        callStartTime.current = null
      }
    }
    
    return () => {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current)
      }
    }
  }, [isInCall, isReconnecting])
  
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
  
  const retryConnection = () => {
    console.log('Manual reconnection attempt')
    manualReconnect()
    triggerIceRestart()
  }
  
  // Connection status banner
  const renderConnectionStatus = () => {
    if (!connected && !socketReconnecting) {
      return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3 flex items-center justify-center">
          <FaExclamationTriangle className="mr-2" />
          <span>Connection lost. Attempting to reconnect...</span>
          <button 
            onClick={retryConnection}
            className="ml-4 px-3 py-1 bg-white text-red-600 rounded hover:bg-gray-100"
          >
            Retry Now
          </button>
        </div>
      )
    }
    
    if (socketReconnecting) {
      return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-600 text-white p-3 flex items-center justify-center">
          <FaSync className="mr-2 animate-spin" />
          <span>Reconnecting... (Attempt #{reconnectAttempts})</span>
        </div>
      )
    }
    
    if (sessionData && recoveryAvailable && !isInCall) {
      return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-3 flex items-center justify-center">
          <FaDatabase className="mr-2" />
          <span>Previous session found. </span>
          <button 
            onClick={recoverSession}
            className="ml-4 px-3 py-1 bg-white text-blue-600 rounded hover:bg-gray-100 flex items-center"
          >
            <FaRedo className="mr-1" />
            Recover Session
          </button>
        </div>
      )
    }
    
    return null
  }
  
  // Connection health indicator
  const renderConnectionHealth = () => {
    if (!isInCall) return null
    
    return (
      <div className="absolute top-20 right-4 bg-black/70 text-white px-3 py-2 rounded-lg flex items-center gap-2 z-40">
        {connectionHealth === 'good' && (
          <>
            <FaCheckCircle className="text-green-500" />
            <span className="text-sm">Connection Good</span>
          </>
        )}
        {connectionHealth === 'poor' && (
          <>
            <FaExclamationTriangle className="text-red-500" />
            <span className="text-sm">Poor Connection</span>
            <button 
              onClick={triggerIceRestart}
              className="ml-2 text-xs bg-red-500 px-2 py-1 rounded hover:bg-red-600"
            >
              Fix
            </button>
          </>
        )}
        {connectionHealth === 'recovering' && (
          <>
            <FaSync className="text-yellow-500 animate-spin" />
            <span className="text-sm">Recovering...</span>
          </>
        )}
        {sessionData && (
          <span className="text-xs opacity-70 ml-2">
            Session: {sessionData.sessionId.substring(0, 8)}
          </span>
        )}
      </div>
    )
  }
  
  // Media error screen
  if (mediaError && !localStream) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center max-w-md">
          <div className="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaVideoSlash className="text-2xl" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Media Access Error</h2>
          <p className="text-gray-400 mb-6">{mediaError}</p>
          <div className="space-y-3">
            <button 
              onClick={() => selectedAppointment && joinCall(selectedAppointment)}
              className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Try Again
            </button>
            <button 
              onClick={endCall}
              className="w-full text-gray-400 hover:text-white transition"
            >
              Cancel Call
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Show waiting room if not in call
  if (!isInCall) {
    return (
      <>
        {renderConnectionStatus()}
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
                <div className="flex items-center gap-2">
                  {connected ? (
                    <div className="flex items-center text-green-300">
                      <FaWifi className="mr-2" />
                      <span className="text-sm">Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-300">
                      <FaSync className="mr-2 animate-spin" />
                      <span className="text-sm">Connecting...</span>
                    </div>
                  )}
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
                      disabled={!connected}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all transform ${
                        connected 
                          ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105' 
                          : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {connected ? 'Join Consultation' : 'Waiting for connection...'}
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400">No video consultations scheduled</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Appointment list */}
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
      </>
    )
  }
  
  // Render video call room
  return (
    <>
      {renderConnectionStatus()}
      {renderConnectionHealth()}
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
      
      {/* Chat Overlay */}
      {showChat && (
        <div className="fixed bottom-20 right-0 w-full sm:w-96 h-96 bg-white shadow-2xl z-50 rounded-t-2xl sm:rounded-l-2xl">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Chat</h3>
              <button
                onClick={handleToggleChat}
                className="text-gray-500 hover:text-gray-700 text-2xl"
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