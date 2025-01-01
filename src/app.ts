
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Server as SocketIOServer } from "socket.io";
import { customAlphabet } from "nanoid";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, Player, RoomState, PlayedWord } from "./types";
import { categoryIsValid } from "./utils/categoryIsValid";
import { whoGuessedIsValid } from "./utils/whoGuessedIsValid";
import { categories } from "./data/categories";
import { chooseNextPlayer } from "./utils/chooseNextPlayer";

const app = express();
const server = createServer(app);
const io: SocketIOServer<
ClientToServerEvents,
ServerToClientEvents,
InterServerEvents,
SocketData
> = new Server(server);

// Room management
const rooms: Map<string, RoomState> = new Map();

// Generate a unique 6-character room code
function generateRoomCode() {
  const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);
  return nanoid().toUpperCase();
}

// Create a new room state
function createRoomState(hostId: string): RoomState {
  return {
    code: generateRoomCode(),
    players: [] as Player[],
    teams: {
      A: [],
      B: [],
    },
    hostId,
    playedWords: [],
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
      roundDuration: 60,
    },
  };
}

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);
  // Create a new room
  socket.on("createRoom", ({ playerName }) => {
    const roomState = createRoomState(socket.id);
    const player = { id: socket.id, name: playerName, team: "A" };

    roomState.players.push(player);
    rooms.set(roomState.code, roomState);

    socket.join(roomState.code);
    socket.emit("roomCreated", {
      roomCode: roomState.code,
      playerId: socket.id,
      isHost: true,
      players: roomState.players,
      hostId: roomState.hostId,
    });
  });

  // Join an existing room
  socket.on("joinRoom", ({ roomCode, playerName }) => {
    const room = rooms.get(roomCode);

    console.log("Joining room:", roomCode);

    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    if (room.gameState.status !== "waiting") {
      socket.emit("error", { message: "Game already in progress" });
      return;
    }

    const player = { id: socket.id, name: playerName };
    room.players.push(player);

    socket.join(roomCode);
    socket.emit("roomJoined", {
      roomCode,
      playerId: socket.id,
      isHost: false,
    });

    // Notify all players in the room of the new player
    io.to(roomCode).emit("playerJoined", {
      players: room.players,
    });
  });

  // Start game in room
  socket.on("startGame", ({ roomCode }) => {
    const room = rooms.get(roomCode);

    if (!room || room.hostId !== socket.id) {
      socket.emit("error", { message: "Not authorized to start game" });
      return;
    }

    // Assign teams to players
    room.players.forEach((player) => {
      const randomizedTeam = Math.random() < 0.5 ? "A" : "B";
      console.log(`Assigning team for player ${player.name} (${player.id}). Randomized team: ${randomizedTeam}`);
      
      if (room.teams[randomizedTeam].length >= room.players.length / 2) {
        const otherTeam = randomizedTeam === "A" ? "B" : "A";
        room.teams[otherTeam].push(player);
        player.team = otherTeam;
        console.log(`Team ${randomizedTeam} is full. Assigning player ${player.name} (${player.id}) to team ${otherTeam}`);
      } else {
        room.teams[randomizedTeam].push(player);
        player.team = randomizedTeam;
        console.log(`Assigning player ${player.name} (${player.id}) to team ${randomizedTeam}`);
      }
    });

    console.log("Teams:", room.teams);
    room.players.forEach((player) => {
      console.log(player.name, player.team);
    });

    //prepare for first round
    room.gameState.currentPlayer = room.players[Math.floor(Math.random() * room.players.length)].id;
    room.gameState.status = "playing";
    room.gameState.currentPhase = "choosing";

    io.to(roomCode).emit("gameStarted", room);
  });

  socket.on("roundEstablished", ({ roomCode, categoryRoll }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    if (!categoryIsValid(categoryRoll)) {
      socket.emit("error", { message: "Invalid category" });
      return;
    }

    const currentCategory = categoryRoll as "A" | "P" | "D" | "L" | "O";
    const sortedWord = categories[currentCategory][Math.floor(Math.random() * categories[currentCategory].length)];
    
    const playedWord: PlayedWord = {
      ...sortedWord,
      playerId: room.gameState.currentPlayer,
      team: room.players.find((p) => p.id === room.gameState.currentPlayer)?.team || "spooky",
    };
    room.playedWords?.push(playedWord);
    
    room.gameState.currentCategory = currentCategory;
    room.gameState.currentPhase = "acting";
    room.gameState.currentWord = sortedWord;

    io.to(roomCode).emit("newRound", room.gameState);
  });
  
  socket.on("finishRound", ({ roomCode, whoGuessed }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    let lastPlayedWord;
    try {
      lastPlayedWord = room.playedWords?.[room.playedWords.length - 1];
      if (!lastPlayedWord) throw new Error("No words played yet");
    } catch {
      socket.emit("error", { message: "No words played yet" });
      return;
    }
    
    if (whoGuessedIsValid(whoGuessed)) {
      switch(whoGuessed) {
        case "A":
            lastPlayedWord!.team = "A";
            lastPlayedWord!.guessed = true;
            break;
        case "B":
            lastPlayedWord!.team = "B";
            lastPlayedWord!.guessed = true;
            break;
        case "NO":
            lastPlayedWord!.guessed = false;
            break;
    }
  }

    room.gameState.currentPhase = "scoring";
    io.to(roomCode).emit("roundFinished", room);
  });

  socket.on("startNewRound", ({ roomCode }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    room.gameState.status = "playing";
    room.gameState.currentPhase = "choosing";
    room.gameState.currentPlayer = chooseNextPlayer(room.teams, room.players.find((p) => p.id === room.gameState.currentPlayer)!).id;
    room.gameState.currentCategory = "";
    room.gameState.currentWord = {
      word: "",
      category: "",
      points: 0,
    };

    io.to(roomCode).emit("newRound", room.gameState);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    // Find and clean up any rooms where this socket was a player
    for (const [code, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex((p: Player) => p.id === socket.id);

      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);

        if (room.players.length === 0) {
          // Remove empty rooms
          rooms.delete(code);
        } else if (socket.id === room.hostId) {
          // Assign new host if the host left
          room.hostId = room.players[0].id;
          io.to(code).emit("newHost", { hostId: room.hostId });
        }

        io.to(code).emit("playerLeft", {
          players: room.players,
        });
      }
    }
  });

  socket.onAny((eventName, ...args) => {
    console.log(eventName); // 'hello'
    console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
  });
  
  socket.onAnyOutgoing((eventName, ...args) => {
    console.log(eventName); // 'hello'
    console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
  });
});

// Clean up inactive rooms periodically
setInterval(() => {
  for (const [code, room] of rooms.entries()) {
    if (room.players.length === 0) {
      rooms.delete(code);
    }
  }
}, 1000 * 60 * 60); // Clean up every hour

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
