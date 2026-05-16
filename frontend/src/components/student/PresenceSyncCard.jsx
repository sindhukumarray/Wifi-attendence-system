import React, { useState, useEffect } from 'react';
import Badge from '../common/Badge';

const PresenceSyncCard = ({ devices, onMarkAttendance, onAutoMark }) => {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, scanning, verifying, success, failed
  const [activeStep, setActiveStep] = useState(0);
  const [wifiSsid, setWifiSsid] = useState(sessionStorage.getItem('detected_ssid') || '');

  const steps = [
    { label: 'Device Binding', desc: 'Verifying MAC Address' },
    { label: 'Network Scan', desc: 'Detecting Classroom SSID' },
    { label: 'Cloud Sync', desc: 'Finalizing Attendance' }
  ];

  useEffect(() => {
    if (devices?.length > 0 && syncStatus === 'idle') {
      startSmartSync();
    }
  }, [devices]);

  const startSmartSync = async () => {
    setSyncStatus('scanning');
    setActiveStep(0);

    // Step 1: Simulated Device Check
    setTimeout(() => {
      setActiveStep(1);
      const ssid = sessionStorage.getItem('detected_ssid');
      
      if (!ssid) {
        setSyncStatus('idle');
        return;
      }

      // Step 2: Simulated Network Check
      setTimeout(async () => {
        setActiveStep(2);
        setSyncStatus('verifying');

        const result = await onAutoMark(devices);
        
        // Step 3: Result
        setTimeout(() => {
          if (result?.success || result?.alreadyMarked) {
            setSyncStatus('success');
            setActiveStep(3);
          } else {
            setSyncStatus('failed');
          }
        }, 1000);
      }, 1500);
    }, 1500);
  };

  return (
    <div className={`relative p-10 rounded-[3rem] border transition-all duration-700 overflow-hidden ${
      syncStatus === 'success' ? 'bg-emerald-50 border-emerald-100' : 
      syncStatus === 'failed' ? 'bg-rose-50 border-rose-100' : 
      'bg-[#0f172a] border-slate-800 shadow-2xl'
    }`}>
      
      {/* Premium Radar Animation (Only during active sync) */}
      {(syncStatus === 'scanning' || syncStatus === 'verifying') && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20">
          <div className="absolute inset-0 border border-brand-500 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border border-brand-400 rounded-full animate-pulse scale-75"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/0 via-brand-500/20 to-brand-400/0 rounded-full animate-spin-slow"></div>
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Side: Status Info */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20">
            <span className={`w-2 h-2 rounded-full ${syncStatus === 'scanning' || syncStatus === 'verifying' ? 'bg-brand-500 animate-pulse' : 'bg-slate-500'}`}></span>
            <span className="text-xs font-black text-brand-500 uppercase tracking-widest">Presence Engine 2.0</span>
          </div>

          <div>
            <h2 className={`text-4xl font-black tracking-tight mb-2 ${syncStatus === 'success' || syncStatus === 'failed' ? 'text-slate-900' : 'text-white'}`}>
              {syncStatus === 'success' ? 'Verified!' : syncStatus === 'failed' ? 'Sync Failed' : 'Zero-Touch Sync'}
            </h2>
            <p className={`text-lg font-medium leading-relaxed ${syncStatus === 'success' || syncStatus === 'failed' ? 'text-slate-600' : 'text-slate-400'}`}>
              {syncStatus === 'success' ? 'Your attendance has been automatically recorded for today\'s session.' : 
               syncStatus === 'failed' ? 'We couldn\'t verify your presence. Please check your connection.' : 
               'Connecting to your classroom Wi-Fi... Please stay in range for automatic marking.'}
            </p>
          </div>

          {syncStatus === 'idle' && (
            <div className="flex items-center gap-3 animate-fade-in">
              <input 
                type="text" 
                placeholder="Manual SSID..."
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                className="flex-1 px-6 py-4 bg-slate-800 border-none rounded-2xl text-white font-bold focus:ring-2 focus:ring-brand-500"
              />
              <button 
                onClick={() => { sessionStorage.setItem('detected_ssid', wifiSsid); startSmartSync(); }}
                className="px-8 py-4 bg-brand-600 text-white font-black rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20"
              >
                Sync Now
              </button>
            </div>
          )}

          {syncStatus === 'success' && (
            <div className="flex items-center gap-4 animate-bounce-subtle">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-emerald-700 font-black">Logged at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>

        {/* Right Side: Step Visualization */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className={`p-6 rounded-[2rem] border transition-all duration-500 flex items-center gap-6 ${
              activeStep > index ? 'bg-emerald-500/10 border-emerald-500/20' : 
              activeStep === index ? 'bg-brand-500/10 border-brand-500/30 scale-105 shadow-xl' : 
              'bg-slate-800/20 border-slate-800/50 opacity-40'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-colors ${
                activeStep > index ? 'bg-emerald-500 text-white' : 
                activeStep === index ? 'bg-brand-500 text-white' : 
                'bg-slate-800 text-slate-500'
              }`}>
                {activeStep > index ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                ) : index + 1}
              </div>
              <div>
                <h4 className={`font-black tracking-tight ${syncStatus === 'success' || syncStatus === 'failed' ? 'text-slate-900' : 'text-white'}`}>
                  {step.label}
                </h4>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresenceSyncCard;
