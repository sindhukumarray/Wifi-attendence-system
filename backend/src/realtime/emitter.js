const { getIO } = require('../sockets/socketManager');

const realtimeEmitter = {
  /**
   * Broadcasts a student check-in event to the specific session room
   * @param {number} sessionId 
   * @param {Object} studentData 
   */
  notifyAttendanceMarked: (sessionId, studentData) => {
    try {
      const io = getIO();
      const room = `session_${sessionId}`;
      
      // Standardized Payload Envelope
      const payload = {
        event: 'attendance:marked',
        timestamp: new Date().toISOString(),
        data: {
          id: studentData.id,
          name: studentData.name,
          roll_no: studentData.roll_no,
          time: new Date(studentData.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Present'
        }
      };

      io.to(room).emit('attendance:marked', payload);
      console.log(`📡 Broadcasted attendance:marked to ${room}`);
    } catch (error) {
      console.error('[Realtime Emitter Error]:', error.message);
    }
  },

  /**
   * Notifies all participants when a session is ended by faculty
   */
  notifySessionEnded: (sessionId) => {
    try {
      const io = getIO();
      const room = `session_${sessionId}`;
      io.to(room).emit('session:ended', { sessionId, timestamp: new Date() });
    } catch (error) {
      console.error('[Realtime Emitter Error]:', error.message);
    }
  }
};

module.exports = realtimeEmitter;
