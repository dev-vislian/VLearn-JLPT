import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, LayoutGrid, BookOpen, FileText } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'
import { getUnitCounts } from '../data/registry.js'

const modules = [
  { id: 'kanji', label: 'Kanji', icon: LayoutGrid },
  { id: 'vocab', label: 'Kosakata', icon: BookOpen },
  { id: 'grammar', label: 'Tata Bahasa', icon: FileText },
]

const RADIUS = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function Enso({ percent }) {
  const dash = (percent / 100) * CIRCUMFERENCE
  const isDone = percent >= 100

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle
          cx="32" cy="32" r={RADIUS}
          fill="none"
          stroke="var(--zen-border)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle
          cx="32" cy="32" r={RADIUS}
          fill="none"
          stroke="var(--zen-seal)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
          style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zen-text-dark">
        {percent}%
      </span>
      {isDone && <span className="absolute -bottom-1 -right-1 text-sm" title="全部完了">✦</span>}
    </div>
  )
}

export default function Level() {
  const { level } = useParams()
  const { progress } = useApp()

  const levelNum = level.toUpperCase()
  const unitCounts = getUnitCounts(level)

  const getModuleProgress = (module) => {
    const total = unitCounts?.[module] || 0
    const done = Object.keys(progress[level]?.[module] || {}).filter(
      (unitId) => progress[level]?.[module]?.[unitId]?.completed
    ).length
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 }
  }

  return (
    <div className="min-h-screen bg-zen-bg">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-zen-accent-dark hover:text-zen-accent mb-8 transition-colors">
          <ArrowLeft size={20} />
          Kembali
        </Link>

        <h1 className="text-4xl font-bold text-zen-text-dark mb-10 font-display">{levelNum} - Materi</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon
            const { done, total, percent } = getModuleProgress(mod.id)

            return (
              <Link
                key={mod.id}
                to={`/${level}/${mod.id}`}
                className="jp-card bg-zen-card border-2 border-zen-border p-8 hover:border-zen-accent group"
              >
                <div className="flex items-center gap-5 mb-6">
                  <Enso percent={percent} />
                  <div className={`w-11 h-11 rounded-xl bg-zen-accent-light text-zen-accent flex items-center justify-center`}>
                    <Icon size={22} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-zen-text-dark mb-1 font-display group-hover:text-zen-accent transition-colors">
                  {mod.label}
                </h2>
                <p className="text-sm text-zen-text mb-4">
                  {done} / {total} unit selesai
                </p>
                <span className="text-zen-accent font-bold group-hover:underline">Buka Materi →</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}