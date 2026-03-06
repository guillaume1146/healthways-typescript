import { describe, it, expect } from 'vitest'
import { updatePreferencesSchema } from '../api'

describe('updatePreferencesSchema', () => {
  it('accepts valid language', () => {
    expect(updatePreferencesSchema.safeParse({ language: 'en' }).success).toBe(true)
    expect(updatePreferencesSchema.safeParse({ language: 'fr' }).success).toBe(true)
    expect(updatePreferencesSchema.safeParse({ language: 'mfe' }).success).toBe(true)
  })

  it('rejects invalid language', () => {
    expect(updatePreferencesSchema.safeParse({ language: 'de' }).success).toBe(false)
  })

  it('accepts valid visibility', () => {
    expect(updatePreferencesSchema.safeParse({ profileVisibility: 'public' }).success).toBe(true)
    expect(updatePreferencesSchema.safeParse({ profileVisibility: 'connections' }).success).toBe(true)
    expect(updatePreferencesSchema.safeParse({ profileVisibility: 'private' }).success).toBe(true)
  })

  it('rejects invalid visibility', () => {
    expect(updatePreferencesSchema.safeParse({ profileVisibility: 'hidden' }).success).toBe(false)
  })

  it('accepts boolean notification fields', () => {
    const result = updatePreferencesSchema.safeParse({
      emailNotifications: false,
      pushNotifications: true,
      smsNotifications: true,
      appointmentReminders: false,
      marketingEmails: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects non-boolean notification fields', () => {
    expect(updatePreferencesSchema.safeParse({ emailNotifications: 'yes' }).success).toBe(false)
  })

  it('accepts empty object (all optional)', () => {
    expect(updatePreferencesSchema.safeParse({}).success).toBe(true)
  })
})
