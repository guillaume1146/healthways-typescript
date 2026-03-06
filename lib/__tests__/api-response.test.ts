import { describe, it, expect } from 'vitest'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  paginatedResponse,
} from '../api-response'

describe('API Response Helpers', () => {
  it('successResponse returns 200 with data', async () => {
    const res = successResponse({ id: '1', name: 'Test' })
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.data.id).toBe('1')
  })

  it('successResponse supports custom status', async () => {
    const res = successResponse({ id: '1' }, 201)
    expect(res.status).toBe(201)
  })

  it('errorResponse returns 400 by default', async () => {
    const res = errorResponse('Bad input')
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.success).toBe(false)
    expect(body.message).toBe('Bad input')
  })

  it('unauthorizedResponse returns 401', async () => {
    const res = unauthorizedResponse()
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.message).toBe('Unauthorized')
  })

  it('forbiddenResponse returns 403', async () => {
    const res = forbiddenResponse()
    expect(res.status).toBe(403)
  })

  it('notFoundResponse returns 404', async () => {
    const res = notFoundResponse('User not found')
    const body = await res.json()
    expect(res.status).toBe(404)
    expect(body.message).toBe('User not found')
  })

  it('serverErrorResponse returns 500', async () => {
    const res = serverErrorResponse()
    expect(res.status).toBe(500)
  })

  it('paginatedResponse includes all pagination fields', async () => {
    const data = [{ id: '1' }, { id: '2' }]
    const res = paginatedResponse(data, 10, 1, 2, 5)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data).toHaveLength(2)
    expect(body.total).toBe(10)
    expect(body.page).toBe(1)
    expect(body.limit).toBe(2)
    expect(body.totalPages).toBe(5)
  })
})
