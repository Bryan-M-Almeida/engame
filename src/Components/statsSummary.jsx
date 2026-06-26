import { motion } from "motion/react";
import {
  Trophy,
  CheckCircle,
  Flame,
  Clock,
  BarChart2,
  RotateCcw,
} from "lucide-react";

export default function StatsSummary({
  answers,
  score,
  maxStreak,
  speedPoints,
  totalStreakBonus,
  onRestart,
}) {
  const totalCount = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracy =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // Calculate average time of correct answers
  const correctAnswers = answers.filter((a) => a.isCorrect);
  const averageTime =
    correctAnswers.length > 0
      ? (
          correctAnswers.reduce((sum, a) => sum + a.timeTaken, 0) /
          correctAnswers.length
        ).toFixed(1)
      : "0.0";

  // Determine appraisal message based on accuracy
  let appraisal = "¡Buen intento!";
  let emoji = "💪";
  let appraisalSub =
    "Sigue practicando para consolidar tus conceptos de Inglés.";

  if (accuracy >= 90) {
    appraisal = "¡Ingeniero de Nivel Leyenda!";
    emoji = "👑";
    appraisalSub =
      "Has demostrado una precisión magistral digna de un Arquitecto de Sistemas Principal.";
  } else if (accuracy >= 75) {
    appraisal = "¡Excelente Desempeño!";
    emoji = "🚀";
    appraisalSub =
      "¡Muy sólido! Tienes un excelente dominio del básico de inglés.";
  } else if (accuracy >= 50) {
    appraisal = "¡Desafío Superado!";
    emoji = "🎯";
    appraisalSub =
      "Buen trabajo. Estás en el camino correcto para convertirte en un experto técnico.";
  }

  return (
    <div className="w-full space-y-6" id="stats-summary-container">
      {/* Appraisal Header Card */}
      <motion.div
        className="bg-indigo-950 border-4 border-indigo-800 rounded-3xl p-6 text-center space-y-2 relative overflow-hidden shadow-[0_8px_0_0_#1e1b4b]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-yellow-400" />
        <span className="text-4xl block" id="appraisal-emoji">
          {emoji}
        </span>
        <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">
          {appraisal}
        </h3>
        <p className="text-sm text-indigo-200 max-w-lg mx-auto leading-relaxed font-semibold">
          {appraisalSub}
        </p>
      </motion.div>

      {/* Grid containing metrics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="metrics-grid">
        {/* Total Score */}
        <motion.div
          className="bg-indigo-950 border-2 border-indigo-800 rounded-2xl p-4 flex flex-col justify-between shadow-[0_4px_0_0_#1e1b4b]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 text-yellow-300 mb-2">
            <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
            <span className="text-xs font-black font-mono tracking-wider uppercase">
              Puntaje Total
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-white font-sans">
              {score}
            </span>
            <span className="text-[10px] text-indigo-300 font-bold block">
              puntos logrados
            </span>
          </div>
        </motion.div>

        {/* Accuracy */}
        <motion.div
          className="bg-indigo-950 border-2 border-indigo-800 rounded-2xl p-4 flex flex-col justify-between shadow-[0_4px_0_0_#1e1b4b]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-black font-mono tracking-wider uppercase">
              Precisión
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-white font-sans">
              {accuracy}%
            </span>
            <span className="text-[10px] text-indigo-300 font-bold block">
              {correctCount} de {totalCount} aciertos
            </span>
          </div>
        </motion.div>

        {/* Best Streak */}
        <motion.div
          className="bg-indigo-950 border-2 border-indigo-800 rounded-2xl p-4 flex flex-col justify-between shadow-[0_4px_0_0_#1e1b4b]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Flame className="w-4 h-4 fill-orange-500/20" />
            <span className="text-xs font-black font-mono tracking-wider uppercase">
              Mejor Racha
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-white font-sans">
              {maxStreak}
            </span>
            <span className="text-[10px] text-indigo-300 font-bold block">
              correctas seguidas
            </span>
          </div>
        </motion.div>

        {/* Speed */}
        <motion.div
          className="bg-indigo-950 border-2 border-indigo-800 rounded-2xl p-4 flex flex-col justify-between shadow-[0_4px_0_0_#1e1b4b]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 text-sky-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-black font-mono tracking-wider uppercase">
              Velocidad
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-white font-sans">
              {averageTime}s
            </span>
            <span className="text-[10px] text-indigo-300 font-bold block">
              promedio por acierto
            </span>
          </div>
        </motion.div>
      </div>

      {/* Point breakdown & Timeline logs */}
      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-5"
        id="breakdown-grid"
      >
        {/* Points breakdown */}
        <div
          className="md:col-span-5 bg-indigo-950 border-2 border-indigo-800 rounded-2xl p-5 shadow-[0_4px_0_0_#1e1b4b]"
          id="points-breakdown-card"
        >
          <h4 className="text-sm font-black text-white mb-4 flex items-center gap-1.5 font-display uppercase tracking-tight">
            <BarChart2 className="w-4 h-4 text-yellow-400" />
            Desglose de Puntos
          </h4>
          <div className="space-y-3.5 text-xs text-indigo-200 font-mono font-bold">
            <div className="flex justify-between border-b border-indigo-900 pb-2">
              <span className="text-indigo-400">Puntos Base (Velocidad):</span>
              <span className="text-emerald-400 font-extrabold">
                {speedPoints} pts
              </span>
            </div>
            <div className="flex justify-between border-b border-indigo-900 pb-2">
              <span className="text-indigo-400">Bonos por Racha:</span>
              <span className="text-yellow-400 font-extrabold">
                +{totalStreakBonus} pts
              </span>
            </div>
            <div className="flex justify-between font-black text-sm text-white pt-1">
              <span>Total acumulado:</span>
              <span className="text-yellow-400 text-lg font-black">
                {score} pts
              </span>
            </div>
          </div>
        </div>

        {/* Detailed results history */}
        <div
          className="md:col-span-7 bg-indigo-950 border-2 border-indigo-800 rounded-2xl p-5 shadow-[0_4px_0_0_#1e1b4b]"
          id="questions-summary-card"
        >
          <h4 className="text-sm font-black text-white mb-3 font-display uppercase tracking-tight">
            Historial de Respuestas
          </h4>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1"
            id="detailed-question-timeline"
          >
            {answers.map((ans, idx) => (
              <div
                key={ans.questionId}
                className="flex items-center justify-between p-2 rounded-xl bg-indigo-900/60 border border-indigo-850 text-xs text-indigo-200"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                      ans.isCorrect
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-500 text-white"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate max-w-[120px] font-bold font-sans">
                    Q-{ans.questionId.split("_")[1] || ans.questionId}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono font-bold">
                  {ans.isCorrect ? (
                    <span className="text-[10px] text-emerald-400">
                      {ans.scoreEarned + ans.streakBonusEarned} pts (
                      {ans.timeTaken}s)
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-400">
                      Incorrecta
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onRestart}
          className="bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 px-8 rounded-2xl border-b-8 border-emerald-700 hover:border-emerald-600 shadow-lg active:translate-y-1 active:border-b-4 transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-sm"
          id="leaderboard-restart-btn"
        >
          <RotateCcw className="w-5 h-5 text-white" />
          <span>Volver a Jugar</span>
        </button>
      </div>
    </div>
  );
}
