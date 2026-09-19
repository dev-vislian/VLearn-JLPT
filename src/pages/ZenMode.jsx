import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Music, Volume2, Sun } from 'lucide-react'
import { useApp } from '../contexts/AppContext.jsx'

export default function ZenMode() {
  const { zenSettings, toggleZenMode, updateZenSettings } = useApp()
  const [timer, setTimer] = useState(() => ({
    phase: 'focus',
    seconds: zenSettings.pomodoro.focus * 60,
  }))
  const [isFocused, setIsFocused] = useState(true)

  const playlists = {
    lofi: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUfTFmNBRM',
    ambient: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ',
    piano: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8B1jke59iuK',
  }

  useEffect(() => {
    if (!isFocused) return
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds > 1) {
          return { phase: prev.phase, seconds: prev.seconds - 1 }
        }
        const nextPhase = prev.phase === 'focus' ? 'break' : 'focus'
        const nextSeconds =
          nextPhase === 'focus'
            ? zenSettings.pomodoro.focus * 60
            : zenSettings.pomodoro.break * 60
        return { phase: nextPhase, seconds: nextSeconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isFocused, zenSettings.pomodoro.focus, zenSettings.pomodoro.break])

  const toggleTimer = () => {
    setIsFocused((prev) => !prev)
  }

  const resetTimer = () => {
    setTimer({ phase: 'focus', seconds: zenSettings.pomodoro.focus * 60 })
    setIsFocused(true)
  }

  const changePlaylist = (playlistKey) => {
    updateZenSettings({ playlist: playlistKey })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentPlaylist = playlists[zenSettings.playlist]

  return (
    <div className="min-h-screen bg-zen-bg">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-zen-accent-dark hover:text-zen-accent transition-colors">
            <ArrowLeft size={20} />
            Kembali
          </Link>
          <button
            onClick={() => toggleZenMode(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zen-accent text-white hover:bg-zen-accent-dark transition-colors"
          >
            <Sun size={18} />
            Keluar Zen Mode
          </button>
        </div>

        <h1 className="text-4xl font-semibold text-zen-text-dark mb-8">Zen Mode</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zen-card rounded-2xl p-8 border border-zen-border text-center">
              <div className="text-sm text-zen-text uppercase tracking-wider mb-4">
                {timer.phase === 'focus' ? 'Fokus Belajar' : 'Istirahat'}
              </div>
              <div
                className={`text-7xl font-mono font-medium mb-6 ${timer.phase === 'focus' ? 'text-zen-text-dark' : 'text-zen-success'}`}
              >
                {formatTime(timer.seconds)}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className="px-6 py-3 bg-zen-accent text-white rounded-lg font-medium hover:bg-zen-accent-dark transition-colors"
                >
                  {isFocused ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-6 py-3 bg-zen-bg border border-zen-border rounded-lg font-medium text-zen-text-dark hover:border-zen-accent transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-zen-card rounded-2xl p-8 border border-zen-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zen-text-dark flex items-center gap-2">
                  <Music size={20} />
                  Playlist
                </h2>
                <Volume2 size={18} className="text-zen-text" />
              </div>
              <div className="space-y-3">
                {Object.keys(playlists).map((key) => (
                  <button
                    key={key}
                    onClick={() => changePlaylist(key)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      zenSettings.playlist === key
                        ? 'bg-zen-accent text-white'
                        : 'bg-zen-bg border border-zen-border text-zen-text-dark hover:border-zen-accent'
                    }`}
                  >
                    <div className="font-medium capitalize">{key} Lo-fi</div>
                    <div className="text-sm opacity-70">Relaxing beats for study</div>
                  </button>
                ))}
              </div>
              <div className="mt-6 h-64 rounded-lg overflow-hidden">
                <iframe
                  src={currentPlaylist}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="encrypted-media"
                  title="Spotify Playlist"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zen-card rounded-2xl p-6 border border-zen-border">
              <h3 className="text-lg font-medium text-zen-text-dark mb-4">Pengaturan Timer</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zen-text mb-2">Durasi Fokus (menit)</label>
                  <input
                    type="number"
                    value={zenSettings.pomodoro.focus}
                    onChange={(e) => updateZenSettings({ pomodoro: { ...zenSettings.pomodoro, focus: Number(e.target.value) } })}
                    className="w-full p-3 bg-zen-bg border border-zen-border rounded-lg text-zen-text-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zen-text mb-2">Durasi Istirahat (menit)</label>
                  <input
                    type="number"
                    value={zenSettings.pomodoro.break}
                    onChange={(e) => updateZenSettings({ pomodoro: { ...zenSettings.pomodoro, break: Number(e.target.value) } })}
                    className="w-full p-3 bg-zen-bg border border-zen-border rounded-lg text-zen-text-dark"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
