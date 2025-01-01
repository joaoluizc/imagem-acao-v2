import { Teams } from "../../client/src/types";
import { Player } from "../types";

export function chooseNextPlayer(teams: Teams, currentPlayer: Player): Player {
    const nextTeamPlaying = currentPlayer.team === "A" ? "B" : "A";
    const currentTeam = teams[nextTeamPlaying];
    const nextPlayerIndex = currentTeam.findIndex(
        (player) => player.id === currentPlayer.id
    );

    let nextPlayer;
    if (nextPlayerIndex === currentTeam.length - 1) {
        nextPlayer = currentTeam[0];
    } else {
        nextPlayer = currentTeam[nextPlayerIndex + 1];
    }

    return nextPlayer;
}