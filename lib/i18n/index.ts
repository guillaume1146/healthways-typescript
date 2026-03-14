'use client'

import { useState, useEffect, useCallback } from 'react'
import en, { type TranslationKey } from './translations/en'
import fr from './translations/fr'
import kr from './translations/kr'

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type SupportedLanguage = 'en' | 'fr' | 'kr'

export interface LanguageOption {
  code: SupportedLanguage
  label: string
  flag: string
}

/* ─── Constants ─────────────────────────────────────────────────────────── */

export const LANGUAGE_STORAGE_KEY = 'omd_lang'
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

export const supportedLanguages: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'fr', label: 'Fran\u00E7ais', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'kr', label: 'Kreol', flag: '\u{1F1F2}\u{1F1FA}' },
]

/* ─── Translation maps ──────────────────────────────────────────────────── */

type TranslationMap = Record<string, string>

const translations: Record<SupportedLanguage, TranslationMap> = {
  en: en as unknown as TranslationMap,
  fr: fr as unknown as TranslationMap,
  kr: kr as unknown as TranslationMap,
}

/* ─── Utility functions ─────────────────────────────────────────────────── */

function getStoredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored && (stored === 'en' || stored === 'fr' || stored === 'kr')) {
      return stored as SupportedLanguage
    }
  } catch {
    // localStorage not available
  }
  return DEFAULT_LANGUAGE
}

/**
 * Translate a key to the current language (standalone, reads from localStorage).
 * For reactive updates in React components, use the `useTranslation()` hook instead.
 */
export function t(key: TranslationKey | string, lang?: SupportedLanguage): string {
  const language = lang || getStoredLanguage()
  const map = translations[language] || translations[DEFAULT_LANGUAGE]
  return map[key] || translations[DEFAULT_LANGUAGE][key] || key
}

/**
 * Set the active language and persist to localStorage.
 * Dispatches a custom event so all `useTranslation()` hooks re-render.
 */
export function setLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  } catch {
    // localStorage not available
  }
  // Notify all listeners
  window.dispatchEvent(new CustomEvent('omd:lang-change', { detail: lang }))
}

/**
 * Get the currently stored language.
 */
export function getLanguage(): SupportedLanguage {
  return getStoredLanguage()
}

/* ─── React Hook ────────────────────────────────────────────────────────── */

/**
 * React hook for i18n. Returns the current language, a `t()` function,
 * and a `setLanguage()` function. Automatically re-renders when the language changes.
 *
 * Usage:
 * ```tsx
 * const { t, language, setLanguage } = useTranslation()
 * return <p>{t('common.login')}</p>
 * ```
 */
export function useTranslation() {
  const [language, setLang] = useState<SupportedLanguage>(DEFAULT_LANGUAGE)

  // Read stored language on mount (client-only)
  useEffect(() => {
    setLang(getStoredLanguage())
  }, [])

  // Listen for language change events from other components / tabs
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<SupportedLanguage>).detail
      if (detail && (detail === 'en' || detail === 'fr' || detail === 'kr')) {
        setLang(detail)
      }
    }
    window.addEventListener('omd:lang-change', handler)
    // Also listen to storage events (cross-tab sync)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === LANGUAGE_STORAGE_KEY && e.newValue) {
        const val = e.newValue as SupportedLanguage
        if (val === 'en' || val === 'fr' || val === 'kr') {
          setLang(val)
        }
      }
    }
    window.addEventListener('storage', storageHandler)
    return () => {
      window.removeEventListener('omd:lang-change', handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [])

  const translate = useCallback(
    (key: TranslationKey | string): string => {
      const map = translations[language] || translations[DEFAULT_LANGUAGE]
      return map[key] || translations[DEFAULT_LANGUAGE][key] || key
    },
    [language]
  )

  const changeLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguage(lang)
    setLang(lang)
  }, [])

  return {
    t: translate,
    language,
    setLanguage: changeLanguage,
    supportedLanguages,
  }
}

export type { TranslationKey }
