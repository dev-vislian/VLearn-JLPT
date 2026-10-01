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

export function AppProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    const storedProgress = localStorage.getItem(STORAGE_KEYS.progress)
    return storedProgress ? JSON.parse(storedProgress) : {}
  })
  const [bookmarks, setBookmarks] = useState(() => {
    const storedBookmarks = localStorage.getItem(STORAGE_KEYS.bookmarks)
    return storedBookmarks ? JSON.parse(storedBookmarks) : []
  })
  const [showFurigana, setShowFurigana] = useState(() => {
    const storedFurigana = localStorage.getItem(STORAGE_KEYS.furigana)
    return storedFurigana ? JSON.parse(storedFurigana) : true
  })
  const [zenSettings, setZenSettings] = useState(() => {
    const storedZenSettings = localStorage.getItem(STORAGE_KEYS.zenSettings)
    return storedZenSettings ? JSON.parse(storedZenSettings) : DEFAULT_ZEN_SETTINGS
  })
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
