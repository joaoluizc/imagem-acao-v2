import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoomState } from "../providers/useRoomState.js";
import { RoomStateContextType } from "../providers/room-state-provider.js";
import { useSocket } from "@/providers/useSocket.js";
import RestoreSavedSession from "@/components/RestoreSavedSession.js";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp.js";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Copy } from "lucide-react";

const WaitingRoom = () => {
  const { socket } = useSocket();
  const [playerName, setPlayerName] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const { roomState, setRoomState, error, setError }: RoomStateContextType =
    useRoomState();

  useEffect(() => {
    socket.on(
      "roomCreated",
      ({ roomCode, isHost, players, playerId, hostId }) => {
        setInRoom(true);
        setRoomState((prev) => ({
          ...prev,
          playerId,
          isHost,
          code: roomCode,
          players,
          hostId,
        }));
        setError("");
      }
    );

    socket.on("roomJoined", ({ roomCode, isHost, playerId }) => {
      setInRoom(true);
      setRoomState((prev) => ({
        ...prev,
        isHost,
        code: roomCode,
        playerId,
      }));
      setError("");
    });
  });

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    socket.emit("createRoom", { playerName });
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!roomState.code.trim()) {
      setError("Please enter a room code");
      return;
    }
    socket.emit("joinRoom", {
      roomCode: roomState.code.toUpperCase(),
      playerName,
    });
  };

  if (inRoom) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            Room:{" "}
            {`${roomState.code.slice(0, 3)}-${roomState.code.slice(3, 6)}`}
            <Copy
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(roomState.code);
              }}
              aria-label="Copy room code"
              size="16"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Players:</h3>
              <ul className="mt-2 space-y-1">
                {roomState.players.map((player) => (
                  <li key={player.id}>{`${player.name}`}</li>
                ))}
              </ul>
            </div>
            {roomState.isHost && (
              <Button
                className="w-full"
                onClick={() =>
                  socket.emit("startGame", { roomCode: roomState.code })
                }
              >
                Start Game
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <RestoreSavedSession />
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Join or Create a Room</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Your Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-4">
              <Button className="flex-1" onClick={handleCreateRoom}>
                Create Room
              </Button>
              <div className="flex-1 space-y-2">
                <InputOTP
                  maxLength={6}
                  value={roomState.code}
                  onChange={(code) =>
                    setRoomState((prev) => ({
                      ...prev,
                      code: code.toUpperCase(),
                    }))
                  }
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button className="w-full" onClick={handleJoinRoom}>
                  Join Room
                </Button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingRoom;
