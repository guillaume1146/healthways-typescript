/**
 * Emit a Socket.IO event to a specific user's room.
 * Works from API routes because server.js stores io on globalThis.
 */
export function emitToUser(userId: string, event: string, data: unknown): void {
  const io = (globalThis as Record<string, unknown>).__io as { to: (room: string) => { emit: (event: string, data: unknown) => void } } | undefined
  if (io) {
    io.to(`user:${userId}`).emit(event, data)
  }
}
