export function storeSessionData (playerId: string, roomCode: string) {
  console.log('storeSessionData: storing session data');
  console.log('storeSessionData: playerId:', playerId);
  console.log('storeSessionData: roomCode:', roomCode);
  const sessionData = {
    playerId,
    roomCode,
    timestamp: Date.now()
  };
  localStorage.setItem('gameSession', JSON.stringify(sessionData));
};