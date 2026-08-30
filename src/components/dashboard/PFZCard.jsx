import React from 'react';
import { Fish, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export default function PFZCard({ pfz, marine, riskLevel = 'LOW' }) {
  if (!pfz) return null;

  const {
    available = false,
    distance_km = 0,
    suitability = 'MEDIUM',
    confidence = 0,
    depth_m = 0,
  } = pfz;

  const isRiskHigh = ['CRITICAL', 'HIGH'].includes((riskLevel || '').toUpperCase());

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Fish className="h-5 w-5 text-teal-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Fisheries & PFZ Intelligence</h2>
              <p className="text-xs text-slate-400">Potential Fishing Zone & marine suitability</p>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
              available
                ? 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {available ? 'PFZ Active' : 'No Active PFZ'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Nearest PFZ</span>
            <span className="text-xl font-extrabold text-white">{distance_km} km</span>
            <span className="text-[10px] text-slate-500 block">Depth ~{depth_m}m</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Fish Suitability</span>
            <span className="text-xl font-extrabold text-teal-400">{suitability}</span>
            <span className="text-[10px] text-slate-500 block">{confidence}% confidence</span>
          </div>
        </div>

        {/* Safety Warning Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
            isRiskHigh
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          {isRiskHigh ? (
            <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <span>{isRiskHigh ? 'DISASTER ADVISORY: FISHING DISCOURAGED' : 'PFZ SAFE FOR HARVEST'}</span>
              <RiskBadge level={riskLevel} size="sm" />
            </div>
            <p className="leading-relaxed opacity-90 text-[11px]">
              {isRiskHigh
                ? 'High fish suitability does NOT guarantee sea safety. Offshore hazards (wave swell / winds) override fishing zone suitability.'
                : 'Current sea conditions allow safe navigation to the identified Potential Fishing Zone.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center">
        <span>SST: <strong className="text-slate-300">{marine?.sst || 'N/A'}°C</strong></span>
        <span>Wave Height: <strong className="text-slate-300">{marine?.wave_height || 'N/A'}m</strong></span>
      </div>
    </div>
  );
}
