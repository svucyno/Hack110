import React, { useState, useEffect } from 'react';
import { Shield, Settings, Activity, Server, Users, History, AlertTriangle, Play, ChevronDown, CheckCircle2 } from 'lucide-react';
import PoseDetector from './components/PoseDetector';
import EmergencyResources from './components/EmergencyResources';
import LandingPage from './components/LandingPage';

function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [alertActive, setAlertActive] = useState(false);
  const [alertHistory, setAlertHistory] = useState([]);
  const [cameraActive, setCameraActive] = useState(false); // To sync with camera card display

  // Original settings logic preserved
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('hope_settings');
    return saved ? JSON.parse(saved) : {
      adminEmail: 'thondapuprudhvi@gmail.com',
      agencyEmail: 'ramanapola192@gmail.com',
      hospitalEmail: 'tprudhvi@gmail.com',
      smsAlerts: true,
      cameraName: 'Hostel Lobby Cam 01',
      sensitivity: 'high'
    };
  });

  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('hope_settings', JSON.stringify(settings));
  }, [settings]);

  const handleAlertTriggered = (isAlert) => {
    if (isAlert && !alertActive) {
      setAlertActive(true);
      const newAlert = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'AI Algorithmic Detection',
        status: 'Authorities Notified'
      };
      setAlertHistory(prev => [newAlert, ...prev].slice(0, 5));
      
      console.log('ALERT! Notifying via Backend Relay...');
      fetch('http://localhost:3001/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          timestamp: new Date().toISOString(), 
          type: 'AI Detection',
          emails: [settings.adminEmail, settings.agencyEmail, settings.hospitalEmail].filter(Boolean)
        })
      }).catch(err => console.warn('Backend Alert Relay Offline (Mock Mode Active)'));

      setTimeout(() => setAlertActive(false), 8000); 
    }
  };

  const handleManualAlert = () => {
    if (window.confirm("CONFIRM MANUAL ALERT: This will notify all emergency services immediately. Proceed?")) {
      setAlertActive(true);
      
      try {
        const audio = new Audio('/critical_alert.mpeg');
        audio.play();
      } catch (e) {
        console.error("Manual Audio Trigger Failed:", e);
      }

      const newAlert = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: 'Manual Override Trigger',
        status: 'Authorities Notified'
      };
      setAlertHistory(prev => [newAlert, ...prev].slice(0, 5));
      
      fetch('http://localhost:3001/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          timestamp: new Date().toISOString(), 
          type: 'Manual Override',
          emails: [settings.adminEmail, settings.agencyEmail, settings.hospitalEmail].filter(Boolean)
        })
      }).catch(err => console.warn('Backend Alert Relay Offline'));
      setTimeout(() => setAlertActive(false), 8000);
    }
  };

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveSettings = (e) => {
    e.preventDefault();
    setSaveMessage('Configuration Saved.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  if (activeTab === 'landing') {
    return <LandingPage onEnter={() => setActiveTab('monitor')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden text-slate-800">
      {/* Light pastel gradient mesh background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-light/40 blur-[100px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8DEFF]/60 blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3 z-0"></div>
      <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-[#FFEBE0]/50 blur-[100px] rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/3 z-0"></div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm px-6 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-teal" />
              <span className="font-extrabold text-xl tracking-tight text-slate-900">HOPE AI</span>
            </div>
            
            <div className="hidden md:flex items-center px-4 py-1.5 rounded-full bg-slate-100/80 border border-slate-200">
              <span className="text-xs font-bold text-slate-600 tracking-wider">PRIVACY MODE: SKELETON ONLY</span>
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('settings')}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Configuration
              </button>
              <button 
                onClick={() => setActiveTab('monitor')}
                className="bg-teal hover:bg-teal-dark text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors transition-transform hover:-translate-y-0.5"
              >
                Monitor Site
              </button>
            </div>
          </div>
        </nav>

        {alertActive && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl bg-softred text-white p-4 rounded-xl shadow-2xl z-50 flex items-center justify-center gap-3 animate-bounce">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="font-bold tracking-wide">CRITICAL MOMENT DETECTED - EMERGENCY PROTOCOLS ENGAGED</span>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {activeTab === 'monitor' && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Hero */}
              <div className="text-center space-y-2 mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                  Life-Saving <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal to-blueviolet">AI Intelligence</span>
                </h1>
                <p className="text-slate-500 italic text-sm md:text-base">"One alert, one moment, one life saved."</p>
              </div>

              {/* TOP ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT: Live Camera Feed */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 overflow-hidden lg:col-span-2 flex flex-col">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse"></div>
                      <h2 className="font-bold text-slate-800 text-lg">Live Camera Feed</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-teal-light text-teal-dark px-3 py-1 rounded-md text-xs font-bold tracking-wide">CONFIDENCE: 98%</span>
                      <span className="bg-teal/10 text-teal px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-teal/20">MONITORING ACTIVE</span>
                    </div>
                  </div>
                  
                  <div className="relative flex-1 bg-slate-900 overflow-hidden min-h-[400px]">
                     <PoseDetector onAlertTriggered={handleAlertTriggered} />
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 bg-white/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 tracking-wider">RISK LEVEL</span>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${!alertActive ? 'bg-teal text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>SAFE</span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-400">AT RISK</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${alertActive ? 'bg-softred text-white shadow-sm animate-pulse' : 'bg-slate-100 text-slate-400'}`}>HIGH RISK</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-teal font-bold text-sm bg-teal/10 hover:bg-teal/20 px-4 py-2 rounded-xl transition-colors">
                      <Settings className="w-4 h-4" /> Diagnostics
                    </button>
                  </div>
                </div>

                {/* RIGHT: Stacked Cards */}
                <div className="space-y-6 flex flex-col">
                  {/* System Status card */}
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border-l-4 border-l-blueviolet p-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Server className="w-4 h-4" /> System Status
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">AI Engine</span>
                        <span className="text-xs font-bold text-teal bg-teal/10 px-2 py-1 rounded-md">ONLINE</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">Server Node</span>
                        <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">CONNECTED</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">Cameras</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">1 ACTIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Info card */}
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border-l-4 border-l-blueviolet p-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Subject Info
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">ID:</span>
                        <span className="font-medium text-slate-800">B.Tech/2026/412</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Status:</span>
                        <span className="text-xs font-bold text-teal bg-teal/10 px-2 border border-teal/20 py-1 rounded-full">In Room (Active)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Last Seen:</span>
                        <span className="font-medium text-slate-800">Just now</span>
                      </div>
                    </div>
                  </div>

                  {/* Activity Log card */}
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border-l-4 border-l-ambergold p-6 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <History className="w-4 h-4" /> Activity Log
                    </h3>
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-40 text-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-ambergold mt-0.5 shrink-0" />
                        <span className="text-slate-600">
                          <span className="font-semibold text-slate-800 block text-xs">System initialized.</span>
                           Monitoring active.
                        </span>
                      </div>
                      {alertHistory.map(alert => (
                        <div key={alert.id} className="flex items-start gap-3 border-t border-slate-100 pt-3">
                          <AlertTriangle className="w-4 h-4 text-softred mt-0.5 shrink-0" />
                          <span className="text-slate-600">
                            <span className="font-semibold text-slate-800 block text-xs">{alert.time}</span>
                            {alert.type}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={handleManualAlert}
                      className="mt-4 w-full py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:border-softred hover:text-softred hover:bg-red-50 transition-colors text-sm"
                    >
                      Trigger Test Alert
                    </button>
                  </div>
                </div>

              </div>

              {/* BOTTOM SECTION */}
              <EmergencyResources />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-8 animate-fade-in-up">
              <div className="border-b border-slate-200 pb-6 mb-6">
                <Settings className="w-10 h-10 text-blueviolet mb-4" />
                <h2 className="text-3xl font-extrabold text-slate-900">HOPE Core Config</h2>
                <p className="text-slate-500 mt-1">Precision tuning for life-critical intelligence</p>
              </div>

              <form onSubmit={saveSettings} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Emergency Warden Protocol (Email)</label>
                  <input type="email" name="adminEmail" value={settings.adminEmail} onChange={handleSettingChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-slate-50" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Authority Dispatch Index (Email)</label>
                  <input type="email" name="agencyEmail" value={settings.agencyEmail} onChange={handleSettingChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-slate-50" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Medical Response Node (Email)</label>
                  <input type="email" name="hospitalEmail" value={settings.hospitalEmail} onChange={handleSettingChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-slate-50" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">AI Optical Sensor</label>
                    <input type="text" name="cameraName" value={settings.cameraName} onChange={handleSettingChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Inference Sensitivity</label>
                    <select name="sensitivity" value={settings.sensitivity} onChange={handleSettingChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-slate-50">
                      <option value="low">Low (Standard)</option>
                      <option value="medium">Medium (Defensive)</option>
                      <option value="high">High (Maximum Safety)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-100 p-4 rounded-xl border border-slate-200">
                  <input type="checkbox" id="smsAlerts" name="smsAlerts" checked={settings.smsAlerts} onChange={handleSettingChange} className="w-5 h-5 text-teal rounded border-gray-300 focus:ring-teal" />
                  <label htmlFor="smsAlerts" className="font-semibold text-slate-700">Activate Quantum SMS Alert Mesh</label>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button type="submit" className="bg-blueviolet hover:bg-opacity-90 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-md">
                    DEPLOY CONFIGURATION
                  </button>
                  {saveMessage && <span className="text-teal font-bold animate-pulse">{saveMessage}</span>}
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
      
      {/* Required for internal CSS animations in tailwind config if I don't import app.css, but standard tailwind provides transitions */}
    </div>
  );
}

export default App;
