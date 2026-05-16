import { useState, useEffect, useCallback } from 'react';
import useSocket from './useSocket';
import { SOCKET_EVENTS } from '../utils/socketEvents';
import toast from 'react-hot-toast';

/**
 * Custom hook to listen for session lifecycle events (e.g. Session Ended)
 * @param {Object} initialSession - Initial session state
 */
const useLiveSession = (initialSession = null) => {
  const { socket, isConnected } = useSocket();
  const [liveSession, setLiveSession] = useState(initialSession);

  useEffect(() => {
    setLiveSession(initialSession);
  }, [initialSession]);

  const handleSessionStarted = useCallback((payload) => {
    // Update active session locally without page refresh
    setLiveSession(payload.session);
    toast.success('Live Session Started!');
  }, []);

  const handleSessionEnded = useCallback((payload) => {
    if (liveSession && payload.sessionId === liveSession.id) {
      setLiveSession((prev) => ({
        ...prev,
        is_active: false,
        end_time: new Date().toISOString()
      }));
      toast.error('Session has been ended by the system.');
    }
  }, [liveSession]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.on(SOCKET_EVENTS.SESSION_STARTED, handleSessionStarted);
      socket.on(SOCKET_EVENTS.SESSION_ENDED, handleSessionEnded);

      return () => {
        socket.off(SOCKET_EVENTS.SESSION_STARTED, handleSessionStarted);
        socket.off(SOCKET_EVENTS.SESSION_ENDED, handleSessionEnded);
      };
    }
  }, [socket, isConnected, handleSessionStarted, handleSessionEnded]);

  return { liveSession };
};

export default useLiveSession;
