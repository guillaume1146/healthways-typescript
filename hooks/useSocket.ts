// hooks/useSocket.ts
// Fixed version with updated RoomState interface

import { useEffect, useState, useRef } from 'react'
import io, { Socket } from 'socket.io-client'

interface RoomState {
  roomId: string
  userId: string
  userName: string
  userType: string
  sessionId?: string  // Add this line to include sessionId as optional
}

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const roomStateRef = useRef<RoomState | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Determine socket URL
    let socketUrl = 'http://localhost:3000'
    
    if (typeof window !== 'undefined') {
      if (window.location.hostname !== 'localhost' && 
          window.location.hostname !== '127.0.0.1') {
        socketUrl = window.location.origin
        console.log('Production mode detected, using:', socketUrl)
      } else {
        console.log('Development mode, using:', socketUrl)
      }
    }
    
    // Create socket with aggressive reconnection settings
    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      
      // Aggressive reconnection settings
      reconnection: true,
      reconnectionAttempts: Infinity, // Infinite retry
      reconnectionDelay: 1000, // Start with 1 second
      reconnectionDelayMax: 5000, // Max 5 seconds between attempts
      randomizationFactor: 0.5,
      timeout: 20000, // 20 second connection timeout
      
      // Auto connect
      autoConnect: true,
      
      // Force new connection
      forceNew: false,
      
      // Upgrade timeout
      upgrade: true,
    })

    socketRef.current = socketInstance

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('✅ Socket connected! ID:', socketInstance.id)
      setConnected(true)
      setIsReconnecting(false)
      setReconnectAttempts(0)
      
      // Automatically rejoin room if we have room state
      if (roomStateRef.current) {
        console.log('🔄 Auto-rejoining room after reconnection:', roomStateRef.current.roomId)
        socketInstance.emit('join-room', roomStateRef.current)
      }
    })

    socketInstance.on('disconnect', (reason) => {
      console.log(`⚠️ Socket disconnected. Reason: ${reason}`)
      setConnected(false)
      
      // Only set reconnecting if it's an unintentional disconnect
      if (reason === 'io server disconnect') {
        // Server disconnected us, need manual reconnect
        console.log('Server disconnected. Attempting manual reconnect...')
        socketInstance.connect()
      } else if (reason === 'io client disconnect') {
        // We disconnected manually, don't auto-reconnect
        console.log('Client initiated disconnect')
      } else {
        // Network issue or other problem, will auto-reconnect
        setIsReconnecting(true)
        console.log('Network issue detected. Auto-reconnecting...')
      }
    })

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt #${attemptNumber}`)
      setReconnectAttempts(attemptNumber)
      setIsReconnecting(true)
    })

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected successfully after ${attemptNumber} attempts`)
      setIsReconnecting(false)
      setReconnectAttempts(0)
    })

    socketInstance.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error.message)
    })

    socketInstance.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after maximum attempts')
      setIsReconnecting(false)
      // This shouldn't happen with infinite retries, but handle it anyway
      setTimeout(() => {
        console.log('Attempting manual reconnection...')
        socketInstance.connect()
      }, 5000)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error.message)
      if (!connected && !isReconnecting) {
        setIsReconnecting(true)
      }
    })

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error)
    })

    // Handle ping/pong for connection health (automatic response from client)
    socketInstance.on('ping', () => {
      console.log('🏓 Ping received from server')
    })
    
    socketInstance.on('pong', (latency) => {
      console.log(`🏓 Pong received - latency: ${latency}ms`)
    })

    // Listen for room join confirmation
    socketInstance.on('room-joined', ({ roomId }) => {
      console.log(`✅ Successfully joined room: ${roomId}`)
    })

    // Custom heartbeat (application-level, not Socket.IO ping/pong)
    const heartbeatInterval = setInterval(() => {
      if (socketInstance.connected) {
        socketInstance.emit('heartbeat', { 
          timestamp: Date.now(),
          roomId: roomStateRef.current?.roomId 
        })
      }
    }, 30000) // Every 30 seconds

    setSocket(socketInstance)

    // Cleanup
    return () => {
      clearInterval(heartbeatInterval)
      roomStateRef.current = null
      if (socketInstance) {
        socketInstance.removeAllListeners()
        socketInstance.disconnect()
      }
    }
  }, [])

  // Function to save room state for reconnection
  const saveRoomState = (state: RoomState) => {
    roomStateRef.current = state
    // Also save to sessionStorage as backup
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('socket_room_state', JSON.stringify(state))
    }
  }

  // Function to clear room state
  const clearRoomState = () => {
    roomStateRef.current = null
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('socket_room_state')
    }
  }

  // Function to manually reconnect
  const manualReconnect = () => {
    if (socketRef.current && !socketRef.current.connected) {
      console.log('Manual reconnection triggered')
      socketRef.current.connect()
    }
  }

  // Load room state from session storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = sessionStorage.getItem('socket_room_state')
      if (savedState) {
        try {
          roomStateRef.current = JSON.parse(savedState)
          console.log('Restored room state from session:', roomStateRef.current)
        } catch (e) {
          console.error('Failed to parse saved room state:', e)
        }
      }
    }
  }, [])

  return { 
    socket, 
    connected, 
    isReconnecting,
    reconnectAttempts,
    saveRoomState,
    clearRoomState,
    manualReconnect
  }
}