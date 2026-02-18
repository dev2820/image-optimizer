import { createContext, useCallback, useContext, useRef, useState } from 'react'

import { DEFAULT_SETTINGS } from '@/constants'
import type { Settings } from '@/types'

type SettingsListener = (settings: Settings) => void

interface SettingsContextValue {
  settings: Settings
  updateSettings: (settings: Settings) => void
  subscribe: (cb: SettingsListener) => () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const listenersRef = useRef(new Set<SettingsListener>())

  const updateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings)
    listenersRef.current.forEach((cb) => cb(newSettings))
  }, [])

  const subscribe = useCallback((cb: SettingsListener) => {
    listenersRef.current.add(cb)
    return () => {
      listenersRef.current.delete(cb)
    }
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, subscribe }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
