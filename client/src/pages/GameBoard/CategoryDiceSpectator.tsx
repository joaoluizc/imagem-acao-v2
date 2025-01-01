import { useRoomState } from "@/providers/useRoomState";
import { Dices } from "lucide-react";

function CategoryDiceSpectator() {
  const { roomState } = useRoomState();
  const { gameState, players } = roomState;
  const { currentPlayer } = gameState;

  const playerObject = players.find((player) => player.id === currentPlayer);
  let playerName = "Actor";
  if (playerObject) {
    playerName = playerObject.name;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div>{`${playerName} is throwing the dice`}</div>
      <div className="mt-2">Waiting for dice throw...</div>
      <div className="mt-10 relative">
        <Dices className="animate-bounce" size={64} />
      </div>
    </div>
  );
}

export default CategoryDiceSpectator;
