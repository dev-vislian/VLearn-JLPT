import { Link } from 'react-router-dom'
import { BarChart3, PlayCircle, Timer } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'

const levels = [
  {
    id: 'kana',
    title: 'Kana',
    subtitle: 'Hiragana & Katakana',
    description: 'Pelajari dasar tulisan Jepang dengan kartu & kuis interaktif',
    icon: 'あ',
    badge: 'Dasar',
  },
  { id: 'n5', title: 'N5', subtitle: 'Level Pemula', description: 'Pengenalan dasar kosakata, kanji, & tata bahasa', badge: 'Pemula' },
  { id: 'n4', title: 'N4', subtitle: 'Level Dasar', description: 'Memahami percakapan & situasi sehari-hari', badge: 'Dasar' },
  { id: 'n3', title: 'N3', subtitle: 'Level Menengah', description: 'Memahami teks dan situasi bahasa Jepang menengah', badge: 'Menengah' },
  { id: 'n2', title: 'N2', subtitle: 'Level Atas', description: 'Berkomunikasi lancar dalam berbagai situasi', badge: 'Mahir' },
  { id: 'n1', title: 'N1', subtitle: 'Level Lanjut', description: 'Penguasaan bahasa Jepang tingkat tinggi setara penutur asli', badge: 'Expert' },
]

export default function Landing() {
  const { progress } = useApp()

  const getTotalProgressPercent = () => {
    let totalUnits = 0
    let completedTotal = 0
    levels.forEach((level) => {
      if (!progress[level.id]) return
      Object.values(progress[level.id]).forEach((moduleData) => {
        Object.values(moduleData).forEach((unitData) => {
          totalUnits++
          if (unitData.completed) completedTotal++
        })
      })
    })
    if (totalUnits === 0) return 0
    return Math.round((completedTotal / totalUnits) * 100)
  }

  const getCompletedUnits = (level) => {
    if (!progress[level]) return 0
    let total = 0
    Object.values(progress[level]).forEach((moduleData) => {
      Object.values(moduleData).forEach((unitData) => {
        if (unitData.completed) total++
      })
    })
    return total
  }

  const getLastActiveUnit = () => {
    let lastFound = null
    levels.forEach((level) => {
      if (level.id === 'kana') return
      if (!progress[level.id]) return
      ['vocab', 'kanji', 'grammar'].forEach((mod) => {
        if (!progress[level.id][mod]) return
        Object.entries(progress[level.id][mod]).forEach(([uId, uData]) => {
          if (!uData.completed) {
            if (!lastFound) {
              lastFound = { level: level.id, mod, unitId: uId }
            }
          }
        })
      })
    })
    return lastFound || { level: 'n5', mod: 'vocab', unitId: 'unit-1' }
  }

  const totalPercent = getTotalProgressPercent()

  const lastActive = getLastActiveUnit()
  const lastActiveLink = `/${lastActive.level}/${lastActive.mod}/${lastActive.unitId}`
  const lastActiveTitle = `${lastActive.level.toUpperCase()} • ${lastActive.mod} • ${lastActive.unitId.replace('-', ' ')}`

  return (
    <div className="min-h-screen bg-zen-bg flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full py-8">
        <section className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-zen-accent/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zen-card border-2 border-zen-border rounded-full text-xs font-bold text-zen-accent-dark mb-6 shadow-sm animate-bounce-soft">
            <img 
              src="https://media1.tenor.com/m/_SWlyuEfNUAAAAAC/scuba-scuba-cat.gif" 
              alt="Cat" 
              className="w-5 h-5 rounded-full object-cover"
            />
            <span>VLearn JLPT • ブイラーン JLPT</span>
            <img 
              src="https://media1.tenor.com/m/_SWlyuEfNUAAAAAC/scuba-scuba-cat.gif" 
              alt="Cat Right" 
              className="w-5 h-5 rounded-full object-cover"
            />
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold text-zen-text-dark mb-4 tracking-tight japanese-text">
            VLearn
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-zen-text mb-8 max-w-xl mx-auto leading-relaxed">
            Yo, Minna-san! ⚡ Ini website belajar gua sendiri khusus buat persiapan JLPT. 🚀🔥
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-zen-text text-sm font-semibold">
            <div className="flex items-center gap-2 px-4 py-2 bg-zen-card border-2 border-zen-border rounded-2xl shadow-sm">
              <BarChart3 size={18} className="text-zen-accent-dark" />
              <span>Progress: {totalPercent}% Selesai</span>
            </div>
            <Link to={lastActiveLink} className="flex items-center gap-2 px-4 py-2 bg-zen-card border-2 border-zen-border rounded-2xl shadow-sm hover:border-zen-accent transition-all">
              <PlayCircle size={18} className="text-zen-accent-dark" />
              <span>Lanjut: {lastActiveTitle}</span>
            </Link>
            <Link to="/zen" className="flex items-center gap-2 px-4 py-2 bg-zen-accent text-white rounded-2xl shadow-md hover:bg-zen-accent-dark transition-all">
              <Timer size={18} />
              <span>Zen Mode</span>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => {
            const completedUnits = getCompletedUnits(level.id)
            const href = level.id === 'kana' ? '/kana' : `/${level.id}`

            return (
              <Link
                key={level.id}
                to={href}
                className="bg-zen-card border-2 border-zen-border rounded-3xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-zen-accent group relative overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-zen-accent-light rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-extrabold text-zen-text-dark/20 group-hover:text-zen-accent transition-colors">
                      {level.icon || level.title}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 bg-zen-bg border border-zen-border rounded-full text-zen-text">
                      {level.badge}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-zen-text-dark mb-1 group-hover:text-zen-accent-dark transition-colors">
                    {level.title}
                  </h2>
                  <p className="text-sm font-semibold text-zen-text/80 mb-2">{level.subtitle}</p>
                  <p className="text-sm text-zen-text leading-relaxed mb-6">{level.description}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-zen-text/70 mb-3 pt-4 border-t border-zen-border/60">
                    <span>{completedUnits} unit selesai</span>
                    <span className="text-zen-accent-dark group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Mulai Belajar →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
