import React from 'react';
import { LayoutDashboard, AlertTriangle, Fish, MessageSquare, Anchor, Compass } from 'lucide-react';

export default function Sidebar({ regions = [], selectedRegionId, onSelectRegion }) {
  const getRiskColorClass = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'HIGH': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'MODERATE': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'LOW': return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
      default: return 'bg-slate-500/20 border-slate-500/30 text-slate-400';
    }
  };

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col md:h-[calc(100vh-80px)] sticky top-20 shrink-0">
      {/* Navigation section */}
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">Navigation</h3>
        <nav className="space-y-1">
          <a href="#overview" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 text-white hover:text-white transition-all">
            <LayoutDashboard className="h-4 w-4 text-blue-400" />
            <span>Command Overview</span>
          </a>
          <a href="#map" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/50 hover:text-white transition-all text-slate-400">
            <Compass className="h-4 w-4" />
            <span>Interactive Map</span>
          </a>
          <a href="#alerts" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/50 hover:text-white transition-all text-slate-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Alert Center</span>
          </a>
          <a href="#pfz" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/50 hover:text-white transition-all text-slate-400">
            <Fish className="h-4 w-4" />
            <span>Fisheries Intelligence</span>
          </a>
          <a href="#ask-orca" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/50 hover:text-white transition-all text-slate-400">
            <MessageSquare className="h-4 w-4" />
            <span>Ask ORCA AI</span>
          </a>
        </nav>
      </div>

      {/* Region Selector List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">Monitoring Stations</h3>
        <div className="space-y-2">
          {regions.length === 0 ? (
            <p className="text-xs text-slate-500 px-2">No stations available.</p>
          ) : (
            regions.map((region) => (
              <button
                key={region.id}
                onClick={() => onSelectRegion && onSelectRegion(region.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-150 flex flex-col gap-1 ${
                  selectedRegionId === region.id
                    ? 'bg-slate-800 border-blue-500 text-white shadow-md shadow-slate-950/20'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/30 hover:border-slate-800 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-semibold truncate">{region.location.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getRiskColorClass(region.risk.level)}`}>
                    {region.risk.score}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Waves: {region.marine.wave_height}m</span>
                  <span>Wind: {region.weather.wind_speed}km/h</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex items-center gap-3">
        <div className="bg-slate-800 p-2 rounded-lg text-slate-400">
          <Anchor className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400">Station Status</p>
          <p className="text-[10px] text-emerald-400 font-medium">All telemetry online</p>
        </div>
      </div>
    </aside>
  );
}
