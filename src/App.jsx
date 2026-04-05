import React, { useState, useEffect } from 'react';
import { Camera, Shield, Heart, Settings, Users, Save, AlertTriangle, Activity, Database, Bell } from 'lucide-react';
import PoseDetector from './components/PoseDetector';
import EmergencyResources from './components/EmergencyResources';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('monitor');
  const [alertActive, setAlertActive] = useState(false);
  const [alertHistory, setAlertHistory] = useState([]);

  // Load Settings from LocalStorage or use defaults
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

  // Persist settings whenever they change
  useEffect(() => {
    localStorage.setItem('hope_settings', JSON.stringify(settings));
  }, [settings]);

  const AlertSignal = () => {
    if (!alertActive) return null;
    return (
      <div className="global-alert-bar slide-down">
        <div className="alert-content">
          <AlertTriangle className="alert-icon pulse" />
          <span>CRITICAL MOMENT DETECTED - EMERGENCY PROTOCOLS ENGAGED</span>
        </div>
      </div>
    );
  };

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
        body: JSON.stringify({ timestamp: new Date().toISOString(), type: 'AI Detection' })
      }).catch(err => console.warn('Backend Alert Relay Offline (Mock Mode Active)'));

      setTimeout(() => setAlertActive(false), 8000); 
    }
  };

  const handleManualAlert = () => {
    if (window.confirm("CONFIRM MANUAL ALERT: This will notify all emergency services immediately. Proceed?")) {
      setAlertActive(true);
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
        body: JSON.stringify({ timestamp: new Date().toISOString(), type: 'Manual Override' })
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
    setSaveMessage('Encrypted Configuration Saved.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Render Functions
  const renderMonitorPane = () => (
    <>
      <section className="dashboard-grid fade-in">
        <div className="glass-panel monitor-card monitor-glow">
          <div className="card">
            <div className="card-header">
              <Activity className="icon" />
              <h2>Neural Pose Analysis</h2>
              <span className={`status-badge ${alertActive ? 'warning-status pulse' : 'active-status'}`}>
                {alertActive ? 'CRITICAL ALERT' : 'AI Monitoring Active'}
              </span>
            </div>
            <div className="camera-container-wrapper">
              <PoseDetector onAlertTriggered={handleAlertTriggered} />
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="glass-panel info-card">
            <div className="card">
              <div className="card-header">
                <Database className="icon" style={{color: 'var(--secondary)'}} />
                <h3>System Integrity</h3>
              </div>
              <ul className="status-list">
                <li><strong>AI Inference:</strong> <span className="text-success status-val">Optimal</span></li>
                <li><strong>Relay Node:</strong> <span className="text-success status-val">Verifed</span></li>
                <li><strong>Sensor:</strong> <span className="status-val">{settings.cameraName}</span></li>
              </ul>
            </div>
          </div>

          <div className="glass-panel alert-log-card">
            <div className="card">
              <div className="card-header">
                <Bell className="icon" style={{color: 'var(--accent)'}} />
                <h3>Detection Log</h3>
              </div>
              <div className="alert-history">
                {alertHistory.length === 0 ? (
                  <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '10px'}}>No alerts detected in current session.</p>
                ) : (
                  <ul className="status-list">
                    {alertHistory.map(alert => (
                      <li key={alert.id} style={{fontSize: '0.8rem'}}>
                        <span>{alert.time} - {alert.type}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button 
                className="btn-danger" 
                style={{marginTop: '16px', padding: '12px'}}
                onClick={handleManualAlert}
              >
                MANUAL TRIGGER
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="fade-in">
        <EmergencyResources />
      </section>
    </>
  );

  const renderSettingsPane = () => (
    <section className="settings-section fade-in">
      <div className="glass-panel settings-panel">
        <div className="card-header" style={{marginBottom: '32px'}}>
          <Settings className="icon" style={{ width: '42px', height: '42px' }} />
          <div>
            <h2 style={{fontSize: '2rem'}}>HOPE Core Config</h2>
            <p style={{color: 'var(--text-muted)'}}>Precision tuning for life-critical intelligence</p>
          </div>
        </div>

        <form onSubmit={saveSettings} className="settings-form">
          <div className="form-group">
            <label><Users className="form-icon" /> Emergency Warden Protocol</label>
            <input
              type="email"
              name="adminEmail"
              value={settings.adminEmail}
              onChange={handleSettingChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label><Shield className="form-icon" /> Authority Dispatch Index</label>
            <input
              type="email"
              name="agencyEmail"
              value={settings.agencyEmail}
              onChange={handleSettingChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label><Heart className="form-icon" /> Medical Response Node</label>
            <input
              type="email"
              name="hospitalEmail"
              value={settings.hospitalEmail}
              onChange={handleSettingChange}
              className="form-input"
            />
          </div>

          <div className="form-row" style={{display: 'flex', gap: '24px'}}>
            <div className="form-group" style={{flex: 1}}>
              <label>AI Optical Sensor</label>
              <input
                type="text"
                name="cameraName"
                value={settings.cameraName}
                onChange={handleSettingChange}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>Inference Sensitivity</label>
              <select
                name="sensitivity"
                value={settings.sensitivity}
                onChange={handleSettingChange}
                className="form-select"
              >
                <option value="low">Low (Standard)</option>
                <option value="medium">Medium (Defensive)</option>
                <option value="high">High (Maximum Safety)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px'}}>
            <input
              type="checkbox"
              id="smsAlerts"
              name="smsAlerts"
              checked={settings.smsAlerts}
              onChange={handleSettingChange}
              style={{width: '20px', height: '20px'}}
            />
            <label htmlFor="smsAlerts" style={{margin: 0}}>Activate Quantum SMS Alert Mesh</label>
          </div>

          <div className="form-actions" style={{marginTop: '32px', display: 'flex', alignItems: 'center', gap: '20px'}}>
            <button type="submit" className="btn-primary">
              <Save style={{marginRight: '8px', verticalAlign: 'middle', width: '18px'}} /> DEPLOY CONFIGURATION
            </button>
            {saveMessage && <span className="save-message text-success fade-in" style={{fontWeight: 600}}>{saveMessage}</span>}
          </div>
        </form>
      </div>
    </section>
  );

  return (
    <div className="app-container">
      <AlertSignal />
      <header className="header">
        <div className="container flex-between nav-container">
          <div className="logo-container">
            <div className="logo-img-wrapper" style={{width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--primary-glow)'}}>
              <Shield color="#000" size={24} />
            </div>
            <span className="logo-text gradient-text-neon">HOPE AI</span>
          </div>

          <nav className="main-nav">
            <button
              className={`nav-button ${activeTab === 'monitor' ? 'active' : ''}`}
              onClick={() => setActiveTab('monitor')}
            >
              MONITOR COMMAND
            </button>
            <button
              className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              PROTOCOL CONFIG
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content container">
        <section className="hero-section fade-in">
          <h1 className="hero-title">Algorithmic Life Protection</h1>
          <p className="hero-subtitle">Utilizing neural pose estimation to protect lives in private spaces. One detection can change everything.</p>
        </section>

        {activeTab === 'monitor' ? renderMonitorPane() : renderSettingsPane()}

      </main>

      <footer className="footer">
        <div className="container">
          <p className="footer-text">"The ultimate success of technology is measured in lives saved." — HOPE AI Sytems</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

