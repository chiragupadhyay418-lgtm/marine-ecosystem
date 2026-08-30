import React from 'react';
import { Fish, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CommunityPFZCard({ pfz = {}, riskLevel = 'LOW', lang = 'en' }) {
  const { available = false, distance_km = 0, suitability = 'HIGH', depth_m = 0 } = pfz;
  const isRiskHigh = ['CRITICAL', 'HIGH'].includes((riskLevel || '').toUpperCase());

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Fish className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            {lang === 'hi' ? '🎣 निकटतम मछली क्षेत्र (PFZ)' : '🎣 Nearest Fishing Zone'}
          </h3>
        </div>
        <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
          {suitability} {lang === 'hi' ? 'उपयुक्तता' : 'Suitability'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-semibold">
            {lang === 'hi' ? 'तट से दूरी' : 'Distance Offshore'}
          </span>
          <span className="text-xl font-black text-white">{distance_km} km</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-semibold">
            {lang === 'hi' ? 'मछली की संभावना' : 'Fish Availability'}
          </span>
          <span className="text-xl font-black text-teal-400">{suitability}</span>
        </div>
      </div>

      {/* Safety Override Alert Banner */}
      <div
        className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
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
        <div className="space-y-0.5">
          <strong className="block font-bold">
            {isRiskHigh
              ? (lang === 'hi' ? 'महत्वपूर्ण चेतावनी: मछली उपलब्ध है, लेकिन समुद्र असुरक्षित है!' : 'Important Notice: Fish availability is high, but sea conditions are UNSAFE!')
              : (lang === 'hi' ? 'सुरक्षित नेविगेशन: मछली क्षेत्र में जाना सुरक्षित है।' : 'Safe Navigation: Favorable path to fishing zone.')}
          </strong>
          <p className="opacity-90 text-[11px] leading-relaxed">
            {isRiskHigh
              ? (lang === 'hi' ? 'PFZ में मछली होने का मतलब यह नहीं है कि समुद्र सुरक्षित है। तेज हवाओं के कारण गहरे समुद्र में न जाएं।' : 'High PFZ suitability does NOT mean fishing is currently safe. High waves override fishing zone suitability.')
              : (lang === 'hi' ? 'शांत समुद्र में निर्धारित मछली क्षेत्र तक सुरक्षित रूप से जा सकते हैं।' : 'Low wave height allows safe movement to designated fishing zones.')}
          </p>
        </div>
      </div>
    </div>
  );
}
