import React from 'react';
import { MapPin, Phone, ExternalLink, Hospital, Navigation, Radio, Map as MapIcon, Globe, Clock, ShieldCheck, Activity } from 'lucide-react';

const EmergencyResources = () => {
  const nearbyHospitals = [
    {
      id: 1,
      name: "S.V.R.R. Govt Hospital (Ruia)",
      address: "Alipiri Road, Tirupati",
      distance: "1.5 km",
      eta: "5 mins",
      type: "PRIVATE MULTI-SPECIALITY",
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
    <div className="emergency-grid-layout fade-in">
      
      {/* LEFT CARD: MAP BOX */}
      <div className="white-card tracking-card slide-in">
        <div className="card-header flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '1.4rem' }}>📍 Location Tracking</h2>
            <p style={{ color: '#666', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.5px' }}>Live Satellite Feed & Emergency Routes</p>
          </div>
          <div className="live-signal pulse badge-pill">
            <ShieldCheck size={14} /> LIVE SIGNAL FEED
          </div>
        </div>
        
        <div className="map-view-container">
          <div className="map-badges">
            <div className="map-badge location">
              <div className="dot blue"></div> <span>SVU CAMPUS</span>
            </div>
            <div className="map-badge nearest">
              <div className="dot red"></div> <span>NEAREST: SVIMS (4m)</span>
            </div>
          </div>
          
          <div className="map-iframe-wrapper" style={{ height: '100%', width: '100%' }}>
            <iframe 
              title="Emergency Location Map"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Sri%20Venkateswara%20University,%20Tirupati&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0, filter: 'contrast(110%) saturate(120%)' }} 
              allowFullScreen="" 
            />
          </div>
        </div>
      </div>

      {/* RIGHT CARD: NEARBY HOSPITALS */}
      <div className="white-card hospital-card slide-in" style={{ animationDelay: '0.1s' }}>
        <div className="card-header" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={24} style={{ color: '#00B5A0' }} />
          <h2 className="section-title" style={{ fontSize: '1.4rem' }}>🏥 Nearby Hospitals</h2>
        </div>
        
        <div className="hospital-scroll-area">
          {nearbyHospitals.map((hospital, index) => (
            <div key={hospital.id} className="hospital-card-item">
              <div className="hospital-card-details">
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <h4 className="hospital-name" style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1A2B4A' }}>{hospital.name}</h4>
                  <span className="hospital-type-pill">{hospital.type}</span>
                </div>
                <p className="hospital-address" style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>{hospital.address}</p>
                
                <div className="hospital-stats-badges">
                  <div className="stat-badge">
                    <span className="stat-label">DIST</span>
                    <span className="stat-value">{hospital.distance}</span>
                  </div>
                  <div className="stat-badge">
                    <span className="stat-label">ETA</span>
                    <span className="stat-value highlight">{hospital.eta}</span>
                  </div>
                </div>

                <div className="hospital-action-grid">
                  <button className="pill-btn btn-dispatch" onClick={() => window.location.href = `tel:${hospital.contact}`}>
                    <Radio size={14} /> DISPATCH
                  </button>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&origin=SVU+University,+Tirupati&destination=${encodeURIComponent(hospital.name + ', Tirupati')}&travelmode=driving`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="pill-btn btn-route"
                  >
                    <Navigation size={14} /> ROUTE
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default EmergencyResources;
