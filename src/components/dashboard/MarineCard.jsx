import React from 'react';
import { Waves, Compass, Droplet } from 'lucide-react';

export default function MarineCard({ marine }) {
  if (!marine) return null;

  const {
    wave_height = 0,
    wave_period = 0,
    sst = 0,
    current_speed = 0,
  } = marine;

  const getWaveStatus = (height) => {
    if (height >= 3.0) return { label: 'Dangerous Swell', color: 'text-red-400', badge: 'bg-red-500/10 border-red-500/20 text-red-400' };
    if (height >= 2.0) return { label: 'Rough Waves', color: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/20 text-orange-400' };
    if (height >= 1.2) return { label: 'Moderate Swell', color: 'text-yellow-400', badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' };
    return { label: 'Calm Sea', color: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' };
  };

  const status = getWaveStatus(wave_height);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all duration-200">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Wave Height
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${status.badge}`}>
            {status.label}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl md:text-4xl font-black tracking-tight text-white">
            {wave_height}
          </span>
          <span className="text-sm font-semibold text-slate-400">meters</span>
          <span className="text-xs font-medium text-slate-500">({wave_period}s period)</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Droplet className="h-3.5 w-3.5 text-teal-400" />
          <span>SST: <strong className="text-slate-200">{sst}°C</strong></span>
        </span>
        <span className="flex items-center gap-1">
          <Compass className="h-3.5 w-3.5 text-indigo-400" />
          <span>Current: <strong className="text-slate-200">{current_speed} kts</strong></span>
        </span>
      </div>
    </div>
  );
}
