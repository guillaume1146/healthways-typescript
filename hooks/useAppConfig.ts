// hooks/useAppConfig.ts
import { useState, useEffect } from 'react'

interface AppConfig {
  appName: string
  appTagline: string
  heroTitle: string
  platformDescription: string
}

export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig>({
    appName: "Healthwyz", // Default fallback
    appTagline: "Your trusted healthcare companion in Mauritius",
    heroTitle: "Your Health, Our Priority",
    platformDescription: "Mauritius's Leading Healthcare Platform"
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
        console.log('✅ Config loaded from backend:', data)
      })
      .catch(err => {
        console.error('❌ Failed to load config:', err)
        setLoading(false)
      })
  }, [])

  return { config, loading }
}