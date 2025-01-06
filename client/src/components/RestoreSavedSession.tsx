import { useRoomState } from "@/providers/useRoomState";
import { getSessionData } from "@/utils/getSessionData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useSocket } from "@/providers/useSocket";

function RestoreSavedSession() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const sessionData = getSessionData();
  const { socket } = useSocket();
  const { setIsReconnecting, hasLeftWaitingRoom } = useRoomState();

  useEffect(() => {
    if (!hasLeftWaitingRoom && sessionData) {
      socket.emit("doesRoomExist", { roomCode: sessionData.roomCode });
      socket.on("roomExists", ({ exists }) => {
        if (!exists) {
          console.log("Room does not exist, removing session data");
          localStorage.removeItem("gameSession");
          return;
        } else {
          setDialogIsOpen(true);
        }
      });
    }

    return () => {
      socket.off("roomExists");
    };
  }, [hasLeftWaitingRoom, sessionData]);

  if (
    hasLeftWaitingRoom &&
    (!sessionData || !sessionData.playerId || !sessionData.roomCode)
  ) {
    console.log("No session data found");
    return null;
  }

  const reconnectToGame = () => {
    console.log("reconnectToGame: getting session data from local storage");
    setIsReconnecting(true);

    const sessionData = getSessionData();
    if (!sessionData || !sessionData.playerId || !sessionData.roomCode) {
      setIsReconnecting(false);
      return;
    }

    console.log("reconnectToGame: attempting reconnection");
    // Check if session is still valid (within last hour)
    if (Date.now() - sessionData.timestamp > 3600000) {
      localStorage.removeItem("gameSession");
      setIsReconnecting(false);
      return;
    }

    socket.emit("attemptReconnection", {
      playerId: sessionData.playerId,
      roomCode: sessionData.roomCode,
    });
  };

  const handleReconnect = () => {
    console.log("Reconnecting to game");
    reconnectToGame();
    setDialogIsOpen(false);
  };

  const handleStartNewGame = () => {
    localStorage.removeItem("gameSession");
    setDialogIsOpen(false);
  };

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reconnect to game</DialogTitle>
          <DialogDescription>
            You have a saved session. Would you like to reconnect?
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => handleReconnect()}>Reconnect</Button>
        <Button onClick={() => handleStartNewGame()}>Start new game</Button>
      </DialogContent>
    </Dialog>
  );
}

export default RestoreSavedSession;
