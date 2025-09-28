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
  lastActivity: number
  isPolite: boolean
  makingOffer: boolean
  ignoreOffer: boolean
  iceRestartCount: number
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

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' }
]

const MAX_ICE_RESTART_ATTEMPTS = 5
const ICE_RESTART_DELAY = 2000
const CONNECTION_STATE_CHECK_INTERVAL = 5000

export function useWebRTC({
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
  const [sessionId, setSessionId] = useState<string>('')
  
  const peersRef = useRef<Map<string, PeerConnection>>(new Map())
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map())
  const screenShareStreamRef = useRef<MediaStream | null>(null)
  const roomJoined = useRef(false)
  const localStreamRef = useRef<MediaStream | null>(null)
  const sessionIdRef = useRef<string>('')
  const connectionCheckInterval = useRef<NodeJS.Timeout | null>(null)
  const iceRestartTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const processingPeers = useRef<Set<string>>(new Set())
  const joinInProgress = useRef(false)

  // Update local stream ref
  useEffect(() => {
    localStreamRef.current = localStream
  }, [localStream])

  // Generate or retrieve session ID
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem(`webrtc_session_${roomId}`)
    const newSessionId = storedSessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    setSessionId(newSessionId)
    sessionIdRef.current = newSessionId
    
    if (!storedSessionId) {
      sessionStorage.setItem(`webrtc_session_${roomId}`, newSessionId)
    }
  }, [roomId])

  // Perfect Negotiation helper functions
  const isPolite = useCallback((targetUserId: string) => {
    return userId < targetUserId
  }, [userId])

  // Enhanced ICE restart function
  const performIceRestart = useCallback(async (peerConnection: PeerConnection) => {
    if (!peerConnection.peer || peerConnection.isDestroyed || peerConnection.iceRestartCount >= MAX_ICE_RESTART_ATTEMPTS) {
      console.log(`Cannot perform ICE restart for ${peerConnection.socketId}`)
      return false
    }
    
    console.log(`🔄 Performing ICE restart for peer ${peerConnection.socketId}`)
    
    try {
      peerConnection.iceRestartCount++
      
      if (peerConnection.peer._pc) {
        const offer = await peerConnection.peer._pc.createOffer({ iceRestart: true })
        await peerConnection.peer._pc.setLocalDescription(offer)
        
        if (socket?.connected) {
          socket.emit('offer', { 
            offer, 
            to: peerConnection.socketId,
            iceRestart: true 
          })
          socket.emit('ice-restart', { to: peerConnection.socketId })
        }
      }
      
      return true
    } catch (error) {
      console.error('ICE restart failed:', error)
      return false
    }
  }, [socket])

  // Monitor connection health
  const checkConnectionHealth = useCallback(() => {
    peersRef.current.forEach((peerConnection, socketId) => {
      if (!peerConnection.peer || peerConnection.isDestroyed || !peerConnection.peer._pc) return
      
      const pc = peerConnection.peer._pc
      const iceState = pc.iceConnectionState
      const connectionState = pc.connectionState
      
      console.log(`Connection health for ${socketId}: ICE=${iceState}, Connection=${connectionState}`)
      
      if (iceState === 'failed' || connectionState === 'failed') {
        console.log(`Connection failed for ${socketId}, attempting ICE restart`)
        
        const existingTimer = iceRestartTimers.current.get(socketId)
        if (existingTimer) {
          clearTimeout(existingTimer)
        }
        
        const timer = setTimeout(() => {
          performIceRestart(peerConnection)
          iceRestartTimers.current.delete(socketId)
        }, ICE_RESTART_DELAY)
        
        iceRestartTimers.current.set(socketId, timer)
      } else if (iceState === 'disconnected') {
        setTimeout(() => {
          if (pc.iceConnectionState === 'disconnected') {
            console.log(`Prolonged disconnection for ${socketId}, attempting ICE restart`)
            performIceRestart(peerConnection)
          }
        }, 5000)
      }
      
      if (socket?.connected) {
        socket.emit('ice-state-change', { state: iceState })
      }
    })
  }, [performIceRestart, socket])

  // Create peer with cleanup check
  const createPeer = useCallback((
    targetSocketId: string,
    targetUserId: string,
    targetUserName: string,
    targetUserType: string,
    initiator: boolean
  ) => {
    if (!localStreamRef.current || !socket || !SimplePeer) {
      console.error('Cannot create peer: missing requirements')
      return null
    }

    // Check if already processing this peer
    if (processingPeers.current.has(targetSocketId)) {
      console.log(`Already processing peer for ${targetSocketId}`)
      return peersRef.current.get(targetSocketId)?.peer || null
    }

    // Clean up existing peer if it exists
    const existingPeer = peersRef.current.get(targetSocketId)
    if (existingPeer) {
      if (!existingPeer.isDestroyed && existingPeer.peer && !existingPeer.peer.destroyed) {
        console.log(`Reusing existing peer for ${targetSocketId}`)
        return existingPeer.peer
      }
      
      // Clean up destroyed peer
      try {
        if (existingPeer.peer && !existingPeer.peer.destroyed) {
          existingPeer.peer.destroy()
        }
      } catch (e) {
        console.error('Error cleaning up existing peer:', e)
      }
      peersRef.current.delete(targetSocketId)
    }

    console.log(`Creating new peer for ${targetSocketId}, initiator=${initiator}`)
    processingPeers.current.add(targetSocketId)

    try {
      const peer = new SimplePeer({
        initiator,
        trickle: true,
        stream: localStreamRef.current,
        config: {
          iceServers: ICE_SERVERS,
          iceCandidatePoolSize: 10,
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require',
          sdpSemantics: 'unified-plan'
        }
      })

      const peerConnection: PeerConnection = {
        peer,
        socketId: targetSocketId,
        userId: targetUserId,
        userName: targetUserName,
        userType: targetUserType,
        lastActivity: Date.now(),
        isPolite: isPolite(targetUserId),
        makingOffer: false,
        ignoreOffer: false,
        iceRestartCount: 0,
        isDestroyed: false
      }

      // Handle signaling
      peer.on('signal', (signal: any) => {
        if (!socket.connected || peerConnection.isDestroyed) return
        
        if (signal.type === 'offer') {
          peerConnection.makingOffer = true
          socket.emit('offer', { offer: signal, to: targetSocketId })
        } else if (signal.type === 'answer') {
          socket.emit('answer', { answer: signal, to: targetSocketId })
        } else if (signal.candidate) {
          socket.emit('ice-candidate', { candidate: signal, to: targetSocketId })
        }
        
        peerConnection.makingOffer = false
      })

      // Handle stream
      peer.on('stream', (stream: MediaStream) => {
        console.log(`✅ Received stream from ${targetSocketId}`)
        
        remoteStreamsRef.current.set(targetSocketId, stream)
        setRemoteStreams(new Map(remoteStreamsRef.current))
        
        peerConnection.lastActivity = Date.now()
        peerConnection.iceRestartCount = 0
        setConnectionStatus('connected')
        setIsReconnecting(false)
      })

      // Handle connection events
      peer.on('connect', () => {
        console.log(`✅ Connected to peer ${targetSocketId}`)
        setConnectionStatus('connected')
        setIsReconnecting(false)
        peerConnection.iceRestartCount = 0
      })

      peer.on('error', (err: Error) => {
        // Ignore expected errors from normal disconnection
        const errorMessage = err.message || err.toString()
        const isExpectedError = 
          errorMessage.includes('User-Initiated Abort') ||
          errorMessage.includes('Close called') ||
          errorMessage.includes('Ice connection failed') && peerConnection.isDestroyed ||
          errorMessage.includes('Connection failed') && peerConnection.isDestroyed
        
        if (isExpectedError) {
          console.log(`Expected disconnection for ${targetSocketId}`)
          return
        }
        
        console.error(`Peer error with ${targetSocketId}:`, errorMessage)
        
        if (!peerConnection.isDestroyed && peerConnection.iceRestartCount < MAX_ICE_RESTART_ATTEMPTS) {
          setTimeout(() => {
            if (!peerConnection.isDestroyed) {
              performIceRestart(peerConnection)
            }
          }, ICE_RESTART_DELAY)
        }
      })

      peer.on('close', () => {
        console.log(`Connection closed with ${targetSocketId}`)
        peerConnection.isDestroyed = true
        
        if (!isReconnecting && peerConnection.iceRestartCount >= MAX_ICE_RESTART_ATTEMPTS) {
          removePeer(targetSocketId)
        }
      })

      // Monitor ICE connection state
      if (peer._pc) {
        peer._pc.oniceconnectionstatechange = () => {
          if (peerConnection.isDestroyed) return
          
          const state = peer._pc.iceConnectionState
          console.log(`ICE state for ${targetSocketId}: ${state}`)
          
          if (state === 'failed' && peerConnection.iceRestartCount < MAX_ICE_RESTART_ATTEMPTS) {
            performIceRestart(peerConnection)
          }
        }
        
        peer._pc.onconnectionstatechange = () => {
          if (peerConnection.isDestroyed) return
          
          const state = peer._pc.connectionState
          console.log(`Connection state for ${targetSocketId}: ${state}`)
        }
      }

      peersRef.current.set(targetSocketId, peerConnection)
      setPeers(new Map(peersRef.current))

      return peer
    } finally {
      // Remove from processing after a delay
      setTimeout(() => {
        processingPeers.current.delete(targetSocketId)
      }, 1000)
    }
  }, [socket, isPolite, performIceRestart, isReconnecting])

  // Remove peer safely
  const removePeer = useCallback((socketId: string, isIntentionalLeave: boolean = false) => {
    const peerConnection = peersRef.current.get(socketId)
    if (peerConnection) {
      peerConnection.isDestroyed = true
      
      if (peerConnection.peer && !peerConnection.peer.destroyed) {
        try {
          // Remove all event listeners before destroying to prevent error events
          if (isIntentionalLeave) {
            peerConnection.peer.removeAllListeners('error')
            peerConnection.peer.removeAllListeners('close')
          }
          peerConnection.peer.destroy()
        } catch (e) {
          // Only log if it's not an intentional leave
          if (!isIntentionalLeave) {
            console.error('Error destroying peer:', e)
          }
        }
      }
      
      peersRef.current.delete(socketId)
      setPeers(new Map(peersRef.current))
      
      remoteStreamsRef.current.delete(socketId)
      setRemoteStreams(new Map(remoteStreamsRef.current))
      
      const timer = iceRestartTimers.current.get(socketId)
      if (timer) {
        clearTimeout(timer)
        iceRestartTimers.current.delete(socketId)
      }
      
      processingPeers.current.delete(socketId)
    }
  }, [])

  // Join room with debounce
  const joinRoom = useCallback(() => {
    if (!socket || !roomId || !localStreamRef.current || roomJoined.current || joinInProgress.current) {
      console.log('Cannot join room:', {
        socket: !!socket,
        roomId: !!roomId,
        localStream: !!localStreamRef.current,
        roomJoined: roomJoined.current,
        joinInProgress: joinInProgress.current
      })
      return
    }

    joinInProgress.current = true
    console.log(`Joining room ${roomId} with session ${sessionIdRef.current}`)
    
    socket.emit('join-room', {
      roomId,
      userId,
      userType,
      userName,
      sessionId: sessionIdRef.current
    })
    
    roomJoined.current = true
    
    if (saveRoomState) {
      saveRoomState({
        roomId,
        userId,
        userName,
        userType,
        sessionId: sessionIdRef.current
      })
    }
    
    // Reset flag after a delay
    setTimeout(() => {
      joinInProgress.current = false
    }, 2000)
  }, [socket, roomId, userId, userName, userType, saveRoomState])

  // Request session recovery
  const requestRecovery = useCallback(() => {
    if (!socket || !roomId) return
    
    console.log('Requesting session recovery')
    socket.emit('request-recovery', { roomId, userId })
  }, [socket, roomId, userId])

  // Main WebRTC setup - Fixed to prevent multiple executions
  useEffect(() => {
    if (!socket || !roomId || !localStream || !SimplePeer) {
      return
    }

    // Reset state for new session
    roomJoined.current = false
    joinInProgress.current = false
    processingPeers.current.clear()

    // Start connection health monitoring
    if (connectionCheckInterval.current) {
      clearInterval(connectionCheckInterval.current)
    }
    connectionCheckInterval.current = setInterval(checkConnectionHealth, CONNECTION_STATE_CHECK_INTERVAL)

    // Delay initial join to ensure stream is ready
    const joinTimeout = setTimeout(() => {
      joinRoom()
    }, 100)

    // Socket event handlers
    const handleExistingParticipants = ({ participants, sessionId: serverSessionId }: any) => {
      console.log('Existing participants:', participants)
      setRoomParticipants(participants)
      
      if (serverSessionId) {
        setSessionId(serverSessionId)
        sessionIdRef.current = serverSessionId
        sessionStorage.setItem(`webrtc_session_${roomId}`, serverSessionId)
      }
      
      // Delay peer creation to avoid race conditions
      participants.forEach((participant: any, index: number) => {
        if (participant.socketId !== socket.id) {
          setTimeout(() => {
            createPeer(
              participant.socketId,
              participant.userId,
              participant.userName,
              participant.userType,
              true
            )
          }, index * 100) // Stagger peer creation
        }
      })
    }

    const handleUserJoined = (participant: any) => {
      console.log('User joined:', participant)
      
      if (participant.socketId === socket.id) return
      
      setRoomParticipants(prev => {
        const exists = prev.some(p => p.socketId === participant.socketId)
        if (exists) return prev
        return [...prev, participant]
      })
    }

    const handleUserReconnected = ({ oldSocketId, newSocketId, userId, userName, userType }: any) => {
      console.log(`User ${userName} reconnected: ${oldSocketId} -> ${newSocketId}`)
      
      removePeer(oldSocketId, true) // Intentional removal for reconnection
      
      setRoomParticipants(prev => prev.map(p => 
        p.userId === userId ? { ...p, socketId: newSocketId } : p
      ))
      
      setTimeout(() => {
        createPeer(newSocketId, userId, userName, userType, true)
      }, 500)
    }

    const handleUserDisconnected = ({ socketId, userId, reason, canReconnect }: any) => {
      console.log(`User disconnected: ${socketId}, reason: ${reason}, can reconnect: ${canReconnect}`)
      
      if (canReconnect) {
        setRoomParticipants(prev => prev.map(p => 
          p.socketId === socketId ? { ...p, connected: false } : p
        ))
        
        const peerConnection = peersRef.current.get(socketId)
        if (peerConnection) {
          peerConnection.lastActivity = Date.now()
        }
      } else {
        // User intentionally left or session ended
        const isIntentional = reason === 'leave_room' || reason === 'transport close'
        removePeer(socketId, isIntentional)
        setRoomParticipants(prev => prev.filter(p => p.socketId !== socketId))
      }
    }

    const handleOffer = async ({ offer, from, iceRestart }: any) => {
      console.log(`Received ${iceRestart ? 'ICE restart' : ''} offer from ${from}`)
      
      let peerConnection = peersRef.current.get(from)
      
      if (!peerConnection || peerConnection.isDestroyed) {
        const participant = roomParticipants.find(p => p.socketId === from) || {
          socketId: from,
          userId: 'unknown',
          userName: 'Unknown User',
          userType: 'patient'
        }
        
        const peer = createPeer(
          from,
          participant.userId,
          participant.userName,
          participant.userType,
          false
        )
        
        if (peer) {
          peerConnection = peersRef.current.get(from)
        }
      }
      
      if (peerConnection && peerConnection.peer && !peerConnection.peer.destroyed && !peerConnection.isDestroyed) {
        const offerCollision = peerConnection.makingOffer || 
                              (peerConnection.peer._pc && peerConnection.peer._pc.signalingState !== 'stable')
        
        peerConnection.ignoreOffer = !peerConnection.isPolite && offerCollision
        
        if (peerConnection.ignoreOffer) {
          console.log('Ignoring offer due to collision')
          return
        }
        
        // Delay signal to ensure peer is ready
        setTimeout(() => {
          try {
            if (peerConnection && peerConnection.peer && !peerConnection.peer.destroyed && !peerConnection.isDestroyed) {
              peerConnection.peer.signal(offer)
            } else {
              console.log('Peer was destroyed before offer could be processed')
            }
          } catch (e) {
            console.error('Error processing offer:', e)
          }
        }, 100)
      } else {
        console.log('No valid peer connection for offer')
      }
    }

    const handleAnswer = ({ answer, from }: any) => {
      const peerConnection = peersRef.current.get(from)
      if (peerConnection?.peer && !peerConnection.peer.destroyed && !peerConnection.isDestroyed) {
        try {
          peerConnection.peer.signal(answer)
        } catch (e) {
          console.error('Error processing answer:', e)
        }
      }
    }

    const handleIceCandidate = ({ candidate, from }: any) => {
      const peerConnection = peersRef.current.get(from)
      if (peerConnection?.peer && !peerConnection.peer.destroyed && !peerConnection.isDestroyed && !peerConnection.ignoreOffer) {
        try {
          peerConnection.peer.signal(candidate)
        } catch (e) {
          console.error('Error adding ICE candidate:', e)
        }
      }
    }

    const handleIceRestartRequest = ({ from }: any) => {
      console.log(`ICE restart requested by ${from}`)
      const peerConnection = peersRef.current.get(from)
      if (peerConnection && !peerConnection.isDestroyed) {
        performIceRestart(peerConnection)
      }
    }

    const handleRecoveryData = ({ signalData, connections }: any) => {
      console.log('Received recovery data')
      setIsReconnecting(false)
      
      // Check if connections exist and is an array before iterating
      if (connections && Array.isArray(connections)) {
        connections.forEach((conn: any, index: number) => {
          if (conn.userId !== userId && conn.connectionState === 'connected') {
            setTimeout(() => {
              createPeer(
                conn.socketId,
                conn.userId,
                conn.userName,
                conn.userType,
                true
              )
            }, index * 100)
          }
        })
      } else {
        console.log('No connections in recovery data')
      }
    }

    const handleRecoveryInfo = ({ canRecover, session, lastSignal }: any) => {
      console.log('Recovery info:', { canRecover, session })
      
      if (canRecover && session) {
        setSessionId(session.id)
        sessionIdRef.current = session.id
        
        // Check if connections exist and is an array before iterating
        if (session.connections && Array.isArray(session.connections)) {
          session.connections.forEach((conn: any, index: number) => {
            if (conn.userId !== userId) {
              setTimeout(() => {
                createPeer(
                  conn.socketId,
                  conn.userId,
                  conn.userName,
                  conn.userType,
                  true
                )
              }, index * 100)
            }
          })
        } else {
          console.log('No connections found in recovery session')
        }
      }
    }

    const handleChatMessage = (message: ChatMessage) => {
      setChatMessages(prev => [...prev, { ...message, id: Date.now().toString() }])
    }

    const handleReconnect = () => {
      console.log('Socket reconnected, requesting recovery')
      setIsReconnecting(false)
      roomJoined.current = false
      joinInProgress.current = false
      
      // Clear all peers before recovery
      peersRef.current.forEach(pc => {
        if (pc.peer && !pc.peer.destroyed) {
          pc.peer.destroy()
        }
      })
      peersRef.current.clear()
      remoteStreamsRef.current.clear()
      setRemoteStreams(new Map())
      setPeers(new Map())
      
      setTimeout(() => {
        requestRecovery()
        joinRoom()
      }, 500)
    }

    const handleDisconnect = () => {
      console.log('Socket disconnected')
      setIsReconnecting(true)
      setConnectionStatus('reconnecting')
    }

    // Attach event listeners
    socket.on('existing-participants', handleExistingParticipants)
    socket.on('user-joined', handleUserJoined)
    socket.on('user-reconnected', handleUserReconnected)
    socket.on('user-disconnected', handleUserDisconnected)
    socket.on('user-left', handleUserDisconnected)
    socket.on('offer', handleOffer)
    socket.on('answer', handleAnswer)
    socket.on('ice-candidate', handleIceCandidate)
    socket.on('ice-restart-request', handleIceRestartRequest)
    socket.on('recovery-data', handleRecoveryData)
    socket.on('recovery-info', handleRecoveryInfo)
    socket.on('new-chat-message', handleChatMessage)
    socket.on('reconnect', handleReconnect)
    socket.on('disconnect', handleDisconnect)

    // Request recovery on mount if session exists
    if (sessionIdRef.current && !roomJoined.current) {
      requestRecovery()
    }

    // Cleanup
    return () => {
      clearTimeout(joinTimeout)
      
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current)
      }
      
      iceRestartTimers.current.forEach(timer => clearTimeout(timer))
      iceRestartTimers.current.clear()
      
      if (!isReconnecting && socket.connected) {
        socket.emit('leave-room')
      }
      
      socket.off('existing-participants', handleExistingParticipants)
      socket.off('user-joined', handleUserJoined)
      socket.off('user-reconnected', handleUserReconnected)
      socket.off('user-disconnected', handleUserDisconnected)
      socket.off('user-left', handleUserDisconnected)
      socket.off('offer', handleOffer)
      socket.off('answer', handleAnswer)
      socket.off('ice-candidate', handleIceCandidate)
      socket.off('ice-restart-request', handleIceRestartRequest)
      socket.off('recovery-data', handleRecoveryData)
      socket.off('recovery-info', handleRecoveryInfo)
      socket.off('new-chat-message', handleChatMessage)
      socket.off('reconnect', handleReconnect)
      socket.off('disconnect', handleDisconnect)
      
      if (!isReconnecting) {
        peersRef.current.forEach(peerConnection => {
          peerConnection.isDestroyed = true
          try {
            if (peerConnection.peer && !peerConnection.peer.destroyed) {
              // Remove error listeners before destroying to avoid error events
              peerConnection.peer.removeAllListeners('error')
              peerConnection.peer.removeAllListeners('close')
              peerConnection.peer.destroy()
            }
          } catch (e) {
            // Silently ignore errors during cleanup
          }
        })
        peersRef.current.clear()
        remoteStreamsRef.current.clear()
        processingPeers.current.clear()
        roomJoined.current = false
        joinInProgress.current = false
        
        if (clearRoomState) {
          clearRoomState()
        }
      }
    }
  }, [socket?.id, roomId, localStream]) // Only re-run when socket ID changes, not socket object

  // Media control functions
  const sendChatMessage = useCallback((message: string) => {
    if (!socket) return
    
    socket.emit('chat-message', {
      roomId,
      message,
      userName,
      userType
    })
  }, [socket, roomId, userName, userType])

  const toggleVideo = useCallback((enabled: boolean) => {
    if (!localStreamRef.current) return
    
    const videoTracks = localStreamRef.current.getVideoTracks()
    videoTracks.forEach(track => {
      track.enabled = enabled
    })
    
    if (socket?.connected) {
      socket.emit('toggle-video', { enabled, roomId })
    }
  }, [socket, roomId])

  const toggleAudio = useCallback((enabled: boolean) => {
    if (!localStreamRef.current) return
    
    const audioTracks = localStreamRef.current.getAudioTracks()
    audioTracks.forEach(track => {
      track.enabled = enabled
    })
    
    if (socket?.connected) {
      socket.emit('toggle-audio', { enabled, roomId })
    }
  }, [socket, roomId])

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
      
      if (socket.connected) {
        socket.emit('start-screen-share', { roomId })
      }
      setIsScreenSharing(true)
      
      return true
    } catch (error) {
      console.error('Error starting screen share:', error)
      return false
    }
  }, [socket, roomId])

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
    
    if (socket?.connected) {
      socket.emit('stop-screen-share', { roomId })
    }
    setIsScreenSharing(false)
  }, [socket, roomId])

  const triggerIceRestart = useCallback(() => {
    console.log('Manual ICE restart triggered for all peers')
    peersRef.current.forEach(peerConnection => {
      if (!peerConnection.isDestroyed) {
        performIceRestart(peerConnection)
      }
    })
  }, [performIceRestart])

  return {
    peers,
    remoteStreams,
    chatMessages,
    roomParticipants,
    isScreenSharing,
    connectionStatus,
    isReconnecting,
    sessionId,
    sendChatMessage,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
    triggerIceRestart,
    requestRecovery
  }
}

export default useWebRTC