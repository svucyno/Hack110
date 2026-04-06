import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Heart, Shield, Activity, Clock, ArrowRight } from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Generate random particles once on mount
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      char: Math.random() > 0.5 ? '+' : '.',
      duration: 8 + Math.random() * 7,
      delay: Math.random() * 10
    }));
  }, []);

  const handleEnterClick = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onEnter();
    }, 500); // 500ms fade-out transition
  };

  return (
    <div className={`landing-container ${isFadingOut ? 'fade-out' : ''}`}>
      
      {/* BACKGROUND PARTICLES */}
      <div className="bg-particles">
        {particles.map(p => (
          <span 
            key={p.id} 
            className="particle" 
            style={{ 
              left: `${p.x}%`, 
              animationDuration: `${p.duration}s`, 
              animationDelay: `${p.delay}s` 
            }}
          >
            {p.char}
          </span>
        ))}
      </div>

      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="nav-left">
          <Shield color="#00B5A0" size={24} fill="rgba(0,181,160,0.2)" />
          HOPE AI
        </div>
        <div className="nav-center">
          Privacy Mode: Skeleton Only | No Recording
        </div>
        <div className="nav-right">
          <div className="nav-link">Configuration</div>
          <button className="nav-btn" onClick={handleEnterClick}>MONITOR SITE</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="hero-wrapper">
        <h2 className="hero-main-title">
          <span style={{color: '#1A2B4A'}}>Algorithmic Life</span>{' '}
          <span style={{color: '#00B5A0'}}>AI</span>{' '}
          <span style={{color: '#A855F7'}}>Intelligence</span>
        </h2>
        <p className="hero-small-sub">One alert, one moment, one life saved.</p>

        {/* GIANT HOPE TEXT */}
        <div className="hope-text-container">
          <span className="hope-letter letter-h">H</span>
          <span className="hope-letter letter-o">O</span>
          <span className="hope-letter letter-p">P</span>
          <span className="hope-letter letter-e">E</span>
        </div>
        
        <p className="hero-subtitle">Holding On, Protecting Everyone — One Alert, One Life Saved</p>
        <p className="hero-subscript">AI-POWERED REAL-TIME SAFETY MONITORING SYSTEM</p>
        
        <div className="ecg-divider">
          <svg width="300" height="40" viewBox="0 0 300 40">
            <path 
              className="ecg-path" 
              d="M 0 20 L 70 20 L 85 5 L 105 35 L 125 0 L 145 20 L 300 20" 
              fill="none" 
              stroke="#00B5A0" 
              strokeWidth="2" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        {/* STATS ROW */}
        <div className="stats-row">
          <div className="stat-card stat-1">
            <div className="stat-corner-icon teal"><Plus size={18} strokeWidth={3} /></div>
            <Activity color="#7A9AAF" size={24} />
            <div className="stat-value">24/7</div>
            <div className="stat-label">MONITORING</div>
          </div>
          
          <div className="stat-card stat-2">
            <div className="stat-corner-icon pink"><Heart size={18} strokeWidth={3} fill="#ec4899" color="#ec4899" /></div>
            <Clock color="#7A9AAF" size={24} />
            <div className="stat-value">&lt; 3s</div>
            <div className="stat-label">ALERT TIME</div>
          </div>

          <div className="stat-card stat-3">
            <div className="stat-corner-icon green"><Plus size={18} strokeWidth={3} color="#22c55e" /></div>
            <Shield color="#7A9AAF" size={24} />
            <div className="stat-value">100%</div>
            <div className="stat-label">PRIVACY SAFE</div>
          </div>
        </div>

        {/* CTA BUTTON */}
        <button className="cta-button" onClick={handleEnterClick}>
          Enter Monitoring System <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div>© HOPE AI SYSTEM — SVU CAMPUS, TIRUPATI</div>
        <div className="footer-center">
          🔒 Privacy Mode Active — No Video Stored — GDPR Compliant
        </div>
        <div>B.TECH/5020/41Y</div>
      </footer>
    </div>
  );
};

export default LandingPage;
