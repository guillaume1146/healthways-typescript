'use client'

import React, { useState, useEffect, useRef, useMemo, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'
import { useWebRTC } from '@/hooks/useWebRTC'
import type { Socket } from 'socket.io-client'
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhone,
  FaDesktop,
  FaComments,
  FaUserMd,
  FaUser,
  FaWifi,
  FaClock,
  FaPaperPlane,
  FaExpand,
  FaCompress,
  FaRecordVinyl,
  FaNotesMedical,
  FaPrescriptionBottleAlt,
  FaFileDownload,
  FaSync,
  FaCalendarAlt,
  FaStethoscope,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa'

/* ---------------- Types ---------------- */

type UserType = 'doctor' | 'patient'

type AppointmentType = 'video' | 'in-person' | 'home-visit'
type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show'

interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: string // ISO
  time: string // HH:mm or similar
  type: AppointmentType
  status?: AppointmentStatus
  reason: string
  roomId?: string
}

interface DoctorData {
  id: string
  firstName: string
  lastName: string
  upcomingAppointments?: Appointment[]
  pastAppointments?: Appointment[]
}

interface Props {
  doctorData: DoctorData
}

interface Participant {
  socketId: string
  userId: string
  userName: string
  userType: UserType
}

interface ChatMessage {
  id: string
  message: string
  userName: string
  userType: string
  timestamp: string
  socketId: string
}

interface ConsultationHistoryEntry {
  roomId: string
  doctorId: string
  doctorName: string
  patientId?: string
  patientName?: string
  notes: string
  duration: number
  timestamp: string
}

/* ---------------- Component ---------------- */

const VideoConsultation: React.FC<Props> = ({ doctorData }) => {
  const router = useRouter()
  // Assume your useSocket hook returns a socket.io-client Socket (or null)
  const { socket } = useSocket() as { socket: Socket | null }

  const [isInCall, setIsInCall] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [roomId, setRoomId] = useState<string>('')

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [consultationNotes, setConsultationNotes] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good')
  const [mediaError, setMediaError] = useState<string>('')

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())
  const streamCleanupRef = useRef<() => void>(() => {})
  const callIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Doctor info
  const doctorInfo = {
    id: doctorData?.id || '',
    name: `${doctorData?.firstName || ''} ${doctorData?.lastName || ''}`.trim(),
    type: 'doctor' as UserType
  }

  // WebRTC hook (no casts; use the hook’s real types)
  const webRTC = useWebRTC({
    socket,
    roomId,
    userId: doctorInfo.id,
    userName: doctorInfo.name,
    userType: doctorInfo.type,
    localStream
  })

  const {
    peers, // Map<string, { peer: SimplePeer; socketId; userId; userName; userType }>
    remoteStreams, // Map<string, MediaStream>
    chatMessages, // ChatMessage[]
    roomParticipants, // any[] from the hook; cast when using
    isScreenSharing,
    sendChatMessage,
    toggleVideo: toggleVideoWebRTC,
    toggleAudio: toggleAudioWebRTC,
    startScreenShare,
    stopScreenShare
  } = webRTC

  const participants = roomParticipants as unknown as Participant[]

  // Dedupe outgoing chat echoes (same sender+content within 1s)
  const dedupedChatMessages = useMemo(() => {
    return chatMessages.filter((msg, idx, arr) => {
      const thisTime = new Date(msg.timestamp).getTime()
      const firstIdx = arr.findIndex(
        (m) =>
          m.socketId === msg.socketId &&
          m.message === msg.message &&
          Math.abs(new Date(m.timestamp).getTime() - thisTime) < 1000
      )
      return idx === firstIdx
    })
  }, [chatMessages])

  // Upcoming video appointments
  const videoAppointments: Appointment[] =
    doctorData?.upcomingAppointments?.filter((apt) => apt.type === 'video') ?? []

  // Auto-pick first upcoming appointment
  useEffect(() => {
    if (!selectedAppointment && videoAppointments.length > 0) {
      setSelectedAppointment(videoAppointments[0])
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }, [videoAppointments, selectedAppointment])

  // Cleanup media stream
  const cleanupMediaStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop()
        track.enabled = false
      })
      setLocalStream(null)
    }
  }
  streamCleanupRef.current = cleanupMediaStream

  // Init media on call start
  useEffect(() => {
    if (!isInCall || !doctorInfo.id) return
    let mounted = true
    let currentStream: MediaStream | null = null

    const initMediaStream = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const hasVideo = devices.some((d) => d.kind === 'videoinput')
        const hasAudio = devices.some((d) => d.kind === 'audioinput')
        if (!hasVideo) throw new Error('No camera found. Please connect a camera and refresh.')
        if (!hasAudio) throw new Error('No microphone found. Please connect a microphone and refresh.')

        if (localStream) localStream.getTracks().forEach((t) => t.stop())
        await new Promise((r) => setTimeout(r, 500))

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        })
        if (mounted) {
          currentStream = stream
          setLocalStream(stream)
          setMediaError('')
        } else {
          stream.getTracks().forEach((t) => t.stop())
        }
      } catch (error) {
        let errorMessage = 'Media access error'
        if (typeof error === 'object' && error) {
          const err = error as { name?: string; message?: string }
          errorMessage =
            err.name === 'NotAllowedError'
              ? 'Camera and microphone access was denied. Please allow access and refresh.'
              : err.name === 'NotFoundError'
              ? 'Camera or microphone not found. Please check your devices and refresh.'
              : `Media access error: ${err.message ?? ''}`
        }
        setMediaError(errorMessage)
        alert(errorMessage)
      }
    }

    void initMediaStream()
    return () => {
      mounted = false
      if (currentStream) {
        currentStream.getTracks().forEach((track) => {
          track.stop()
          track.enabled = false
        })
      }
    }
  }, [isInCall, doctorInfo.id, localStream])

  // Bind local stream to video
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  // Bind remote streams
  useEffect(() => {
    remoteStreams.forEach((stream, socketId) => {
      const videoElement = remoteVideoRefs.current.get(socketId)
      if (videoElement) videoElement.srcObject = stream
    })
  }, [remoteStreams])

  // Call timer
  useEffect(() => {
    if (isInCall) {
      callIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current)
      setCallDuration(0)
    }
    return () => {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current)
    }
  }, [isInCall])

  // Cleanup on unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanupMediaStream()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`
  }

  const startCall = (appointment: Appointment) => {
    const appointmentRoomId = appointment.roomId
    if (!appointmentRoomId) {
      alert('No room ID found for this appointment')
      return
    }
    setRoomId(appointmentRoomId)
    setSelectedAppointment(appointment)
    setIsInCall(true)
    setConnectionQuality('excellent')

    const consultationData = {
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: doctorInfo.id,
      doctorName: doctorInfo.name,
      roomId: appointmentRoomId,
      startTime: new Date().toISOString()
    }
    localStorage.setItem(`consultation_${appointmentRoomId}`, JSON.stringify(consultationData))
  }

  const handleEndCall = () => {
    if (consultationNotes.trim()) {
      const notesData: ConsultationHistoryEntry = {
        roomId,
        doctorId: doctorInfo.id,
        doctorName: doctorInfo.name,
        patientId: selectedAppointment?.patientId,
        patientName: selectedAppointment?.patientName,
        notes: consultationNotes,
        duration: callDuration,
        timestamp: new Date().toISOString()
      }
      const existing = JSON.parse(localStorage.getItem('consultationHistory') || '[]') as ConsultationHistoryEntry[]
      existing.push(notesData)
      localStorage.setItem('consultationHistory', JSON.stringify(existing))
    }

    cleanupMediaStream()
    // Destroy all peer connections (peers is a Map from the hook)
    peers.forEach((pc) => {
      try {
        if (pc?.peer && typeof pc.peer.destroy === 'function') {
          pc.peer.destroy()
        } else if (pc?.peer && typeof (pc.peer as { close?: () => void }).close === 'function') {
          ;(pc.peer as { close?: () => void }).close?.()
        }
      } catch {
        // ignore
      }
    })
    if (socket) socket.emit('leave-room')

    setIsInCall(false)
    setSelectedAppointment(null)
    setRoomId('')
    setLocalStream(null)
    setConsultationNotes('')
    setCallDuration(0)
  }

  const handleToggleVideo = () => {
    const newState = !isVideoEnabled
    setIsVideoEnabled(newState)
    toggleVideoWebRTC(newState)
  }

  const handleToggleAudio = () => {
    const newState = !isAudioEnabled
    setIsAudioEnabled(newState)
    toggleAudioWebRTC(newState)
  }

  const handleScreenShare = async () => {
    isScreenSharing ? stopScreenShare() : await startScreenShare()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      void document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendChatMessage(newMessage)
      setNewMessage('')
    }
  }

  const handleSaveNotes = () => {
    const notesData = {
      roomId,
      doctorId: doctorInfo.id,
      doctorName: doctorInfo.name,
      notes: consultationNotes,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem(`consultation_notes_${roomId}`, JSON.stringify(notesData))
    alert('Notes saved successfully!')
  }

  const handleCreatePrescription = () => {
    if (consultationNotes) {
      localStorage.setItem(`consultation_notes_${roomId}`, consultationNotes)
    }
    const fallbackPatientId = participants[0]?.userId
    const patientId = selectedAppointment?.patientId || fallbackPatientId || ''
    router.push(`/doctor/prescriptions/create/${patientId}?roomId=${roomId}`)
  }

  const retryMediaAccess = async () => {
    setMediaError('')
    cleanupMediaStream()
    await new Promise((r) => setTimeout(r, 500))
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setLocalStream(stream)
      setMediaError('')
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: unknown }).message ?? '')
          : 'An unknown error occurred'
      setMediaError(message)
    }
  }

  /* ---------- NOT IN CALL ---------- */
  if (!isInCall) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
                <FaVideo className="mr-2 sm:mr-3" />
                Video Consultation Room
              </h2>
              <p className="opacity-90 text-xs sm:text-sm md:text-base">Connect with your patients virtually</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{videoAppointments.length}</p>
                <p className="text-xs opacity-90">Scheduled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Waiting Room */}
        {selectedAppointment ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FaStethoscope className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Video Consultation</h2>
                    <p className="text-blue-100">with {selectedAppointment.patientName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">Scheduled</p>
                  <p className="text-lg font-bold">
                    {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Waiting Room Body */}
            <div className="relative bg-gray-900 h-[600px] flex items-center justify-center py-6">
              <div className="text-center text-white flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <FaClock className="text-4xl animate-pulse" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Waiting Room</h3>

                <p className="text-blue-100 mb-6">
                  Your consultation with {selectedAppointment.patientName} is about to begin
                </p>
                <p className="text-sm text-blue-200 mb-8">Room ID: {selectedAppointment.roomId}</p>

                {/* Pre-call setup */}
                <div className="bg-black/30 rounded-xl p-6 w-full max-w-md">
                  <h4 className="text-lg font-semibold mb-4">Check Your Setup</h4>
                  <div className="space-y-3">
                    {/* Camera */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Camera</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${isVideoEnabled ? 'text-green-400' : 'text-red-400'}`}>
                          {isVideoEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                          className={`p-2 rounded-full ${isVideoEnabled ? 'bg-green-500' : 'bg-red-500'} text-white`}
                        >
                          {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
                        </button>
                      </div>
                    </div>
                    {/* Microphone */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Microphone</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${isAudioEnabled ? 'text-green-400' : 'text-red-400'}`}>
                          {isAudioEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                          className={`p-2 rounded-full ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'} text-white`}
                        >
                          {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        toggleVideoWebRTC(isVideoEnabled)
                        toggleAudioWebRTC(isAudioEnabled)
                        startCall(selectedAppointment)
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all transform hover:scale-105"
                    >
                      Start Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Upcoming Video Appointments */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:py-6 shadow-lg border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Upcoming Video Consultations</h3>

          {videoAppointments.length > 0 ? (
            <div className="space-y-3">
              {videoAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  onClick={() => {
                    setSelectedAppointment(appointment)
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  className="cursor-pointer bg-gradient-to-br from-white/80 to-blue-50/30 rounded-lg sm:rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {appointment.patientName?.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{appointment.patientName}</h4>
                        <p className="text-sm text-gray-600">
                          <FaCalendarAlt className="inline mr-1 text-blue-500" />
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          <FaStethoscope className="inline mr-1 text-green-500" />
                          {appointment.reason}
                        </p>
                        {appointment.roomId && <p className="text-xs text-gray-500 mt-1">Room ID: {appointment.roomId}</p>}
                        {selectedAppointment?.id === appointment.id && (
                          <p className="text-xs mt-2 text-emerald-600 font-medium">Selected for waiting room</p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Click to open in waiting room</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaVideo className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">No video consultations scheduled</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ---------- MEDIA ERROR ---------- */
  if (mediaError) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center max-w-md">
          <div className="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaVideoSlash className="text-2xl" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Media Access Error</h2>
          <p className="text-gray-400 mb-6">{mediaError}</p>
          <button
            onClick={retryMediaAccess}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 mx-auto"
          >
            <FaSync /> Retry Access
          </button>
          <button onClick={handleEndCall} className="mt-4 text-gray-400 hover:text-white transition block mx-auto">
            End Call and Return
          </button>
        </div>
      </div>
    )
  }

  /* ---------- IN CALL ---------- */
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 sm:px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-gray-400 hover:text-white transition lg:hidden">
            {showSidebar ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <FaUserMd className="text-blue-400 text-xl" />
          <div>
            <h1 className="text-white font-semibold text-sm sm:text-base">Video Consultation</h1>
            {selectedAppointment && <p className="text-gray-400 text-xs">Patient: {selectedAppointment.patientName}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <FaClock className="text-gray-400 text-sm" />
            <span className="text-white font-mono text-sm">{formatDuration(callDuration)}</span>
          </div>

          <div className="flex items-center gap-1">
            <FaWifi
              className={`text-sm ${
                connectionQuality === 'excellent'
                  ? 'text-green-400'
                  : connectionQuality === 'good'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            />
            <span className="text-white text-xs hidden sm:inline">{connectionQuality}</span>
          </div>

          {isRecording && (
            <div className="flex items-center gap-1">
              <FaRecordVinyl className="text-red-500 animate-pulse text-sm" />
              <span className="text-red-500 text-xs hidden sm:inline">REC</span>
            </div>
          )}

          <button onClick={toggleFullscreen} className="text-gray-400 hover:text-white transition">
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative bg-gray-900 p-2 sm:p-4">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
            {/* Remote Videos */}
            {Array.from(remoteStreams.entries()).map(([remoteSocketId]) => {
              const participant = participants.find((p) => p.socketId === remoteSocketId)
              return (
                <div key={remoteSocketId} className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={(el) => {
                      if (el) remoteVideoRefs.current.set(remoteSocketId, el)
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full">
                    <span className="text-white text-xs sm:text-sm flex items-center gap-1">
                      <FaUser className="text-blue-400" />
                      {participant?.userName || 'Unknown'}
                    </span>
                  </div>
                </div>
              )
            })}

            {/* Local Video (Doctor) */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full">
                <span className="text-white text-xs sm:text-sm flex items-center gap-1">
                  <FaUserMd className="text-green-400" />
                  Dr. {doctorInfo.name} (You)
                </span>
              </div>
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <FaVideoSlash className="text-gray-500 text-4xl" />
                </div>
              )}
            </div>
          </div>

          {/* Patient Info Overlay */}
          {selectedAppointment && (
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-lg p-3 max-w-xs">
              <div className="text-white text-xs space-y-1">
                <p>
                  <strong>Patient:</strong> {selectedAppointment.patientName}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedAppointment.reason}
                </p>
                <p>
                  <strong>Participants:</strong> {participants.length}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-gradient-to-br from-gray-800 to-gray-900 border-l border-gray-700 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => {
                  setShowChat(true)
                  setShowNotes(false)
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  showChat ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <FaComments className="inline mr-2" />
                Chat
              </button>
              <button
                onClick={() => {
                  setShowNotes(true)
                  setShowChat(false)
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  showNotes ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <FaNotesMedical className="inline mr-2" />
                Notes
              </button>
            </div>

            {/* Chat */}
            {showChat && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {dedupedChatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.socketId === socket?.id ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.socketId === socket?.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                            : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                        }`}
                      >
                        <p className="text-xs opacity-75 mb-1">{msg.userName}</p>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-50 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notes */}
            {showNotes && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4">
                  <textarea
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    placeholder="Enter consultation notes, diagnosis, observations..."
                    className="w-full h-full bg-gray-700 text-white p-3 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="p-4 border-t border-gray-700 space-y-2">
                  <button
                    onClick={handleCreatePrescription}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition text-sm flex items-center justify-center gap-2"
                  >
                    <FaPrescriptionBottleAlt />
                    Create Prescription
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition text-sm flex items-center justify-center gap-2"
                  >
                    <FaFileDownload />
                    Save Notes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <button
            onClick={handleToggleAudio}
            className={`p-3 sm:p-4 rounded-full transition ${
              isAudioEnabled
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            }`}
          >
            {isAudioEnabled ? (
              <FaMicrophone className="text-white text-lg sm:text-xl" />
            ) : (
              <FaMicrophoneSlash className="text-white text-lg sm:text-xl" />
            )}
          </button>

          <button
            onClick={handleToggleVideo}
            className={`p-3 sm:p-4 rounded-full transition ${
              isVideoEnabled
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            }`}
          >
            {isVideoEnabled ? <FaVideo className="text-white text-lg sm:text-xl" /> : <FaVideoSlash className="text-white text-lg sm:text-xl" />}
          </button>

          <button
            onClick={handleScreenShare}
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
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 sm:p-4 rounded-full transition ${
              isRecording
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
            }`}
          >
            <FaRecordVinyl className="text-white text-lg sm:text-xl" />
          </button>

          <button
            onClick={handleEndCall}
            className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition ml-4 sm:ml-8"
          >
            <FaPhone className="text-white text-lg sm:text-xl transform rotate-135" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoConsultation
