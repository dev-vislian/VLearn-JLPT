import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Folder, BookmarkCheck, RotateCcw } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'
import { loadBookmarks, saveBookmarks } from '../utils/helper.js'

const modules = [
  { id: 'kanji', label: '漢字', subtitle: 'Kanji' },
  { id: 'vocab', label: '語彙', subtitle: 'Kosakata' },
  { id: 'grammar', label: '文法', subtitle: 'Tata Bahasa' },
]

const modulesByLevel = {
  n5: { kanji: 5, vocab: 16, grammar: 16 },
  n4: { kanji: 6, vocab: 6, grammar: 5 },
  n3: { kanji: 7, vocab: 7, grammar: 6 },
  n2: { kanji: 8, vocab: 8, grammar: 7 },
  n1: { kanji: 10, vocab: 10, grammar: 8 },
}

const moduleLabels = {
  kanji: { label: 'Kanji', icon: '漢', color: 'bg-[#fde2e4] border-[#f4a2aa] text-[#7a3b3b]' },
  vocab: { label: 'Kosakata', icon: '語', color: 'bg-[#e2f0fd] border-[#a3c9e2] text-[#3b5a7a]' },
  grammar: { label: 'Tata Bahasa', icon: '文', color: 'bg-[#f5e2fd] border-[#d4a5ff] text-[#5e3b7a]' },
}

export default function Level() {
  const { level } = useParams()
  const { progress, bookmarks, resetLevelProgress, showFurigana, toggleFurigana } = useApp()
  const [activeModule, setActiveModule] = useState('kanji')

  const levelNum = level.toUpperCase()
  const unitCount = modulesByLevel[level]?.[activeModule] || 5

  const getUnitProgress = (unitId) => {
    const data = progress[level]?.[activeModule]?.[unitId]
    if (!data) return 0
    return data.completed ? 100 : 0
  }

  const totalUnits = unitCount
  const completedUnits = Object.keys(progress[level]?.[activeModule] || {}).filter(
    (unitId) => progress[level]?.[activeModule]?.[unitId]?.completed
  ).length

  const handleResetLevel = () => {
    if (window.confirm(`Reset semua progress di level ${levelNum}?`)) {
      resetLevelProgress(level)
    }
  }

  return (
    <div className="min-h-screen bg-zen-bg">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zen-accent-dark hover:text-zen-accent mb-8 transition-colors">
          <ArrowLeft size={20} />
          Kembali
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-zen-text-dark mb-2">{levelNum}</h1>
            <p className="text-zen-text">{completedUnits} / {totalUnits} unit selesai</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleFurigana}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showFurigana
                  ? 'bg-zen-accent text-white'
                  : 'bg-zen-card border border-zen-border text-zen-text-dark'
              }`}
            >
              Furigana {showFurigana ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={handleResetLevel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zen-text border border-zen-border hover:border-zen-error hover:text-zen-error transition-all"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeModule === mod.id
                  ? 'bg-zen-accent-dark text-white shadow-lg'
                  : 'bg-zen-card border border-zen-border text-zen-text-dark hover:border-zen-accent'
              }`}
            >
              <span className="text-lg mr-2">{mod.label}</span>
              {mod.subtitle}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: unitCount }, (_, i) => {
            const unitId = `unit-${i + 1}`
            const unitProgress = getUnitProgress(unitId)
            const unitColor = moduleLabels[activeModule]?.color || 'bg-zen-bg border-zen-border text-zen-text-dark'

            return (
              <Link
                key={unitId}
                to={`/${level}/${activeModule}/${unitId}`}
                className={`${unitColor} border rounded-xl p-5 hover:scale-105 transition-all hover:shadow-lg`}
              >
                <Folder size={24} className="mb-3 opacity-60" />
                <div className="text-lg font-semibold mb-1">Unit {i + 1}</div>
                <div className="text-sm opacity-70">{activeModule === 'kanji' ? '20' : activeModule === 'vocab' ? '50' : '5'} Item</div>

                <div className="mt-4 w-full bg-white/30 rounded-full h-1">
                  <div
                    className="bg-white h-1 rounded-full transition-all duration-500"
                    style={{ width: `${unitProgress}%` }}
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
