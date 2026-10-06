import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#e5e2e1] bg-white py-6 mt-auto">
      <div className="max-w-[1120px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#47464b] font-label-sm text-xs text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>CampusAI Academic Operations • Friction-free campus ticketing</span>
        </div>
        <span className="text-[#77767b]">Quiet precision • Minimal • Responsive Portal</span>
      </div>
    </footer>
  );
}
