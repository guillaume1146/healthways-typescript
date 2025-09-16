// hooks/useWebRTC.ts
// FINAL FIXED VERSION - No syntax errors, no infinite loops

import { useEffect, useRef, useState, useCallback } from 'react'
import { Socket } from 'socket.io-client'

let SimplePeer: any = null
if (typeof window !== 'undefined') {
  SimplePeer = require('simple-peer')
}

interface PeerConnection {
  peer: any
  socketId: string
  userId: string
  userName: string
  userType: string
  lastActivity?: number
  isDestroyed?: boolean
}

interface UseWebRTCProps {
  socket: Socket | null
  roomId: string
  userId: string
  userName: string
  userType: string
  localStream: MediaStream | null
  saveRoomState?: (state: any) => void
  clearRoomState?: () => void
}

interface ChatMessage {
  id: string
  message: string
  userName: string
  userType: string
  timestamp: string
  socketId: string
}

function useWebRTC({
  socket,
  roomId,
  userId,
  userName,
  userType,
  localStream,
  saveRoomState,
  clearRoomState
}: UseWebRTCProps) {
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map())
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [roomParticipants, setRoomParticipants] = useState<any[]>([])
  const [connectionStatus, setConnectionStatus] = useState<string>('connecting')
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [streamUpdateTrigger, setStreamUpdateTrigger] = useState(0)
  
  const peersRef = useRef<Map<string, PeerConnection>>(new Map())
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map())
  const screenShareStreamRef = useRef<MediaStream | null>(null)
  const processingOffer = useRef<Set<string>>(new Set())
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null)
  const roomJoined = useRef(false)
  const localStreamRef = useRef<MediaStream | null>(null)
  const roomParticipantsRef = useRef<any[]>([])
  const socketRef = useRef<Socket | null>(null)

  // Keep refs updated
  useEffect(() => {
    localStreamRef.current = localStream
  }, [localStream])

  useEffect(() => {
    socketRef.current = socket
  }, [socket])

  useEffect(() => {
    roomParticipantsRef.current = roomParticipants
  }, [roomParticipants])

  // Force video element updates when streams change
  useEffect(() => {
    if (remoteStreams.size > 0) {
      setStreamUpdateTrigger(prev => prev + 1)
    }
  }, [remoteStreams])

  // Create peer with proper cleanup
  const createPeer = useCallback((
    targetSocketId: string,
    targetUserId: string,
    targetUserName: string,
    targetUserType: string,
    initiator: boolean,
    retryCount: number = 0
  ) => {
    if (!localStreamRef.current || !socketRef.current || !SimplePeer) {
      console.error('Cannot create peer: missing requirements', {
        localStream: !!localStreamRef.current,
        socket: !!socketRef.current,
        SimplePeer: !!SimplePeer
      })
      
      // Retry if we're still setting up
      if (retryCount < 5 && socketRef.current) {
        setTimeout(() => {
          createPeer(targetSocketId, targetUserId, targetUserName, targetUserType, initiator, retryCount + 1)
        }, 1000)
      }
      return null
    }

    // Clean up existing peer if it exists
    const existingPeer = peersRef.current.get(targetSocketId)
    if (existingPeer && !existingPeer.isDestroyed) {
      console.log(`Cleaning up existing peer for ${targetSocketId}`)
      try {
        existingPeer.peer.destroy()
        existingPeer.isDestroyed = true
      } catch (e) {
        console.error('Error cleaning up existing peer:', e)
      }
      peersRef.current.delete(targetSocketId)
    }

    console.log(`Creating peer: initiator=${initiator}, target=${targetSocketId}`)

    // Verify local stream is still active
    const videoTrack = localStreamRef.current.getVideoTracks()[0]
    const audioTrack = localStreamRef.current.getAudioTracks()[0]
    
    if (!videoTrack || !audioTrack) {
      console.error('Local media tracks are missing!')
      return null
    }

    const peer = new SimplePeer({
      initiator,
      trickle: true,
      stream: localStreamRef.current,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ],
        iceCandidatePoolSize: 10,
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require'
      }
    })

    peer.on('signal', (signal: any) => {
      if (socketRef.current?.connected) {
        if (signal.type === 'offer') {
          socketRef.current.emit('offer', { offer: signal, to: targetSocketId })
        } else if (signal.type === 'answer') {
          socketRef.current.emit('answer', { answer: signal, to: targetSocketId })
        } else if (signal.candidate) {
          socketRef.current.emit('ice-candidate', { candidate: signal, to: targetSocketId })
        }
      }
    })

    peer.on('stream', (stream: MediaStream) => {
      console.log(`✅ Received stream from ${targetSocketId}`)
      
      // Store in both ref and state
      remoteStreamsRef.current.set(targetSocketId, stream)
      
      // Update state to trigger re-render
      setRemoteStreams(prev => {
        const newStreams = new Map(prev)
        newStreams.set(targetSocketId, stream)
        return newStreams
      })
      
      // Force update trigger
      setStreamUpdateTrigger(prev => prev + 1)
      
      setConnectionStatus('connected')
      setIsReconnecting(false)
      
      // Update peer activity
      const peerConnection = peersRef.current.get(targetSocketId)
      if (peerConnection) {
        peerConnection.lastActivity = Date.now()
      }
    })

    peer.on('connect', () => {
      console.log(`✅ Connected to peer ${targetSocketId}`)
      setConnectionStatus('connected')
      setIsReconnecting(false)
    })

    peer.on('error', (err: Error) => {
      console.error(`Peer error with ${targetSocketId}:`, err.message)
      
      // Don't immediately destroy on error during reconnection
      if (isReconnecting) {
        console.log('Error during reconnection, will retry...')
      }
    })

    peer.on('close', () => {
      console.log(`Connection closed with ${targetSocketId}`)
      
      // Only remove if we're not reconnecting
      if (!isReconnecting && !socketRef.current?.connected) {
        removePeer(targetSocketId)
      }
    })

    const peerConnection: PeerConnection = {
      peer,
      socketId: targetSocketId,
      userId: targetUserId,
      userName: targetUserName,
      userType: targetUserType,
      lastActivity: Date.now(),
      isDestroyed: false
    }

    peersRef.current.set(targetSocketId, peerConnection)
    setPeers(new Map(peersRef.current))

    return peer
  }, [isReconnecting])

  // Safe peer removal
  const removePeer = useCallback((socketId: string) => {
    const peerConnection = peersRef.current.get(socketId)
    if (peerConnection && !peerConnection.isDestroyed) {
      try {
        peerConnection.peer.destroy()
        peerConnection.isDestroyed = true
      } catch (e) {
        console.error('Error destroying peer:', e)
      }
      
      peersRef.current.delete(socketId)
      setPeers(new Map(peersRef.current))
      
      // Remove streams
      remoteStreamsRef.current.delete(socketId)
      setRemoteStreams(prev => {
        const newStreams = new Map(prev)
        newStreams.delete(socketId)
        return newStreams
      })
      
      processingOffer.current.delete(socketId)
    }
  }, [])

  // Join room function - ONLY called when socket and stream are ready
  const joinRoom = useCallback(() => {
    if (!socketRef.current || !roomId || !localStreamRef.current) {
      console.log('Cannot join room yet, missing requirements')
      return
    }

    // Verify media tracks are active
    const videoTrack = localStreamRef.current.getVideoTracks()[0]
    const audioTrack = localStreamRef.current.getAudioTracks()[0]
    
    if (videoTrack && !videoTrack.enabled) {
      videoTrack.enabled = true
    }
    if (audioTrack && !audioTrack.enabled) {
      audioTrack.enabled = true
    }

    console.log(`🚀 Joining room ${roomId} as ${userName}`)
    socketRef.current.emit('join-room', {
      roomId,
      userId,
      userType,
      userName
    })
    roomJoined.current = true
  }, [roomId, userId, userName, userType])

  // Heartbeat for connection monitoring
  const startHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current)
    }

    heartbeatInterval.current = setInterval(() => {
      if (socketRef.current?.connected && roomId) {
        socketRef.current.emit('heartbeat', { 
          roomId, 
          timestamp: Date.now(),
          userId,
          userName
        })
      }
    }, 30000)
  }, [roomId, userId, userName])

  // Main effect for WebRTC setup - FIXED DEPENDENCIES
  useEffect(() => {
    if (!socket || !roomId || !localStream || !SimplePeer) {
      console.log('WebRTC setup waiting for:', {
        socket: !!socket,
        roomId: !!roomId,
        localStream: !!localStream,
        SimplePeer: !!SimplePeer
      })
      return
    }

    console.log('Setting up WebRTC...')
    
    startHeartbeat()
    joinRoom()

    // Socket event handlers (using refs to avoid dependency issues)
    const handleReconnect = () => {
      console.log('🔄 Socket reconnected, rejoining room...')
      setIsReconnecting(false)
      
      // Clean up old peers
      peersRef.current.forEach((peerConn) => {
        if (!peerConn.isDestroyed) {
          try {
            peerConn.peer.destroy()
            peerConn.isDestroyed = true
          } catch (e) {
            console.error('Error destroying old peer:', e)
          }
        }
      }) // THIS WAS THE MISSING BRACKET
      
      peersRef.current.clear()
      remoteStreamsRef.current.clear()
      setRemoteStreams(new Map())
      setPeers(new Map())
      
      // Rejoin room after a short delay
      setTimeout(() => {
        roomJoined.current = false
        joinRoom()
      }, 500)
    }

    const handleDisconnect = (reason: string) => {
      console.log(`Socket disconnected: ${reason}`)
      setIsReconnecting(true)
      setConnectionStatus('reconnecting')
    }

    const handleExistingParticipants = (participants: any[]) => {
      console.log('📋 Room participants:', participants)
      setRoomParticipants(participants)
      setIsReconnecting(false)
      setConnectionStatus('connecting')
      
      // Create peers for existing participants
      participants.forEach(participant => {
        if (participant.socketId !== socket.id) {
          setTimeout(() => {
            createPeer(
              participant.socketId,
              participant.userId,
              participant.userName,
              participant.userType,
              true
            )
          }, 100)
        }
      })
    }

    const handleUserJoined = (participant: any) => {
      console.log('👤 User joined:', participant)
      
      if (participant.socketId === socket.id) return
      
      setRoomParticipants(prev => {
        const exists = prev.some(p => p.socketId === participant.socketId)
        if (exists) return prev
        return [...prev, participant]
      })
    }

    const handleOffer = ({ offer, from }: any) => {
      console.log('📨 Received offer from:', from)
      
      if (processingOffer.current.has(from)) {
        console.log('Already processing offer from', from)
        return
      }
      processingOffer.current.add(from)
      
      // Clean up any existing peer first
      const existingPeer = peersRef.current.get(from)
      if (existingPeer && !existingPeer.isDestroyed) {
        try {
          existingPeer.peer.destroy()
          existingPeer.isDestroyed = true
        } catch (e) {
          console.error('Error cleaning up peer before offer:', e)
        }
        peersRef.current.delete(from)
      }
      
      // Find participant info from ref to avoid dependency
      const participant = roomParticipantsRef.current.find(p => p.socketId === from) || {
        socketId: from,
        userId: 'unknown',
        userName: 'Unknown User',
        userType: 'patient'
      }
      
      // Create new peer
      const peer = createPeer(
        from,
        participant.userId,
        participant.userName,
        participant.userType,
        false
      )
      
      if (peer) {
        setTimeout(() => {
          try {
            if (!peer.destroyed) {
              peer.signal(offer)
            }
          } catch (e) {
            console.error('Error signaling new peer:', e)
          }
        }, 100)
      }
      
      // Clear processing flag
      setTimeout(() => {
        processingOffer.current.delete(from)
      }, 5000)
    }

    const handleAnswer = ({ answer, from }: any) => {
      const peerConnection = peersRef.current.get(from)
      if (peerConnection && !peerConnection.isDestroyed) {
        try {
          peerConnection.peer.signal(answer)
          peerConnection.lastActivity = Date.now()
        } catch (e) {
          console.error('Error processing answer:', e)
        }
      }
    }

    const handleIceCandidate = ({ candidate, from }: any) => {
      const peerConnection = peersRef.current.get(from)
      if (peerConnection && !peerConnection.isDestroyed) {
        try {
          peerConnection.peer.signal(candidate)
          peerConnection.lastActivity = Date.now()
        } catch (e) {
          console.error('Error adding ICE candidate:', e)
        }
      }
    }

    const handleUserLeft = ({ socketId }: any) => {
      console.log('👋 User left:', socketId)
      removePeer(socketId)
      setRoomParticipants(prev => prev.filter(p => p.socketId !== socketId))
    }

    const handleChatMessage = (message: ChatMessage) => {
      setChatMessages(prev => [...prev, { ...message, id: Date.now().toString() }])
    }

    // Attach all listeners
    socket.on('reconnect', handleReconnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('existing-participants', handleExistingParticipants)
    socket.on('user-joined', handleUserJoined)
    socket.on('offer', handleOffer)
    socket.on('answer', handleAnswer)
    socket.on('ice-candidate', handleIceCandidate)
    socket.on('user-left', handleUserLeft)
    socket.on('new-chat-message', handleChatMessage)

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up WebRTC')
      
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current)
      }
      
      // Only leave room if intentionally unmounting
      if (socket.connected && roomJoined.current && !isReconnecting) {
        socket.emit('leave-room')
      }
      
      socket.off('reconnect', handleReconnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('existing-participants', handleExistingParticipants)
      socket.off('user-joined', handleUserJoined)
      socket.off('offer', handleOffer)
      socket.off('answer', handleAnswer)
      socket.off('ice-candidate', handleIceCandidate)
      socket.off('user-left', handleUserLeft)
      socket.off('new-chat-message', handleChatMessage)
      
      // Clean up peers if not reconnecting
      if (!isReconnecting) {
        peersRef.current.forEach(peerConnection => {
          if (!peerConnection.isDestroyed) {
            try {
              peerConnection.peer.destroy()
            } catch (e) {
              console.error('Error destroying peer:', e)
            }
          }
        })
        peersRef.current.clear()
        remoteStreamsRef.current.clear()
        setPeers(new Map())
        setRemoteStreams(new Map())
      }
    }
  }, [socket, roomId, userId, userName, userType, localStream, createPeer, removePeer, joinRoom, startHeartbeat])
  // REMOVED roomParticipants and isReconnecting from dependencies to prevent infinite loop

  // Media control functions
  const sendChatMessage = useCallback((message: string) => {
    if (!socketRef.current) return
    
    socketRef.current.emit('chat-message', {
      roomId,
      message,
      userName,
      userType
    })
    
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      message,
      userName,
      userType,
      timestamp: new Date().toISOString(),
      socketId: socketRef.current?.id || ''
    }])
  }, [roomId, userName, userType])

  const toggleVideo = useCallback((enabled: boolean) => {
    if (!localStreamRef.current) return
    
    const videoTracks = localStreamRef.current.getVideoTracks()
    videoTracks.forEach(track => {
      track.enabled = enabled
    })
    
    if (socketRef.current?.connected) {
      socketRef.current.emit('toggle-video', { enabled, roomId })
    }
  }, [roomId])

  const toggleAudio = useCallback((enabled: boolean) => {
    if (!localStreamRef.current) return
    
    const audioTracks = localStreamRef.current.getAudioTracks()
    audioTracks.forEach(track => {
      track.enabled = enabled
    })
    
    if (socketRef.current?.connected) {
      socketRef.current.emit('toggle-audio', { enabled, roomId })
    }
  }, [roomId])

  const startScreenShare = useCallback(async () => {
    if (!socketRef.current) return false
    
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      })
      
      screenShareStreamRef.current = screenStream
      
      const videoTrack = screenStream.getVideoTracks()[0]
      peersRef.current.forEach(peerConnection => {
        if (!peerConnection.isDestroyed && peerConnection.peer._pc) {
          const sender = peerConnection.peer._pc.getSenders()
            .find((s: RTCRtpSender) => s.track?.kind === 'video')
          if (sender) {
            sender.replaceTrack(videoTrack)
          }
        }
      })
      
      videoTrack.onended = () => {
        stopScreenShare()
      }
      
      if (socketRef.current.connected) {
        socketRef.current.emit('start-screen-share', { roomId })
      }
      setIsScreenSharing(true)
      
      return true
    } catch (error) {
      console.error('Error starting screen share:', error)
      return false
    }
  }, [roomId])

  const stopScreenShare = useCallback(() => {
    if (!localStreamRef.current) return
    
    if (screenShareStreamRef.current) {
      screenShareStreamRef.current.getTracks().forEach(track => track.stop())
      screenShareStreamRef.current = null
    }
    
    const videoTrack = localStreamRef.current.getVideoTracks()[0]
    peersRef.current.forEach(peerConnection => {
      if (!peerConnection.isDestroyed && peerConnection.peer._pc && videoTrack) {
        const sender = peerConnection.peer._pc.getSenders()
          .find((s: RTCRtpSender) => s.track?.kind === 'video')
        if (sender) {
          sender.replaceTrack(videoTrack)
        }
      }
    })
    
    if (socketRef.current?.connected) {
      socketRef.current.emit('stop-screen-share', { roomId })
    }
    setIsScreenSharing(false)
  }, [roomId])

  return {
    peers,
    remoteStreams,
    chatMessages,
    roomParticipants,
    isScreenSharing,
    connectionStatus,
    isReconnecting,
    streamUpdateTrigger,
    sendChatMessage,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare
  }
}

export { useWebRTC }
export default useWebRTC