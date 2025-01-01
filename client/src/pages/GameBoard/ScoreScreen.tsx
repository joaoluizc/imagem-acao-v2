import { Button } from "@/components/ui/button";
import { useRoomState } from "@/providers/useRoomState";
import { socket } from "@/socket";
import calculateScores from "@/utils/calculateScores";

function ScoreScreen() {
  const { roomState } = useRoomState();
  const { playedWords, gameState, playerId } = roomState;
  const { currentPlayer } = gameState;

  let pointScored;
  let lastPlayedWord;
  let scores;

  if (playedWords && playedWords.length === 0) {
    pointScored = 0;
  } else if (playedWords) {
    lastPlayedWord = playedWords[playedWords.length - 1];
    pointScored = lastPlayedWord.guessed ? lastPlayedWord.points : 0;
    scores = calculateScores(playedWords);
  }

  const handleNextRound = () => {
    socket.emit("startNewRound", { roomCode: roomState.code });
  };

  if (pointScored === 0) {
    return (
      <div>
        <h1 className="font-bold text-xl">No one scored!</h1>
        <p>Do better next time 😊</p>
        {playerId === currentPlayer && (
          <Button onClick={handleNextRound}>New Round</Button>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <h1>Team {lastPlayedWord!.team} scored!</h1>
        <div className="flex flex-col">
          <p>Current points per team</p>
          <div className="flex gap-4 w-full justify-center">
            <p>
              <span className="font-bold">Team A: </span>
              {scores!.A}
            </p>
            <p>
              <span className="font-bold">Team B: </span>
              {scores!.B}
            </p>
          </div>
        </div>
        {playerId === currentPlayer && (
          <Button onClick={handleNextRound}>New Round</Button>
        )}
      </div>
    );
  }
}

export default ScoreScreen;
