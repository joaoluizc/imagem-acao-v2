import "./App.css";
import { useRoomState } from "./providers/useRoomState";
import WaitingRoom from "./pages/WaitingRoom";
import GameBoard from "./pages/GameBoard/!GameBoard";

function App() {
  const { roomState } = useRoomState();
  return (
    <div>
      {roomState.gameState.status === "waiting" && <WaitingRoom />}
      {roomState.gameState.status === "playing" && <GameBoard />}
    </div>
  );
}

export default App;
