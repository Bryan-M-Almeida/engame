import { motion } from "motion/react";
import {
  Timer,
  Flame,
  Award,
  HelpCircle,
  Check,
  VolumeX,
  Volume2,
} from "lucide-react";
import { playSound } from "../Utils/audio";
import { useState } from "react";

export default function Lobby({
  onStartGame,
  bestScores = {},
  muted,
  onToggleMute,
}) {
  const [name, setName] = useState(() => {
    return localStorage.getItem("engame_player_name") || "";
  });
  const [difficulty, setDifficulty] = useState("Medio");
  const [category, setCategory] = useState("Todos");
  const [error, setError] = useState("");


  const difficulties = [
    {
      value: "Fácil",
      label: "🟢 Fácil",
      color:
        "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20",
      desc: "Vocabulario básico, Verb To Be y gramática introductoria.",
    },
    {
      value: "Medio",
      label: "🟡 Medio",
      color:
        "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20",
      desc: "Comprensión de lectura, gramática y expresiones comunes.",
    },
    {
      value: "Difícil",
      label: "🔴 Difícil",
      color:
        "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20",
      desc: "Inglés técnico, interpretación de textos y vocabulario avanzado.",
    },
  ];

  const handleStart = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Por favor, introduce tu nombre o apodo.");
      playSound("incorrect");
      return;
    }
    localStorage.setItem("engame_player_name", trimmed);
    playSound("correct");
    onStartGame({
      playerName: trimmed,
      difficulty
    });
  };

  return (
    <section
      className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6"
      id="lobby"
    >
      {/* Columna Izquierda: Configuración del Juego */}
      <motion.div
        className="md:col-span-7 bg-indigo-900 border-4 border-indigo-800 rounded-[32px] p-6 shadow-xl flex flex-col justify-between shadow-[0_12px_0_0_#1e1b4b]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-2xl font-black font-display tracking-tight text-white">
                  Crea tu Jugador
                </h1>
                <p className="text-xs text-indigo-300 font-mono">
                  ENGAME SYSTEM EXPERIENCE
                </p>
              </div>
            </div>
            <button
              onClick={onToggleMute}
              className="p-2.5 bg-indigo-950 hover:bg-indigo-800 border-2 border-indigo-700 rounded-xl text-slate-400 transition"
              title={muted ? "Activar sonido" : "Silenciar"}
              id="lobby-mute-btn"
            >
              {muted ? (
                <VolumeX className="w-5 h-5 text-rose-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
            </button>
          </div>

          <div className="space-y-5">
            {/* Input Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-black text-indigo-200 uppercase tracking-widest block font-display">
                Tu Nombre o Apodo:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setError("");
                }}
                placeholder="Ej. Ada_Lovelace"
                className="w-full bg-indigo-950 border-4 border-indigo-800 focus:border-yellow-400 focus:ring-0 rounded-2xl px-4 py-3 text-white placeholder-indigo-400 transition font-bold outline-none"
                maxLength={20}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                id="lobby-username-input"
              />
              {error && (
                <p
                  className="text-xs text-rose-400 font-bold"
                  id="lobby-name-error"
                >
                  {error}
                </p>
              )}
            </div>

            {/* Selección Dificultad */}
            <div className="space-y-2">
              <label className="text-sm font-black text-indigo-200 uppercase tracking-widest block font-display">
                Dificultad de Preguntas:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => {
                      setDifficulty(diff.value);
                      playSound("correct");
                    }}
                    className={`border-2 rounded-2xl p-3 text-center transition flex flex-col items-center justify-center cursor-pointer font-black text-sm ${
                      difficulty === diff.value
                        ? "bg-yellow-400 border-yellow-500 text-indigo-950 ring-2 ring-yellow-400/35 scale-102 shadow-[0_4px_0_0_#d97706]"
                        : "bg-indigo-950 border-indigo-800 text-indigo-300 hover:bg-indigo-800/80 shadow-[0_4px_0_0_#1e1b4b]"
                    }`}
                    id={`diff-btn-${diff.value}`}
                  >
                    <span>{diff.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-indigo-300 font-medium italic mt-1">
                {difficulties.find((d) => d.value === difficulty)?.desc}
              </p>
            </div>

          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={handleStart}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl border-b-8 border-emerald-700 hover:border-emerald-600 shadow-lg active:translate-y-1 active:border-b-4 transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer text-base uppercase tracking-wider"
            id="lobby-play-btn"
          >
            <span>¡Jugar Ahora!</span>
            <span>🎮</span>
          </button>
        </div>
      </motion.div>

      {/* Columna Derecha: Reglas y Funcionamiento (En español) */}
      <motion.div
        className="md:col-span-5 bg-indigo-900 border-4 border-indigo-800 rounded-[32px] p-6 text-indigo-100 flex flex-col justify-between shadow-[0_12px_0_0_#1e1b4b]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div>
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 font-display uppercase tracking-tight">
            <span className="text-yellow-400">🏆</span>
            ¿Cómo se juega?
          </h2>

          <div className="space-y-5 text-sm">
            <p className="text-indigo-200 leading-relaxed font-medium">
              Bienvenido a <strong className="text-yellow-400">ENGAME</strong>,
              el desafío de ingeniería definitiva. La interfaz está en{" "}
              <span className="text-yellow-300 font-bold">español</span>, pero
              las preguntas y opciones están en{" "}
              <span className="text-yellow-300 font-bold">inglés</span> para
              prepararte para el mundo real.
            </p>

            {/* Regla Tiempo */}
            <div className="flex gap-3 bg-indigo-950/40 p-3 rounded-2xl border border-indigo-800">
              <div className="mt-0.5">
                <Timer className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
                  Temporizador
                </h3>
                <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                  Tienes <strong className="text-white">15 segundos</strong> por
                  pregunta. Cuanto más rápido respondas correctamente, más
                  puntos ganas:
                </p>
                <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] font-mono text-indigo-300">
                  <div>
                    &le; 2 segundos &rarr;{" "}
                    <span className="text-yellow-300 font-bold">1000 pts</span>
                  </div>
                  <div>
                    5 segundos &rarr;{" "}
                    <span className="text-yellow-300 font-bold">800 pts</span>
                  </div>
                  <div>
                    10 segundos &rarr;{" "}
                    <span className="text-yellow-300 font-bold">500 pts</span>
                  </div>
                  <div>
                    Incorrecta &rarr;{" "}
                    <span className="text-rose-400 font-bold">0 pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regla Rachas */}
            <div className="flex gap-3 bg-indigo-950/40 p-3 rounded-2xl border border-indigo-800">
              <div className="mt-0.5">
                <Flame className="w-5 h-5 text-orange-400 flex-shrink-0 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
                  Multiplicadores y Racha
                </h3>
                <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                  Consigue aciertos consecutivos para multiplicar tus puntos
                  acumulados:
                </p>
                <div className="mt-2 space-y-1 text-[11px] font-mono text-indigo-300">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-orange-400" />
                    <span>
                      2 aciertos seguidos:{" "}
                      <strong className="text-yellow-300">+100 pts</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-orange-400" />
                    <span>
                      3 aciertos seguidos:{" "}
                      <strong className="text-yellow-300">+250 pts</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-orange-400" />
                    <span>
                      5+ aciertos seguidos:{" "}
                      <strong className="text-yellow-300">+500 pts</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="flex gap-3 bg-indigo-950/40 p-3 rounded-2xl border border-indigo-800">
              <div className="mt-0.5">
                <Award className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
                  Feedback Inmediato
                </h3>
                <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                  Recibirás una explicación del concepto técnico en{" "}
                  <strong className="text-yellow-300">español</strong> al
                  instante.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 border-t border-indigo-800/80 pt-4 flex items-center justify-between text-[11px] font-mono text-indigo-400 font-bold">
          <span>SISTEMAS & INGENIERÍA</span>
          <span>ENGAME VIBRANT © 2026</span>
        </div>
      </motion.div>
    </section>
  );
}
