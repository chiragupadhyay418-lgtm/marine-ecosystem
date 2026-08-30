import React from 'react';
import { Waves, Wind, CloudRain } from 'lucide-react';

export default function ConditionsCard({ marine = {}, weather = {}, lang = 'en' }) {
  const waveHeight = marine.wave_height || 0;
  const windSpeed = weather.wind_speed || 0;
  const rainfall = weather.rainfall || 0;

  const getWaveStatus = (h) => {
    if (h >= 3.0) return lang === 'hi' ? 'खतरनाक लहरें' : 'Dangerous Swell';
    if (h >= 2.0) return lang === 'hi' ? 'उग्र समुद्र' : 'Rough Waves';
    return lang === 'hi' ? 'शांत समुद्र' : 'Calm Sea';
  };

  const getWindStatus = (s) => {
    if (s >= 40) return lang === 'hi' ? 'तेज आंधी' : 'Strong Gale';
    if (s >= 25) return lang === 'hi' ? 'तेज हवा' : 'Gusty Winds';
    return lang === 'hi' ? 'हल्की हवा' : 'Light Breeze';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {lang === 'hi' ? 'वर्तमान समुद्र स्थिति' : 'Current Sea Conditions'}
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {/* Waves */}
        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-center space-y-1">
          <div className="flex justify-center text-blue-400">
            <Waves className="h-5 w-5" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            {lang === 'hi' ? 'लहरें' : 'Waves'}
          </span>
          <span className="text-xl font-black text-white block">{waveHeight} m</span>
          <span className="text-[10px] font-semibold text-blue-400 block truncate">
            {getWaveStatus(waveHeight)}
          </span>
        </div>

        {/* Wind */}
        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-center space-y-1">
          <div className="flex justify-center text-cyan-400">
            <Wind className="h-5 w-5" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            {lang === 'hi' ? 'हवा' : 'Wind'}
          </span>
          <span className="text-xl font-black text-white block">{windSpeed} <span className="text-[10px] font-semibold">km/h</span></span>
          <span className="text-[10px] font-semibold text-cyan-400 block truncate">
            {getWindStatus(windSpeed)}
          </span>
        </div>

        {/* Rain */}
        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-center space-y-1">
          <div className="flex justify-center text-indigo-400">
            <CloudRain className="h-5 w-5" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            {lang === 'hi' ? 'बारिश' : 'Rain'}
          </span>
          <span className="text-xl font-black text-white block">{rainfall} <span className="text-[10px] font-semibold">mm</span></span>
          <span className="text-[10px] font-semibold text-indigo-400 block truncate">
            {rainfall > 50 ? (lang === 'hi' ? 'भारी बारिश' : 'Heavy Rain') : (lang === 'hi' ? 'कम बारिश' : 'Low Rain')}
          </span>
        </div>
      </div>
    </div>
  );
}
