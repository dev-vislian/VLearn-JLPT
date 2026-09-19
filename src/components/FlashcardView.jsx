import { useState } from 'react'
import { ArrowRight, Volume2 } from 'lucide-react'
import { speak } from '../utils/helper.js'

export default function FlashcardView({ data, module }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [animating, setAnimating] = useState(false)

  const current = data[index]

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
    const text = module === 'grammar' ? current.pattern : current.character.split('（')[0]
    speak(text)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-lg mb-6">
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-xs font-medium text-zen-text bg-zen-border/50 px-2.5 py-1 rounded-full">
            {index + 1} / {data.length}
          </span>
        </div>
        
        <button
          onClick={() => setFlipped(!flipped)}
          className={`w-full h-80 bg-zen-card border-2 border-zen-border rounded-3xl flex flex-col items-center justify-center p-6 hover:border-zen-accent transition-all duration-200 shadow-xl relative overflow-hidden group ${
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

          {!flipped ? (
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-zen-text font-semibold mb-2">
                {module === 'kanji' ? 'Kanji N5' : module === 'vocab' ? 'Kosa Kata N5' : 'Tata Bahasa N5'}
              </div>
              <div className="text-6xl font-bold text-zen-text-dark mb-3">
                {module === 'grammar' ? current.pattern : current.character}
              </div>
              <div className="text-sm text-zen-text font-medium">{current.romaji || ''}</div>
            </div>
          ) : (
            <div className="text-center w-full">
              <div className="text-xs uppercase tracking-wider text-zen-text font-semibold mb-2">
                ARTI
              </div>
              <div className="text-3xl font-bold text-zen-accent-dark mb-4">
                {current.meaning}
              </div>
              
              {module === 'kanji' && (
                <div className="space-y-2 text-left bg-zen-bg/80 p-4 rounded-2xl border border-zen-border">
                  <div className="text-sm">
                    <span className="font-semibold text-zen-text">Onyomi:</span> {current.onyomi}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-zen-text">Kunyomi:</span> {current.kunyomi}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-zen-text">Goresan:</span> {current.strokes}
                  </div>
                </div>
              )}

              {module === 'vocab' && (
                <div className="space-y-2 text-left bg-zen-bg/80 p-4 rounded-2xl border border-zen-border mt-4">
                  <div className="text-sm">
                    <span className="font-semibold text-zen-text">Romaji:</span> {current.romaji}
                  </div>
                </div>
              )}

              {module === 'grammar' && (
                <div className="space-y-2 text-left bg-zen-bg/80 p-4 rounded-2xl border border-zen-border mt-4">
                  <div className="text-sm">
                    <span className="font-semibold text-zen-text">Kategori:</span> {current.category}
                  </div>
                </div>
              )}
            </div>
          )}
        </button>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-zen-border bg-zen-card hover:border-zen-accent hover:bg-zen-accent/5 font-bold text-zen-text-dark transition-all shadow-md"
        >
          <ArrowRight size={18} className="rotate-180" />
          Sebelumnya
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-zen-border bg-zen-card hover:border-zen-accent hover:bg-zen-accent/5 font-bold text-zen-text-dark transition-all shadow-md"
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
