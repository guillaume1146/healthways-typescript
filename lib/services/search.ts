/**
 * Client-side search service.
 * Centralizes all search-related API calls.
 */

export interface AutocompleteResult {
  id: string
  label: string
  sublabel: string
  category: string
  href: string
  image?: string | null
}

export async function searchAutocomplete(
  query: string,
  category: string = 'all',
  limit: number = 8
): Promise<AutocompleteResult[]> {
  if (query.length < 2) return []

  const res = await fetch(
    `/api/search/autocomplete?q=${encodeURIComponent(query)}&category=${category}&limit=${limit}`
  )
  if (!res.ok) return []

  const data = await res.json()
  return data.success ? data.data : []
}

export async function searchDoctors(query?: string, specialty?: string) {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (specialty && specialty !== 'all') params.set('specialty', specialty)

  const res = await fetch(`/api/search/doctors?${params}`)
  const data = await res.json()
  return data.success ? data.data : []
}

export async function searchNurses(query?: string) {
  const params = new URLSearchParams()
  if (query) params.set('q', query)

  const res = await fetch(`/api/search/nurses?${params}`)
  const data = await res.json()
  return data.success ? data.data : []
}

export async function searchMedicines(query?: string, category?: string) {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (category && category !== 'all') params.set('category', category)

  const res = await fetch(`/api/search/medicines?${params}`)
  const data = await res.json()
  return data.success ? data.data : []
}
