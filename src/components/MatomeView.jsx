import { useState } from 'react'
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { shuffleArray } from '../utils/helper.js'

function buildMatomeQuestions(data) {
  return data.map((item) => {
    const correctMeaning = item.meaning
    const wrongOptions = data
      .filter((d) => d.id !== item.id)
      .map((d) => d.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    // grammar uses pattern, kanji/vocab use character
    const displayText = item.pattern || item.character
    const sentence = item.example?.sentence || item.example?.word || `その日は ${displayText} でした。`
    const romaji = item.example?.romaji || item.romaji
    const underlined = displayText.split('（')[0]

    return {
      id: item.id,
      sentence,
      romaji,
      underlined,
      correctMeaning,
      explanation: `Arti dari kata/pola tersebut adalah "${correctMeaning}".`,
      options: shuffleArray([correctMeaning, ...wrongOptions]),
    }
  })
}

export default function MatomeView({ data, onComplete }) {
  const [questions, setQuestions] = useState(() => shuffleArray(buildMatomeQuestions(data)))
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [dataRef, setDataRef] = useState(data)

  if (dataRef !== data) {
    setDataRef(data)
    setQuestions(shuffleArray(buildMatomeQuestions(data)))
    setIsFinished(false)
    setQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  const current = questions[questionIndex]

  const handleAnswer = (option) => {
    if (selectedAnswer || !current) return

    setSelectedAnswer(option)
    const correct = option === current.correctMeaning
    setIsCorrect(correct)

    if (correct) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
    } else {
      setIsFinished(true)
      if (score >= questions.length * 0.7) {
        onComplete()
      }
    }
  }

  const handleRestart = () => {
    setQuestions(shuffleArray(buildMatomeQuestions(data)))
    setQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setIsFinished(false)
  }

  if (!current) return <div className="text-center py-12 text-zen-text">Memuat soal...</div>

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="text-3xl font-bold text-zen-text-dark mb-2">Matome Selesai! 🎉</div>
        <div className="text-base text-zen-text mb-6">
          Skor akhir Anda: <strong className="text-zen-accent text-xl">{score}</strong> / {questions.length}
        </div>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 bg-zen-accent text-white rounded-2xl font-bold hover:bg-zen-accent-dark transition-all shadow-lg"
        >
          <RotateCcw size={18} />
          Ulangi Latihan
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <div className="w-full flex items-center justify-between text-xs font-semibold text-zen-text uppercase tracking-wider mb-4 px-2">
        <span>Soal {questionIndex + 1} / {questions.length}</span>
        <span>Skor Benar: {score}</span>
      </div>

      <div className="w-full bg-zen-card border-2 border-zen-border rounded-3xl p-6 md:p-8 mb-6 shadow-xl">
        <div className="text-xs uppercase tracking-wider text-zen-accent font-bold mb-2">
          Pilih arti yang tepat untuk kata yang digarisbawahi
        </div>
        <div className="text-2xl md:text-3xl font-bold text-zen-text-dark my-4 leading-relaxed">
          {current.sentence.includes(current.underlined) ? (
            <span>
              {current.sentence.split(current.underlined)[0]}
              <span className="underline decoration-zen-accent decoration-4 underline-offset-8 mx-1 text-zen-accent-dark">{current.underlined}</span>
              {current.sentence.split(current.underlined)[1]}
            </span>
          ) : (
            <span>
              {current.sentence} <span className="underline decoration-zen-accent decoration-4 underline-offset-8 mx-1 text-zen-accent-dark">{current.underlined}</span>
            </span>
          )}
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {current.options.map((option, idx) => {
          const isSelected = selectedAnswer === option
          const isOptionCorrect = option === current.correctMeaning
          const showResult = selectedAnswer && (isSelected || isOptionCorrect)

          let btnClass = 'p-4 rounded-2xl font-bold text-left transition-all border-2 '
          if (isSelected && isCorrect === true) {
            btnClass += 'bg-green-100 border-green-500 text-green-800 shadow-md'
          } else if (isSelected && isCorrect === false) {
            btnClass += 'bg-red-100 border-red-500 text-red-800 shadow-md'
          } else if (showResult && isOptionCorrect) {
            btnClass += 'bg-green-100 border-green-500 text-green-800 shadow-md'
          } else {
            btnClass += 'bg-zen-card border-zen-border text-zen-text-dark hover:border-zen-accent hover:shadow-md'
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={btnClass}
            >
              {option}
            </button>
          )
        })}
      </div>

      {selectedAnswer && (
        <div className="w-full bg-zen-card border-2 border-zen-border rounded-2xl p-5 mb-6 animate-fadeIn shadow-lg space-y-3">
          <div className="flex items-center gap-2 font-bold text-base">
            {isCorrect ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 size={22} />
                <span>Benar! 🎉</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle size={22} />
                <span>Kurang tepat.</span>
              </div>
            )}
          </div>
          <div className="text-sm text-zen-text-dark font-medium leading-relaxed">
            <strong>Pembahasan:</strong> {current.explanation}
          </div>
          <div className="text-xs text-zen-text bg-zen-bg p-3 rounded-xl border border-zen-border space-y-1">
            <div className="font-bold text-zen-text-dark">Contoh Kalimat / Kata:</div>
            <div className="italic">{current.sentence}</div>
            <div className="text-zen-text/70">{current.romaji}</div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-zen-accent text-white rounded-xl font-bold hover:bg-zen-accent-dark transition-all shadow-md"
            >
              <span>Lanjut</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
