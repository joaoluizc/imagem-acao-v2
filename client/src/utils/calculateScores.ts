import { PlayedWord } from "@/types";

function calculateScores (playedWords: PlayedWord[]) {
    const scores = {
        A: 0,
        B: 0,
    };
    
    playedWords.forEach((word) => {
        if (word.guessed && (word.team === "A" || word.team === "B")) {
            scores[word.team] += word.points;
        }
    });
    
    return scores;
}

export default calculateScores;