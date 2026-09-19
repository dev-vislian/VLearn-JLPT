import { useState } from 'react'
import { Search, Star, Volume2 } from 'lucide-react'
import { speak } from '../utils/helper.js'

export default function SummaryView({ data, module, showFurigana, bookmarks, onToggleBookmark }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBookmark, setFilterBookmark] = useState(false)

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.character?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.romaji?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pattern?.toLowerCase().includes(searchQuery.toLowerCase())

    const isBookmarked = bookmarks.some((b) => b.id === item.id)

    if (filterBookmark) {
      return matchesSearch && isBookmarked
    }
    return matchesSearch
  })

  const handleSpeak = (text, e) => {
    e.stopPropagation()
    speak(text)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-zen-text/40" size={20} />
          <input
            type="text"
            placeholder="Cari istilah, arti, atau romaji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zen-card border-2 border-zen-border rounded-2xl focus:border-zen-accent outline-none transition-all focus:shadow-md"
          />
        </div>

        <button
          onClick={() => setFilterBookmark(!filterBookmark)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium border-2 transition-all shadow-sm ${
            filterBookmark
              ? 'bg-zen-accent text-white border-zen-accent shadow-lg'
              : 'bg-zen-card border-zen-border text-zen-text-dark hover:border-zen-accent hover:shadow-md'
          }`}
        >
          <Star size={18} className={filterBookmark ? 'fill-current' : ''} />
          Favorit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length > 0 ? filteredData.map((item) => {
          const isBookmarked = bookmarks.some((b) => b.id === item.id)

          return (
            <div
              key={item.id}
              className="bg-zen-card border-2 border-zen-border rounded-3xl p-5 relative hover:border-zen-accent hover:shadow-xl transition-all duration-200 overflow-hidden group"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const speakText = module === 'vocab' || module === 'grammar' ? item.character?.split('（')[0] || item.pattern : item.character
                    handleSpeak(speakText, e)
                  }}
                  className="p-2 rounded-xl border-2 border-zen-border bg-zen-card text-zen-accent hover:bg-zen-accent hover:text-white transition-colors shadow-sm group-hover:scale-110"
                  title="Putar Suara"
                >
                  <Volume2 size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleBookmark(item.id, item)
                  }}
                  className={`p-2 rounded-xl border-2 transition-all shadow-sm group-hover:scale-110 ${
                    isBookmarked
                      ? 'bg-yellow-100 border-yellow-400 text-yellow-600'
                      : 'bg-zen-card border-zen-border text-zen-text/60 hover:border-yellow-400 hover:text-yellow-600'
                  }`}
                  title="Tandai Favorit"
                >
                  <Star size={16} className={isBookmarked ? 'fill-current' : ''} />
                </button>
              </div>

              {module === 'kanji' && item.character && (
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-5xl font-bold text-zen-text-dark flex-shrink-0">{item.character}</span>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-zen-accent uppercase tracking-wider">Kanji N5</div>
                      <div className="text-sm font-medium text-zen-text-dark">{item.romaji}</div>
                      <div className="text-xs text-zen-text/70 flex items-center gap-1">
                        <span>Goresan: <strong>{item.strokes}</strong></span>
                        <span className="mx-1">•</span>
                        <span>Onyomi: {item.onyomi}</span>
                        <span className="mx-1">•</span>
                        <span>Kunyomi: {item.kunyomi}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 px-3 py-2 bg-zen-bg/80 rounded-xl border border-zen-border">
                    <div className="text-sm text-zen-text-dark font-medium">
                      <span className="text-zen-accent-dark font-bold">ARTI:</span> {item.meaning}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-zen-bg/90 to-zen-card p-4 rounded-2xl border-2 border-zen-border shadow-inner">
                    <div className="text-sm font-semibold text-zen-text-dark mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-zen-accent rounded-full"></span>
                      Contoh
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-medium text-zen-text-dark">{item.example?.word}</div>
                      <div className="text-xs text-zen-text/80 italic">{item.example?.romaji}</div>
                      <div className="text-sm font-bold text-zen-accent-dark">{item.example?.meaning}</div>
                    </div>
                  </div>
                </div>
              )}

              {module === 'vocab' && item.character && (
                <div>
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-zen-accent uppercase tracking-wider mb-2">Kosa Kata N5</div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-zen-text-dark">
                        {showFurigana ? item.character : item.character.split('（')[0]}
                      </span>
                      <span className="text-sm font-medium text-zen-text/90">{item.romaji}</span>
                    </div>
                    <div className="px-3 py-2 bg-zen-bg/80 rounded-xl border border-zen-border mb-3">
                      <div className="text-base font-bold text-zen-accent-dark">
                        ARTI: <span className="text-zen-text-dark">{item.meaning}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-zen-bg/90 to-zen-card p-4 rounded-2xl border-2 border-zen-border shadow-inner">
                    <div className="text-sm font-semibold text-zen-text-dark mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-zen-accent rounded-full"></span>
                      CONTOH
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg font-medium text-zen-text-dark leading-tight">{item.example?.sentence}</div>
                      <div className="text-xs text-zen-text/80 italic border-l-2 border-zen-accent pl-2">
                        {item.example?.romaji}
                      </div>
                      <div className="text-sm font-bold text-zen-accent-dark">{item.example?.meaning}</div>
                    </div>
                  </div>
                </div>
              )}

              {module === 'grammar' && item.pattern && (
                <div>
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-zen-accent uppercase tracking-wider mb-2">Tata Bahasa N5</div>
                    <div className="text-2xl font-bold text-zen-accent-dark mb-1">
                      {item.pattern}
                    </div>
                    <div className="text-xs text-zen-text/70 bg-zen-bg px-2.5 py-1 rounded-full inline-block mb-2">
                      {item.category}
                    </div>
                    <div className="px-3 py-2 bg-zen-bg/80 rounded-xl border border-zen-border mb-3">
                      <div className="text-base font-bold text-zen-accent-dark">
                        ARTI: <span className="text-zen-text-dark">{item.meaning}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-zen-bg/90 to-zen-card p-4 rounded-2xl border-2 border-zen-border shadow-inner">
                    <div className="text-sm font-semibold text-zen-text-dark mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-zen-accent rounded-full"></span>
                      CONTOH KALIMAT
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg font-medium text-zen-text-dark leading-tight">{item.example?.sentence}</div>
                      <div className="text-xs text-zen-text/80 italic border-l-2 border-zen-accent pl-2">
                        {item.example?.romaji}
                      </div>
                      <div className="text-sm font-bold text-zen-accent-dark">{item.example?.meaning}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }) : (
          <div className="col-span-full text-center py-12">
            <p className="text-zen-text">Tidak ada data yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}