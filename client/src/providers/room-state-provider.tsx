import { RoomState } from "@/types";
import { createContext, useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { storeSessionData } from "@/utils/storeSessionData";

export type RoomStateContextType = {
  roomState: RoomState;
  error: string;
  setRoomState: React.Dispatch<React.SetStateAction<RoomState>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export const RoomStateContext = createContext<RoomStateContextType | undefined>(
  undefined
);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();
  const [error, setError] = useState("");
  const [roomState, setRoomState] = useState<RoomState>({
    playerId: "",
    code: "",
    players: [],
    teams: {
      A: [],
      B: [],
    },
    hostId: "",
    isHost: false,
    gameState: {
      status: "waiting",
      currentPhase: "waiting",
      currentPlayer: "",
      currentWord: {
        word: "",
        category: "",
        points: 0,
      },
      currentCategory: "",
      scores: {},
      roundDuration: 60,
    },
  });

  useEffect(() => {
    socket.on("playerJoined", ({ players }) => {
      setRoomState((prev) => ({
        ...prev,
        players,
      }));
    });

    socket.on("playerLeft", ({ players, hostId }) => {
      setRoomState((prev) => ({
        ...prev,
        hostId,
        players,
      }));
    });

    socket.on("newHost", ({ isHost }) => {
      setRoomState((prev) => ({
        ...prev,
        isHost,
      }));
    });

    socket.on("gameStarted", (roomStateData) => {
      setRoomState((prev) => {
        storeSessionData(prev.playerId, roomStateData.code);
        console.log("gameStarted: ", JSON.stringify(roomStateData));
        console.log("gameStarted prev: ", JSON.stringify(prev));
        return {
          ...prev,
          ...roomStateData,
        };
      });
    });

    socket.on("newRound", (gameState) => {
      setRoomState((prev) => ({
        ...prev,
        gameState,
      }));
    });

    socket.on("roundFinished", (roomState) => {
      setRoomState((prev) => ({
        ...prev,
        ...roomState,
      }));
    });

    socket.on("error", ({ message }) => {
      setError(message);
      console.log("Error:", message);
    });

    socket.on("reconnectionSuccess", (roomState) => {
      setRoomState((prev) => ({
        ...prev,
        ...roomState,
      }));
    });

    // return () => {
    //   socket.off("roomCreated");
    //   socket.off("roomJoined");
    //   socket.off("playerJoined");
    //   socket.off("error");
    //   socket.disconnect();
    // };
  }, []);

  const value = {
    roomState,
    error,
    setRoomState,
    setError,
  };

  return (
    <RoomStateContext.Provider value={value}>
      {children}
    </RoomStateContext.Provider>
  );
}
