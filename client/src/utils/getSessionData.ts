export const getSessionData = () => {
    const sessionDataString = localStorage.getItem('gameSession');

    if (!sessionDataString) return null;

    const sessionData = JSON.parse(sessionDataString);

    if (!sessionData) {
        localStorage.removeItem('gameSession');
        console.error('Invalid session data found in local storage');
        return null;
    }

    return sessionData;
}