import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '../schemas'

describe('loginSchema', () => {
  it('accepts email and password only (no userType)', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('accepts email, password, and optional userType', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
      userType: 'patient',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
    })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const validBase = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'pass123',
    confirmPassword: 'pass123',
    phone: '+23012345678',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    address: '123 Main St',
    userType: 'patient',
    agreeToTerms: true,
    agreeToPrivacy: true,
    agreeToDisclaimer: true,
  }

  it('accepts valid patient registration', () => {
    const result = registerSchema.safeParse(validBase)
    expect(result.success).toBe(true)
  })

  it('rejects when passwords do not match', () => {
    const result = registerSchema.safeParse({
      ...validBase,
      confirmPassword: 'different',
    })
    expect(result.success).toBe(false)
  })

  it('rejects when terms not accepted', () => {
    const result = registerSchema.safeParse({
      ...validBase,
      agreeToTerms: false,
    })
    expect(result.success).toBe(false)
  })

  it('accepts doctor registration with optional professional fields', () => {
    const result = registerSchema.safeParse({
      ...validBase,
      userType: 'doctor',
      licenseNumber: 'DOC-1234',
      specialization: 'Cardiology',
      institution: 'General Hospital',
      experience: '10 years',
    })
    expect(result.success).toBe(true)
  })

  it('accepts corporate admin registration', () => {
    const result = registerSchema.safeParse({
      ...validBase,
      userType: 'corporate',
      companyName: 'Health Corp',
      companyRegistrationNumber: 'REG-001',
    })
    expect(result.success).toBe(true)
  })
})
