import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Grid3x3, BookOpen, Shuffle, HelpCircle, Zap } from 'lucide-react'
import { kanaData } from '../data/kana.js'
import { shuffleArray } from '../utils/helper.js'
import KanaGrid from '../components/KanaGrid.jsx'
import KanaFlashcard from '../components/KanaFlashcard.jsx'
import KanaMatch from '../components/KanaMatch.jsx'
import KanaQuiz from '../components/KanaQuiz.jsx'
import KanaRush from '../components/KanaRush.jsx'

const modes = [
  { id: 'grid', label: 'Grid', icon: Grid3x3 },
  { id: 'flashcard', label: 'Flashcard', icon: BookOpen },
  { id: 'match', label: 'Cocokkan', icon: Shuffle },
  { id: 'quiz', label: 'Kuis', icon: HelpCircle },
  { id: 'rush', label: 'Rush', icon: Zap },
]

export default function Kana() {
  const [selectedType, setSelectedType] = useState(() => {
    const saved = localStorage.getItem('kana-type')
    return saved || 'hiragana'
  })
  const [selectedMode, setSelectedMode] = useState(() => {
    const saved = localStorage.getItem('kana-mode')
    return saved || 'grid'
  })
  const [includeExtended, setIncludeExtended] = useState(() => {
    return localStorage.getItem('kana-extended') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('kana-type', selectedType)
  }, [selectedType])

  useEffect(() => {
    localStorage.setItem('kana-mode', selectedMode)
  }, [selectedMode])

  useEffect(() => {
    localStorage.setItem('kana-extended', includeExtended ? 'true' : 'false')
  }, [includeExtended])

  const allData = selectedType === 'hiragana' ? kanaData.hiragana : kanaData.katakana
  const currentData = useMemo(
    () => (includeExtended ? allData : allData.filter((k) => !k.extended)),
    [allData, includeExtended]
  )
  const extendedCount = allData.length - allData.filter((k) => !k.extended).length
  const shuffledData = useMemo(() => shuffleArray(currentData), [currentData])

  return (
    <div className="min-h-screen bg-zen-bg">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zen-accent-dark hover:text-zen-accent mb-8 transition-colors">
          <ArrowLeft size={20} />
          Kembali
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-zen-text-dark mb-6">あ 、 ア - Kana</h1>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zen-text-dark mb-3">Pilih Jenis</label>
              <div className="flex gap-3">
                {['hiragana', 'katakana'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedType === type
                        ? 'bg-zen-accent text-white shadow-lg'
                        : 'bg-zen-card border border-zen-border text-zen-text-dark hover:border-zen-accent'
                    }`}
                  >
                    {type === 'hiragana' ? 'ひらがな' : 'カタカナ'}
                  </button>
                ))}
              </div>
            </div>

            {selectedType === 'katakana' && extendedCount > 0 && (
              <div>
                <label className="block text-sm font-medium text-zen-text-dark mb-3">Tambahan</label>
                <button
                  onClick={() => setIncludeExtended((prev) => !prev)}
                  className={`px-5 py-3 rounded-lg font-medium transition-all ${
                    includeExtended
                      ? 'bg-zen-accent text-white shadow-lg'
                      : 'bg-zen-card border border-zen-border text-zen-text-dark hover:border-zen-accent'
                  }`}
                >
                  {includeExtended ? ' Sembunyikan' : 'Tampilkan'} Extended ({extendedCount})
                </button>
                <p className="text-xs text-zen-text/70 mt-2">
                  ウィ・ウェ — hanya dipakai untuk kata dari bahasa Inggris
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-zen-text-dark mb-3">Pilih Mode Aktivitas</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {modes.map((mode) => {
              const Icon = mode.icon
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg font-medium transition-all ${
                    selectedMode === mode.id
                      ? 'bg-zen-accent-dark text-white shadow-lg'
                      : 'bg-zen-card border border-zen-border text-zen-text-dark hover:border-zen-accent'
                  }`}
                >
                  <Icon size={18} />
                  {mode.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-zen-card rounded-xl p-6 md:p-8 border border-zen-border">
          {selectedMode === 'grid' && <KanaGrid data={currentData} />}
          {selectedMode === 'flashcard' && <KanaFlashcard key={selectedType} data={shuffledData} />}
          {selectedMode === 'match' && <KanaMatch key={selectedType} data={shuffledData} />}
          {selectedMode === 'quiz' && <KanaQuiz key={selectedType} data={shuffledData} />}
          {selectedMode === 'rush' && <KanaRush key={selectedType} data={currentData} />}
        </div>
      </div>
    </div>
  )
}
