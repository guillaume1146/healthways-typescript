import { describe, it, expect } from 'vitest'
import {
  DOCTOR_SIDEBAR_ITEMS,
  getActiveSectionFromPath,
} from '../(dashboard)/sidebar-config'

describe('Doctor sidebar config', () => {
  it('has at least 12 core sidebar items', () => {
    const coreItems = DOCTOR_SIDEBAR_ITEMS.filter(i => !i.divider && !i.id.startsWith('search-'))
    expect(coreItems.length).toBeGreaterThanOrEqual(12)
  })

  it('all items have required properties', () => {
    for (const item of DOCTOR_SIDEBAR_ITEMS) {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('label')
      expect(item).toHaveProperty('icon')
      expect(item).toHaveProperty('href')
      expect(item).toHaveProperty('color')
      expect(item).toHaveProperty('bgColor')
    }
  })

  it('all hrefs start with /doctor', () => {
    for (const item of DOCTOR_SIDEBAR_ITEMS) {
      if (item.divider) continue
      expect(item.href).toMatch(/^\/doctor/)
    }
  })

  it('has Search & Browse section with search links', () => {
    const searchItems = DOCTOR_SIDEBAR_ITEMS.filter(i => i.id.startsWith('search-'))
    expect(searchItems.length).toBeGreaterThanOrEqual(6)
    const labels = searchItems.map(i => i.label)
    expect(labels).toContain('Find Doctors')
    expect(labels).toContain('Find Nurses')
    expect(labels).toContain('Buy Medicines')
  })

  it('contains expected menu items', () => {
    const labels = DOCTOR_SIDEBAR_ITEMS.map((i) => i.label)
    expect(labels).toContain('Dashboard')
    expect(labels).toContain('Appointments')
    expect(labels).toContain('Booking Requests')
    expect(labels).toContain('Patients')
    expect(labels).toContain('Prescriptions')
    expect(labels).toContain('My Posts')
    expect(labels).toContain('Billing & Earnings')
    expect(labels).toContain('Video Call')
    expect(labels).toContain('Messages')
  })

  it('booking requests href points to /doctor/booking-requests', () => {
    const item = DOCTOR_SIDEBAR_ITEMS.find((i) => i.id === 'booking-requests')
    expect(item).toBeDefined()
    expect(item!.href).toBe('/doctor/booking-requests')
  })

  it('overview href points to /doctor', () => {
    const item = DOCTOR_SIDEBAR_ITEMS.find((i) => i.id === 'overview')
    expect(item).toBeDefined()
    expect(item!.href).toBe('/doctor')
  })

  it('all items have unique ids', () => {
    const ids = DOCTOR_SIDEBAR_ITEMS.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getActiveSectionFromPath', () => {
  it('returns overview for /doctor', () => {
    expect(getActiveSectionFromPath('/doctor')).toBe('overview')
  })

  it('returns appointments for /doctor/appointments', () => {
    expect(getActiveSectionFromPath('/doctor/appointments')).toBe('appointments')
  })

  it('returns booking-requests for /doctor/booking-requests', () => {
    expect(getActiveSectionFromPath('/doctor/booking-requests')).toBe('booking-requests')
  })

  it('returns patients for /doctor/patients', () => {
    expect(getActiveSectionFromPath('/doctor/patients')).toBe('patients')
  })

  it('returns posts for /doctor/posts', () => {
    expect(getActiveSectionFromPath('/doctor/posts')).toBe('posts')
  })

  it('returns billing for /doctor/billing', () => {
    expect(getActiveSectionFromPath('/doctor/billing')).toBe('billing')
  })

  it('returns video for /doctor/video', () => {
    expect(getActiveSectionFromPath('/doctor/video')).toBe('video')
  })

  it('returns messages for /doctor/messages', () => {
    expect(getActiveSectionFromPath('/doctor/messages')).toBe('messages')
  })

  it('returns feed for /doctor/feed', () => {
    expect(getActiveSectionFromPath('/doctor/feed')).toBe('feed')
  })
})
