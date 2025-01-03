import "./App.css";
import { useRoomState } from "./providers/useRoomState";
import WaitingRoom from "./pages/WaitingRoom";
import GameBoard from "./pages/GameBoard/!GameBoard";
import { useReconnection } from "./hooks/useReconnection";

function App() {
  useReconnection();
  const { roomState } = useRoomState();
  return (
    <div className="app-container">
      {roomState.gameState.status === "waiting" && <WaitingRoom />}
      {roomState.gameState.status === "playing" && <GameBoard />}
    </div>
  );
}

export default App;
