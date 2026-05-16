const facultyService = require('../services/facultyService');
const Session = require('../models/Session');
const Classroom = require('../models/Classroom');
const Faculty = require('../models/Faculty');
const { validationResult } = require('express-validator');

const facultyController = {
  getDashboard: async (req, res) => {
    try {
      const data = await facultyService.getDashboardData(req.user.id);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const profile = await Faculty.findById(req.user.id);
      res.json({ success: true, data: profile });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const updated = await Faculty.update(req.user.id, req.body);
      res.json({ success: true, data: updated, message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getClassrooms: async (req, res) => {
    try {
      const rooms = await Classroom.getAll();
      res.json({ success: true, data: rooms });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getSubjects: async (req, res) => {
    try {
      const subjects = await Faculty.getSubjects(req.user.id);
      res.json({ success: true, data: subjects });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  startSession: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const session = await facultyService.startNewSession(req.user.id, req.body);
      res.status(201).json({ success: true, data: session, message: 'Session started successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  endSession: async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await Session.end(sessionId);
      res.json({ success: true, data: session, message: 'Session ended successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getActiveSession: async (req, res) => {
    try {
      const session = await Session.findActiveByFaculty(req.user.id);
      res.json({ success: true, data: session || null });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getLiveAttendance: async (req, res) => {
    try {
      const { sessionId } = req.params;
      const attendance = await facultyService.getLiveAttendance(sessionId);
      res.json({ success: true, data: attendance });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getReports: async (req, res) => {
    try {
      const reports = await facultyService.generateReport(req.user.id, req.query);
      res.json({ success: true, data: reports });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = facultyController;
