import { Link } from 'react-router-dom'
import { ArrowLeft, Star, Trash2 } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'

export default function Favorites() {
  const { bookmarks, toggleBookmark } = useApp()

  const groupedBookmarks = bookmarks.reduce((acc, item) => {
    const level = item.level || 'other'
    if (!acc[level]) acc[level] = []
    acc[level].push(item)
    return acc
  }, {})

  const handleRemove = (id) => {
    toggleBookmark(id)
  }

  return (
    <div className="min-h-screen bg-zen-bg">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zen-accent-dark hover:text-zen-accent mb-8 transition-colors">
          <ArrowLeft size={20} />
          Kembali
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-zen-text-dark mb-2">Daftar Favorit</h1>
          <p className="text-zen-text">{bookmarks.length} item disimpan</p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16 bg-zen-card rounded-xl border border-zen-border">
            <Star size={48} className="mx-auto text-zen-text/30 mb-4" />
            <h3 className="text-xl font-medium text-zen-text-dark mb-2">Belum ada favorit</h3>
            <p className="text-zen-text">Tandai item dengan bintang untuk menyimpan di sini.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedBookmarks).map(([level, items]) => (
              <div key={level}>
                <h2 className="text-xl font-semibold text-zen-text-dark mb-4 uppercase">{level}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-zen-card border border-zen-border rounded-xl p-5 relative hover:border-zen-accent transition-all"
                    >
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-3 right-3 p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="text-3xl font-medium text-zen-text-dark mb-2">
                        {item.character || item.pattern}
                      </div>
                      <div className="text-sm text-zen-text mb-1">{item.romaji}</div>
                      <div className="font-medium text-zen-text-dark">{item.meaning}</div>

                      {item.level && item.module && (
                        <Link
                          to={`/${item.level}/${item.module}/${item.unitId || 'unit-1'}`}
                          className="mt-3 inline-block text-xs text-zen-accent-dark hover:text-zen-accent"
                        >
                          Lihat di unit →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
