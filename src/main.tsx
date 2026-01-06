import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import { NavigationProvider } from "./NavContext";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <NavigationProvider>
        <App />
      </NavigationProvider>
  </StrictMode>
);
