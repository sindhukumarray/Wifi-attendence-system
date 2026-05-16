import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../common/Button';
import Badge from '../common/Badge';

const AttendanceActionCard = ({ devices, onMarkAttendance, loading }) => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [wifiSsid, setWifiSsid] = useState(''); // In a real app, this is detected via Native Bridge

  const handleMarkAttendance = async () => {
    if (!selectedDevice) {
      toast.error('Please select a registered device');
      return;
    }

    if (!wifiSsid) {
      toast.error('Please enter the classroom Wi-Fi SSID');
      return;
    }

    const device = devices.find(d => d.id === parseInt(selectedDevice));
    
    await onMarkAttendance({
      mac_address: device.mac_address,
      current_ssid: wifiSsid
    });
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Mark Attendance</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Connect to classroom Wi-Fi to check in</p>
          </div>
          <Badge variant="primary" className="animate-pulse">Active Engine</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Device</label>
            <select 
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none text-slate-700 font-bold focus:ring-2 focus:ring-brand-500 transition-all appearance-none"
            >
              <option value="">Choose registered device...</option>
              {devices?.map(device => (
                <option key={device.id} value={device.id}>
                  {device.device_name} ({device.mac_address})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Classroom Wi-Fi (SSID)</label>
            <input 
              type="text"
              placeholder="e.g. LAB-101-WIFI"
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none text-slate-700 font-bold focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        <Button 
          variant="primary" 
          className="w-full py-4 shadow-lg shadow-brand-600/20"
          onClick={handleMarkAttendance}
          disabled={loading || devices?.length === 0}
        >
          {loading ? 'Validating Connection...' : 'Mark My Attendance'}
        </Button>

        {devices?.length === 0 && (
          <p className="text-center text-xs font-bold text-red-500">
            No registered devices found. Please go to "Devices" to register one.
          </p>
        )}
      </div>
    </div>
  );
};

export default AttendanceActionCard;
