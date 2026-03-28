import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SpiderManHero from "./components/SpiderManHero";
import ReferenceSection from "./components/ReferenceSection";
import ReferenceDetailsSection from "./components/ReferenceDetailsSection";
import DeadpoolPosterSection from "./components/DeadpoolPosterSection";
import BottomPlaceholderSection from "./components/BottomPlaceholderSection";
import FloatingRedPlaceholder from "./components/FloatingRedPlaceholder";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import WhiteStage from "./components/WhiteStage";

function App() {
  const Home = () => (
    <>
      <SpiderManHero />
      <ReferenceSection />
      <WhiteStage>
        <FloatingRedPlaceholder />
        <ReferenceDetailsSection />
        <DeadpoolPosterSection />
        <BottomPlaceholderSection />
      </WhiteStage>
      <FloatingWhatsApp />
    </>
  );

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;