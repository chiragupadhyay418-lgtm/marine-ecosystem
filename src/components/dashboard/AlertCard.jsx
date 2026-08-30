import React from 'react';
import { Bell, AlertOctagon, AlertTriangle } from 'lucide-react';

export default function AlertCard({ alerts = [] }) {
  const totalCount = alerts.length;
  const criticalCount = alerts.filter((a) => (a.severity || '').toUpperCase() === 'CRITICAL').length;
  const highCount = alerts.filter((a) => (a.severity || '').toUpperCase() === 'HIGH').length;
  const moderateCount = alerts.filter((a) => (a.severity || '').toUpperCase() === 'MODERATE').length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all duration-200">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Alerts
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
              criticalCount > 0
                ? 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            {totalCount > 0 ? `${totalCount} Active` : 'All Clear'}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl md:text-4xl font-black tracking-tight text-white">
            {totalCount}
          </span>
          <span className="text-sm font-semibold text-slate-400">Issued</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3 text-xs">
        {criticalCount > 0 && (
          <span className="flex items-center gap-1 font-bold text-red-400">
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>{criticalCount} Critical</span>
          </span>
        )}
        {highCount > 0 && (
          <span className="flex items-center gap-1 font-semibold text-orange-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{highCount} High</span>
          </span>
        )}
        {moderateCount > 0 && (
          <span className="flex items-center gap-1 font-medium text-yellow-400">
            <span>{moderateCount} Moderate</span>
          </span>
        )}
        {totalCount === 0 && (
          <span className="text-slate-500">No active bulletins for this sector</span>
        )}
      </div>
    </div>
  );
}
