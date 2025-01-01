import { ReactNode } from "react";
import { UserRound } from "lucide-react";
import { useRoomState } from "@/providers/useRoomState";
import { Button } from "@/components/ui/button";

function GameBoardHeader({ children }: { children: ReactNode }) {
  const { roomState } = useRoomState();
  const { playerId, players } = roomState;

  return (
    <div>
      <div
        className={
          "top-0 left-0 w-full bg-white shadow-md grid grid-cols-3 h-16 bg-muted"
        }
      >
        <div id="user-info" className="grid-span-1 flex items-center m-2">
          <UserRound className={"p-1.5"} size={32} />
          {players.find((player) => player.id === playerId)?.name}
        </div>
        <div
          id="scoreboard-btn"
          className="grid-span-1 flex justify-center items-center"
        >
          <Button>Scoreboard</Button>
        </div>
        <div
          id="user-team"
          className="grid-span-1 flex justify-end items-center m-2"
        >
          <span className="mr-1.5">
            {`Team ${players.find((player) => player.id === playerId)?.team}`}
          </span>
        </div>
      </div>
      <div className="h-[calc(100vh-4rem)] bg-background">{children}</div>
    </div>
  );
}

export default GameBoardHeader;
