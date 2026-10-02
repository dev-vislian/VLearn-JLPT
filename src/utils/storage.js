/**
 * Pembacaan localStorage yang tahan error. Dipakai di beberapa context supaya
 * tidak ada implementasi safeParse yang berbeda-beda.
 */
export function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Kuota penuh atau storage diblokir - app tetap jalan tanpa persist.
  }
}

export function removeStore(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Abaikan, tidak ada yang bisa dilakukan.
  }
}

/** Batas durasi timer dalam menit. Dipakai AppContext dan ZenMode. */
export const ZEN_DURATION_LIMITS = {
  focus: { min: 1, max: 120 },
  break: { min: 1, max: 60 },
}

/** Persentase fase yang sudah berjalan, untuk lingkaran progres Enso. */
export function phasePercent(secondsLeft, totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return 0
  return 100 - (secondsLeft / totalSeconds) * 100
}