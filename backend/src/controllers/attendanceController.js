const attendanceService = require('../services/attendanceService');

const attendanceController = {
  /**
   * Endpoint for students to mark their attendance
   * @route POST /api/attendance/mark
   */
  markAttendance: async (req, res) => {
    try {
      // req.user is set by the JWT protect middleware
      const studentId = req.user.id;
      
      const result = await attendanceService.markAttendance(studentId, req);

      if (!result.success) {
        // Return appropriate HTTP status code based on the validation error
        return res.status(result.statusCode || 400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Attendance Controller Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  /**
   * Endpoint for faculty to get attendance for a specific session
   * @route GET /api/attendance/session/:id
   */
  getSessionAttendance: async (req, res) => {
    try {
      const { id } = req.params;
      const records = await attendanceService.getSessionAttendance(id);
      
      res.status(200).json({
        success: true,
        data: records,
        present_count: records.length
      });
    } catch (error) {
      console.error('Attendance Controller Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },

  /**
   * Endpoint for students to view their own attendance history
   * @route GET /api/attendance/student
   */
  getStudentAttendance: async (req, res) => {
    try {
      const studentId = req.user.id;
      const records = await attendanceService.getStudentAttendance(studentId);
      
      res.status(200).json({
        success: true,
        data: records
      });
    } catch (error) {
      console.error('Attendance Controller Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};

module.exports = attendanceController;
