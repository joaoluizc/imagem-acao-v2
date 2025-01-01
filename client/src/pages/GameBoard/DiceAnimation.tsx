import React, { useState, useEffect } from "react";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

const DiceAnimation: React.FC = () => {
  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]; // Replace with your actual icons or component names
  const [currentFace, setCurrentFace] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFace((prevFace) => (prevFace + 1) % diceIcons.length); // Cycle through dice faces
    }, 200);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="dice-animation">
      {React.createElement(diceIcons[currentFace])}{" "}
      {/* Render the current dice face */}
    </div>
  );
};

export default DiceAnimation;
