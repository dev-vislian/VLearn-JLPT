import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Shuffle, HelpCircle, FileText } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'
import { shuffleArray } from '../utils/helper.js'
import { getUnitData } from '../data/registry.js'
import SummaryView from '../components/SummaryView.jsx'
import FlashcardView from '../components/FlashcardView.jsx'
import MatchView from '../components/MatchView.jsx'
import QuizView from '../components/QuizView.jsx'
import MatomeView from '../components/MatomeView.jsx'

const activities = [
  { id: 'summary', label: 'Ringkasan', icon: FileText },
  { id: 'flashcard', label: 'Flashcard', icon: BookOpen },
  { id: 'match', label: 'Cocokkan', icon: Shuffle },
  { id: 'quiz', label: 'Kuis', icon: HelpCircle },
  { id: 'matome', label: 'Matome', icon: FileText },
]

const moduleLabels = {
  kanji: '漢字',
  vocab: '語彙',
  grammar: '文法',
}

function readSavedActivity(level, module, unitId) {
  return localStorage.getItem(`unit-activity-${level}-${module}-${unitId}`) || 'summary'
}

export default function Unit() {
  const { level, module, unitId } = useParams()
  const unitKey = `${level}/${module}/${unitId}`

  return <UnitView key={unitKey} level={level} module={module} unitId={unitId} />
}

function UnitView({ level, module, unitId }) {
  const { bookmarks, toggleBookmark, showFurigana, updateProgress, toggleFurigana } = useApp()
  const [savedActivity, setSavedActivity] = useState(() => readSavedActivity(level, module, unitId))

  const unitData = getUnitData(level, module, unitId)
  const shuffledData = useMemo(() => shuffleArray(unitData), [unitData])

  const hasData = unitData.length > 0
  const activeActivity = hasData ? savedActivity : 'summary'

  useEffect(() => {
    localStorage.setItem(`unit-activity-${level}-${module}-${unitId}`, activeActivity)
  }, [activeActivity, level, module, unitId])

  const handleComplete = () => {
    updateProgress(level, module, unitId, { completed: true, completedAt: Date.now() })
  }

  const unitNumber = unitId?.replace('unit-', '')

  return (
    <div className="min-h-screen bg-zen-bg flex flex-col">
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-zen-card/80 backdrop-blur-sm border border-zen-border/50 shadow-sm">
            <Link to={`/${level}/${module}`} className="flex items-center gap-2 text-sm font-medium text-zen-text hover:text-zen-accent-dark transition-colors">
              <ArrowLeft size={16} />
              Unit {unitNumber}
            </Link>
            <span className="w-px h-5 bg-zen-border/30" />
            <button
              onClick={toggleFurigana}
              className={`text-sm font-medium transition-all ${
                showFurigana
                  ? 'text-zen-accent'
                  : 'text-zen-text/60'
              }`}
            >
              Furigana {showFurigana ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zen-text-dark hidden md:block">Aktivitas Latihan</h2>

        <div className="flex flex-wrap gap-2">
          {activities.map((activity) => {
            const Icon = activity.icon
            const isActive = activeActivity === activity.id
            return (
              <button
                key={activity.id}
                onClick={() => setSavedActivity(activity.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-zen-accent text-white shadow-lg shadow-zen-accent/20 scale-105'
                    : 'bg-zen-card border-2 border-zen-border text-zen-text-dark hover:border-zen-accent hover:bg-zen-accent/5'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{activity.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        {hasData ? (
          <>
            {activeActivity === 'summary' && (
              <SummaryView
                data={unitData}
                module={module}
                showFurigana={showFurigana}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
              />
            )}
            {activeActivity === 'flashcard' && (
              <FlashcardView data={shuffledData} module={module} />
            )}
            {activeActivity === 'match' && (
              <MatchView data={shuffledData} module={module} showFurigana={showFurigana} />
            )}
            {activeActivity === 'quiz' && (
              <QuizView data={shuffledData} module={module} onComplete={handleComplete} showFurigana={showFurigana} />
            )}
            {activeActivity === 'matome' && (
              <MatomeView data={shuffledData} module={module} onComplete={handleComplete} />
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-zen-card rounded-3xl border-2 border-dashed border-zen-border">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-zen-text-dark mb-3">Data belum tersedia</h3>
            <p className="text-zen-text mb-6">Unit ini akan segera ditambahkan.</p>
            <Link
              to={`/${level}/${module}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zen-accent text-white font-semibold hover:bg-zen-accent-dark transition-all"
            >
              <ArrowLeft size={18} />
              Kembali ke daftar unit
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}