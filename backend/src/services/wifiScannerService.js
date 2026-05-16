const { ValidationException } = require('./validationService');

const wifiScannerService = {
  /**
   * Extracts and sanitizes network and device data from the raw request
   * @param {Object} req - Express request object
   * @returns {Object} Sanitized data payload
   */
  extractNetworkData: (req) => {
    const { mac_address, current_ssid, bssid } = req.body;
    
    if (!mac_address) {
      throw new ValidationException('MISSING_MAC', 'MAC address is required to mark attendance', 400);
    }
    if (!current_ssid) {
      throw new ValidationException('MISSING_SSID', 'Network SSID is required to verify your location', 400);
    }

    // Sanitize MAC Address (ensure it's uppercase and trimmed)
    // E.g., convert "00-1a-2b-3c" to "00:1A:2B:3C:4D:5E" if needed, but for now just basic normalization
    const sanitizedMac = mac_address.replace(/-/g, ':').toUpperCase().trim();

    return {
      macAddress: sanitizedMac,
      currentSsid: current_ssid.trim(),
      bssid: bssid ? bssid.toUpperCase().trim() : null,
      ipAddress: req.ip || req.connection.remoteAddress
    };
  },

  /**
   * Advanced Security: Validate physical router BSSID if provided and required
   * @param {string} providedBssid 
   * @param {string} expectedBssid 
   */
  validateBSSID: (providedBssid, expectedBssid) => {
    if (!expectedBssid) return true; // If classroom has no BSSID restrictions
    
    if (providedBssid !== expectedBssid) {
      throw new ValidationException('BSSID_MISMATCH', 'Physical router verification failed. Are you using a hotspot?', 403);
    }
    return true;
  }
};

module.exports = wifiScannerService;
