import { useRoomState } from "@/providers/useRoomState";

function GuessingScreen() {
  const { roomState } = useRoomState();
  const { gameState, players } = roomState;
  const { currentPlayer, currentCategory } = gameState;
  return (
    <div>
      <h1>Guess the word!</h1>
      <p>
        {players.find((player) => player.id === currentPlayer)?.name} is acting.
      </p>
      <p>Category: {currentCategory}</p>
    </div>
  );
}

export default GuessingScreen;
