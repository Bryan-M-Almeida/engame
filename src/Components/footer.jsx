export default function Footer() {
  return (
    <footer
      className="text-center text-[10px] text-indigo-400 font-mono tracking-wider pt-4 border-t border-indigo-900/40"
      id="main-footer"
    >
      ENGAME • DESAFÍO EN INGENIERÍA DE SISTEMAS © {new Date().getFullYear()}
    </footer>
  );
}
