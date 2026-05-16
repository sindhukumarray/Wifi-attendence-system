const Student = require('../models/Student');
const Device = require('../models/Device');
const Attendance = require('../models/Attendance');

const studentService = {
  getProfile: async (studentId) => {
    return await Student.findById(studentId);
  },

  updateProfile: async (studentId, data) => {
    return await Student.update(studentId, data);
  },

  registerDevice: async (studentId, data) => {
    const { mac_address, device_name } = data;
    
    // Check for existing device with this MAC
    const existingDevice = await Device.findByMac(mac_address);
    if (existingDevice) {
      throw new Error('Device already registered');
    }

    return await Device.create(studentId, mac_address, device_name);
  },

  getDevices: async (studentId) => {
    return await Device.findByStudentId(studentId);
  },

  deleteDevice: async (deviceId, studentId) => {
    const deleted = await Device.delete(deviceId, studentId);
    if (!deleted) {
      throw new Error('Device not found or unauthorized');
    }
    return deleted;
  },

  getAttendanceHistory: async (studentId) => {
    return await Attendance.getHistoryByStudent(studentId);
  },

  getAttendancePercentage: async (studentId) => {
    const stats = await Attendance.getStats(studentId);
    const total = parseInt(stats.total_classes) || 0;
    const present = parseInt(stats.present_classes) || 0;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : "0.00";

    return {
      total_classes: total,
      present_classes: present,
      percentage: parseFloat(percentage)
    };
  },

  getDashboardData: async (studentId) => {
    const [profile, stats, devices, attendance] = await Promise.all([
      Student.findById(studentId),
      Attendance.getStats(studentId),
      Device.findByStudentId(studentId),
      Attendance.getHistoryByStudent(studentId)
    ]);

    const total = parseInt(stats.total_classes) || 0;
    const present = parseInt(stats.present_classes) || 0;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : "0.00";

    return {
      profile,
      attendance_percentage: {
        total_classes: total,
        present_classes: present,
        percentage: parseFloat(percentage)
      },
      recent_attendance: attendance.slice(0, 5),
      registered_devices: devices,
      notifications: [] // Placeholder for Phase 5/6
    };
  }
};

module.exports = studentService;
