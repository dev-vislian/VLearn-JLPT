import { useState, useEffect, useRef } from 'react'
import { RotateCcw, Volume2 } from 'lucide-react'
import { speak, shuffleArray } from '../utils/helper.js'

const SLOT_WIDTH = 88

export default function KanaRush({ data }) {
  const [deck, setDeck] = useState([])
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('idle')
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const inputRef = useRef(null)
  const advanceTimer = useRef(null)

  const current = deck[index]

  useEffect(() => {
    setDeck(shuffleArray(data))
    setIndex(0)
    setInput('')
    setStatus('idle')
    setScore(0)
    setFinished(false)
    return () => clearTimeout(advanceTimer.current)
  }, [data])

  useEffect(() => {
    inputRef.current?.focus()
  }, [index, finished])

  const handleRestart = () => {
    clearTimeout(advanceTimer.current)
    setDeck(shuffleArray(data))
    setIndex(0)
    setInput('')
    setStatus('idle')
    setScore(0)
    setFinished(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (status !== 'idle' || finished || !current) return

    const answer = input.trim().toLowerCase()
    if (!answer) return

    const isCorrect = answer === current.romaji.toLowerCase()
    setStatus(isCorrect ? 'success' : 'error')
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    advanceTimer.current = setTimeout(() => {
      setStatus('idle')
      setInput('')
      setIndex((prev) => {
        if (prev + 1 >= deck.length) {
          setFinished(true)
          return prev
        }
        return prev + 1
      })
    }, isCorrect ? 700 : 1100)
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center text-center py-8 animate-fadeIn">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-zen-text-dark mb-2">Rush Selesai!</h3>
        <p className="text-zen-text mb-6">
          Benar: <span className="font-bold text-zen-accent-dark">{score}</span> dari{' '}
          <span className="font-bold">{deck.length}</span>
        </p>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zen-accent text-white hover:bg-zen-accent-dark shadow-md"
        >
          <RotateCcw size={18} />
          Main Lagi
        </button>
      </div>
    )
  }

  if (!deck.length) return null

  const windowCount = Math.min(deck.length, 5)
  const containerWidth = windowCount * SLOT_WIDTH
  const centerOffset = containerWidth / 2 - SLOT_WIDTH / 2
  const borderColor =
    status === 'success' ? '#22c55e' : status === 'error' ? '#ef4444' : 'rgba(37,99,235,0.35)'

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xl flex items-center justify-between mb-4 px-2">
        <span className="text-xs font-medium text-zen-text bg-zen-border/50 px-2.5 py-1 rounded-full">
          {Math.min(index + 1, deck.length)} / {deck.length} • {score} benar
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundOn((prev) => !prev)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg text-zen-text-dark border shadow-sm transition-colors ${soundOn ? 'bg-zen-accent text-white border-zen-accent' : 'bg-zen-card border-zen-border hover:border-zen-accent'}`}
            title={soundOn ? 'Nonaktifkan suara' : 'Aktifkan suara'}
          >
            <Volume2 size={16} className={soundOn ? '' : 'opacity-40'} />
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-zen-border bg-zen-card text-zen-text-dark hover:border-zen-accent hover:text-zen-accent-dark shadow-sm"
          >
            <RotateCcw size={15} />
            Restart
          </button>
        </div>
      </div>

      <div className="relative mb-2" style={{ width: containerWidth, height: 210 }}>
        <div
          className="absolute top-0 bottom-0 rounded-2xl border-2 pointer-events-none transition-colors duration-300"
          style={{
            left: centerOffset,
            width: SLOT_WIDTH,
            borderColor,
            backgroundColor: status === 'success' ? 'rgba(34,197,94,0.08)' : status === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(37,99,235,0.05)',
            boxShadow: `0 0 30px ${status === 'success' ? 'rgba(34,197,94,0.15)' : status === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(37,99,235,0.08)'}`,
          }}
        />

        <div className="absolute left-0 top-0 bottom-0 overflow-hidden" style={{ width: containerWidth }}>
          <div
            className="absolute left-0 top-1/2 flex"
            style={{
              width: deck.length * SLOT_WIDTH,
              transform: `translate(${centerOffset - index * SLOT_WIDTH}px, -50%)`,
              transition: status === 'success' || status === 'error'
                ? 'none'
                : 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {deck.map((item, j) => {
              const dist = Math.abs(j - index)
              const opacity = status !== 'idle' && dist === 0
                ? 0.85
                : dist === 0 ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.22 : 0.06
              const fontScale = dist === 0 ? 1 : dist === 1 ? 0.62 : dist === 2 ? 0.45 : 0.35
              return (
                <div key={item.id} className="flex-none" style={{ width: SLOT_WIDTH, height: 160 }}>
                  <span
                    className={`japanese-text font-bold select-none transition-all duration-500 ${
                      status === 'success' && dist === 0
                        ? 'text-zen-success'
                        : status === 'error' && dist === 0
                          ? 'text-zen-error'
                          : 'text-zen-text-dark'
                    }`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      opacity,
                      fontSize: `${fontScale * 64}px`,
                      lineHeight: 1,
                    }}
                  >
                    {item.character}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-zen-text">⟩ Ketik romaji karakter di tengah</span>
        <button
          onClick={() => speak(current?.character)}
          className="p-2 rounded-full bg-zen-accent/10 hover:bg-zen-accent hover:text-white text-zen-accent transition-colors shadow-sm"
          title="Putar Suara"
        >
          <Volume2 size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-sm">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== 'idle'}
          placeholder={status === 'success' ? '✓ Benar!' : status === 'error' ? `✗ ${current?.romaji}` : 'Contoh: ka'}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={`flex-1 px-4 py-3 rounded-xl border-2 bg-zen-card text-center text-lg font-semibold tracking-wider transition-all focus:outline-none ${
            status === 'success'
              ? 'border-zen-success text-zen-success'
              : status === 'error'
                ? 'border-zen-error text-zen-error'
                : 'border-zen-border text-zen-text-dark focus:border-zen-accent'
          }`}
        />
        <button
          type="submit"
          disabled={status !== 'idle'}
          className="px-5 py-3 rounded-xl bg-zen-accent text-white font-medium hover:bg-zen-accent-dark disabled:opacity-40 shadow-md"
        >
          Jawab
        </button>
      </form>

      <div className="mt-3 text-xs text-zen-text text-center">
        {status === 'success' ? 'Nice! Meluncur ke karakter berikutnya…' : status === 'error' ? 'Jangan menyerah, lanjut! ' : 'Urutan diacak tiap restart • tekan Enter untuk jawab'}
      </div>
    </div>
  )
}