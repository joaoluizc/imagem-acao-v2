import { useEffect } from 'react';
import { useRoomState } from '@/providers/useRoomState';
import { useSocket } from '@/providers/useSocket';
import { storeSessionData } from '@/utils/storeSessionData';

export function useReconnection() {
    const { socket } = useSocket();
    const { roomState } = useRoomState();
    
    useEffect(() => {  
      // Attempt reconnection
      const reconnectToGame = () => {
        console.log('reconnectToGame: setting up listeners');
        const sessionDataString = localStorage.getItem('gameSession');
        if (!sessionDataString) return;
        const sessionData = JSON.parse(sessionDataString);
        if (!sessionData) {
            localStorage.removeItem('gameSession');
            console.error('Invalid session data found in local storage');
            return
        };
  
        console.log('reconnectToGame: attempting reconnection');
        // Check if session is still valid (within last hour)
        if (Date.now() - sessionData.timestamp > 3600000) {
          localStorage.removeItem('gameSession');
          return;
        }
  
        socket.emit('attemptReconnection', {
          playerId: sessionData.playerId,
          roomCode: sessionData.roomCode
        });
      };

      const handleDisconnect = () => {
        storeSessionData(roomState.playerId, roomState.code);
      };
  
      window.addEventListener('focus', reconnectToGame);
      socket.on('connect', reconnectToGame);
      socket.on('disconnect', handleDisconnect);
  
      return () => {
        window.removeEventListener('focus', reconnectToGame);
      };
    }, [socket]);
  }