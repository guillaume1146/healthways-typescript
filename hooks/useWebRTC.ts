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
  { urls: 'stun:global.stun.twilio.com:3478' },
]

const MAX_ICE_RESTART_ATTEMPTS = 10
const ICE_RESTART_DELAY = 2000
const CONNECTION_STATE_CHECK_INTERVAL = 5000
const RECONNECT_BACKOFF_BASE = 1000
const RECONNECT_BACKOFF_MAX = 30000

export function useWebRTC({
  socket,
  roomId,
  userId,
  userName,
  userType,
  localStream,
  saveRoomState,
  clearRoomState,
}: UseWebRTCProps) {
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map())
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [roomParticipants, setRoomParticipants] = useState<any[]>([])
  const [connectionStatus, setConnectionStatus] = useState<string>('connecting')
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [connectionError, setConnectionError] = useState<string | null>(null)

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
  const reconnectAttemptRef = useRef(0)

  useEffect(() => {
    localStreamRef.current = localStream
  }, [localStream])

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem(`webrtc_session_${roomId}`)
    const newSessionId = storedSessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(newSessionId)
    sessionIdRef.current = newSessionId
    if (!storedSessionId) {
      sessionStorage.setItem(`webrtc_session_${roomId}`, newSessionId)
    }
  }, [roomId])

  const isPolite = useCallback((targetUserId: string) => userId < targetUserId, [userId])

  // Exponential backoff for reconnection
  const getReconnectDelay = useCallback(() => {
    const delay = Math.min(
      RECONNECT_BACKOFF_BASE * Math.pow(2, reconnectAttemptRef.current),
      RECONNECT_BACKOFF_MAX
    )
    reconnectAttemptRef.current++
    return delay
  }, [])

  const resetReconnectBackoff = useCallback(() => {
    reconnectAttemptRef.current = 0
  }, [])

  // ICE restart with exponential backoff
  const performIceRestart = useCallback(async (peerConnection: PeerConnection) => {
    if (!peerConnection.peer || peerConnection.isDestroyed || peerConnection.iceRestartCount >= MAX_ICE_RESTART_ATTEMPTS) {
      if (peerConnection.iceRestartCount >= MAX_ICE_RESTART_ATTEMPTS) {
        setConnectionError(`Connection to ${peerConnection.userName} lost after ${MAX_ICE_RESTART_ATTEMPTS} retry attempts`)
      }
      return false
    }

    try {
      peerConnection.iceRestartCount++
      const backoffDelay = Math.min(ICE_RESTART_DELAY * peerConnection.iceRestartCount, 15000)

      await new Promise(resolve => setTimeout(resolve, backoffDelay))

      if (peerConnection.isDestroyed) return false

      if (peerConnection.peer._pc) {
        const offer = await peerConnection.peer._pc.createOffer({ iceRestart: true })
        await peerConnection.peer._pc.setLocalDescription(offer)

        if (socket?.connected) {
          socket.emit('offer', { offer, to: peerConnection.socketId, iceRestart: true })
          socket.emit('ice-restart', { to: peerConnection.socketId })
        }
      }

      return true
    } catch (error) {
      console.warn('ICE restart failed:', (error as Error).message)
      return false
    }
  }, [socket])

  // Connection health monitor
  const checkConnectionHealth = useCallback(() => {
    let hasConnected = false

    peersRef.current.forEach((peerConnection, socketId) => {
      if (!peerConnection.peer || peerConnection.isDestroyed || !peerConnection.peer._pc) return

      const pc = peerConnection.peer._pc
      const iceState = pc.iceConnectionState
      const connectionState = pc.connectionState

      if (iceState === 'connected' || iceState === 'completed') {
        hasConnected = true
        peerConnection.iceRestartCount = 0
      }

      if (iceState === 'failed' || connectionState === 'failed') {
        const existingTimer = iceRestartTimers.current.get(socketId)
        if (existingTimer) clearTimeout(existingTimer)

        const timer = setTimeout(() => {
          performIceRestart(peerConnection)
          iceRestartTimers.current.delete(socketId)
        }, ICE_RESTART_DELAY)

        iceRestartTimers.current.set(socketId, timer)
      } else if (iceState === 'disconnected') {
        // Wait before attempting restart (might recover on its own)
        setTimeout(() => {
          if (!peerConnection.isDestroyed && peerConnection.peer?._pc?.iceConnectionState === 'disconnected') {
            performIceRestart(peerConnection)
          }
        }, 5000)
      }
    })

    if (hasConnected) {
      setConnectionStatus('connected')
      setConnectionError(null)
      resetReconnectBackoff()
    }
  }, [performIceRestart, resetReconnectBackoff])

  // Create peer
  const createPeer = useCallback((
    targetSocketId: string,
    targetUserId: string,
    targetUserName: string,
    targetUserType: string,
    initiator: boolean
  ) => {
    if (!localStreamRef.current || !socket || !SimplePeer) return null
    if (processingPeers.current.has(targetSocketId)) {
      return peersRef.current.get(targetSocketId)?.peer || null
    }

    const existingPeer = peersRef.current.get(targetSocketId)
    if (existingPeer) {
      if (!existingPeer.isDestroyed && existingPeer.peer && !existingPeer.peer.destroyed) {
        return existingPeer.peer
      }
      try {
        if (existingPeer.peer && !existingPeer.peer.destroyed) existingPeer.peer.destroy()
      } catch {}
      peersRef.current.delete(targetSocketId)
    }

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
          sdpSemantics: 'unified-plan',
        },
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
        isDestroyed: false,
      }

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

      peer.on('stream', (stream: MediaStream) => {
        remoteStreamsRef.current.set(targetSocketId, stream)
        setRemoteStreams(new Map(remoteStreamsRef.current))
        peerConnection.lastActivity = Date.now()
        peerConnection.iceRestartCount = 0
        setConnectionStatus('connected')
        setIsReconnecting(false)
        setConnectionError(null)
        resetReconnectBackoff()
      })

      peer.on('connect', () => {
        setConnectionStatus('connected')
        setIsReconnecting(false)
        setConnectionError(null)
        peerConnection.iceRestartCount = 0
        resetReconnectBackoff()
      })

      peer.on('error', (err: Error) => {
        const msg = err.message || err.toString()

        // Swallow benign errors
        if (/setRemoteDescription/i.test(msg) || /Called in wrong state/i.test(msg)) return
        if (msg.includes('User-Initiated Abort') || msg.includes('Close called')) return
        if ((msg.includes('Ice connection failed') || msg.includes('Connection failed')) && peerConnection.isDestroyed) return

        console.warn(`Peer error (${targetSocketId}):`, msg)

        if (!peerConnection.isDestroyed && peerConnection.iceRestartCount < MAX_ICE_RESTART_ATTEMPTS) {
          const delay = getReconnectDelay()
          setTimeout(() => {
            if (!peerConnection.isDestroyed) performIceRestart(peerConnection)
          }, delay)
        }
      })

      peer.on('close', () => {
        peerConnection.isDestroyed = true
        if (peerConnection.iceRestartCount >= MAX_ICE_RESTART_ATTEMPTS) {
          removePeer(targetSocketId)
        }
      })

      // ICE state monitoring
      if (peer._pc) {
        peer._pc.oniceconnectionstatechange = () => {
          if (peerConnection.isDestroyed) return
          const state = peer._pc.iceConnectionState
          if (state === 'failed' && peerConnection.iceRestartCount < MAX_ICE_RESTART_ATTEMPTS) {
            performIceRestart(peerConnection)
          } else if (state === 'connected' || state === 'completed') {
            setConnectionStatus('connected')
            setConnectionError(null)
            resetReconnectBackoff()
          }
        }
      }

      peersRef.current.set(targetSocketId, peerConnection)
      setPeers(new Map(peersRef.current))
      return peer
    } finally {
      setTimeout(() => processingPeers.current.delete(targetSocketId), 1000)
    }
  }, [socket, isPolite, performIceRestart, getReconnectDelay, resetReconnectBackoff])

  // Remove peer
  const removePeer = useCallback((socketId: string, isIntentionalLeave: boolean = false) => {
    const pc = peersRef.current.get(socketId)
    if (pc) {
      pc.isDestroyed = true
      if (pc.peer && !pc.peer.destroyed) {
        try {
          if (isIntentionalLeave) {
            pc.peer.removeAllListeners('error')
            pc.peer.removeAllListeners('close')
          }
          pc.peer.destroy()
        } catch {}
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

  // Join room
  const joinRoom = useCallback(() => {
    if (!socket || !roomId || !localStreamRef.current || roomJoined.current || joinInProgress.current) return

    joinInProgress.current = true
    socket.emit('join-room', { roomId, userId, userType, userName, sessionId: sessionIdRef.current })
    roomJoined.current = true

    if (saveRoomState) {
      saveRoomState({ roomId, userId, userName, userType, sessionId: sessionIdRef.current })
    }

    setTimeout(() => { joinInProgress.current = false }, 2000)
  }, [socket, roomId, userId, userName, userType, saveRoomState])

  // Recovery
  const requestRecovery = useCallback(() => {
    if (!socket || !roomId) return
    socket.emit('request-recovery', { roomId, userId })
  }, [socket, roomId, userId])

  // Main WebRTC setup
  useEffect(() => {
    if (!socket || !roomId || !localStream || !SimplePeer) return

    roomJoined.current = false
    joinInProgress.current = false
    processingPeers.current.clear()

    if (connectionCheckInterval.current) clearInterval(connectionCheckInterval.current)
    connectionCheckInterval.current = setInterval(checkConnectionHealth, CONNECTION_STATE_CHECK_INTERVAL)

    const joinTimeout = setTimeout(() => joinRoom(), 100)

    // Socket event handlers
    const handleExistingParticipants = ({ participants, sessionId: serverSessionId }: any) => {
      setRoomParticipants(participants)
      if (serverSessionId) {
        setSessionId(serverSessionId)
        sessionIdRef.current = serverSessionId
        sessionStorage.setItem(`webrtc_session_${roomId}`, serverSessionId)
      }
      participants.forEach((p: any, i: number) => {
        if (p.socketId !== socket.id) {
          setTimeout(() => createPeer(p.socketId, p.userId, p.userName, p.userType, true), i * 100)
        }
      })
    }

    const handleUserJoined = (participant: any) => {
      if (participant.socketId === socket.id) return
      setRoomParticipants(prev => {
        if (prev.some(p => p.socketId === participant.socketId)) return prev
        return [...prev, participant]
      })
    }

    const handleUserReconnected = ({ oldSocketId, newSocketId, userId: reconnUserId, userName: reconnName, userType: reconnType }: any) => {
      removePeer(oldSocketId, true)
      setRoomParticipants(prev => prev.map(p => p.userId === reconnUserId ? { ...p, socketId: newSocketId, connected: true } : p))
      setTimeout(() => createPeer(newSocketId, reconnUserId, reconnName, reconnType, true), 500)
    }

    const handleUserDisconnected = ({ socketId: discSocketId, userId: discUserId, reason, canReconnect }: any) => {
      if (canReconnect) {
        setRoomParticipants(prev => prev.map(p => p.socketId === discSocketId ? { ...p, connected: false } : p))
        // Don't remove peer yet — give them time to reconnect
      } else {
        removePeer(discSocketId, reason === 'leave_room')
        setRoomParticipants(prev => prev.filter(p => p.socketId !== discSocketId))
      }
    }

    const handleUserLeftPermanently = ({ userId: leftUserId }: any) => {
      // Find and remove the peer for this user
      peersRef.current.forEach((pc, sid) => {
        if (pc.userId === leftUserId) removePeer(sid, true)
      })
      setRoomParticipants(prev => prev.filter(p => p.userId !== leftUserId))
    }

    const handleOffer = async ({ offer, from }: any) => {
      let pc = peersRef.current.get(from)

      if (!pc || pc.isDestroyed) {
        const participant = roomParticipants.find(p => p.socketId === from) || {
          socketId: from, userId: 'unknown', userName: 'Unknown', userType: 'patient',
        }
        const peer = createPeer(from, participant.userId, participant.userName, participant.userType, false)
        if (peer) pc = peersRef.current.get(from)
      }

      if (pc?.peer && !pc.peer.destroyed && !pc.isDestroyed) {
        const collision = pc.makingOffer || (pc.peer._pc && pc.peer._pc.signalingState !== 'stable')
        pc.ignoreOffer = !pc.isPolite && collision
        if (pc.ignoreOffer) return

        setTimeout(() => {
          try {
            if (pc?.peer && !pc.peer.destroyed && !pc.isDestroyed) pc.peer.signal(offer)
          } catch (e) {
            console.warn('Error processing offer:', (e as Error).message)
          }
        }, 100)
      }
    }

    const handleAnswer = ({ answer, from }: any) => {
      const pc = peersRef.current.get(from)
      if (pc?.peer && !pc.peer.destroyed && !pc.isDestroyed) {
        try { pc.peer.signal(answer) } catch {}
      }
    }

    const handleIceCandidate = ({ candidate, from }: any) => {
      const pc = peersRef.current.get(from)
      if (pc?.peer && !pc.peer.destroyed && !pc.isDestroyed && !pc.ignoreOffer) {
        try { pc.peer.signal(candidate) } catch {}
      }
    }

    const handleIceRestartRequest = ({ from }: any) => {
      const pc = peersRef.current.get(from)
      if (pc && !pc.isDestroyed) performIceRestart(pc)
    }

    const handleRecoveryInfo = ({ canRecover, session }: any) => {
      if (canRecover && session?.participants?.length) {
        setSessionId(session.id)
        sessionIdRef.current = session.id
        session.participants.forEach((conn: any, i: number) => {
          if (conn.userId !== userId && conn.socketId) {
            setTimeout(() => createPeer(conn.socketId, conn.userId, conn.userName, conn.userType, true), i * 100)
          }
        })
      }
      setIsReconnecting(false)
    }

    const handleChatMessage = (message: ChatMessage) => {
      setChatMessages(prev => [...prev, { ...message, id: Date.now().toString() }])
    }

    const handleReconnect = () => {
      setIsReconnecting(false)
      setConnectionStatus('reconnecting')
      roomJoined.current = false
      joinInProgress.current = false

      // Destroy all peers and re-establish
      peersRef.current.forEach(pc => {
        pc.isDestroyed = true
        try { if (pc.peer && !pc.peer.destroyed) pc.peer.destroy() } catch {}
      })
      peersRef.current.clear()
      remoteStreamsRef.current.clear()
      setRemoteStreams(new Map())
      setPeers(new Map())

      const delay = getReconnectDelay()
      setTimeout(() => {
        requestRecovery()
        joinRoom()
      }, delay)
    }

    const handleDisconnect = () => {
      setIsReconnecting(true)
      setConnectionStatus('reconnecting')
    }

    // Attach listeners
    socket.on('existing-participants', handleExistingParticipants)
    socket.on('user-joined', handleUserJoined)
    socket.on('user-reconnected', handleUserReconnected)
    socket.on('user-disconnected', handleUserDisconnected)
    socket.on('user-left', handleUserDisconnected)
    socket.on('user-left-permanently', handleUserLeftPermanently)
    socket.on('offer', handleOffer)
    socket.on('answer', handleAnswer)
    socket.on('ice-candidate', handleIceCandidate)
    socket.on('ice-restart-request', handleIceRestartRequest)
    socket.on('recovery-info', handleRecoveryInfo)
    socket.on('new-chat-message', handleChatMessage)
    socket.on('reconnect', handleReconnect)
    socket.on('disconnect', handleDisconnect)

    if (sessionIdRef.current && !roomJoined.current) {
      requestRecovery()
    }

    return () => {
      clearTimeout(joinTimeout)
      if (connectionCheckInterval.current) clearInterval(connectionCheckInterval.current)
      iceRestartTimers.current.forEach(timer => clearTimeout(timer))
      iceRestartTimers.current.clear()

      if (!isReconnecting && socket.connected) socket.emit('leave-room')

      socket.off('existing-participants', handleExistingParticipants)
      socket.off('user-joined', handleUserJoined)
      socket.off('user-reconnected', handleUserReconnected)
      socket.off('user-disconnected', handleUserDisconnected)
      socket.off('user-left', handleUserDisconnected)
      socket.off('user-left-permanently', handleUserLeftPermanently)
      socket.off('offer', handleOffer)
      socket.off('answer', handleAnswer)
      socket.off('ice-candidate', handleIceCandidate)
      socket.off('ice-restart-request', handleIceRestartRequest)
      socket.off('recovery-info', handleRecoveryInfo)
      socket.off('new-chat-message', handleChatMessage)
      socket.off('reconnect', handleReconnect)
      socket.off('disconnect', handleDisconnect)

      if (!isReconnecting) {
        peersRef.current.forEach(pc => {
          pc.isDestroyed = true
          try {
            if (pc.peer && !pc.peer.destroyed) {
              pc.peer.removeAllListeners('error')
              pc.peer.removeAllListeners('close')
              pc.peer.destroy()
            }
          } catch {}
        })
        peersRef.current.clear()
        remoteStreamsRef.current.clear()
        processingPeers.current.clear()
        roomJoined.current = false
        joinInProgress.current = false
        if (clearRoomState) clearRoomState()
      }
    }
  }, [socket?.id, roomId, localStream])

  // Media controls
  const sendChatMessage = useCallback((message: string) => {
    if (!socket) return
    socket.emit('chat-message', { roomId, message, userName, userType })
  }, [socket, roomId, userName, userType])

  const toggleVideo = useCallback((enabled: boolean) => {
    if (!localStreamRef.current) return
    localStreamRef.current.getVideoTracks().forEach(track => { track.enabled = enabled })
    if (socket?.connected) socket.emit('toggle-video', { enabled, roomId })
  }, [socket, roomId])

  const toggleAudio = useCallback((enabled: boolean) => {
    if (!localStreamRef.current) return
    localStreamRef.current.getAudioTracks().forEach(track => { track.enabled = enabled })
    if (socket?.connected) socket.emit('toggle-audio', { enabled, roomId })
  }, [socket, roomId])

  const startScreenShare = useCallback(async () => {
    if (!socket) return false
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
      screenShareStreamRef.current = screenStream
      const videoTrack = screenStream.getVideoTracks()[0]

      peersRef.current.forEach(pc => {
        if (!pc.isDestroyed && pc.peer._pc) {
          const sender = pc.peer._pc.getSenders().find((s: RTCRtpSender) => s.track?.kind === 'video')
          if (sender) sender.replaceTrack(videoTrack)
        }
      })

      videoTrack.onended = () => stopScreenShare()
      if (socket.connected) socket.emit('start-screen-share', { roomId })
      setIsScreenSharing(true)
      return true
    } catch {
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
    peersRef.current.forEach(pc => {
      if (!pc.isDestroyed && pc.peer._pc && videoTrack) {
        const sender = pc.peer._pc.getSenders().find((s: RTCRtpSender) => s.track?.kind === 'video')
        if (sender) sender.replaceTrack(videoTrack)
      }
    })
    if (socket?.connected) socket.emit('stop-screen-share', { roomId })
    setIsScreenSharing(false)
  }, [socket, roomId])

  const triggerIceRestart = useCallback(() => {
    peersRef.current.forEach(pc => {
      if (!pc.isDestroyed) {
        pc.iceRestartCount = 0  // Reset count for manual trigger
        performIceRestart(pc)
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
    connectionError,
    sendChatMessage,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
    triggerIceRestart,
    requestRecovery,
  }
}

export default useWebRTC
