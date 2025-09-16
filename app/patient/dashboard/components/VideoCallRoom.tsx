
import React, { useRef, useEffect, useState } from 'react'
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhone,
  FaDesktop,
  FaComments,
  FaClock,
  FaWifi,
  FaSync,
  FaExpand,
  FaCompress
} from 'react-icons/fa'

interface VideoCallRoomProps {
  localStream: MediaStream | null
  remoteStreams: Map<string, MediaStream>
  isVideoOn: boolean
  isMicOn: boolean
  isScreenSharing: boolean
  isReconnecting?: boolean
  connectionStatus: string
  callDuration: number
  onToggleVideo: () => void
  onToggleMic: () => void
  onToggleScreenShare: () => void
  onEndCall: () => void
  onToggleChat?: () => void
  participantName?: string
  remoteParticipantName?: string
}

const VideoCallRoom: React.FC<VideoCallRoomProps> = ({
  localStream,
  remoteStreams,
  isVideoOn,
  isMicOn,
  isScreenSharing,
  isReconnecting = false,
  connectionStatus,
  callDuration,
  onToggleVideo,
  onToggleMic,
  onToggleScreenShare,
  onEndCall,
  onToggleChat,
  participantName = 'You',
  remoteParticipantName = 'Remote User'
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [localVideoPipPosition, setLocalVideoPipPosition] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('bottom-right')
  const [isDraggingPip, setIsDraggingPip] = useState(false)

  // Format call duration
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Get connection quality icon
  const getConnectionIcon = () => {
    if (isReconnecting) {
      return <FaSync className="text-yellow-500 animate-spin" />
    }
    switch (connectionStatus) {
      case 'connected':
        return <FaWifi className="text-green-500" />
      case 'connecting':
        return <FaWifi className="text-yellow-500" />
      default:
        return <FaWifi className="text-red-500" />
    }
  }

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle PiP position change on mobile (touch to move)
  const handlePipTouch = () => {
    const positions: Array<typeof localVideoPipPosition> = ['top-right', 'top-left', 'bottom-right', 'bottom-left']
    const currentIndex = positions.indexOf(localVideoPipPosition)
    const nextIndex = (currentIndex + 1) % positions.length
    setLocalVideoPipPosition(positions[nextIndex])
  }

  // Update video elements when streams change
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    remoteStreams.forEach((stream, socketId) => {
      const videoElement = remoteVideoRefs.current.get(socketId)
      if (videoElement) {
        videoElement.srcObject = stream
      }
    })
  }, [remoteStreams])

  // PiP position classes
  const getPipPositionClasses = () => {
    switch (localVideoPipPosition) {
      case 'top-right':
        return 'top-3 right-3 sm:top-4 sm:right-4'
      case 'top-left':
        return 'top-3 left-3 sm:top-4 sm:left-4'
      case 'bottom-right':
        return 'bottom-20 right-3 sm:bottom-24 sm:right-4'
      case 'bottom-left':
        return 'bottom-20 left-3 sm:bottom-24 sm:left-4'
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Reconnecting Overlay */}
      {isReconnecting && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <FaSync className="text-yellow-500 text-4xl animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-semibold">Reconnecting...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we restore your connection</p>
          </div>
        </div>
      )}

      {/* Header - Minimal on mobile */}
      <div className="bg-gradient-to-b from-black/60 to-transparent absolute top-0 left-0 right-0 z-20 px-3 py-2 sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaClock className="text-white text-xs sm:text-sm" />
            <span className="text-white font-mono text-sm sm:text-base">{formatDuration(callDuration)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {getConnectionIcon()}
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition hidden sm:block"
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative bg-black">
        {/* Remote Video - Main View */}
        {Array.from(remoteStreams.entries()).map(([socketId], index) => (
          <div key={socketId} className="absolute inset-0">
            <video
              ref={(el) => {
                if (el) remoteVideoRefs.current.set(socketId, el)
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Remote participant label */}
            <div className="absolute top-14 left-3 sm:top-16 sm:left-4 bg-black/50 px-3 py-1 rounded-full">
              <span className="text-white text-xs sm:text-sm">
                {remoteParticipantName}
              </span>
            </div>
          </div>
        ))}

        {/* No remote stream placeholder */}
        {remoteStreams.size === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaVideo className="text-gray-500 text-3xl sm:text-4xl" />
              </div>
              <p className="text-gray-400 text-sm sm:text-base">Waiting for other participant...</p>
            </div>
          </div>
        )}

        {/* Local Video - Picture-in-Picture */}
        <div
          className={`absolute ${getPipPositionClasses()} z-30 transition-all duration-300`}
          onClick={handlePipTouch}
          style={{ cursor: 'pointer' }}
        >
          <div className="relative">
            {/* PiP Container with responsive sizing */}
            <div className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-52 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
              {isVideoOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <FaVideoSlash className="text-gray-500 text-2xl" />
                </div>
              )}
              
              {/* Local participant label */}
              <div className="absolute bottom-1 left-1 right-1 bg-black/60 px-2 py-0.5 rounded text-center">
                <span className="text-white text-xs">{participantName}</span>
              </div>
              
              {/* Muted indicator */}
              {!isMicOn && (
                <div className="absolute top-1 right-1 bg-red-500 rounded-full p-1">
                  <FaMicrophoneSlash className="text-white text-xs" />
                </div>
              )}
            </div>
            
            {/* Touch hint for mobile */}
            <div className="sm:hidden absolute -bottom-5 left-0 right-0 text-center">
              <span className="text-white/50 text-xs">Tap to move</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar - Optimized for mobile */}
      <div className="bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 z-20">
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Mic Toggle */}
            <button
              onClick={onToggleMic}
              className={`p-3 sm:p-4 rounded-full transition-all ${
                isMicOn 
                  ? 'bg-gray-700/80 hover:bg-gray-600/80' 
                  : 'bg-red-500/80 hover:bg-red-600/80'
              }`}
            >
              {isMicOn ? (
                <FaMicrophone className="text-white text-lg sm:text-xl" />
              ) : (
                <FaMicrophoneSlash className="text-white text-lg sm:text-xl" />
              )}
            </button>

            {/* Video Toggle */}
            <button
              onClick={onToggleVideo}
              className={`p-3 sm:p-4 rounded-full transition-all ${
                isVideoOn 
                  ? 'bg-gray-700/80 hover:bg-gray-600/80' 
                  : 'bg-red-500/80 hover:bg-red-600/80'
              }`}
            >
              {isVideoOn ? (
                <FaVideo className="text-white text-lg sm:text-xl" />
              ) : (
                <FaVideoSlash className="text-white text-lg sm:text-xl" />
              )}
            </button>

            {/* Screen Share - Hidden on small mobile */}
            <button
              onClick={onToggleScreenShare}
              className={`hidden sm:block p-3 sm:p-4 rounded-full transition-all ${
                isScreenSharing 
                  ? 'bg-blue-500/80 hover:bg-blue-600/80' 
                  : 'bg-gray-700/80 hover:bg-gray-600/80'
              }`}
            >
              <FaDesktop className="text-white text-lg sm:text-xl" />
            </button>

            {/* Chat Toggle - Optional */}
            {onToggleChat && (
              <button
                onClick={onToggleChat}
                className="p-3 sm:p-4 rounded-full bg-gray-700/80 hover:bg-gray-600/80 transition-all"
              >
                <FaComments className="text-white text-lg sm:text-xl" />
              </button>
            )}

            {/* End Call */}
            <button
              onClick={onEndCall}
              className="p-3 sm:p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all ml-2 sm:ml-4"
            >
              <FaPhone className="text-white text-lg sm:text-xl transform rotate-135" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCallRoom