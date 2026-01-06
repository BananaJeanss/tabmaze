import { useEffect, useState } from "react";

import Settings from "./components/Settings";
import { BrowserRouter, Route, Routes } from "react-router";
import Level1 from "./pages";
import Level2 from "./pages/level2";
import Level3 from "./pages/level3";
import Level4 from "./pages/level4";
import Page404 from "./pages/404";
import LevelLayout from "./pages/LevelLayout";
import Level5 from "./pages/level5";
import Level6 from "./pages/level6";
import Infinite from "./pages/infinite";

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <BrowserRouter>
      {isSettingsOpen && <Settings setSettingsOpen={setIsSettingsOpen}/>}

      <Routes>
        <Route element={<LevelLayout />}>
          <Route path="/" element={<Level1 />} />
          <Route path="/level2" element={<Level2 />} />
          <Route path="/level3" element={<Level3 />} />
          <Route path="/level4" element={<Level4 />} />
          <Route path="/level5" element={<Level5/>} />
          <Route path="/level6" element={<Level6/>} />
          <Route path="/infinite" element={<Infinite/>} />
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}
