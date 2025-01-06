export interface Player {
  id: string;
  name: string;
  team?: string;
  isConnected: boolean;
}

export interface Teams {
  A: Player[];
  B: Player[];
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
  currentWord: {
      word: string;
      category: string;
      points: number;
  };
  currentCategory: "P" | "A" | "D" | "L" | "O" | "";
  scores: object,
  roundDuration: 60,
}

export interface RoomState {
  playerId: string;
  code: string;
  players: Player[];
  teams: Teams;
  hostId: string;
  gameState: GameState;
  playedWords?: PlayedWord[];
  isHost: boolean;
}