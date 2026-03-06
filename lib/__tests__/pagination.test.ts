import { describe, it, expect } from 'vitest'
import { parsePagination, paginate } from '../pagination'

describe('parsePagination', () => {
  it('returns defaults when no params', () => {
    const params = new URLSearchParams()
    const result = parsePagination(params)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
  })

  it('parses page and limit', () => {
    const params = new URLSearchParams({ page: '3', limit: '10' })
    const result = parsePagination(params)
    expect(result.page).toBe(3)
    expect(result.limit).toBe(10)
  })

  it('clamps page minimum to 1', () => {
    const params = new URLSearchParams({ page: '-5' })
    expect(parsePagination(params).page).toBe(1)
  })

  it('clamps limit minimum to 1', () => {
    const params = new URLSearchParams({ limit: '0' })
    expect(parsePagination(params).limit).toBe(1)
  })

  it('clamps limit maximum to 50', () => {
    const params = new URLSearchParams({ limit: '200' })
    expect(parsePagination(params).limit).toBe(50)
  })

  it('handles non-numeric values gracefully', () => {
    const params = new URLSearchParams({ page: 'abc', limit: 'xyz' })
    const result = parsePagination(params)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1)

  it('returns first page', () => {
    const result = paginate(items, { page: 1, limit: 10 })
    expect(result.data).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(result.total).toBe(25)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(10)
    expect(result.totalPages).toBe(3)
  })

  it('returns second page', () => {
    const result = paginate(items, { page: 2, limit: 10 })
    expect(result.data).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
  })

  it('returns last partial page', () => {
    const result = paginate(items, { page: 3, limit: 10 })
    expect(result.data).toEqual([21, 22, 23, 24, 25])
  })

  it('returns empty data for out-of-range page', () => {
    const result = paginate(items, { page: 10, limit: 10 })
    expect(result.data).toEqual([])
    expect(result.total).toBe(25)
  })

  it('handles empty array', () => {
    const result = paginate([], { page: 1, limit: 10 })
    expect(result.data).toEqual([])
    expect(result.total).toBe(0)
    expect(result.totalPages).toBe(1)
  })
})
