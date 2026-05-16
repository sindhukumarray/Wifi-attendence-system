import { useSocketContext } from '../context/SocketContext';

/**
 * A simple wrapper hook to access the raw socket connection.
 * Useful for checking connection state or manually emitting custom events.
 */
const useSocket = () => {
  const { socket, isConnected, socketService } = useSocketContext();
  
  return { socket, isConnected, socketService };
};

export default useSocket;
