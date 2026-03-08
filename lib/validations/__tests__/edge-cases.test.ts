import { describe, it, expect } from 'vitest'
import {
  createDoctorBookingSchema,
  createConversationSchema,
  sendMessageSchema,
  createVideoRoomSchema,
  createWebRTCSessionSchema,
} from '../api'

describe('Edge Case Validations', () => {
  describe('Booking schema edge cases', () => {
    it('rejects booking with missing scheduledDate', () => {
      const result = createDoctorBookingSchema.safeParse({
        doctorId: 'DOC001',
        consultationType: 'in_person',
        scheduledTime: '09:00',
      })
      expect(result.success).toBe(false)
    })

    it('rejects booking with missing scheduledTime', () => {
      const result = createDoctorBookingSchema.safeParse({
        doctorId: 'DOC001',
        consultationType: 'in_person',
        scheduledDate: '2026-04-01',
      })
      expect(result.success).toBe(false)
    })

    it('rejects booking with invalid consultationType', () => {
      const result = createDoctorBookingSchema.safeParse({
        doctorId: 'DOC001',
        consultationType: 'telepathy',
        scheduledDate: '2026-04-01',
        scheduledTime: '09:00',
      })
      expect(result.success).toBe(false)
    })

    it('rejects booking with empty doctorId', () => {
      const result = createDoctorBookingSchema.safeParse({
        doctorId: '',
        consultationType: 'video',
        scheduledDate: '2026-04-01',
        scheduledTime: '09:00',
      })
      expect(result.success).toBe(false)
    })

    it('rejects booking with duration below minimum', () => {
      const result = createDoctorBookingSchema.safeParse({
        doctorId: 'DOC001',
        consultationType: 'video',
        scheduledDate: '2026-04-01',
        scheduledTime: '09:00',
        duration: 5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects booking with duration above maximum', () => {
      const result = createDoctorBookingSchema.safeParse({
        doctorId: 'DOC001',
        consultationType: 'video',
        scheduledDate: '2026-04-01',
        scheduledTime: '09:00',
        duration: 9999,
      })
      expect(result.success).toBe(false)
    })

    it('accepts booking with valid optional notes', () => {
      const result = createDoctorBookingSchema.safeParse({
        doctorId: 'DOC001',
        consultationType: 'in_person',
        scheduledDate: '2026-04-01',
        scheduledTime: '09:00',
        notes: 'I have a headache',
        reason: 'Checkup',
      })
      expect(result.success).toBe(true)
    })

    it('rejects notes exceeding 1000 characters', () => {
      const result = createDoctorBookingSchema.safeParse({
        doctorId: 'DOC001',
        consultationType: 'video',
        scheduledDate: '2026-04-01',
        scheduledTime: '09:00',
        notes: 'x'.repeat(1001),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Conversation schema edge cases', () => {
    it('rejects empty participantIds array', () => {
      const result = createConversationSchema.safeParse({ participantIds: [] })
      expect(result.success).toBe(false)
    })

    it('rejects non-UUID participant IDs', () => {
      const result = createConversationSchema.safeParse({ participantIds: ['not-a-uuid'] })
      expect(result.success).toBe(false)
    })

    it('accepts valid UUID participant IDs', () => {
      const result = createConversationSchema.safeParse({
        participantIds: ['550e8400-e29b-41d4-a716-446655440000'],
      })
      expect(result.success).toBe(true)
    })
  })

  describe('Message schema edge cases', () => {
    it('rejects empty message content', () => {
      const result = sendMessageSchema.safeParse({ content: '' })
      expect(result.success).toBe(false)
    })

    it('rejects message exceeding 5000 characters', () => {
      const result = sendMessageSchema.safeParse({ content: 'a'.repeat(5001) })
      expect(result.success).toBe(false)
    })

    it('accepts message at exactly 5000 characters', () => {
      const result = sendMessageSchema.safeParse({ content: 'a'.repeat(5000) })
      expect(result.success).toBe(true)
    })
  })

  describe('Video room schema edge cases', () => {
    it('rejects non-UUID creatorId', () => {
      const result = createVideoRoomSchema.safeParse({ creatorId: 'invalid' })
      expect(result.success).toBe(false)
    })

    it('accepts valid room with optional fields', () => {
      const result = createVideoRoomSchema.safeParse({
        creatorId: '550e8400-e29b-41d4-a716-446655440000',
        reason: 'Follow-up consultation',
      })
      expect(result.success).toBe(true)
    })

    it('rejects reason exceeding 500 characters', () => {
      const result = createVideoRoomSchema.safeParse({
        creatorId: '550e8400-e29b-41d4-a716-446655440000',
        reason: 'x'.repeat(501),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('WebRTC session schema edge cases', () => {
    it('rejects empty roomId', () => {
      const result = createWebRTCSessionSchema.safeParse({
        roomId: '',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        userName: 'Test',
        userType: 'patient',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty userName', () => {
      const result = createWebRTCSessionSchema.safeParse({
        roomId: 'room-123',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        userName: '',
        userType: 'patient',
      })
      expect(result.success).toBe(false)
    })
  })
})
