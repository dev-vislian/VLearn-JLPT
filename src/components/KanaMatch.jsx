import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

function pickRound(sourceData) {
  const shuffledLeft = [...sourceData].sort(() => Math.random() - 0.5).slice(0, 6)
  const shuffledRight = [...shuffledLeft].sort(() => Math.random() - 0.5)
  return { left: shuffledLeft, right: shuffledRight, total: Math.ceil(sourceData.length / 6) }
}

export default function KanaMatch({ data }) {
  const [roundData, setRoundData] = useState(() => pickRound(data))
  const { left: leftItems, right: rightItems, total: totalRounds } = roundData
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

  const initRound = (sourceData) => {
    setRoundData(pickRound(sourceData))
    setMatched([])
    setSelectedLeft(null)
    setSelectedRight(null)
  }

  const handleLeftClick = (item) => {
    if (matched.includes(item.id)) return
    setSelectedLeft(item)
    checkMatch(item, selectedRight)
  }

  const handleRightClick = (item) => {
    if (matched.includes(item.id)) return
    setSelectedRight(item)
    checkMatch(selectedLeft, item)
  }

  const checkMatch = (left, right) => {
    if (!left || !right) return

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

  const handleReset = () => {
    setRound(1)
    initRound(data)
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-zen-text hover:text-zen-accent transition-colors"
        >
          <RotateCcw size={18} />
          Mulai Ulang
        </button>
        <div className="text-sm text-zen-text">
          Ronde {round} / {totalRounds}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          {leftItems.map((item) => (
            <button
              key={`left-${item.id}`}
              onClick={() => handleLeftClick(item)}
              disabled={matched.includes(item.id)}
              className={`p-4 rounded-xl border-2 text-3xl font-bold transition-all h-20 flex items-center justify-center ${
                matched.includes(item.id)
                  ? 'bg-zen-success/20 border-zen-success text-zen-text-dark/50'
                  : selectedLeft?.id === item.id
                  ? 'bg-zen-accent/20 border-zen-accent text-zen-text-dark shadow-lg'
                  : 'bg-zen-card border-zen-border text-zen-text-dark hover:border-zen-accent hover:shadow-md'
              }`}
            >
              {item.character}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {rightItems.map((item) => (
            <button
              key={`right-${item.id}`}
              onClick={() => handleRightClick(item)}
              disabled={matched.includes(item.id)}
              className={`p-4 rounded-xl border-2 text-lg font-bold transition-all h-20 flex items-center justify-center ${
                matched.includes(item.id)
                  ? 'bg-zen-success/20 border-zen-success text-zen-text-dark/50'
                  : selectedRight?.id === item.id
                  ? 'bg-zen-accent/20 border-zen-accent text-zen-text-dark shadow-lg'
                  : 'bg-zen-card border-zen-border text-zen-text-dark hover:border-zen-accent hover:shadow-md'
              }`}
            >
              {item.romaji}
            </button>
          ))}
        </div>
      </div>

      {matched.length === leftItems.length && (
        <div className="mt-8 text-center">
          <div className="text-lg font-medium text-zen-text-dark mb-2">Ronde Selesai!</div>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-zen-accent text-white rounded-lg font-medium hover:bg-zen-accent-dark transition-colors"
          >
            Main Lagi
          </button>
        </div>
      )}
    </div>
  )
}
