import { useState, useEffect, useCallback } from 'react';
import useSocket from './useSocket';
import { SOCKET_EVENTS } from '../utils/socketEvents';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage the real-time stream of attendance updates.
 * @param {number} sessionId - The ID of the session room to listen to.
 * @param {Array} initialData - The initial state (e.g., fetched via REST API).
 */
const useRealtimeAttendance = (sessionId, initialData = []) => {
  const { socket, isConnected } = useSocket();
  const [attendanceList, setAttendanceList] = useState(initialData);
  const [totalCount, setTotalCount] = useState(initialData.length);

  // Sync state if initialData is fetched asynchronously
  useEffect(() => {
    setAttendanceList(initialData);
    setTotalCount(initialData.length);
  }, [initialData]);

  const handleAttendanceUpdated = useCallback((payload) => {
    // Expected payload: { sessionId, newStudents: [ { id, student_name, roll_no, recorded_at } ], totalCount }
    
    // Only process if it belongs to the current session
    if (payload.sessionId !== sessionId) return;

    setAttendanceList((prev) => {
      const newEntries = payload.newStudents || [];
      
      // Filter out any duplicates that might already exist in the list
      const uniqueNewEntries = newEntries.filter(
        (newStudent) => !prev.some((existing) => existing.id === newStudent.id)
      );

      // Flash success toast for newly added students
      if (uniqueNewEntries.length > 0) {
        toast.success(`${uniqueNewEntries.length} new student(s) marked present!`);
      }

      // Unshift places the newest records at the top of the feed
      return [...uniqueNewEntries, ...prev];
    });

    if (payload.totalCount !== undefined) {
      setTotalCount(payload.totalCount);
    }
  }, [sessionId]);

  useEffect(() => {
    if (socket && isConnected && sessionId) {
      // Register listener
      socket.on(SOCKET_EVENTS.ATTENDANCE_UPDATED, handleAttendanceUpdated);

      // Cleanup listener on unmount or session change to prevent memory leaks
      return () => {
        socket.off(SOCKET_EVENTS.ATTENDANCE_UPDATED, handleAttendanceUpdated);
      };
    }
  }, [socket, isConnected, sessionId, handleAttendanceUpdated]);

  return { attendanceList, totalCount };
};

export default useRealtimeAttendance;
