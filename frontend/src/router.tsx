import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AnimatePresence } from "framer-motion"; // Assuming 'framer-motion' is the library where 'AnimatePresence' is defined
import MainPage from "./pages/MainPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PanelPage from "./pages/PanelPage";
import LogoutPage from "./pages/LogoutPage";
import DevPage from "./pages/DevPage";
import eventEmitter from "./language/event";
import { useRerender } from "./components/hooks/rerender";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const App = () => {
  const rerender = useRerender();

  useEffect(() => {
    eventEmitter.on("rerender", rerender);

    return () => {
      eventEmitter.off("rerender", rerender);
    };
  }, [rerender]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/panel" element={<PanelPage />} />
        {import.meta.env.DEV && <Route path="/dev" element={<DevPage />} />}
      </Routes>
    </AnimatePresence>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
