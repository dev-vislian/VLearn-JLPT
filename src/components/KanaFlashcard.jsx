import { useState } from 'react'
import { Volume2, ArrowRight } from 'lucide-react'
import { speak } from '../utils/helper.js'

export default function KanaFlashcard({ data }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [animating, setAnimating] = useState(false)

  const triggerAnimation = (callback) => {
    setAnimating(true)
    setTimeout(() => {
      callback()
      setAnimating(false)
    }, 200)
  }

  const handleNext = () => {
    triggerAnimation(() => {
      setIndex((prev) => (prev + 1) % data.length)
      setFlipped(false)
    })
  }

  const handlePrev = () => {
    triggerAnimation(() => {
      setIndex((prev) => (prev - 1 + data.length) % data.length)
      setFlipped(false)
    })
  }

  const handleAudio = (e) => {
    e.stopPropagation()
    speak(current.character)
  }

  const current = data[index]

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md mb-6">
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-xs font-medium text-zen-text bg-zen-border/50 px-2.5 py-1 rounded-full">
            {index + 1} / {data.length}
          </span>
        </div>
        
        <button
          onClick={() => setFlipped(!flipped)}
          className={`w-full h-72 bg-zen-card border border-zen-border rounded-3xl flex flex-col items-center justify-center p-8 hover:border-zen-accent transition-all duration-200 shadow-xl relative overflow-hidden group ${
            animating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleAudio}
              className="p-3 rounded-full bg-zen-accent/10 hover:bg-zen-accent hover:text-white text-zen-accent transition-colors shadow-sm"
              title="Putar Suara"
            >
              <Volume2 size={20} />
            </button>
          </div>

          <div className="text-7xl font-bold text-zen-text-dark mb-4 group-hover:scale-105 transition-transform">
            {flipped ? current.romaji : current.character}
          </div>
          
          <div className="text-xs uppercase tracking-wider text-zen-text font-semibold mb-3">
            {flipped ? 'Romaji' : 'Karakter'}
          </div>

          {current.example && (
            <div className="mt-2 bg-zen-bg/80 px-4 py-2 rounded-xl border border-zen-border text-center w-full">
              <span className="text-sm font-bold text-zen-text-dark mr-2">{current.example.word}</span>
              <span className="text-xs text-zen-text">({current.example.meaning})</span>
            </div>
          )}
        </button>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-zen-border bg-zen-card hover:border-zen-accent hover:bg-zen-accent/5 font-medium text-zen-text-dark transition-all shadow-sm"
        >
          <ArrowRight size={18} className="rotate-180" />
          Sebelumnya
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-zen-border bg-zen-card hover:border-zen-accent hover:bg-zen-accent/5 font-medium text-zen-text-dark transition-all shadow-sm"
        >
          Selanjutnya
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="mt-4 text-xs text-zen-text text-center">
        Klik kartu untuk membalik
      </div>
    </div>
  )
}

