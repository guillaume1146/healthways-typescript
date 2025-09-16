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
  reconnectAttempts?: number
  lastActivity?: number
}

interface UseWebRTCProps {
  socket: Socket | null
  roomId: string
  userId: string
  userName: string
  userType: string
  localStream: MediaStream | null
}

interface ChatMessage {
  id: string
  message: string
  userName: string
  userType: string
  timestamp: string
  socketId: string
}

const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 2000
const HEARTBEAT_INTERVAL = 30000 // 30 seconds
const PEER_TIMEOUT = 60000 // 60 seconds

function useWebRTC({
  socket,
  roomId,
  userId,
  userName,
  userType,
  localStream
}: UseWebRTCProps) {

  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map())
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [roomParticipants, setRoomParticipants] = useState<any[]>([])
  const [connectionStatus, setConnectionStatus] = useState<string>('connecting')
  const [isReconnecting, setIsReconnecting] = useState(false)
  const peersRef = useRef<Map<string, PeerConnection>>(new Map())
  const screenShareStreamRef = useRef<MediaStream | null>(null)
  const processingOffer = useRef<Set<string>>(new Set())
  const reconnectTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null)
  const lastSocketId = useRef<string>('')
  const roomDataRef = useRef<{ roomId: string; userId: string; userName: string; userType: string } | null>(null)

  useEffect(() => {
    roomDataRef.current = { roomId, userId, userName, userType }
  }, [roomId, userId, userName, userType])

  const startHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current)
    }

    heartbeatInterval.current = setInterval(() => {
      if (socket?.connected) {
        socket.emit('heartbeat', { roomId, timestamp: Date.now() })
        const now = Date.now()
        peersRef.current.forEach((peerConnection, socketId) => {
          if (peerConnection.lastActivity && now - peerConnection.lastActivity > PEER_TIMEOUT) {
            console.log(`Peer ${socketId} timed out, attempting reconnection`)
            reconnectPeer(socketId, peerConnection)
          }
        })
      }
    }, HEARTBEAT_INTERVAL)
  }, [socket, roomId])

  const stopHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current)
      heartbeatInterval.current = null
    }
  }, [])

  const reconnectPeer = useCallback((targetSocketId: string, oldConnection: PeerConnection) => {
    const attempts = (oldConnection.reconnectAttempts || 0) + 1
    if (attempts > MAX_RECONNECT_ATTEMPTS) {
      console.log(`Max reconnection attempts reached for ${targetSocketId}`)
      removePeer(targetSocketId)
      return
    }

    console.log(`Attempting to reconnect to peer ${targetSocketId} (attempt ${attempts}/${MAX_RECONNECT_ATTEMPTS})`)
    const existingTimeout = reconnectTimeouts.current.get(targetSocketId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Remove old peer
    removePeer(targetSocketId)

    // Schedule reconnection
    const timeout = setTimeout(() => {
      if (socket?.connected && localStream) {
        const updatedConnection = { ...oldConnection, reconnectAttempts: attempts }
        createPeer(
          targetSocketId,
          updatedConnection.userId,
          updatedConnection.userName,
          updatedConnection.userType,
          true
        )
      }
      reconnectTimeouts.current.delete(targetSocketId)
    }, RECONNECT_DELAY * attempts)

    reconnectTimeouts.current.set(targetSocketId, timeout)
  }, [socket, localStream])

  // Create a new peer connection with error recovery
  const createPeer = useCallback((
    targetSocketId: string,
    targetUserId: string,
    targetUserName: string,
    targetUserType: string,
    initiator: boolean
  ) => {
    if (!localStream || !socket || !SimplePeer) {
      console.error('Cannot create peer: missing requirements')
      return null
    }

    // Don't create duplicate peers
    if (peersRef.current.has(targetSocketId)) {
      console.log(`Peer already exists for ${targetSocketId}`)
      return peersRef.current.get(targetSocketId)?.peer
    }

    console.log(`Creating peer connection: initiator=${initiator}, target=${targetSocketId}`)

    const peer = new SimplePeer({
      initiator,
      trickle: true,
      stream: localStream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' }
        ],
        iceCandidatePoolSize: 10
      },
      reconnectTimer: 100,
      iceTransportPolicy: 'all',
      bundlePolicy: 'balanced',
      rtcpMuxPolicy: 'require'
    })

    let signalTimeout: NodeJS.Timeout | null = null

    peer.on('signal', (signal: any) => {
      // Clear any existing signal timeout
      if (signalTimeout) {
        clearTimeout(signalTimeout)
      }

      // Set a timeout for signal acknowledgment
      signalTimeout = setTimeout(() => {
        console.log(`Signal timeout for ${targetSocketId}, attempting reconnection`)
        const peerConnection = peersRef.current.get(targetSocketId)
        if (peerConnection) {
          reconnectPeer(targetSocketId, peerConnection)
        }
      }, 10000)

      if (signal.type === 'offer') {
        socket.emit('offer', { offer: signal, to: targetSocketId })
      } else if (signal.type === 'answer') {
        socket.emit('answer', { answer: signal, to: targetSocketId })
      } else if (signal.candidate) {
        socket.emit('ice-candidate', { candidate: signal, to: targetSocketId })
      }
    })

    peer.on('stream', (stream: MediaStream) => {
      console.log(`✅ Received stream from ${targetSocketId}`)
      
      // Clear signal timeout on successful stream
      if (signalTimeout) {
        clearTimeout(signalTimeout)
        signalTimeout = null
      }

      setRemoteStreams(prev => {
        const newStreams = new Map(prev)
        newStreams.set(targetSocketId, stream)
        return newStreams
      })
      setConnectionStatus('connected')
      
      // Update last activity
      const peerConnection = peersRef.current.get(targetSocketId)
      if (peerConnection) {
        peerConnection.lastActivity = Date.now()
        peerConnection.reconnectAttempts = 0 // Reset on successful connection
      }
    })

    peer.on('connect', () => {
      console.log(`✅ Connected to peer ${targetSocketId}`)
      setConnectionStatus('connected')
      
      // Clear signal timeout
      if (signalTimeout) {
        clearTimeout(signalTimeout)
        signalTimeout = null
      }

      // Update last activity
      const peerConnection = peersRef.current.get(targetSocketId)
      if (peerConnection) {
        peerConnection.lastActivity = Date.now()
        peerConnection.reconnectAttempts = 0
      }
    })

    peer.on('error', (err: Error) => {
      console.error(`Peer connection error with ${targetSocketId}:`, err.message)
      
      // Don't immediately destroy on error, attempt reconnection
      if (err.message.includes('Ice connection failed') || 
          err.message.includes('Connection failed')) {
        const peerConnection = peersRef.current.get(targetSocketId)
        if (peerConnection) {
          reconnectPeer(targetSocketId, peerConnection)
        }
      }
    })

    peer.on('close', () => {
      console.log(`Connection closed with ${targetSocketId}`)
      
      // Attempt reconnection if not manually closed
      const peerConnection = peersRef.current.get(targetSocketId)
      if (peerConnection && socket?.connected) {
        reconnectPeer(targetSocketId, peerConnection)
      } else {
        removePeer(targetSocketId)
      }
    })

    // Monitor data channel for activity
    peer.on('data', () => {
      const peerConnection = peersRef.current.get(targetSocketId)
      if (peerConnection) {
        peerConnection.lastActivity = Date.now()
      }
    })

    const peerConnection: PeerConnection = {
      peer,
      socketId: targetSocketId,
      userId: targetUserId,
      userName: targetUserName,
      userType: targetUserType,
      reconnectAttempts: 0,
      lastActivity: Date.now()
    }

    peersRef.current.set(targetSocketId, peerConnection)
    setPeers(new Map(peersRef.current))

    return peer
  }, [localStream, socket, reconnectPeer])

  // Remove a peer connection
  const removePeer = useCallback((socketId: string) => {
    const peerConnection = peersRef.current.get(socketId)
    if (peerConnection) {
      try {
        peerConnection.peer.destroy()
      } catch (e) {
        console.error('Error destroying peer:', e)
      }
      peersRef.current.delete(socketId)
      setPeers(new Map(peersRef.current))
      
      setRemoteStreams(prev => {
        const newStreams = new Map(prev)
        newStreams.delete(socketId)
        return newStreams
      })
      
      processingOffer.current.delete(socketId)
    }

    // Clear any reconnection timeout
    const timeout = reconnectTimeouts.current.get(socketId)
    if (timeout) {
      clearTimeout(timeout)
      reconnectTimeouts.current.delete(socketId)
    }
  }, [])

  // Rejoin room (used for reconnection)
  const rejoinRoom = useCallback(() => {
    if (!socket || !roomDataRef.current || !localStream) {
      console.log('Cannot rejoin room: missing requirements')
      return
    }

    const { roomId, userId, userName, userType } = roomDataRef.current
    console.log(`🔄 Rejoining room ${roomId}`)
    
    setIsReconnecting(true)
    socket.emit('join-room', { roomId, userId, userType, userName })
  }, [socket, localStream])

  // Handle socket reconnection
  useEffect(() => {
    if (!socket) return

    const handleReconnect = () => {
      console.log('🔄 Socket reconnected, rejoining room...')
      if (roomDataRef.current && localStream) {
        // Clear all existing peers
        peersRef.current.forEach((_, socketId) => removePeer(socketId))
        
        // Rejoin the room
        setTimeout(() => rejoinRoom(), 1000)
      }
    }

    socket.on('reconnect', handleReconnect)
    socket.on('connect', () => {
      if (lastSocketId.current && lastSocketId.current !== socket.id) {
        console.log('Socket ID changed, handling as reconnection')
        handleReconnect()
      }
      lastSocketId.current = socket.id || ''
    })

    return () => {
      socket.off('reconnect', handleReconnect)
    }
  }, [socket, rejoinRoom, removePeer, localStream])

  // Main room join and event handling
  useEffect(() => {
    if (!socket || !roomId || !localStream || !SimplePeer) {
      return
    }

    console.log(`🚀 Joining room ${roomId} as ${userName} (${userType})`)
    
    // Start heartbeat
    startHeartbeat()

    // Join the room
    socket.emit('join-room', { roomId, userId, userType, userName })

    // Event handlers remain the same as your original code...
    // [Rest of the event handlers from your original implementation]
    
    const handleExistingParticipants = (participants: any[]) => {
      console.log('📋 Existing participants:', participants)
      setRoomParticipants(participants)
      setIsReconnecting(false)
      
      participants.forEach(participant => {
        if (participant.socketId !== socket.id) {
          createPeer(
            participant.socketId,
            participant.userId,
            participant.userName,
            participant.userType,
            true
          )
        }
      })
    }

    const handleUserJoined = (participant: any) => {
      console.log('👤 New user joined:', participant)
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
      
      const existingPeer = peersRef.current.get(from)
      
      if (existingPeer) {
        try {
          existingPeer.peer.signal(offer)
          existingPeer.lastActivity = Date.now()
        } catch (e) {
          console.error('Error signaling existing peer:', e)
          removePeer(from)
          processingOffer.current.delete(from)
        }
      } else {
        let participantInfo = roomParticipants.find(p => p.socketId === from) || {
          socketId: from,
          userId: 'unknown',
          userName: 'Unknown User',
          userType: 'patient'
        }
        
        const peer = createPeer(
          from,
          participantInfo.userId,
          participantInfo.userName,
          participantInfo.userType,
          false
        )
        
        if (peer) {
          try {
            peer.signal(offer)
          } catch (e) {
            console.error('Error signaling new peer:', e)
            removePeer(from)
          }
        }
      }
      
      setTimeout(() => {
        processingOffer.current.delete(from)
      }, 5000)
    }

    const handleAnswer = ({ answer, from }: any) => {
      console.log('📨 Received answer from:', from)
      const peerConnection = peersRef.current.get(from)
      if (peerConnection) {
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
      if (peerConnection) {
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

    const handleHeartbeatResponse = ({ from }: any) => {
      const peerConnection = peersRef.current.get(from)
      if (peerConnection) {
        peerConnection.lastActivity = Date.now()
      }
    }

    // Attach event listeners
    socket.on('existing-participants', handleExistingParticipants)
    socket.on('user-joined', handleUserJoined)
    socket.on('offer', handleOffer)
    socket.on('answer', handleAnswer)
    socket.on('ice-candidate', handleIceCandidate)
    socket.on('user-left', handleUserLeft)
    socket.on('new-chat-message', handleChatMessage)
    socket.on('heartbeat-response', handleHeartbeatResponse)

    return () => {
      console.log('🧹 Cleaning up WebRTC connections')
      stopHeartbeat()
      socket.emit('leave-room')
      
      socket.off('existing-participants', handleExistingParticipants)
      socket.off('user-joined', handleUserJoined)
      socket.off('offer', handleOffer)
      socket.off('answer', handleAnswer)
      socket.off('ice-candidate', handleIceCandidate)
      socket.off('user-left', handleUserLeft)
      socket.off('new-chat-message', handleChatMessage)
      socket.off('heartbeat-response', handleHeartbeatResponse)
      
      // Clear all reconnection timeouts
      reconnectTimeouts.current.forEach(timeout => clearTimeout(timeout))
      reconnectTimeouts.current.clear()
      
      // Clean up all peer connections
      peersRef.current.forEach(peerConnection => {
        try {
          peerConnection.peer.destroy()
        } catch (e) {
          console.error('Error destroying peer during cleanup:', e)
        }
      })
      peersRef.current.clear()
      setPeers(new Map())
      setRemoteStreams(new Map())
      processingOffer.current.clear()
    }
  }, [socket, roomId, userId, userName, userType, localStream, createPeer, removePeer, startHeartbeat, stopHeartbeat])

  // Rest of your methods remain the same...
  const sendChatMessage = useCallback((message: string) => {
    if (!socket) return
    
    socket.emit('chat-message', {
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
      socketId: socket.id || ''
    }])
  }, [socket, roomId, userName, userType])

  const toggleVideo = useCallback((enabled: boolean) => {
    if (!localStream) return
    
    localStream.getVideoTracks().forEach(track => {
      track.enabled = enabled
    })
    
    if (socket) {
      socket.emit('toggle-video', { enabled, roomId })
    }
  }, [socket, localStream, roomId])

  const toggleAudio = useCallback((enabled: boolean) => {
    if (!localStream) return
    
    localStream.getAudioTracks().forEach(track => {
      track.enabled = enabled
    })
    
    if (socket) {
      socket.emit('toggle-audio', { enabled, roomId })
    }
  }, [socket, localStream, roomId])

  const startScreenShare = useCallback(async () => {
    if (!socket) return false
    
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      })
      
      screenShareStreamRef.current = screenStream
      
      const videoTrack = screenStream.getVideoTracks()[0]
      peersRef.current.forEach(peerConnection => {
        const sender = peerConnection.peer._pc?.getSenders()
          .find((s: RTCRtpSender) => s.track?.kind === 'video')
        if (sender) {
          sender.replaceTrack(videoTrack)
        }
      })
      
      videoTrack.onended = () => {
        stopScreenShare()
      }
      
      socket.emit('start-screen-share', { roomId })
      setIsScreenSharing(true)
      
      return true
    } catch (error) {
      console.error('Error starting screen share:', error)
      return false
    }
  }, [socket, roomId])

  const stopScreenShare = useCallback(() => {
    if (!localStream) return
    
    if (screenShareStreamRef.current) {
      screenShareStreamRef.current.getTracks().forEach(track => track.stop())
      screenShareStreamRef.current = null
    }
    
    const videoTrack = localStream.getVideoTracks()[0]
    peersRef.current.forEach(peerConnection => {
      const sender = peerConnection.peer._pc?.getSenders()
        .find((s: RTCRtpSender) => s.track?.kind === 'video')
      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack)
      }
    })
    
    if (socket) {
      socket.emit('stop-screen-share', { roomId })
    }
    setIsScreenSharing(false)
  }, [socket, localStream, roomId])

  return {
    peers,
    remoteStreams,
    chatMessages,
    roomParticipants,
    isScreenSharing,
    connectionStatus,
    isReconnecting,
    sendChatMessage,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare
  }
}

export { useWebRTC }
export default useWebRTC