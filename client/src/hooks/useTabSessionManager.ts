import { useEffect, useState } from "react";

const useTabSessionManager = () => {
  const [hasAnotherSession, setHasAnotherSession] = useState(false);
  useEffect(() => {
    const channel = new BroadcastChannel('game-session');
    let timeoutId: NodeJS.Timeout;

    // Handle incoming messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ping') {
        channel.postMessage({ type: 'pong' });
      }
      if (event.data.type === 'pong') {
        setHasAnotherSession(true);
        clearTimeout(timeoutId);
      }
    };

    // Check for other sessions
    const checkSessions = () => {
      setHasAnotherSession(false);
      channel.postMessage({ type: 'ping' });
      
      timeoutId = setTimeout(() => {
        setHasAnotherSession(false);
      }, 1000); // Wait 1s for responses
    };

    channel.addEventListener('message', handleMessage);
    checkSessions();

    // Cleanup
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
      clearTimeout(timeoutId);
    };
  }, [setHasAnotherSession]);

  return hasAnotherSession;
};

export default useTabSessionManager;