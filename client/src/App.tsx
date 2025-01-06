import "./App.css";
import { useRoomState } from "./providers/useRoomState";
import WaitingRoom from "./pages/WaitingRoom";
import GameBoard from "./pages/GameBoard/!GameBoard";
import { useReconnection } from "./hooks/useReconnection";
import useTabSessionManager from "./hooks/useTabSessionManager";

function App() {
  const { roomState, isReconnecting } = useRoomState();
  useReconnection();
  const hasAnotherSession = useTabSessionManager();

  return (
    <div className="app-container">
      <div
        className={`${isReconnecting ? "" : "hidden"} bg-black bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center`}
      >
        <div className="reconnecting-message">Reconnecting...</div>
      </div>
      <div
        className={`${hasAnotherSession ? "" : "hidden"} bg-black bg-opacity-90 text-background fixed inset-0 z-50 flex flex-col items-center justify-center`}
      >
        <h1>Game Already Open</h1>
        <p>
          This game is already running in another tab. Please close this tab and
          return to the existing game.
        </p>
      </div>
      {roomState.gameState.status === "waiting" && <WaitingRoom />}
      {roomState.gameState.status === "playing" && <GameBoard />}
    </div>
  );
}

export default App;
