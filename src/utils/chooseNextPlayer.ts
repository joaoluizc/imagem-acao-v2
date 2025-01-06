import { Player, RoomState } from "../types";

export function chooseNextPlayer(room: RoomState, maintainTeam: boolean = false): Player {
    const currentPlayer = room.players.find((player) => player.id === room.gameState.currentPlayer);
    console.log(`Current player: ${currentPlayer!.name}`);
    const lastPlayer = room.players.find((player) => player.id === room.gameState.lastPlayer);
    console.log(`Last player: ${lastPlayer?.name}`);

    let nextTeamPlaying;
    if (maintainTeam) {
        nextTeamPlaying = currentPlayer!.team === "A" ? "A" : "B";
    } else {
        console.log("Maintain team is false. Choosing the next team to play.");
        nextTeamPlaying = currentPlayer!.team === "A" ? "B" : "A";
        console.log(`Current team playing: ${currentPlayer!.team}`);
        console.log(`Next team to play: ${nextTeamPlaying}`);
    }

    if (lastPlayer === undefined) {
        console.log("No last player found. Choosing the first player in the next team.");
        return room.teams[nextTeamPlaying][0];
    }
    
    const nextTeam = room.teams[nextTeamPlaying];
    const lastPlayerIndex = nextTeam.findIndex(
        (player) => player.id === lastPlayer?.id
    );

    let nextPlayer;
    console.log(`Current player: ${currentPlayer!.name}, Last player: ${lastPlayer!.name}`);
    console.log(`Next team playing: ${nextTeamPlaying}`);
    console.log(`Last player index in next team: ${lastPlayerIndex}`);

    if (lastPlayerIndex === nextTeam.length - 1 || lastPlayerIndex === -1) {
        nextPlayer = nextTeam[0];
        console.log(`Last player was the last in the team. Next player is the first in the team: ${nextPlayer.name}`);
    } else {
        nextPlayer = nextTeam[lastPlayerIndex + 1];
        console.log(`Next player is the one after the last player in the team: ${nextPlayer.name}`);
    }

    if (!nextPlayer.isConnected) {
        const newRoom = {
            ...room,
            gameState: {
                ...room.gameState,
                lastPlayer: nextPlayer.id,
            },
        };
        return chooseNextPlayer(newRoom, true);
    }

    return nextPlayer;
}