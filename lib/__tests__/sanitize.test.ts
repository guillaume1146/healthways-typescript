import { describe, it, expect } from 'vitest'
import {
  stripHtml,
  escapeHtml,
  removeControlChars,
  sanitizeInput,
  sanitizeSqlInput,
  sanitizeEmail,
  sanitizePhone,
  sanitizeObject,
} from '@/lib/security/sanitize'

describe('stripHtml', () => {
  it('removes simple HTML tags', () => {
    expect(stripHtml('<p>Hello</p>')).toBe('Hello')
  })

  it('removes nested HTML tags', () => {
    expect(stripHtml('<div><span>Hello</span></div>')).toBe('Hello')
  })

  it('removes script tags', () => {
    expect(stripHtml('<script>alert("xss")</script>')).toBe('alert("xss")')
  })

  it('removes self-closing tags', () => {
    expect(stripHtml('Hello<br/>World')).toBe('HelloWorld')
  })

  it('returns empty string for HTML-only input', () => {
    expect(stripHtml('<div></div>')).toBe('')
  })

  it('preserves non-HTML content', () => {
    expect(stripHtml('Just plain text')).toBe('Just plain text')
  })

  it('handles multiple tags with content between them', () => {
    expect(stripHtml('<b>bold</b> and <i>italic</i>')).toBe('bold and italic')
  })
})

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })

  it('escapes less-than sign', () => {
    expect(escapeHtml('a < b')).toBe('a &lt; b')
  })

  it('escapes greater-than sign', () => {
    expect(escapeHtml('a > b')).toBe('a &gt; b')
  })

  it('escapes double quotes', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;')
  })

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#x27;s')
  })

  it('escapes forward slash', () => {
    expect(escapeHtml('a/b')).toBe('a&#x2F;b')
  })

  it('escapes backticks', () => {
    expect(escapeHtml('`code`')).toBe('&#96;code&#96;')
  })

  it('prevents XSS via script tag injection', () => {
    const malicious = '<script>alert("XSS")</script>'
    const escaped = escapeHtml(malicious)
    expect(escaped).not.toContain('<script>')
    expect(escaped).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;')
  })

  it('prevents XSS via event handler injection', () => {
    const malicious = '<img onerror="alert(1)" src=x>'
    const escaped = escapeHtml(malicious)
    // The angle brackets are escaped so the browser won't parse it as an HTML tag
    expect(escaped).not.toContain('<img')
    expect(escaped).toContain('&lt;img')
    expect(escaped).toContain('&gt;')
  })

  it('handles strings with no special characters', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123')
  })
})

describe('removeControlChars', () => {
  it('removes null bytes', () => {
    expect(removeControlChars('hello\x00world')).toBe('helloworld')
  })

  it('removes control characters', () => {
    expect(removeControlChars('hello\x01\x02\x03world')).toBe('helloworld')
  })

  it('preserves newlines', () => {
    expect(removeControlChars('hello\nworld')).toBe('hello\nworld')
  })

  it('preserves tabs', () => {
    expect(removeControlChars('hello\tworld')).toBe('hello\tworld')
  })

  it('preserves carriage returns', () => {
    expect(removeControlChars('hello\rworld')).toBe('hello\rworld')
  })

  it('removes DEL character (0x7F)', () => {
    expect(removeControlChars('hello\x7Fworld')).toBe('helloworld')
  })

  it('handles empty string', () => {
    expect(removeControlChars('')).toBe('')
  })
})

describe('sanitizeInput', () => {
  it('strips HTML and trims whitespace', () => {
    expect(sanitizeInput('  <b>Hello</b>  ')).toBe('Hello')
  })

  it('removes control characters', () => {
    expect(sanitizeInput('Hello\x00World')).toBe('HelloWorld')
  })

  it('limits length when maxLength is provided', () => {
    expect(sanitizeInput('Hello World', 5)).toBe('Hello')
  })

  it('does not truncate when string is within maxLength', () => {
    expect(sanitizeInput('Hi', 10)).toBe('Hi')
  })

  it('combines all sanitization steps', () => {
    const malicious = '  \x00<script>alert("xss")</script>Hello  '
    const result = sanitizeInput(malicious, 20)
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('\x00')
    expect(result.length).toBeLessThanOrEqual(20)
  })

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('')
  })
})

describe('sanitizeSqlInput', () => {
  it('escapes single quotes by doubling them', () => {
    expect(sanitizeSqlInput("O'Brien")).toBe("O''Brien")
  })

  it('removes semicolons', () => {
    expect(sanitizeSqlInput('SELECT * FROM users;')).toBe('SELECT * FROM users')
  })

  it('removes SQL comment sequences (--)', () => {
    expect(sanitizeSqlInput("admin'-- ")).toBe("admin'' ")
  })

  it('removes block comment opening (/*)', () => {
    expect(sanitizeSqlInput('value /* comment')).toBe('value  comment')
  })

  it('removes block comment closing (*/)', () => {
    expect(sanitizeSqlInput('comment */ value')).toBe('comment  value')
  })

  it('prevents classic SQL injection', () => {
    const injection = "'; DROP TABLE users; --"
    const sanitized = sanitizeSqlInput(injection)
    expect(sanitized).not.toContain(';')
    expect(sanitized).not.toContain('--')
  })

  it('prevents union-based SQL injection', () => {
    const injection = "' UNION SELECT * FROM passwords --"
    const sanitized = sanitizeSqlInput(injection)
    expect(sanitized).not.toContain('--')
    expect(sanitized).toContain("''") // escaped single quote
  })

  it('handles safe strings unchanged', () => {
    expect(sanitizeSqlInput('Hello World 123')).toBe('Hello World 123')
  })
})

describe('sanitizeEmail', () => {
  it('returns valid email lowercase and trimmed', () => {
    expect(sanitizeEmail('  TEST@Example.COM  ')).toBe('test@example.com')
  })

  it('returns null for invalid email format', () => {
    expect(sanitizeEmail('not-an-email')).toBeNull()
  })

  it('returns null for email without domain', () => {
    expect(sanitizeEmail('user@')).toBeNull()
  })

  it('returns null for email without TLD', () => {
    expect(sanitizeEmail('user@domain')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(sanitizeEmail('')).toBeNull()
  })

  it('accepts valid email with subdomains', () => {
    expect(sanitizeEmail('user@sub.domain.com')).toBe('user@sub.domain.com')
  })

  it('accepts email with plus addressing', () => {
    expect(sanitizeEmail('user+tag@example.com')).toBe('user+tag@example.com')
  })

  it('accepts email with dots in local part', () => {
    expect(sanitizeEmail('first.last@example.com')).toBe('first.last@example.com')
  })
})

describe('sanitizePhone', () => {
  it('keeps valid phone number characters', () => {
    expect(sanitizePhone('+230 555-1234')).toBe('+230 555-1234')
  })

  it('removes letters and special characters', () => {
    expect(sanitizePhone('+230abc!@#555')).toBe('+230555')
  })

  it('keeps parentheses for area codes', () => {
    expect(sanitizePhone('(230) 555-1234')).toBe('(230) 555-1234')
  })

  it('trims whitespace', () => {
    expect(sanitizePhone('  +230 555  ')).toBe('+230 555')
  })

  it('handles empty string', () => {
    expect(sanitizePhone('')).toBe('')
  })
})

describe('sanitizeObject', () => {
  it('sanitizes string values in an object', () => {
    const input = { name: '<b>John</b>', age: 30 }
    const result = sanitizeObject(input)
    expect(result.name).toBe('John')
    expect(result.age).toBe(30)
  })

  it('sanitizes nested objects recursively', () => {
    const input = {
      user: {
        name: '<script>alert("xss")</script>Alice',
        email: 'alice@example.com',
      },
    }
    const result = sanitizeObject(input)
    expect((result.user as { name: string }).name).toBe('alert("xss")Alice')
  })

  it('respects maxStringLength parameter', () => {
    const input = { bio: 'A'.repeat(100) }
    const result = sanitizeObject(input, 10)
    expect(result.bio).toBe('A'.repeat(10))
  })

  it('does not modify non-string, non-object values', () => {
    const input = { count: 42, active: true, tags: ['a', 'b'] }
    const result = sanitizeObject(input)
    expect(result.count).toBe(42)
    expect(result.active).toBe(true)
    expect(result.tags).toEqual(['a', 'b'])
  })

  it('does not mutate the original object', () => {
    const input = { name: '<b>John</b>' }
    const original = { ...input }
    sanitizeObject(input)
    expect(input.name).toBe(original.name)
  })

  it('handles empty objects', () => {
    expect(sanitizeObject({})).toEqual({})
  })
})
