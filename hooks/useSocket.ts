// hooks/useSocket.ts
import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'
    const socketInstance = io(socketUrl)

    socketInstance.on('connect', () => {
      setConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, connected }
}