import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GameStateProvider } from "./providers/room-state-provider";
import { SocketProvider } from "./providers/socket-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <GameStateProvider>
        <App />
      </GameStateProvider>
    </SocketProvider>
  </StrictMode>
);
