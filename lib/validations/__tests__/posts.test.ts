import { describe, it, expect } from 'vitest'
import { createPostSchema, updatePostSchema, createCommentSchema } from '../api'

describe('createPostSchema', () => {
  it('accepts valid data with content only', () => {
    const result = createPostSchema.safeParse({ content: 'Hello world' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.content).toBe('Hello world')
    }
  })

  it('accepts valid data with all optional fields', () => {
    const result = createPostSchema.safeParse({
      content: 'A health tip',
      category: 'health_tips',
      tags: ['diet', 'exercise'],
      imageUrl: 'https://example.com/image.png',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.category).toBe('health_tips')
      expect(result.data.tags).toEqual(['diet', 'exercise'])
      expect(result.data.imageUrl).toBe('https://example.com/image.png')
    }
  })

  it('rejects missing content', () => {
    const result = createPostSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects empty content', () => {
    const result = createPostSchema.safeParse({ content: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Content is required')
    }
  })

  it('rejects content exceeding 10000 characters', () => {
    const result = createPostSchema.safeParse({ content: 'x'.repeat(10001) })
    expect(result.success).toBe(false)
  })

  it('accepts content at exactly 10000 characters', () => {
    const result = createPostSchema.safeParse({ content: 'x'.repeat(10000) })
    expect(result.success).toBe(true)
  })

  it('category is optional', () => {
    const result = createPostSchema.safeParse({ content: 'No category post' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.category).toBeUndefined()
    }
  })

  it('tags is optional', () => {
    const result = createPostSchema.safeParse({ content: 'No tags post' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tags).toBeUndefined()
    }
  })
})

describe('updatePostSchema', () => {
  it('accepts partial update with content only', () => {
    const result = updatePostSchema.safeParse({ content: 'Updated content' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.content).toBe('Updated content')
    }
  })

  it('accepts empty object (all fields optional)', () => {
    const result = updatePostSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts nullable category', () => {
    const result = updatePostSchema.safeParse({ category: null })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.category).toBeNull()
    }
  })

  it('accepts category as string', () => {
    const result = updatePostSchema.safeParse({ category: 'nutrition' })
    expect(result.success).toBe(true)
  })

  it('accepts nullable imageUrl', () => {
    const result = updatePostSchema.safeParse({ imageUrl: null })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.imageUrl).toBeNull()
    }
  })

  it('accepts isPublished boolean', () => {
    const result = updatePostSchema.safeParse({ isPublished: false })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isPublished).toBe(false)
    }
  })

  it('rejects empty content string', () => {
    const result = updatePostSchema.safeParse({ content: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Content cannot be empty')
    }
  })

  it('rejects content exceeding 10000 characters', () => {
    const result = updatePostSchema.safeParse({ content: 'x'.repeat(10001) })
    expect(result.success).toBe(false)
  })

  it('accepts tags array', () => {
    const result = updatePostSchema.safeParse({ tags: ['a', 'b'] })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tags).toEqual(['a', 'b'])
    }
  })
})

describe('createCommentSchema', () => {
  it('accepts valid comment content', () => {
    const result = createCommentSchema.safeParse({ content: 'Great post!' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.content).toBe('Great post!')
    }
  })

  it('rejects empty content', () => {
    const result = createCommentSchema.safeParse({ content: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Comment content is required')
    }
  })

  it('rejects missing content', () => {
    const result = createCommentSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects content exceeding 5000 characters', () => {
    const result = createCommentSchema.safeParse({ content: 'x'.repeat(5001) })
    expect(result.success).toBe(false)
  })

  it('accepts content at exactly 5000 characters', () => {
    const result = createCommentSchema.safeParse({ content: 'x'.repeat(5000) })
    expect(result.success).toBe(true)
  })
})
