import { Button } from "@/components/ui/button";
import { useRoomState } from "@/providers/useRoomState";
import { socket } from "@/socket";
import { CircleX } from "lucide-react";

function ActingScreen() {
  const { roomState } = useRoomState();
  const { gameState } = roomState;
  const { currentCategory, currentWord } = gameState;

  const handleWhoGuessed = (whoGuessed: "A" | "B" | "NO") => {
    console.log(whoGuessed);
    socket.emit("finishRound", {
      roomCode: roomState.code,
      whoGuessed,
    });
  };

  return (
    <div className="flex flex-col gap-4 justify-between h-full py-8">
      <div className="flex flex-col">
        <h1>Act it up!</h1>
        <p>Category: {currentCategory}</p>
        <p>Word: {currentWord.word}</p>
        <p>
          {currentWord.points} {currentWord.points > 1 ? "points" : "point"}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-bold text-xl">Who guessed?</p>
        <div className="flex gap-4 w-full justify-center">
          <Button
            className="w-32"
            variant="destructive"
            onClick={() => handleWhoGuessed("NO")}
          >
            <CircleX />
            No one
          </Button>
          <Button className="w-32" onClick={() => handleWhoGuessed("A")}>
            Team A
          </Button>
          <Button className="w-32" onClick={() => handleWhoGuessed("B")}>
            Team B
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ActingScreen;
