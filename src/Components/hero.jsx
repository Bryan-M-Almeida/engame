import { QRCodeSVG } from "qrcode.react";

export default function Hero() {
  return (
    <>
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-3 mt-5 rounded-xl">
        <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-8">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600">
              <span className="text-2xl font-bold text-white">E</span>
            </div>

            <h1 className="text-3xl font-bold text-white">
              Únete a la partida
            </h1>

            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Escanea el código QR con tu teléfono para ingresar rápidamente a
              la sala de{" "}
              <span className="text-violet-400 font-medium">ENGAME</span>.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="rounded-2xl bg-white p-5 shadow-lg">
              <QRCodeSVG
                value="https://engame.vercel.app/#lobby"
                size={220}
                includeMargin
              />
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-zinc-800 p-4">
            <p className="text-center text-xs uppercase tracking-wider text-zinc-500">
              O visita
            </p>

            <a
              href="https://engame.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-center font-semibold text-violet-400 hover:text-violet-300 transition"
            >
              engame.vercel.app
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-500">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            Esperando a los jugadores...
          </div>
        </div>
      </div>
    </>
  );
}
