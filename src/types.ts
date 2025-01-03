export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    roomCreated: (data: { roomCode: string; playerId: string; isHost: boolean, players: Player[], hostId: string }) => void;
    error: (data: { message: string }) => void;
    roomJoined: (data: { roomCode: string; playerId: string, isHost: boolean }) => void;
    playerJoined: (data: { players: Player[]}) => void;
    gameStarted: (data: RoomState) => void;
    playerLeft: (data: { players: Player[], hostId: string }) => void;
    newHost: (data: { isHost: boolean }) => void;
    newRound: (data: GameState) => void;
    roundFinished: (data: RoomState) => void;
    reconnectionFailed: (data: { message: string }) => void;
    reconnectionSuccess: (data: { gameState: GameState, players: Player[], isHost: boolean }) => void;
  }
  
  export interface ClientToServerEvents {
    createRoom: (data: { playerName: string }) => void;
    joinRoom: (data: { roomCode: string; playerName: string }) => void;
    startGame: (data: { roomCode: string }) => void;
    roundEstablished: (data: { roomCode: string, categoryRoll: string }) => void;
    finishRound: (data: { roomCode: string, whoGuessed: "A" | "B" | "NO" }) => void;
    startNewRound: (data: { roomCode: string }) => void;
    attemptReconnection: (data: { playerId: string, roomCode: string }) => void;
  }
  
  export interface InterServerEvents {
    ping: () => void;
  }
  
  export interface SocketData {
    name: string;
    age: number;
  }

export interface Player {
    id: string;
    name: string;
    team?: string;
}

export interface PlayingWord {
  word: string;
  category: string;
  points: number;
}

export interface PlayedWord extends PlayingWord {
  playerId: string;
  team: string;
  guessed?: boolean;
}

export interface GameState {
    status: "waiting" | "playing";
    currentPhase: "waiting" | "choosing" | "acting" | "guessing" | "scoring";
    currentPlayer: string;
    currentWord: PlayingWord;
    currentCategory: "P" | "A" | "D" | "L" | "O" | "";
    roundDuration: 60,
}

export interface RoomState {
    code: string;
    players: Player[];
    teams: {
        A: Player[];
        B: Player[];
    };
    hostId: string;
    gameState: GameState;
    playedWords?: PlayedWord[];
}

export interface Scores {

}