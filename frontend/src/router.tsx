import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AnimatePresence } from "framer-motion"; // Assuming 'framer-motion' is the library where 'AnimatePresence' is defined
import MainPage from "./pages/MainPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => (
  <AnimatePresence mode="wait">
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<MainPage />} />
    </Routes>
  </AnimatePresence>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
