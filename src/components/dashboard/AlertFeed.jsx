import React from 'react';
import { Bell, MapPin, Clock, ArrowRight } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export default function AlertFeed({ alerts = [], onSelectAlert }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-400" />
          <h2 className="text-base font-bold text-white tracking-tight">Active Disaster Bulletins</h2>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
          {alerts.length} Total
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-500">
          <Bell className="h-8 w-8 mb-2 opacity-40" />
          <p className="text-sm">No active alerts for this region.</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1 flex-1">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onSelectAlert && onSelectAlert(alert)}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-150 cursor-pointer group hover:bg-slate-800/40"
            >
              <div className="flex justify-between items-start mb-2 gap-2">
                <RiskBadge level={alert.severity} size="sm" />
                <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                  <Clock className="h-3 w-3 text-slate-500" />
                  {alert.timestamp}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors flex items-center justify-between">
                <span>{alert.title}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-blue-400 mb-2 font-medium">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{alert.location}</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {alert.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
