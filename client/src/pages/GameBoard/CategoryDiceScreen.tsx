import { Dices } from "lucide-react";
import DiceAnimation from "./DiceAnimation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRoomState } from "@/providers/useRoomState";
import { useSocket } from "@/providers/useSocket";

function CategoryDiceScreen() {
  const { socket } = useSocket();
  const [diceScreenStage, setDiceScreenStage] = useState<
    "waiting" | "rolling" | "result"
  >("waiting");
  const [thrownCategory, setThrownCategory] = useState<string | null>(null);
  const { roomState } = useRoomState();

  const handleContinue = () => {
    console.log("Continue");
    socket.emit("roundEstablished", {
      roomCode: roomState.code,
      categoryRoll: thrownCategory,
    });
  };

  const handleThrowDice = () => {
    setDiceScreenStage("rolling");
    setTimeout(() => {
      setDiceScreenStage("result");
    }, 2000);
    const categories = ["P", "A", "D", "L", "O"];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    setThrownCategory(randomCategory);
  };

  if (diceScreenStage === "waiting") {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h1 className="font-bold text-xl">Category</h1>
        <p className="mt-0">Throw the dice to find out your category</p>
        <Button onClick={handleThrowDice}>
          <div className="animate-bounce">
            <Dices size={64} />
          </div>
        </Button>
      </div>
    );
  }

  if (diceScreenStage === "rolling") {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 h-full">
        <DiceAnimation />
        Throwing your digital dice...
      </div>
    );
  }

  if (diceScreenStage === "result") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-full">
        <h1 className="font-bold text-xl">Category</h1>
        <p className="mt-0">You got category {thrownCategory}!</p>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    );
  }
}

export default CategoryDiceScreen;
