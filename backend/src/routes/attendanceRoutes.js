const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Basic Security Middleware for Scanners
const verifyScanner = (req, res, next) => {
  const scannerKey = req.headers['x-scanner-key'];
  const masterKey = process.env.SCANNER_MASTER_KEY || 'wifi_attend_secret_2024';

  if (!scannerKey || scannerKey !== masterKey) {
    return res.status(403).json({ success: false, message: 'Unauthorized scanner access' });
  }
  next();
};

/**
 * @route POST /api/attendance/detect
 * @desc Receive MAC addresses from Wi-Fi scanner
 * @access Private (Scanner Key Required)
 */
router.post('/detect', verifyScanner, attendanceController.markPresence);

module.exports = router;
