const { createServer } = require('http')
const { parse } = require('url')
const path = require('path')
const fs = require('fs')
const next = require('next')
const { Server } = require('socket.io')
const { PrismaClient } = require('@prisma/client')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

const prisma = new PrismaClient({
  log: dev ? ['error', 'warn'] : ['error'],
})

prisma.$connect().then(() => {
  console.log('Database connected')
}).catch(err => {
  console.error('Database connection failed:', err.message)
})

// ─── In-Memory State ───────────────────────────────────────────────────────────

const rooms = new Map()
const socketToRoom = new Map()
const socketToUser = new Map()
const socketHeartbeats = new Map()

// ─── Configuration ─────────────────────────────────────────────────────────────

const HEARTBEAT_INTERVAL = 30000
const HEARTBEAT_TIMEOUT = 90000
const SESSION_CLEANUP_INTERVAL = 300000
const ROOM_TIMEOUT = 7200000  // 2 hours (extended for long consultations)
const RECONNECT_GRACE_PERIOD = 120000  // 2 minutes before cleaning up disconnected user

// ─── Database Session Persistence ──────────────────────────────────────────────

async function persistSession(roomId, participants) {
  try {
    // Find the video room by roomCode
    const videoRoom = await prisma.videoRoom.findUnique({ where: { roomCode: roomId } })
    if (!videoRoom) return null

    // Upsert a session
    const session = await prisma.videoCallSession.upsert({
      where: { id: `session_${roomId}` },
      update: { status: 'active', updatedAt: new Date() },
      create: {
        id: `session_${roomId}`,
        roomId: videoRoom.id,
        patientId: participants.find(p => p.userType === 'patient')?.userId || null,
        doctorId: participants.find(p => p.userType === 'doctor')?.userId || null,
        status: 'active',
      },
    })

    // Upsert connections
    for (const p of participants) {
      await prisma.webRTCConnection.upsert({
        where: { sessionId_userId: { sessionId: session.id, userId: p.userId } },
        update: { socketId: p.socketId, connectionState: 'connected', lastSeen: new Date() },
        create: {
          sessionId: session.id,
          userId: p.userId,
          userType: p.userType,
          userName: p.userName,
          socketId: p.socketId,
          connectionState: 'connecting',
        },
      })
    }

    return session
  } catch (error) {
    console.error('Session persist error:', error.message)
    return null
  }
}

async function endPersistedSession(roomId) {
  try {
    const sessionId = `session_${roomId}`
    await prisma.videoCallSession.update({
      where: { id: sessionId },
      data: { status: 'ended', endedAt: new Date() },
    }).catch(() => {})
  } catch {
    // Session may not exist
  }
}

async function getPersistedSession(roomId) {
  try {
    const sessionId = `session_${roomId}`
    const session = await prisma.videoCallSession.findUnique({
      where: { id: sessionId },
      include: { connections: true },
    })
    return session
  } catch {
    return null
  }
}

// ─── Super Admin Bootstrap ───────────────────────────────────────────────────

async function ensureSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL
  const password = process.env.SUPER_ADMIN_PASSWORD
  if (!email || !password) return

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return

  const bcrypt = require('bcrypt')
  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: {
      firstName: process.env.SUPER_ADMIN_FIRST_NAME || 'Admin',
      lastName: process.env.SUPER_ADMIN_LAST_NAME || 'Oh My Dok',
      email,
      password: hashed,
      phone: '+230-0000-0000',
      userType: 'REGIONAL_ADMIN',
      accountStatus: 'active',
      verified: true,
      regionalAdminProfile: { create: { region: 'National', country: 'Mauritius' } },
    },
  })
  console.log('Super admin created from .env:', email)
}

// ─── Server ────────────────────────────────────────────────────────────────────

async function startServer() {
  if (!dev) {
    try {
      const { initializeServiceAccounts } = require('./lib/secrets')
      await initializeServiceAccounts()
      console.log('Service accounts loaded')
    } catch (error) {
      console.error('Failed to load secrets:', error.message)
    }
  }

  // Auto-create super admin from .env if not exists
  try {
    await ensureSuperAdmin()
  } catch (error) {
    console.error('Super admin bootstrap error:', error.message)
  }

  await app.prepare()

  // MIME type map for static file serving
  const MIME_TYPES = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf', '.ico': 'image/x-icon',
  }

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)

    // Serve uploaded files directly from public/uploads/ (standalone mode doesn't serve public/)
    if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/uploads/')) {
      const safePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[/\\])+/, '')
      const filePath = path.join(process.cwd(), 'public', safePath)

      // Prevent directory traversal
      if (!filePath.startsWith(path.join(process.cwd(), 'public', 'uploads'))) {
        res.writeHead(403)
        res.end('Forbidden')
        return
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404)
          res.end('Not Found')
          return
        }
        const ext = path.extname(filePath).toLowerCase()
        const contentType = MIME_TYPES[ext] || 'application/octet-stream'
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': stats.size,
          'Cache-Control': 'public, max-age=31536000, immutable',
        })
        fs.createReadStream(filePath).pipe(res)
      })
      return
    }

    handle(req, res, parsedUrl)
  })

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8080',
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean)

  const io = new Server(server, {
    cors: {
      origin: function(origin, callback) {
        if (!origin || dev) return callback(null, true)
        if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
          callback(null, true)
        } else {
          console.warn('CORS blocked:', origin)
          callback(new Error('CORS policy violation'))
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e6,
  })
  global.__io = io

  // ─── Heartbeat Monitor ─────────────────────────────────────────────────────

  setInterval(() => {
    const now = Date.now()
    socketHeartbeats.forEach((lastHeartbeat, socketId) => {
      if (now - lastHeartbeat > HEARTBEAT_TIMEOUT) {
        console.log(`Heartbeat timeout: ${socketId}`)
        const socket = io.sockets.sockets.get(socketId)
        if (socket) {
          handleDisconnection(socket, 'heartbeat_timeout')
        }
        socketHeartbeats.delete(socketId)
      }
    })
  }, HEARTBEAT_INTERVAL)

  // ─── Disconnection Handler ──────────────────────────────────────────────────

  async function handleDisconnection(socket, reason = 'unknown') {
    const roomId = socketToRoom.get(socket.id)
    const userInfo = socketToUser.get(socket.id)

    if (roomId) {
      const room = rooms.get(roomId)
      if (room) {
        const isIntentionalLeave = reason === 'leave_room'

        if (isIntentionalLeave) {
          // Remove participant immediately
          room.participants = room.participants.filter(p => p.socketId !== socket.id)
          socket.to(roomId).emit('user-disconnected', {
            socketId: socket.id,
            userId: userInfo?.userId,
            reason,
            canReconnect: false,
          })
        } else {
          // Mark as disconnected but keep in room for reconnection grace period
          const participant = room.participants.find(p => p.socketId === socket.id)
          if (participant) {
            participant.connected = false
            participant.disconnectedAt = Date.now()
          }

          socket.to(roomId).emit('user-disconnected', {
            socketId: socket.id,
            userId: userInfo?.userId,
            reason,
            canReconnect: true,
            gracePeriod: RECONNECT_GRACE_PERIOD,
          })

          // Schedule cleanup after grace period
          setTimeout(() => {
            const currentRoom = rooms.get(roomId)
            if (currentRoom) {
              const stillDisconnected = currentRoom.participants.find(
                p => p.userId === userInfo?.userId && p.connected === false
              )
              if (stillDisconnected) {
                currentRoom.participants = currentRoom.participants.filter(
                  p => p.userId !== userInfo?.userId
                )
                io.to(roomId).emit('user-left-permanently', {
                  userId: userInfo?.userId,
                  userName: userInfo?.userName,
                })
                if (currentRoom.participants.length === 0) {
                  rooms.delete(roomId)
                  endPersistedSession(roomId)
                }
              }
            }
          }, RECONNECT_GRACE_PERIOD)
        }

        if (room.participants.length === 0) {
          rooms.delete(roomId)
          endPersistedSession(roomId)
        }
      }
      socketToRoom.delete(socket.id)
    }

    socketToUser.delete(socket.id)
    socketHeartbeats.delete(socket.id)
  }

  // ─── Socket Event Handlers ──────────────────────────────────────────────────

  io.on('connection', (socket) => {
    socketHeartbeats.set(socket.id, Date.now())

    // Heartbeat
    socket.on('heartbeat', ({ roomId }) => {
      socketHeartbeats.set(socket.id, Date.now())
      socket.emit('heartbeat-response', { timestamp: Date.now() })

      // Update room activity
      if (roomId) {
        const room = rooms.get(roomId)
        if (room) room.lastActivity = Date.now()
      }
    })

    // Join room
    socket.on('join-room', async ({ roomId, userId, userType, userName, sessionId }) => {
      socketToUser.set(socket.id, { userId, userName, userType })

      // Leave current room if switching
      const currentRoom = socketToRoom.get(socket.id)
      if (currentRoom && currentRoom !== roomId) {
        socket.leave(currentRoom)
        const room = rooms.get(currentRoom)
        if (room) {
          room.participants = room.participants.filter(p => p.socketId !== socket.id)
          socket.to(currentRoom).emit('user-left', { socketId: socket.id, reason: 'room_change' })
          if (room.participants.length === 0) rooms.delete(currentRoom)
        }
      }

      socket.join(roomId)
      socketToRoom.set(socket.id, roomId)

      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          id: roomId,
          sessionId: sessionId,
          participants: [],
          createdAt: new Date(),
          lastActivity: Date.now(),
        })
      }

      const room = rooms.get(roomId)
      room.lastActivity = Date.now()

      // Check if reconnecting (same userId already in room)
      const existingIndex = room.participants.findIndex(p => p.userId === userId)
      if (existingIndex !== -1) {
        const oldSocketId = room.participants[existingIndex].socketId
        room.participants[existingIndex] = {
          socketId: socket.id,
          userId,
          userType,
          userName,
          joinedAt: room.participants[existingIndex].joinedAt,
          connected: true,
          reconnected: true,
          reconnectedAt: new Date(),
        }

        // Notify peers about reconnection
        socket.to(roomId).emit('user-reconnected', {
          oldSocketId,
          newSocketId: socket.id,
          userId,
          userName,
          userType,
        })
      } else {
        const participant = {
          socketId: socket.id,
          userId,
          userType,
          userName,
          joinedAt: new Date(),
          connected: true,
        }
        room.participants.push(participant)
        socket.to(roomId).emit('user-joined', participant)
      }

      // Send existing participants to joining user
      const existingParticipants = room.participants.filter(
        p => p.socketId !== socket.id && p.connected !== false
      )
      socket.emit('existing-participants', {
        participants: existingParticipants,
        sessionId: sessionId,
      })

      // Persist to database
      persistSession(roomId, room.participants)
    })

    // ─── WebRTC Signaling ─────────────────────────────────────────────────────

    socket.on('offer', ({ offer, to }) => {
      const target = io.sockets.sockets.get(to)
      if (target) {
        target.emit('offer', { offer, from: socket.id })
      } else {
        socket.emit('peer-not-found', { targetId: to })
      }
    })

    socket.on('answer', ({ answer, to }) => {
      const target = io.sockets.sockets.get(to)
      if (target) {
        target.emit('answer', { answer, from: socket.id })
      } else {
        socket.emit('peer-not-found', { targetId: to })
      }
    })

    socket.on('ice-candidate', ({ candidate, to }) => {
      const target = io.sockets.sockets.get(to)
      if (target) {
        target.emit('ice-candidate', { candidate, from: socket.id })
      }
    })

    socket.on('ice-restart', ({ to }) => {
      const target = io.sockets.sockets.get(to)
      if (target) {
        target.emit('ice-restart-request', { from: socket.id })
      }
    })

    socket.on('ice-state-change', ({ state }) => {
      // Could persist to DB here if needed
    })

    // ─── Session Recovery ─────────────────────────────────────────────────────

    socket.on('request-recovery', async ({ roomId, userId }) => {
      // First check in-memory
      const room = rooms.get(roomId)
      if (room) {
        socket.emit('recovery-info', {
          canRecover: true,
          session: {
            id: room.sessionId,
            roomId: room.id,
            participants: room.participants.filter(p => p.connected !== false),
          },
        })
        return
      }

      // Fall back to database
      const dbSession = await getPersistedSession(roomId)
      if (dbSession && dbSession.status === 'active') {
        socket.emit('recovery-info', {
          canRecover: true,
          session: {
            id: dbSession.id,
            roomId,
            participants: dbSession.connections
              .filter(c => c.connectionState !== 'ended')
              .map(c => ({
                socketId: null,
                userId: c.userId,
                userName: c.userName,
                userType: c.userType,
                connected: false,
              })),
          },
        })
      } else {
        socket.emit('recovery-info', { canRecover: false, reason: 'Session not found' })
      }
    })

    // ─── Media Controls ───────────────────────────────────────────────────────

    socket.on('toggle-video', ({ enabled, roomId }) => {
      socket.to(roomId).emit('peer-toggle-video', { socketId: socket.id, enabled })
    })

    socket.on('toggle-audio', ({ enabled, roomId }) => {
      socket.to(roomId).emit('peer-toggle-audio', { socketId: socket.id, enabled })
    })

    socket.on('start-screen-share', ({ roomId }) => {
      socket.to(roomId).emit('peer-started-screen-share', { socketId: socket.id })
    })

    socket.on('stop-screen-share', ({ roomId }) => {
      socket.to(roomId).emit('peer-stopped-screen-share', { socketId: socket.id })
    })

    // ─── Video Chat (in-room ephemeral messages) ──────────────────────────────

    socket.on('chat-message', ({ roomId, message, userName, userType }) => {
      if (!message || message.trim().length === 0) return
      io.to(roomId).emit('new-chat-message', {
        message: message.trim(),
        userName,
        userType,
        timestamp: new Date().toISOString(),
        socketId: socket.id,
      })
    })

    // ─── Persistent Chat (messaging system) ─────────────────────────────────

    socket.on('chat:join', ({ userId }) => {
      if (userId) socket.join(`user:${userId}`)
    })

    socket.on('chat:join-conversation', ({ conversationId }) => {
      if (conversationId) socket.join(`conversation:${conversationId}`)
    })

    socket.on('chat:leave-conversation', ({ conversationId }) => {
      if (conversationId) socket.leave(`conversation:${conversationId}`)
    })

    socket.on('chat:send', async ({ conversationId, content, senderId, senderName, senderType }) => {
      if (!content || !content.trim() || !conversationId || !senderId) return
      try {
        // Persist message to database
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId,
            content: content.trim(),
          },
          select: {
            id: true,
            conversationId: true,
            senderId: true,
            content: true,
            createdAt: true,
          },
        })

        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        })

        // Get all participants to notify
        const participants = await prisma.conversationParticipant.findMany({
          where: { conversationId },
          select: { userId: true },
        })

        const payload = {
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          senderName: senderName || 'Unknown',
          senderType: senderType || 'PATIENT',
          content: message.content,
          createdAt: message.createdAt.toISOString(),
        }

        // Emit to all participants' personal rooms
        for (const p of participants) {
          io.to(`user:${p.userId}`).emit('chat:message', payload)
        }
      } catch (error) {
        console.error('Chat send error:', error.message)
      }
    })

    socket.on('chat:typing', ({ conversationId, userId, userName }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('chat:typing', { conversationId, userId, userName })
      }
    })

    socket.on('chat:stop-typing', ({ conversationId, userId }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('chat:stop-typing', { conversationId, userId })
      }
    })

    socket.on('chat:mark-read', async ({ conversationId, userId }) => {
      if (!conversationId || !userId) return
      try {
        await prisma.message.updateMany({
          where: {
            conversationId,
            senderId: { not: userId },
            readAt: null,
          },
          data: { readAt: new Date() },
        })
        // Notify other participants
        socket.to(`conversation:${conversationId}`).emit('chat:read', { conversationId, userId })
      } catch (error) {
        console.error('Chat mark-read error:', error.message)
      }
    })

    // ─── Leave & Disconnect ───────────────────────────────────────────────────

    socket.on('leave-room', () => {
      handleDisconnection(socket, 'leave_room')
    })

    socket.on('disconnect', (reason) => {
      handleDisconnection(socket, reason)
    })

    socket.on('error', (error) => {
      console.error(`Socket error ${socket.id}:`, error.message)
    })

    // ─── Room Info ────────────────────────────────────────────────────────────

    socket.on('get-room-info', async ({ roomId }) => {
      const room = rooms.get(roomId)
      if (room) {
        socket.emit('room-info', {
          ...room,
          participantCount: room.participants.filter(p => p.connected !== false).length,
          isActive: Date.now() - room.lastActivity < 300000,
          canRecover: true,
        })
      } else {
        // Check database
        const dbSession = await getPersistedSession(roomId)
        if (dbSession && dbSession.status === 'active') {
          socket.emit('room-info', {
            id: roomId,
            participantCount: dbSession.connections.length,
            isActive: false,
            canRecover: true,
          })
        } else {
          socket.emit('room-info', null)
        }
      }
    })
  })

  // ─── Room Cleanup ───────────────────────────────────────────────────────────

  setInterval(() => {
    const now = Date.now()
    rooms.forEach((room, roomId) => {
      const activeParticipants = room.participants.filter(p => p.connected !== false)
      if (activeParticipants.length === 0 && now - room.lastActivity > ROOM_TIMEOUT) {
        rooms.delete(roomId)
        endPersistedSession(roomId)
        console.log(`Cleaned up room: ${roomId}`)
      }
    })
  }, SESSION_CLEANUP_INTERVAL)

  // ─── Start ──────────────────────────────────────────────────────────────────

  const actualPort = process.env.PORT || port
  server.listen(actualPort, '0.0.0.0', () => {
    console.log(`Server ready on port ${actualPort} (${dev ? 'development' : 'production'})`)
    console.log('WebRTC signaling active | Database sessions enabled')
  })
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`)
  // End all active sessions
  for (const [roomId] of rooms) {
    await endPersistedSession(roomId)
  }
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

startServer().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
