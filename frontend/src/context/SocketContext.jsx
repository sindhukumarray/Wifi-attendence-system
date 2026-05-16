import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../sockets/socketService';
import useAuth from '../hooks/useAuth';
import { SOCKET_EVENTS } from '../utils/socketEvents';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if the user is fully authenticated
    if (isAuthenticated) {
      const socketInstance = socketService.connect();
      
      if (socketInstance) {
        setSocket(socketInstance);
        setIsConnected(socketInstance.connected);

        // Bind connection state listeners
        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socketInstance.on(SOCKET_EVENTS.CONNECT, onConnect);
        socketInstance.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);

        // Cleanup on unmount or authentication loss
        return () => {
          socketInstance.off(SOCKET_EVENTS.CONNECT, onConnect);
          socketInstance.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
          socketService.disconnect();
          setSocket(null);
          setIsConnected(false);
        };
      }
    } else {
      // If user logs out, disconnect socket
      socketService.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, socketService }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

// Alias for backward compatibility
export const useSocket = useSocketContext;

