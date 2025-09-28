const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const { PrismaClient } = require('@prisma/client')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

// Create a single Prisma instance with proper connection pool settings
const prisma = new PrismaClient({
  log: dev ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Ensure Prisma connects on startup
prisma.$connect().then(() => {
  console.log('✅ Database connected')
}).catch(err => {
  console.error('❌ Database connection failed:', err)
})

const rooms = new Map()
const socketToRoom = new Map()
const socketToUser = new Map()
const socketHeartbeats = new Map()

// Heartbeat configuration
const HEARTBEAT_INTERVAL = 30000
const HEARTBEAT_TIMEOUT = 60000
const SESSION_CLEANUP_INTERVAL = 300000
const SESSION_TIMEOUT = 3600000

// Flag to prevent database operations if not needed
const USE_DATABASE_SESSIONS = false // Set to true when database is ready

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
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e6,
    allowEIO3: true
  })

  // Database session management functions (optional)
  async function createOrUpdateSession(roomId, sessionId) {
    if (!USE_DATABASE_SESSIONS) return { id: sessionId, roomId }
    
    try {
      const session = await prisma.webRTCSession.upsert({
        where: { roomId },
        update: {
          lastActivity: new Date(),
          status: 'active'
        },
        create: {
          roomId,
          sessionId,
          status: 'active',
          participants: [],
          metadata: {}
        }
      })
      return session
    } catch (error) {
      console.error('Error creating/updating session:', error)
      return null
    }
  }

  async function addConnectionToSession(sessionId, connectionData) {
    if (!USE_DATABASE_SESSIONS) return true
    
    try {
      const connection = await prisma.webRTCConnection.upsert({
        where: {
          sessionId_userId: {
            sessionId,
            userId: connectionData.userId
          }
        },
        update: {
          socketId: connectionData.socketId,
          connectionState: 'connecting',
          lastSeen: new Date()
        },
        create: {
          sessionId,
          userId: connectionData.userId,
          userType: connectionData.userType,
          userName: connectionData.userName,
          socketId: connectionData.socketId,
          connectionState: 'connecting'
        }
      })
      return connection
    } catch (error) {
      console.error('Error adding connection to session:', error)
      return null
    }
  }

  async function updateConnectionState(socketId, state, iceState = null) {
    if (!USE_DATABASE_SESSIONS) return true
    
    try {
      const connection = await prisma.webRTCConnection.updateMany({
        where: { socketId },
        data: {
          connectionState: state,
          lastSeen: new Date(),
          ...(iceState && { iceState })
        }
      })
      return connection
    } catch (error) {
      console.error('Error updating connection state:', error)
      return null
    }
  }

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
  async function handleDisconnection(socket, reason = 'unknown') {
    console.log(`🔌 Client disconnected: ${socket.id} (reason: ${reason})`)
    
    // Update database connection state if enabled
    if (USE_DATABASE_SESSIONS) {
      await updateConnectionState(socket.id, 'disconnected')
    }
    
    const roomId = socketToRoom.get(socket.id)
    const userInfo = socketToUser.get(socket.id)
    
    if (roomId) {
      const room = rooms.get(roomId)
      if (room) {
        room.participants = room.participants.filter(p => p.socketId !== socket.id)
        
        // Notify other participants
        socket.to(roomId).emit('user-disconnected', { 
          socketId: socket.id,
          userId: userInfo?.userId,
          reason: reason,
          canReconnect: reason !== 'leave_room'
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
    
    socketToUser.delete(socket.id)
    socketHeartbeats.delete(socket.id)
  }

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id)
    
    // Initialize heartbeat
    socketHeartbeats.set(socket.id, Date.now())
    
    // Handle heartbeat
    socket.on('heartbeat', ({ roomId, timestamp }) => {
      socketHeartbeats.set(socket.id, Date.now())
      socket.emit('heartbeat-response', { 
        timestamp: Date.now(),
        serverTime: new Date().toISOString()
      })
    })
    
    // Enhanced join-room
    socket.on('join-room', async ({ roomId, userId, userType, userName, sessionId }) => {
      console.log(`👤 ${userName} (${userType}) joining room: ${roomId}`)
      
      // Store user info
      socketToUser.set(socket.id, { userId, userName, userType })
      
      // Create or update database session if enabled
      let dbSession = null
      if (USE_DATABASE_SESSIONS) {
        dbSession = await createOrUpdateSession(roomId, sessionId || roomId)
        if (dbSession) {
          await addConnectionToSession(dbSession.id, {
            userId,
            userType,
            userName,
            socketId: socket.id
          })
        }
      }
      
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
          sessionId: dbSession?.id || sessionId,
          participants: [],
          createdAt: new Date(),
          lastActivity: Date.now()
        })
      }
      
      const room = rooms.get(roomId)
      room.lastActivity = Date.now()
      
      // Check if user is reconnecting
      const existingParticipantIndex = room.participants.findIndex(
        p => p.userId === userId
      )
      
      if (existingParticipantIndex !== -1) {
        // Update existing participant (reconnection)
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
      socket.emit('existing-participants', {
        participants: existingParticipants,
        sessionId: dbSession?.id || sessionId
      })
      
      console.log(`📊 Room ${roomId} now has ${room.participants.length} participants`)
    })
    
    // WebRTC signaling
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
      }
    })
    
    // Handle ICE restart
    socket.on('ice-restart', ({ to }) => {
      console.log(`🔄 ICE restart requested from ${socket.id} to ${to}`)
      const targetSocket = io.sockets.sockets.get(to)
      if (targetSocket) {
        targetSocket.emit('ice-restart-request', {
          from: socket.id
        })
      }
    })
    
    // Update ICE connection state
    socket.on('ice-state-change', async ({ state }) => {
      console.log(`🧊 ICE state change for ${socket.id}: ${state}`)
      if (USE_DATABASE_SESSIONS) {
        await updateConnectionState(socket.id, null, state)
      }
    })
    
    // Request session recovery (simplified - no database)
    socket.on('request-recovery', ({ roomId, userId }) => {
      console.log(`🔄 Recovery requested for user ${userId} in room ${roomId}`)
      
      const room = rooms.get(roomId)
      if (room) {
        socket.emit('recovery-info', {
          canRecover: true,
          session: {
            id: room.sessionId,
            roomId: room.id,
            participants: room.participants
          }
        })
      } else {
        socket.emit('recovery-info', {
          canRecover: false,
          reason: 'Room not found'
        })
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
    
    // Chat
    socket.on('chat-message', ({ roomId, message, userName, userType }) => {
      if (!message || message.trim().length === 0) return
      
      const timestamp = new Date().toISOString()
      io.to(roomId).emit('new-chat-message', {
        message: message.trim(),
        userName,
        userType,
        timestamp,
        socketId: socket.id
      })
    })
    
    // Leave room
    socket.on('leave-room', async () => {
      const roomId = socketToRoom.get(socket.id)
      if (roomId) {
        console.log(`👋 ${socket.id} leaving room: ${roomId}`)
        if (USE_DATABASE_SESSIONS) {
          await updateConnectionState(socket.id, 'ended')
        }
        handleDisconnection(socket, 'leave_room')
      }
    })
    
    // Disconnect
    socket.on('disconnect', async (reason) => {
      handleDisconnection(socket, reason)
    })
    
    // Error
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
          isActive: Date.now() - room.lastActivity < 300000,
          canRecover: true
        })
      } else {
        socket.emit('room-info', null)
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
    console.log('> Database sessions:', USE_DATABASE_SESSIONS ? 'ENABLED' : 'DISABLED')
    if (!dev) {
      console.log('> Running in production mode')
    }
  })
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing connections...')
  await prisma.$disconnect()
  process.exit(0)
})

startServer().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})