import { describe, it, expect } from 'vitest'
import { PATIENT_SIDEBAR_ITEMS, getActiveSectionFromPath } from '../(dashboard)/sidebar-config'

describe('Patient Sidebar Config', () => {
  it('has the expected number of menu items', () => {
    expect(PATIENT_SIDEBAR_ITEMS.length).toBeGreaterThan(10)
  })

  it('contains all required sidebar item ids', () => {
    const ids = PATIENT_SIDEBAR_ITEMS.map((i) => i.id)
    expect(ids).toContain('feed')
    expect(ids).toContain('overview')
    expect(ids).toContain('consultations')
    expect(ids).toContain('prescriptions')
    expect(ids).toContain('health-records')
    expect(ids).toContain('lab-results')
    expect(ids).toContain('video')
    expect(ids).toContain('chat')
    expect(ids).toContain('ai-assistant')
    expect(ids).toContain('nurse-services')
    expect(ids).toContain('childcare')
    expect(ids).toContain('emergency')
    expect(ids).toContain('insurance')
    expect(ids).toContain('billing')
  })

  it('has correct href for each item based on /patient base', () => {
    for (const item of PATIENT_SIDEBAR_ITEMS) {
      if (item.divider) continue
      expect(item.href).toMatch(/^\/patient/)
    }
  })

  it('each item has required properties', () => {
    for (const item of PATIENT_SIDEBAR_ITEMS) {
      if (item.divider) continue
      expect(item.id).toBeTruthy()
      expect(item.label).toBeTruthy()
      expect(item.icon).toBeDefined()
      expect(item.color).toBeTruthy()
      expect(item.href).toBeTruthy()
    }
  })

  it('has Search & Browse section with search links', () => {
    const searchItems = PATIENT_SIDEBAR_ITEMS.filter(i => i.id.startsWith('search-'))
    expect(searchItems.length).toBeGreaterThanOrEqual(6)
    const labels = searchItems.map(i => i.label)
    expect(labels).toContain('Find Doctors')
    expect(labels).toContain('Find Nurses')
    expect(labels).toContain('Buy Medicines')
  })
})

describe('Patient getActiveSectionFromPath', () => {
  it('resolves /patient to overview', () => {
    expect(getActiveSectionFromPath('/patient')).toBe('overview')
  })

  it('resolves /patient/feed to feed', () => {
    expect(getActiveSectionFromPath('/patient/feed')).toBe('feed')
  })

  it('resolves /patient/consultations to consultations', () => {
    expect(getActiveSectionFromPath('/patient/consultations')).toBe('consultations')
  })

  it('resolves /patient/prescriptions to prescriptions', () => {
    expect(getActiveSectionFromPath('/patient/prescriptions')).toBe('prescriptions')
  })

  it('resolves /patient/health-records to health-records', () => {
    expect(getActiveSectionFromPath('/patient/health-records')).toBe('health-records')
  })

  it('resolves /patient/lab-results to lab-results', () => {
    expect(getActiveSectionFromPath('/patient/lab-results')).toBe('lab-results')
  })

  it('resolves /patient/video to video', () => {
    expect(getActiveSectionFromPath('/patient/video')).toBe('video')
  })

  it('resolves /patient/chat to chat', () => {
    expect(getActiveSectionFromPath('/patient/chat')).toBe('chat')
  })

  it('resolves /patient/chat/some-conversation-id to chat', () => {
    expect(getActiveSectionFromPath('/patient/chat/conv-123')).toBe('chat')
  })

  it('resolves /patient/ai-assistant to ai-assistant', () => {
    expect(getActiveSectionFromPath('/patient/ai-assistant')).toBe('ai-assistant')
  })

  it('resolves /patient/billing to billing', () => {
    expect(getActiveSectionFromPath('/patient/billing')).toBe('billing')
  })

  it('resolves /patient/emergency to emergency', () => {
    expect(getActiveSectionFromPath('/patient/emergency')).toBe('emergency')
  })

  it('resolves unknown path to overview fallback', () => {
    expect(getActiveSectionFromPath('/patient/nonexistent')).toBe('overview')
  })
})
