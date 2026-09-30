import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Folder, BookOpen, FileText, LayoutGrid } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'
import { getUnitData, getUnitCounts } from '../data/registry.js'

const moduleInfo = {
  kanji: { label: 'Kanji', icon: LayoutGrid, color: 'bg-[#fde2e4] border-[#f4a2aa] text-[#7a3b3b]', unitLabel: 'Kanji' },
  vocab: { label: 'Kosakata', icon: BookOpen, color: 'bg-[#e2f0fd] border-[#a3c9e2] text-[#3b5a7a]', unitLabel: 'Kosakata' },
  grammar: { label: 'Tata Bahasa', icon: FileText, color: 'bg-[#f5e2fd] border-[#d4a5ff] text-[#5e3b7a]', unitLabel: 'Pola' },
}

export default function UnitList() {
  const { level, module } = useParams()
  const { progress } = useApp()

  const levelNum = level.toUpperCase()
  const info = moduleInfo[module] || moduleInfo.kanji
  const Icon = info.icon
  const unitCount = getUnitCounts(level)?.[module] || 0

  const getUnitProgress = (unitId) => {
    const data = progress[level]?.[module]?.[unitId]
    return data?.completed ? 100 : 0
  }

  return (
    <div className="min-h-screen bg-zen-bg">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Link to={`/${level}`} className="inline-flex items-center gap-2 text-zen-accent-dark hover:text-zen-accent mb-8 transition-colors">
          <ArrowLeft size={20} />
          Kembali
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className={`p-4 rounded-2xl ${info.color} border-2`}>
            <Icon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zen-text-dark">{info.label}</h1>
            <p className="text-zen-text">{levelNum} • {unitCount} Unit</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: unitCount }, (_, i) => {
            const unitId = `unit-${i + 1}`
            const unitProgress = getUnitProgress(unitId)

            return (
              <Link
                key={unitId}
                to={`/${level}/${module}/${unitId}`}
                className="jp-card bg-zen-card border-2 border-zen-border p-5 hover:border-zen-accent transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <Folder size={24} className="text-zen-text/40 group-hover:text-zen-accent transition-colors" />
                  {unitProgress === 100 && (
                    <div className="stamp animate-stampIn w-14 h-14 -rotate-12 text-[10px] tracking-tighter">
                      完了
                    </div>
                  )}
                </div>
                <div className="text-lg font-bold text-zen-text-dark mb-1">Unit {i + 1}</div>
                <div className="text-xs text-zen-text mb-2">
                  {getUnitData(level, module, unitId).length} {info.unitLabel}
                </div>
              </Link>
            )
          })}
        </div>

        {unitCount === 0 && (
          <div className="text-center py-20 bg-zen-card rounded-3xl border-2 border-dashed border-zen-border">
            <div className="text-5xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-zen-text-dark">Segera Hadir</h3>
            <p className="text-zen-text">Materi untuk unit ini sedang dalam penyusunan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
