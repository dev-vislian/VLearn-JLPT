/**
 * Sound feedback synthesized with Web Audio API.
 * No audio files needed - every tone is generated at runtime.
 * Also respects prefers-reduced-motion style sensitivity via mute toggle.
 */

const STORAGE_KEY = 'manabu_sound'

let audioCtx = null
let enabled = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) !== 'false' : true

export function isSoundEnabled() {
  return enabled
}

export function setSoundEnabled(value) {
  enabled = value
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }
  return enabled
}

function getContext() {
  if (!enabled) return null
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    audioCtx = new Ctx()
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function tone({ freq, duration, type = 'sine', gain = 0.08, delay = 0 }) {
  const ctx = getContext()
  if (!ctx) return

  const start = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const env = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, start)

  env.gain.setValueAtTime(0, start)
  env.gain.linearRampToValueAtTime(gain, start + 0.01)
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  osc.connect(env)
  env.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration)
}

/** 鈴 - suara lonceng kecil, jawaban benar */
export function playCorrect() {
  tone({ freq: 880, duration: 0.5, type: 'sine', gain: 0.07 })
  tone({ freq: 1320, duration: 0.4, type: 'sine', gain: 0.04, delay: 0.05 })
}

/** ツメ - suara pendek rendah, jawaban salah */
export function playWrong() {
  tone({ freq: 220, duration: 0.18, type: 'triangle', gain: 0.06 })
}

/** 完 - suara naik tiga nada, selesai */
export function playComplete() {
  tone({ freq: 660, duration: 0.2, type: 'sine', gain: 0.06 })
  tone({ freq: 880, duration: 0.2, type: 'sine', gain: 0.06, delay: 0.12 })
  tone({ freq: 1100, duration: 0.4, type: 'sine', gain: 0.07, delay: 0.24 })
}

/** 板 - suara ketukan kayu, ganti halaman */
export function playTap() {
  tone({ freq: 1500, duration: 0.05, type: 'square', gain: 0.015 })
}