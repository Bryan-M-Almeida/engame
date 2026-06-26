import { Volume2, VolumeX } from "lucide-react";

export default function Header({ onRestart, muted, onToggleMute }) {
  return (
    <header
      className="h-20 bg-indigo-900 border-b-4 border-indigo-800 sticky top-0 z-50 px-6 shadow-xl flex items-center"
      id="main-header"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={onRestart}
          className="flex items-center gap-3 group cursor-pointer text-left bg-transparent border-none outline-none"
          id="header-brand-logo"
        >
          <div className="bg-yellow-400 text-indigo-950 font-black text-xl md:text-2xl px-4 py-1 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transform -rotate-2 group-hover:rotate-0 transition-transform duration-150">
            ENGAME
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] text-yellow-300 font-bold uppercase tracking-widest block font-mono">
              QUIZ GAME
            </span>
            <span className="text-xs text-indigo-200 font-medium block">
              SISTEMAS & INGENIERÍA
            </span>
          </div>
        </button>

        <div className="flex items-center gap-4" id="header-actions">
          <span className="text-xs bg-indigo-950 border-2 border-indigo-700 text-indigo-300 px-3 py-1 rounded-full font-mono hidden sm:inline-block font-bold">
            UI: Español | Quiz: English
          </span>
          <button
            onClick={onToggleMute}
            className="p-2 bg-indigo-950 hover:bg-indigo-800 border-2 border-indigo-700 rounded-xl text-slate-300 hover:text-white transition shadow-md cursor-pointer"
            title={muted ? "Activar sonido" : "Silenciar"}
            id="header-mute-btn"
          >
            {muted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
