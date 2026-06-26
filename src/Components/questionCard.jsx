import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import {
  Timer,
  Award,
  Flame,
  CheckCircle,
  XCircle,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { playSound } from "../utils/audio";

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelected,
  onNextQuestion,
  score,
  streak,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  // Restart timer and answer state whenever question changes
  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
    setTimeLeft(15);
  }, [question.id]);

  // Timer logic
  useEffect(() => {
    if (hasAnswered) return;

    if (timeLeft === 0) {
      setHasAnswered(true);
      setSelectedOption(-1); // indicating timeout
      onAnswerSelected(-1, 0); // score is 0
      playSound("incorrect");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
      if (timeLeft <= 5 && timeLeft > 1) {
        playSound("tick");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, hasAnswered, onAnswerSelected]);

  const handleSelectOption = (index) => {
    if (hasAnswered) return;

    setHasAnswered(true);
    setSelectedOption(index);

    const isCorrect = index === question.correctAnswerIndex;
    let timeTaken = 15 - timeLeft;
    if (timeTaken <= 0) timeTaken = 1; // safety

    if (isCorrect) {
      playSound("correct");
      onAnswerSelected(index, timeLeft);
    } else {
      playSound("incorrect");
      onAnswerSelected(index, 0);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Fácil":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "Medio":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "Difícil":
        return "bg-rose-500/10 border-rose-500/30 text-rose-400";
      default:
        return "bg-indigo-500/10 border-indigo-500/30 text-indigo-400";
    }
  };

  const timerPercentage = (timeLeft / 15) * 100;
  const isTimeLow = timeLeft <= 5;

  return (
    <div
      className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-2 md:p-4"
      id={`question-card-${question.id}`}
    >
      {/* Header Info Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-indigo-900 border-2 border-indigo-800 rounded-2xl px-5 py-3 text-sm text-indigo-200 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-mono font-bold">Pregunta:</span>
          <span className="font-black text-white text-base font-sans">
            {questionNumber} / {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-black rounded-full border-2 uppercase ${getDifficultyColor(question.difficulty)}`}
          >
            {question.difficulty}
          </span>
          <span className="px-3 py-1 text-xs font-black rounded-full border-2 border-indigo-700 bg-indigo-950 text-yellow-300">
            {question.category}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-sm">
          <div className="flex items-center gap-1.5 text-yellow-300 font-bold">
            <Award className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
            <span>
              Puntos: <strong className="text-white text-base">{score}</strong>
            </span>
          </div>

          {streak > 0 && (
            <motion.div
              className="flex items-center gap-1 text-orange-400 font-bold"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Flame className="w-5 h-5 fill-orange-500" />
              <span>
                Racha: <strong className="text-white">+{streak}</strong>
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-indigo-900 border-4 border-indigo-800 rounded-[32px] p-6 md:p-8 shadow-xl relative overflow-hidden shadow-[0_12px_0_0_#1e1b4b]">
        {/* Animated Timer Progress Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-2 bg-indigo-950"
          id="timer-bar-bg"
        >
          <motion.div
            className={`h-full transition-all duration-300 ${isTimeLow ? "bg-rose-500" : "bg-yellow-400"}`}
            style={{ width: `${timerPercentage}%` }}
            id="timer-bar-progress"
          />
        </div>

        {/* Timer stats */}
        <div className="flex justify-between items-center mb-6 pt-2">
          <span className="text-xs text-indigo-300 font-mono font-bold uppercase tracking-wider">
            English Tech Trivia
          </span>
          <div
            className={`flex items-center gap-1.5 font-mono text-base font-black ${isTimeLow ? "text-rose-400 animate-pulse" : "text-yellow-300"}`}
          >
            <Timer
              className={`w-5 h-5 ${isTimeLow ? "text-rose-400" : "text-yellow-400"}`}
            />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-lg md:text-2xl font-black text-white leading-relaxed mb-6 font-display">
          {question.questionText}
        </h2>

        {/* Options */}
        <div className="space-y-4" id="options-container">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === question.correctAnswerIndex;
            const revealIncorrect = hasAnswered && isSelected && !isCorrect;

            let btnStyle =
              "bg-indigo-950 border-2 border-indigo-800 hover:bg-indigo-800 text-indigo-100 hover:border-indigo-700 shadow-[0_4px_0_0_#1e1b4b] active:translate-y-0.5 active:shadow-[0_2px_0_0_#1e1b4b]";
            let stateIcon = null;

            if (hasAnswered) {
              if (isCorrect) {
                btnStyle =
                  "bg-emerald-500 border-2 border-emerald-600 text-white shadow-[0_4px_0_0_#047857]";
                stateIcon = (
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                );
              } else if (revealIncorrect) {
                btnStyle =
                  "bg-rose-500 border-2 border-rose-600 text-white shadow-[0_4px_0_0_#be123c]";
                stateIcon = (
                  <XCircle className="w-5 h-5 text-white flex-shrink-0" />
                );
              } else {
                btnStyle =
                  "bg-indigo-950/30 border-2 border-indigo-950/80 text-indigo-500 cursor-not-allowed opacity-40";
              }
            }

            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleSelectOption(index)}
                disabled={hasAnswered}
                className={`w-full flex items-center justify-between gap-3 border rounded-2xl p-4 text-left font-sans font-extrabold text-sm sm:text-base transition duration-150 ${btnStyle} ${!hasAnswered ? "cursor-pointer" : ""}`}
                id={`option-btn-${index}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black font-mono border-2 ${
                      isSelected
                        ? "bg-yellow-400 border-yellow-500 text-indigo-950"
                        : "bg-indigo-900 border-indigo-800 text-indigo-300"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
                {stateIcon}
              </motion.button>
            );
          })}
        </div>

        {/* Timeout Indicator */}
        {hasAnswered && selectedOption === -1 && (
          <div className="mt-4 p-3 bg-rose-500 border-2 border-rose-600 rounded-2xl text-center text-white font-black text-sm shadow-[0_4px_0_0_#be123c]">
            ⏰ ¡Se agotó el tiempo de respuesta!
          </div>
        )}

        {/* Concept Explanation / Next Button */}
        <AnimatePresence>
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 border-t-2 border-indigo-800 pt-5 space-y-4"
              id="explanation-panel"
            >
              <div className="bg-indigo-950/80 border-2 border-indigo-800 rounded-2xl p-4 flex gap-3 shadow-inner">
                <HelpCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-black font-mono text-yellow-300 uppercase tracking-wider">
                    Explicación Técnica (Español)
                  </span>
                  <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onNextQuestion}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 px-8 rounded-2xl border-b-8 border-emerald-700 hover:border-emerald-600 shadow-lg active:translate-y-1 active:border-b-4 transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs md:text-sm"
                  id="next-question-btn"
                >
                  <span>Siguiente Pregunta</span>
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
