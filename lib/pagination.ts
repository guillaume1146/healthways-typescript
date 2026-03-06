/**
 * Shared pagination utility for API routes.
 * Parses page/limit from search params and paginates an array of results.
 */

interface PaginationParams {
  page: number
  limit: number
}

interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const rawPage = parseInt(searchParams.get('page') || '', 10)
  const rawLimit = parseInt(searchParams.get('limit') || '', 10)
  const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage)
  const limit = Math.min(50, Math.max(1, isNaN(rawLimit) ? 20 : rawLimit))
  return { page, limit }
}

export function paginate<T>(items: T[], { page, limit }: PaginationParams): PaginatedResult<T> {
  const total = items.length
  const totalPages = Math.ceil(total / limit) || 1
  const start = (page - 1) * limit
  const data = items.slice(start, start + limit)

  return { data, total, page, limit, totalPages }
}
