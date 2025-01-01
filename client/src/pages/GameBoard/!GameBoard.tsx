import { useRoomState } from "@/providers/useRoomState";
import WaitingScreen from "./WaitingScreen";
import CategoryDiceScreen from "./CategoryDiceScreen";
import ActingScreen from "./ActingScreen";
import GuessingScreen from "./GuessingScreen";
import ScoreScreen from "./ScoreScreen";
import GameBoardHeader from "./GameBoardHeader";
import CategoryDiceSpectator from "./CategoryDiceSpectator";

// Screens for different phases
const GameScreens = {
  waiting: WaitingScreen,
  choosing: {
    actor: CategoryDiceScreen,
    spectator: CategoryDiceSpectator,
  },
  acting: ActingScreen,
  guessing: GuessingScreen,
  scoring: ScoreScreen,
} as const;

function GameBoard() {
  const { roomState } = useRoomState();
  const { gameState, playerId } = roomState;
  const { currentPlayer, currentPhase } = gameState;
  const isMyTurn = currentPlayer === playerId;

  // Get the correct screen component
  const getCurrentScreen = () => {
    if (gameState.status === "waiting") {
      return GameScreens.waiting;
    }

    // Show different screens based on whether it's player's turn
    if (isMyTurn) {
      switch (currentPhase) {
        case "choosing":
          return GameScreens.choosing.actor;
        case "acting":
          return GameScreens.acting;
        case "scoring":
          return GameScreens.scoring;
        default:
          return GameScreens.guessing;
      }
    } else {
      switch (currentPhase) {
        case "choosing":
          return GameScreens.choosing.spectator;
        case "acting":
          return GameScreens.guessing;
        case "scoring":
          return GameScreens.scoring;
        default:
          return GameScreens.guessing;
      }
    }
  };

  const ScreenComponent = getCurrentScreen();

  return (
    <div>
      <GameBoardHeader>
        <ScreenComponent />
      </GameBoardHeader>
    </div>
  );
}

export default GameBoard;
