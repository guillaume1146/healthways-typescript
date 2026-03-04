import { describe, it, expect } from 'vitest'
import { createGetActiveSectionFromPath } from '../getActiveSectionFromPath'

const mockItems = [
  { id: 'overview', label: 'Dashboard', icon: {} as any, color: '', bgColor: '', href: '/test' },
  { id: 'consultations', label: 'Consultations', icon: {} as any, color: '', bgColor: '', href: '/test/consultations' },
  { id: 'chat', label: 'Messages', icon: {} as any, color: '', bgColor: '', href: '/test/chat' },
  { id: 'settings', label: 'Settings', icon: {} as any, color: '', bgColor: '', href: '/test/settings' },
]

const getActiveSectionFromPath = createGetActiveSectionFromPath('/test', mockItems)

describe('createGetActiveSectionFromPath', () => {
  it('returns "overview" for base path', () => {
    expect(getActiveSectionFromPath('/test')).toBe('overview')
    expect(getActiveSectionFromPath('/test/')).toBe('overview')
  })

  it('returns matching section id for known paths', () => {
    expect(getActiveSectionFromPath('/test/consultations')).toBe('consultations')
    expect(getActiveSectionFromPath('/test/settings')).toBe('settings')
  })

  it('returns matching section for nested paths', () => {
    expect(getActiveSectionFromPath('/test/consultations/123/book')).toBe('consultations')
  })

  it('returns "chat" for chat paths', () => {
    expect(getActiveSectionFromPath('/test/chat')).toBe('chat')
    expect(getActiveSectionFromPath('/test/chat/123')).toBe('chat')
  })

  it('returns "overview" for unknown paths', () => {
    expect(getActiveSectionFromPath('/test/unknown-page')).toBe('overview')
  })

  it('handles different base paths', () => {
    const fn = createGetActiveSectionFromPath('/doctor', mockItems)
    expect(fn('/doctor')).toBe('overview')
    expect(fn('/doctor/consultations')).toBe('consultations')
  })
})
