import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

function pickRound(sourceData) {
  const shuffledLeft = [...sourceData].sort(() => Math.random() - 0.5).slice(0, 6)
  const shuffledRight = [...shuffledLeft].sort(() => Math.random() - 0.5)
  return { left: shuffledLeft, right: shuffledRight }
}

export default function MatchView({ data, module, showFurigana }) {
  const [roundData, setRoundData] = useState(() => pickRound(data))
  const { left: leftItems, right: rightItems } = roundData
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matched, setMatched] = useState([])
  const [round, setRound] = useState(1)
  const [dataRef, setDataRef] = useState(data)

  if (dataRef !== data) {
    setDataRef(data)
    setRoundData(pickRound(data))
    setMatched([])
    setSelectedLeft(null)
    setSelectedRight(null)
    setRound(1)
  }

  function initRound(sourceData) {
    setRoundData(pickRound(sourceData))
    setMatched([])
    setSelectedLeft(null)
    setSelectedRight(null)
  }

  function getDisplayText(item) {
    if (module === 'vocab' && !showFurigana) {
      return item.character?.split('（')[0] || item.pattern
    }
    return item.character || item.pattern
  }

  const handleMatch = (left, right) => {
    if (!left || !right || matched.includes(left.id)) return

    if (left.id === right.id) {
      setMatched((prev) => [...prev, left.id])
      setSelectedLeft(null)
      setSelectedRight(null)

      if (matched.length + 1 === leftItems.length) {
        setTimeout(() => {
          const remaining = data.filter((d) => !matched.includes(d.id))
          if (remaining.length > 0) {
            setRound((prev) => prev + 1)
            initRound(remaining)
          }
        }, 500)
      }
    } else {
      setTimeout(() => {
        setSelectedLeft(null)
        setSelectedRight(null)
      }, 500)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => initRound(data)}
          className="flex items-center gap-2 text-zen-text hover:text-zen-accent transition-colors"
        >
          <RotateCcw size={18} />
          Mulai Ulang
        </button>
        <div className="text-sm text-zen-text">
          Ronde {round} / {Math.ceil(data.length / 6)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zen-text text-center mb-4">
            {module === 'grammar' ? 'Pola / Kategori' : 'Karakter / Kanji'}
          </div>
          <div className="space-y-3">
            {leftItems.map((item) => {
              const isMatched = matched.includes(item.id)
              const isSelected = selectedLeft?.id === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedLeft(item)
                    handleMatch(item, selectedRight)
                  }}
                  disabled={isMatched}
                  className={`w-full min-h-[76px] px-4 py-3 rounded-xl border-2 flex items-center justify-center transition-all ${
                    isMatched
                      ? 'bg-zen-success/40 border-zen-success text-zen-text-dark/50'
                      : isSelected
                      ? 'bg-zen-accent/20 border-zen-accent text-zen-text-dark shadow-md'
                      : 'bg-zen-bg border-zen-border text-zen-text-dark hover:border-zen-accent hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-lg leading-none">{getDisplayText(item)}</span>
                    {showFurigana && item.romaji && (
                      <span className="text-sm text-zen-text/70 font-normal">{item.romaji}</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zen-text text-center mb-4">
            Arti
          </div>
          <div className="space-y-3">
            {rightItems.map((item) => {
              const isMatched = matched.includes(item.id)
              const isSelected = selectedRight?.id === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedRight(item)
                    handleMatch(selectedLeft, item)
                  }}
                  disabled={isMatched}
                  className={`w-full min-h-[76px] px-4 py-3 rounded-xl border-2 flex items-center justify-center text-center transition-all ${
                    isMatched
                      ? 'bg-zen-success/40 border-zen-success text-zen-text-dark/50'
                      : isSelected
                      ? 'bg-zen-accent/20 border-zen-accent text-zen-text-dark shadow-md'
                      : 'bg-zen-bg border-zen-border text-zen-text-dark hover:border-zen-accent hover:shadow-md'
                  }`}
                >
                  <span className="font-medium text-base leading-snug">{item.meaning}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {matched.length === leftItems.length && (
        <div className="mt-8 text-center p-6 bg-zen-success/20 border border-zen-success rounded-lg">
          <div className="text-lg font-semibold text-zen-text-dark">Ronde Selesai! 🎉</div>
        </div>
      )}
    </div>
  )
}