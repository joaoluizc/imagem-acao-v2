export function storeSessionData (playerId: string, roomCode: string) {
  const sessionData = {
    playerId,
    roomCode,
    timestamp: Date.now()
  };
  localStorage.setItem('gameSession', JSON.stringify(sessionData));
};