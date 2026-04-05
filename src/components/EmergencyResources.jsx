import React from 'react';
import { MapPin, Phone, ExternalLink, Hospital, Navigation, Radio, Map as MapIcon } from 'lucide-react';

const EmergencyResources = () => {
  const nearbyHospitals = [
    {
      id: 1,
      name: "S.V.R.R. Govt Hospital (Ruia)",
      address: "Alipiri Road, Tirupati",
      distance: "1.5 km",
      eta: "5 mins",
      type: "PRIVATE MULTI-SPECIALITY", // matches screenshot style
      contact: "108"
    },
    {
      id: 2,
      name: "Helios Hospital",
      address: "Karakambadi Main Road, Tirupati",
      distance: "4.2 km",
      eta: "12 mins",
      type: "PRIVATE MULTI-SPECIALITY",
      contact: "0877 222 5555"
    },
    {
      id: 3,
      name: "SVIMS Super Speciality",
      address: "Alipiri Road, Tirupati",
      distance: "1.2 km",
      eta: "4 mins",
      type: "PRIVATE MULTI-SPECIALITY",
      contact: "0877 228 7777"
    },
    {
      id: 4,
      name: "Apollo Hospital",
      address: "Muthyala Reddy Palle, Tirupati",
      distance: "5.5 km",
      eta: "15 mins",
      type: "PRIVATE MULTI-SPECIALITY",
      contact: "0877 222 3333"
    }
  ];

  return (
    <div className="card glass-panel emergency-dashboard-card fade-in">
      <div className="card-header flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MapPin className="icon primary" />
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '2px' }}>GPS & Location Tracking</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Live Satellite Feed & Emergency Routes</p>
          </div>
        </div>
        <div className="live-signal">
          <Radio size={14} className="pulse-icon" /> LIVE SIGNAL FEED
        </div>
      </div>

      <div className="emergency-content-split">
        {/* Left: Map Section */}
        <div className="map-view-container">
          <div className="map-badges">
            <div className="map-badge location">
              <div className="dot blue"></div> Location: SVU Campus
            </div>
            <div className="map-badge nearest">
              <div className="dot red"></div> Nearest: SVIMS (4m)
            </div>
          </div>
          
          <div className="map-iframe-wrapper">
            <iframe 
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Sri%20Venkateswara%20University,%20Tirupati&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0, filter: 'invert(100%) hue-rotate(180deg) contrast(120%) saturate(150%)' }} 
              allowFullScreen="" 
            />
            <div className="map-vignette"></div>
          </div>
        </div>

        {/* Right: Hospital List */}
        <div className="hospital-section">
          <div className="section-header">
            <Hospital size={18} />
            <h3>Nearby Hospitals</h3>
          </div>
          
          <div className="hospital-scroll-area scrollable-list">
            {nearbyHospitals.map((hospital, index) => (
              <div key={hospital.id} className="hospital-card-premium slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="hospital-card-main">
                  <div className="hospital-card-icon">
                    <Hospital size={20} />
                  </div>
                  <div className="hospital-card-details">
                    <div className="flex-between">
                      <h4 className="hospital-name">{hospital.name}</h4>
                      <span className="hospital-type-tag">{hospital.type}</span>
                    </div>
                    <p className="hospital-address">{hospital.address}</p>
                    
                    <div className="hospital-stats-row">
                      <div className="stat-box">
                        <span className="stat-label">DISTANCE</span>
                        <span className="stat-value">{hospital.distance}</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">ETA</span>
                        <span className="stat-value highlight">{hospital.eta}</span>
                      </div>
                    </div>

                    <div className="hospital-action-grid">
                      <button className="btn-dispatch" onClick={() => window.location.href = `tel:${hospital.contact}`}>
                        <Radio size={14} /> Dispatch
                      </button>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&origin=SVU+University,+Tirupati&destination=${encodeURIComponent(hospital.name + ', Tirupati')}&travelmode=driving`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-route"
                      >
                        <Navigation size={14} /> Route
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-fade-out"></div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResources;
