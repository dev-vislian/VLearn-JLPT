import { Link, useLocation } from 'react-router-dom'
import { Pause, Play } from 'lucide-react'
import { useZen, formatZenTime } from '../contexts/ZenContext.jsx'
import Enso from './Enso.jsx'

export default function ZenMiniBar() {
  const { isZenActive, isRunning, phase, secondsLeft, totalPhaseSeconds, toggleTimer } = useZen()
  const location = useLocation()

  if (!isZenActive || location.pathname === '/zen') return null

  const percentElapsed =
    totalPhaseSeconds > 0 ? 100 - (secondsLeft / totalPhaseSeconds) * 100 : 0

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-16 md:top-1/2 md:-translate-y-1/2 z-10">
      <div className="flex items-center gap-2 pl-2.5 pr-1 py-1 rounded-full bg-zen-pill border border-zen-pill-border shadow-md">
        <Link
          to="/zen"
          className="flex items-center gap-2 group"
          title="Buka Zen Mode"
          aria-label="Buka Zen Mode"
        >
          <span className="text-xs font-bold text-zen-pill-dim group-hover:text-zen-pill-text transition-colors">
            禅
          </span>
          <Enso
            percent={percentElapsed}
            size={26}
            strokeWidth={7}
            label=""
            trackColor="var(--zen-pill-track)"
            progressColor={phase === 'focus' ? '#e88b7d' : '#8ecfa0'}
            showDoneMark={false}
          />
          <span className="font-mono text-xs font-bold tabular-nums text-zen-pill-text">
            {formatZenTime(secondsLeft)}
          </span>
        </Link>

        <button
          onClick={toggleTimer}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-zen-pill-hover text-zen-pill-text hover:bg-zen-pill-border transition-colors"
          title={isRunning ? 'Pause' : 'Lanjut'}
          aria-label={isRunning ? 'Pause' : 'Lanjut'}
        >
          {isRunning ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
        </button>
      </div>
    </div>
  )
}