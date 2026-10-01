/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext()

const STORAGE_KEYS = {
  progress: 'manabu_progress',
  bookmarks: 'manabu_bookmarks',
  furigana: 'manabu_furigana',
  zenSettings: 'manabu_zen_settings',
  theme: 'manabu_theme',
}

const DEFAULT_ZEN_SETTINGS = {
  enabled: false,
  pomodoro: { focus: 25, break: 5, active: true },
  playlist: 'lofi',
}

function safeParse(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch (e) {
    console.warn(`Gagal parse ${key}, pakai nilai default:`, e)
    return fallback
  }
}

export function AppProvider({ children }) {
  const [progress, setProgress] = useState(() => safeParse(STORAGE_KEYS.progress, {}))
  const [bookmarks, setBookmarks] = useState(() => safeParse(STORAGE_KEYS.bookmarks, []))
  const [showFurigana, setShowFurigana] = useState(() => safeParse(STORAGE_KEYS.furigana, true))
  const [zenSettings, setZenSettings] = useState(() => safeParse(STORAGE_KEYS.zenSettings, DEFAULT_ZEN_SETTINGS))
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEYS.theme)
    if (storedTheme) return storedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.zenSettings, JSON.stringify(zenSettings))
  }, [zenSettings])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  }, [theme])

  const toggleBookmark = (itemId, itemData) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.id === itemId)
      if (exists) {
        return prev.filter((b) => b.id !== itemId)
      }
      return [...prev, { id: itemId, ...itemData, bookmarkedAt: Date.now() }]
    })
  }

  const updateProgress = (level, module, unitId, progressData) => {
    setProgress((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        [module]: {
          ...prev[level]?.[module],
          [unitId]: {
            ...prev[level]?.[module]?.[unitId],
            ...progressData,
          },
        },
      },
    }))
  }

  const resetLevelProgress = (level) => {
    setProgress((prev) => {
      const updated = { ...prev }
      delete updated[level]
      return updated
    })
  }

  const toggleZenMode = (enabled) => {
    setZenSettings((prev) => ({ ...prev, enabled }))
  }

  const updateZenSettings = (settings) => {
    setZenSettings((prev) => ({ ...prev, ...settings }))
  }

  const toggleFurigana = () => {
    setShowFurigana((prev) => {
      const newValue = !prev
      localStorage.setItem(STORAGE_KEYS.furigana, JSON.stringify(newValue))
      return newValue
    })
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const value = {
    progress,
    bookmarks,
    showFurigana,
    zenSettings,
    theme,
    toggleBookmark,
    updateProgress,
    resetLevelProgress,
    toggleZenMode,
    updateZenSettings,
    toggleFurigana,
    toggleTheme,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
