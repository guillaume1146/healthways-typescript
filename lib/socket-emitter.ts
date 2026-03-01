/**
 * Emit a Socket.IO event to a specific user's room.
 * Works from API routes because server.js stores io on globalThis.
 */
export function emitToUser(userId: string, event: string, data: unknown): void {
  const io = (globalThis as any).__io
  if (io) {
    io.to(`user:${userId}`).emit(event, data)
  }
}
