export function saveProgress(level, module, unitId, data) {
  const key = `manabu_progress_${level}_${module}_${unitId}`
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadProgress(level, module, unitId) {
  const key = `manabu_progress_${level}_${module}_${unitId}`
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

export function resetLevelProgress(level) {
  const keys = Object.keys(localStorage)
  keys.forEach((key) => {
    if (key.startsWith(`manabu_progress_${level}`)) {
      localStorage.removeItem(key)
    }
  })
}

export function loadBookmarks() {
  const data = localStorage.getItem('manabu_bookmarks')
  return data ? JSON.parse(data) : []
}

export function saveBookmarks(bookmarks) {
  localStorage.setItem('manabu_bookmarks', JSON.stringify(bookmarks))
}

export function speak(text) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve()
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onend = resolve
    utterance.onerror = resolve

    window.speechSynthesis.speak(utterance)
  })
}

export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function calculateProgress(completed, total) {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function getLevelColor(level) {
  const colors = {
    kana: { bg: 'bg-[#d4e8e2]', text: 'text-[#2d6e5a]', border: 'border-[#a3d1c2]' },
    n5: { bg: 'bg-[#e3f1e5]', text: 'text-[#3b7a4a]', border: 'border-[#b3e2bb]' },
    n4: { bg: 'bg-[#e5ecf6]', text: 'text-[#3b5a7a]', border: 'border-[#b3cde2]' },
    n3: { bg: 'bg-[#f6ecf0]', text: 'text-[#7a3b5a]', border: 'border-[#e2b3c9]' },
    n2: { bg: 'bg-[#f6efe3]', text: 'text-[#7a5e3b]', border: 'border-[#e2cdb3]' },
    n1: { bg: 'bg-[#f0e3f6]', text: 'text-[#5e3b7a]', border: 'border-[#c9b3e2]' },
  }
  return colors[level] || colors.n5
}

export function getModuleColor(module) {
  const colors = {
    kanji: { bg: 'bg-[#fde2e4]', text: 'text-[#7a3b3b]' },
    vocab: { bg: 'bg-[#e2f0fd]', text: 'text-[#3b5a7a]' },
    grammar: { bg: 'bg-[#f5e2fd]', text: 'text-[#5e3b7a]' },
  }
  return colors[module] || colors.kanji
}
