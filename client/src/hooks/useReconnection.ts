import { useEffect } from 'react';
import { useRoomState } from '@/providers/useRoomState';
import { useSocket } from '@/providers/useSocket';
import { getSessionData } from '@/utils/getSessionData';

export function useReconnection() {
    const { socket } = useSocket();
    const { setIsReconnecting, hasLeftWaitingRoom } = useRoomState();
    
    const reconnectToGame = () => {
      if(!hasLeftWaitingRoom) return;
      console.log('reconnectToGame: getting session data from local storage');
      setIsReconnecting(true);

      const sessionData = getSessionData();
      if (!sessionData || !sessionData.playerId || !sessionData.roomCode) {
          setIsReconnecting(false);
          return
      };

      console.log('reconnectToGame: attempting reconnection');
      // Check if session is still valid (within last hour)
      if (Date.now() - sessionData.timestamp > 3600000) {
        localStorage.removeItem('gameSession');
        setIsReconnecting(false);
        return;
      }

      socket.emit('attemptReconnection', {
        playerId: sessionData.playerId,
        roomCode: sessionData.roomCode
      });
    };

    useEffect(() => {  
      window.addEventListener('focus', () => reconnectToGame());
  
      return () => {
        // window.removeEventListener('focus', reconnectToGame);
      };
    }, [socket]);

    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          reconnectToGame();
        }
      };
    
      window.addEventListener('visibilitychange', handleVisibilityChange);
      // return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    useEffect(() => {
      const handlePageShow = (event: PageTransitionEvent) => {
        if (event.persisted) {
          reconnectToGame();
        }
      };
    
      window.addEventListener('pageshow', handlePageShow);
      // return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);
  }