import React from 'react';
import { Waves, Navigation, Volume2, Languages, Radio } from 'lucide-react';

export default function CommunityHeader({
  regions = [],
  selectedRegionId,
  onSelectRegion,
  lang = 'en',
  onToggleLang,
  onReadAloud,
}) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 space-y-3 rounded-t-[2rem]">
      {/* Brand & Quick Actions Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-teal-500/20 text-teal-400 p-2 rounded-xl border border-teal-500/30">
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-white tracking-wide">ORCA</span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-extrabold px-2 py-0.5 rounded-full border border-teal-500/30 uppercase flex items-center gap-1">
                <Radio className="h-2.5 w-2.5 animate-pulse text-teal-400" />
                {lang === 'hi' ? 'सुरक्षा' : 'Coastal Safety'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {lang === 'hi' ? 'तटीय मछुआरा सुरक्षा पोर्टल' : 'Fisherman Safety Portal'}
            </p>
          </div>
        </div>

        {/* Action Controls: Language Toggle & Audio Read Aloud */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReadAloud}
            title="Read Aloud Safety Advisory"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-teal-400 transition-all active:scale-95 flex items-center gap-1 text-xs font-semibold"
          >
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">Listen</span>
          </button>

          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-extrabold text-teal-300 transition-all flex items-center gap-1 active:scale-95"
          >
            <Languages className="h-3.5 w-3.5" />
            <span>{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Station Selector Dropdown */}
      <div className="relative">
        <label htmlFor="header-station-select" className="sr-only">Select Location</label>
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white">
          <Navigation className="h-3.5 w-3.5 text-teal-400 shrink-0" />
          <span className="text-slate-400 text-[11px]">📍 Location:</span>
          <select
            id="header-station-select"
            value={selectedRegionId}
            onChange={(e) => onSelectRegion && onSelectRegion(e.target.value)}
            className="bg-transparent text-white font-extrabold outline-none cursor-pointer flex-1 text-xs"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                {r.location.name} — ({r.risk.level})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
