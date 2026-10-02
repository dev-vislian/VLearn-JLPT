/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useApp } from './AppContext.jsx'
import { playComplete, playTap, isSoundEnabled } from '../utils/sound.js'
import { safeParse, writeStore, removeStore } from '../utils/storage.js'

const TIMER_KEY = 'manabu_zen_timer'
const AUDIO_KEY = 'manabu_zen_audio'

// File lagu lived lokal di public/audio/ dan sengaja tidak masuk repo.
// Di GitHub Pages file ini tidak ada, jadi musik tidak berbunyi - toggle-nya
// tetap tampil dan timer tetap jalan normal.
export const ZEN_TRACKS = [
  { id: 'amore', name: 'Amore', artist: 'Huey Daze', file: 'amore.mp3' },
  { id: 'tenno', name: 'Journey', artist: 'Tenno', file: 'tenno.mp3' },
  { id: 'itomori', name: 'Itomori', artist: 'Vindu', file: 'itomori.mp3' },
  { id: 'valley', name: 'Valley of Dreams', artist: 'Medieval Fantasy', file: 'valley-of-dreams.mp3' },
]

function trackUrl(file) {
  return `${import.meta.env.BASE_URL}audio/${file}`
}

function readStoredMusicEnabled() {
  const stored = safeParse(AUDIO_KEY, null)
  if (!stored) return false
  if (typeof stored.musicEnabled === 'boolean') return stored.musicEnabled
  return Boolean(stored.trackId) && stored.trackId !== 'none' && stored.autoPlay === true
}

function readStoredTimer() {
  const parsed = safeParse(TIMER_KEY, null)
  if (!parsed) return null
  if (parsed.phase !== 'focus' && parsed.phase !== 'break') return null
  if (!Number.isFinite(parsed.secondsLeft)) return null
  return parsed
}

// Restore selalu paused setelah refresh, tanpa melihat endAt valid atau tidak.
function reconcileStoredTimer(stored, getSeconds) {
  if (!stored?.isZenActive) return stored

  if (!stored.isRunning || !Number.isFinite(stored.endAt)) {
    return { ...stored, isRunning: false }
  }

  let remaining = Math.ceil((stored.endAt - Date.now()) / 1000)
  let phase = stored.phase

  while (remaining <= 0) {
    phase = phase === 'focus' ? 'break' : 'focus'
    remaining += getSeconds(phase)
  }

  return { ...stored, isRunning: false, phase, secondsLeft: remaining }
}

export function formatZenTime(seconds) {
  const safe = Math.max(0, Math.round(seconds))
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const ZenContext = createContext()

export function ZenProvider({ children }) {
  const { zenSettings } = useApp()
  const pomodoro = zenSettings.pomodoro

  const getSeconds = useCallback(
    (p) => (p === 'focus' ? pomodoro.focus : pomodoro.break) * 60,
    [pomodoro.focus, pomodoro.break]
  )

  const [initial] = useState(() =>
    reconcileStoredTimer(readStoredTimer(), (p) => (p === 'focus' ? pomodoro.focus : pomodoro.break) * 60)
  )

  const [phase, setPhase] = useState(initial?.phase ?? 'focus')
  const [isRunning, setIsRunning] = useState(initial?.isRunning ?? false)
  const [secondsLeft, setSecondsLeft] = useState(
    initial ? Math.max(0, initial.secondsLeft) : pomodoro.focus * 60
  )
  const [isZenActive, setIsZenActive] = useState(initial?.isZenActive ?? false)
  const [musicEnabled, setMusicEnabled] = useState(readStoredMusicEnabled)
  const [currentTrack, setCurrentTrack] = useState(() => ZEN_TRACKS[0])
  const [needsGesture, setNeedsGesture] = useState(initial?.isZenActive && !initial?.isRunning)

  const audioRef = useRef(null)
  const endAtRef = useRef(initial?.endAt ?? null)
  const currentTrackIdRef = useRef(ZEN_TRACKS[0].id)
  const lastPhaseKey = useRef(null)
  const startTrackRef = useRef(() => false)

  // Sisa waktu dihitung dari endAt, bukan penghitung yang dikurangi tiap tick,
  // jadi tetap akurat walau tab tidak aktif dan tidak melenceng.
  useEffect(() => {
    if (!isRunning) {
      endAtRef.current = null
      return
    }

    if (endAtRef.current == null) {
      endAtRef.current = Date.now() + secondsLeft * 1000
    }

    const interval = setInterval(() => {
      const remaining = Math.ceil((endAtRef.current - Date.now()) / 1000)
      if (remaining > 0) {
        setSecondsLeft(remaining)
        return
      }
      playComplete()
      const next = phase === 'focus' ? 'break' : 'focus'
      const nextSeconds = getSeconds(next)
      endAtRef.current = Date.now() + nextSeconds * 1000
      setSecondsLeft(nextSeconds)
      setPhase(next)
    }, 250)

    return () => clearInterval(interval)
    // secondsLeft hanya dipakai sekali saat effect dijalankan (titik mulai).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, phase, getSeconds])

  // Timer hasil restore menunggu sentuhan pertama sebelum jalan lagi, supaya
  // tidak melanggar kebijakan autoplay dan sesuai ekspektasi user.
  useEffect(() => {
    if (!needsGesture) return
    const resume = () => {
      setNeedsGesture(false)
      setIsRunning(true)
      // play() harus dipanggil langsung di dalam gesture handler. Kalau
      // ditunggu sampai useEffect, browser menganggapnya autoplay dan menolaknya.
      if (musicEnabled && phase === 'focus' && isSoundEnabled()) {
        startTrackRef.current()
      }
    }
    window.addEventListener('pointerdown', resume, { once: true })
    window.addEventListener('keydown', resume, { once: true })
    return () => {
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
    }
  }, [needsGesture, musicEnabled, phase])

  useEffect(() => {
    if (!isZenActive) {
      removeStore(TIMER_KEY)
      return
    }
    writeStore(TIMER_KEY, { phase, secondsLeft, isRunning, isZenActive })
  }, [phase, secondsLeft, isRunning, isZenActive])

  useEffect(() => {
    writeStore(AUDIO_KEY, { musicEnabled })
  }, [musicEnabled])

  const stopAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audio.src) return
    audio.pause()
    audio.currentTime = 0
  }, [])

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audio.src) return
    audio.pause()
  }, [])

  // src diurus imperatif, bukan lewat prop JSX: kalau React yang memegang src,
  // setiap re-render akan menimpa atribut itu dan membatalkan play() yang jalan.
  const startTrack = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false
    if (!isSoundEnabled()) return false

    const pool = ZEN_TRACKS.filter((t) => t.id !== currentTrackIdRef.current)
    const next = pool[Math.floor(Math.random() * pool.length)] ?? ZEN_TRACKS[0]
    currentTrackIdRef.current = next.id
    setCurrentTrack(next)

    audio.src = trackUrl(next.file)

    try {
      await audio.play()
      return true
    } catch {
      // File tidak ada (deploy tanpa public/audio) atau autoplay diblokir.
      // Diamkan saja: timer tetap jalan, musik dilewati.
      return false
    }
  }, [])

  useEffect(() => {
    startTrackRef.current = startTrack
  }, [startTrack])

  // Satu aturan tunggal: berbunyi hanya saat sesi jalan di fase fokus, hening
  // total saat istirahat.
  useEffect(() => {
    if (!isZenActive) return
    const phaseKey = `${isRunning}-${phase}`
    if (musicEnabled && isRunning && phase === 'focus') {
      if (lastPhaseKey.current !== phaseKey) {
        startTrack()
        lastPhaseKey.current = phaseKey
      }
    } else {
      stopAudio()
      lastPhaseKey.current = phaseKey
    }
  }, [phase, isRunning, isZenActive, musicEnabled, startTrack, stopAudio, pauseAudio])

  const toggleMusic = useCallback(() => {
    setMusicEnabled((prev) => {
      const next = !prev
      if (next && phase === 'focus' && isRunning && isSoundEnabled()) {
        lastPhaseKey.current = `${isRunning}-${phase}`
        startTrack()
      }
      return next
    })
  }, [phase, isRunning, startTrack])

  const startTimer = useCallback(() => {
    playTap()
    setIsZenActive(true)
    setIsRunning(true)
    if (musicEnabled && phase === 'focus' && isSoundEnabled()) {
      lastPhaseKey.current = `true-${phase}`
      startTrack()
    }
  }, [musicEnabled, phase, startTrack])

  const pauseTimer = useCallback(() => {
    playTap()
    setIsRunning(false)
    pauseAudio()
  }, [pauseAudio])

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      pauseTimer()
    } else {
      startTimer()
    }
  }, [isRunning, startTimer, pauseTimer])

  const resetTimer = useCallback(() => {
    playTap()
    setIsRunning(false)
    setPhase('focus')
    setSecondsLeft(getSeconds('focus'))
    stopAudio()
  }, [getSeconds, stopAudio])

  const skipPhase = useCallback(() => {
    playTap()
    endAtRef.current = null
    const next = phase === 'focus' ? 'break' : 'focus'
    setPhase(next)
    setSecondsLeft(getSeconds(next))
  }, [phase, getSeconds])

  const syncDuration = useCallback(
    (type, minutes) => {
      if (!isRunning && phase === type) {
        setSecondsLeft(minutes * 60)
      }
    },
    [isRunning, phase]
  )

  const endSession = useCallback(() => {
    playTap()
    setIsRunning(false)
    setIsZenActive(false)
    setNeedsGesture(false)
    setPhase('focus')
    setSecondsLeft(getSeconds('focus'))
    stopAudio()
    removeStore(TIMER_KEY)
  }, [getSeconds, stopAudio])

  const value = {
    phase,
    isRunning,
    isZenActive,
    secondsLeft,
    totalPhaseSeconds: getSeconds(phase),
    musicEnabled,
    toggleMusic,
    currentTrack,
    startTimer,
    pauseTimer,
    toggleTimer,
    resetTimer,
    skipPhase,
    endSession,
    syncDuration,
  }

  return (
    <ZenContext.Provider value={value}>
      {children}
      <audio ref={audioRef} loop preload="none" />
    </ZenContext.Provider>
  )
}

export function useZen() {
  const context = useContext(ZenContext)
  if (!context) {
    throw new Error('useZen must be used within ZenProvider')
  }
  return context
}