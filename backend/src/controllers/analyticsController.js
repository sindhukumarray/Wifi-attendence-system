const analyticsService = require('../services/analyticsService');
const { sendSuccess, sendError } = require('../utils/response');

const analyticsController = {
  /**
   * Get Student Analytics Dashboard
   */
  getStudentDashboard: async (req, res) => {
    try {
      // Use student_id from the authenticated user token
      const studentId = req.user.id;
      const stats = await analyticsService.getStudentStats(studentId);
      
      return sendSuccess(res, 'Student analytics fetched successfully', stats);
    } catch (error) {
      console.error('[Analytics Controller Error]:', error);
      return sendError(res, error.message, 500);
    }
  },

  /**
   * Get Faculty Analytics Dashboard
   */
  getFacultyDashboard: async (req, res) => {
    try {
      const facultyId = req.user.id;
      const stats = await analyticsService.getFacultyStats(facultyId);
      
      return sendSuccess(res, 'Faculty analytics fetched successfully', stats);
    } catch (error) {
      console.error('[Analytics Controller Error]:', error);
      return sendError(res, error.message, 500);
    }
  },
  
  /**
   * Get Admin Analytics Dashboard
   */
  getAdminDashboard: async (req, res) => {
    try {
      const stats = await analyticsService.getAdminStats();
      return sendSuccess(res, 'Admin analytics fetched successfully', stats);
    } catch (error) {
      console.error('[Analytics Controller Error]:', error);
      return sendError(res, error.message, 500);
    }
  },

  /**
   * Export Attendance Report (CSV)
   */
  exportAttendanceReport: async (req, res) => {
    try {
      const studentId = req.user.id;
      const stats = await analyticsService.getStudentStats(studentId);
      
      // Simple CSV transformation
      let csv = 'Subject Name,Attendance Percentage\n';
      stats.subjects.forEach(s => {
        csv += `${s.name},${s.value}%\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=attendance_report_${Date.now()}.csv`);
      return res.send(csv);
    } catch (error) {
      return sendError(res, 'Failed to generate report', 500);
    }
  }
};

module.exports = analyticsController;
