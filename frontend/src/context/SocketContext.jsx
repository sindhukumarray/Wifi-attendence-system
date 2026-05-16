import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../sockets/socketService';
import useAuth from '../hooks/useAuth';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const s = socketService.connect();
      setSocket(s);

      s.on('connect', () => setIsConnected(true));
      s.on('disconnect', () => setIsConnected(false));

      return () => {
        socketService.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, socketService }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
