import React from 'react';
import { Waves, Wind, CloudRain, Fish, AlertTriangle } from 'lucide-react';

export default function MetricTile({ region }) {
  if (!region) return null;

  const { marine = {}, weather = {}, pfz = {}, risk = {} } = region;
  const isRiskHigh = ['CRITICAL', 'HIGH'].includes((risk.level || '').toUpperCase());

  // Wave condition label
  const getWaveText = (h) => {
    if (h >= 3.0) return { text: 'Dangerous Swell', color: 'text-red-400' };
    if (h >= 2.0) return { text: 'Rough Waves', color: 'text-amber-400' };
    if (h >= 1.2) return { text: 'Moderate Waves', color: 'text-yellow-400' };
    return { text: 'Calm Sea', color: 'text-emerald-400' };
  };

  // Wind condition label
  const getWindText = (s) => {
    if (s >= 40) return { text: 'Strong Gale', color: 'text-red-400' };
    if (s >= 25) return { text: 'Gusty Winds', color: 'text-amber-400' };
    return { text: 'Light Breeze', color: 'text-emerald-400' };
  };

  const waveInfo = getWaveText(marine.wave_height || 0);
  const windInfo = getWindText(weather.wind_speed || 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 1. Waves Tile */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Waves className="h-4 w-4 text-blue-400" />
            <span>Wave Height</span>
          </span>
          <span className={`text-[10px] font-bold ${waveInfo.color}`}>
            {waveInfo.text}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white">{marine.wave_height || 0}</span>
          <span className="text-xs font-bold text-slate-400">meters</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Period: {marine.wave_period || 0} seconds</p>
      </div>

      {/* 2. Wind Tile */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wind className="h-4 w-4 text-cyan-400" />
            <span>Wind Speed</span>
          </span>
          <span className={`text-[10px] font-bold ${windInfo.color}`}>
            {windInfo.text}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white">{weather.wind_speed || 0}</span>
          <span className="text-xs font-bold text-slate-400">km/h</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Direction: {weather.wind_direction || 'N'}</p>
      </div>

      {/* 3. Rain Tile */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CloudRain className="h-4 w-4 text-indigo-400" />
            <span>Rain Risk</span>
          </span>
          <span className="text-[10px] font-bold text-slate-300">
            {weather.rainfall > 50 ? 'Heavy Rain' : weather.rainfall > 20 ? 'Moderate' : 'Low Rain'}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white">{weather.rainfall || 0}</span>
          <span className="text-xs font-bold text-slate-400">mm</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Humidity: {weather.humidity || 0}%</p>
      </div>

      {/* 4. Fishing Zone Spot Tile */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Fish className="h-4 w-4 text-teal-400" />
            <span>Fish Spot</span>
          </span>
          <span className="text-[10px] font-bold text-teal-400">
            {pfz.suitability || 'MEDIUM'}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white">{pfz.distance_km || 0}</span>
          <span className="text-xs font-bold text-slate-400">km away</span>
        </div>
        <p className={`text-[10px] font-semibold mt-1 ${isRiskHigh ? 'text-red-400' : 'text-emerald-400'}`}>
          {isRiskHigh ? '⚠️ Sea too rough to harvest' : '✓ Safe navigation path'}
        </p>
      </div>
    </div>
  );
}
