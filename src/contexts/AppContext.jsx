/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { safeParse, ZEN_DURATION_LIMITS } from '../utils/storage.js'

const AppContext = createContext()

const STORAGE_KEYS = {
  progress: 'manabu_progress',
  bookmarks: 'manabu_bookmarks',
  furigana: 'manabu_furigana',
  zenSettings: 'manabu_zen_settings',
  theme: 'manabu_theme',
}

const DEFAULT_ZEN_SETTINGS = {
  pomodoro: { focus: 25, break: 5 },
}

function clamp(value, min, max) {
  const num = Number(value)
  if (!Number.isFinite(num)) return null
  return Math.min(max, Math.max(min, num))
}

// Settings lama bisa punya bentuk rusak (NaN, di luar batas, atau field mati
// yang sudah dihapus). Bersihkan di sini supaya timer tak pernah dapat 0 detik.
function normalizeZenSettings(stored) {
  const source = stored || {}
  const pomodoro = source.pomodoro || {}

  return {
    pomodoro: {
      focus: clamp(pomodoro.focus, ZEN_DURATION_LIMITS.focus.min, ZEN_DURATION_LIMITS.focus.max) ?? DEFAULT_ZEN_SETTINGS.pomodoro.focus,
      break: clamp(pomodoro.break, ZEN_DURATION_LIMITS.break.min, ZEN_DURATION_LIMITS.break.max) ?? DEFAULT_ZEN_SETTINGS.pomodoro.break,
    },
  }
}

export function AppProvider({ children }) {
  const [progress, setProgress] = useState(() => safeParse(STORAGE_KEYS.progress, {}))
  const [bookmarks, setBookmarks] = useState(() => safeParse(STORAGE_KEYS.bookmarks, []))
  const [showFurigana, setShowFurigana] = useState(() => safeParse(STORAGE_KEYS.furigana, true))
  const [zenSettings, setZenSettings] = useState(() =>
    normalizeZenSettings(safeParse(STORAGE_KEYS.zenSettings, DEFAULT_ZEN_SETTINGS))
  )
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

  const updateZenSettings = (settings) => {
    setZenSettings((prev) =>
      normalizeZenSettings({
        ...prev,
        ...settings,
        pomodoro: { ...prev.pomodoro, ...settings.pomodoro },
      })
    )
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
