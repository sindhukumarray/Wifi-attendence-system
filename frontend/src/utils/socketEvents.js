export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  
  // Rooms
  JOIN_SESSION: 'join_session_room',
  LEAVE_SESSION: 'leave_session_room',
  
  // Session Lifecycle
  SESSION_STARTED: 'session_started',
  SESSION_ENDED: 'session_ended',
  
  // Attendance
  ATTENDANCE_UPDATED: 'attendance_updated',
  STUDENT_PRESENT: 'student_present', // Internal to backend, but good to track

  // Errors
  ERROR: 'error'
};
