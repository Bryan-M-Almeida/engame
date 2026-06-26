import { useState } from "react";
import Header from "./Components/header";
import Footer from "./Components/footer";

function App() {
  return (
    <>
      <Header />
      <main className="flex-grow flex items-center justify-center py-6 md:py-10 px-4"></main>
      <Footer />
    </>
  );
}

export default App;
