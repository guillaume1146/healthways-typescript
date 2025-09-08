// hooks/useSocket.ts
import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Automatically detect if we're in production
    let socketUrl = 'http://localhost:3000'
    
    if (typeof window !== 'undefined') {
      // Check if we're on Render (or any non-localhost domain)
      if (window.location.hostname !== 'localhost' && 
          window.location.hostname !== '127.0.0.1') {
        // Use the current origin for production
        socketUrl = window.location.origin
        console.log('Production mode detected, using:', socketUrl)
      } else {
        console.log('Development mode, using:', socketUrl)
      }
    }
    
    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected!')
      setConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected')
      setConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, connected }
}