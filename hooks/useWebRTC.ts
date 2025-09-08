// hooks/useWebRTC.ts
// Fixed version with proper signaling state management

import { useEffect, useRef, useState, useCallback } from 'react'
import { Socket } from 'socket.io-client'

// Dynamic import for simple-peer to avoid SSR issues
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
  
  const peersRef = useRef<Map<string, PeerConnection>>(new Map())
  const screenShareStreamRef = useRef<MediaStream | null>(null)
  const processingOffer = useRef<Set<string>>(new Set())

  // Create a new peer connection
  const createPeer = useCallback((
    targetSocketId: string,
    targetUserId: string,
    targetUserName: string,
    targetUserType: string,
    initiator: boolean
  ) => {
    if (!localStream || !socket || !SimplePeer) {
      console.error('Cannot create peer: missing requirements', {
        localStream: !!localStream,
        socket: !!socket,
        SimplePeer: !!SimplePeer
      })
      return null
    }

    // Don't create duplicate peers
    if (peersRef.current.has(targetSocketId)) {
      console.log(`Peer already exists for ${targetSocketId}`)
      return peersRef.current.get(targetSocketId)?.peer
    }

    console.log(`Creating NEW peer connection: initiator=${initiator}, target=${targetSocketId}`)

    const peer = new SimplePeer({
      initiator,
      trickle: true,
      stream: localStream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      }
    })

    peer.on('signal', (signal: any) => {
      console.log(`Signaling ${signal.type || 'ice'} to ${targetSocketId}`)
      
      if (signal.type === 'offer') {
        socket.emit('offer', {
          offer: signal,
          to: targetSocketId
        })
      } else if (signal.type === 'answer') {
        socket.emit('answer', {
          answer: signal,
          to: targetSocketId
        })
      } else if (signal.candidate) {
        socket.emit('ice-candidate', {
          candidate: signal,
          to: targetSocketId
        })
      }
    })

    peer.on('stream', (stream: MediaStream) => {
      console.log(`✅ Received stream from ${targetSocketId}`)
      setRemoteStreams(prev => {
        const newStreams = new Map(prev)
        newStreams.set(targetSocketId, stream)
        return newStreams
      })
      setConnectionStatus('connected')
    })

    peer.on('connect', () => {
      console.log(`✅ Connected to peer ${targetSocketId}`)
      setConnectionStatus('connected')
    })

    peer.on('error', (err: Error) => {
      console.error(`❌ Peer connection error with ${targetSocketId}:`, err.message)
    })

    peer.on('close', () => {
      console.log(`Connection closed with ${targetSocketId}`)
      removePeer(targetSocketId)
    })

    const peerConnection: PeerConnection = {
      peer,
      socketId: targetSocketId,
      userId: targetUserId,
      userName: targetUserName,
      userType: targetUserType
    }

    peersRef.current.set(targetSocketId, peerConnection)
    setPeers(new Map(peersRef.current))

    return peer
  }, [localStream, socket])

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
  }, [])

  // Join room and set up connections
  useEffect(() => {
    if (!socket || !roomId || !localStream || !SimplePeer) {
      console.log('Missing requirements for WebRTC:', {
        socket: !!socket,
        roomId: !!roomId,
        localStream: !!localStream,
        SimplePeer: !!SimplePeer
      })
      return
    }

    console.log(`🚀 Joining room ${roomId} as ${userName} (${userType})`)

    // Join the room
    socket.emit('join-room', {
      roomId,
      userId,
      userType,
      userName
    })

    // Handle existing participants
    const handleExistingParticipants = (participants: any[]) => {
      console.log('📋 Existing participants in room:', participants)
      setRoomParticipants(participants)
      
      // Create peer connections for existing participants (we initiate)
      participants.forEach(participant => {
        if (participant.socketId !== socket.id) {
          console.log(`Creating peer for existing participant: ${participant.userName}`)
          createPeer(
            participant.socketId,
            participant.userId,
            participant.userName,
            participant.userType,
            true // We initiate since they were here first
          )
        }
      })
    }

    // Handle new user joining
    const handleUserJoined = (participant: any) => {
      console.log('👤 New user joined:', participant)
      
      if (participant.socketId === socket.id) {
        console.log('Ignoring self-join event')
        return
      }
      
      setRoomParticipants(prev => {
        // Avoid duplicates
        const exists = prev.some(p => p.socketId === participant.socketId)
        if (exists) return prev
        return [...prev, participant]
      })
      
      // Don't create peer here - wait for their offer
      console.log('Waiting for offer from new participant...')
    }

    // Handle offer from another peer
    const handleOffer = ({ offer, from }: any) => {
      console.log('📨 Received offer from:', from)
      
      // Prevent processing duplicate offers
      if (processingOffer.current.has(from)) {
        console.log('Already processing offer from', from)
        return
      }
      processingOffer.current.add(from)
      
      const existingPeer = peersRef.current.get(from)
      
      if (existingPeer) {
        console.log('Peer already exists, signaling offer')
        try {
          existingPeer.peer.signal(offer)
        } catch (e) {
          console.error('Error signaling existing peer:', e)
          // Remove the broken peer and recreate
          removePeer(from)
          processingOffer.current.delete(from)
        }
      } else {
        // Find participant info or use defaults
        let participantInfo = roomParticipants.find(p => p.socketId === from)
        
        if (!participantInfo) {
          console.log('Participant not found in list, using defaults')
          participantInfo = {
            socketId: from,
            userId: 'unknown',
            userName: 'Unknown User',
            userType: 'patient'
          }
        }
        
        console.log('Creating peer to answer offer from:', participantInfo.userName)
        const peer = createPeer(
          from,
          participantInfo.userId,
          participantInfo.userName,
          participantInfo.userType,
          false // We're answering, not initiating
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
      
      // Clear processing flag after a delay
      setTimeout(() => {
        processingOffer.current.delete(from)
      }, 5000)
    }

    // Handle answer from another peer
    const handleAnswer = ({ answer, from }: any) => {
      console.log('📨 Received answer from:', from)
      const peerConnection = peersRef.current.get(from)
      if (peerConnection) {
        try {
          peerConnection.peer.signal(answer)
        } catch (e) {
          console.error('Error processing answer:', e)
        }
      } else {
        console.warn('No peer connection found for answer from:', from)
      }
    }

    // Handle ICE candidates
    const handleIceCandidate = ({ candidate, from }: any) => {
      const peerConnection = peersRef.current.get(from)
      if (peerConnection) {
        try {
          peerConnection.peer.signal(candidate)
        } catch (e) {
          console.error('Error adding ICE candidate:', e)
        }
      }
    }

    // Handle user leaving
    const handleUserLeft = ({ socketId }: any) => {
      console.log('👋 User left:', socketId)
      removePeer(socketId)
      setRoomParticipants(prev => prev.filter(p => p.socketId !== socketId))
    }

    // Handle chat messages
    const handleChatMessage = (message: ChatMessage) => {
      setChatMessages(prev => [...prev, { ...message, id: Date.now().toString() }])
    }

    // Attach event listeners
    socket.on('existing-participants', handleExistingParticipants)
    socket.on('user-joined', handleUserJoined)
    socket.on('offer', handleOffer)
    socket.on('answer', handleAnswer)
    socket.on('ice-candidate', handleIceCandidate)
    socket.on('user-left', handleUserLeft)
    socket.on('new-chat-message', handleChatMessage)

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up WebRTC connections')
      socket.emit('leave-room')
      
      socket.off('existing-participants', handleExistingParticipants)
      socket.off('user-joined', handleUserJoined)
      socket.off('offer', handleOffer)
      socket.off('answer', handleAnswer)
      socket.off('ice-candidate', handleIceCandidate)
      socket.off('user-left', handleUserLeft)
      socket.off('new-chat-message', handleChatMessage)
      
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
  }, [socket, roomId, userId, userName, userType, localStream, createPeer, removePeer])

  // Send chat message
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

  // Toggle video
  const toggleVideo = useCallback((enabled: boolean) => {
    if (!localStream) return
    
    localStream.getVideoTracks().forEach(track => {
      track.enabled = enabled
    })
    
    if (socket) {
      socket.emit('toggle-video', { enabled, roomId })
    }
  }, [socket, localStream, roomId])

  // Toggle audio
  const toggleAudio = useCallback((enabled: boolean) => {
    if (!localStream) return
    
    localStream.getAudioTracks().forEach(track => {
      track.enabled = enabled
    })
    
    if (socket) {
      socket.emit('toggle-audio', { enabled, roomId })
    }
  }, [socket, localStream, roomId])

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    if (!socket) return false
    
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      })
      
      screenShareStreamRef.current = screenStream
      
      // Replace video track in all peer connections
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

  // Stop screen sharing
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
    sendChatMessage,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare
  }
}

// Export as both named and default
export { useWebRTC }
export default useWebRTC