const attendanceEngine = require('../services/attendanceEngine');

const attendanceController = {
  /**
   * Endpoint for Wi-Fi scanner to report detected MAC addresses
   */
  markPresence: async (req, res) => {
    try {
      const { classroom_id, mac_addresses } = req.body;

      if (!classroom_id || !Array.isArray(mac_addresses)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid payload. classroom_id and mac_addresses array are required.' 
        });
      }

      const result = await attendanceEngine.processDetection(classroom_id, mac_addresses);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Controller Error:', error.message);
      res.status(500).json({ success: false, message: 'Internal Server Error during attendance processing' });
    }
  }
};

module.exports = attendanceController;
