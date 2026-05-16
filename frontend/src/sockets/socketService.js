import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from '../utils/socketEvents';
import { getAuthToken } from '../utils/tokenHelper';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  /**
   * Initializes the socket connection with JWT Authentication
   * Prevents multiple connections (Singleton pattern)
   */
  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = getAuthToken();

    if (!token) {
      console.warn('Socket connection aborted: No auth token found.');
      return null;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity, // Enterprise standard: Keep trying
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: false // We explicitly call connect()
    });

    // Explicitly open the connection
    this.socket.connect();

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('✅ Realtime Socket Connected:', this.socket.id);
    });

    this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
      console.error('❌ Socket Connection Error:', err.message);
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log('⚠️ Realtime Socket Disconnected:', reason);
      if (reason === 'io server disconnect') {
        // The disconnection was initiated by the server, reconnect manually
        this.socket.connect();
      }
    });

    return this.socket;
  }

  /**
   * Joins a specific session room to receive isolated events
   * @param {number|string} sessionId 
   */
  joinSessionRoom(sessionId) {
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.JOIN_SESSION, sessionId);
      console.log(`Joined realtime room: session_${sessionId}`);
    }
  }

  /**
   * Leaves a specific session room
   * @param {number|string} sessionId 
   */
  leaveSessionRoom(sessionId) {
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.LEAVE_SESSION, sessionId);
      console.log(`Left realtime room: session_${sessionId}`);
    }
  }

  /**
   * Disconnects the socket completely and cleans up
   */
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Socket explicitly disconnected & cleaned up.');
    }
  }

  /**
   * Get raw socket instance
   */
  getSocket() {
    return this.socket;
  }
}

// Export as a singleton
export default new SocketService();
