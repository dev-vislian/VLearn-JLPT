import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Shuffle, HelpCircle, FileText } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'
import { speak, shuffleArray } from '../utils/helper.js'
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

export default function Unit() {
  const { level, module, unitId } = useParams()
  const { bookmarks, toggleBookmark, showFurigana, updateProgress } = useApp()
  const [activeActivity, setActiveActivity] = useState(() => {
    const saved = localStorage.getItem(`unit-activity-${level}-${module}-${unitId}`)
    return saved || 'summary'
  })
  const [unitData, setUnitData] = useState([])
  
  useEffect(() => {
    console.log('Unit mount:', { level, module, unitId })
  }, [])

  useEffect(() => {
    localStorage.setItem(`unit-activity-${level}-${module}-${unitId}`, activeActivity)
  }, [activeActivity, level, module, unitId])

  useEffect(() => {
    const data = getUnitData(level, module, unitId)
    setUnitData(data)
    if (!data || data.length === 0) {
      setActiveActivity('summary')
    }
  }, [level, module, unitId])

  const handleComplete = () => {
    updateProgress(level, module, unitId, { completed: true, completedAt: Date.now() })
  }

  const levelLabel = level.toUpperCase()

  return (
    <div className="min-h-screen bg-zen-bg flex flex-col">
      <div className="bg-zen-card border-b-2 border-zen-border shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to={`/${level}`} className="p-2 rounded-xl hover:bg-zen-bg transition-colors">
                <ArrowLeft size={20} className="text-zen-accent-dark" />
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-zen-text-dark leading-tight">
                  {levelLabel} / {moduleLabels[module]}
                </h1>
                <p className="text-xs md:text-sm text-zen-text font-medium">Unit {unitId.replace('unit-', '')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zen-text-dark hidden md:block">Aktivitas Latihan</h2>
        
        <div className="flex flex-wrap gap-2">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <button
                key={activity.id}
                onClick={() => setActiveActivity(activity.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  activeActivity === activity.id
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
        {unitData && unitData.length > 0 ? (
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
              <FlashcardView data={shuffleArray(unitData)} module={module} showFurigana={showFurigana} />
            )}
            {activeActivity === 'match' && (
              <MatchView data={shuffleArray(unitData)} module={module} />
            )}
            {activeActivity === 'quiz' && (
              <QuizView data={shuffleArray(unitData)} module={module} onComplete={handleComplete} />
            )}
            {activeActivity === 'matome' && (
              <MatomeView data={shuffleArray(unitData)} module={module} onComplete={handleComplete} />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-zen-text-dark mb-3">Data belum tersedia</h3>
            <p className="text-zen-text">Unit ini akan segera ditambahkan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
