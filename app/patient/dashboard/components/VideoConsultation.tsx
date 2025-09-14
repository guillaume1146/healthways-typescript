'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'
import { useWebRTC } from '@/hooks/useWebRTC'
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
  FaCog,
  FaComments,
  FaPaperPlane,
  FaRecordVinyl,
  FaStop,
  FaClock,
  FaWifi,
  FaCalendarAlt,
  FaStethoscope,
  FaUserMd,
  FaUser,
  FaSync,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaNotesMedical,
  FaPrescriptionBottle,
  FaDownload
} from 'react-icons/fa'

interface Props {
  patientData: Patient
}

type UserType = 'doctor' | 'patient'

interface Participant {
  socketId: string
  userId: string
  userName: string
  userType: UserType
}

interface ChatMessage {
  id: string
  socketId: string
  userName: string
  message: string
  timestamp: number | string
}

interface DestroyablePeer { destroy?: () => void }
interface PeerWrapper { peer?: DestroyablePeer }

interface UseWebRTCReturn {
  peers: PeerWrapper[]
  remoteStreams: Map<string, MediaStream>
  chatMessages: ChatMessage[]
  roomParticipants: Participant[]
  isScreenSharing: boolean
  sendChatMessage: (text: string) => void
  toggleVideo: (enabled: boolean) => void
  toggleAudio: (enabled: boolean) => void
  startScreenShare: () => Promise<void>
  stopScreenShare: () => void
}

interface CallStats {
  duration: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  latency: number
  bitrate: string
  resolution: string
}

/** Concrete shape for a patient's video appointment */
interface PatientVideoAppointment {
  id: string
  type: 'video'
  doctorId: string
  doctorName: string
  specialty: string
  date: string
  time: string
  reason?: string
  roomId: string
}

/** Narrow unknown into PatientVideoAppointment safely */
const isPatientVideoAppointment = (obj: unknown): obj is PatientVideoAppointment => {
  if (typeof obj !== 'object' || obj === null) return false
  const o = obj as Record<string, unknown>
  const isString = (v: unknown) => typeof v === 'string'
  return (
    o.type === 'video' &&
    isString(o.id) &&
    isString(o.doctorId) &&
    isString(o.doctorName) &&
    isString(o.specialty) &&
    isString(o.date) &&
    isString(o.time) &&
    isString(o.roomId)
  )
}

const VideoConsultation: React.FC<Props> = ({ patientData }) => {
  const router = useRouter()
  const { socket } = useSocket()
  
  const [isInCall, setIsInCall] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<PatientVideoAppointment | null>(null)
  const [roomId, setRoomId] = useState<string>('')

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [newChatMessage, setNewChatMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [callNotes, setCallNotes] = useState('')
  const [waitingForDoctor, setWaitingForDoctor] = useState(true)
  const [brightness, setBrightness] = useState(50)
  const [contrast, setContrast] = useState(50)
  const [volume, setVolume] = useState(80)
  const [mediaError, setMediaError] = useState<string>('')

  const [callStats, setCallStats] = useState<CallStats>({
    duration: 0,
    quality: 'excellent',
    latency: 45,
    bitrate: '1.2 Mbps',
    resolution: '1080p'
  })

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())
  const streamCleanupRef = useRef<() => void>(() => {})
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get patient info
  const patientInfo = {
    id: patientData?.id || '',
    name: `${patientData?.firstName || ''} ${patientData?.lastName || ''}`.trim(),
    type: 'patient' as UserType
  }

  // Use WebRTC hook
  const {
    peers,
    remoteStreams,
    chatMessages,
    roomParticipants,
    isScreenSharing,
    sendChatMessage,
    toggleVideo: toggleVideoWebRTC,
    toggleAudio: toggleAudioWebRTC,
    startScreenShare,
    stopScreenShare
  } = useWebRTC({
    socket,
    roomId,
    userId: patientInfo.id,
    userName: patientInfo.name,
    userType: patientInfo.type,
    localStream
  }) as unknown as UseWebRTCReturn

  // Safely derive the next upcoming video appointment from patientData (unknown at compile time)
  const upcomingVideoAppointment: PatientVideoAppointment | undefined = (() => {
    const list = patientData.upcomingAppointments as unknown
    if (!Array.isArray(list)) return undefined
    const found = list.find((apt) => {
      if (typeof apt !== 'object' || apt === null) return false
      const rec = apt as Record<string, unknown>
      return rec.type === 'video'
    })
    return isPatientVideoAppointment(found) ? found : undefined
  })()

  // Check if there's a stored appointment from DoctorConsultations redirect
  useEffect(() => {
    const storedAppointment = localStorage.getItem('current_video_appointment')
    if (storedAppointment) {
      try {
        const parsed: unknown = JSON.parse(storedAppointment)
        if (isPatientVideoAppointment(parsed)) {
          setSelectedAppointment(parsed)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error parsing stored appointment:', err)
      } finally {
        localStorage.removeItem('current_video_appointment')
      }
    }
  }, [])

  // Use selected appointment if available, otherwise use upcoming
  const displayAppointment: PatientVideoAppointment | undefined =
    selectedAppointment ?? upcomingVideoAppointment

  // Cleanup media stream
  const cleanupMediaStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => { 
        track.stop()
        track.enabled = false 
      })
      setLocalStream(null)
    }
  }
  streamCleanupRef.current = cleanupMediaStream

  // Initialize media stream when joining call
  useEffect(() => {
    if (!isInCall || !patientInfo.id) return
    
    let mounted = true
    let currentStream: MediaStream | null = null

    const initMediaStream = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const hasVideo = devices.some(d => d.kind === 'videoinput')
        const hasAudio = devices.some(d => d.kind === 'audioinput')
        
        if (!hasVideo) throw new Error('No camera found. Please connect a camera and refresh.')
        if (!hasAudio) throw new Error('No microphone found. Please connect a microphone and refresh.')

        if (localStream) localStream.getTracks().forEach(t => t.stop())
        await new Promise(r => setTimeout(r, 500))

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        })
        
        if (mounted) {
          currentStream = stream
          setLocalStream(stream)
          setMediaError('')
        } else {
          stream.getTracks().forEach(t => t.stop())
        }
      } catch (error) {
        let errorMessage = 'Media access error'
        if (typeof error === 'object' && error) {
          const err = error as { name?: string; message?: string }
          errorMessage =
            err.name === 'NotAllowedError' ? 'Camera and microphone access was denied. Please allow access and refresh.' :
            err.name === 'NotFoundError' ? 'Camera or microphone not found. Please check your devices and refresh.' :
            `Media access error: ${err.message ?? ''}`
        }
        setMediaError(errorMessage)
        alert(errorMessage)
      }
    }

    initMediaStream()
    return () => {
      mounted = false
      if (currentStream) currentStream.getTracks().forEach(track => { 
        track.stop()
        track.enabled = false 
      })
    }
  }, [isInCall, patientInfo.id, localStream])

  // Update local video when stream changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  // Update remote videos when streams change
  useEffect(() => {
    remoteStreams.forEach((stream, socketId) => {
      const videoElement = remoteVideoRefs.current.get(socketId)
      if (videoElement) videoElement.srcObject = stream
    })
  }, [remoteStreams])

  // Call duration timer
  useEffect(() => {
    if (isInCall) {
      callIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
        setCallStats(prev => ({ ...prev, duration: prev.duration + 1 }))
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

  // Cleanup on unmount
  useEffect(() => {
    const handleBeforeUnload = () => { cleanupMediaStream() }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const joinCall = (appointment?: PatientVideoAppointment) => {
    const appointmentToUse = appointment || selectedAppointment
    
    if (!appointmentToUse?.roomId) {
      alert('No room ID found for this appointment')
      return
    }
    
    setSelectedAppointment(appointmentToUse)
    setRoomId(appointmentToUse.roomId)
    setIsInCall(true)
    setWaitingForDoctor(false)
    
    // Store call data in localStorage
    const callData = {
      patientId: patientInfo.id,
      patientName: patientInfo.name,
      doctorId: appointmentToUse.doctorId,
      doctorName: appointmentToUse.doctorName,
      roomId: appointmentToUse.roomId,
      startTime: new Date().toISOString()
    }
    localStorage.setItem(`video_call_${appointmentToUse.roomId}`, JSON.stringify(callData))
    
    // Simulate doctor joining after a delay
    setTimeout(() => {
      if (appointmentToUse) {
        // eslint-disable-next-line no-console
        console.log(`${appointmentToUse.doctorName} joined the call`)
      }
    }, 2000)
  }

  const endCall = () => {
    // Save call history
    const callData = {
      roomId,
      patientId: patientInfo.id,
      patientName: patientInfo.name,
      duration: callDuration,
      timestamp: new Date().toISOString(),
      appointmentId: selectedAppointment?.id
    }
    const callHistory = JSON.parse(localStorage.getItem('videoCallHistory') || '[]') as unknown[]
    callHistory.push(callData)
    localStorage.setItem('videoCallHistory', JSON.stringify(callHistory))

    // Cleanup
    cleanupMediaStream()
    peers.forEach((p) => { p.peer?.destroy?.() })
    if (socket) socket.emit('leave-room')
    
    // Reset state
    setIsInCall(false)
    setCallDuration(0)
    setSelectedAppointment(null)
    setRoomId('')
    setLocalStream(null)
    setCallNotes('')
    setWaitingForDoctor(true)
  }

  const toggleVideo = () => {
    const newState = !isVideoOn
    setIsVideoOn(newState)
    toggleVideoWebRTC(newState)
  }

  const toggleMic = () => {
    const newState = !isMicOn
    setIsMicOn(newState)
    toggleAudioWebRTC(newState)
  }

  const toggleScreenShare = async () => {
    isScreenSharing ? stopScreenShare() : await startScreenShare()
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const sendMessage = () => {
    if (newChatMessage.trim()) {
      sendChatMessage(newChatMessage)
      setNewChatMessage('')
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullScreen(true)
    } else {
      document.exitFullscreen()
      setIsFullScreen(false)
    }
  }

  const retryMediaAccess = async () => {
    setMediaError('')
    cleanupMediaStream()
    await new Promise(r => setTimeout(r, 500))
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setLocalStream(stream)
      setMediaError('')
    } catch (error) {
      setMediaError(typeof error === 'object' && error && 'message' in error ? String((error as { message: unknown }).message) : 'An unknown error occurred')
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

  if (!displayAppointment && patientData.videoCallHistory?.length === 0) {
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

  // If not in call, show waiting room with appointments
  if (!isInCall) {
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
                  {displayAppointment && (
                    <p className="text-blue-100">
                      with {displayAppointment.doctorName} • {displayAppointment.specialty}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                {displayAppointment && (
                  <div>
                    <p className="text-sm text-blue-100">Scheduled</p>
                    <p className="text-lg font-bold">
                      {new Date(displayAppointment.date).toLocaleDateString()} at {displayAppointment.time}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Waiting Room - Centered Content (added vertical spacing via py-6) */}
          <div className="relative bg-gray-900 h-[600px] flex items-center justify-center py-6">
            <div className="text-center text-white flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <FaClock className="text-4xl animate-pulse" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Waiting Room</h3>
              {displayAppointment ? (
                <>
                  <p className="text-blue-100 mb-6">
                    Your consultation with {displayAppointment.doctorName} is about to begin
                  </p>
                  <p className="text-sm text-blue-200 mb-8">
                    Room ID: {displayAppointment.roomId}
                  </p>
                  
                  {/* Pre-call setup */}
                  <div className="bg-black bg-opacity-30 rounded-xl p-6 max-w-md">
                    <h4 className="text-lg font-semibold mb-4">Check Your Setup</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Camera</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${isVideoOn ? 'text-green-400' : 'text-red-400'}`}>
                            {isVideoOn ? 'Enabled' : 'Disabled'}
                          </span>
                          <button
                            onClick={() => setIsVideoOn(!isVideoOn)}
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
                            onClick={() => setIsMicOn(!isMicOn)}
                            className={`p-2 rounded-full ${isMicOn ? 'bg-green-500' : 'bg-red-500'} text-white`}
                          >
                            {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => joinCall(displayAppointment)}
                    className="mt-8 px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all transform hover:scale-105"
                  >
                    Join Consultation
                  </button>
                </>
              ) : (
                <p className="text-gray-400">No upcoming video consultations scheduled</p>
              )}
            </div>
          </div>
        </div>

        {/* Video Call History */}
        {patientData.videoCallHistory && patientData.videoCallHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaVideo className="mr-2 text-purple-500" />
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

  // Show media error screen if there's an error
  if (mediaError) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center max-w-md">
          <div className="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaVideoSlash className="text-2xl" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Media Access Error</h2>
          <p className="text-gray-400 mb-6">{mediaError}</p>
          <button onClick={retryMediaAccess} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 mx-auto">
            <FaSync /> Retry Access
          </button>
          <button onClick={endCall} className="mt-4 text-gray-400 hover:text-white transition block mx-auto">
            End Call and Return
          </button>
        </div>
      </div>
    )
  }

  // Video Call Interface
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 sm:px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-gray-400 hover:text-white transition lg:hidden">
            {showSidebar ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <FaStethoscope className="text-blue-400 text-xl" />
          <div>
            <h1 className="text-white font-semibold text-sm sm:text-base">Video Consultation</h1>
            {selectedAppointment && (
              <p className="text-gray-400 text-xs">with {selectedAppointment.doctorName}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <FaClock className="text-gray-400 text-sm" />
            <span className="text-white font-mono text-sm">{formatDuration(callDuration)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {getConnectionIcon(callStats.quality)}
            <span className="text-white text-xs hidden sm:inline">{callStats.quality}</span>
          </div>
          
          {isRecording && (
            <div className="flex items-center gap-1">
              <FaRecordVinyl className="text-red-500 animate-pulse text-sm" />
              <span className="text-red-500 text-xs hidden sm:inline">REC</span>
            </div>
          )}
          
          <button onClick={toggleFullscreen} className="text-gray-400 hover:text-white transition">
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative bg-gray-900 p-2 sm:p-4">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
            {/* Remote Videos (Doctors) */}
            {Array.from(remoteStreams.entries()).map(([socketId]) => {
              const participant = roomParticipants.find(p => p.socketId === socketId)
              return (
                <div key={socketId} className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                  <video 
                    ref={(el) => { if (el) remoteVideoRefs.current.set(socketId, el) }}
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full">
                    <span className="text-white text-xs sm:text-sm flex items-center gap-1">
                      <FaUserMd className="text-green-400" />
                      {participant?.userName || 'Doctor'}
                    </span>
                  </div>
                </div>
              )
            })}

            {/* Local Video (Patient) */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
              <video 
                ref={localVideoRef}
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full">
                <span className="text-white text-xs sm:text-sm flex items-center gap-1">
                  <FaUser className="text-blue-400" />
                  {patientInfo.name} (You)
                </span>
              </div>
              {!isVideoOn && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <FaVideoSlash className="text-gray-500 text-4xl" />
                </div>
              )}
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

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-gradient-to-br from-gray-800 to-gray-900 border-l border-gray-700 flex flex-col">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setShowChat(true)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  showChat ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <FaComments className="inline mr-2" />
                Chat
              </button>
              <button
                onClick={() => setShowChat(false)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  !showChat ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <FaNotesMedical className="inline mr-2" />
                Details
              </button>
            </div>

            {/* Chat Section (with light dedupe to avoid double echo) */}
            {showChat ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.filter((message, index, self) => {
                    return index === self.findIndex(m => 
                      m.userName === message.userName &&
                      m.message === message.message &&
                      Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000
                    )
                  }).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.socketId === socket?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.socketId === socket?.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                      }`}>
                        <p className="text-xs opacity-75 mb-1">{message.userName}</p>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-50 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-4 overflow-y-auto">
                {/* Appointment Details */}
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Appointment Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">
                      <strong>Doctor:</strong> {selectedAppointment?.doctorName}
                    </p>
                    <p className="text-gray-300">
                      <strong>Specialty:</strong> {selectedAppointment?.specialty}
                    </p>
                    <p className="text-gray-300">
                      <strong>Date:</strong> {selectedAppointment ? new Date(selectedAppointment.date).toLocaleDateString() : ''}
                    </p>
                    <p className="text-gray-300">
                      <strong>Time:</strong> {selectedAppointment?.time}
                    </p>
                    <p className="text-gray-300">
                      <strong>Reason:</strong> {selectedAppointment?.reason}
                    </p>
                  </div>
                </div>

                {/* Participants */}
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-medium mb-3">Participants ({roomParticipants.length})</h4>
                  <div className="space-y-2">
                    {roomParticipants.map((participant) => (
                      <div key={participant.socketId} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {participant.userName.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <span className="text-gray-300">{participant.userName}</span>
                        </div>
                        <span className="text-xs text-gray-400 capitalize">{participant.userType}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Notes */}
                <div>
                  <h4 className="text-white font-medium mb-2">Personal Notes</h4>
                  <textarea
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Take notes during the consultation..."
                    className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <button
            onClick={toggleMic}
            className={`p-3 sm:p-4 rounded-full transition ${
              isMicOn 
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800' 
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            }`}
          >
            {isMicOn ? <FaMicrophone className="text-white text-lg sm:text-xl" /> : <FaMicrophoneSlash className="text-white text-lg sm:text-xl" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 sm:p-4 rounded-full transition ${
              isVideoOn 
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800' 
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            }`}
          >
            {isVideoOn ? <FaVideo className="text-white text-lg sm:text-xl" /> : <FaVideoSlash className="text-white text-lg sm:text-xl" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-3 sm:p-4 rounded-full transition ${
              isScreenSharing 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
            }`}
          >
            <FaDesktop className="text-white text-lg sm:text-xl" />
          </button>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition hidden lg:block"
          >
            {showSidebar ? <FaChevronRight className="text-white text-lg sm:text-xl" /> : <FaChevronLeft className="text-white text-lg sm:text-xl" />}
          </button>

          <button
            onClick={toggleRecording}
            className={`p-3 sm:p-4 rounded-full transition ${
              isRecording 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
            }`}
          >
            {isRecording ? <FaStop className="text-white text-lg sm:text-xl" /> : <FaRecordVinyl className="text-white text-lg sm:text-xl" />}
          </button>

          <button
            onClick={endCall}
            className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-105 flex items-center space-x-2 ml-4 sm:ml-8"
          >
            <FaPhone className="rotate-135" />
            <span className="font-semibold">End Call</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute inset-x-0 bottom-20 bg-white rounded-t-2xl p-6 shadow-lg border border-gray-100">
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
    </div>
  )
}

export default VideoConsultation
