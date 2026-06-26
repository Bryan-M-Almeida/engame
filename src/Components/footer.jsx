export default function Footer() {
  return (
    <footer
      id="main-footer"
      className="mt-8 border-t border-indigo-900/40 pt-6 text-center text-xs text-slate-400"
    >
      <div className="flex flex-col md:flex-row justify-around items-center gap-3">
        <img
          src="https://innovasol.com.bo/wp-content/uploads/2022/06/logo_upds.jpg"
          alt="UPDS"
          className="h-12 w-auto rounded bg-white p-1"
        />

        <div>
          <h3 className="font-semibold text-indigo-300 text-sm">
            ENGAME - Technical English Quiz
          </h3>

          <p>
            Developed by{" "}
            <span className="font-medium text-white">
              Bryan Maciel de Almeida
            </span>
          </p>

          <p>
            Subject: <span className="text-indigo-300">Technical English</span>
          </p>

          <p>
            <span className="text-indigo-300">
              UPDS - Universidad Privada Domingo Savio
            </span>
          </p>
        </div>

        <a
          href="https://github.com/Bryan-M-Almeida"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 transition"
        >
          github.com/Bryan-M-Almeida
        </a>

        <p className="text-[11px] text-slate-500">
          © {new Date().getFullYear()} ENGAME. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
