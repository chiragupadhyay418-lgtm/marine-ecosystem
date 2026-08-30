import React from 'react';
import { Wind, CloudRain, Thermometer } from 'lucide-react';

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  const {
    wind_speed = 0,
    wind_direction = 'N',
    rainfall = 0,
    temperature = 0,
    humidity = 0,
  } = weather;

  const getWindStatus = (speed) => {
    if (speed >= 50) return { label: 'Severe Gale', color: 'text-red-400', badge: 'bg-red-500/10 border-red-500/20 text-red-400' };
    if (speed >= 35) return { label: 'Strong Winds', color: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/20 text-orange-400' };
    if (speed >= 20) return { label: 'Moderate Gusts', color: 'text-yellow-400', badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' };
    return { label: 'Light Breeze', color: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' };
  };

  const status = getWindStatus(wind_speed);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all duration-200">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Wind & Weather
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${status.badge}`}>
            {status.label}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl md:text-4xl font-black tracking-tight text-white">
            {wind_speed}
          </span>
          <span className="text-sm font-semibold text-slate-400">km/h</span>
          <span className="text-xs font-bold text-cyan-400 ml-1">({wind_direction})</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <CloudRain className="h-3.5 w-3.5 text-blue-400" />
          <span>Rain: <strong className="text-slate-200">{rainfall} mm</strong></span>
        </span>
        <span className="flex items-center gap-1">
          <Thermometer className="h-3.5 w-3.5 text-amber-400" />
          <span>Temp: <strong className="text-slate-200">{temperature}°C</strong></span>
        </span>
      </div>
    </div>
  );
}
