import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext()

const STORAGE_KEYS = {
  progress: 'manabu_progress',
  bookmarks: 'manabu_bookmarks',
  furigana: 'manabu_furigana',
  zenSettings: 'manabu_zen_settings',
}

export function AppProvider({ children }) {
  const [progress, setProgress] = useState({})
  const [bookmarks, setBookmarks] = useState([])
  const [showFurigana, setShowFurigana] = useState(true)
  const [zenSettings, setZenSettings] = useState({
    enabled: false,
    pomodoro: { focus: 25, break: 5, active: true },
    playlist: 'lofi',
  })

  useEffect(() => {
    const storedProgress = localStorage.getItem(STORAGE_KEYS.progress)
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress))
    }
  }, [])

  useEffect(() => {
    const storedBookmarks = localStorage.getItem(STORAGE_KEYS.bookmarks)
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks))
    }
  }, [])

  useEffect(() => {
    const storedFurigana = localStorage.getItem(STORAGE_KEYS.furigana)
    if (storedFurigana) {
      setShowFurigana(JSON.parse(storedFurigana))
    }
  }, [])

  useEffect(() => {
    const storedZenSettings = localStorage.getItem(STORAGE_KEYS.zenSettings)
    if (storedZenSettings) {
      setZenSettings(JSON.parse(storedZenSettings))
    }
  }, [])

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

  const value = {
    progress,
    bookmarks,
    showFurigana,
    zenSettings,
    toggleBookmark,
    updateProgress,
    resetLevelProgress,
    toggleZenMode,
    updateZenSettings,
    toggleFurigana,
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
