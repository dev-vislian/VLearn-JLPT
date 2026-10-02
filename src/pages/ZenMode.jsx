import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Music, SkipForward, LogOut, Volume2, VolumeX } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'
import { useZen, formatZenTime } from '../contexts/ZenContext.jsx'
import Enso from '../components/Enso.jsx'

const DURATION_LIMITS = {
  focus: { min: 1, max: 120 },
  break: { min: 1, max: 60 },
}

function DurationInput({ id, label, value, limits, onCommit }) {
  const [draft, setDraft] = useState(String(value))
  const [prevValue, setPrevValue] = useState(value)

  if (value !== prevValue) {
    setPrevValue(value)
    setDraft(String(value))
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm text-zen-text mb-2">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const num = Number(draft)
          if (draft.trim() !== '' && Number.isFinite(num)) {
            const clamped = Math.min(limits.max, Math.max(limits.min, num))
            onCommit(clamped)
            setDraft(String(clamped))
          } else {
            setDraft(String(value))
          }
        }}
        className="w-full p-3 bg-zen-bg border border-zen-border rounded-lg text-zen-text-dark"
      />
      <p className="mt-1 text-xs text-zen-text/60">{limits.min}–{limits.max} menit</p>
    </div>
  )
}

export default function ZenMode() {
  const { zenSettings, updateZenSettings } = useApp()
  const navigate = useNavigate()
  const pomodoro = zenSettings.pomodoro

  const {
    phase,
    isRunning,
    isZenActive,
    secondsLeft,
    totalPhaseSeconds,
    musicEnabled,
    toggleMusic,
    toggleTimer,
    resetTimer,
    skipPhase,
    endSession,
    syncDuration,
  } = useZen()

  const percentElapsed =
    totalPhaseSeconds > 0 ? 100 - (secondsLeft / totalPhaseSeconds) * 100 : 0
  const isFocus = phase === 'focus'

  const handleDurationCommit = (type, val) => {
    updateZenSettings({ pomodoro: { ...pomodoro, [type]: val } })
    syncDuration(type, val)
  }

  const handleEndSession = () => {
    endSession()
    navigate('/')
  }

  useEffect(() => {
    document.title = isRunning
      ? `${formatZenTime(secondsLeft)} · ${isFocus ? 'Fokus' : 'Istirahat'} · VLearn`
      : 'Zen Mode · VLearn'
    return () => {
      document.title = 'VLearn'
    }
  }, [secondsLeft, isRunning, isFocus])

  return (
    <div className="min-h-screen bg-zen-bg">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8 gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-zen-text-dark font-display">
              Zen Mode <span aria-hidden>禅</span>
            </h1>
            <p className="text-xs text-zen-text/70 mt-1">集中と休息、リズムが大事 • ritme itu kunci</p>
          </div>
          {isZenActive && (
            <button
              onClick={handleEndSession}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zen-card border-2 border-zen-border text-zen-text-dark hover:border-zen-error hover:text-zen-error transition-colors text-sm font-bold shrink-0"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Selesai Sesi</span>
              <span className="sm:hidden">Stop</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="jp-card bg-zen-card rounded-3xl border-2 border-zen-border p-6 sm:p-10 text-center flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-2 border-2 shadow-sm ${
                isFocus
                  ? 'bg-zen-accent/10 border-zen-accent text-zen-accent-dark'
                  : 'bg-zen-success/10 border-zen-success text-zen-success'
              }`}>
                <span>{isFocus ? '⚡' : '🍵'}</span>
                <span>{isFocus ? '集中 · Fokus Belajar' : '休憩 · Istirahat Dulu'}</span>
                <span>{isFocus ? '🔥' : '✨'}</span>
              </span>
            </div>

            <div className="my-4">
              <Enso
                percent={percentElapsed}
                size={180}
                strokeWidth={5}
                label={formatZenTime(secondsLeft)}
                labelClassName="text-3xl font-mono font-bold"
                showDoneMark={false}
              />
            </div>

            {isZenActive && (
              <p className="text-xs text-zen-text/70 mb-4 max-w-sm mx-auto leading-relaxed">
                {isFocus
                  ? `Fokus${musicEnabled ? ' & musik' : ''} tetap jalan walau kamu pindah halaman. がんばれ!`
                  : `Istirahat yang enak${musicEnabled ? ' — musik ikut rehat juga' : ''}. お疲れ様!`}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
              <button
                onClick={toggleTimer}
                className="flex-1 min-w-[130px] px-6 py-3.5 bg-zen-accent text-white rounded-2xl font-semibold hover:bg-zen-accent-dark shadow-lg shadow-zen-accent/20 transition-all"
              >
                {isRunning ? '⏸ Pause' : '▶ Mulai'}
              </button>
              <button
                onClick={skipPhase}
                className="px-5 py-3.5 bg-zen-bg border-2 border-zen-border rounded-2xl font-semibold text-zen-text-dark hover:border-zen-accent transition-all flex items-center justify-center gap-2"
                title="Lewati fase ini"
              >
                <SkipForward size={18} />
                <span>Lewati</span>
              </button>
              <button
                onClick={resetTimer}
                className="px-5 py-3.5 bg-zen-bg border-2 border-zen-border rounded-2xl font-semibold text-zen-text-dark hover:border-zen-accent transition-all"
                title="Mulai ulang timer dari nol"
              >
                ↺ Reset
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="jp-card bg-zen-card rounded-3xl border-2 border-zen-border p-6 sm:p-8">
              <h2 className="text-lg font-bold text-zen-text-dark mb-4 font-display">Pengaturan Timer</h2>
              <div className="space-y-4">
                <DurationInput
                  id="zen-focus"
                  label="Durasi Fokus (menit)"
                  value={pomodoro.focus}
                  limits={DURATION_LIMITS.focus}
                  onCommit={(focus) => handleDurationCommit('focus', focus)}
                />
                <DurationInput
                  id="zen-break"
                  label="Durasi Istirahat (menit)"
                  value={pomodoro.break}
                  limits={DURATION_LIMITS.break}
                  onCommit={(brk) => handleDurationCommit('break', brk)}
                />
              </div>
              <p className="mt-4 text-xs text-zen-text/60">
                Perubahan berlaku saat timer dijeda. Sesi yang sedang berjalan tidak terganggu.
              </p>
            </div>

            <div className="jp-card bg-zen-card rounded-3xl border-2 border-zen-border p-6 sm:p-8">
              <h2 className="text-lg font-bold text-zen-text-dark mb-1 flex items-center gap-2 font-display">
                <Music size={18} className="text-zen-accent" />
                <span>Musik Latar</span>
                <span aria-hidden>音</span>
              </h2>
              <p className="text-xs text-zen-text/70 mb-5">
                File lokal, jalan tanpa internet. Loudness mengikuti tombol volume perangkat.
              </p>

              <button
                type="button"
                role="switch"
                aria-checked={musicEnabled}
                onClick={toggleMusic}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 font-semibold transition-colors ${
                  musicEnabled
                    ? 'bg-zen-accent text-white border-zen-accent'
                    : 'bg-zen-bg border-zen-border text-zen-text-dark hover:border-zen-accent'
                }`}
              >
                <span className="flex items-center gap-2 text-sm">
                  {musicEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  {musicEnabled ? 'Musik aktif' : 'Tanpa musik'}
                </span>
                <span className={`text-xs font-bold ${musicEnabled ? 'text-white/90' : 'text-zen-text/60'}`}>
                  {musicEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <p className="mt-4 text-xs text-zen-text/60 leading-relaxed">
                {musicEnabled
                  ? 'Lagu diacak tiap awal fase fokus, otomatis hening saat istirahat. 🎧'
                  : 'Sesi hening — timer tetap jalan penuh tanpa musik. 🤫'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}