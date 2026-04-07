import React from 'react';
import { Activity, Clock, Shield, ArrowRight } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#eafcfa] font-sans flex flex-col justify-between">
      {/* Google Fonts Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap');
          
          .font-title {
            font-family: 'Nunito', sans-serif;
          }
          
          .text-glow {
            text-shadow: 4px 8px 20px rgba(0, 191, 165, 0.3);
          }
        `}
      </style>

      {/* Decorative Background Elements */}
      {/* Background Blobs */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-pink-300 opacity-15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[50%] left-[-10%] w-[35vw] h-[35vw] bg-teal-400 opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Scattered Plus / Stars */}
      <div className="absolute top-[15%] left-[10%] text-teal-600 opacity-30 text-xl pointer-events-none">+</div>
      <div className="absolute top-[25%] right-[15%] text-teal-600 opacity-20 text-3xl pointer-events-none">+</div>
      <div className="absolute bottom-[20%] left-[20%] text-teal-600 opacity-40 text-sm pointer-events-none">✦</div>
      <div className="absolute top-[40%] right-[25%] text-teal-600 opacity-30 text-lg pointer-events-none">✦</div>
      <div className="absolute bottom-[30%] right-[10%] text-teal-600 opacity-25 text-2xl pointer-events-none">+</div>
      <div className="absolute top-[60%] left-[5%] text-teal-600 opacity-15 text-4xl pointer-events-none">+</div>

      {/* TOP-RIGHT CORNER */}
      <div className="absolute top-6 right-8 flex items-center gap-2">
        <Shield className="w-4 h-4 text-teal-500" />
        <span className="text-teal-600 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase">
          System Active
        </span>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
      </div>

      {/* Main Content Centered */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 z-10 py-16">
        
        {/* Giant HOPE text */}
        <h1 className="font-title text-[#00BFA5] text-[100px] sm:text-[140px] md:text-[160px] leading-none text-glow tracking-tight mb-2">
          HOPE
        </h1>

        {/* Taglines */}
        <p className="text-[#1a1a2e] text-base md:text-[18px] font-medium text-center mb-1">
          Holding On, Protecting Everyone — One Alert, One Life Saved
        </p>
        <p className="text-[#00BFA5] text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase text-center mb-8">
          AI-POWERED REAL-TIME SAFETY MONITORING SYSTEM
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-[60px] sm:w-[120px] h-[1px] bg-teal-200"></div>
          <Activity className="w-5 h-5 text-teal-500 stroke-[2.5]" />
          <div className="w-[60px] sm:w-[120px] h-[1px] bg-teal-200"></div>
        </div>

        {/* Stat Cards Row */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-5 mb-14">
          
          {/* Card 1 */}
          <div className="relative w-[240px] md:w-[220px] bg-white border-[1.5px] border-[#d0f0e8] rounded-2xl p-7 shadow-[0_4px_20px_rgba(0,191,165,0.08)] flex flex-col items-center">
            <span className="absolute top-4 right-4 text-teal-400 font-bold text-sm">+</span>
            <Activity className="w-7 h-7 text-[#1a1a2e] mb-3" />
            <h3 className="text-[40px] font-extrabold text-[#1a1a2e] leading-none mb-1">24/7</h3>
            <p className="text-[#00BFa5] text-[10px] font-semibold tracking-[0.2em]">MONITORING</p>
          </div>

          {/* Card 2 */}
          <div className="relative w-[240px] md:w-[220px] bg-white border-[1.5px] border-[#d0f0e8] rounded-2xl p-7 shadow-[0_4px_20px_rgba(0,191,165,0.08)] flex flex-col items-center">
            <svg className="absolute top-4 right-4 w-4 h-4 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg>
            <Clock className="w-7 h-7 text-[#1a1a2e] mb-3" />
            <h3 className="text-[40px] font-extrabold text-[#1a1a2e] leading-none mb-1">&lt; 3s</h3>
            <p className="text-[#00BFa5] text-[10px] font-semibold tracking-[0.2em]">ALERT TIME</p>
          </div>

          {/* Card 3 */}
          <div className="relative w-[240px] md:w-[220px] bg-white border-[1.5px] border-[#d0f0e8] rounded-2xl p-7 shadow-[0_4px_20px_rgba(0,191,165,0.08)] flex flex-col items-center">
            <span className="absolute top-4 right-4 text-teal-400 font-bold text-sm">+</span>
            <Shield className="w-7 h-7 text-[#1a1a2e] mb-3" />
            <h3 className="text-[40px] font-extrabold text-[#1a1a2e] leading-none mb-1">100%</h3>
            <p className="text-[#00BFa5] text-[10px] font-semibold tracking-[0.2em]">PRIVACY SAFE</p>
          </div>

        </div>

        {/* CTA Button */}
        <button 
          onClick={onEnter}
          className="group flex items-center justify-center gap-2 w-[280px] py-4 rounded-full bg-gradient-to-r from-[#00BFA5] to-[#00897B] text-white font-semibold text-[16px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:brightness-105"
        >
          Enter Monitoring System
          <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
        </button>

      </main>

      {/* BOTTOM BAR */}
      <footer className="w-full px-6 py-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left items-center">
          
          <div className="text-gray-500 text-[10px] tracking-[0.1em] uppercase order-2 md:order-1">
            © HOPE AI SYSTEM — SVU CAMPUS, TIRUPATI
          </div>

          <div className="flex items-center justify-center gap-1.5 order-1 md:order-2">
            <Shield className="w-3 h-3 text-teal-500" />
            <span className="text-gray-500 text-[11px] font-medium">
              Privacy Mode Active — No Video Stored — GDPR Compliant
            </span>
          </div>

          <div className="text-gray-500 text-[10px] tracking-[0.1em] uppercase md:text-right order-3">
            B.TECH/2026/412
          </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
