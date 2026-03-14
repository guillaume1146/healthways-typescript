'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'omd_search_history'
const MAX_HISTORY = 5

export interface SearchHistoryEntry {
  query: string
  type: string
  timestamp: number
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as SearchHistoryEntry[]
        setHistory(parsed)
      }
    } catch {
      // localStorage not available or corrupt data
    }
  }, [])

  const addToHistory = useCallback((query: string, type: string = 'all') => {
    if (!query.trim()) return

    setHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(
        entry => entry.query.toLowerCase() !== query.toLowerCase() || entry.type !== type
      )
      // Add new entry at the beginning
      const updated = [
        { query: query.trim(), type, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY)

      // Persist
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // localStorage full or not available
      }

      return updated
    })
  }, [])

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => {
      const updated = prev.filter(entry => entry.query !== query)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  return { history, addToHistory, removeFromHistory, clearHistory }
}
