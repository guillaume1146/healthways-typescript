// server.js - Production-ready WebRTC Signaling Server
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

// Store active rooms and their participants
const rooms = new Map()
const socketToRoom = new Map()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server, {
    cors: {
      origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true)
        
        // Allow all origins in development
        if (dev) return callback(null, true)
        
        // In production, allow:
        // 1. The Render domain
        // 2. Any HTTPS origin (for flexibility)
        // 3. Localhost for testing
        const allowedOrigins = [
          'http://localhost:3000',
          'https://healthways-typescript.onrender.com',
          // Add any other domains you might use
        ]
        
        // Check if origin is allowed
        if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
          callback(null, true)
        } else if (origin.startsWith('https://')) {
          // Allow any HTTPS origin in production (adjust if needed for security)
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
    transports: ['polling', 'websocket']
  })

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id)
    
    // Join a video call room
    socket.on('join-room', ({ roomId, userId, userType, userName }) => {
      console.log(`👤 ${userName} (${userType}) joining room: ${roomId}`)
      
      // Leave any existing room
      const currentRoom = socketToRoom.get(socket.id)
      if (currentRoom) {
        socket.leave(currentRoom)
        const room = rooms.get(currentRoom)
        if (room) {
          room.participants = room.participants.filter(p => p.socketId !== socket.id)
          if (room.participants.length === 0) {
            rooms.delete(currentRoom)
          } else {
            socket.to(currentRoom).emit('user-left', { socketId: socket.id })
          }
        }
      }
      
      // Join new room
      socket.join(roomId)
      socketToRoom.set(socket.id, roomId)
      
      // Initialize room if it doesn't exist
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          id: roomId,
          participants: [],
          createdAt: new Date()
        })
      }
      
      const room = rooms.get(roomId)
      const participant = {
        socketId: socket.id,
        userId,
        userType,
        userName,
        joinedAt: new Date()
      }
      
      // Get existing participants
      const existingParticipants = room.participants
      
      // Add new participant
      room.participants.push(participant)
      
      // Send existing participants to the new user
      socket.emit('existing-participants', existingParticipants)
      
      // Notify others in the room about new participant
      socket.to(roomId).emit('user-joined', participant)
      
      console.log(`📊 Room ${roomId} now has ${room.participants.length} participants`)
    })
    
    // WebRTC signaling
    socket.on('offer', ({ offer, to }) => {
      console.log(`📤 Sending offer from ${socket.id} to ${to}`)
      io.to(to).emit('offer', {
        offer,
        from: socket.id
      })
    })
    
    socket.on('answer', ({ answer, to }) => {
      console.log(`📤 Sending answer from ${socket.id} to ${to}`)
      io.to(to).emit('answer', {
        answer,
        from: socket.id
      })
    })
    
    socket.on('ice-candidate', ({ candidate, to }) => {
      console.log(`🧊 Sending ICE candidate from ${socket.id} to ${to}`)
      io.to(to).emit('ice-candidate', {
        candidate,
        from: socket.id
      })
    })
    
    // Toggle media states
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
    
    // Screen sharing
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
    
    // Chat messages
    socket.on('chat-message', ({ roomId, message, userName, userType }) => {
      const timestamp = new Date().toISOString()
      io.to(roomId).emit('new-chat-message', {
        message,
        userName,
        userType,
        timestamp,
        socketId: socket.id
      })
    })
    
    // Leave room
    socket.on('leave-room', () => {
      const roomId = socketToRoom.get(socket.id)
      if (roomId) {
        console.log(`👋 ${socket.id} leaving room: ${roomId}`)
        socket.leave(roomId)
        socketToRoom.delete(socket.id)
        
        const room = rooms.get(roomId)
        if (room) {
          room.participants = room.participants.filter(p => p.socketId !== socket.id)
          if (room.participants.length === 0) {
            rooms.delete(roomId)
            console.log(`🗑️ Room ${roomId} deleted (empty)`)
          } else {
            socket.to(roomId).emit('user-left', { socketId: socket.id })
          }
        }
      }
    })
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id)
      const roomId = socketToRoom.get(socket.id)
      
      if (roomId) {
        const room = rooms.get(roomId)
        if (room) {
          room.participants = room.participants.filter(p => p.socketId !== socket.id)
          if (room.participants.length === 0) {
            rooms.delete(roomId)
            console.log(`🗑️ Room ${roomId} deleted (empty)`)
          } else {
            socket.to(roomId).emit('user-left', { socketId: socket.id })
          }
        }
        socketToRoom.delete(socket.id)
      }
    })
    
    // Get room info
    socket.on('get-room-info', ({ roomId }) => {
      const room = rooms.get(roomId)
      socket.emit('room-info', room || null)
    })
  })

  const actualPort = process.env.PORT || port
  server.listen(actualPort, () => {
    console.log(`> Ready on port ${actualPort}`)
    console.log(`> Environment: ${dev ? 'development' : 'production'}`)
    console.log('> WebRTC signaling server active')
    if (!dev) {
      console.log('> Running in production mode')
      console.log('> CORS configured for production domains')
    }
  })
})