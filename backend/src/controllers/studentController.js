const studentService = require('../services/studentService');
const { validationResult } = require('express-validator');

const studentController = {
  getProfile: async (req, res) => {
    try {
      const profile = await studentService.getProfile(req.user.id);
      res.json({ success: true, data: profile });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateProfile: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const updatedProfile = await studentService.updateProfile(req.user.id, req.body);
      res.json({ success: true, data: updatedProfile, message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  registerDevice: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const device = await studentService.registerDevice(req.user.id, req.body);
      res.status(201).json({ success: true, data: device, message: 'Device registered successfully' });
    } catch (error) {
      const statusCode = error.message === 'Device already registered' ? 409 : 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  },

  getDevices: async (req, res) => {
    try {
      const devices = await studentService.getDevices(req.user.id);
      res.json({ success: true, data: devices });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteDevice: async (req, res) => {
    try {
      await studentService.deleteDevice(req.params.id, req.user.id);
      res.json({ success: true, message: 'Device removed successfully' });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  getAttendance: async (req, res) => {
    try {
      const history = await studentService.getAttendanceHistory(req.user.id);
      res.json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getAttendancePercentage: async (req, res) => {
    try {
      const stats = await studentService.getAttendancePercentage(req.user.id);
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getDashboard: async (req, res) => {
    try {
      const dashboardData = await studentService.getDashboardData(req.user.id);
      res.json({ success: true, data: dashboardData });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = studentController;
