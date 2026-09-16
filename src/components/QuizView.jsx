import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { shuffleArray } from '../utils/helper.js'

export default function QuizView({ data, module, onComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [options, setOptions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [score, setScore] = useState(0)

  const current = data[questionIndex]

  useEffect(() => {
    generateQuestion()
  }, [questionIndex])

  const generateQuestion = () => {
    const correct = data[questionIndex]
    const wrong = data.filter((d) => d.id !== correct.id)
    const shuffledWrong = shuffleArray(wrong).slice(0, 3)
    const allOptions = shuffleArray([correct, ...shuffledWrong])
    setOptions(allOptions)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  const handleAnswer = (option) => {
    if (selectedAnswer) return

    setSelectedAnswer(option)
    const correct = option.id === current.id
    setIsCorrect(correct)

    if (correct) {
      setScore((prev) => prev + 1)
    }

    setTimeout(() => {
      if (questionIndex + 1 < data.length) {
        setQuestionIndex((prev) => prev + 1)
      } else {
        if (score + (correct ? 1 : 0) >= data.length * 0.8) {
          onComplete()
        }
      }
    }, 1500)
  }

  const handleRestart = () => {
    setQuestionIndex(0)
    setScore(0)
    generateQuestion()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between text-sm text-zen-text mb-6">
          <span>Soal {questionIndex + 1} / {data.length}</span>
          <span>Skor: {score}</span>
        </div>

        <div className="bg-zen-bg border border-zen-border rounded-xl p-8 mb-6 text-center">
          <div className="text-4xl font-medium text-zen-text-dark mb-4">
            {module === 'grammar' ? current.pattern : current.character}
          </div>
          <div className="text-sm text-zen-text/60">Pilih arti yang benar</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option) => {
            const isSelected = selectedAnswer?.id === option.id
            const isOptionCorrect = option.id === current.id
            const showResult = selectedAnswer && (isSelected || isOptionCorrect)

            let buttonClass = 'p-4 rounded-lg font-medium transition-all text-left '
            if (isSelected && isCorrect === true) {
              buttonClass += 'bg-zen-success text-white border-2 border-zen-success'
            } else if (isSelected && isCorrect === false) {
              buttonClass += 'bg-zen-error text-white border-2 border-zen-error'
            } else if (showResult && isOptionCorrect) {
              buttonClass += 'bg-zen-success text-white border-2 border-zen-success'
            } else {
              buttonClass += 'bg-zen-bg border-2 border-zen-border text-zen-text-dark hover:border-zen-accent'
            }

            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={buttonClass}
              >
                {option.meaning}
              </button>
            )
          })}
        </div>

        {isCorrect !== null && (
          <div className={`mt-6 flex items-center gap-2 font-medium ${isCorrect ? 'text-zen-text-dark' : 'text-zen-text'}`}>
            {isCorrect ? (
              <>
                <CheckCircle2 size={20} className="text-green-600" />
                <span>Benar! 🎉</span>
              </>
            ) : (
              <>
                <XCircle size={20} className="text-red-600" />
                <span>Salah. Jawaban: {current.meaning}</span>
              </>
            )}
          </div>
        )}
      </div>

      {questionIndex + 1 === data.length && selectedAnswer && (
        <div className="mt-8 text-center">
          <div className="text-2xl font-semibold text-zen-text-dark mb-4">Selesai!</div>
          <div className="text-lg text-zen-text mb-6">
            Skor akhir: <strong className="text-zen-accent-dark">{score}</strong> / {data.length}
          </div>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-zen-accent text-white rounded-lg font-medium hover:bg-zen-accent-dark transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  )
}
