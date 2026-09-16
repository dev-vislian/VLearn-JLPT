import { useState, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'

export default function MatchView({ data, module }) {
  const [leftItems, setLeftItems] = useState([])
  const [rightItems, setRightItems] = useState([])
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matched, setMatched] = useState([])
  const [round, setRound] = useState(1)

  useEffect(() => {
    initRound(data)
  }, [data])

  const initRound = (sourceData) => {
    const shuffledLeft = [...sourceData].sort(() => Math.random() - 0.5).slice(0, 6)
    const shuffledRight = [...shuffledLeft].sort(() => Math.random() - 0.5)
    setLeftItems(shuffledLeft)
    setRightItems(shuffledRight)
    setMatched([])
    setSelectedLeft(null)
    setSelectedRight(null)
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

      <div className="grid grid-cols-2 gap-8">
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
                className={`w-full p-4 rounded-lg border font-medium text-lg transition-all ${
                  isMatched
                    ? 'bg-zen-success/50 border-zen-success text-zen-text-dark/50'
                    : isSelected
                    ? 'bg-zen-accent/20 border-zen-accent text-zen-text-dark'
                    : 'bg-zen-bg border-zen-border text-zen-text-dark hover:border-zen-accent'
                }`}
              >
                {item.character || item.pattern}
              </button>
            )
          })}
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
                className={`w-full p-4 rounded-lg border font-medium text-lg transition-all ${
                  isMatched
                    ? 'bg-zen-success/50 border-zen-success text-zen-text-dark/50'
                    : isSelected
                    ? 'bg-zen-accent/20 border-zen-accent text-zen-text-dark'
                    : 'bg-zen-bg border-zen-border text-zen-text-dark hover:border-zen-accent'
                }`}
              >
                {item.meaning}
              </button>
            )
          })}
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
