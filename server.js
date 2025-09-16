const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

const rooms = new Map()
const socketToRoom = new Map()
const socketHeartbeats = new Map()

// Heartbeat configuration
const HEARTBEAT_INTERVAL = 30000 // 30 seconds
const HEARTBEAT_TIMEOUT = 60000 // 60 seconds

async function startServer() {
  if (!dev) {
    try {
      const { initializeServiceAccounts } = require('./lib/secrets')
      await initializeServiceAccounts()
      console.log('✅ Service accounts loaded from Secret Manager')
    } catch (error) {
      console.error('⚠️ Failed to load secrets, using default service account:', error)
    }
  }

  await app.prepare()
  
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server, {
    cors: {
      origin: function(origin, callback) {
        if (!origin) return callback(null, true)
        if (dev) return callback(null, true)
        
        const allowedOrigins = [
          'http://localhost:3000',
          'https://healthways-typescript.onrender.com',
          'https://healthwyz-app-pylrovz4aq-uc.a.run.app'
        ]
        
        if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
          callback(null, true)
        } else if (origin.startsWith('https://')) {
          callback(null, true)
        } else {
          console.log('CORS blocked origin:', origin)
          callback(new Error('CORS policy violation'))
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"]
    },
    transports: ['websocket', 'polling'], // Prefer websocket for stability
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
    upgradeTimeout: 30000, // 30 seconds
    maxHttpBufferSize: 1e6, // 1MB
    allowEIO3: true // Allow different engine.io versions
  })

  // Clean up stale heartbeats periodically
  setInterval(() => {
    const now = Date.now()
    socketHeartbeats.forEach((lastHeartbeat, socketId) => {
      if (now - lastHeartbeat > HEARTBEAT_TIMEOUT) {
        console.log(`⚠️ Socket ${socketId} timed out (no heartbeat)`)
        const socket = io.sockets.sockets.get(socketId)
        if (socket) {
          handleDisconnection(socket, 'heartbeat_timeout')
        }
        socketHeartbeats.delete(socketId)
      }
    })
  }, HEARTBEAT_INTERVAL)

  // Handle disconnection logic
  function handleDisconnection(socket, reason = 'unknown') {
    console.log(`🔌 Client disconnected: ${socket.id} (reason: ${reason})`)
    
    const roomId = socketToRoom.get(socket.id)
    if (roomId) {
      const room = rooms.get(roomId)
      if (room) {
        room.participants = room.participants.filter(p => p.socketId !== socket.id)
        
        // Notify other participants
        socket.to(roomId).emit('user-left', { 
          socketId: socket.id,
          reason: reason 
        })
        
        // Clean up empty rooms
        if (room.participants.length === 0) {
          rooms.delete(roomId)
          console.log(`🗑️ Room ${roomId} deleted (empty)`)
        } else {
          console.log(`📊 Room ${roomId} now has ${room.participants.length} participants`)
        }
      }
      socketToRoom.delete(socket.id)
    }
    
    socketHeartbeats.delete(socket.id)
  }

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id)
    
    // Initialize heartbeat for this socket
    socketHeartbeats.set(socket.id, Date.now())
    
    // Handle heartbeat
    socket.on('heartbeat', ({ roomId, timestamp }) => {
      socketHeartbeats.set(socket.id, Date.now())
      
      // Respond to heartbeat
      socket.emit('heartbeat-response', { 
        timestamp: Date.now(),
        serverTime: new Date().toISOString()
      })
      
      // Notify room participants for peer heartbeat
      if (roomId) {
        socket.to(roomId).emit('heartbeat-response', { 
          from: socket.id,
          timestamp 
        })
      }
    })
    
    // Enhanced join-room with reconnection support
    socket.on('join-room', ({ roomId, userId, userType, userName }) => {
      console.log(`👤 ${userName} (${userType}) joining room: ${roomId}`)
      
      // Leave current room if exists
      const currentRoom = socketToRoom.get(socket.id)
      if (currentRoom && currentRoom !== roomId) {
        socket.leave(currentRoom)
        const room = rooms.get(currentRoom)
        if (room) {
          room.participants = room.participants.filter(p => p.socketId !== socket.id)
          socket.to(currentRoom).emit('user-left', { 
            socketId: socket.id,
            reason: 'room_change'
          })
          
          if (room.participants.length === 0) {
            rooms.delete(currentRoom)
          }
        }
      }
      
      // Join new room
      socket.join(roomId)
      socketToRoom.set(socket.id, roomId)
      
      // Create room if doesn't exist
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          id: roomId,
          participants: [],
          createdAt: new Date(),
          lastActivity: Date.now()
        })
      }
      
      const room = rooms.get(roomId)
      room.lastActivity = Date.now()
      
      // Check if user is already in room (reconnection case)
      const existingParticipantIndex = room.participants.findIndex(
        p => p.userId === userId
      )
      
      if (existingParticipantIndex !== -1) {
        // Update existing participant with new socket ID
        const oldSocketId = room.participants[existingParticipantIndex].socketId
        room.participants[existingParticipantIndex] = {
          socketId: socket.id,
          userId,
          userType,
          userName,
          joinedAt: room.participants[existingParticipantIndex].joinedAt,
          reconnected: true,
          reconnectedAt: new Date()
        }
        
        console.log(`🔄 User ${userName} reconnected to room ${roomId}`)
        
        // Notify others about reconnection
        socket.to(roomId).emit('user-reconnected', {
          oldSocketId,
          newSocketId: socket.id,
          userId,
          userName,
          userType
        })
      } else {
        // New participant
        const participant = {
          socketId: socket.id,
          userId,
          userType,
          userName,
          joinedAt: new Date()
        }
        room.participants.push(participant)
        
        // Notify existing participants
        socket.to(roomId).emit('user-joined', participant)
      }
      
      // Send existing participants to the joining user
      const existingParticipants = room.participants.filter(
        p => p.socketId !== socket.id
      )
      socket.emit('existing-participants', existingParticipants)
      
      console.log(`📊 Room ${roomId} now has ${room.participants.length} participants`)
    })
    
    // WebRTC signaling with error handling
    socket.on('offer', ({ offer, to }) => {
      console.log(`📤 Sending offer from ${socket.id} to ${to}`)
      const targetSocket = io.sockets.sockets.get(to)
      if (targetSocket) {
        targetSocket.emit('offer', {
          offer,
          from: socket.id
        })
      } else {
        console.log(`⚠️ Target socket ${to} not found for offer`)
        socket.emit('peer-not-found', { targetId: to })
      }
    })
    
    socket.on('answer', ({ answer, to }) => {
      console.log(`📤 Sending answer from ${socket.id} to ${to}`)
      const targetSocket = io.sockets.sockets.get(to)
      if (targetSocket) {
        targetSocket.emit('answer', {
          answer,
          from: socket.id
        })
      } else {
        console.log(`⚠️ Target socket ${to} not found for answer`)
        socket.emit('peer-not-found', { targetId: to })
      }
    })
    
    socket.on('ice-candidate', ({ candidate, to }) => {
      console.log(`🧊 Sending ICE candidate from ${socket.id} to ${to}`)
      const targetSocket = io.sockets.sockets.get(to)
      if (targetSocket) {
        targetSocket.emit('ice-candidate', {
          candidate,
          from: socket.id
        })
      } else {
        console.log(`⚠️ Target socket ${to} not found for ICE candidate`)
      }
    })
    
    // Media control events
    socket.on('toggle-video', ({ enabled, roomId }) => {
      socket.to(roomId).emit('peer-toggle-video', {
        socketId: socket.id,
        enabled
      })
    })
    
    socket.on('toggle-audio', ({ enabled, roomId }) => {
      socket.to(roomId).emit('peer-toggle-audio', {
        socketId: socket.id,
        enabled
      })
    })
    
    socket.on('start-screen-share', ({ roomId }) => {
      socket.to(roomId).emit('peer-started-screen-share', {
        socketId: socket.id
      })
    })
    
    socket.on('stop-screen-share', ({ roomId }) => {
      socket.to(roomId).emit('peer-stopped-screen-share', {
        socketId: socket.id
      })
    })
    
    // Chat with message validation
    socket.on('chat-message', ({ roomId, message, userName, userType }) => {
      if (!message || message.trim().length === 0) {
        return // Ignore empty messages
      }
      
      const timestamp = new Date().toISOString()
      const room = rooms.get(roomId)
      
      if (room) {
        room.lastActivity = Date.now()
        
        // Broadcast to all in room (including sender for confirmation)
        io.to(roomId).emit('new-chat-message', {
          message: message.trim(),
          userName,
          userType,
          timestamp,
          socketId: socket.id
        })
      }
    })
    
    // Leave room handler
    socket.on('leave-room', () => {
      const roomId = socketToRoom.get(socket.id)
      if (roomId) {
        console.log(`👋 ${socket.id} leaving room: ${roomId}`)
        handleDisconnection(socket, 'leave_room')
      }
    })
    
    // Disconnect handler
    socket.on('disconnect', (reason) => {
      handleDisconnection(socket, reason)
    })
    
    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error)
    })
    
    // Get room info
    socket.on('get-room-info', ({ roomId }) => {
      const room = rooms.get(roomId)
      if (room) {
        socket.emit('room-info', {
          ...room,
          participantCount: room.participants.length,
          isActive: Date.now() - room.lastActivity < 300000 // Active in last 5 minutes
        })
      } else {
        socket.emit('room-info', null)
      }
    })
    
    // Request reconnection info
    socket.on('request-reconnect-info', ({ roomId, userId }) => {
      const room = rooms.get(roomId)
      if (room) {
        const participant = room.participants.find(p => p.userId === userId)
        if (participant) {
          socket.emit('reconnect-info', {
            canReconnect: true,
            roomExists: true,
            participantCount: room.participants.length,
            roomId
          })
        } else {
          socket.emit('reconnect-info', {
            canReconnect: true,
            roomExists: true,
            participantCount: room.participants.length,
            roomId,
            needsRejoin: true
          })
        }
      } else {
        socket.emit('reconnect-info', {
          canReconnect: false,
          roomExists: false
        })
      }
    })
  })

  // Clean up inactive rooms periodically
  setInterval(() => {
    const now = Date.now()
    const ROOM_TIMEOUT = 3600000 // 1 hour
    
    rooms.forEach((room, roomId) => {
      if (room.participants.length === 0 && now - room.lastActivity > ROOM_TIMEOUT) {
        rooms.delete(roomId)
        console.log(`🧹 Cleaned up inactive room: ${roomId}`)
      }
    })
  }, 300000) // Check every 5 minutes

  const actualPort = process.env.PORT || port
  server.listen(actualPort, () => {
    console.log(`> Ready on port ${actualPort}`)
    console.log(`> Environment: ${dev ? 'development' : 'production'}`)
    console.log('> WebRTC signaling server active')
    console.log('> Heartbeat monitoring enabled')
    if (!dev) {
      console.log('> Running in production mode')
      console.log('> CORS configured for production domains')
    }
  })
}

startServer().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})