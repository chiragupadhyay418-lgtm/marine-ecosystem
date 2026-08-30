import React from 'react';
import { Bell, Clock, MapPin } from 'lucide-react';

export default function CommunityAlert({ alerts = [], lang = 'en' }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-500">
        <p>✓ {lang === 'hi' ? 'कोई सक्रिय मौसम चेतावनी नहीं।' : 'No active safety alerts for this sector.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-red-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            {lang === 'hi' ? '⚠️ सक्रिय मौसम बुलेटिन' : '⚠️ Weather Alert Bulletin'}
          </h3>
        </div>
        <span className="text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full">
          {alerts.length} {lang === 'hi' ? 'सक्रिय' : 'Active'}
        </span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-extrabold uppercase text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                {alert.severity}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-500" />
                {alert.timestamp}
              </span>
            </div>

            <h4 className="text-xs font-bold text-white mt-1">{alert.title}</h4>
            <p className="text-[11px] text-blue-400 font-semibold flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {alert.location}
            </p>
            <p className="text-[11px] text-slate-300 leading-snug">{alert.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
