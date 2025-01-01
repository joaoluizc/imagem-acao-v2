import { useContext } from "react";
import { RoomStateContext, RoomStateContextType } from "./room-state-provider";

export const useRoomState = (): RoomStateContextType => {
  const context = useContext(RoomStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
