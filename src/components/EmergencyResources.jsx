import React from 'react';
import { MapPin, ShieldCheck, Activity, Navigation, Ambulance, Building2 } from 'lucide-react';

const EmergencyResources = () => {
  const nearbyHospitals = [
    {
      name: "SGN Hospital",
      type: "MULTI SPECIALITY",
      address: "Kadapa - Tirupati Rd, near Kameswaramma Hospital, Rajampet, AP 516115",
      distance: "1.8 km",
      eta: "4 mins",
      phone: "+91 97013 12136",
      rating: "4.9",
      mapsUrl: "https://maps.google.com/?cid=18302189154328254826"
    },
    {
      name: "Dr Krishna's Life Hospital",
      type: "ENT & GENERAL",
      address: "beside Reliance Smart Bazar, Rajampet, AP 516115",
      distance: "2.3 km",
      eta: "6 mins",
      phone: "+91 97774 18887",
      rating: "4.8",
      mapsUrl: "https://maps.google.com/?cid=16747178318288328402"
    },
    {
      name: "Sri Sai Multi Speciality Hospital",
      type: "ORTHOPAEDIC",
      address: "Kadapa - Tirupati Rd, near Usman Nagar, Rajampet, AP 516115",
      distance: "2.1 km",
      eta: "5 mins",
      phone: "+91 92946 29294",
      rating: "4.8",
      mapsUrl: "https://maps.google.com/?cid=2133385678602667977"
    },
    {
      name: "Government Hospital Rajampet",
      type: "EMERGENCY & TRAUMA",
      address: "Rajampet, Andhra Pradesh 516115",
      distance: "2.0 km",
      eta: "5 mins",
      phone: null,
      rating: "2.7",
      mapsUrl: "https://maps.google.com/?cid=7159338166911227621"
    }
  ];

  return (
    <div className="mt-8 pt-8 border-t border-slate-200">
      {/* Section Header */}
      <div className="flex flex-wrap flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal/10 p-2 rounded-full">
            <MapPin className="w-6 h-6 text-teal" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Location Tracking</h2>
            <p className="text-sm font-medium text-slate-500">Live Satellite Feed & Emergency Routes</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-softred text-white px-4 py-1.5 rounded-full shadow-sm animate-pulse">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider">LIVE SIGNAL FEED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px] lg:h-[500px]">
        {/* LEFT: Google Maps */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 overflow-hidden relative flex flex-col">
          {/* Overlays */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs font-bold text-slate-700">Annamacharya University</span>
            </div>
            <div className="bg-ambergold/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
              <span className="text-xs font-bold">Nearest: SGN Hospital (1.8 km)</span>
            </div>
          </div>
          
          <div className="w-full h-full bg-slate-200 flex-1">
            <iframe 
              title="Emergency Location Map"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Annamacharya%20Institute%20of%20Technology%20and%20Sciences,%20Rajampet,%20Andhra%20Pradesh%20516115&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0, filter: 'contrast(105%) saturate(110%)' }} 
              allowFullScreen="" 
              loading="lazy"
            />
          </div>
        </div>

        {/* RIGHT: Nearby Hospitals */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 flex flex-col overflow-hidden">
          <div className="bg-slate-50/80 border-b border-slate-100 flex items-center gap-3 px-6 py-4">
            <Activity className="w-5 h-5 text-teal" />
            <h3 className="font-bold text-slate-800 text-lg">Nearby Hospitals</h3>
          </div>
          
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            {nearbyHospitals.map((hospital, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-slate-400" />
                    <h4 className="font-extrabold text-slate-900">{hospital.name}</h4>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[0.65rem] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider border border-slate-200">
                    {hospital.type}
                  </span>
                </div>
                
                <p className="text-xs text-slate-500 mb-4 pl-7 line-clamp-1">{hospital.address}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 pl-7">
                  <div className="bg-teal/5 rounded-lg p-2 border border-teal/10">
                    <span className="block text-[0.65rem] font-bold text-slate-400 mb-0.5 tracking-wider">DISTANCE</span>
                    <span className="text-sm font-bold text-teal">{hospital.distance}</span>
                  </div>
                  <div className="bg-ambergold/5 rounded-lg p-2 border border-ambergold/10">
                    <span className="block text-[0.65rem] font-bold text-slate-400 mb-0.5 tracking-wider">ETA (TRAFFIC)</span>
                    <span className="text-sm font-bold text-ambergold">{hospital.eta}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pl-7">
                  <button 
                    onClick={() => hospital.phone ? window.location.href = `tel:${hospital.phone.replace(/\s+/g, '')}` : alert('No dedicated dispatch number available. Redirecting to 108.')}
                    className="flex justify-center items-center gap-2 bg-softred hover:bg-red-500 text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Ambulance className="w-3.5 h-3.5" /> DISPATCH
                  </button>
                  <a 
                    href={hospital.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 bg-teal hover:bg-teal-dark text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" /> ROUTE
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResources;
